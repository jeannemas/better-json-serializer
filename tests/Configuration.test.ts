import { expect } from 'chai';
import BetterJSONSerializer from '../src';
import { shouldNotThrow } from '../src/helpers';

describe('Configuration tests', function () {
  it('Set config for unknown property throw ReferenceError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const func = () => {
      serializer.config['foo'] = 'bar' as any;
    };

    // Assert
    expect(func).to.throw(ReferenceError);
  });

  it('Set config for invalid type on property throw TypeError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const func = () => {
      serializer.config.serializedObjectIdentifier = class {} as any;
    };

    // Assert
    expect(func).to.throw(TypeError);
  });

  it('Set valid config does not throw', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const func = () => {
      serializer.config.serializedObjectIdentifier = 'Foo bar baz';
    };

    // Assert
    expect(func).to.satisfy(shouldNotThrow);
  });

  it('Set valid config update config object', function () {
    // Arrange
    const serializer = new BetterJSONSerializer({ serializedObjectIdentifier: 'Foo' });

    // Act
    const originalVal = serializer.config.serializedObjectIdentifier;
    const updatedVal = (serializer.config.serializedObjectIdentifier = 'bar');

    // Assert
    expect(originalVal).to.not.be.equal(updatedVal);
  });

  it('Get unknown config property throw ReferenceError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const func = () => {
      return serializer.config['foo'];
    };

    // Assert
    expect(func).to.throw(ReferenceError);
  });

  it('Get valid config property return value', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const value = 'A serialized object key identifier';

    // Act
    const configVal = (serializer.config.serializedObjectIdentifier = value);

    // Assert
    expect(configVal).to.be.equal(value);
  });
});
