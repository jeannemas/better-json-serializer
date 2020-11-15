import { expect } from 'chai';
import BetterJSONSerializer from '../src';

describe('Configuration tests', function () {
  it('Set config for unknown property throw ReferenceError when throwOnError=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('throwOnError', true);
    const defineUnknownProp = () => serializer.setConfig('foo', 'bar');

    // Assert
    expect(defineUnknownProp).to.throw(ReferenceError);
  });

  it('Set config for unknown property return false when throwOnError=false', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('throwOnError', false);
    const rtn = serializer.setConfig('unknownProperty', 'foo');

    // Assert
    expect(rtn).to.be.false;
  });

  it('Set config for invalid type on property throw TypeError when throwOnError=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('throwOnError', true);
    const definePropWithInvalidType = () => serializer.setConfig('defaultIndentation', '2');

    // Assert
    expect(definePropWithInvalidType).to.throw(TypeError);
  });

  it('Set config for invalid type on property return false when throwOnError=false', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('throwOnError', false);
    const rtn = serializer.setConfig('defaultIndentation', '2');

    // Assert
    expect(rtn).to.be.false;
  });

  it('Set valid config return true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const rtn = serializer.setConfig('throwOnError', false);

    // Assert
    expect(rtn).to.be.true;
  });

  it('Set valid config update config object', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const configProp = 'throwOnError';

    // Act
    serializer.setConfig(configProp, true);
    const originalVal = serializer.getConfig(configProp);
    serializer.setConfig(configProp, false);
    const updatedVal = serializer.getConfig(configProp);

    // Assert
    expect(originalVal).to.be.true;
    expect(updatedVal).to.be.false;
  });

  it('Get config with undefined parameter return whole config', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const config = serializer.getConfig();

    // Assert
    expect(config).to.be.a('object');
  });

  it('Get unknown config property throw ReferenceError when throwOnError=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('throwOnError', true);
    const getUnknownProperty = () => serializer.getConfig('foo');

    // Assert
    expect(getUnknownProperty).to.throw(ReferenceError);
  });

  it('Get unknown config property return undefined when throwOnError=false', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('throwOnError', false);
    const rtn = serializer.getConfig('foo');

    // Assert
    expect(rtn).to.be.undefined;
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
