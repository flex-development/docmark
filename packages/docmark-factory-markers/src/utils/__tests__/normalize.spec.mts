/**
 * @file Unit Tests - normalize
 * @module docmark-factory-markers/utils/tests/unit/normalize
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import { codes } from '@flex-development/docmark-util-symbol'
import type { Marker } from '@flex-development/docmark-util-types'
import { beforeAll, describe, expect, it } from 'vitest'
import testSubject from '../normalize.mts'

describe('unit:utils/normalize', () => {
  let code: Marker

  beforeAll(() => {
    code = codes.asterisk
  })

  it('should return `marker` if `marker` is an `Info` object', () => {
    // Arrange
    const marker: Info = { code }

    // Act + Expect
    expect(testSubject(marker)).to.eq(marker)
  })

  it('should return new comment marker info object', () => {
    // Act
    const result = testSubject(code)

    // Expect
    expect(result).not.eq(code)
    expect(result).to.have.property('code', code)
    expect(result).toMatchSnapshot()
  })
})
