/**
 * @file Integration Tests - comments
 * @module docmark/initialize/tests/integration/comments
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

describe('integration:initialize/comments', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/content/comments'
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['../source/empty.txt']
  ])('should handle no comments (%j)', path => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const options: ParseOptions = { extensions: [typescript] }
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse(options).comments().write(slice)

    // Expect
    expect(result).to.have.property('length', 2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.have.nested.property('1.type', tt.eoc)
    expect(snapshot(result)).toMatchSnapshot()
  })

  it('should handle no extensions', () => {
    // Arrange
    const file: FileLike = read(pathe.fileURLToPath(import.meta.url))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse().comments().write(slice)
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
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['opener-only/01.txt'],
    ['opener-only/02.txt'],
    ['opener-only/03.txt'],
    ['opener-only/04.txt'],
    ['sameline/01.txt'],
    ['sameline/02.txt'],
    ['sameline/03.txt'],
    ['sameline/04.txt'],
    ['sameline/05.txt'],
    ['sameline/06.txt'],
    ['sameline/07.txt'],
    ['sameline/08.txt'],
    ['sameline/09.txt'],
    ['sameline/10.txt'],
    ['sameline/11.txt'],
    ['multiline/01.txt'],
    ['multiline/02.txt'],
    ['multiline/03.txt'],
    ['multiline/04.txt'],
    ['multiline/05.txt'],
    ['multiline/06.txt'],
    ['multiline/07.txt'],
    ['multiline/08.txt'],
    ['multiline/09.txt'],
    ['multiline/10.txt'],
    ['multiline/11.txt'],
    ['multiline/12.txt'],
    ['multiline/13.txt'],
    ['multiline/14.txt'],
    ['multiline/15.txt'],
    ['multiline/16.txt', { extensions: [markdown] }],
    ['multiline/17.txt', { extensions: [sass] }],
    ['multiline/18.txt', { extensions: [sass] }],
    ['multiline/19.txt', { extensions: [sass] }]
  ])('should parse block comments (%j)', (path, options) => {
    void test('block/' + path, options)
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['opener-only/01.txt'],
    ['opener-only/02.txt'],
    ['opener-only/03.txt'],
    ['opener-only/04.txt'],
    ['sameline/01.txt'],
    ['sameline/02.txt'],
    ['sameline/03.txt'],
    ['multiline/01.txt'],
    ['multiline/02.txt'],
    ['multiline/03.txt'],
    ['multiline/04.txt', { extensions: [sass] }],
    ['multiline/05.txt', { extensions: [sass] }],
    ['multiline/06.txt', { extensions: [sass] }]
  ])('should parse line comments (%j)', (path, options) => {
    void test('line/' + path, options)
  })

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
    const result = parse(options).comments().write(slice)
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
