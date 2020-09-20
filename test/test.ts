import VStore from "../src/index";
const Store: VStore = new VStore({
  name: "fhhh",
  json: true,
  memoryCache: true,
});
const stuff = Store.instance({ hello: false, how: "{hello} {gamer}" });
stuff.create({ hello: true, gamer: true });
