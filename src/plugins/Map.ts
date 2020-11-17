import { Plugin } from '../Plugin';

type SerializedMap = Array<[unknown, unknown]>;

/** A plugin for `Map` */
export const PluginMap = new Plugin(
  'Map',
  (_key: string, value: Map<unknown, unknown>): SerializedMap => Array.from(value),
  (_key: string, value: SerializedMap): Map<unknown, unknown> => new Map(value),
);
