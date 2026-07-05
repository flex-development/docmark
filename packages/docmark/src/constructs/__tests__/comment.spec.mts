/**
 * @file Unit Tests - comment
 * @module docmark/constructs/tests/unit/comment
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
import type { FileLike } from '@flex-development/mark/parse'
import snapshot from '@tests/utils/snapshot-events.mts'
import { readSync as read } from 'to-vfile'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import testSubject from '../comment.mts'

describe('unit:constructs/comment', () => {
  let context: TokenizeContext
  let pre: Preprocessor

  beforeAll(() => {
    pre = preprocess()
  })

  beforeEach(() => {
    context = createTokenizer({
      extensions: { [ct.source]: { [codes.slash]: testSubject } },
      initialize
    })

    context = context.parser.source()
  })

  it('should be unnamed `Construct`', () => {
    expect(testSubject).to.not.have.property('name')
    expect(testSubject).to.have.property('tokenize').be.a('function')
    expect(testSubject.tokenize.name).to.eq('tokenizeComment')
  })

  it.each<[slice: Chunk]>([
    ['/* multiline comment */'],
    ['// single line comment'],
    ['\\/** nope */']
  ])('should not produce events without comments (%#)', slice => {
    // Act
    const result = context.write(pre(slice, null, true))

    // Expect
    expect(result).to.be.an('array').that.is.empty
  })

  it.each<[path: string]>([
    ['comment01-empty.txt'],
    ['comment02-empty.txt'],
    ['comment03-empty.txt'],
    ['comment04-opener-only.txt'],
    ['comment05-no-closer.txt'],
    ['comment06-no-markers.txt'],
    ['comment07-no-markers.txt'],
    ['comment08-bad-formatting.txt'],
    ['comment09.txt']
  ])('should tokenize comments (%j)', path => {
    // Arrange
    const file: FileLike = read('__fixtures__/comments/' + path, 'utf8')
    const slice: Chunk[] = pre(file, null, true)

    // Act
    const result = context.write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
