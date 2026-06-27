/**
 * @file Unit Tests - preprocess
 * @module docmark/tests/unit/preprocess
 */

import { chars, codes } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  FileLike,
  Preprocess,
  PreprocessOptions,
  Value
} from '@flex-development/docmark-util-types'
import testSubject from '../preprocess.mts'

describe('unit:preprocess', () => {
  it('should return character code preprocessor', () => {
    // Act
    const subject: Preprocess = testSubject()

    // Expect
    expect(subject).to.be.a('function').with.property('name', 'preprocessor')
  })

  describe('preprocessor', () => {
    it.each<[
      value: Code | FileLike | Value | undefined,
      options?: PreprocessOptions | null | undefined
    ]>([
      [codes.bos],
      [codes.empty],
      [codes.eos],
      [chars.empty],
      [{ value: chars.empty }]
    ])('should return empty character code chunk list (%j)', (
      value,
      options
    ) => {
      expect(testSubject(options)(value)).to.be.an('array').that.is.empty
    })

    it.each<[
      value: Code | FileLike | Value | undefined,
      end?: boolean | null | undefined,
      options?: PreprocessOptions | null | undefined
    ]>([
      [codes.break],
      [codes.eos, true],
      [chars.lf + chars.cr + chars.crlf],
      [{ value: chars.empty }, true],
      [{ value: Buffer.from('/** hello' + chars.ht + 'world */') }],
      [Buffer.from('/** hi' + chars.ht + 'world */'), null, { tabSize: 2 }],
      [Buffer.from('/** @module docmark/preprocess */'), true]
    ])('should return non-empty character code chunk list (%#)', (
      value,
      end,
      options
    ) => {
      // Arrange
      const subject: Preprocess = testSubject(options)

      // Act
      const result = subject(value, null, end)

      // Expect
      expect(result).to.be.an('array').and.not.empty

      // Expect (conditional)
      if (end) expect(result.at(-1)).to.eq(codes.eos)

      // Expect (snapshot)
      expect(result).toMatchSnapshot()
    })
  })
})
