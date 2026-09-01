/**
 * @file CommentKindMap
 * @module docmark-util-types/CommentKindMap
 */

/**
 * Registry of comment kinds.
 *
 * Libraries and other tools can augment this interface to register custom
 * comment kinds.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface CommentKindMap {
 *      hashbang: 'hashbang'
 *    }
 *  }
 */
interface CommentKindMap {
  block: 'block'
  docblock: 'docblock'
  line: 'line'
}

export type { CommentKindMap as default }
