import cjays from "cjays";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join, toNamespacedPath } from "path";
import defaults from "lodash.defaults";
import nanoid from "nanoid";
import { create } from "domain";
const Cache: Map<string, object> = new Map();
interface StoreOptions {
  name: string;
  json?: boolean;
  memoryCache?: boolean;
}
interface SearchStuff {
  [key: string]: any;
  _: {
    key: string;
  };
}
const createDir = (path: string) => {
  try {
    mkdirSync(path);
  } catch {}
};
class VError extends Error {
  public constructor(...params: string[]) {
    super();
    this.message = params.join(" ");
    this.name = "VSTORE";
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
    if (ins.options.memoryCache == true) Cache.set(`${this.key}`, this.product);
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
  }
  public update(newParams: object) {
    if (this.deleted == true)
      throw new VError("DOCUMENT", `ALREADY`, `DELETED`);
    this.cpy = this.product;
    let product: object = defaults(newParams, this.cpy);
    Object.entries(product).map((data) => {
      if (typeof data[1] == "string") {
        product[data[0]] = cjays(data[1], product);
      }
    });
    this.product = product;
    if (this.ins.options.memoryCache == true)
      Cache.set(`${this.key}`, this.product);
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
  public search(props: object): {} {
    const res: Array<unknown> = [];
    if (this.options.memoryCache == true) {
      const cacheArray = [...Cache];
      const entries = Object.entries(props);
      cacheArray.filter((d) => {
        const prop = d[1];
        entries.map((entri) => {
          if (!!(prop[entri[0]] && prop[entri[0]] == entri[1]))
            return res.push({ ...d[1], _: { key: d[0] } });
        });
      });
    } else if (this.options.json == true && this.options.memoryCache == false) {
      const fileArray = [
        ...readdirSync(
          join(process.cwd(), `store`, this.options.name)
        ).map((d) => [
          d.split(".json")[0],
          JSON.parse(
            readFileSync(
              join(process.cwd(), `store`, this.options.name, d)
            ).toString()
          ),
        ]),
      ];
      if (Object.entries(props).length == 0) {
        return fileArray.map((cache) => {
          res.push({ ...cache[1], _: { key: cache[0] } });
        });
      }
      const entries = Object.entries(props);
      fileArray.filter((d) => {
        const prop = d[1];
        entries.map((entri) => {
          if (!!(prop[entri[0]] && prop[entri[0]] == entri[1]))
            return res.push({ ...d[1], _: { key: d[0] } });
        });
      });
    }
    return res;
  }
  public delete(searchData: object, index?: number) {
    if (!index) index = 0;
    const d: SearchStuff = this.search(searchData)[index];
    if (this.options.json == true)
      unlinkSync(
        join(process.cwd(), `store`, this.options.name, d._.key + ".json")
      );
    if (this.options.memoryCache == true) Cache.delete(d._.key);
  }
}
export { VStore };