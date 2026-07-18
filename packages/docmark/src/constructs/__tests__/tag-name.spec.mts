/**
 * @file Unit Tests - tagName
 * @module docmark/constructs/tests/unit/tagName
 */

import preprocess from '#lib/preprocess'
import initialize from '@fixtures/initialize.mts'
import { codes, ct } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Preprocessor,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { createTokenizer } from '@flex-development/mark-parser'
import snapshot from '@tests/utils/snapshot-events.mts'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import testSubject from '../tag-name.mts'

describe('unit:constructs/tagName', () => {
  let context: TokenizeContext
  let pre: Preprocessor

  beforeAll(() => {
    pre = preprocess()
  })

  beforeEach(() => {
    context = createTokenizer({
      extensions: { [ct.string]: { [codes.atSign]: testSubject } },
      initialize,
      noEmptyTokens: true,
      noPrevious: true
    })

    context = context.parser.string()
  })

  it('should be unnamed partial `Construct`', () => {
    expect(testSubject).to.not.have.property('name')
    expect(testSubject).to.have.property('partial').be.true
    expect(testSubject).to.have.property('tokenize').be.a('function')
    expect(testSubject.tokenize.name).to.eq('tokenizeTagName')
  })

  it.each<[slice: Chunk]>([
    [''],
    ['@'],
    ['@13'],
    ['\\@unicornware'],
    ['{@linkcode Code}']
  ])('should not produce events without tag names (%j)', slice => {
    // Act
    const result = context.write(pre(slice, null, true))

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<[slice: Chunk]>([
    ['@Component'],
    ['@alpha1'],
    ['@override'],
    ['@packageDocumentation'],
    ['@private_remarks']
  ])('should tokenize tag names (%j)', slice => {
    // Act
    const result = context.write(pre(slice, null, true))

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
