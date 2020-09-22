import { VStore } from "../src/index";
const Store: VStore = new VStore({
  name: "test",
  json: true,
  memoryCache: true,
});
const stuff = Store.instance({ hello: false, how: "{hello} {gamer}" });
const y = stuff.create({ hello: true });
Store.delete({ hello: true }, 0);
y.update({ x: "hi" });
