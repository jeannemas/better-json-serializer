export default interface IConfiguration {
  /** Whether plugins can be overwritten by others specifying the same constructor name */
  allowPluginsOverwrite: boolean;

  /** The key used to identify a serialized object */
  serializedObjectIdentifier: string;

  /** The default indentation to use when serializing data */
  defaultIndentation: number;

  /** Whether default plugins can be used by the serializer or not */
  allowUseOfDefaultPlugins: boolean;
}
