/**
 * @file Functional Tests - blockTag
 * @module docmark/constructs/tests/functional/blockTag
 */

import { parse, preprocess } from '@flex-development/docmark'
import { tt } from '@flex-development/docmark-util-symbol'
import type { Chunk, FileLike } from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mjs'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('functional:constructs/blockTag', () => {
  let directory: string

  beforeAll(() => {
    directory = '__fixtures__/chunks/block-tags'
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['01-tag-only.txt'],
    ['02-type-metadata.txt'],
    ['03-type-metadata.txt'],
    ['04-type-metadata.txt'],
    ['05-type-metadata.txt'],
    ['06-type-metadata.txt'],
    ['07-type-metadata.txt'],
    ['09-type-metadata.txt'],
    ['09-type-metadata.txt'],
    ['10-type-metadata.txt'],
    ['11-tag-and-flow.txt'],
    ['12-modifiers.txt'],
    ['13-modifiers-with-flow.txt'],
    ['14-adjacent.txt'],
    ['15-adjacent.txt'],
    ['16-fenced-code.txt'],
    ['17-fenced-code.txt'],
    ['18-indented-code.txt'],
    ['19-list.txt'],
    ['20-many.txt']
  ])('should tokenize block tags (%j,%j)', (path, options) => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse(options).comment().write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.not.have.nested.property('1.type', tt.summary)
    expect(snapshot(result)).toMatchSnapshot()
  })
})
