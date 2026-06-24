/**
 * @file Type Tests - Construct
 * @module docmark-util-types/tests/unit-d/Construct
 */

import type {
  ConstructPosition,
  Exiter,
  Previous,
  Resolver,
  Tokenizer
} from '@flex-development/docmark-util-types'
import type TestSubject from '../construct.mts'

describe('unit-d:interfaces/Construct', () => {
  it('should match [add?: ConstructPosition | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('add')
      .toEqualTypeOf<ConstructPosition | undefined>()
  })

  it('should match [concrete?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('concrete')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [continuation?: Construct | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('continuation')
      .toEqualTypeOf<TestSubject | undefined>()
  })

  it('should match [exit?: Exiter | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('exit')
      .toEqualTypeOf<Exiter | undefined>()
  })

  it('should match [name?: string | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('name')
      .toEqualTypeOf<string | undefined>()
  })

  it('should match [partial?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('partial')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [previous?: Previous | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('previous')
      .toEqualTypeOf<Previous | undefined>()
  })

  it('should match [resolve?: Resolver | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('resolve')
      .toEqualTypeOf<Resolver | undefined>()
  })

  it('should match [resolveAll?: Resolver | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('resolveAll')
      .toEqualTypeOf<Resolver | undefined>()
  })

  it('should match [resolveTo?: Resolver | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('resolveTo')
      .toEqualTypeOf<Resolver | undefined>()
  })

  it('should match [tokenize: Tokenizer]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tokenize')
      .toEqualTypeOf<Tokenizer>()
  })
})
