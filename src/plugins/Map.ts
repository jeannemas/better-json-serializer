import { IPlugin } from '../types/Plugin';

type SerializedMap<K = unknown, V = unknown> = Array<[K, V]>;

/** A plugin for `Map` */
const PluginMap: IPlugin = {
  constructorName: 'Map',

  /** Serialize the `Map` into an `Array` */
  serialize: (_key: string, value: Map<unknown, unknown>): SerializedMap<unknown, unknown> =>
    Array.from(value),

  /** Deserialize the `Array` into a `Map` */
  deserialize: (_key: string, value: SerializedMap<unknown, unknown>): Map<unknown, unknown> =>
    new Map(value),
};

export default PluginMap;
