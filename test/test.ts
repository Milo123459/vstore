import VStore from "../src/index";
const Store: VStore = new VStore({
  name: "test",
  json: true,
  memoryCache: true,
});
const stuff = Store.instance({ hello: false, how: "{hello} {gamer}" });
const x = stuff.create({ hello: true, gamer: true });
stuff.create({ hello: true });
const search = Store.search({ hello: true });
