/**
 * @file Type Tests - Extension
 * @module docmark-util-types/tests/unit-d/Extension
 */

import type {
  AttentionMarkers,
  ConstructRecord,
  Disable,
  InsideSpan
} from '@flex-development/docmark-util-types'
import type TestSubject from '../extension.mts'

describe('unit-d:interfaces/Extension', () => {
  it('should match [attentionMarkers?: AttentionMarkers | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('attentionMarkers')
      .toEqualTypeOf<AttentionMarkers | undefined>()
  })

  it('should match [comment?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [content?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('content')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [contentInitial?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('contentInitial')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [disable?: Disable | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('disable')
      .toEqualTypeOf<Disable | undefined>()
  })

  it('should match [document?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('document')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [flow?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('flow')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [flowInitial?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('flowInitial')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [insideSpan?: InsideSpan | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('insideSpan')
      .toEqualTypeOf<InsideSpan | undefined>()
  })

  it('should match [source?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('source')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [string?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('string')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })

  it('should match [text?: ConstructRecord | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('text')
      .toEqualTypeOf<ConstructRecord | undefined>()
  })
})
