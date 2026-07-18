/**
 * @file Unit Tests - inlineTag
 * @module docmark/constructs/tests/unit/inlineTag
 */

import preprocess from '#lib/preprocess'
import initialize from '@fixtures/initialize.mts'
import { codes, ct, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Preprocessor,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { createTokenizer } from '@flex-development/mark-parser'
import snapshot from '@tests/utils/snapshot-events.mts'
import { readSync as read } from 'to-vfile'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import testSubject from '../inline-tag.mts'

describe('unit:constructs/inlineTag', () => {
  let context: TokenizeContext
  let pre: Preprocessor

  beforeAll(() => {
    pre = preprocess()
  })

  beforeEach(() => {
    context = createTokenizer({
      extensions: { [ct.text]: { [codes.leftCurlyBrace]: testSubject } },
      initialize,
      noEmptyTokens: true,
      noPrevious: true
    })

    context = context.parser.text()
  })

  it('should be named `Construct`', () => {
    expect(testSubject).to.have.property('name', tt.inlineTag)
    expect(testSubject).to.have.property('tokenize').be.a('function')
    expect(testSubject.tokenize.name).to.eq('tokenizeInlineTag')
  })

  it.each<[slice: Chunk]>([
    [''],
    ['{'],
    ['}'],
    ['{}'],
    ['{ @linkcode Code}'],
    ['{\\@linkcode Code}'],
    ['\\{@linkcode Code}'],
    ['{@linkcode Code'],
    ['{@linkcode Code\u0000}'],
    ['{@linkcode Code\u0001}'],
    ['{@linkcode Code\u0008}'],
    ['{@linkcode Code\u000b}'],
    ['{@linkcode Code\u000c}'],
    ['{@linkcode Code\u007f}'],
    ['{@linkcode Code\\}']
  ])('should not produce events without inline tags (%j)', slice => {
    // Act
    const result = context.write(pre(slice, null, true))

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<[path: string]>([
    ['01-namepath.txt'],
    ['02-namepath.txt'],
    ['03-namepath.txt'],
    ['04-namepath.txt'],
    ['05-namepath.txt'],
    ['06-namepath.txt'],
    ['07-namepaths.txt'],
    ['08-namepaths.txt'],
    ['09-tag-only.txt'],
    ['10-inside-braces.txt'],
    ['11-inside-block-tag.txt'],
    ['12-inside-summary.txt'],
    ['13-escaped-closer.txt'],
    ['14-escaped-closers.txt']
  ])('should tokenize inline tags (%j)', path => {
    path = '__fixtures__/chunks/inline-tags/' + path

    // Arrange
    const slice: Chunk[] = pre(read(path), null, true)

    // Act
    const result = context.write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
