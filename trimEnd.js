import baseToString from './_baseToString.js';
import castSlice from './_castSlice.js';
import charsEndIndex from './_charsEndIndex.js';
import stringToArray from './_stringToArray.js';
import toString from './toString.js';

/** Used to match leading and trailing whitespace. */
const reTrimEnd = /\s+$/;

/**
 * Removes trailing whitespace or specified characters from `string`.
 *
 * @static
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * trimEnd('  abc  ');
 * // => '  abc'
 *
 * trimEnd('-_-abc-_-', '_-');
 * // => '-_-abc'
 */
function trimEnd(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrimEnd, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  const strSymbols = stringToArray(string);
  const end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
  return castSlice(strSymbols, 0, end).join('');
}

export default trimEnd;
