/**
 * @file InitialConstructs
 * @module docmark-util-types/InitialConstructs
 */

import type {
  ContentType,
  InitialConstruct
} from '@flex-development/docmark-util-types'

/**
 * Record where each key is {@linkcode ContentType}
 * and each value is an {@linkcode InitialConstruct}.
 *
 * The initial `language` construct is optional.
 */
type InitialConstructs = {
  [K in Exclude<ContentType, 'language'>]: InitialConstruct
} & {
  [K in Extract<ContentType, 'language'>]?: InitialConstruct | undefined
}

export type { InitialConstructs as default }
