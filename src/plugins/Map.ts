/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from '../Plugin';

type MapKey<M extends Map<any, any>> = M extends Map<infer K, any> ? K : never;
type MapValue<M extends Map<any, any>> = M extends Map<any, infer V> ? V : never;
type SerializedMap<M extends Map<any, any>> = Array<[MapKey<M>, MapValue<M>]>;

/** A plugin for `Map` */
export const PluginMap = new Plugin(
  'MapPlugin, converts `Map` objects into an array of [Key, Value] pair',
  (value) => value instanceof Map && value.constructor === Map,
  <M extends Map<any, any>>(_key: string, value: M): SerializedMap<M> => Array.from(value),
  <M extends Map<any, any>>(_key: string, value: SerializedMap<M>): M => new Map(value) as M,
);
