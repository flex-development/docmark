/**
 * @file Unit Tests - preprocess
 * @module docmark/tests/unit/preprocess
 */

import { chars, codes } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Encoding,
  FileLike,
  PreprocessOptions,
  Preprocessor,
  Value
} from '@flex-development/docmark-util-types'
import { decode } from '@flex-development/mark-parser/utils'
import { describe, expect, it, vi } from 'vitest'
import testSubject from '../preprocess.mts'

vi.mock('@flex-development/mark-parser/utils', async og => {
  const module: { decode: typeof decode } = await og()
  return { decode: vi.fn(module.decode).mockName('decode') }
})

describe('unit:preprocess', () => {
  it('should return preprocessor', () => {
    // Act
    const subject: Preprocessor = testSubject()

    // Expect
    expect(subject).to.be.a('function').with.property('name', 'preprocessor')
  })

  describe('preprocessor', () => {
    it.each<[value: Code | FileLike | Value | undefined]>([
      [codes.bos],
      [codes.empty],
      [codes.eos],
      [chars.empty],
      [{ value: chars.empty }]
    ])('should return empty chunk list (%j)', value => {
      expect(testSubject()(value)).to.be.an('array').that.is.empty
    })

    it.each<[
      value: Code | FileLike | Value | undefined,
      end?: boolean | null | undefined,
      options?: PreprocessOptions | null | undefined
    ]>([
      [codes.break],
      [codes.eos, true],
      [codes.empty, true],
      [chars.empty, true],
      [chars.nul, true],
      [chars.lf + chars.cr, true],
      [chars.cr + chars.lowercaseH],
      [chars.cr + chars.lf + chars.lowercaseA + chars.lowercaseB],
      [{ value: Buffer.from('hello 👋' + chars.space + 'world 🌎') }],
      [Buffer.from('hello' + chars.ht + 'world'), null, { tabSize: 4 }],
      [Buffer.from('/** @module docmark/preprocess */'), true]
    ])('should return non-empty chunk list (%#)', (value, end, options) => {
      // Arrange
      const encoding: Encoding | null | undefined = 'utf8'
      const subject: Preprocessor = testSubject(options)

      // Act
      const result = subject(value, encoding, end)

      // Expect
      expect(result).to.be.an('array').that.is.not.empty

      // Expect (conditional, end)
      if (end) expect(result.at(-1)).to.eq(codes.eos)

      // Expect (conditional, decode)
      if (typeof value === 'string' || value && typeof value === 'object') {
        expect(decode).toHaveBeenCalledExactlyOnceWith(value, encoding)
      }

      // Expect (snapshot)
      expect(result).toMatchSnapshot()
    })
  })
})
