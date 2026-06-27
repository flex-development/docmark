/**
 * @file EncodingMap
 * @module docmark-util-types/EncodingMap
 */

/**
 * Registry of encodings supported by {@linkcode TextDecoder}.
 *
 * > 👉 **Note**: Arbitrary encodings can be supported depending on how an
 * > engine is built, so any string *could* be valid.
 *
 * This interface can be augmented to register custom encodings.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface EncodingMap {
 *      custom: 'custom'
 *    }
 *  }
 *
 * @see https://nodejs.org/api/util.html#whatwg-supported-encodings
 */
interface EncodingMap {
  unicode: 'unicode-1-1-utf-8' // always supported in node
  unknown: string & {} // everything else (depends on browser, or full ICU data)
  utf16: 'utf16' // always supported in node
  utf16be: 'utf-16be' | 'utf16be' // not supported when ICU is disabled
  utf16le: 'utf-16le' | 'utf16le' // always supported in node
  utf8: 'utf-8' | 'utf8' // always supported in node
}

export type { EncodingMap as default }
