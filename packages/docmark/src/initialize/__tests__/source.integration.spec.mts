/**
 * @file Integration Tests - source
 * @module docmark/initialize/tests/integration/source
 */

import hashbang from '@fixtures/constructs/hashbang.mts'
import { parse, preprocess } from '@flex-development/docmark'
import { codes, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Disable,
  FileLike
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mjs'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:initialize/source', () => {
  let directory: string

  beforeAll(() => {
    directory = '__fixtures__/comments'
  })

  it('should allow all source constructs to be disabled', () => {
    // Arrange
    const disable: Disable = { null: [tt.comment] }
    const file: FileLike = read(pathe.join(directory, '23-many.txt'))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse({ extensions: [{ disable }] }).source().write(slice)

    // Expect
    expect(result).to.have.property('length', 2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.have.nested.property('1.type', tt.eoc)
    expect(snapshot(result)).toMatchSnapshot()
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['01-empty.txt'],
    ['02-empty.txt'],
    ['03-empty.txt'],
    ['04-empty.txt'],
    ['05-empty.txt'],
    ['06-empty.txt'],
    ['07-empty.txt'],
    ['08-empty.txt'],
    ['09-empty.txt'],
    ['10-empty.txt'],
    ['11-opener-only.txt'],
    ['12-opener-only.txt'],
    ['13-unterminated.txt'],
    ['14-unterminated.txt'],
    ['15-oneliner.txt'],
    ['16-multiline.txt'],
    ['17-multiline.txt'],
    ['18-multiline.txt'],
    ['19-fenced-code.txt'],
    ['20-fenced-code.txt'],
    ['21-indented-code.txt'],
    ['22-many.txt'],
    ['23-many.txt'],
    [
      'custom.txt',
      {
        extensions: [{ source: { [codes.numberSign]: hashbang } }]
      }
    ]
  ])('should parse source comments (%j)', (path, options) => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse(options).source().write(slice)
    const beforeLast = result.at(-2)
    const last = result.at(-1)

    // Expect (conditional)
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(beforeLast).to.be.an('array')
    expect(beforeLast).to.have.property('0', ev.enter)
    expect(beforeLast).to.have.nested.property('1.type', tt.eoc)
    expect(last).to.be.an('array').but.not.eq(beforeLast)
    expect(last).to.have.property('0', ev.exit)
    expect(last).to.have.property('1', beforeLast![1])
    expect(snapshot(result)).toMatchSnapshot()
  })
})
