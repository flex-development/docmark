/**
 * @file ModeMap
 * @module docmark-util-types/ModeMap
 */

/**
 * Registry of comment parsing modes.
 *
 * This interface can be augmented to register custom modes.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ModeMap {
 *      all: '*'
 *    }
 *  }
 */
interface ModeMap {
  documentation: 'documentation'
  null: null
}

export type { ModeMap as default }
