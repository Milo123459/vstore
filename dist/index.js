"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = exports.VStore = void 0;
const tslib_1 = require("tslib");
const cjays_1 = tslib_1.__importDefault(require("cjays"));
const fs_1 = require("fs");
const path_1 = require("path");
const lodash_defaults_1 = tslib_1.__importDefault(require("lodash.defaults"));
const nanoid_1 = tslib_1.__importDefault(require("nanoid"));
const Cache = new Map();
exports.Cache = Cache;
class Model {
  constructor(props, defaultvalues, ins) {
    this.props = props;
    this.defaults = defaultvalues;
    this.ins = ins;
    this.key = nanoid_1.default.nanoid();
    let product = lodash_defaults_1.default(props, defaultvalues);
    Object.entries(product).map((data) => {
      if (typeof data[1] == "string") {
        product[data[0]] = cjays_1.default(data[1], product);
      }
    });
    this.product = product;
    if (ins.options.memoryCache == true)
      Cache.set(`${ins.options.name}${this.key}`, this.product);
    if (ins.options.json == true) {
      fs_1.writeFileSync(
        path_1.join(
          process.cwd(),
          `store`,
          ins.options.name,
          `${this.key}.json`
        ),
        JSON.stringify(this.product)
      );
    }
  }
}
class Instance {
  constructor(properties, ins) {
    this.properties = properties;
    this.ins = ins;
  }
  create(properties) {
    return new Model(properties, this.properties, this.ins);
  }
}
class VStore {
  constructor(options) {
    this.options = lodash_defaults_1.default(options, {
      json: false,
      memoryCache: false,
    });
    if (this.options.json == true) {
      try {
        fs_1.mkdirSync(path_1.join(process.cwd(), "store"));
        fs_1.mkdirSync(path_1.join(process.cwd(), `store`, this.options.name));
      } catch {}
    }
  }
  instance(properties) {
    if (!properties) properties = {};
    return new Instance(properties, this);
  }
}
exports.VStore = VStore;
exports.default = VStore;
//# sourceMappingURL=index.js.map
