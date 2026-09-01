/**
 * @file Integration Tests - comment
 * @module docmark/initialize/tests/integration/comment
 */

import js from '#fixtures/extensions/js'
import { parse, preprocess } from '@flex-development/docmark'
import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Disable,
  FileLike
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import snapshot from '@tests/utils/snapshot-events.mts'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:initialize/comment', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/chunks/comment'
  })

  it('should allow all `comment` constructs to be disabled', () => {
    // Arrange
    const disable: Disable = { null: [tt.summary] }
    const file: FileLike = read(pathe.join(directory, 'hello-world.txt'))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = parse({ extensions: [{ disable }] }).comment().write(slice)

    // Expect
    expect(result).to.have.property('length').be.at.least(2)
    expect(result).to.each.have.nested.property('1.start')
    expect(result).to.each.have.nested.property('1.end')
    expect(result).to.each.not.have.nested.property('1._region')
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['blanks/01.txt'],
    ['blanks/02.txt'],
    ['blanks/03.txt'],
    ['blanks/04.txt'],
    ['blanks/05.txt'],
    ['blanks/06.txt'],
    ['blanks/07.txt'],
    ['blanks/08.txt'],
    ['firstline/01.txt'],
    ['firstline/02.txt'],
    ['firstline/03.txt'],
    ['firstline/04.txt'],
    ['firstline/05.txt'],
    ['firstline/06.txt'],
    ['firstline/07.txt'],
    ['firstline/08.txt'],
    ['firstline/09.txt'],
    ['firstline/10.txt'],
    ['multiline/01.txt'],
    ['multiline/02.txt'],
    ['multiline/03.txt'],
    [
      'multiline/03.txt',
      { extensions: [{ disable: { null: [tt.codeIndented] } }] }
    ],
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
    ['multiline/16.txt'],
    ['multiline/17.txt'],
    ['multiline/18.txt']
  ])('should parse comment lines (%j, %j)', (path, options) => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Setup
    options ??= {}
    options.extensions ??= []
    options.extensions.unshift(js)

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
