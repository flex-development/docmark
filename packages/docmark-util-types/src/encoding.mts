/**
 * @file Type Aliases - Encoding
 * @module mark/parse/types/Encoding
 */

import type { EncodingMap } from '@flex-development/mark/parse'

/**
 * Union of encodings supported by {@linkcode TextDecoder}.
 *
 * > 👉 **Note**: Arbitrary encodings can be supported depending on how an
 * > engine is built, so any string *could* be valid.
 *
 * To register custom encodings, augment {@linkcode EncodingMap}.
 * They will be added to this union automatically.
 */
type Encoding = EncodingMap[keyof EncodingMap]

export type { Encoding as default }
