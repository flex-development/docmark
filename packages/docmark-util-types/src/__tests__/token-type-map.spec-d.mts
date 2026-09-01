/**
 * @file Type Tests - TokenTypeMap
 * @module docmark-util-types/tests/unit-d/TokenTypeMap
 */

import type * as micromark from 'micromark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../token-type-map.mts'

describe('unit-d:TokenTypeMap', () => {
  it('should extend micromark.TokenTypeMap', () => {
    expectTypeOf<TestSubject>().toExtend<micromark.TokenTypeMap>()
  })

  it('should match [blockTag: "blockTag"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('blockTag')
      .toEqualTypeOf<'blockTag'>()
  })

  it('should match [chunkComment: "chunkComment"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('chunkComment')
      .toEqualTypeOf<'chunkComment'>()
  })

  it('should match [chunkMarkdown: "chunkMarkdown"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('chunkMarkdown')
      .toEqualTypeOf<'chunkMarkdown'>()
  })

  it('should match [chunkType: "chunkType"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('chunkType')
      .toEqualTypeOf<'chunkType'>()
  })

  it('should match [comment: "comment"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<'comment'>()
  })

  it('should match [commentCloser: "commentCloser"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentCloser')
      .toEqualTypeOf<'commentCloser'>()
  })

  it('should match [commentLineMarker: "commentLineMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentLineMarker')
      .toEqualTypeOf<'commentLineMarker'>()
  })

  it('should match [commentLinePrefix: "commentLinePrefix"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentLinePrefix')
      .toEqualTypeOf<'commentLinePrefix'>()
  })

  it('should match [commentOpener: "commentOpener"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentOpener')
      .toEqualTypeOf<'commentOpener'>()
  })

  it('should match [commentPadding: "commentPadding"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('commentPadding')
      .toEqualTypeOf<'commentPadding'>()
  })

  it('should match [eoc: "eoc"]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('eoc').toEqualTypeOf<'eoc'>()
  })

  it('should match [identifier: "identifier"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('identifier')
      .toEqualTypeOf<'identifier'>()
  })

  it('should match [inlineTag: "inlineTag"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inlineTag')
      .toEqualTypeOf<'inlineTag'>()
  })

  it('should match [inlineTagMarker: "inlineTagMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inlineTagMarker')
      .toEqualTypeOf<'inlineTagMarker'>()
  })

  it('should match [inlineTagText: "inlineTagText"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('inlineTagText')
      .toEqualTypeOf<'inlineTagText'>()
  })

  it('should match [namepath: "namepath"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('namepath')
      .toEqualTypeOf<'namepath'>()
  })

  it('should match [namepathConnector: "namepathConnector"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('namepathConnector')
      .toEqualTypeOf<'namepathConnector'>()
  })

  it('should match [namepathIdentifier: "namepathIdentifier"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('namepathIdentifier')
      .toEqualTypeOf<'namepathIdentifier'>()
  })

  it('should match [namepathMarker: "namepathMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('namepathMarker')
      .toEqualTypeOf<'namepathMarker'>()
  })

  it('should match [null: never]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('null').toEqualTypeOf<never>()
  })

  it('should match [summary: "summary"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('summary')
      .toEqualTypeOf<'summary'>()
  })

  it('should match [summaryMarker: "summaryMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('summaryMarker')
      .toEqualTypeOf<'summaryMarker'>()
  })

  it('should match [tagName: "tagName"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tagName')
      .toEqualTypeOf<'tagName'>()
  })

  it('should match [tagNameIdentifier: "tagNameIdentifier"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tagNameIdentifier')
      .toEqualTypeOf<'tagNameIdentifier'>()
  })

  it('should match [tagNameMarker: "tagNameMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tagNameMarker')
      .toEqualTypeOf<'tagNameMarker'>()
  })

  it('should match [typeExpression: "typeExpression"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typeExpression')
      .toEqualTypeOf<'typeExpression'>()
  })

  it('should match [typeExpressionValue: "typeExpressionValue"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typeExpressionValue')
      .toEqualTypeOf<'typeExpressionValue'>()
  })

  it('should match [typeMetadata: "typeMetadata"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typeMetadata')
      .toEqualTypeOf<'typeMetadata'>()
  })

  it('should match [typeMetadataMarker: "typeMetadataMarker"]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('typeMetadataMarker')
      .toEqualTypeOf<'typeMetadataMarker'>()
  })
})
