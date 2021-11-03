/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from '../Plugin';

type SetValue<S extends Set<any>> = S extends Set<infer V> ? V : never;
type SerializedSet<S extends Set<any>> = Array<SetValue<S>>;

/** A plugin for `Set` */
export const PluginSet = new Plugin(
  'SetPlugin, converts `Set` objects into an array of values',
  (value) => value instanceof Set && value.constructor === Set,
  <S extends Set<any>>(_key: string, value: S): SerializedSet<S> => Array.from(value),
  <S extends Set<any>>(_key: string, value: SerializedSet<S>): S => new Set(value) as S,
);
