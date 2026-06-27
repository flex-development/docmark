/**
 * @file Unit Tests - tagName
 * @module docmark/constructs/tests/unit/tagName
 */

import createPreprocess from '#lib/preprocess'
import initialize from '@fixtures/initialize.mts'
import { chars, ct } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { createTokenizer } from '@flex-development/mark-parser'
import type { Preprocess } from '@flex-development/mark/parse'
import snapshot from '@tests/utils/snapshot-events.mts'
import testSubject from '../tag-name.mts'

describe('unit:constructs/tagName', () => {
  let context: TokenizeContext
  let preprocess: Preprocess

  beforeAll(() => {
    preprocess = createPreprocess()
  })

  beforeEach(() => {
    context = createTokenizer({
      extensions: { [ct.string]: { null: testSubject } },
      initialize
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
    [chars.at],
    [chars.at + chars.exclamation],
    ['/* comment summary only */'],
    ['{@linkcode Code}']
  ])('should not produce events without tag names (%#)', slice => {
    // Act
    const result = context.write(preprocess(slice, null, true))

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<[slice: Chunk]>([
    ['@see'],
    ['@this {void}']
  ])('should tokenize tag names (%j)', slice => {
    // Act
    const result = context.write(preprocess(slice, null, true))

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
