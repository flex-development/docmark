/**
 * @file Integration Tests - source
 * @module docmark/initialize/tests/integration/source
 */

import markdown from '#fixtures/extensions/markdown'
import sass from '#fixtures/extensions/sass'
import typescript from '#fixtures/extensions/typescript'
import snapshot from '#tests/utils/snapshot-events'
import { parse, preprocess } from '@flex-development/docmark'
import { ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  FileLike,
  ParseOptions
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:initialize/source', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/content/source'
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['empty/01.txt']
  ])('should handle no comments (%j)', path => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const options: ParseOptions = { extensions: [markdown, typescript] }
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse(options).source().write(slice)

    // Expect
    expect(result).to.have.property('length', 2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.have.nested.property('1.type', tt.eoc)
  })

  it('should handle no extensions', () => {
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
    ['opener-only/block/01.txt'],
    ['opener-only/block/02.txt'],
    ['opener-only/block/03.txt'],
    ['opener-only/block/04.txt'],
    ['sameline/block/01.txt'],
    ['sameline/block/02.txt'],
    ['sameline/block/03.txt'],
    ['sameline/block/04.txt'],
    ['sameline/block/05.txt'],
    ['sameline/block/06.txt'],
    ['sameline/block/07.txt'],
    ['sameline/block/08.txt'],
    ['sameline/block/09.txt'],
    ['sameline/block/10.txt'],
    ['sameline/block/11.txt'],
    ['multiline/block/01.txt'],
    ['multiline/block/02.txt'],
    ['multiline/block/03.txt'],
    ['multiline/block/04.txt'],
    ['multiline/block/05.txt'],
    ['multiline/block/06.txt'],
    ['multiline/block/07.txt'],
    ['multiline/block/08.txt'],
    ['multiline/block/09.txt'],
    ['multiline/block/10.txt'],
    ['multiline/block/11.txt'],
    ['multiline/block/12.txt'],
    ['multiline/block/13.txt'],
    ['multiline/block/14.txt'],
    ['multiline/block/15.txt'],
    ['multiline/block/16.txt', { extensions: [markdown] }],
    ['multiline/block/17.txt', { extensions: [sass] }],
    ['multiline/block/18.txt', { extensions: [sass] }],
    ['multiline/block/19.txt', { extensions: [sass] }]
  ])('should parse block comments in source file (%j)', test)

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['opener-only/line/01.txt'],
    ['opener-only/line/02.txt'],
    ['opener-only/line/03.txt'],
    ['opener-only/line/04.txt'],
    ['sameline/line/01.txt'],
    ['sameline/line/02.txt'],
    ['multiline/line/01.txt'],
    ['multiline/line/02.txt'],
    ['multiline/line/03.txt', { extensions: [sass] }],
    ['multiline/line/04.txt', { extensions: [sass] }],
    ['multiline/line/05.txt', { extensions: [sass] }],
    ['multiline/line/06.txt', { extensions: [sass] }]
  ])('should parse line comments in source file (%j)', test)

  /**
   * @this {void}
   *
   * @param {string} path
   *  The fixture path, relative to {@linkcode directory}
   * @param {ParseOptions | null | undefined} [options]
   *  The parse options
   * @return {undefined}
   */
  function test(
    this: void,
    path: string,
    options?: ParseOptions | null | undefined
  ): undefined {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Setup
    options ??= { extensions: [typescript] }

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

    return void result
  }
})
