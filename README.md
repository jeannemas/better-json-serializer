# Better JSON Serializer

A tool that enables to use non-standard types in JSON (such as Sets, Maps, etc).

```javascript
const BetterJSONSerializer = require('better-json-serializer').default;

const serializer = new BetterJSONSerializer();

const obj = {
  a: new Set([1, 2, false, 'b', null]),
};

console.log(obj.a.constructor.name); // ==> 'Set'
console.log(obj.a); // ==> Set(5) { 1, 2, false, 'b', null }

const str = serializer.stringify(obj);

console.log(typeof str); // ==> 'string'

const secondObj = serializer.parse(str);

console.log(secondObj.a.constructor.name); // ==> 'Set'
console.log(secondObj.a); // ==> Set(5) { 1, 2, false, 'b', null }
```

## Installation

```shell
$ npm install better-json-serializer
```

## Features

- No external dependencies
- Support for any kind of non-standard object
- Minimal setup required
- Easy to implement

## Usage

```javascript
// Import the class
const BetterJSONSerializer = require('better-json-serializer').default;

// Create an instance
const serializer = new BetterJSONSerializer();

// Configure it (if needed)
serializer.setConfig('serializedObjectIdentifier', '_@serialized-object'); // Default value

// Start using it
const str = serializer.stringify(new Date()); // ==> A string
const obj = serializer.parse(str); // ==> A date object
```

## Configuration

#### Configuration properties

| Configuration property       | Type      | Default value         | Description                                                                                                                                      |
| :--------------------------- | :-------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowPluginsOverwrite`      | `Boolean` | `false`               | Whether or not plugins can be overwrite by another one specifying the same constructor name                                                      |
| `serializedObjectIdentifier` | `String`  | `_@serialized-object` | The default key to use to identify a serialized object<br /><br />Modify with **caution** as it can possibly indentify incorrectly other objects |
| `defaultIndentation`         | `Number`  | `2`                   | The default indentation to use to indent the JSON                                                                                                |
| `allowUseOfDefaultPlugins`   | `Boolean` | `true`                | Whether or not the serializer can use the default plugins                                                                                        |

#### Getting the configuration

The configuration can be accessed using the `.getConfig` method on the instance of the serializer.

```javascript
const serializer = new BetterJSONSerializer();

// Retrieve the whole configuration
console.log(serializer.getConfig());

// Retrieve only a single configuration property
console.log(serializer.getConfig('allowPluginsOverwrite'));
```

> Trying to get a configuration property that does not exist will throw a `ReferenceError` error.

#### Updating the configuration

Configuration properties can be updated using the `.setConfig` method on the instance of the serializer.

```javascript
const serializer = new BetterJSONSerializer();

// Update a single configuration property
serializer.setConfig('allowPluginsOverwrite', true);

// Update multiple configuration properties at a time
serializer.setConfig({
  allowPluginsOverwrite: true,
  defaultIndentation: 2,
});
```

> While configuring a property, the correct type must be used, else a `TypeError` error will be thrown.

> A `ReferenceError` error will be thrown if you try to define a configuration property that does not exist, as the configuration is not available to the plugins.

## Extend with plugins

The package come with default plugins installed for those objects:

- `BigInt`
- `Date`
- `Map`
- `RegExp`
- `Set`

But you can always extend the package by providing your own plugin using the `.use` method on the serializer with the plugin.
To define a plugin, simply create an object with the following properties:

- `constructorName` The name of the constructor used by the plugin
- `serialize` A function that will serialize the object (identified by the constructor name). It takes two (2) parameters:

  1. `key` A string that indicate the key associated with this object
  2. `value` The actuel object to serialize

  The returned object will be considered to be standardized and will be used by the native `JSON.stringify` method.

- `deserialize` A function that will deserialized the standardized object into the original one. It takes two (2) parameters:

  1. `key` A string that indicate the key associated with this object
  2. `value` The standardized object after calling the native `JSON.parse` on the JSON string

  The returned object will be considered as the original one and will be returned in the final object.

#### Example

```javascript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
}

const person = new Person('John', 'Doe');

const personPlugin = {
  constructorName: 'Person',
  serialize: (key, value) => ({ ...value }),
  deserialize: (key, value) => Object.assign(Object.create(Person.prototype), value),
};

const serializer = new BetterJSONSerializer();

serializer.use(personPlugin);

const serializedPerson = serializer.stringify(person);
const deserializedPerson = serializer.parse(serializedPerson);

console.log(deserializedPerson.getFullName()); // ==> 'John Doe'
```

> It is not recommended (and so, not officially supported) to extend a plugin with more properties than the ones intended to.
> The use of other properties can break at any moment after an update without further notice.
