/**
 * @file Unit Tests - normalize
 * @module docmark-factory-markers/utils/tests/unit/normalize
 */

import type { Info } from '@flex-development/docmark-factory-markers'
import { codes } from '@flex-development/docmark-util-symbol'
import type { Marker } from '@flex-development/docmark-util-types'
import type { CodeCheck } from '@flex-development/mark/parse'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import testSubject from '../normalize.mts'

describe('unit:utils/normalize', () => {
  let code: Marker
  let check: CodeCheck

  beforeAll(() => {
    code = codes.asterisk
    check = vi.fn(candidate => candidate === code).mockName('marker')
  })

  it('should return `marker` if `marker` is an `Info` object', () => {
    // Arrange
    const marker: Info = { code: codes.asterisk }

    // Act + Expect
    expect(testSubject(marker)).to.eq(marker)
  })

  it('should return new info object if `marker` is a `CodeCheck`', () => {
    // Act
    const result = testSubject(check)

    // Expect
    expect(result).not.eq(check)
    expect(result).to.have.property('code', check)
    expect(result).toMatchSnapshot()
  })

  it('should return new info object if `marker` is a `Marker`', () => {
    // Act
    const result = testSubject(code)

    // Expect
    expect(result).not.eq(code)
    expect(result).to.have.property('code', code)
    expect(result).toMatchSnapshot()
  })
})
