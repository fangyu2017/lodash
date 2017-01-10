import baseFindIndex from './_baseFindIndex.js';
import baseIsNaN from './_baseIsNaN.js';
import strictLastIndexOf from './_strictLastIndexOf.js';
import toInteger from './toInteger.js';

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMax = Math.max;
const nativeMin = Math.min;

/**
 * This method is like `indexOf` except that it iterates over elements of
 * `array` from right to left.
 *
 * @static
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * lastIndexOf([1, 2, 1, 2], 2);
 * // => 3
 *
 * // Search from the `fromIndex`.
 * lastIndexOf([1, 2, 1, 2], 2, 2);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }
  return value === value
    ? strictLastIndexOf(array, value, index)
    : baseFindIndex(array, baseIsNaN, index, true);
}

export default lastIndexOf;
