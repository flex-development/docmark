/**
 * @file Integration Tests - source
 * @module docmark/initialize/tests/integration/source
 */

import js from '#fixtures/extensions/js'
import { parse, preprocess } from '@flex-development/docmark'
import { ev, tt } from '@flex-development/docmark-util-symbol'
import type { Chunk, FileLike } from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mts'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:initialize/source', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/content/source'
  })

  it('should allow all source constructs to be disabled', () => {
    // Arrange
    const file: FileLike = read(new URL(import.meta.url))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse().source().write(slice)

    // Expect
    expect(result).to.have.property('length', 2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.have.nested.property('1.type', tt.eoc)
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['01.txt'],
    ['02.txt'],
    ['03.txt'],
    ['04.txt'],
    ['05.txt'],
    ['06.txt'],
    ['07.txt'],
    ['empty/01.txt']
  ])('should parse source file (%j,%j)', (path, options) => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Setup
    options ??= {}
    options.extensions ??= []
    options.extensions.unshift(js)

    // Act
    const result = parse(options).source().write(slice)
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
