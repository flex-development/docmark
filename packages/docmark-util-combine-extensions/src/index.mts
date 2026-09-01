/**
 * @file combineExtensions
 * @module docmark-util-combine-extensions
 */

import type {
  AnyExtension,
  NormalizedExtension
} from '@flex-development/docmark-util-types'
import { splice } from '@flex-development/mark-util-chunked'
import { ok } from 'devlop'

export { combineExtensions, combineExtensions as default }

/**
 * Combine multiple extensions into one.
 *
 * @see {@linkcode AnyExtension}
 * @see {@linkcode NormalizedExtension}
 *
 * @template {NormalizedExtension} T
 *  The combined extension
 *
 * @param {AnyExtension | AnyExtension[] | null | undefined} extensions
 *  The extension or list of extensions
 * @return {T}
 *  The combined extension
 */
function combineExtensions<T extends NormalizedExtension>(
  extensions: AnyExtension | AnyExtension[] | null | undefined
): T

/**
 * Combine multiple extensions into one.
 *
 * @see {@linkcode AnyExtension}
 * @see {@linkcode NormalizedExtension}
 *
 * @template {NormalizedExtension} T
 *  The combined extension
 *
 * @param {(AnyExtension | AnyExtension[] | null | undefined)[]} extensions
 *  The extensions to combine
 * @return {T}
 *  The combined extension
 */
function combineExtensions<T extends NormalizedExtension>(
  ...extensions: (AnyExtension | AnyExtension[] | null | undefined)[]
): T

/**
 * Combine multiple extensions into one.
 *
 * @see {@linkcode AnyExtension}
 * @see {@linkcode NormalizedExtension}
 *
 * @template {NormalizedExtension} T
 *  The combined extension
 *
 * @param {AnyExtension | AnyExtension[] | null | undefined} extensions
 *  The extension or list of extensions
 * @param {(AnyExtension | AnyExtension[] | null | undefined)[]} sources
 *  The extensions to combine
 * @return {T}
 *  The combined extension
 */
function combineExtensions<T extends NormalizedExtension>(
  extensions: AnyExtension | AnyExtension[] | null | undefined,
  ...sources: (AnyExtension | AnyExtension[] | null | undefined)[]
): T {
  /**
   * The combined extension.
   *
   * @const {NormalizedExtension} all
   */
  const all: NormalizedExtension = {}

  /**
   * The list of syntax extensions.
   *
   * @const {AnyExtension[]} list
   */
  const list: AnyExtension[] = [extensions, ...sources].filter(s => !!s).flat()

  /**
   * The index of the current extension.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < list.length) {
    /**
     * The current extension.
     *
     * @const {AnyExtension | undefined} extension
     */
    const extension: AnyExtension | undefined = list[index]

    /**
     * The current hook name.
     *
     * @var {keyof AnyExtension} hook
     */
    let hook: keyof AnyExtension

    for (hook in (ok(extension, 'expected `extension`'), extension)) {
      /**
       * The field value of the combined extension.
       *
       * @const {ExtensionField} maybe
       */
      const maybe: ExtensionField = Object.hasOwnProperty.call(all, hook)
        ? all[hook]
        : undefined

      /**
       * The current field value.
       *
       * @const {NonNullable<ExtensionField>} left
       */
      const left: NonNullable<ExtensionField> = maybe ?? (all[hook] = {})

      /**
       * The incoming field value.
       *
       * @const {ExtensionField} right
       */
      const right: ExtensionField = extension[hook]

      if (right) {
        /**
         * The current key.
         *
         * @var {keyof NonNullable<ExtensionField>} code
         */
        let key: keyof NonNullable<ExtensionField>

        for (key in right) {
          if (!Object.hasOwnProperty.call(left, key)) left[key] = []
          merge(toList(left[key]!), toList(right[key] ?? []))
        }
      }
    }
  }

  return all as T
}

/**
 * Union of extension field values.
 *
 * @internal
 */
type ExtensionField = AnyExtension[keyof AnyExtension]

/**
 * Convert `T` to a list.
 *
 * @internal
 *
 * @template {any} T
 *  The value to convert
 */
type ToList<T> = T extends readonly (infer U)[] ? U[] : T[]

/**
 * Merge `list` into `existing`.
 *
 * > 👉 Mutates `existing`.
 *
 * @this {void}
 *
 * @param {unknown[]} existing
 *  The list to merge into
 * @param {unknown[]} list
 *  The list to merge
 * @return {undefined}
 */
function merge(
  this: void,
  existing: unknown[],
  list: unknown[]
): undefined {
  /**
   * The items to inject into the existing list.
   *
   * @const {unknown[]} before
   */
  const before: unknown[] = []

  /**
   * The current index in the merge list.
   *
   * @var {number} index
   */
  let index: number = -1

  while (++index < list.length) { // @ts-expect-error might be a construct.
    ;(list[index]!.add === 'after' ? existing : before).push(list[index])
  }

  return void splice(existing, 0, 0, before)
}

/**
 * Convert `value` to a list.
 *
 * @template {any} T
 *  The value to convert
 *
 * @this {void}
 *
 * @param {unknown} value
 *  The value to convert
 * @return {ToList<T>}
 *  `value` or an array containing `value`
 */
function toList<T>(this: void, value: T): ToList<T> {
  return (Array.isArray(value) ? value : [value]) as ToList<T>
}
