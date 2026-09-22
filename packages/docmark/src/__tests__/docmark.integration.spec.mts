/**
 * @file Integration Tests - api
 * @module docmark/tests/integration/api
 */

import extension from '#fixtures/extension'
import snapshot from '#tests/utils/snapshot-events'
import { parse, postprocess, preprocess } from '@flex-development/docmark'
import { ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  FileLike,
  ParseOptions
} from '@flex-development/docmark-util-types'
import pathe from '@flex-development/pathe'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:docmark', () => {
  let directory: string

  beforeAll(() => {
    directory = 'packages/docmark/__fixtures__/content/source'
  })

  it.each<[path: string]>([
    ['empty/01.txt'],
    ['opener-only/block/01.txt'],
    ['opener-only/block/02.txt'],
    ['opener-only/block/03.txt'],
    ['opener-only/block/04.txt'],
    ['opener-only/line/01.txt'],
    ['opener-only/line/02.txt'],
    ['opener-only/line/03.txt'],
    ['opener-only/line/04.txt'],
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
    ['sameline/line/01.txt'],
    ['sameline/line/02.txt'],
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
    ['multiline/line/01.txt'],
    ['multiline/line/02.txt'],
    ['modules/01.txt'],
    ['modules/02.txt'],
    ['modules/03.txt'],
    ['modules/04.txt']
  ])('should parse comments (%j)', path => {
    // Arrange
    const file: FileLike = read(pathe.join(directory, path))
    const options: ParseOptions = { extensions: [extension] }
    const slice: Chunk[] = preprocess()(file, undefined, true)

    // Act
    const result = postprocess(parse(options).source().write(slice))
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
