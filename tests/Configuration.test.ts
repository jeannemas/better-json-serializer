import { expect } from 'chai';
import BetterJSONSerializer from '../src';
import { shouldNotThrow } from '../src/helpers';

describe('Configuration tests', function () {
  it('Set config for unknown property throw ReferenceError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Assert
    expect(() => serializer.setConfig('foo', 'bar')).to.throw(ReferenceError);
  });

  it('Set config for invalid type on property throw TypeError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Assert
    expect(() => serializer.setConfig('defaultIndentation', '2')).to.throw(TypeError);
  });

  it('Set valid config does not throw', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Assert
    expect(() => serializer.setConfig('defaultIndentation', 2)).to.satisfy(shouldNotThrow);
  });

  it('Set valid config update config object', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const configProp = 'defaultIndentation';

    // Act
    serializer.setConfig(configProp, 0);
    const originalVal = serializer.getConfig(configProp);
    serializer.setConfig(configProp, 2);
    const updatedVal = serializer.getConfig(configProp);

    // Assert
    expect(originalVal).to.not.be.equal(updatedVal);
  });

  it('Get config with undefined parameter return whole config', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const config = serializer.getConfig();

    // Assert
    expect(config).to.be.a('object');
  });

  it('Get unknown config property throw ReferenceError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Assert
    expect(() => serializer.getConfig('foo')).to.throw(ReferenceError);
  });

  it('Get valid config property return value', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const key = 'serializedObjectIdentifier';
    const value = 'A serialized object key identifier';

    // Act
    serializer.setConfig(key, value);
    const configVal = serializer.getConfig(key);

    // Assert
    expect(configVal).to.be.equal(value);
  });
});
