import { Plugin } from '../Plugin';

type SerializedRegExp = Pick<RegExp, 'source' | 'flags'>;

/** A plugin for `RegExp` */
export const PluginRegExp = new Plugin(
  'RegExpPlugin, converts `RegExp` objects into a serialized object',
  (value) => value instanceof RegExp && value.constructor === RegExp,
  (_key: string, value: RegExp): SerializedRegExp => ({
    source: value.source.replace('\\', '\\\\'),
    flags: value.flags,
  }),
  (_key: string, { source, flags }: SerializedRegExp): RegExp => new RegExp(source, flags),
);
