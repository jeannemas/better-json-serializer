export interface ISerializedObject {
  /** The serialization version */
  version: number;

  /** The constructor of the non-standardized object */
  type: string;

  /** The standardized object */
  value: unknown;
}
