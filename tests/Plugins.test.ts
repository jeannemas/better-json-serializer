import { expect } from 'chai';
import BetterJSONSerializer, { createPlugin } from '../src';
import { Plugin } from '../src/Plugin';
import { shouldNotThrow } from '../src/helpers';

describe('Plugins tests', function () {
  it('Adding invalid plugin throw TypeError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const plugin = ({} as unknown) as Plugin;

    // Assert
    expect(() => serializer.use(plugin)).to.throw(TypeError);
  });

  it('Adding a valid plugin does not throw', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    class Foo {}

    // Act
    const plugin = createPlugin(
      'Foo test plugin',
      (value) => value instanceof Foo && value.constructor === Foo,
      () => {},
      () => {},
    );

    // Assert
    expect(() => serializer.use(plugin)).to.satisfy(shouldNotThrow);
  });
});
