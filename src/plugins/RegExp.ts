import Plugin from '../Plugin';

type SerializedRegExp = {
  source: string;
  flags: string;
};

/** A plugin for `RegExp` */
export default new Plugin(
  'RegExp',
  (_key: string, value: RegExp): SerializedRegExp => ({
    source: value.source.replace('\\', '\\\\'),
    flags: value.flags,
  }),
  (_key: string, { source, flags }: SerializedRegExp): RegExp => new RegExp(source, flags),
);
