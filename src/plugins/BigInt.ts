import { IPlugin } from '../types/Plugin';

type SerializedBigInt = string;

const PluginBigInt: IPlugin = {
  constructorName: 'BigInt',

  /** Serialize the `BigInt` into a `String` */
  serialize: (_key: string, value: bigint): SerializedBigInt => value.toString(),

  /** Deserialize the `String` into a `BigInt` */
  deserialize: (_key: string, value: SerializedBigInt): bigint => BigInt(value),
};

export default PluginBigInt;
