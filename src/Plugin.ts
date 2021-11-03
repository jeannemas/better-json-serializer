/* eslint-disable @typescript-eslint/no-explicit-any */
export type FinderFunction = (value: any) => boolean;
export type SerializeFunction = (key: string, value: any) => any;
export type DeserializeFunction = (key: string, value: any) => any;
export class Plugin {
  /** The plugin name serving as an identifier */
  readonly #name: string;

  /** The finder function used to identify the value targeted by this plugin */
  readonly #finderFunction: FinderFunction;

  /** The function that will be called on an object to transform it into a standardized one */
  readonly #serializeFunction: SerializeFunction;

  /** The function that will be called on a standardized object to convert it into the original one */
  readonly #deserializeFunction: DeserializeFunction;

  public get name(): string {
    return this.#name;
  }

  public get finder(): FinderFunction {
    return this.#finderFunction;
  }

  public get serialize(): SerializeFunction {
    return this.#serializeFunction;
  }

  public get deserialize(): DeserializeFunction {
    return this.#deserializeFunction;
  }

  public constructor(
    name: string,
    finder: FinderFunction,
    serialize: SerializeFunction,
    deserialize: DeserializeFunction,
  ) {
    this.#name = name;
    this.#finderFunction = finder;
    this.#serializeFunction = serialize;
    this.#deserializeFunction = deserialize;
  }
}
