/**
 * @file Integration Tests - comment
 * @module docmark/initialize/tests/integration/comment
 */

import { parse, preprocess } from '@flex-development/docmark'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Disable,
  FileLike
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mjs'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:initialize/comment', () => {
  let directory: string

  beforeAll(() => {
    directory = '__fixtures__/chunks/lines'
  })

  it('should allow all comment constructs to be disabled', () => {
    // Arrange
    const disable: Disable = { null: [tt.blockTag, tt.summary] }
    const file: FileLike = read(pathe.join(directory, '05.txt'))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse({ extensions: [{ disable }] }).comment().write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.have.nested.property('1.type', tt.chunkMarkdown)
    expect(snapshot(result)).toMatchSnapshot()
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['01-empty.txt'],
    ['02-blanks.txt'],
    ['03-blanks.txt'],
    ['04.txt'],
    ['05.txt']
  ])('should parse comment lines (%j,%j)', (path, options) => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse(options).comment().write(slice)

    // Expect (conditional)
    if (result.length) {
      expect(result).to.have.property('length').be.at.least(2)
      expect(result).to.each.have.nested.property('1.start')
      expect(result).to.each.have.nested.property('1.end')
    }

    // Expect (snapshot)
    expect(snapshot(result)).toMatchSnapshot()
  })
})
