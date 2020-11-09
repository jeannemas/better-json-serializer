import { IPlugin } from './types/Plugin';
import DefaultConfiguration from './DefaultConfiguration';
import DefaultPluginsStore from './DefaultPluginsStore';

/**
 * A tool that enables to use non-standard types in JSON.
 *
 * @class
 *
 * @author Mas Paul-Louis
 */
class BetterJSONSerializer {
  /** The config used by the serializer */
  private static configuration = DefaultConfiguration();

  /** The list of plugins used as middlewares by the serializer */
  private static plugins = DefaultPluginsStore();

  /**
   * Configure the serializer.
   *
   * @param configurationProperty - The configuration property to configure.
   * @param value - The value to assign to the configuration property.
   *
   * @returns Returns itself to be able to chain configuration changes.
   */
  public static configure(
    configurationProperty: string,
    value: unknown = undefined,
  ): typeof BetterJSONSerializer | unknown {
    // Ensure that the configurationProperty is a string
    if (typeof configurationProperty !== 'string') {
      throw new TypeError('The configuration property must be a string.');
    }

    // Ensure that the configurationProperty exist in the configuration object
    if (!(configurationProperty in this.configuration)) {
      throw new ReferenceError(`Configuration property '${configurationProperty}' does not exist.`);
    }

    // The current value of the configuration property
    const currentValue = this.configuration[configurationProperty];

    if (typeof value === 'undefined') {
      // Return the current configuration property value
      return currentValue;
    }

    // Ensure that the value of the configurationProperty is valid
    if (typeof value !== typeof currentValue) {
      throw new TypeError(
        `Invalid type for configuration property '${configurationProperty}', expected '${typeof currentValue}'.`,
      );
    }

    // Update the configuration
    this.configuration[configurationProperty] = value;

    // Return the serializer
    return this;
  }

  /**
   * A function to add a plugin to the list of plugins used by the serializer.
   *
   * @param plugin - The actual plugin to add.
   */
  public static use(plugin: IPlugin): void {
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

    if (
      this.plugins.user.has(plugin.constructorName) &&
      !this.configuration.allowPluginsOverwrite
    ) {
      // A plugin using this constructor name already exist and plugins override is disabled
      throw new Error(
        `Unable to add plugin for '${plugin.constructorName}', a plugin using this constructor name already exist and plugins override is disabled.`,
      );
    }

    this.plugins.user.set(plugin.constructorName, plugin);
  }

  /**
   * Function to query a plugin from the constructor name.
   *
   * @param constructorName - The name of the constructor used by the plugin.
   * @param allowUseOfDefaultPlugins - Whether default plugins can be queried or not.
   *   Default to the value in the `allowUseOfDefaultPlugins` configuration.
   *
   * @returns Returns the matching plugin if it exist, or `undefined` if none has been found.
   */
  public static plugin(
    constructorName: string,
    allowUseOfDefaultPlugins: boolean = this.configuration.allowUseOfDefaultPlugins as boolean,
  ): IPlugin | undefined {
    if (typeof constructorName !== 'string') {
      throw new TypeError('The constructor name must be a string.');
    }

    if (typeof allowUseOfDefaultPlugins !== 'boolean') {
      throw new TypeError(`Invalid typeof 'allowUseOfDefaultPlugins', expected 'boolean'.`);
    }

    /** The plugin that macthes the constructor name */
    let matchingPlugin: IPlugin = this.plugins.user.get(constructorName);

    // If no plugins has been found and default plugins can be used
    if (!matchingPlugin && allowUseOfDefaultPlugins) {
      matchingPlugin = this.plugins.default.get(constructorName);
    }

    return matchingPlugin;
  }

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
  public static stringify<C = unknown>(
    source: C,
    space: number = this.configuration.defaultIndentation as number,
  ): string {
    // Ensure the space indentation is a positive number
    if (typeof space !== 'number' || space < 0) {
      throw new TypeError('Invalid typeof space, a positive number is required.');
    }

    /** The serialized JSON object */
    let json: string;

    try {
      json = JSON.stringify(
        source,
        (key, value) => {
          /** The name of the constructor of `value` */
          const constructorName: string =
            value === undefined || value === null ? typeof value : value.constructor.name;

          /** The plugin that should be used */
          const matchingPlugin = this.plugin(constructorName);

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
            throw new EvalError((error as Error).message);
          }

          // Return the formated serialized object
          return {
            [this.configuration.serializedObjectIdentifier as string]: {
              [`${this.configuration.serializedObjectIdentifier}.type`]: constructorName,
              [`${this.configuration.serializedObjectIdentifier}.value`]: serializedValue,
            },
          };
        },
        space,
      );
    } catch (error) {
      throw new EvalError((error as Error).message);
    }

    return json;
  }

  /**
   * Function to deserialize a JSON string into an object.
   * Serialized objects are converted using the plugins as middlewares.
   *
   * @param text - The JSON string to parse.
   *
   * @returns Returns the deserialized object.
   */
  public static parse<O = unknown>(text: string): O {
    // Ensure the JSON string is in fact, a string
    if (typeof text !== 'string') {
      throw new TypeError('The JSON text must be a string.');
    }

    /** The deserialized object */
    let object: unknown;

    try {
      object = JSON.parse(text, (key, value) => {
        // Check if the value is serialized, if not, returns it as raw
        if (
          typeof value !== 'object' ||
          value === null ||
          !((this.configuration.serializedObjectIdentifier as string) in value) ||
          Object.keys(value).length > 1
        ) {
          return value;
        }

        const serializedObject = value[this.configuration.serializedObjectIdentifier as string];
        const constructorName =
          serializedObject[`${this.configuration.serializedObjectIdentifier}.type`];
        const serializedValue =
          serializedObject[`${this.configuration.serializedObjectIdentifier}.value`];

        /** The plugin that should be used */
        const matchingPlugin = this.plugin(constructorName);

        // If no plugins matching this constructor has been found, return the raw value
        if (!matchingPlugin) {
          return serializedValue;
        }

        /** The deserialized value */
        let deserializedValue: unknown;

        try {
          deserializedValue = matchingPlugin.deserialize(key, serializedValue);
        } catch (error) {
          throw new EvalError((error as Error).message);
        }

        // Return the formated deserialized object
        return deserializedValue;
      });
    } catch (error) {
      throw new EvalError((error as Error).message);
    }

    return object as O;
  }
}

export default BetterJSONSerializer;
