/**
 * @file Type Tests - EncodingMap
 * @module docmark-util-types/tests/unit-d/EncodingMap
 */

import type TestSubject from '../encoding-map.mts'

describe('unit-d:EncodingMap', () => {
  it('should match [unicode: "unicode-1-1-utf-8"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unicode')
      .toEqualTypeOf<'unicode-1-1-utf-8'>()
  })

  it('should match [unknown: string & {}]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('unknown')
      .toEqualTypeOf<string & {}>()
  })

  it('should match [utf16: "utf16"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('utf16').toEqualTypeOf<'utf16'>()
  })

  it('should match [utf16be: "utf-16be" | "utf16be"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('utf16be')
      .toEqualTypeOf<'utf-16be' | 'utf16be'>()
  })

  it('should match [utf16le: "utf-16le" | "utf16le"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('utf16le')
      .toEqualTypeOf<'utf-16le' | 'utf16le'>()
  })

  it('should match [utf8: "utf-8" | "utf8"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('utf8')
      .toEqualTypeOf<'utf-8' | 'utf8'>()
  })
})
