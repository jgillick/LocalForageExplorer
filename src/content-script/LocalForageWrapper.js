/**
 * Create a simplified
 */
export default class LocalForageWrapper {
  localforage = null;

  constructor() {
    // Get default localforage instance
    this.localforage = window.localforage || require("localforage");

    if (!this.localforage) {
      throw new Error('Cannot load localForage.')
    }

    // For local debugging
    if (process.env.WEB_SERVER && !window.localforage) {
      window.localforage = this.localforage;
    }
  }

  /**
   * Get a localforage storage instance.
   * @param {String} name - (optional) The name of the localForage storage instance to pull from.
   */
  getInstance(name = null) {
    if (name) {
      return this.localforage.createInstance({ name });
    }
    return this.localforage
  }

  /**
   * Get a list of custom localforage instance names.
   * @returns {String[]} Array of custom instance names.
   */
  getCustomInstances() {
    const data = localStorage.getItem('localForageExplorerInstances') || '[]';
    return JSON.parse(data);
  }

  /**
   * Add a new localforage instance.
   * @param {String} name - The name for this instance.
   */
  createCustomInstance(name) {
    const instances = this.getCustomInstances();
    const exists = instances.find((i) => i.toLowerCase() === name.toLowerCase());
    if (exists) {
      return name;
    }

    this.localforage.createInstance({ name });

    instances.push(name);
    instances.sort();
    localStorage.setItem('localForageExplorerInstances', JSON.stringify(instances));

    return name;
  }

  /**
   * Remove a localforage instance
   * @param {String} instanceName - (optional) The name of the localForage storage instance to drop.
   */
  dropInstance(instanceName) {
    if (instanceName) {
      return this.localforage.dropInstance({ name: instanceName });
    }
    return this.localforage.dropInstance();
  }

  /**
   * Get all the data from a localforage store
   * @param {String} instanceName - (optional) The name of the localForage storage instance to use.
   * @yields {Object}
   */
  getData(instanceName=null) {
    const store = this.getInstance(instanceName);
    const data = {};
    return store
      .iterate((value, key) => {
        data[key] = value
      })
      .then(() => data);
  }

  /**
   * Set an item in localforage.
   * @param {String} key - The key of the item.
   * @param {String} value - The value of the item.
   * @param {String} instanceName - (optional) The name of the localForage storage instance to use.
   */
  setItem(key, value, instanceName=null) {
    const store = this.getInstance(instanceName);

    let useValue = value;
    try {
      useValue = JSON.parse(value);
    } catch (e) {}

    // Attempt to parse the value
    return store.setItem(key, useValue)
  }

  /**
   * Remove an item from localforage.
   * @param {String} key - The key of the item to remove.
   * @param {String} instanceName - (optional) The name of the localForage storage instance to use.
   */
  removeItem(key, instanceName) {
    const store = this.getInstance(instanceName);
    return store.removeItem(key)
  }

  /**
   * Clear all the data out of a localforage instance
   * @param {String} instanceName - (optional) The name of the localForage storage instance to use.
   */
  clear(instanceName) {
    const store = this.getInstance(instanceName);
    return store.clear()
  }
}
