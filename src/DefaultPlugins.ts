import { IPlugin } from './types/Plugin';
import plugins from './plugins';
import PluginsRepository from './types/PluginsRepository';

/** The default plugins */
const DefaultPlugins = (): PluginsRepository =>
  new Map(
    plugins.map<[string, IPlugin]>((plugin) => [plugin.constructorName, plugin]),
  );

export default DefaultPlugins;
