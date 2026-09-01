/**
 * @file Integration Tests - api
 * @module docmark/tests/integration/api
 */

import { parse, postprocess, preprocess } from '@flex-development/docmark'
import { ev, tt } from '@flex-development/docmark-util-symbol'
import type { Chunk, FileLike } from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mts'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:docmark', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/content'
  })

  it.each<[path: string]>([
    ['source/01.txt'],
    ['source/02.txt'],
    ['source/03.txt'],
    ['source/04.txt'],
    ['source/05.txt'],
    ['source/06.txt'],
    ['source/07.txt']
  ])('should parse comments (%j)', path => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = postprocess(parse().source().write(slice))
    const beforeLast = result.at(-2)
    const last = result.at(-1)

    // Expect
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
