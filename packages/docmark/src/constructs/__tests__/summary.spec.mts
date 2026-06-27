/**
 * @file Unit Tests - summary
 * @module docmark/constructs/tests/unit/summary
 */

import createPreprocess from '#lib/preprocess'
import initialize from '@fixtures/initialize.mts'
import { ct } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { createTokenizer } from '@flex-development/mark-parser'
import type { FileLike, Preprocess } from '@flex-development/mark/parse'
import snapshot from '@tests/utils/snapshot-events.mts'
import { readSync as read } from 'to-vfile'
import testSubject from '../summary.mts'

describe('unit:constructs/summary', () => {
  let context: TokenizeContext
  let preprocess: Preprocess

  beforeAll(() => {
    preprocess = createPreprocess()
  })

  beforeEach(() => {
    context = createTokenizer({
      extensions: { [ct.comment]: { null: testSubject } },
      initialize
    })

    context = context.parser.comment()
    context.summaryAllowed = true
  })

  it('should be unnamed `Construct`', () => {
    expect(testSubject).to.not.have.property('name')
    expect(testSubject).to.have.property('tokenize').be.a('function')
    expect(testSubject.tokenize.name).to.eq('tokenizeSummary')
  })

  it.each<[path: string]>([
    ['chunks01-empty.txt'],
    ['chunks02-tags-only.txt']
  ])('should not produce events without comment summary (%j)', path => {
    // Arrange
    const file: FileLike = read('__fixtures__/chunks/' + path, 'utf8')
    const slice: Code[] = preprocess(file, null, true)

    // Act + Expect
    expect(context.write(slice)).to.be.an('array').that.is.empty
  })

  it.each<[path: string]>([
    ['chunks03-at.txt'],
    ['chunks04-tag-interruption.txt'],
    ['chunks05-summary-and-tags.txt'],
    ['chunks06-summary-and-tags.txt']
  ])('should tokenize comment summary (%j)', path => {
    // Arrange
    const file: FileLike = read('__fixtures__/chunks/' + path, 'utf8')
    const slice: Code[] = preprocess(file, null, true)

    // Act
    const result = context.write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
