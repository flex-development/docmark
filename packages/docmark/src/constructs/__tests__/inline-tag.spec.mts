/**
 * @file Unit Tests - inlineTag
 * @module docmark/constructs/tests/unit/inlineTag
 */

import createPreprocess from '#lib/preprocess'
import initialize from '@fixtures/initialize.mts'
import { chars, codes, ct, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { createTokenizer } from '@flex-development/mark-parser'
import type { Preprocess } from '@flex-development/mark/parse'
import snapshot from '@tests/utils/snapshot-events.mts'
import testSubject from '../inline-tag.mts'

describe('unit:constructs/inlineTag', () => {
  let context: TokenizeContext
  let preprocess: Preprocess

  beforeAll(() => {
    preprocess = createPreprocess()
  })

  beforeEach(() => {
    context = createTokenizer({
      extensions: { [ct.text]: { [codes.leftBrace]: testSubject } },
      initialize
    })

    context = context.parser.text()
  })

  it('should be named `Construct`', () => {
    expect(testSubject).to.have.property('name', tt.inlineTag)
    expect(testSubject).to.have.property('tokenize').be.a('function')
    expect(testSubject.tokenize.name).to.eq('tokenizeInlineTag')
  })

  it.each<[slice: Chunk]>([
    ['@this {void}'],
    ['\\{@linkcode Code}'],
    ['{@linkcode']
  ])('should not produce events without inline tags (%#)', slice => {
    // Act
    const result = context.write(preprocess(slice, null, true))

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<[slice: Chunk]>([
    ['{@linkcode Code}'],
    ['{@linkcode' + chars.ht + '{Code\\}}'],
    ['Consume parser {@linkcode Event}s']
  ])('should tokenize inline tags (%j)', slice => {
    // Act
    const result = context.write(preprocess(slice, null, true))

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
