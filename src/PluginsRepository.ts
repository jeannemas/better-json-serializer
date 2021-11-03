/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHash } from 'crypto';

import { Plugin } from './Plugin';

export class PluginsRepository {
  #plugins: Map<string, Plugin>;

  public constructor() {
    this.#plugins = new Map();
  }

  public add(plugin: Plugin): void {
    this.#plugins.set(this.getIdentifierFromPlugin(plugin), plugin);
  }

  // eslint-disable-next-line class-methods-use-this
  public getIdentifierFromPlugin(plugin: Plugin): string {
    return createHash('SHA256').update(plugin.name).digest('base64');
  }

  public getPluginFromIdentifier(identifier: string): Plugin {
    return this.#plugins.get(identifier);
  }

  *[Symbol.iterator](): Iterator<Plugin> {
    for (const plugin of this.#plugins.values()) {
      yield plugin;
    }
  }
}
