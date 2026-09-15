/**
 * @file Unit Tests - firstMarker
 * @module docmark-factory-block/internal/tests/unit/firstMarker
 */

import { codes } from '@flex-development/docmark-util-symbol'
import { describe, expect, it } from 'vitest'
import testSubject from '../first-marker.mts'

describe('unit:internal/firstMarker', () => {
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
  ])('should return first marker in `sequence` (%#)', sequence => {
    expect(testSubject(sequence)).toMatchSnapshot()
  })
})
