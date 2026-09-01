/**
 * @file Unit Tests - api
 * @module docmark-util-combine-extensions/tests/unit/api
 */

import consumeThenFail from '#fixtures/consume-then-fail'
import consumeThenSucc from '#fixtures/consume-then-succ'
import eventsThenSucc from '#fixtures/events-then-succ'
import { summary, typeExpressionValue } from '@flex-development/docmark-grammar'
import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type { AnyExtension } from '@flex-development/docmark-util-types'
import { describe, expect, it } from 'vitest'
import testSubject from '../index.mts'

describe('unit:docmark-util-combine-extensions', () => {
  type Combinable = AnyExtension | AnyExtension[] | null | undefined

  it.each<[extension: Combinable, ...sources: Combinable[]]>([
    [null],
    [{}, undefined],
    [{ disable: { null: [] } }, { disable: undefined }],
    [{ disable: { null: [tt.eoc] } }, { disable: { null: ['fail'] } }],
    [
      {
        [constants.contentTypeComment]: { null: summary }
      },
      {
        [constants.contentTypeType]: { null: typeExpressionValue }
      }
    ],
    [
      {
        [constants.contentTypeDocument]: { [codes.lowercaseA]: consumeThenSucc }
      },
      {
        [constants.contentTypeDocument]: { [codes.lowercaseA]: undefined }
      }
    ],
    [
      {
        [constants.contentTypeDocument]: { [codes.lowercaseB]: eventsThenSucc }
      },
      {
        [constants.contentTypeDocument]: { [codes.lowercaseB]: consumeThenSucc }
      }
    ],
    [
      {
        [constants.contentTypeType]: { null: typeExpressionValue }
      },
      {
        [constants.contentTypeType]: {
          null: [consumeThenSucc, consumeThenFail]
        }
      }
    ]
  ])('should return combined extension (%#)', (extension, ...sources) => {
    expect(testSubject(extension, ...sources)).toMatchSnapshot()
  })
})
