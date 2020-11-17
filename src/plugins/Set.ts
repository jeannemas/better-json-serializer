import { Plugin } from '../Plugin';

/** A plugin for `Set` */
export const PluginSet = new Plugin(
  'Set',
  (_key: string, value: Set<unknown>): Array<unknown> => Array.from(value),
  (_key: string, value: Array<unknown>): Set<unknown> => new Set(value),
);
