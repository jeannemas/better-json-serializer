import { Plugin } from '../Plugin';

/** A plugin for `Infinity` */
export const PluginInfinity = new Plugin(
  'InfinityPlugin, converts `Infinity` into a serializable string',
  (value) => value === Infinity,
  (): string => 'Infinity',
  (): number => Infinity,
);
