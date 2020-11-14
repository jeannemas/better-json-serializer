import Plugin from '../Plugin';

/** A plugin for `Date` */
export default new Plugin(
  'Date',
  (_key: string, value: Date): number => value.getTime(),
  (_key: string, value: number): Date => new Date(value),
);
