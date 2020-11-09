import { IPlugin } from '../types/Plugin';

type SerializedDate = number;

/** A plugin for `Date` */
const PluginDate: IPlugin = {
  constructorName: 'Date',

  /** Serialize the `Date` into a `Number` */
  serialize: (_key: string, value: Date): SerializedDate => value.getTime(),

  /** Deserialize the `Number` into a `Date` */
  deserialize: (_key: string, value: SerializedDate): Date => new Date(value),
};

export default PluginDate;
