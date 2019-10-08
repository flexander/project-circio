(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("./modules/engine");
var painter_1 = require("./modules/painter");
var guidePainter_1 = require("./modules/guidePainter");
var storeBlueprint_1 = require("./modules/storeBlueprint");
var backgroundPainter_1 = require("./modules/backgroundPainter");
var panel_1 = require("./modules/controls/panel");
var engine_2 = require("./modules/controls/engine");
var circ_1 = require("./modules/controls/circ");
var guidePainter_2 = require("./modules/controls/guidePainter");
var painter_2 = require("./modules/controls/painter");
var storage_1 = require("./modules/controls/storage");
var storeCloud_1 = require("./modules/storeCloud");
var storeLocal_1 = require("./modules/storeLocal");
var mode_1 = require("./modules/controls/mode");
var canvasArea = document.querySelector('#circio .painter');
var backgroundCanvasElement = canvasArea.querySelector('#background-canvas');
var mainCanvasElement = canvasArea.querySelector('#main-canvas');
var guideCanvasElement = canvasArea.querySelector('#guide-canvas');
var blueprintStorage = new storeBlueprint_1.BlueprintStore();
var storageCloud = new storeCloud_1.default();
var storageLocal = new storeLocal_1.default();
var storageBlueprint = new storeBlueprint_1.BlueprintStore();
var controlMode = window.localStorage.getItem('config.controlMode') || mode_1.ControlModes.MODE_DEFAULT;
var renderControls = function (circ) {
    var controlPanel = new panel_1.default('Engine');
    var engineControl = new engine_2.default(engine, controlMode);
    var circControl = new circ_1.default(circ, controlMode);
    var guidePainterControl = new guidePainter_2.default(guidePainter);
    var painterControl = new painter_2.default(painter);
    var storageControl = new storage_1.default([storageCloud, storageLocal, storageBlueprint], engine);
    var modeControl = new mode_1.ModeControl(controlMode);
    controlPanel.addControl(guidePainterControl);
    controlPanel.addControl(engineControl);
    engineControl.addCircControl(circControl);
    var quickControls = new panel_1.default();
    quickControls.addControls(guidePainterControl.getQuickControls());
    quickControls.addControls(engineControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());
    quickControls.addControls(painterControl.getQuickControls());
    quickControls.addControls(storageControl.getQuickControls());
    quickControls.addControls(modeControl.getQuickControls());
    var controlActionsEl = document.querySelector('.controls-container .actions');
    var controlsEl = document.querySelector('.controls-container .controls');
    controlActionsEl.innerHTML = null;
    controlsEl.innerHTML = null;
    controlActionsEl.appendChild(quickControls.render());
    controlsEl.appendChild(controlPanel.render());
    modeControl.addEventListener('controls.mode', function (newMode) {
        controlMode = newMode;
        window.localStorage.setItem('config.controlMode', newMode);
        renderControls(circ);
    });
};
var initialiseEventListeners = function (circ) {
    circ.addEventListeners(['shape.add', "shape.delete"], function (shape) { return renderControls(circ); });
    circ.addEventListener('change.backgroundFill', function (_) {
        backgroundPainter.draw(circ);
        guidePainter.draw(circ);
    });
    circ.getShapes().forEach(function (shape) {
        shape.brushes.forEach(function (brush) {
            brush.addEventListener('change', function (value) {
                guidePainter.draw(circ);
            });
        });
    });
};
var engine = engine_1.EngineFactory();
var painter = new painter_1.default(mainCanvasElement.getContext("2d"));
var guidePainter = new guidePainter_1.default(guideCanvasElement.getContext("2d"));
var backgroundPainter = new backgroundPainter_1.default(backgroundCanvasElement.getContext("2d"));
engine.addStepCallback(function (circ) { return painter.draw(circ); });
engine.addStepCallback(function (circ) { return guidePainter.draw(circ); });
engine.addResetCallback(function (_) { return painter.clear(); });
engine.addImportCallback(renderControls);
engine.addImportCallback(initialiseEventListeners);
engine.addImportCallback(function (circ) { backgroundPainter.draw(circ); });
engine.play();
blueprintStorage.get('twoCircles')
    .then(function (circ) {
    canvasArea.style.transformOrigin = '0 0'; //scale from top left
    canvasArea.style.transform = 'scale(' + window.innerHeight / circ.height + ')';
    canvasArea.style.width = circ.width + 'px';
    canvasArea.style.height = circ.height + 'px';
    canvasArea.querySelectorAll('canvas').forEach(function (c) {
        c.setAttribute('height', canvasArea.style.height);
        c.setAttribute('width', canvasArea.style.width);
    });
    engine.import(circ);
});

},{"./modules/backgroundPainter":3,"./modules/controls/circ":9,"./modules/controls/engine":10,"./modules/controls/guidePainter":11,"./modules/controls/mode":12,"./modules/controls/painter":13,"./modules/controls/panel":14,"./modules/controls/storage":16,"./modules/engine":17,"./modules/guidePainter":19,"./modules/painter":20,"./modules/storeBlueprint":22,"./modules/storeCloud":23,"./modules/storeLocal":24}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundPainter = /** @class */ (function () {
    function BackgroundPainter(canvasContext) {
        this.canvasCenter = new CanvasCenter();
        this.canvasContext = canvasContext;
    }
    BackgroundPainter.prototype.draw = function (circ) {
        this.centerCanvas(circ);
        this.canvasContext.fillStyle = circ.backgroundFill;
        this.canvasContext.fillRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    BackgroundPainter.prototype.centerCanvas = function (circ) {
        if (this.canvasCenter.x !== (circ.width / 2)) {
            this.canvasContext.translate(-this.canvasCenter.x, 0);
            this.canvasContext.translate((circ.width / 2), 0);
            this.canvasCenter.x = (circ.width / 2);
        }
        if (this.canvasCenter.y !== (circ.height / 2)) {
            this.canvasContext.translate(0, -this.canvasCenter.y);
            this.canvasContext.translate(0, (circ.height / 2));
            this.canvasCenter.y = (circ.height / 2);
        }
    };
    BackgroundPainter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    BackgroundPainter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    return BackgroundPainter;
}());
exports.default = BackgroundPainter;
var CanvasCenter = /** @class */ (function () {
    function CanvasCenter() {
        this.x = 0;
        this.y = 0;
    }
    return CanvasCenter;
}());

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var structure_1 = require("../structure");
var Brush = /** @class */ (function (_super) {
    __extends(Brush, _super);
    function Brush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = new BrushConfig();
        return _this;
    }
    Object.defineProperty(Brush.prototype, "color", {
        get: function () {
            return this.config.color;
        },
        set: function (color) {
            this.config.color = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "transparency", {
        get: function () {
            return this.config.transparency;
        },
        set: function (transparency) {
            this.config.transparency = transparency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "degrees", {
        get: function () {
            return this.config.degrees;
        },
        set: function (degrees) {
            this.config.degrees = degrees;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "draw", {
        get: function () {
            return this.config.draw;
        },
        set: function (draw) {
            this.config.draw = draw;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "link", {
        get: function () {
            return this.config.link;
        },
        set: function (link) {
            this.config.link = link;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "offset", {
        get: function () {
            return this.config.offset;
        },
        set: function (offset) {
            this.config.offset = offset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "point", {
        get: function () {
            return this.config.point;
        },
        set: function (point) {
            this.config.point = point;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "colorWithAlpha", {
        get: function () {
            return this.config.colorWithAlpha;
        },
        enumerable: true,
        configurable: true
    });
    return Brush;
}(structure_1.EventEmitter));
exports.Brush = Brush;
var BrushConfig = /** @class */ (function () {
    function BrushConfig() {
        this.color = '#FFFFFF';
        this.transparency = 0;
        this.degrees = 0;
        this.draw = true;
        this.link = false;
        this.offset = 0;
        this.point = 0.5;
    }
    Object.defineProperty(BrushConfig.prototype, "colorWithAlpha", {
        get: function () {
            return this.color + ('00' + (255 - this.transparency).toString(16)).substr(-2);
        },
        enumerable: true,
        configurable: true
    });
    return BrushConfig;
}());
exports.BrushConfig = BrushConfig;

},{"../structure":25}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var structure_1 = require("../structure");
var events_1 = require("./events");
var Circ = /** @class */ (function (_super) {
    __extends(Circ, _super);
    function Circ() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = new CircConfig();
        _this.shapes = [];
        return _this;
    }
    Circ.prototype.addShape = function (shape) {
        shape.isRoot = (this.shapes.length === 0);
        this.shapes.push(shape);
        this.dispatchEvent(new events_1.ShapeAddEvent(shape));
    };
    Circ.prototype.removeShape = function (id) {
        var _this = this;
        var shapesRemoved = [];
        this.shapes = this.shapes.filter(function (shape) {
            var remove = shape.id !== id;
            if (remove === true) {
                shapesRemoved.push(shape);
            }
            return remove;
        });
        shapesRemoved.forEach(function (shape) {
            _this.dispatchEvent(new events_1.ShapeDeleteEvent(shape));
        });
    };
    Circ.prototype.getShapes = function () {
        return this.shapes;
    };
    Object.defineProperty(Circ.prototype, "name", {
        get: function () {
            return this.config['name'];
        },
        set: function (name) {
            this.config['name'] = name;
            this.dispatchEvent(new events_1.AttributeChangedEvent('name', this.name));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "height", {
        get: function () {
            return this.config.height;
        },
        set: function (height) {
            this.config.height = height;
            this.dispatchEvent(new events_1.AttributeChangedEvent('height', this.height));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "width", {
        get: function () {
            return this.config.width;
        },
        set: function (width) {
            this.config.width = width;
            this.dispatchEvent(new events_1.AttributeChangedEvent('width', this.width));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "backgroundFill", {
        get: function () {
            return this.config.backgroundFill;
        },
        set: function (backgroundFill) {
            this.config.backgroundFill = backgroundFill;
            this.dispatchEvent(new events_1.AttributeChangedEvent('backgroundFill', this.backgroundFill));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "stepsToComplete", {
        get: function () {
            return this.config.stepsToComplete;
        },
        set: function (stepsToComplete) {
            this.config.stepsToComplete = stepsToComplete;
            this.dispatchEvent(new events_1.AttributeChangedEvent('stepsToComplete', this.stepsToComplete));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circ.prototype, "modified", {
        get: function () {
            return this.config.modified;
        },
        enumerable: true,
        configurable: true
    });
    return Circ;
}(structure_1.EventEmitter));
exports.Circ = Circ;
var CircConfig = /** @class */ (function () {
    function CircConfig() {
    }
    return CircConfig;
}());
exports.CircConfig = CircConfig;

},{"../structure":25,"./events":18}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("../structure");
var structure_1 = require("../structure");
var events_1 = require("./events");
var cloneDeep = require('lodash.clonedeep');
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        var _this = _super.call(this) || this;
        _this.brushes = [];
        _this.state = new CircleState();
        _this.config = new CircleConfig();
        _this.id = Math.floor(Math.random() * 100000);
        _this.saveInitialState();
        return _this;
    }
    Circle.prototype.calculatePosition = function (parentCircle) {
        this.savePreviousState();
        var arc = this.getArc();
        var stepCount = this.getStepCount();
        var distanceTravelled = arc * stepCount;
        var arcToParentRadians = 0;
        var parentRadians = parentCircle !== null && this.fixed === true ? parentCircle.state.getAngle() : 0;
        var radiusRelative = 0;
        var parentCentreX = this.state.centre.x;
        var parentCentreY = this.state.centre.y;
        if (parentCircle !== null) {
            parentCentreX = parentCircle.state.centre.x;
            parentCentreY = parentCircle.state.centre.y;
            arcToParentRadians = (distanceTravelled / parentCircle.radius);
            if (this.outside === false) {
                arcToParentRadians *= -1;
            }
            // The distance from center to center of child and parent
            if (this.outside === true) {
                radiusRelative = parentCircle.radius + this.radius;
            }
            else {
                radiusRelative = parentCircle.radius - this.radius;
            }
        }
        this.state.centre.x = parentCentreX + (Math.cos(parentRadians + arcToParentRadians) * radiusRelative);
        this.state.centre.y = parentCentreY + (Math.sin(parentRadians + arcToParentRadians) * radiusRelative);
        // New x1 & y1 to reflect change in radians
        this.state.drawPoint.x = this.state.centre.x + (Math.cos(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
        this.state.drawPoint.y = this.state.centre.y + (Math.sin(parentRadians + arcToParentRadians + this.state.totalAngle) * this.radius);
    };
    Circle.prototype.calculateAngle = function () {
        this.state.previousState.totalAngle = this.state.totalAngle;
        if (this.clockwise === true) {
            this.state.totalAngle += this.getStepRadians();
        }
        else {
            this.state.totalAngle -= this.getStepRadians();
        }
    };
    Circle.prototype.savePreviousState = function () {
        this.state.previousState = cloneDeep(this.state);
        delete this.state.previousState.previousState;
    };
    Circle.prototype.saveInitialState = function () {
        this.state.initialState = cloneDeep(this.state);
    };
    Circle.prototype.getArc = function () {
        if (this.steps === 0) {
            return 0;
        }
        return this.radius * this.getStepRadians();
    };
    Circle.prototype.getStepRadians = function () {
        var stepRadian = 0;
        if (this.steps > 0) {
            stepRadian = (Math.PI * 2) / this.steps;
        }
        return stepRadian;
    };
    Circle.prototype.getStepCount = function () {
        var stepCount = 0;
        if (this.steps > 0) {
            stepCount = this.state.totalAngle / this.getStepRadians();
        }
        return stepCount;
    };
    Circle.prototype.reset = function () {
        this.state = cloneDeep(this.state.initialState);
        // Create a new initial state object
        this.saveInitialState();
    };
    Object.defineProperty(Circle.prototype, "steps", {
        get: function () {
            return this.config.steps;
        },
        set: function (steps) {
            this.config.steps = steps;
            this.dispatchEvent(new events_1.AttributeChangedEvent('steps', this.steps));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "outside", {
        get: function () {
            return this.config.outside;
        },
        set: function (outside) {
            this.config.outside = outside;
            this.dispatchEvent(new events_1.AttributeChangedEvent('outside', this.outside));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "fixed", {
        get: function () {
            return this.config.fixed;
        },
        set: function (fixed) {
            this.config.fixed = fixed;
            this.dispatchEvent(new events_1.AttributeChangedEvent('fixed', this.fixed));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "clockwise", {
        get: function () {
            return this.config.clockwise;
        },
        set: function (clockwise) {
            this.config.clockwise = clockwise;
            this.dispatchEvent(new events_1.AttributeChangedEvent('clockwise', this.clockwise));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "isRoot", {
        get: function () {
            return this.config.isRoot;
        },
        set: function (isRoot) {
            this.config.isRoot = isRoot;
            this.dispatchEvent(new events_1.AttributeChangedEvent('isRoot', this.isRoot));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "stepMod", {
        get: function () {
            return this.config.stepMod;
        },
        set: function (stepMod) {
            this.config.stepMod = stepMod;
            this.dispatchEvent(new events_1.AttributeChangedEvent('stepMod', this.stepMod));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "startAngle", {
        get: function () {
            return this.config.startAngle;
        },
        set: function (startAngle) {
            this.config.startAngle = startAngle;
            this.dispatchEvent(new events_1.AttributeChangedEvent('startAngle', this.startAngle));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () {
            return this.config.radius;
        },
        set: function (radius) {
            this.config.radius = radius;
            this.dispatchEvent(new events_1.AttributeChangedEvent('radius', this.radius));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "modified", {
        get: function () {
            return this.config.modified;
        },
        enumerable: true,
        configurable: true
    });
    return Circle;
}(structure_1.EventEmitter));
exports.Circle = Circle;
var CircleConfig = /** @class */ (function () {
    function CircleConfig() {
    }
    return CircleConfig;
}());
exports.CircleConfig = CircleConfig;
var CircleState = /** @class */ (function () {
    function CircleState() {
        this.centre = new CircleCenterPosition();
        this.drawPoint = new CircleDrawPosition();
        this.initialState = Object.create(this);
        this.previousState = null;
        this.totalAngle = 0;
    }
    CircleState.prototype.getAngle = function () {
        return Math.atan2((this.drawPoint.y - this.centre.y), // Delta Y
        (this.drawPoint.x - this.centre.x) // Delta X
        );
    };
    return CircleState;
}());
exports.CircleState = CircleState;
var CircleCenterPosition = /** @class */ (function () {
    function CircleCenterPosition() {
        this.x = 0;
        this.y = 0;
    }
    return CircleCenterPosition;
}());
exports.CircleCenterPosition = CircleCenterPosition;
var CircleDrawPosition = /** @class */ (function () {
    function CircleDrawPosition() {
    }
    return CircleDrawPosition;
}());
exports.CircleDrawPosition = CircleDrawPosition;

},{"../structure":25,"./events":18,"lodash.clonedeep":1}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundControl = /** @class */ (function () {
    function BackgroundControl(circ) {
        this.circ = circ;
    }
    BackgroundControl.prototype.render = function () {
        var _this = this;
        var backgroundControlHtml = "\n            <div class=\"control control-backgroundFill\">\n                <label>backgroundFill</label>\n                <input type=\"color\" name=\"backgroundFill\" class=\"input\" value=\"" + this.circ.backgroundFill + "\">\n            </div>";
        var backgroundControlFragment = document.createRange().createContextualFragment(backgroundControlHtml);
        backgroundControlFragment.querySelector('input[name="backgroundFill"]').addEventListener('input', function (e) {
            _this.circ.backgroundFill = e.target.value;
        });
        return backgroundControlFragment;
    };
    return BackgroundControl;
}());
exports.default = BackgroundControl;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mode_1 = require("./mode");
var BrushControl = /** @class */ (function () {
    function BrushControl(brush, mode) {
        if (mode === void 0) { mode = mode_1.ControlModes.MODE_DEFAULT; }
        this.brush = brush;
        this.mode = mode;
    }
    BrushControl.prototype.render = function () {
        var html = "\n        <details class=\"control-group\">\n            <summary>Brush</summary>\n            <div class=\"section-body\"></div>\n        </details>";
        var brushFragment = document.createRange().createContextualFragment(html);
        var brushFragmentBody = brushFragment.querySelector('.section-body');
        brushFragmentBody.appendChild(this.makeColourFragment());
        brushFragmentBody.appendChild(this.makeLinkFragment());
        if (this.mode === mode_1.ControlModes.MODE_ADVANCED) {
            brushFragmentBody.appendChild(this.makeTransparencyFragment());
            brushFragmentBody.appendChild(this.makeOffsetFragment());
            brushFragmentBody.appendChild(this.makeAngleFragment());
            brushFragmentBody.appendChild(this.makePointFragment());
        }
        return brushFragment;
    };
    BrushControl.prototype.makeColourFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control control-color\">\n                <label>color</label>\n                <input type=\"color\" name=\"color\" class=\"input\" value=\"" + this.brush.color + "\">\n            </div>";
        var colourFragment = document.createRange().createContextualFragment(html);
        colourFragment.querySelector('input[name="color"]').addEventListener('input', function (e) {
            _this.brush.color = e.target.value;
        });
        return colourFragment;
    };
    BrushControl.prototype.makeTransparencyFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control control-transparency\">\n                <label>transparency</label>\n                <input type=\"range\" min=\"0\" max=\"255\" step=\"10\" name=\"transparency\" class=\"input\" value=\"" + this.brush.transparency + "\">\n            </div>";
        var transparencyFragment = document.createRange().createContextualFragment(html);
        transparencyFragment.querySelector('input[name="transparency"]').addEventListener('input', function (e) {
            _this.brush.transparency = parseInt(e.target.value);
        });
        return transparencyFragment;
    };
    BrushControl.prototype.makeOffsetFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control control-offset\">\n                <label>offset</label>\n                <input type=\"number\" name=\"offset\" class=\"input\" value=\"" + this.brush.offset + "\">\n            </div>";
        var offsetFragment = document.createRange().createContextualFragment(html);
        offsetFragment.querySelector('input[name="offset"]').addEventListener('input', function (e) {
            _this.brush.offset = parseInt(e.target.value, 10);
        });
        return offsetFragment;
    };
    BrushControl.prototype.makeAngleFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control control-degrees\">\n                <label>degrees</label>\n                <input type=\"number\" name=\"degrees\" class=\"input\" value=\"" + this.brush.degrees + "\">\n            </div>";
        var angleFragment = document.createRange().createContextualFragment(html);
        angleFragment.querySelector('input[name="degrees"]').addEventListener('input', function (e) {
            _this.brush.degrees = parseInt(e.target.value, 10);
        });
        return angleFragment;
    };
    BrushControl.prototype.makeLinkFragment = function () {
        var _this = this;
        var linkChecked = (this.brush.link === true) ? 'checked' : '';
        var html = "\n            <div class=\"control control-link\">\n                <label>link</label>\n                <input type=\"checkbox\" name=\"link\" value=\"true\" class=\"input\" " + linkChecked + ">\n            </div>";
        var linkFragment = document.createRange().createContextualFragment(html);
        linkFragment.querySelector('input[name="link"]').addEventListener('input', function (e) {
            _this.brush.link = e.target.checked === true;
        });
        return linkFragment;
    };
    BrushControl.prototype.makePointFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control control-point\">\n                <label>point</label>\n                <input type=\"number\" name=\"point\" min=\"0.5\" step=\"0.5\" class=\"input\" value=\"" + this.brush.point + "\">\n            </div>";
        var pointFragment = document.createRange().createContextualFragment(html);
        pointFragment.querySelector('input[name="point"]').addEventListener('input', function (e) {
            _this.brush.point = parseFloat(e.target.value);
        });
        return pointFragment;
    };
    return BrushControl;
}());
exports.default = BrushControl;

},{"./mode":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = require("../circle");
var background_1 = require("./background");
var panel_1 = require("./panel");
var circle_2 = require("./shapes/circle");
var mode_1 = require("./mode");
var brushes_1 = require("../brushes");
var CircControl = /** @class */ (function () {
    function CircControl(circ, mode) {
        var _this = this;
        if (mode === void 0) { mode = mode_1.ControlModes.MODE_DEFAULT; }
        this.shapeControls = [];
        this.simplified = true;
        this.circ = circ;
        this.mode = mode;
        this.panel = new panel_1.default('Circ: ' + (circ.name || 'Unnamed'));
        this.panel.addControl(new background_1.default(this.circ));
        this.circ.getShapes()
            .forEach(function (shape) {
            var shapeControl;
            if (shape instanceof circle_1.Circle) {
                if (shape.isRoot) {
                }
                shapeControl = new circle_2.default(shape, _this.mode);
            }
            else {
                throw "Unable to render shape: " + typeof shape;
            }
            _this.panel.addControl(shapeControl);
        });
        this.panel.addControl(this.makeAddShapeControl());
    }
    CircControl.prototype.makeAddShapeControl = function () {
        var self = this;
        return new /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.render = function () {
                var addShapeFragmentHtml = "\n                    <button>Add Circle</button>\n                    ";
                var addShapeFragment = document.createRange().createContextualFragment(addShapeFragmentHtml);
                addShapeFragment.querySelector('button').addEventListener('click', function (e) {
                    var newShape = new circle_1.Circle();
                    newShape.steps = 500;
                    newShape.outside = true;
                    newShape.fixed = true;
                    newShape.clockwise = true;
                    newShape.stepMod = 0;
                    newShape.startAngle = 0;
                    newShape.radius = 100;
                    newShape.brushes.push(new brushes_1.Brush());
                    self.circ.addShape(newShape);
                });
                return addShapeFragment;
            };
            return class_1;
        }());
    };
    CircControl.prototype.render = function () {
        var _this = this;
        var panelFragment = this.panel.render();
        panelFragment.querySelector('.control-group').addEventListener('click', function (e) {
            if (e.target.closest('.shapeDelete') === null) {
                return;
            }
            var controlGroupEl = e.target.closest('.control-group');
            var shapeId = parseInt(controlGroupEl.dataset.shapeId);
            _this.circ.removeShape(shapeId);
        });
        return panelFragment;
    };
    return CircControl;
}());
exports.default = CircControl;

},{"../brushes":4,"../circle":6,"./background":7,"./mode":12,"./panel":14,"./shapes/circle":15}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mode_1 = require("./mode");
var EngineControl = /** @class */ (function () {
    function EngineControl(engine, mode) {
        if (mode === void 0) { mode = mode_1.ControlModes.MODE_DEFAULT; }
        this.engine = engine;
        this.mode = mode;
    }
    EngineControl.prototype.addCircControl = function (circControl) {
        this.circControl = circControl;
    };
    EngineControl.prototype.render = function () {
        var engineFragment = document.createDocumentFragment();
        if (this.mode === mode_1.ControlModes.MODE_SIMPLE) {
            engineFragment.appendChild(this.makeSimpleIntervalFragment());
        }
        else if (this.mode === mode_1.ControlModes.MODE_ADVANCED) {
            engineFragment.appendChild(this.makeAdvancedIntervalFragment());
        }
        engineFragment.appendChild(this.circControl.render());
        return engineFragment;
    };
    EngineControl.prototype.makeAdvancedIntervalFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control\">\n                <label>Step Interval</label>\n                <input type=\"number\" name=\"interval\" min=\"0\" class=\"input\" value=\"" + this.engine.getStepInterval() + "\">\n            </div>";
        var intervalFragment = document.createRange().createContextualFragment(html);
        intervalFragment.querySelector('input[name="interval"]').addEventListener('input', function (e) {
            _this.engine.setStepInterval(parseInt(e.target.value));
        });
        return intervalFragment;
    };
    EngineControl.prototype.makeSimpleIntervalFragment = function () {
        var _this = this;
        var slowChecked = this.engine.getStepInterval() === 1 ? '' : 'checked';
        var html = "\n            <div class=\"control\">\n                <label>Slow Mode</label>\n                <input type=\"checkbox\" name=\"slowMode\" class=\"input\" " + slowChecked + ">\n            </div>";
        var intervalFragment = document.createRange().createContextualFragment(html);
        intervalFragment.querySelector('input[name="slowMode"]').addEventListener('input', function (e) {
            if (e.target.checked === true) {
                _this.engine.setStepInterval(100);
            }
            else {
                _this.engine.setStepInterval(1);
            }
        });
        return intervalFragment;
    };
    EngineControl.prototype.makePlayFragment = function () {
        var _this = this;
        var html = "<button class=\"paused\">" + this.getPlayButtonLabel() + "</button>";
        var playFragment = document.createRange().createContextualFragment(html);
        var button = playFragment.querySelector('button');
        button.addEventListener('click', function (e) {
            if (_this.engine.isPlaying()) {
                _this.engine.pause();
            }
            else {
                _this.engine.play();
            }
        });
        this.engine.addEventListener('pause', function (value) {
            button.innerText = _this.getPlayButtonLabel();
        });
        this.engine.addEventListener('play', function (value) {
            button.innerText = _this.getPlayButtonLabel();
        });
        return playFragment;
    };
    EngineControl.prototype.makeStepJumpFragment = function () {
        var _this = this;
        var html = "<button class=\"stepThousand\">Step 1000</button>";
        var stepJumpFragment = document.createRange().createContextualFragment(html);
        var stepJumpButton = stepJumpFragment.querySelector('button.stepThousand');
        stepJumpButton.addEventListener('click', function (e) {
            stepJumpButton.setAttribute('disabled', 'disabled');
            _this.engine.stepFast(1000)
                .then(function (_) {
                stepJumpButton.removeAttribute('disabled');
            });
        });
        return stepJumpFragment;
    };
    EngineControl.prototype.makeStepJumpByFragment = function () {
        var _this = this;
        var html = "<button class=\"stepBy\">Step By...</button>";
        var stepJumpByFragment = document.createRange().createContextualFragment(html);
        var stepJumpByButton = stepJumpByFragment.querySelector('button.stepBy');
        stepJumpByButton.addEventListener('click', function (e) {
            var stepsToRun = parseInt(prompt('Steps To Run'));
            if (isNaN(stepsToRun) === true || stepsToRun === null) {
                return;
            }
            stepJumpByButton.setAttribute('disabled', 'disabled');
            _this.engine.stepFast(stepsToRun)
                .then(function (_) {
                stepJumpByButton.removeAttribute('disabled');
            });
        });
        return stepJumpByFragment;
    };
    EngineControl.prototype.makeResetFragment = function () {
        var _this = this;
        var html = "<button class=\"reset\">Reset</button>";
        var resetFragment = document.createRange().createContextualFragment(html);
        resetFragment.querySelector('button.reset').addEventListener('click', function (e) {
            _this.engine.reset();
        });
        return resetFragment;
    };
    EngineControl.prototype.getQuickControls = function () {
        var self = this;
        return [
            new /** @class */ (function () {
                function class_1() {
                }
                class_1.prototype.render = function () {
                    return self.makePlayFragment();
                };
                return class_1;
            }()),
            new /** @class */ (function () {
                function class_2() {
                }
                class_2.prototype.render = function () {
                    return self.makeStepJumpFragment();
                };
                return class_2;
            }()),
            new /** @class */ (function () {
                function class_3() {
                }
                class_3.prototype.render = function () {
                    return self.makeStepJumpByFragment();
                };
                return class_3;
            }()),
            new /** @class */ (function () {
                function class_4() {
                }
                class_4.prototype.render = function () {
                    return self.makeResetFragment();
                };
                return class_4;
            }()),
        ];
    };
    EngineControl.prototype.getPlayButtonLabel = function () {
        return (this.engine.isPlaying()) ? 'Pause' : 'Play';
    };
    return EngineControl;
}());
exports.default = EngineControl;

},{"./mode":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GuidePainterControl = /** @class */ (function () {
    function GuidePainterControl(guide) {
        this.guidePainter = guide;
    }
    GuidePainterControl.prototype.render = function () {
        return document.createDocumentFragment();
    };
    GuidePainterControl.prototype.makeVisibilityFragment = function () {
        var _this = this;
        var html = "<button class=\"show\">" + this.getShowButtonLabel() + "</button>";
        var visibilityFragment = document.createRange().createContextualFragment(html);
        visibilityFragment.querySelector('button.show').addEventListener('click', function (e) {
            if (_this.guidePainter.isVisible()) {
                _this.guidePainter.hide();
            }
            else {
                _this.guidePainter.show();
            }
            e.target.innerText = _this.getShowButtonLabel();
        });
        return visibilityFragment;
    };
    GuidePainterControl.prototype.getQuickControls = function () {
        var self = this;
        return [
            new /** @class */ (function () {
                function class_1() {
                }
                class_1.prototype.render = function () {
                    return self.makeVisibilityFragment();
                };
                return class_1;
            }()),
        ];
    };
    GuidePainterControl.prototype.getShowButtonLabel = function () {
        return (this.guidePainter.isVisible()) ? 'No Guides' : 'Guides';
    };
    return GuidePainterControl;
}());
exports.default = GuidePainterControl;

},{}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var structure_1 = require("../../structure");
var ModeControl = /** @class */ (function (_super) {
    __extends(ModeControl, _super);
    function ModeControl(currentMode) {
        var _this = _super.call(this) || this;
        _this.currentMode = currentMode;
        return _this;
    }
    ModeControl.prototype.render = function () {
        return this.makeModeFragment();
    };
    ModeControl.prototype.makeModeFragment = function () {
        var _this = this;
        var html = "<button>" + this.getModeButtonLabel() + "</button>";
        var modeFragment = document.createRange().createContextualFragment(html);
        var button = modeFragment.querySelector('button');
        button.addEventListener('click', function (e) {
            if (_this.currentMode === ControlModes.MODE_ADVANCED) {
                _this.dispatchEvent(new ControlModeEvent(ControlModes.MODE_SIMPLE));
            }
            else {
                _this.dispatchEvent(new ControlModeEvent(ControlModes.MODE_ADVANCED));
            }
        });
        return modeFragment;
    };
    ModeControl.prototype.getModeButtonLabel = function () {
        return (this.currentMode === ControlModes.MODE_ADVANCED) ? 'Simple' : 'Advanced';
    };
    ModeControl.prototype.getQuickControls = function () {
        var self = this;
        return [
            new /** @class */ (function () {
                function class_1() {
                }
                class_1.prototype.render = function () {
                    return self.makeModeFragment();
                };
                return class_1;
            }()),
        ];
    };
    return ModeControl;
}(structure_1.EventEmitter));
exports.ModeControl = ModeControl;
var ControlModes = /** @class */ (function () {
    function ControlModes() {
    }
    Object.defineProperty(ControlModes, "MODE_SIMPLE", {
        get: function () {
            return 'simple';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlModes, "MODE_ADVANCED", {
        get: function () {
            return 'advanced';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlModes, "MODE_DEFAULT", {
        get: function () {
            return this.MODE_SIMPLE;
        },
        enumerable: true,
        configurable: true
    });
    return ControlModes;
}());
exports.ControlModes = ControlModes;
var ControlModeEvent = /** @class */ (function () {
    function ControlModeEvent(mode) {
        this.mode = mode;
    }
    ControlModeEvent.prototype.getContext = function () {
        return [this.mode];
    };
    ControlModeEvent.prototype.getName = function () {
        return "controls.mode";
    };
    return ControlModeEvent;
}());
exports.ControlModeEvent = ControlModeEvent;

},{"../../structure":25}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PainterControl = /** @class */ (function () {
    function PainterControl(painter) {
        this.painter = painter;
    }
    PainterControl.prototype.makeClearFragment = function () {
        var _this = this;
        var html = "<button class=\"clear\">Clear</button>";
        var clearFragment = document.createRange().createContextualFragment(html);
        clearFragment.querySelector('button.clear').addEventListener('click', function (e) {
            _this.painter.clear();
        });
        return clearFragment;
    };
    PainterControl.prototype.getQuickControls = function () {
        var self = this;
        return [];
    };
    return PainterControl;
}());
exports.default = PainterControl;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControlPanel = /** @class */ (function () {
    function ControlPanel(name) {
        if (name === void 0) { name = null; }
        this.controls = [];
        this.simplified = true;
        this.name = name;
    }
    ControlPanel.prototype.addControl = function (control) {
        this.controls.push(control);
    };
    ControlPanel.prototype.addControls = function (controls) {
        var _this = this;
        controls.forEach(function (control) { return _this.addControl(control); });
    };
    ControlPanel.prototype.render = function () {
        var wrapperHtml = "\n        <div class=\"control-group\">\n            <div class=\"section-body\"></div>\n        </div>";
        var controlPanelFragment = document.createRange().createContextualFragment(wrapperHtml);
        if (this.name !== null) {
            var headerFragment = document.createRange().createContextualFragment("<div class=\"section-head\">" + this.name + "</div>");
            controlPanelFragment.prepend(headerFragment);
        }
        var controlPanelBodyEl = controlPanelFragment.querySelector('.section-body');
        this.controls.forEach(function (control) {
            controlPanelBodyEl.appendChild(control.render());
        });
        return controlPanelFragment;
    };
    return ControlPanel;
}());
exports.default = ControlPanel;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var brush_1 = require("../brush");
var mode_1 = require("../mode");
var CircleControl = /** @class */ (function () {
    function CircleControl(circle, mode) {
        var _this = this;
        if (mode === void 0) { mode = mode_1.ControlModes.MODE_DEFAULT; }
        this.brushControls = [];
        this.circle = circle;
        this.mode = mode;
        this.circle.brushes.forEach(function (brush) {
            _this.addBrushControl(new brush_1.default(brush, mode));
        });
    }
    CircleControl.prototype.addBrushControl = function (brushControl) {
        this.brushControls.push(brushControl);
    };
    CircleControl.prototype.render = function () {
        if (this.circle === null) {
            return document.createDocumentFragment();
        }
        var html = "\n        <details class=\"control-group\" data-shape-id=\"" + this.circle.id + "\" open>\n            <summary>\n                Circle\n            </summary>\n            <div class=\"section-body\"></div>\n        </details>\n        ";
        var deleteButtonHtml = "\n            <div style=\"float: right;\">\n                <span class=\"shapeDelete\" style=\"text-transform: uppercase; font-size: 0.6rem; color: darkred; cursor: pointer\">Delete</span>\n            </div>";
        var documentFragment = document.createRange().createContextualFragment(html);
        var shapeDeleteFragment = document.createRange().createContextualFragment(deleteButtonHtml);
        var documentFragmentBody = documentFragment.querySelector('.section-body');
        if (this.circle.isRoot === false) {
            documentFragment.querySelector('summary').appendChild(shapeDeleteFragment);
        }
        this.getControlFragments().forEach(function (fragment) {
            documentFragmentBody.appendChild(fragment);
        });
        this.brushControls.forEach(function (brushControl) {
            documentFragmentBody.append(brushControl.render());
        });
        return documentFragment;
    };
    CircleControl.prototype.getControlFragments = function () {
        var documentFragments = [
            this.makeStepsFragment(),
            this.makeRadiusFragment(),
            this.makeDirectionFragment(),
        ];
        if (this.mode === mode_1.ControlModes.MODE_ADVANCED) {
            documentFragments.push(this.makeStepModuloFragment());
        }
        if (this.circle.isRoot === false) {
            documentFragments.push(this.makeOutsideFragment());
            if (this.mode === mode_1.ControlModes.MODE_ADVANCED) {
                documentFragments.push(this.makeFixedFragment());
            }
        }
        return documentFragments;
    };
    CircleControl.prototype.makeStepsFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control\">\n                <label>steps</label>\n                <input type=\"number\" name=\"steps\" min=\"0\" class=\"input\" value=\"" + this.circle.steps + "\">\n            </div>";
        var fragment = document.createRange().createContextualFragment(html);
        var input = fragment.querySelector('input');
        input.addEventListener('input', function (e) {
            _this.circle.steps = parseInt(e.target.value);
        });
        this.circle.addEventListener('change.steps', function (value) {
            input.value = value;
        });
        return fragment;
    };
    CircleControl.prototype.makeRadiusFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control\">\n                <label>radius</label>\n                <input type=\"number\" name=\"radius\" min=\"1\" class=\"input\" value=\"" + this.circle.radius + "\">\n            </div>";
        var fragment = document.createRange().createContextualFragment(html);
        var input = fragment.querySelector('input');
        input.addEventListener('input', function (e) {
            _this.circle.radius = parseInt(e.target.value);
        });
        this.circle.addEventListener('change.radius', function (value) {
            input.value = value;
        });
        return fragment;
    };
    CircleControl.prototype.makeStepModuloFragment = function () {
        var _this = this;
        var html = "\n            <div class=\"control\">\n                <label>stepMod</label>\n                <input type=\"number\" name=\"stepMod\" min=\"0\" class=\"input\" value=\"" + this.circle.stepMod + "\">\n            </div>";
        var fragment = document.createRange().createContextualFragment(html);
        var input = fragment.querySelector('input');
        input.addEventListener('input', function (e) {
            _this.circle.stepMod = parseInt(e.target.value);
        });
        this.circle.addEventListener('change.stepMod', function (value) {
            input.value = value;
        });
        return fragment;
    };
    CircleControl.prototype.makeOutsideFragment = function () {
        var _this = this;
        var outsideChecked = (this.circle.outside === true) ? 'checked' : '';
        var html = "\n            <div class=\"control\">\n                <label>outside</label>\n                <input type=\"checkbox\" name=\"outside\" value=\"true\" class=\"input\" " + outsideChecked + ">\n            </div>";
        var fragment = document.createRange().createContextualFragment(html);
        var input = fragment.querySelector('input');
        input.addEventListener('input', function (e) {
            _this.circle.outside = e.target.checked === true;
        });
        this.circle.addEventListener('change.outside', function (value) {
            input.checked = value;
        });
        return fragment;
    };
    CircleControl.prototype.makeDirectionFragment = function () {
        var _this = this;
        var clockwiseChecked = (this.circle.clockwise === true) ? 'checked' : '';
        var html = "\n            <div class=\"control\">\n                <label>clockwise</label>\n                <input type=\"checkbox\" name=\"clockwise\" value=\"true\" class=\"input\" " + clockwiseChecked + ">\n            </div>";
        var fragment = document.createRange().createContextualFragment(html);
        var input = fragment.querySelector('input');
        input.addEventListener('input', function (e) {
            _this.circle.clockwise = e.target.checked === true;
        });
        this.circle.addEventListener('change.clockwise', function (value) {
            input.checked = value;
        });
        return fragment;
    };
    CircleControl.prototype.makeFixedFragment = function () {
        var _this = this;
        var fixedChecked = (this.circle.fixed === true) ? 'checked' : '';
        var html = "\n            <div class=\"control control-fixed\">\n                <label>fixed</label>\n                <input type=\"checkbox\" name=\"fixed\" value=\"true\" class=\"input\" " + fixedChecked + ">\n            </div>";
        var fragment = document.createRange().createContextualFragment(html);
        var input = fragment.querySelector('input');
        input.addEventListener('input', function (e) {
            _this.circle.fixed = e.target.checked === true;
        });
        this.circle.addEventListener('change.fixed', function (value) {
            input.checked = value;
        });
        return fragment;
    };
    return CircleControl;
}());
exports.default = CircleControl;

},{"../brush":8,"../mode":12}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("../engine");
var painter_1 = require("../painter");
var backgroundPainter_1 = require("../backgroundPainter");
var StorageControl = /** @class */ (function () {
    function StorageControl(stores, engine) {
        this.stores = stores;
        this.engine = engine;
    }
    StorageControl.prototype.render = function () {
        return document.createDocumentFragment();
    };
    StorageControl.prototype.makeSaveFragment = function () {
        var _this = this;
        var html = "<button class=\"save\">Save</button>";
        var fragment = document.createRange().createContextualFragment(html);
        fragment.querySelector('button.save').addEventListener('click', function (e) {
            var name = prompt('Enter Circ name');
            if (name === '' || name === null) {
                return;
            }
            var circ = _this.engine.export();
            circ.name = name;
            _this.stores[0].store(name, circ);
        });
        return fragment;
    };
    StorageControl.prototype.makeLoadFragment = function () {
        var _this = this;
        var html = "<button class=\"load\">Load</button>";
        var fragment = document.createRange().createContextualFragment(html);
        fragment.querySelector('button.load').addEventListener('click', function (e) {
            _this.engine.pause();
            var storeFront = document.querySelector('.store');
            storeFront.innerHTML = '';
            _this.stores.forEach(function (store) {
                var storeListingHtml = "\n                <h2>" + store.name + " Circs</h2>\n                <div class=\"listing\"></div>\n                ";
                var circStore = document.createRange().createContextualFragment(storeListingHtml);
                var circListing = circStore.querySelector('.listing');
                store.list()
                    .then(function (circs) {
                    circs.forEach(function (circ) {
                        var tile = document.createRange().createContextualFragment("<div class=\"circ\" data-name=\"" + circ.name + "\"><canvas class=\"canvasBack\"></canvas><canvas class=\"canvasCirc\"></canvas><div class=\"circName\">" + circ.name + "</div></div>");
                        var tileCanvas = tile.querySelector('canvas.canvasCirc');
                        tileCanvas.style.transformOrigin = '0 0'; //scale from top left
                        tileCanvas.style.transform = 'scale(' + 200 / circ.height + ')';
                        tileCanvas.style.width = circ.width + 'px';
                        tileCanvas.style.height = circ.height + 'px';
                        tileCanvas.setAttribute('height', tileCanvas.style.height);
                        tileCanvas.setAttribute('width', tileCanvas.style.width);
                        var tileBackCanvas = tile.querySelector('canvas.canvasBack');
                        tileBackCanvas.style.transformOrigin = '0 0'; //scale from top left
                        tileBackCanvas.style.transform = 'scale(' + 200 / circ.height + ')';
                        tileBackCanvas.style.width = circ.width + 'px';
                        tileBackCanvas.style.height = circ.height + 'px';
                        tileBackCanvas.setAttribute('height', tileBackCanvas.style.height);
                        tileBackCanvas.setAttribute('width', tileBackCanvas.style.width);
                        var previewPainter = new painter_1.default(tileCanvas.getContext('2d'));
                        var previewBackgroundPainter = new backgroundPainter_1.default(tileBackCanvas.getContext('2d'));
                        var previewEngine = engine_1.EngineFactory();
                        previewEngine.addStepCallback(function (circ) { return previewPainter.draw(circ); });
                        previewEngine.addStepCallback(function (circ) { return previewBackgroundPainter.draw(circ); });
                        previewEngine.import(circ);
                        tile.querySelector('.circ').addEventListener('click', function (e) {
                            var circName = e.target.closest('[data-name]').getAttribute('data-name');
                            store
                                .get(circName)
                                .then(function (circ) {
                                _this.engine.import(circ);
                                _this.engine.play();
                                storeFront.style.display = 'none';
                            });
                        });
                        tile.querySelector('.circ').addEventListener('mouseenter', function (e) {
                            previewEngine.play();
                        });
                        tile.querySelector('.circ').addEventListener('mouseleave', function (e) {
                            previewEngine.pause();
                        });
                        circListing.appendChild(tile);
                    });
                });
                storeFront.appendChild(circStore);
            });
            storeFront.style.display = 'block';
        });
        return fragment;
    };
    StorageControl.prototype.getQuickControls = function () {
        var self = this;
        return [
            new /** @class */ (function () {
                function class_1() {
                }
                class_1.prototype.render = function () {
                    return self.makeSaveFragment();
                };
                return class_1;
            }()),
            new /** @class */ (function () {
                function class_2() {
                }
                class_2.prototype.render = function () {
                    return self.makeLoadFragment();
                };
                return class_2;
            }()),
        ];
    };
    return StorageControl;
}());
exports.default = StorageControl;

},{"../backgroundPainter":3,"../engine":17,"../painter":20}],17:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var structure_1 = require("../structure");
var events_1 = require("./events");
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    function Engine() {
        var _this = _super.call(this) || this;
        _this.totalStepsRun = 0;
        _this.interval = 1;
        _this.stepCallbacks = [];
        _this.resetCallbacks = [];
        _this.importCallbacks = [];
        _this.stepsToRun = 0;
        _this.stepJumps = [];
        _this.run();
        return _this;
    }
    Engine.prototype.addStepCallback = function (callback) {
        this.stepCallbacks.push(callback);
    };
    Engine.prototype.addResetCallback = function (callback) {
        this.resetCallbacks.push(callback);
    };
    Engine.prototype.addImportCallback = function (callback) {
        this.importCallbacks.push(callback);
    };
    Engine.prototype.export = function () {
        return this.circ;
    };
    Engine.prototype.import = function (circ) {
        this.circ = circ;
        this.reset();
        this.runImportCallbacks();
    };
    Engine.prototype.pause = function () {
        this.stepsToRun = 0;
        this.dispatchEvent(new events_1.EnginePauseEvent());
    };
    Engine.prototype.play = function (count) {
        this.stepsToRun = typeof count === 'number' ? count : Infinity;
        this.dispatchEvent(new events_1.EnginePlayEvent());
    };
    Engine.prototype.isPlaying = function () {
        return this.stepsToRun > 0;
    };
    Engine.prototype.getRemainingStepsToRun = function () {
        return this.stepsToRun;
    };
    Engine.prototype.reset = function () {
        this.circ.getShapes().forEach(function (shape) { return shape.reset(); });
        this.runResetCallbacks();
        this.totalStepsRun = 0;
        // Run a single step to correctly position and render the shapes
        this.step();
    };
    Engine.prototype.stepFast = function (count) {
        var _this = this;
        if (this.stepJumps.length > 0) {
            throw "Step jump in progress";
        }
        var thenContinue = this.getRemainingStepsToRun();
        this.pause();
        var stepGroup = 100;
        var stepsRun = 0;
        while (stepsRun < count) {
            var stepsLeftToRun = count - stepsRun;
            var stepsToRun = (stepsLeftToRun < stepGroup) ? stepsLeftToRun : stepGroup;
            this.stepJumps.push(this.stepJump(stepsToRun));
            stepsRun += stepsToRun;
        }
        return Promise.all(this.stepJumps)
            .then(function (_) {
            _this.play(thenContinue);
            _this.stepJumps = [];
        });
    };
    Engine.prototype.stepJump = function (number) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function (_) {
                for (var step = 0; step < number; step++) {
                    _this.step();
                }
                resolve();
            }, 0);
        });
    };
    Engine.prototype.calculateShapes = function () {
        var _this = this;
        var parentShape = null;
        this.circ.getShapes().forEach(function (shape) {
            shape.calculatePosition(parentShape);
            if (shape.stepMod === 0 || _this.totalStepsRun % shape.stepMod === 0) {
                shape.calculateAngle();
            }
            parentShape = shape;
        });
    };
    Engine.prototype.step = function () {
        this.totalStepsRun++;
        this.calculateShapes();
        this.runStepCallbacks();
    };
    Engine.prototype.runStepCallbacks = function () {
        var _this = this;
        this.stepCallbacks.forEach(function (callable) {
            callable(_this.circ);
        });
    };
    Engine.prototype.runResetCallbacks = function () {
        this.resetCallbacks.forEach(function (callable) {
            callable();
        });
    };
    Engine.prototype.runImportCallbacks = function () {
        var _this = this;
        this.importCallbacks.forEach(function (callable) {
            callable(_this.circ);
        });
    };
    Engine.prototype.run = function () {
        var _this = this;
        setTimeout(function (_) {
            if (_this.stepsToRun > 0) {
                _this.step();
                _this.stepsToRun--;
            }
            _this.run();
        }, this.interval);
    };
    Engine.prototype.getStepInterval = function () {
        return this.interval;
    };
    Engine.prototype.setStepInterval = function (milliseconds) {
        this.interval = milliseconds;
    };
    return Engine;
}(structure_1.EventEmitter));
exports.Engine = Engine;
var EngineProxyHandler = {
    set: function (target, propertyName, value, receiver) {
        target[propertyName] = value;
        target.dispatchEvent(new events_1.AttributeChangedEvent(propertyName.toString(), value));
        return true;
    },
};
var EngineFactory = function () { return new Proxy(new Engine(), EngineProxyHandler); };
exports.EngineFactory = EngineFactory;

},{"../structure":25,"./events":18}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AttributeChangedEvent = /** @class */ (function () {
    function AttributeChangedEvent(name, value) {
        this.name = name;
        this.value = value;
    }
    AttributeChangedEvent.prototype.getName = function () {
        return "change." + this.name;
    };
    AttributeChangedEvent.prototype.getContext = function () {
        return [this.value, this.name];
    };
    return AttributeChangedEvent;
}());
exports.AttributeChangedEvent = AttributeChangedEvent;
var EnginePauseEvent = /** @class */ (function () {
    function EnginePauseEvent() {
    }
    EnginePauseEvent.prototype.getName = function () {
        return "pause";
    };
    EnginePauseEvent.prototype.getContext = function () {
        return [];
    };
    return EnginePauseEvent;
}());
exports.EnginePauseEvent = EnginePauseEvent;
var EnginePlayEvent = /** @class */ (function () {
    function EnginePlayEvent() {
    }
    EnginePlayEvent.prototype.getName = function () {
        return "play";
    };
    EnginePlayEvent.prototype.getContext = function () {
        return [];
    };
    return EnginePlayEvent;
}());
exports.EnginePlayEvent = EnginePlayEvent;
var ShapeAddEvent = /** @class */ (function () {
    function ShapeAddEvent(shape) {
        this.shape = shape;
    }
    ShapeAddEvent.prototype.getName = function () {
        return "shape.add";
    };
    ShapeAddEvent.prototype.getContext = function () {
        return [this.shape];
    };
    return ShapeAddEvent;
}());
exports.ShapeAddEvent = ShapeAddEvent;
var ShapeDeleteEvent = /** @class */ (function () {
    function ShapeDeleteEvent(shape) {
        this.shape = shape;
    }
    ShapeDeleteEvent.prototype.getName = function () {
        return "shape.delete";
    };
    ShapeDeleteEvent.prototype.getContext = function () {
        return [this.shape];
    };
    return ShapeDeleteEvent;
}());
exports.ShapeDeleteEvent = ShapeDeleteEvent;

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GuidePainter = /** @class */ (function () {
    function GuidePainter(canvasContext) {
        this.canvasCenter = new CanvasCenter();
        this.visible = true;
        this.guideColor = '#FFF';
        this.canvasContext = canvasContext;
    }
    GuidePainter.prototype.hide = function () {
        this.visible = false;
        this.canvasContext.canvas.style.visibility = 'hidden';
    };
    GuidePainter.prototype.show = function () {
        this.visible = true;
        this.canvasContext.canvas.style.visibility = 'visible';
    };
    GuidePainter.prototype.isVisible = function () {
        return this.visible === true;
    };
    GuidePainter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    GuidePainter.prototype.centerCanvas = function (circ) {
        if (this.canvasCenter.x !== (circ.width / 2)) {
            this.canvasContext.translate(-this.canvasCenter.x, 0);
            this.canvasContext.translate((circ.width / 2), 0);
            this.canvasCenter.x = (circ.width / 2);
        }
        if (this.canvasCenter.y !== (circ.height / 2)) {
            this.canvasContext.translate(0, -this.canvasCenter.y);
            this.canvasContext.translate(0, (circ.height / 2));
            this.canvasCenter.y = (circ.height / 2);
        }
    };
    GuidePainter.prototype.draw = function (circ) {
        var _this = this;
        this.centerCanvas(circ);
        this.clear();
        this.guideColor = '#' + this.generateContrastingColor(circ.backgroundFill);
        circ.getShapes().forEach(function (circle) {
            _this.drawCircle(circle);
        });
    };
    GuidePainter.prototype.generateContrastingColor = function (color) {
        color = color.replace('#', '');
        return (this.calculateLuma(color) >= 165) ? '000' : 'fff';
    };
    GuidePainter.prototype.calculateLuma = function (color) {
        if (color.length === 3) {
            color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
        }
        else if (color.length !== 6) {
            throw ('Invalid hex color: ' + color);
        }
        var rgb = [];
        for (var i = 0; i <= 2; i++) {
            rgb[i] = parseInt(color.substr(i * 2, 2), 16);
        }
        return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
    };
    GuidePainter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    GuidePainter.prototype.drawCircle = function (circle) {
        var _this = this;
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.centre.x, circle.state.centre.y, circle.radius, 0, 2 * Math.PI);
        this.canvasContext.stroke();
        this.drawRotationIndicator(circle);
        circle.brushes.forEach(function (brush) { return _this.drawBrushPoint(circle, brush); });
    };
    GuidePainter.prototype.drawRotationIndicator = function (circle) {
        this.canvasContext.fillStyle = this.guideColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(circle.state.drawPoint.x, circle.state.drawPoint.y, 4, 0, 2 * Math.PI);
        this.canvasContext.fill();
    };
    GuidePainter.prototype.drawBrushPoint = function (circle, brush) {
        var brushPointX = circle.state.drawPoint.x + (Math.cos(circle.state.getAngle() + (brush.degrees * (Math.PI / 180))) * brush.offset);
        var brushPointY = circle.state.drawPoint.y + (Math.sin(circle.state.getAngle() + (brush.degrees * (Math.PI / 180))) * brush.offset);
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = this.guideColor;
        this.canvasContext.moveTo(circle.state.drawPoint.x, circle.state.drawPoint.y);
        this.canvasContext.lineTo(brushPointX, brushPointY);
        this.canvasContext.stroke();
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = brush.colorWithAlpha;
        this.canvasContext.arc(brushPointX, brushPointY, Math.max(2, brush.point), 0, 2 * Math.PI);
        this.canvasContext.fill();
    };
    return GuidePainter;
}());
exports.default = GuidePainter;
var CanvasCenter = /** @class */ (function () {
    function CanvasCenter() {
        this.x = 0;
        this.y = 0;
    }
    return CanvasCenter;
}());

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Painter = /** @class */ (function () {
    function Painter(canvasContext) {
        this.canvasCenter = new CanvasCenter();
        this.canvasContext = canvasContext;
    }
    Painter.prototype.clear = function () {
        this.canvasContext.clearRect(-this.canvasContext.canvas.width / 2, -this.canvasContext.canvas.height / 2, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    };
    Painter.prototype.draw = function (circ) {
        var _this = this;
        this.centerCanvas(circ);
        circ.getShapes().forEach(function (circle) {
            if (circle.brushes.length === 0) {
                return;
            }
            _this.drawPoints(circle);
        });
    };
    Painter.prototype.centerCanvas = function (circ) {
        if (this.canvasCenter.x !== (circ.width / 2)) {
            this.canvasContext.translate(-this.canvasCenter.x, 0);
            this.canvasContext.translate((circ.width / 2), 0);
            this.canvasCenter.x = (circ.width / 2);
        }
        if (this.canvasCenter.y !== (circ.height / 2)) {
            this.canvasContext.translate(0, -this.canvasCenter.y);
            this.canvasContext.translate(0, (circ.height / 2));
            this.canvasCenter.y = (circ.height / 2);
        }
    };
    Painter.prototype.exportImageAsDataURL = function () {
        return "";
    };
    Painter.prototype.drawPoints = function (circle) {
        var _this = this;
        circle.brushes.forEach(function (brush) {
            var radians = circle.state.getAngle();
            var x = circle.state.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
            var y = circle.state.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
            var color = brush.colorWithAlpha;
            if (brush.link === true) {
                var previousX = circle.state.previousState.drawPoint.x + (Math.cos(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
                var previousY = circle.state.previousState.drawPoint.y + (Math.sin(radians + (brush.degrees * (Math.PI / 180))) * brush.offset);
                _this.canvasContext.strokeStyle = color;
                _this.canvasContext.beginPath();
                _this.canvasContext.moveTo(previousX, previousY);
                _this.canvasContext.lineTo(x, y);
                _this.canvasContext.lineWidth = brush.point;
                _this.canvasContext.stroke();
            }
            else {
                _this.canvasContext.fillStyle = color;
                _this.canvasContext.beginPath();
                _this.canvasContext.arc(x, y, brush.point, 0, 2 * Math.PI);
                _this.canvasContext.fill();
            }
        });
    };
    ;
    return Painter;
}());
exports.default = Painter;
var CanvasCenter = /** @class */ (function () {
    function CanvasCenter() {
        this.x = 0;
        this.y = 0;
    }
    return CanvasCenter;
}());

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = require("./circle");
var circ_1 = require("./circ");
var brushes_1 = require("./brushes");
var Serializer = /** @class */ (function () {
    function Serializer() {
        this.classes = {
            Circ: circ_1.Circ,
            CircConfig: circ_1.CircConfig,
            Circle: circle_1.Circle,
            CircleCenterPosition: circle_1.CircleCenterPosition,
            CircleDrawPosition: circle_1.CircleDrawPosition,
            CircleState: circle_1.CircleState,
            CircleConfig: circle_1.CircleConfig,
            Brush: brushes_1.Brush,
            BrushConfig: brushes_1.BrushConfig,
        };
    }
    Serializer.prototype.serialize = function (circ) {
        return JSON.stringify(circ, this.replace.bind(this));
    };
    Serializer.prototype.unserialize = function (circJson) {
        return JSON.parse(circJson, this.revive.bind(this));
    };
    Serializer.prototype.replace = function (key, value) {
        if (key === 'events') {
            return;
        }
        if (value instanceof Object) {
            value.__type = value.constructor.name;
        }
        return value;
    };
    Serializer.prototype.revive = function (key, value) {
        if (value instanceof Object === false || typeof value.__type !== 'string') {
            return value;
        }
        var p = this.makeClass(value.__type);
        Object.getOwnPropertyNames(value).forEach(function (k) {
            p[k] = value[k];
        });
        delete p.__type;
        return p;
    };
    Serializer.prototype.makeClass = function (className) {
        if (typeof this.classes[className] === 'undefined') {
            throw "Unknown class " + className;
        }
        return new this.classes[className]();
    };
    return Serializer;
}());
exports.default = Serializer;

},{"./brushes":4,"./circ":5,"./circle":6}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var circ_1 = require("./circ");
var circle_1 = require("./circle");
var brushes_1 = require("./brushes");
var BlueprintStore = /** @class */ (function () {
    function BlueprintStore() {
        this.blueprintsStore = {
            'twoCircles': this.makeTwoCircles,
            'threeCircles': this.makeThreeCircles,
            'fourCircles': this.makeFourCircles,
        };
        this.name = 'Blueprints';
    }
    BlueprintStore.prototype.get = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            resolve(_this.resolveCirc(name));
        });
    };
    BlueprintStore.prototype.getIndex = function (index) {
        return new Promise(function (resolve, reject) {
            resolve(undefined);
        });
    };
    BlueprintStore.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circs = [];
            for (var circName in _this.blueprintsStore) {
                circs.push(_this.resolveCirc(circName));
            }
            resolve(circs);
        });
    };
    BlueprintStore.prototype.resolveCirc = function (circName) {
        var circ = this.blueprintsStore[circName]();
        circ.name = circName;
        return circ;
    };
    BlueprintStore.prototype.store = function (name, circ) {
    };
    BlueprintStore.prototype.delete = function (name) {
        throw new Error("Blueprints can't be deleted.");
    };
    BlueprintStore.prototype.makeTwoCircles = function () {
        var circ = new circ_1.Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle0 = new circle_1.Circle();
        circle0.steps = 500;
        circle0.outside = false;
        circle0.fixed = true;
        circle0.clockwise = false;
        circle0.stepMod = 0;
        circle0.startAngle = 0;
        circle0.radius = 300;
        var circle1 = new circle_1.Circle();
        circle1.steps = 500;
        circle1.outside = true;
        circle1.fixed = true;
        circle1.clockwise = true;
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = 100;
        var circle1Brush = new brushes_1.Brush();
        circle1Brush.color = '#FFFFFF';
        circle1Brush.degrees = 0;
        circle1Brush.link = false;
        circle1Brush.offset = 0;
        circle1Brush.point = 0.5;
        circle1.brushes.push(circle1Brush);
        circ.addShape(circle0);
        circ.addShape(circle1);
        return circ;
    };
    BlueprintStore.prototype.makeThreeCircles = function () {
        var circ = new circ_1.Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle0 = new circle_1.Circle();
        circle0.steps = 500;
        circle0.outside = false;
        circle0.fixed = true;
        circle0.clockwise = false;
        circle0.stepMod = 0;
        circle0.startAngle = 0;
        circle0.radius = 100;
        var circle1 = new circle_1.Circle();
        circle1.steps = 500;
        circle1.outside = true;
        circle1.fixed = true;
        circle1.clockwise = true;
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = 50;
        var circle2 = new circle_1.Circle();
        circle2.steps = 500;
        circle2.outside = true;
        circle2.fixed = true;
        circle2.clockwise = false;
        circle2.stepMod = 0;
        circle2.startAngle = 0;
        circle2.radius = 25;
        var circle2Brush = new brushes_1.Brush();
        circle2Brush.color = '#FFFFFF';
        circle2Brush.degrees = 0;
        circle2Brush.link = false;
        circle2Brush.offset = 0;
        circle2Brush.point = 0.5;
        circle2.brushes.push(circle2Brush);
        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);
        return circ;
    };
    BlueprintStore.prototype.makeFourCircles = function () {
        var circ = new circ_1.Circ;
        circ.width = 1080;
        circ.height = 1080;
        circ.backgroundFill = '#1b5eec';
        var circle0 = new circle_1.Circle();
        circle0.steps = 1000;
        circle0.outside = false;
        circle0.fixed = true;
        circle0.clockwise = false;
        circle0.stepMod = 0;
        circle0.startAngle = 0;
        circle0.radius = 120;
        var circle1 = new circle_1.Circle();
        circle1.steps = 500;
        circle1.outside = true;
        circle1.fixed = true;
        circle1.clockwise = true;
        circle1.stepMod = 0;
        circle1.startAngle = 0;
        circle1.radius = 60;
        var circle2 = new circle_1.Circle();
        circle2.steps = 250;
        circle2.outside = true;
        circle2.fixed = true;
        circle2.clockwise = false;
        circle2.stepMod = 0;
        circle2.startAngle = 0;
        circle2.radius = 30;
        var circle3 = new circle_1.Circle();
        circle3.steps = 125;
        circle3.outside = true;
        circle3.fixed = true;
        circle3.clockwise = true;
        circle3.stepMod = 0;
        circle3.startAngle = 0;
        circle3.radius = 15;
        var circle3Brush = new brushes_1.Brush();
        circle3Brush.color = '#FFFFFF';
        circle3Brush.degrees = 0;
        circle3Brush.link = false;
        circle3Brush.offset = 0;
        circle3Brush.point = 0.5;
        circle3.brushes.push(circle3Brush);
        circ.addShape(circle0);
        circ.addShape(circle1);
        circ.addShape(circle2);
        circ.addShape(circle3);
        return circ;
    };
    return BlueprintStore;
}());
exports.BlueprintStore = BlueprintStore;

},{"./brushes":4,"./circ":5,"./circle":6}],23:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = require("./serializer");
var CloudStorage = /** @class */ (function () {
    function CloudStorage() {
        this.serializer = new serializer_1.default();
        this.apiUrl = 'https://circio.mountainofcode.co.uk';
        this.name = 'Cloud';
    }
    CloudStorage.prototype.get = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var response, circJsonString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + '?action=getByName&name=' + encodeURIComponent(name))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        circJsonString = _a.sent();
                        return [2 /*return*/, this.serializer.unserialize(circJsonString)];
                }
            });
        });
    };
    CloudStorage.prototype.getIndex = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var response, circJsonString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.apiUrl + '?action=getByIndex&index=' + encodeURIComponent(index))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        circJsonString = _a.sent();
                        return [2 /*return*/, this.serializer.unserialize(circJsonString)];
                }
            });
        });
    };
    CloudStorage.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fetch(_this.apiUrl + '?action=list')
                .then(function (response) {
                response.json()
                    .then(function (circJsonStrings) {
                    var circs = circJsonStrings.map(function (circJsonString) {
                        return _this.serializer.unserialize(circJsonString);
                    });
                    resolve(circs);
                });
            });
        });
    };
    CloudStorage.prototype.store = function (name, circ) {
        var circJson = this.serializer.serialize(circ);
        fetch(this.apiUrl, { method: 'POST', body: circJson });
    };
    CloudStorage.prototype.delete = function (name) {
    };
    return CloudStorage;
}());
exports.default = CloudStorage;

},{"./serializer":21}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = require("./serializer");
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
        this.storeName = 'store.v2';
        this.serializer = new serializer_1.default();
        this.name = 'Browser';
    }
    LocalStorage.prototype.get = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circJson = window.localStorage.getItem(_this.storeName + "." + name);
            resolve(_this.serializer.unserialize(circJson));
        });
    };
    LocalStorage.prototype.getIndex = function (index) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof index !== 'number') {
                throw 'Provide a valid index';
            }
            _this.list().then(function (circList) {
                var circ = circList[index];
                if (circ === null) {
                    throw 'No data found';
                }
                resolve(circ);
            });
        });
    };
    LocalStorage.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var keys = Object.keys(window.localStorage)
                .filter(function (key) {
                return key.startsWith(_this.storeName);
            })
                .map(function (key) {
                return key.replace(_this.storeName + '.', '');
            });
            var circPromises = keys.map(function (circKey) {
                return _this.get(circKey);
            });
            Promise.all(circPromises).then(function (circs) {
                resolve(circs);
            });
        });
    };
    LocalStorage.prototype.store = function (name, circ) {
        var circJson = this.serializer.serialize(circ);
        window.localStorage.setItem(this.storeName + "." + name, circJson);
    };
    LocalStorage.prototype.delete = function (name) {
        window.localStorage.removeItem(name);
    };
    return LocalStorage;
}());
exports.default = LocalStorage;

},{"./serializer":21}],25:[function(require,module,exports){
"use strict";
/** Data **/
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.dispatchEvent = function (event) {
        if (typeof this.events[event.getName()] === 'undefined') {
            this.events[event.getName()] = [];
        }
        var compoundEventNameList = event.getName().split('.');
        while (compoundEventNameList.length > 0) {
            var eventName = compoundEventNameList.join('.');
            var callbackArray = this.events[eventName] || [];
            callbackArray
                .forEach(function (callback) {
                callback.apply(void 0, event.getContext());
            });
            compoundEventNameList.splice(-1, 1);
        }
    };
    EventEmitter.prototype.addEventListener = function (eventName, callback) {
        if (typeof this.events[eventName] === 'undefined') {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    };
    EventEmitter.prototype.addEventListeners = function (eventNames, callback) {
        var _this = this;
        eventNames.forEach(function (name) { return _this.addEventListener(name, callback); });
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
/** Load & Run Example **/
// const circPainter = new CirclePainter();
// const guidePainter = new GuidePainter();
// const engine = new Engine();
// const store = new LocalStorage();
// const circ = store.get('circ');
//
// engine.import(circ);
// engine.addCallback(circ => circPainter.draw(circ));
// engine.addCallback(circ => guidePainter.draw(circ));
// engine.run();

},{}]},{},[2]);
