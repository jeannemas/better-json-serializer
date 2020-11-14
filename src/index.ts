import { IPlugin } from './types/Plugin';
import DefaultConfiguration from './DefaultConfiguration';
import IConfiguration from './types/Configuration';
import { ISerializedObject } from './types/SerializedObject';
import PluginsRepository from './types/PluginsRepository';
import defaultPluginsList from './plugins';

/**
 * A tool that enables to use non-standard types in JSON.
 *
 * @class
 *
 * @author Mas Paul-Louis
 */
class BetterJSONSerializer {
  /** The config used by the serializer */
  private conf = DefaultConfiguration();

  /** The list of plugins used as middlewares by the serializer */
  private plugins: PluginsRepository = new Map();

  // #region .setConfig()

  /**
   * Update the configuration.
   *
   * @param configuration - An object specifying the properties as keys, and the values.
   */
  public setConfig(configuration: Record<string, unknown>): void;
  /**
   * Update the configuration.
   *
   * @param configurationProperty - The configuration property to update.
   * @param value - The new value of the configuration property.
   */
  public setConfig(configurationProperty: string, value: unknown): void;
  public setConfig(
    configurationOrProperty: Record<string, unknown> | string,
    value?: unknown,
  ): void {
    // If the configuration is an object
    if (typeof configurationOrProperty === 'object') {
      // Call the setConfig foreach key/value pair
      Object.entries(configurationOrProperty).forEach(([key, val]) => this.setConfig(key, val));

      return;
    }

    /** The configuration property */
    const key = configurationOrProperty as string;

    // Ensure that the configurationProperty exist in the configuration object
    if (!(key in this.conf)) {
      throw new ReferenceError(`Configuration property '${key}' does not exist.`);
    }

    // Ensure that the value of the configurationProperty is valid
    if (typeof value !== typeof this.conf[key]) {
      throw new TypeError(
        `Invalid type for configuration property '${key}', expected '${typeof this.conf[key]}'.`,
      );
    }

    // Update the configuration
    this.conf[key] = value;
  }

  // #endregion

  // #region .getConfig()

  /**
   * Retrieve the whole configuration object.
   *
   * @returns Return the whole configuration.
   */
  public getConfig(): IConfiguration;
  /**
   * Retrieve a configuration properties.
   *
   * @param configurationProperty - The name of the configuration property.
   *
   * @returns Return the value of the configuration property identified by `configurationProperty`.
   */
  public getConfig(configurationProperty: string): unknown;
  public getConfig(configurationProperty?: string): IConfiguration | unknown {
    // Check if property is 'undefined'
    if (configurationProperty === undefined) {
      // Return the whole configuration
      return { ...this.conf };
    }

    // Ensure that the configurationProperty exist in the configuration object
    if (!(configurationProperty in this.conf)) {
      throw new ReferenceError(`Configuration property '${configurationProperty}' does not exist.`);
    }

    // Return the configuration property value
    return this.conf[configurationProperty];
  }

  // #endregion

  // #region .use()

  /**
   * A function to add a plugin to the list of plugins used by the serializer.
   *
   * @param plugins - The plugin to add.
   */
  public use(plugin: IPlugin): void;
  /**
   * A function to add plugins to the list of plugins used by the serializer.
   *
   * @param plugins - The array of plugins to add.
   */
  public use(plugins: IPlugin[]): void;
  public use(pluginOrPlugins: IPlugin | IPlugin[]): void {
    if (Symbol.iterator in pluginOrPlugins) {
      const plugins = pluginOrPlugins as IPlugin[];

      // Iterate through the plugins to add each of them individually
      Array.from(plugins).forEach((plugin) => this.use(plugin));

      return;
    }

    const plugin = pluginOrPlugins as IPlugin;

    // Ensure the plugin is valid
    if (
      typeof plugin !== 'object' ||
      plugin === null ||
      typeof plugin.constructorName !== 'string' ||
      typeof plugin.serialize !== 'function' ||
      typeof plugin.deserialize !== 'function'
    ) {
      throw new TypeError(
        `The plugin must be an object implementing both the 'serialize' and 'deserialize' functions, and the 'constructorName' property.`,
      );
    }

    if (this.plugins.has(plugin.constructorName) && !this.conf.allowPluginsOverwrite) {
      // A plugin using this constructor name already exist and plugins override is disabled
      throw new Error(
        `Unable to add plugin for '${plugin.constructorName}', a plugin using this constructor name already exist and plugins override is disabled.`,
      );
    }

    this.plugins.set(plugin.constructorName, plugin);
  }

