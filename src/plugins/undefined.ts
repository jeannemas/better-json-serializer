import { Plugin } from '../Plugin';

/** A plugin for `undefined` */
export const PluginUndefined = new Plugin(
  'undefinedPlugin, converts `undefined` into a serializable string',
  (value) => value === undefined,
  (): string => 'undefined',
  (): undefined => undefined,
);
