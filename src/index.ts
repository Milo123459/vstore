import cjays from "cjays";
import { mkdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import defaults from "lodash.defaults";
import nanoid from "nanoid";
import { create } from 'domain';
const Cache: Map<string, object> = new Map();
interface StoreOptions {
  name: string;
  json?: boolean;
  memoryCache?: boolean;
}
const createDir = (path: string) => {
  try {
    mkdirSync(path);
  } catch {
  }
}
class VError extends Error {
  public constructor(...params: string[]) {
    super();
    this.message = params.join(" ");
    this.name = 'VSTORE';
  }
}
class Model {
  private props: object;
  private defaults: object;
  private ins: VStore;
  private key: string;
  private deleted: boolean;
  private product: object;
  private cpy: object;
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
  public update(newParams: object) {
    if(this.deleted == true) throw new VError('DOCUMENT', `ALREADY`, `DELETED`);
    this.cpy = this.product;
    let product: object = defaults(newParams, this.cpy);
    Object.entries(product).map((data) => {
      if (typeof data[1] == "string") {
        product[data[0]] = cjays(data[1], product);
      }
    });
    this.product = product;
    if (this.ins.options.memoryCache == true)
      Cache.set(`${this.ins.options.name}${this.key}`, this.product);
    if (this.ins.options.json == true) {
      writeFileSync(
        join(process.cwd(), `store`, this.ins.options.name, `${this.key}.json`),
        JSON.stringify(this.product)
      );
    }
  }
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
      createDir(join(process.cwd(), "store"));
      createDir(join(process.cwd(), `store`, this.options.name));
    }
  }
  public instance(properties?: object): Instance {
    if (!properties) properties = {};
    return new Instance(properties, this);
  }
}

export default VStore;
export { StoreOptions, VStore, Cache };
