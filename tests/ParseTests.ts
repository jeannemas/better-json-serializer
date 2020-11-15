import { expect } from 'chai';
import BetterJSONSerializer from '../src';
import { PluginSet } from '../src/plugins';

describe('Parse tests', function () {
  it('Parse should return the original value', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const set = new Set<number>();

    // Act
    serializer.use(PluginSet);
    set.add(1);
    set.add(20);
    const stringifiedSet = serializer.stringify(set);
    const deserializedSet = serializer.parse<Set<number>>(stringifiedSet);

    // Assert
    expect(set).to.be.instanceOf(Set);
    expect(stringifiedSet).to.be.a('string');
    expect(deserializedSet).to.be.instanceOf(Set);
    expect(Array.from(deserializedSet)).to.have.members(Array.from(set));
  });

  it('Parse of stringified native objects should not be changed if no plugins modify them', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const obj = { a: 'foo', bar: 1 };

    // Act
    const serializedObject = serializer.stringify(obj);
    const stringifiedObject = JSON.stringify(obj);
    const deserializedObject = serializer.parse(serializedObject);
    const parsedObject = JSON.parse(stringifiedObject);

    // Assert
    expect(deserializedObject).to.deep.equal(parsedObject);
  });
});
