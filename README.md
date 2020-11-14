# Better JSON Serializer

A tool that enables to use non-standard types in JSON (such as Sets, Maps, etc).

```javascript
import BetterJSONSerializer from 'better-json-serializer';
import { PluginSet } from 'better-json-serializer/plugins';

const serializer = new BetterJSONSerializer();

serializer.use(PluginSet);

const obj = {
  a: new Set([1, 2, false, 'b', null]),
};

console.log(obj.a instanceof Set); // ==> true
console.log(obj.a); // ==> Set(5) { 1, 2, false, 'b', null }

const str = serializer.stringify(obj);

console.log(typeof str); // ==> 'string'

const secondObj = serializer.parse(str);

console.log(secondObj.a instanceof Set); // ==> true
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
- Full Typescript support

## Usage

```javascript
// Import the main class
import BetterJSONSerializer from 'better-json-serializer';
import PluginDate from 'better-json-serializer/plugins/Date';

// Create an instance
const serializer = new BetterJSONSerializer();

// Configure it (if needed)
serializer.setConfig('serializedObjectIdentifier', '_@serialized-object'); // Default value

// Load the appropriate plugin
serializer.use(PluginDate);

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

> Trying to get a configuration property that does not exist will throw a `ReferenceError`.

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

> A `TypeError` will be thrown while trying to configure the property with an invalid type.

> A `ReferenceError` will be thrown if you try to define a configuration property that does not exist.

## Using the package

The main use of the package is based on the interface implemented by the `JSON` object.

#### Serializing an object into a string

In order to serialize an object, you need to call the `.stringify` method on the serializer object.

```javascript
const serializer = new BetterJSONSerializer();

serializer.stringify(myObj); // ==> Returns a serialized object as a string
```

##### Parameters

| Order | Parameter  | Type             | Optionnal | Default value                               | Description                                                      |
| :---- | :--------- | :--------------- | :-------- | :------------------------------------------ | :--------------------------------------------------------------- |
| 1     | `object`   | Anything         | `false`   |                                             | The object to serialize                                          |
| 2     | `replacer` | `function`       | `true`    | `null`                                      | A function that alters the behavior of the serialization process |
| 3     | `space`    | Positive integer | `true`    | Configuration property `defaultIndentation` | The nuber of spaces to use to indent the JSON (max 10)           |

##### Return

| Type     | Description                       |
| :------- | :-------------------------------- |
| `String` | The serialized object as a string |

#### Deserializing a string into an object

In order to deserialize a JSON string into an object, you need to call the `.parse` method on the serializer object.

```javascript
const serializer = new BetterJSONSerializer();

serializer.parse(myString); // ==> Returns a deserialized object
```

##### Parameters

| Order | Parameter | Type       | Optionnal | Default value | Description                                                      |
| :---- | :-------- | :--------- | :-------- | :------------ | :--------------------------------------------------------------- |
| 1     | `text`    | `String`   | `false`   |               | The string to deserialize                                        |
| 2     | `reviver` | `function` | `true`    | `null`        | A function that will be called on each value before returning it |

##### Return

| Type     | Description             |
| :------- | :---------------------- |
| Anything | The deserialized object |

## Extend with plugins

The package is shipped with default plugins for those objects, however they are not loaded by default:

- `BigInt`
- `Date`
- `Map`
- `RegExp`
- `Set`

To load a default plugin, simply import it, and then load it as a normal plugin:

```javascript
// Import the main class
import BetterJSONSerializer from 'better-json-serializer';

// Import the plugin for 'Date'
import { PluginDate } from 'better-json-serializer/plugins';

// Create a serializer instance
const serializer = new BetterJSONSerializer();

// Add the plugin
serializer.use(PluginDate);
```

You can also load all the default plugins at once:

```javascript
// Import the main class
import BetterJSONSerializer from 'better-json-serializer';

// Import all the default plugins
import plugins from 'better-json-serializer/plugins';

// Create a serializer instance
const serializer = new BetterJSONSerializer();

// Add the plugins
serializer.use(plugins);
```

But you can always extend the package by providing your own plugin using the `.use` method on the serializer with the plugin.
To define a plugin, simply call the `createPlugin` function that comes with the package: `createPlugin(constructorName, serializeFunction, deserializeFunction)`

Both the serializer and deserializer functions accept 2 parameters:

1. `key` A string that indicate the key associated with this object
2. `value` The actuel object to serialize/deserialize

#### Example

```javascript
// Import the main class and the createPlugin function
import BetterJSONSerializer, { createPlugin } from 'better-json-serializer';

class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return `${this.firstName}  ${this.lastName}`;
  }
}

const person = new Person('John', 'Doe');

const personPlugin = createPlugin(
  Person.name, // The name of the constructor used by the plugin
  (key, value) => ({ ...value }), // A function that will serialize the object
  (key, value) => Object.assign(Object.create(Person.prototype), value), // A function that will deserialize the standardized object into the original one
);

const serializer = new BetterJSONSerializer();

serializer.use(personPlugin);

const serializedPerson = serializer.stringify(person);

console.log(typeof serializedPerson); // ==> 'string'

const deserializedPerson = serializer.parse(serializedPerson);

console.log(deserializedPerson instanceof Person); // ==> true
console.log(deserializedPerson.getFullName()); // ==> 'John Doe'
```
