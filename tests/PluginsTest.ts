import { expect } from 'chai';
import BetterJSONSerializer, { createPlugin } from '../src';

describe('Plugins tests', function () {
  it('Adding invalid plugin throw TypeError when throwOnError=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const plugin = { name: '', serialize() {}, deserialize() {} };

    // Act
    serializer.setConfig('throwOnError', true);
    const usePlugin = () => serializer.use(plugin);

    // Assert
    expect(usePlugin).to.throw(TypeError);
  });

  it('Adding invalid plugin return void (undefined) when throwOnError=false', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const plugin = { name: '', serialize() {}, deserialize() {} };

    // Act
    serializer.setConfig('throwOnError', false);
    const rtn = serializer.use(plugin);

    // Assert
    expect(rtn).to.be.undefined;
  });

  it('Adding a plugin for constructor that already exist throw Error when allowPluginsOverwrite=false and throwOnError=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
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

    // Act
    serializer.setConfig('throwOnError', true);
    serializer.use(pluginA);
    const addPlugin = () => serializer.use(pluginB);

    // Assert
    expect(addPlugin).to.throw(Error);
  });

  it('Adding a plugin for constructor that already exist return void (undefined) when allowPluginsOverwrite=false and throwOnError=false', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
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

    // Act
    serializer.setConfig('throwOnError', false);
    serializer.use(pluginA);
    const rtn = serializer.use(pluginB);

    // Assert
    expect(rtn).to.be.undefined;
  });

  it('Adding a plugin for constructor that already exist work as expected when allowPluginsOverwrite=true', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
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

    // Act
    serializer.setConfig('throwOnError', true);
    serializer.setConfig('allowPluginsOverwrite', true);
    serializer.use(pluginA);
    serializer.use(pluginB);
  });

  it('Adding a plugin work as expected', function () {
    // Arrange
    const serializer = new BetterJSONSerializer();
    const plugin = createPlugin(
      'Bar',
      () => {},
      () => {},
    );

    // Act
    serializer.use(plugin);
  });
});
