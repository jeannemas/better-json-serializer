import { IPlugin } from '../types/Plugin';

type SerializedSet<E = unknown> = Array<E>;

/** A plugin for `Set` */
const PluginSet: IPlugin = {
  constructorName: 'Set',

  /** Serialize the `Set` into an `Array` */
  serialize: (_key: string, value: Set<unknown>): SerializedSet<unknown> => Array.from(value),

  /** Deserialize the `Array` into a `Set` */
  deserialize: (_key: string, value: SerializedSet<unknown>): Set<unknown> => new Set(value),
};

export default PluginSet;
