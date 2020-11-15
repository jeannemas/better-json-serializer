import { expect } from 'chai';
import BetterJSONSerializer from '../src';

describe('Stringify tests', function () {
  it('Stringify should return a string', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const object = { foo: 'bar' };

    // Act
    const serializedObject = serializer.stringify(object);

    // Assert
    expect(object).to.be.a('object');
    expect(serializedObject).to.be.a('string');
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
