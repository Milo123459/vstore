import cjays from "cjays";
import { mkdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import defaults from "lodash.defaults";
import nanoid from "nanoid";
const Cache: Map<string, object> = new Map();
interface StoreOptions {
  name: string;
  json?: boolean;
  memoryCache?: boolean;
}
class Model {
  private props: object;
  private defaults: object;
  private ins: VStore;
  private key: string;
  private deleted: boolean;
  private product: object;
  public constructor(props: object, defaultvalues: object, ins: VStore) {
    this.props = props;
    this.defaults = defaultvalues;
    this.ins = ins;
    this.key = nanoid.nanoid();
    let product: object = defaults(props, defaultvalues);
    Object.entries(product).map((data) => {
      if (typeof data[1] == "string") {
        product[data[0]] = cjays(data[1], product);
      }
    });
    this.product = product;
    if (ins.options.memoryCache == true)
      Cache.set(`${ins.options.name}${this.key}`, this.product);
    if (ins.options.json == true) {
      writeFileSync(
        join(process.cwd(), `store`, ins.options.name, `${this.key}.json`),
        JSON.stringify(this.product)
      );
    }
  }
  public delete() {
    if (this.ins.options.json == true)
      unlinkSync(
        join(process.cwd(), `store`, this.ins.options.name, `${this.key}.json`)
      );
    if (this.ins.options.memoryCache == true)
      Cache.delete(`${this.ins.options.name}${this.key}`);
    this.deleted = true;
  };
}
class Instance {
  private properties: object;
  private ins: VStore;
  public constructor(properties: object, ins: VStore) {
    this.properties = properties;
    this.ins = ins;
  }
  public create(properties: object): Model {
    return new Model(properties, this.properties, this.ins);
  }
}
class VStore {
  public options: StoreOptions;
  public constructor(options: StoreOptions) {
    this.options = defaults(options, { json: false, memoryCache: false });
    if (this.options.json == true) {
      try {
        mkdirSync(join(process.cwd(), "store"));
        mkdirSync(join(process.cwd(), `store`, this.options.name));
      } catch {}
    }
  }
  public instance(properties?: object): Instance {
    if (!properties) properties = {};
    return new Instance(properties, this);
  }
}

export default VStore;
export { StoreOptions, VStore, Cache };
