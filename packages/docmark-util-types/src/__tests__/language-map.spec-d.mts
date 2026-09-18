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

  it('should match [html: "html"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('html').toEqualTypeOf<'html'>()
  })

  it('should match [javascript: "javascript"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('javascript')
      .toEqualTypeOf<'javascript'>()
  })

  it('should match [json5: "json5"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('json5').toEqualTypeOf<'json5'>()
  })

  it('should match [jsonc: "jsonc"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('jsonc').toEqualTypeOf<'jsonc'>()
  })

  it('should match [markdown: "markdown"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('markdown')
      .toEqualTypeOf<'markdown'>()
  })

  it('should match [mdx: "mdx"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('mdx').toEqualTypeOf<'mdx'>()
  })

  it('should match [null: never]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('null').toEqualTypeOf<never>()
  })

  it('should match [sass: "sass"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('sass').toEqualTypeOf<'sass'>()
  })

  it('should match [scss: "scss"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('scss').toEqualTypeOf<'scss'>()
  })

  it('should match [shell: "shell"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('shell').toEqualTypeOf<'shell'>()
  })

  it('should match [typescript: "typescript"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typescript')
      .toEqualTypeOf<'typescript'>()
  })

  it('should match [xml: "xml"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('xml').toEqualTypeOf<'xml'>()
  })

  it('should match [yaml: "yaml"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('yaml').toEqualTypeOf<'yaml'>()
  })
})
