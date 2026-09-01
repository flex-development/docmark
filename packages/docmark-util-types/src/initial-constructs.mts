/**
 * @file InitialConstructs
 * @module docmark-util-types/InitialConstructs
 */

import type {
  ContentType,
  InitialConstruct
} from '@flex-development/docmark-util-types'

/**
 * Record where each key is {@linkcode ContentType},
 * and each value is an {@linkcode InitialConstruct}.
 */
type InitialConstructs = { [K in ContentType]: InitialConstruct }

export type { InitialConstructs as default }
