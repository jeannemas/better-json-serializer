import { expect } from 'chai';
import BetterJSONSerializer, { createPlugin } from '../src';
import { shouldNotThrow } from '../src/helpers';

describe('Plugins tests', function () {
  it('Adding invalid plugin throw TypeError', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const plugin = { name: '', serialize() {}, deserialize() {} };

    // Assert
    expect(() => serializer.use(plugin)).to.throw(TypeError);
  });

  it('Adding a plugin for constructor that already exist throw Error when allowPluginsOverwrite=false', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('allowPluginsOverwrite', false);
    const pluginA = createPlugin(
      'Foo',
      () => {},
      () => {},
    );
    const pluginB = createPlugin(
      'Foo',
      () => {},
      () => {},
    );

    // Assert
    expect(() => serializer.use(pluginA)).to.satisfy(shouldNotThrow);
    expect(() => serializer.use(pluginB)).to.throw(Error);
  });

  it('Adding a plugin for constructor that already exist does not throw when allowPluginsOverwrite=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    serializer.setConfig('allowPluginsOverwrite', true);
    const pluginA = createPlugin(
      'Foo',
      () => {},
      () => {},
    );
    const pluginB = createPlugin(
      'Foo',
      () => {},
      () => {},
    );

    // Assert
    expect(() => serializer.use(pluginA)).to.satisfy(shouldNotThrow);
    expect(() => serializer.use(pluginB)).to.satisfy(shouldNotThrow);
  });

  it('Adding a plugin does not throw', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();

    // Act
    const plugin = createPlugin(
      'Bar',
      () => {},
      () => {},
    );

    // Assert
    expect(() => serializer.use(plugin)).to.satisfy(shouldNotThrow);
  });
});
