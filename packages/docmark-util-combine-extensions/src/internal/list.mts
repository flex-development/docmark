/**
 * @file Internal - list
 * @module docmark-util-combine-extensions/internal/list
 */

/**
 * Convert `value` to a list.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to convert
 * @return {unknown[]}
 *  `value` or an array containing `value`
 */
function list(this: void, value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value]
}

export default list
