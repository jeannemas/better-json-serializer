import { PluginBigInt } from './BigInt';
import { PluginMap } from './Map';
import { PluginRegExp } from './RegExp';
import { PluginSet } from './Set';
import { PluginUndefined } from './undefined';

export { PluginBigInt, PluginMap, PluginRegExp, PluginSet, PluginUndefined };
export default new Set([PluginBigInt, PluginMap, PluginRegExp, PluginSet, PluginUndefined]);
