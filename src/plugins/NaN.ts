import { Plugin } from '../Plugin';

/** A plugin for `NaN` */
export const PluginNaN = new Plugin(
  'NaNPlugin, converts `NaN` into a serializable string',
  (value) => Number.isNaN(value),
  (): string => 'NaN',
  (): number => NaN,
);
