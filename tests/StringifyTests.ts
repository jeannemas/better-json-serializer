import { expect } from 'chai';
import BetterJSONSerializer from '../src';
import { PluginSet } from '../src/plugins';

describe('Stringify tests', function () {
  it('Stringify should return a string', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const set = new Set();

    // Act
    serializer.use(PluginSet);
    const stringifiedSet = serializer.stringify(set);

    // Assert
    expect(set).to.be.instanceOf(Set);
    expect(stringifiedSet).to.be.a('string');
  });

  it('Stringify of native objects should not be changed if no plugins modify them', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const obj = { a: 'foo', bar: 1 };

    // Act
    const serializedObject = serializer.stringify(obj);
    const stringifiedObject = JSON.stringify(obj);

    // Assert
    expect(serializedObject).to.be.equal(stringifiedObject);
  });
});
