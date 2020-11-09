import PluginsRepository from './PluginsRepository';

export interface IPluginsStore {
  /** The default plugins */
  default: PluginsRepository;

  /** The user defined plugins */
  user: PluginsRepository;
}
