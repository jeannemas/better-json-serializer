import IConfiguration from './types/Configuration';

/** The default configuration */
const DefaultConfiguration = (): IConfiguration => ({
  allowPluginsOverwrite: false,

  serializedObjectIdentifier: '_@serialized-object',

  defaultIndentation: 0,

  allowUseOfDefaultPlugins: true,
});

export default DefaultConfiguration;
