/**
 * @file Type Tests - TokenizeContext
 * @module docmark-util-types/tests/unit-d/TokenizeContext
 */

import type {
  Code,
  Construct,
  ContainerState,
  DefineSkip,
  Event,
  Now,
  ParseContext,
  SliceSerialize,
  SliceStream,
  Write
} from '@flex-development/docmark-util-types'
import type TestSubject from '../tokenize-context.mts'

describe('unit-d:TokenizeContext', () => {
  it('should match [_contentTypeTextTrailing?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_contentTypeTextTrailing')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_gfmTasklistFirstContentOfListItem?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_gfmTasklistFirstContentOfListItem')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [code: Code]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('code').toEqualTypeOf<Code>()
  })

  it('should match [containerState?: ContainerState | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('containerState')
      .toEqualTypeOf<ContainerState | undefined>()
  })

  it('should match [currentConstruct?: Construct | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('currentConstruct')
      .toEqualTypeOf<Construct | undefined>()
  })

  it('should match [defineSkip: DefineSkip]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('defineSkip')
      .toEqualTypeOf<DefineSkip>()
  })

  it('should match [events: Event[]]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('events')
      .toEqualTypeOf<Event[]>()
  })

  it('should match [interrupt?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('interrupt')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [now: Now]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('now').toEqualTypeOf<Now>()
  })

  it('should match [parser: ParseContext]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('parser')
      .toEqualTypeOf<ParseContext>()
  })

  it('should match [previous: Code]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('previous').toEqualTypeOf<Code>()
  })

  it('should match [sliceSerialize: SliceSerialize]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sliceSerialize')
      .toEqualTypeOf<SliceSerialize>()
  })

  it('should match [sliceStream: SliceStream]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('sliceStream')
      .toEqualTypeOf<SliceStream>()
  })

  it('should match [write: Write]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('write').toEqualTypeOf<Write>()
  })
})
