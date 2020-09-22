import { VStore } from "../src/index";
const Store: VStore = new VStore({
  name: "test",
  json: true,
  memoryCache: true,
});
const Instance = Store.instance({ user: 123, guild: 213 });
const c = Instance.create({ user: 12345, guild: 55 });
console.log(Store.search({ user: 12345, guild: 535 }))