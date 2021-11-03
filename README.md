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
- Easily extendable using custom plugins

## Usage

```javascript
// Import the main class
import BetterJSONSerializer from 'better-json-serializer';
// Import any additional default plugins
import { PluginSet } from 'better-json-serializer/plugins';

// Create an instance
const serializer = new BetterJSONSerializer();

// Configure it (if needed)
serializer.config.serializedObjectIdentifier = '_@serialized-object-identifier';

// Load the appropriate plugin(s)
serializer.use(PluginSet);

// Start using it
const str = serializer.stringify(new Set([1, 2, false, 'b', null])); // ==> A string
const obj = serializer.parse(str); // ==> Set(5) { 1, 2, false, 'b', null }
```

## Configuration

#### Configuration properties

| Configuration property       | Type     | Default value | Description                                                                                                                                      |
| :--------------------------- | :------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `serializedObjectIdentifier` | `String` | `'@soid'`     | The default key to use to identify a serialized object<br /><br />Modify with **caution** as it can possibly indentify incorrectly other objects |

#### Accessing the configuration

The configuration can be accessed using the `.config` property on the instance of the serializer.

```javascript
const serializer = new BetterJSONSerializer();

// Retrieve the whole configuration
console.log(serializer.config);

// Retrieve only a single configuration property
console.log(serializer.config.serializedObjectIdentifier);
```

> Trying to get a configuration property that does not exist will throw a `ReferenceError`.

#### Updating the configuration

Configuration properties can be updated by accessing the `.config` property
on the instance of the serializer.

```javascript
const serializer = new BetterJSONSerializer();

// Update a configuration property
serializer.config.serializedObjectIdentifier = 'Foo bar baz';
```

> A `TypeError` will be thrown while trying to configure the property with an invalid type.

> A `ReferenceError` will be thrown
> if you try to define a configuration property that does not exist.

## Using the package

The main use of the package is based on the interface implemented by the `JSON` object.

#### Serializing an object into a string

In order to serialize an object, you need to call the `.stringify` method on the serializer object.

```javascript
const serializer = new BetterJSONSerializer();

serializer.stringify(myObj); // ==> Returns a serialized object as a string
```

##### Parameters

| Order | Parameter  | Type             | Optionnal | Default value | Description                                                      |
| :---- | :--------- | :--------------- | :-------- | :------------ | :--------------------------------------------------------------- |
| 1     | `object`   | Anything         | `false`   |               | The object to serialize                                          |
| 2     | `replacer` | `Function`       | `true`    | `null`        | A function that alters the behavior of the serialization process |
| 3     | `space`    | Positive integer | `true`    | `0`           | The number of spaces to use to indent the JSON (max 10)          |

##### Return

| Type     | Description                       |
| :------- | :-------------------------------- |
| `String` | The serialized object as a string |

#### Deserializing a string into an object

In order to deserialize a JSON string into an object,
you need to call the `.parse` method on the serializer object.

```javascript
const serializer = new BetterJSONSerializer();

serializer.parse(myString); // ==> Returns a deserialized object
```

##### Parameters

| Order | Parameter | Type       | Optionnal | Default value | Description                                                      |
| :---- | :-------- | :--------- | :-------- | :------------ | :--------------------------------------------------------------- |
| 1     | `text`    | `String`   | `false`   |               | The string to deserialize                                        |
| 2     | `reviver` | `Function` | `true`    | `null`        | A function that will be called on each value before returning it |

##### Return

| Type     | Description             |
| :------- | :---------------------- |
| Anything | The deserialized object |

## Extend with plugins

The package is shipped with default plugins for those objects,
however they are not loaded by default:

- `BigInt`
- `Infinity`
- `Map`
- `NaN`
- `RegExp`
- `Set`
- `undefined`

To load a default plugin, simply import it, and then load it as a normal plugin:

```javascript
// Import the main class
import BetterJSONSerializer from 'better-json-serializer';

// Import the plugin for 'Set'
import { PluginSet } from 'better-json-serializer/plugins';

// Create a serializer instance
const serializer = new BetterJSONSerializer();

// Add the plugin
serializer.use(PluginSet);
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

But you can always extend the package by providing your own plugin to the `.use` method on the
serializer. To define a plugin, simply call the `createPlugin` function that comes with the package:

```javascript
createPlugin(pluginName, finderFunction, serializeFunction, deserializeFunction)
```

Both the serializer and deserializer functions accept 2 parameters that are inspired by the
replacer/reviver functions from the `JSON` package:

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

  get fullName() {
    return `${this.firstName}  ${this.lastName}`;
  }
}

const person = new Person('John', 'Doe');

const PersonPlugin = createPlugin(
  'PersonPlugin'
  (value) => value instanceof Person && value.constructor === Person,
  // A function that will serialize the object
  (key, { firstName, lastName }) => ({ firstName, lastName }),
  // A function that will deserialize the serialized object into the original one
  (key, { firstName, lastName }) => Object.assign(Object.create(Person.prototype), {
    firstName,
    lastName,
  }),
);

const serializer = new BetterJSONSerializer();

serializer.use(PersonPlugin);

const serializedPerson = serializer.stringify(person);

console.log(typeof serializedPerson); // ==> 'string'

const deserializedPerson = serializer.parse(serializedPerson);

console.log(deserializedPerson instanceof Person); // ==> true
console.log(deserializedPerson.fullName); // ==> 'John Doe'
```

## Changelog

### `v3.0.0` - November 3th 2021

#### Changes

- Added new built-in plugins for special cases values:
  - `Infinity`
  - `NaN`
  - `undefined`

#### Breaking changes
- Reworked configuration management
  > Configuration is now managed by the `.config` property on the serializer instance.
- Removed `version` property from serialized object.
  > This property was already unused and was taking space on the serialized object making it
  > heavier for nothing.
- Removed built-in plugin for `null`, value will be inserted as native JSON's `null` value.
- Plugins are now middlewares, deferring the roles to them to identify if a value should be
  serialized instead of leaving the job to the serializer
