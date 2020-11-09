/**
 * An interface representing a plugin,
 * used to serialize and deserialize a non-standard object.
 *
 * @interface
 *
 * @author Mas Paul-Louis
 */
export interface IPlugin {
  /** The name of the constructor that the plugin use */
  constructorName: string;

  /**
   * The function that will be called on an object
   * to transform it into a standardized object.
   *
   * @param key - The key associated with this object.
   * @param value - The object to transform into a standardized object.
   *
   * @returns A standardized object.
   */
  serialize(key: string, value: unknown): unknown;

  /**
   * The function that will be called on the standardized object
   * to convert it into the original version.
   *
   * @param key - The key associated with this object.
   * @param value - The standardized object to convert.
   *
   * @returns The original object.
   */
  deserialize(key: string, value: unknown): unknown;
}
