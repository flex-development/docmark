/**
 * @file Type Tests - TokenFields
 * @module docmark-util-types/tests/unit-d/TokenFields
 */

import type {
  ContentType,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import type TestSubject from '../token-fields.mts'

describe('unit-d:TokenFields', () => {
  it('should match [_balanced?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_balanced')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_close?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_close')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_container?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_container')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_contentTypeTextTrailing?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_contentTypeTextTrailing')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_inactive?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_inactive')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_isInFirstContentOfListItem?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_isInFirstContentOfListItem')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_loose?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_loose')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_open?: boolean | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_open')
      .toEqualTypeOf<boolean | undefined>()
  })

  it('should match [_tokenizer?: TokenizeContext | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('_tokenizer')
      .toEqualTypeOf<TokenizeContext | undefined>()
  })

  it('should match [contentType?: ContentType | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('contentType')
      .toEqualTypeOf<ContentType | undefined>()
  })

  it('should match [next?: Token | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('next')
      .toEqualTypeOf<Token | undefined>()
  })

  it('should match [previous?: Token | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('previous')
      .toEqualTypeOf<Token | undefined>()
  })
})