  // #endregion

  // #region .stringify()

  /**
   * Function to serialize an object into a JSON string
   * using the plugins as middlewares to serialize non-standard objects.
   *
   * @param source - The object to serialize.
   * @param space - The number of spaces to use to indent the JSON,
   *   overrides the default value from the configuration.
   *
   * @returns Returns the serialized JSON string.
   */
  public stringify(source: unknown, space: number = this.conf.defaultIndentation): string {
    /** The serialized JSON object */
    let json: string;

    try {
      json = JSON.stringify(
        source,
        (key, value) => {
          /** The name of the constructor of `value` */
          let constructorName: string;
          // Test for special cases
          if (value === undefined) {
            constructorName = 'undefined';
          } else if (value === null) {
            constructorName = 'null';
          } else if (value === Infinity) {
            constructorName = 'infinity';
          } else if (Number.isNaN(value)) {
            constructorName = 'nan';
          } else {
            constructorName = value.constructor.name;
          }

          /** The plugin that should be used */
          const matchingPlugin = this.plugins.get(constructorName);

          // If no plugins matching this constructor has been found, return the raw value
          if (!matchingPlugin) {
            return value;
          }

          /** The serialized value */
          let serializedValue: unknown;

          try {
            // Serialize the object using the plugin
            serializedValue = matchingPlugin.serialize(key, value);
          } catch (error) {
            throw new EvalError(
              `Error while serializing type '${constructorName}'.\n\n${error.message}`,
            );
          }

          // Return the formated serialized object
          return {
            [this.conf.serializedObjectIdentifier]: {
              version: 1,
              type: constructorName,
              value: serializedValue,
            } as ISerializedObject,
          };
        },
        space,
      );
    } catch (error) {
      throw new EvalError(`Error while stringifying object.\n\n${error.message}`);
    }

    return json;
  }

  // #endregion

  // #region .parse()

  /**
   * Function to deserialize a JSON string into an object.
   * Serialized objects are converted using the plugins as middlewares.
   *
   * @param text - The JSON string to parse.
   *
   * @returns Returns the deserialized object.
   */
  public parse<O = unknown>(text: string): O {
    /** The deserialized object */
    let object: unknown;

    try {
      object = JSON.parse(text, (key, value) => {
        // Check if the value is serialized, if not, returns it as raw
        if (
          typeof value !== 'object' ||
          value === null ||
          !(this.conf.serializedObjectIdentifier in value) ||
          Object.keys(value).length > 1
        ) {
          return value;
        }

        const { version, type: constructorName, value: serializedValue } = value[
          this.conf.serializedObjectIdentifier
        ] as ISerializedObject;

        /** The plugin that should be used */
        const matchingPlugin = this.plugins.get(constructorName);

        // If no plugins matching this constructor has been found, return the raw value
        if (!matchingPlugin) {
          return serializedValue;
        }

        switch (version) {
          case 1: {
            // Standard version, nothing to report

            break;
          }

          default: {
            throw new Error(`Unsupported serialization version '${version}'.`);
          }
        }

        /** The deserialized value */
        let deserializedValue: unknown;

        try {
          deserializedValue = matchingPlugin.deserialize(key, serializedValue);
        } catch (error) {
          throw new EvalError(
            `Error while deserializing type '${constructorName}'.\n\n${error.message}`,
          );
        }

        // Return the formated deserialized object
        return deserializedValue;
      });
    } catch (error) {
      throw new EvalError(`Error while parsing object.\n\n${error.message}`);
    }

    return object as O;
  }

  // #endregion
}

export default BetterJSONSerializer;
export const defaultPlugins = (): IPlugin[] => defaultPluginsList;
