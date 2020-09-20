declare const Cache: Map<string, object>;
interface StoreOptions {
  name: string;
  json?: boolean;
  memoryCache?: boolean;
}
declare class Model {
  private props;
  private defaults;
  private ins;
  private key;
  private deleted;
  private product;
  constructor(props: object, defaultvalues: object, ins: VStore);
}
declare class Instance {
  private properties;
  private ins;
  constructor(properties: object, ins: VStore);
  create(properties: object): Model;
}
declare class VStore {
  options: StoreOptions;
  constructor(options: StoreOptions);
  instance(properties?: object): Instance;
}
export default VStore;
export { StoreOptions, VStore, Cache };
