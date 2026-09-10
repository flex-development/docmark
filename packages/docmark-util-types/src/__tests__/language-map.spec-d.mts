/**
 * @file Type Tests - LanguageMap
 * @module docmark-util-types/tests/unit-d/LanguageMap
 */

import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language-map.mts'

describe('unit-d:LanguageMap', () => {
  it('should match [css: "css"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('css').toEqualTypeOf<'css'>()
  })

  it('should match [javascript: "js"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('javascript')
      .toEqualTypeOf<'js'>()
  })

  it('should match [jsonc: "jsonc"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('jsonc').toEqualTypeOf<'jsonc'>()
  })

  it('should match [markdown: "md"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('markdown').toEqualTypeOf<'md'>()
  })

  it('should match [mdx: "mdx"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('mdx').toEqualTypeOf<'mdx'>()
  })

  it('should match [null: never]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('null').toEqualTypeOf<never>()
  })

  it('should match [shell: "shell"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('shell').toEqualTypeOf<'shell'>()
  })

  it('should match [typescript: "ts"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typescript')
      .toEqualTypeOf<'ts'>()
  })

  it('should match [yaml: "yaml"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('yaml').toEqualTypeOf<'yaml'>()
  })
})
