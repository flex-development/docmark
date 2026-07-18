/**
 * @file ContainerState
 * @module docmark-util-types/ContainerState
 */

import type * as micromark from 'micromark-util-types'

/**
 * State shared between container calls.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ContainerState {
 *      custom?: boolean | null | undefined
 *    }
 *  }
 *
 * @see {@linkcode micromark.ContainerState}
 *
 * @extends {micromark.ContainerState}
 */
interface ContainerState extends micromark.ContainerState {
  /**
   * For block tag containers and type expressions,
   * the current tag name identifier.
   */
  tag?: string | undefined
}

export type { ContainerState as default }
