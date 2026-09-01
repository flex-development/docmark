/**
 * @file CommentKind
 * @module docmark-util-types/CommentKind
 */

import type { CommentKindMap } from '@flex-development/docmark-util-types'

/**
 * Union of registered comment kinds.
 *
 * To register custom comment kinds, augment {@linkcode CommentKindMap}.
 * They will be added to this union automatically.
 */
type CommentKind = CommentKindMap[keyof CommentKindMap]

export type { CommentKind as default }
