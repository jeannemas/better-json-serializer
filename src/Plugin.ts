type SerializeFunction = (key: string, value: unknown) => unknown;
type DeserializeFunction = (key: string, value: unknown) => unknown;

export { SerializeFunction, DeserializeFunction };

export class Plugin {
  /** The name of the constructor that the plugin use */
  public name: string;

  /**
   * The function that will be called on an object
   * to transform it into a standardized object.
   *
   * @param key - The key associated with this object.
   * @param value - The object to transform into a standardized object.
   *
   * @returns A standardized object.
   */
  public serialize: SerializeFunction;

  /**
   * The function that will be called on the standardized object
   * to convert it into the original version.
   *
   * @param key - The key associated with this object.
   * @param value - The standardized object to convert.
   *
   * @returns The original object.
   */
  public deserialize: DeserializeFunction;

  public constructor(name: string, serialize: SerializeFunction, deserialize: DeserializeFunction) {
    this.name = name;

    this.serialize = serialize;

    this.deserialize = deserialize;
  }
}
