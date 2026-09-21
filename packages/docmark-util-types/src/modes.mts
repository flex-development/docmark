/**
 * @file Modes
 * @module docmark-util-types/Modes
 */

import type { CommentKind, Mode } from '@flex-development/docmark-util-types'

/**
 * Record where each key is a registered {@linkcode CommentKind}
 * and each value is a registered comment parsing {@linkcode Mode}.
 */
type Modes = { [K in CommentKind]?: Mode | null | undefined }

export type { Modes as default }
