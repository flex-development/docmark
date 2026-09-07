/**
 * @file Type Tests - CommentKindMap
 * @module docmark-util-types/tests/unit-d/CommentKindMap
 */

import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../comment-kind-map.mts'

describe('unit-d:CommentKindMap', () => {
  it('should match [block: "block"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('block')
      .toEqualTypeOf<'block'>()
  })

  it('should match [docblock: "block:doc"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('docblock')
      .toEqualTypeOf<'block:doc'>()
  })

  it('should match [docslash: "slash:doc"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('docslash')
      .toEqualTypeOf<'slash:doc'>()
  })

  it('should match [hash: "hash"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('hash').toEqualTypeOf<'hash'>()
  })

  it('should match [hashbang: "hashbang"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('hashbang')
      .toEqualTypeOf<'hashbang'>()
  })

  it('should match [slash: "slash"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('slash')
      .toEqualTypeOf<'slash'>()
  })
})
