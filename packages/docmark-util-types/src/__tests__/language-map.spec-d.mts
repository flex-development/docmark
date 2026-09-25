/**
 * @file Type Tests - LanguageMap
 * @module docmark-util-types/tests/unit-d/LanguageMap
 */

import type { RequiredKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../language-map.mts'

describe('unit-d:LanguageMap', () => {
  type Required = RequiredKeys<TestSubject>

  it('should match [css: "css"]', () => {
    expectTypeOf<Required>().extract<'css'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('css').toEqualTypeOf<'css'>()
  })

  it('should match [html: "html"]', () => {
    expectTypeOf<Required>().extract<'html'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('html').toEqualTypeOf<'html'>()
  })

  it('should match [javascript: "javascript"]', () => {
    expectTypeOf<Required>().extract<'javascript'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('javascript')
      .toEqualTypeOf<'javascript'>()
  })

  it('should match [json5: "json5"]', () => {
    expectTypeOf<Required>().extract<'json5'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('json5').toEqualTypeOf<'json5'>()
  })

  it('should match [jsonc: "jsonc"]', () => {
    expectTypeOf<Required>().extract<'jsonc'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('jsonc').toEqualTypeOf<'jsonc'>()
  })

  it('should match [markdown: "markdown"]', () => {
    expectTypeOf<Required>().extract<'markdown'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('markdown')
      .toEqualTypeOf<'markdown'>()
  })

  it('should match [mdx: "mdx"]', () => {
    expectTypeOf<Required>().extract<'mdx'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('mdx').toEqualTypeOf<'mdx'>()
  })

  it('should match [null: never]', () => {
    expectTypeOf<Required>().extract<'null'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('null').toEqualTypeOf<never>()
  })

  it('should match [sass: "sass"]', () => {
    expectTypeOf<Required>().extract<'sass'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('sass').toEqualTypeOf<'sass'>()
  })

  it('should match [shell: "shell"]', () => {
    expectTypeOf<Required>().extract<'shell'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('shell').toEqualTypeOf<'shell'>()
  })

  it('should match [typescript: "typescript"]', () => {
    expectTypeOf<Required>().extract<'typescript'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('typescript')
      .toEqualTypeOf<'typescript'>()
  })

  it('should match [xml: "xml"]', () => {
    expectTypeOf<Required>().extract<'xml'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('xml').toEqualTypeOf<'xml'>()
  })

  it('should match [yaml: "yaml"]', () => {
    expectTypeOf<Required>().extract<'yaml'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('yaml').toEqualTypeOf<'yaml'>()
  })
})
