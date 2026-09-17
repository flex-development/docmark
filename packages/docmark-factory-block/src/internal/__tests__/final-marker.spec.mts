/**
 * @file Unit Tests - finalMarker
 * @module docmark-factory-block/internal/tests/unit/finalMarker
 */

import { codes } from '@flex-development/docmark-util-symbol'
import { describe, expect, it } from 'vitest'
import testSubject from '../final-marker.mts'

describe('unit:internal/finalMarker', () => {
  it.each<Parameters<typeof testSubject>>([
    [codes.numberSign],
    [[codes.lessThan, codes.exclamationMark, codes.dash, codes.dash]],
    [
      [
        { code: codes.slash },
        { code: codes.asterisk },
        { code: codes.asterisk, optional: true }
      ]
    ]
  ])('should return last marker in `sequence` (%#)', sequence => {
    expect(testSubject(sequence)).toMatchSnapshot()
  })
})
