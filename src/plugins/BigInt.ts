import { Plugin } from '../Plugin';

/** A plugin for `BigInt` */
export const PluginBigInt = new Plugin(
  'BigIntPlugin, converts `BigInt` objects into usable number as string',
  (value) => typeof value === 'bigint',
  (_key: string, value: BigInt): string => value.toString(),
  (_key: string, value: string): BigInt => BigInt(value),
);
