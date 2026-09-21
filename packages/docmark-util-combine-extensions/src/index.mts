/**
 * @file combineExtensions
 * @module docmark-util-combine-extensions
 */

import type {
  AnyExtension,
  Extension,
  NormalizedExtension,
  Settings
} from '@flex-development/docmark-util-types'
import { splice } from '@flex-development/mark-util-chunked'
import { ok } from 'devlop'
import list from './internal/list.mts'
import merge from './internal/merge.mts'

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
   * The index of the current extension.
   *
   * @var {number} index
   */
  let index: number = -1

  // normalize the list of syntax extensions.
  extensions = [extensions, ...sources].filter(s => !!s).flat()

  // merge extensions into `all`.
  while (++index < extensions.length) {
    /**
     * The current extension.
     *
     * @const {Extension | undefined} extension
     */
    const extension: Extension | undefined = (extensions as Extension[])[index]

    /**
     * The current hook name.
     *
     * @var {keyof Extension} hook
     */
    let hook: keyof Extension

    ok(extension, 'expected `extension`')

    for (hook in extension) {
      // merge `settings` fields as objects.
      if (hook === 'settings') {
        all[hook] = merge(all[hook], extension[hook])
        continue
      }

      /**
       * The field value of the combined extension.
       *
       * @const {NonSettingsField | undefined} maybe
       */
      const maybe: NonSettingsField | undefined =
        Object.hasOwnProperty.call(all, hook) ? all[hook] : undefined

      /**
       * The current top-level extension field value.
       *
       * @const {NonSettingsField} left
       */
      const left: NonSettingsField = maybe ?? (all[hook] = {})

      /**
       * The incoming top-level extension field value.
       *
       * @const {NonSettingsField | undefined} right
       */
      const right: NonSettingsField | undefined = extension[hook]

      if (right) {
        /**
         * The current extension field key.
         *
         * @var {keyof NonSettingsField} key
         */
        let key: keyof NonSettingsField

        for (key in right) {
          if (!Object.hasOwnProperty.call(left, key)) left[key] = []
          lists(list(left[key]!), list(right[key] ?? []))
        }
      }
    }
  }

  return all as T
}

/**
 * Union of extension field values that are not extension settings.
 *
 * @internal
 */
type NonSettingsField = NonNullable<Exclude<
  Extension[keyof Extension],
  Settings
>>

/**
 * Merge `list` into `existing` (both lists of constructs, partial constructs,
 * or character codes).
 *
 * > 👉 **Note**: Mutates `existing`.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {unknown[]} existing
 *  The list to merge into
 * @param {unknown[]} list
 *  The list to merge
 * @return {undefined}
 */
function lists(
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
