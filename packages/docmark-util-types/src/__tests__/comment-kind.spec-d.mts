/**
 * @file Type Tests - CommentKind
 * @module docmark-util-types/tests/unit-d/CommentKind
 */

import type { CommentKindMap } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../comment-kind.mts'

describe('unit-d:CommentKind', () => {
  it('should equal CommentKindMap[keyof CommentKindMap]', () => {
    // Arrange
    type Expect = CommentKindMap[keyof CommentKindMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
