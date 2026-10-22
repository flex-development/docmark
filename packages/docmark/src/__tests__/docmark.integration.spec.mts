/**
 * @file Integration Tests - api
 * @module docmark/tests/integration/api
 */

import snapshot from '#tests/utils/snapshot-events'
import { docmark, type Options } from '@flex-development/docmark'
import typescript from '@flex-development/docmark-extension-typescript'
import { constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  ContentType,
  FileLike
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:docmark', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/content'
  })

  it('should handle no content', () => {
    // Arrange
    const contentType: ContentType = constants.contentTypeComments
    const file: FileLike = read(pathe.join(directory, 'source/empty.txt'))
    const options: Options = { contentType, extensions: [typescript] }

    // Act
    const result = docmark(file, 'utf8', options)

    // Expect
    expect(result).to.have.property('length', 2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.have.nested.property('1.type', tt.eoc)
    expect(snapshot(result)).toMatchSnapshot()
  })

  it.each<[path: string, options?: Options | null | undefined]>([
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
    ['multiline/15.txt']
  ])('should parse block comments (%j)', (path, options) => {
    void test('comments/block/' + path, options)
  })

  it.each<[path: string, options?: Options | null | undefined]>([
    ['opener-only/01.txt'],
    ['opener-only/02.txt'],
    ['opener-only/03.txt'],
    ['opener-only/04.txt'],
    ['sameline/01.txt'],
    ['sameline/02.txt'],
    ['sameline/03.txt'],
    ['multiline/01.txt'],
    ['multiline/02.txt'],
    ['multiline/03.txt']
  ])('should parse line comments (%j)', (path, options) => {
    void test('comments/line/' + path, options)
  })

  it.each<[path: string, options?: Options | null | undefined]>([
    ['modules/01.txt'],
    ['modules/02.txt'],
    ['modules/03.txt'],
    ['modules/04.txt']
  ])('should parse mixed comments (%j)', (path, options) => {
    void test('source/' + path, options)
  })

  /**
   * @this {void}
   *
   * @param {string} path
   *  The fixture path, relative to {@linkcode directory}
   * @param {Options | null | undefined} [options]
   *  The configuration options
   * @return {undefined}
   */
  function test(
    this: void,
    path: string,
    options?: Options | null | undefined
  ): undefined {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))

    // Act
    const result = docmark(file, options ?? { extensions: [typescript] })
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
