/**
 * @file Functional Tests - summary
 * @module docmark/constructs/tests/functional/summary
 */

import { parse, preprocess } from '@flex-development/docmark'
import type { Chunk, FileLike } from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mjs'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('functional:constructs/summary', () => {
  let directory: string

  beforeAll(() => {
    directory = '__fixtures__/chunks/summary'
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['01-one-line.txt'],
    ['02-single-line.txt'],
    ['03-multiline.txt'],
    ['04-multiline.txt'],
    ['05-fenced-code.txt']
  ])('should tokenize comment summary (%j,%j)', (path, options) => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse(options).comment().write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(snapshot(result)).toMatchSnapshot()
  })
})
