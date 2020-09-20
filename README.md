<p align="center"> <img src="https://raw.githubusercontent.com/Milo123459/vstore/master/assets/Logo.png" width=250 height=450/> </p>


# **VStore** - **The most lenient way of saving data.**

**Written in TypeScript with the power of TSLib**

**FAQ**

> Where is data stored?

Data is stored in a folder named `store` located in the current CWD.

> What's the point?

To make data syncing easy.

> Does it work with TypeScript

It's written in TypeScript, so yes.

**Code examples**

Examples are written in JavaScript

**Setting up stuff**

```js
// Lets require the module!
const VStore = require("vstore");
// Create a store
const Name = new VStore({
  name: `Name`, // Required
  memoryCache: true, // Defaults to false, if you want it enabled, set it as true
  json: true, // Defaults to false, if you want it enabled, set it as true
});
// Note, to actually save data you need to have atleast one of the db methods active.
// you can also use new VStore.VStore, if you realy need too.
```

**Setting data**

```js
const Instance = Name.instance({
  // list your properties here....
  name: `john`, // Grabs type of the property
  sirname: `doe`, // Grabs the type of the property
  fullname: `{name} {sirname}`, // Allows you to replace strings automatically with this.properties, powered by cjays
}); // properties are optional
const Model = Instance.create({
  name: `peter`,
  sirname: `jeff`,
});
// If you don't specify something when creating the model, it will default to the value. Example is when you add name and sirname but not fullname, fullname would be: 'peter jeff'

const Model2 = Instance.create(); // The properties on this would be:
/**
 * name: 'john',
 * sirname: 'doe',
 * fullname: 'john doe'
 *
 */

const Model3 = Instance.create({
  MyCustomProperty: `this isn't listed in the instance`,
});
// Properties on this would be:
/**
 * name: 'john',
 * sirname: 'doe',
 * fullname: 'john doe',
 * MyCustomProperty: 'this isn't listed in the instance'
 */
});
```

**Features**

- Temporary JSON storage in the `store` directory
- Memory cache

**Search data**

```js
Name.searchByID("id-goes-here"); // by id
Name.search({ fullname: 'john doe' }); // returns an array of items containing documents with fulllname as johndoe
```

**Dependencies**
[cjays](https://npm.im/cjays)
[tslib](https://npm.im/tslib)
[lodash.defaults](https://npm.im/lodash.defaults)

**Examples**

You can find examples in the github repositors, in the examples directory.
