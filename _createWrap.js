import baseSetData from './_baseSetData.js';
import createBind from './_createBind.js';
import createCurry from './_createCurry.js';
import createHybrid from './_createHybrid.js';
import createPartial from './_createPartial.js';
import getData from './_getData.js';
import mergeData from './_mergeData.js';
import setData from './_setData.js';
import setWrapToString from './_setWrapToString.js';
import toInteger from './toInteger.js';

/** Error message constants. */
const FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
const WRAP_BIND_FLAG = 1;
const WRAP_BIND_KEY_FLAG = 2;
const WRAP_CURRY_FLAG = 8;
const WRAP_CURRY_RIGHT_FLAG = 16;
const WRAP_PARTIAL_FLAG = 32;
const WRAP_PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *    1 - `bind`
 *    2 - `bindKey`
 *    4 - `curry` or `curryRight` of a bound function
 *    8 - `curry`
 *   16 - `curryRight`
 *   32 - `partial`
 *   64 - `partialRight`
 *  128 - `rearg`
 *  256 - `ary`
 *  512 - `flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  const isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  let length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  let holdersRight;
  let partialsRight;
  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
    partialsRight = partials,
    holdersRight = holders;
    partials = holders = undefined;
  }
  const data = isBindKey ? undefined : getData(func);

  const newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === undefined
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
    bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
  }
  let result;
  if (!bitmask || bitmask == WRAP_BIND_FLAG) {
    result = createBind(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid(...newData);
  }
  const setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}

export default createWrap;
