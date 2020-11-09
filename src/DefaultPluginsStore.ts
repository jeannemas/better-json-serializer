import { IPluginsStore } from './types/PluginsStore';
import DefaultPlugins from './DefaultPlugins';

/** The default plugins store */
const DefaultPluginsStore = (): IPluginsStore => ({
  default: DefaultPlugins(),

  user: new Map(),
});

export default DefaultPluginsStore;
