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

  it('should match [docblock: "docblock"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('docblock')
      .toEqualTypeOf<'docblock'>()
  })

  it('should match [line: "line"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('line').toEqualTypeOf<'line'>()
  })
})
