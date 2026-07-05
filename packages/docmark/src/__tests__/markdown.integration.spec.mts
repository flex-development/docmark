/**
 * @file Integration Tests - markdown
 * @module docmark/tests/integration/markdown
 */

import { parse, preprocess } from '@flex-development/docmark'
import { chars, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  FileLike,
  ParseContext,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { ksort } from '@flex-development/tutils'
import { commonmark } from 'commonmark.json'
import { ok } from 'devlop'
import * as micromark from 'micromark'
import type * as mut from 'micromark-util-types'
import { readSync as read } from 'to-vfile'
import { beforeAll, describe, expect, it } from 'vitest'

describe('integration:markdown', () => {
  type Markdown = (
    this: void,
    file: FileLike,
    options?: mut.ParseOptions | undefined
  ) => mut.Event[]

  let markdown: Markdown

  beforeAll(() => {
    /**
     * Parse markdown.
     *
     * @this {void}
     *
     * @param {FileLike} file
     *  The file to parse
     * @param {mut.ParseOptions | undefined} [options]
     *  Options for parsing
     * @return {mut.Event[]}
     *  The list of events
     */
    markdown = function markdown(
      this: void,
      file: FileLike,
      options?: mut.ParseOptions | undefined
    ): mut.Event[] {
      return micromark.postprocess(
        micromark.parse(options)
          .document()
          .write(micromark.preprocess()(file.value, undefined, true))
      )
    }
  })

  it.each<[path: string, ...Parameters<typeof parse>]>([
    ['attention.md'],
    ['autolink.md'],
    ['blockquote.md'],
    ['character-escape.md'],
    ['character-reference.md'],
    ['character-references-everywhere.md'],
    ['code-fenced.md'],
    ['code-indented.md'],
    [
      'code-indented.md',
      { extensions: [{ disable: { null: [tt.codeIndented] } }] }
    ],
    ['code-text.md'],
    ['definition.md'],
    ['hard-break-escape.md'],
    ['hard-break-prefix.md'],
    ['heading-atx.md'],
    ['heading-setext.md'],
    ['html-flow.md'],
    ['html-text.md'],
    ['empty.md'],
    ['image-reference.md'],
    ['image-resource-eol.md'],
    ['image-resource.md'],
    ['link-reference-with-phrasing.md'],
    ['link-reference.md'],
    ['link-resource-eol.md'],
    ['link-resource.md'],
    ['list.md'],
    ['paragraph.md'],
    ['thematic-break.md']
  ])('should parse markdown (%j,%j)', (path, options) => {
    // Setup
    path = path.split(chars.space)[0]!

    // Arrange
    const file: FileLike = read('__fixtures__/markdown/' + path, 'utf8')
    const parser: ParseContext = parse(options)
    const context: TokenizeContext = parser.document()
    const slice: Chunk[] = preprocess()(file, undefined, true)
    let index: number = -1

    // Setup
    const baseline = markdown(file, options as mut.ParseOptions)

    // Act
    const result = context.write(slice)

    // Expect
    expect(result).to.have.property('length', baseline.length)

    // Expect (conditional)
    if (result.length) {
      expect(result).to.each.have.nested.property('1.start')
      expect(result).to.each.have.nested.property('1.end')
    }

    // Expect (event v. event)
    while (++index < result.length) {
      ok(result[index], 'expected `result[index]`')
      ok(baseline[index], 'expected `baseline[index]`')

      const [bEvent, bToken, bSelf] = baseline[index]!
      const [event, token, self] = result[index]!

      expect(event).to.eq(bEvent)
      expect(token.type).to.eq(bToken.type)
      expect(token.start).to.eql(bToken.start)
      expect(token.end).to.eql(bToken.end)

      if (!bToken._container) {
        expect(self.sliceSerialize(token)).to.eq(bSelf.sliceSerialize(bToken))
      }
    }
  })

  describe('commonmark', () => {
    const sections: Record<string, string[]> = {}
    let index: number = -1

    while (++index < commonmark.length) {
      const { markdown, section } = commonmark[index]!
      const key: string = section.toLowerCase()
      const list: string[] = sections[key] ?? (sections[key] = [])
      list.push(markdown)
    }

    describe.each(Object.keys(ksort(sections)))('%s', section => {
      it.each(sections[section]!)('should parse markdown (%j)', value => {
        const parser: ParseContext = parse()
        const context: TokenizeContext = parser.document()
        const slice: Chunk[] = preprocess()(value, undefined, true)
        let index: number = -1

        // Setup
        const baseline = markdown({ value })

        // Act
        const result = context.write(slice)

        // Expect
        expect(result).to.have.property('length', baseline.length)

        // Expect (conditional)
        if (result.length) {
          expect(result).to.each.have.nested.property('1.start')
          expect(result).to.each.have.nested.property('1.end')
        }

        // Expect (event v. event)
        while (++index < result.length) {
          ok(result[index], 'expected `result[index]`')
          ok(baseline[index], 'expected `baseline[index]`')

          const [bEvent, bToken, bSelf] = baseline[index]!
          const [event, token, self] = result[index]!

          expect(event).to.eq(bEvent)
          expect(token.type).to.eq(bToken.type)
          expect(token.start).to.eql(bToken.start)
          expect(token.end).to.eql(bToken.end)

          if (!bToken._container) {
            const value: string = self.sliceSerialize(token)

            expect(value).to.eq(bSelf.sliceSerialize(bToken))
          }
        }
      })
    })
  })
})
