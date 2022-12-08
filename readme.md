# TimedCache
A timed caching system, where the ttl is reset for an item each time it is accessed.

## Constructor
### TimedCache(options)

Parameters:
- options `TimedCacheOptions` - options for the timed cache
  - live `Number` The amount of time the item will be cached for after each access, in ms. Default: `3600000`
  - checkTime `Number` The interval that the cache will be checked, in ms. Default: `600000`
  - itemsToCheck `Number` The number of items to check on each interval. Default: `100`

## Properties
### `TimedCache.checkTime: Number`

The interval that the cache will be checked, in ms.

### `TimedCache.itemsToCheck: Number`

The number of items to check on each interval.

### `TimedCache.length: Number`
`ReadOnly`

The number of items in the cache.

### `TimedCache.live: Number`

The amount of time the item will be cached for after each access, in ms.

## Methods
### `TimedCache.clear()`
Clears the cache of all items.

### `TimedCache.deleteItem(item: K)`
Removes an item from the cache.

Parameters:
- item `K` The item to remove.

Parameters:
- item `K` The item to set.
- data `V` The data to set.

### `TimedCache.get(item: K): V`
Gets an item from the cache

Parameters
- item `K` The item to fetch.

Returns: `V | undefined` The data that was stored or undefined if it is not found.

### `TimedCache.set(item: K, data: V)`
Sets or overwrites an item in the cache.
