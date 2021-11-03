/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, FinderFunction, DeserializeFunction, SerializeFunction } from './Plugin';
import { PluginsRepository } from './PluginsRepository';

interface Configuration {
  /** The key used to identify a serialized object */
  serializedObjectIdentifier: string;
}
interface SerializedObject {
  /** The constructor name of the non-standardized object */
  type: string;
  /** The standardized object */
  value: any;
}

/** A tool that enables to use non-standard types in JSON. */
export default class BetterJSONSerializer {
  /** The config used by the serializer */
  #configuration: Configuration;

  /** The list of plugins used as middlewares by the serializer */
  #plugins: PluginsRepository;

  /** Get the configuration */
  public get config() {
    return new Proxy(this.#configuration, {
      defineProperty: () => false,
      deleteProperty: () => false,
      get: (target, property) => {
        if (!(property in target)) {
          throw new ReferenceError(
            `Configuration property '${property as string}' does not exist.`,
          );
        }

        return target[property];
      },
      set: (target, property, value) => {
        // Ensure that the property exist in the configuration object
        if (!(property in target)) {
          throw new ReferenceError(
            `Configuration property '${property as string}' does not exist.`,
          );
        }

        const expected = typeof target[property];

        // Ensure that the value of the property is valid
        if (typeof value !== expected) {
          throw new TypeError(
            `Invalid type for configuration property '${
              property as string
            }', expected '${expected}'.`,
          );
        }

        // Update the configuration
        this.#configuration[property] = value;

        return true;
      },
    });
  }

  public constructor(configuration?: Partial<Configuration>) {
    this.#configuration = {
      serializedObjectIdentifier: '@SOID',
    };
    this.#plugins = new PluginsRepository();

    // If configuration is defined
    for (const [key, value] of Object.entries(configuration || {})) {
      this.config[key] = value;
    }
  }

  /**
   * A function to add a plugin to the list of plugins used by the serializer.
   *
   * @param plugins - The plugin to add.
   */
  public use(plugin: Plugin): void;
  /**
   * A function to add plugins to the list of plugins used by the serializer.
   *
   * @param plugins - The array of plugins to add.
   */
  public use(plugins: Plugin[]): void;
  /**
   * A function to add plugins to the list of plugins used by the serializer.
   *
   * @param plugins - A set of plugins to add.
   */
  public use(plugins: Set<Plugin>): void;
  public use(pluginOrPlugins: Plugin | Plugin[] | Set<Plugin>): void {
    if (Symbol.iterator in pluginOrPlugins) {
      // Iterate through the plugins to add each of them individually
      for (const plugin of pluginOrPlugins as Plugin[] | Set<Plugin>) {
        this.use(plugin);
      }

      return;
    }

    const plugin = pluginOrPlugins as Plugin;

    // Ensure the plugin is valid
    if (!(plugin instanceof Plugin)) {
      throw new TypeError(`The plugin is invalid.`);
    }

    this.#plugins.add(plugin);
  }

  /**
   * Function to serialize an object into a JSON string
   * using the plugins as middlewares to serialize non-standard objects.
   *
   * @param value - The object to serialize.
   * @param replacer - The replacer function that alters the behavior of the serialization process.
   * @param space - The number of spaces to use to indent the JSON,
   *                overrides the default value from the configuration.
   *
   * @returns Returns the serialized JSON string.
   */
  public stringify<O = any>(
    value: O,
    replacer: ((key: string, value: any) => any) | null = null,
    space = 0,
  ): string {
    const { serializedObjectIdentifier } = this.#configuration;

    return JSON.stringify(
      value,
      (key, val) => {
        // Use the replacer function on the raw calue if provided
        const source = replacer ? replacer.call(undefined, key, val) : val;

        for (const plugin of this.#plugins) {
          if (plugin.finder.call(undefined, source)) {
            // Serialize the object using the plugin
            const serializedValue = plugin.serialize.call(undefined, key, source);
            const serializedObject: SerializedObject = {
              type: this.#plugins.getIdentifierFromPlugin(plugin),
              value: serializedValue,
            };

            // Return the formated serialized object
            return { [serializedObjectIdentifier]: serializedObject };
          }
        }

        return source;
      },
      space,
    );
  }

  /**
   * Function to deserialize a JSON string into an object.
   * Serialized objects are converted using the plugins as middlewares.
   *
   * @param text - The JSON string to parse.
   * @param reviver - A function that will be called on each value before returning it.
   *
   * @returns Returns the deserialized object.
   */
  public parse<O = any>(text: string, reviver: (key: string, value: any) => any = null): O {
    /** The serialized object identifier */
    const { serializedObjectIdentifier } = this.#configuration;

    return JSON.parse(text, (key, value) => {
      // Check if the value is serialized, if not, return it as raw
      if (typeof value !== 'object' || value === null || !(serializedObjectIdentifier in value)) {
        return value;
      }

      const serializedObject = value[serializedObjectIdentifier] as SerializedObject;
      const { type: pluginIdentifier, value: serializedValue } = serializedObject;
      /** The plugin that should be used */
      const matchingPlugin = this.#plugins.getPluginFromIdentifier(pluginIdentifier);

      // If no plugins matching this constructor has been found, return the raw value
      if (!matchingPlugin) {
        return serializedValue;
      }

      /** The deserialized value */
      const deserializedValue = matchingPlugin.deserialize.call(undefined, key, serializedValue);

      // Use the reviver function on the value if provided
      return reviver ? reviver.call(undefined, key, deserializedValue) : deserializedValue;
    }) as O;
  }
}

/**
 * Create a new plugin.
 *
 * @param name - The plugin name serving as an identifier
 * @param finderFunction - The finder function used to identify the value targeted by the plugin.
 * @param serializeFunction - The function that will be called on an object
 *                            to transform it into a standardized one.
 * @param deserializeFunction - The function that will be called on a standardized object
 *                              to convert it into the original one.
 */
export const createPlugin = (
  name: string,
  finderFunction: FinderFunction,
  serializeFunction: SerializeFunction,
  deserializeFunction: DeserializeFunction,
): Plugin => {
  if (typeof name !== 'string') {
    throw new TypeError('The name ');
  }

  if (typeof finderFunction !== 'function') {
    throw new TypeError('The constructor for the plugin must be a constructor function.');
  }

  if (typeof serializeFunction !== 'function') {
    throw new TypeError('The serialize property must be a function.');
  }

  if (typeof deserializeFunction !== 'function') {
    throw new TypeError('The deserialize property must be a function.');
  }

  return new Plugin(name, finderFunction, serializeFunction, deserializeFunction);
};
