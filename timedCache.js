/**
 * @template K, V
 */
class TimedCache {

  /**
   * The data being stored.
   * @type {Map<K, CachedItem<V>>}
   */
  #data = new Map();

  /**
   * The amount of time the item will be cached for after each access.
   * @type {number}
   */
  #live;

  /**
   * The amount of time the item will be cached for after each access.
   * @type {number}
   */
  get live() {return this.#live;}
  set live(val) {this.#live = Math.max(0, Math.floor(val));}

  /**
   * The interval that the cache will be checked.
   * @type {number}
   */
  #checkTime;

  /**
   * The interval that the cache will be checked.
   * @type {number}
   */
  get checkTime() {return this.#checkTime;}
  set checkTime(val) {
    let time = Math.max(0, Math.floor(val));
    if (time != this.#checkTime) {
      this.#checkTime = time;

      if (this.#checkInterval) {
        clearInterval(this.#checkInterval);
        setInterval(this.#checkItems, this.#checkTime);
      }
    }
  }

  /**
   * The number of items to check on each interval.
   * @type {number}
   */
  #itemsToCheck;

  /**
   * The number of items to check on each interval.
   * @type {number}
   */
  get itemsToCheck() {return this.#itemsToCheck;}
  set itemsToCheck(val) {this.#itemsToCheck = Math.max(1, Math.floor(val));}

  /**
   * Gets the number of items in the cache.
   * @type {number} @readonly
   */
  get length() {return this.#data.size()}

  /**
   * The interval id for checking the items
   */
  #intervalId = undefined;

  /**
   * The checking generator
   * @type {IterableIterator<CachedItem>}
   */
  #checkingGen;

  constructor({live = 3600000, checkTime = 600000, itemsToCheck = 100} = {}) {
    this.itemsToCheck = itemsToCheck;
    this.live = live;
    this.checkTime = checkTime;
    this.#checkingGen = this.#data.entries();
  }

  /**
   * Checks the items in the cache.
   */
  #checkItems() {
    let gen = this.#checkingGen, item, time = Date.now() - this.#live;

    for (let i = this.#itemsToCheck; i > 0; --i) {
      try {
        item = gen.next();
        if (item.value[1].accessed < time) this.#data.delete(item.value[0]);
      } catch {
        // gets a new generator.
        this.#checkingGen = this.#data.entries();

        // if there is nothing else to check clear the interval.
        if (this.#data.size() === 0) {
          clearInterval(this.#intervalId);
          this.#intervalId = undefined;
        }
        break;
      }
    }
  }

  /**
   * Sets or overwrites an item in the cache.
   * @param {K} item The item to set.
   * @param {V} data The data to set.
   */
  set(item, data) {
    let time = Date.now();
    this.#data.set(item, {
      data: data,
      accessed: time,
      added: time
    });

    if (!this.#intervalId) {
      this.#intervalId = setInterval(this.#checkItems, this.#checkTime);
    }
  }

  /**
   * Gets an item that was added to the cache.
   * @param {K} item The item to get
   * @returns {V|undefined} The data that was stored or undefined if it is not found.
   */
  get(item) {
    let data = this.#data.get(item);
    if (data) {
      // updating when the data was accessed.
      data.accessed = Date.now();
      return data.data;
    }

    return undefined;
  }

  /**
   * Removes an item from the cache.
   * @param {K} item The item to remove.
   */
  deleteItem(item) {
    this.#data.delete(item);
  }

  /**
   * Clears the cache of all items.
   */
  clear() {this.#data.clear();}
}

module.exports = TimedCache;

/**
 * @typedef {Object} CacheOptions
 * @property {number} live The amount of time the item will be cached for after each access.
 * @property {number} checkTime The interval that the cache will be checked.
 * @property {number} itemsToCheck The number of items to check on each interval.
 */

/**
 * @template T
 * @typedef {Object} CachedItem
 * @property {T} data The data being stored.
 * @property {number} accessed The last time the item was accessed.
 * @property {number} added The time the the item was added.
 */
