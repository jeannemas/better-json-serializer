import { Plugin } from '../Plugin';

/** A plugin for `BigInt` */
export const PluginBigInt = new Plugin(
  'BigInt',
  (_key: string, value: bigint): string => value.toString(),
  (_key: string, value: string): bigint => BigInt(value),
);
