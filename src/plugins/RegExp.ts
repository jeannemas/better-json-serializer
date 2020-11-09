import { IPlugin } from '../types/Plugin';

type SerializedRegExp = {
  source: string;
  flags: string;
};

/** A plugin for `RegExp` */
const PluginRegExp: IPlugin = {
  constructorName: 'RegExp',

  /** Serialize the `RegExp` into an `Object` */
  serialize: (_key: string, value: RegExp): SerializedRegExp => ({
    source: value.source.replace('\\', '\\\\'),
    flags: value.flags,
  }),

  /** Deserialize the `Object` into a `RegExp` */
  deserialize: (_key: string, value: SerializedRegExp): RegExp =>
    new RegExp(value.source, value.flags),
};

export default PluginRegExp;
