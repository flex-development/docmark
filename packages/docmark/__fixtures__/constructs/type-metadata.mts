/**
 * @file Constructs - typeMetadata
 * @module docmark/constructs/typeMetadata
 */

import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  Effects,
  NamedConstruct,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import inlineTag from './inline-tag.mts'

/**
 * The type metadata construct.
 *
 * Type metadata is a brace-delimited type expression associated with the active
 * block tag container.
 *
 * The opening and closing curly braces are tokenized as
 * {@linkcode tt.typeMetadataMarker}.\
 * Content between the markers is preserved in a {@linkcode tt.chunkType} token
 * and delegated to the `type` content tokenizer.
 *
 * Unescaped nested curly braces are balanced before the outer type metadata is
 * closed. A curly brace preceded by an odd-length run of backslashes is escaped
 * and remains part of the type expression without affecting the nesting depth.
 * This allows object-like expressions such as `{{ value: Value }}` and escaped
 * braces to remain within a single type metadata construct.
 *
 * The active block tag name is attached to the type expression chunk so
 * downstream type constructs can interpret the expression in the context of
 * that tag.
 *
 * Empty type metadata does **not** produce an empty type expression chunk.
 *
 * If end of stream is reached before the closing outer marker is seen, the
 * construct preserves the incomplete expression and succeeds without
 * synthesizing a closing marker. Downstream tooling can diagnose or recover the
 * unterminated metadata.
 *
 * This construct is expected to run at the `comment` content level via the
 * `blockTag` construct. It is `partial` so the parent construct, `blockTag`,
 * and its `continuation`, remain the tokenizer's `currentConstruct` during
 * parsing. As such, the enclosing construct remains responsible for content
 * before and after the metadata.
 *
 * @const {NamedConstruct} typeMetadata
 */
const typeMetadata: NamedConstruct = {
  name: tt.typeMetadata,
  previous: previousTypeMetadata,
  tokenize: tokenizeTypeMetadata
}

export default typeMetadata

/**
 * Check if `code` can immediately precede type metadata.
 *
 * A left curly brace immediately preceded by a backslash cannot begin type
 * metadata. This guard intentionally considers only the immediately preceding
 * code; it does not reduce backslash runs.
 *
 * Within established type metadata, brace escaping is instead determined using
 * odd/even backslash parity because the construct owns the stringified type
 * expression and must distinguish structural braces from expression content.
 *
 * An opening marker immediately preceded by a grave accent is also rejected so
 * possible markdown code text can retain ownership of the brace.
 *
 * Recognition inside established markdown constructs remains the responsibility
 * of the enclosing content tokenizer.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether `code` can precede type metadata
 */
function previousTypeMetadata(this: TokenizeContext, code: Code): boolean {
  return (
    code !== codes.backslash && // escaped.
    code !== codes.graveAccent // possible markdown code text.
  )
}

/**
 * Tokenize type metadata.
 *
 * The construct consumes an opening left curly brace, captures the enclosed
 * expression in a type expression chunk, and closes at the matching unescaped
 * right curly brace. Unescaped nested braces adjust the current nesting depth.
 * Braces preceded by an odd-length run of backslashes remain part of the type
 * expression without affecting that depth.
 *
 * The outer markers are excluded from the type expression chunk. Empty type
 * metadata consists only of its two markers and does **not** produce a type
 * expression chunk.
 *
 * If end of stream is reached before the outer marker is closed, the open type
 * expression chunk and metadata token are closed at the current position and
 * tokenization succeeds. No closing marker is synthesized. This preserves
 * incomplete source for downstream diagnostics and recovery.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeTypeMetadata(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * The number of consecutive backslashes immediately preceding the current
   * code.
   *
   * An odd-length run escapes a curly brace.
   * The count is reset when a non-backslash code is seen.
   *
   * @var {number} backslashes
   */
  let backslashes: number = 0

  /**
   * The current unescaped curly-brace nesting depth.
   *
   * The opening metadata marker establishes a depth of one.
   * Unescaped nested left curly braces increase the depth, while unescaped
   * right curly braces decrease it. Escaped braces do not affect the depth.
   * Type metadata closes when the depth returns to zero.
   *
   * @var {number} depth
   */
  let depth: number = 0

  /**
   * The previous chunk token.
   *
   * @var {Token | undefined} previous
   */
  let previous: Token | undefined

  // check for inline tag before trying to parse type metadata.
  return effects.check(inlineTag, nok, typeMetadataStart)

  /**
   * At the beginning of type metadata.
   *
   * The opening left curly brace is captured as a metadata marker.
   *
   * @example
   *  ```markdown
   *  > |@this {void}
   *           ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code
   *            ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function typeMetadataStart(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')

    // cannot start type metadata.
    if (code !== codes.leftCurlyBrace) return nok(code)

    // start type metadata.
    effects.enter(tt.typeMetadata, { tag: self.containerState.tag })

    // consume opening marker.
    effects.enter(tt.typeMetadataMarker, { _open: true })
    effects.consume(code)
    effects.exit(tt.typeMetadataMarker)

    // the opening marker establishes a nesting depth of one.
    // unescaped curly braces will decrease or increase the depth.
    // type metadata closes when the depth returns to zero.
    depth = 1

    return beforeTypeExpression
  }

  /**
   * Before the type expression chunk.
   *
   * An immediate right curly brace closes type metadata without creating a type
   * expression chunk. Otherwise, a new {@linkcode tt.chunkType} token begins at
   * the current position.
   *
   * @example
   *  ```markdown
   *  > |@type {}
   *            ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@this {void}
   *            ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code
   *             ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@return {{ value: Value }}
   *              ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeTypeExpression(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')

    // empty type metadata.
    if (code === codes.rightCurlyBrace) {
      effects.enter(tt.typeMetadataMarker, { _close: true })
      effects.consume(code)
      effects.exit(tt.typeMetadataMarker)
      effects.exit(tt.typeMetadata)
      return ok
    }

    // start type expression container.
    effects.enter(tt.typeExpression, { _container: true })

    // start type expression chunk.
    return startChunk(code)
  }

  /**
   * Start a type expression chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startChunk(this: void, code: Code): State | undefined {
    /**
     * The chunk token.
     *
     * @const {Token} token
     */
    const token: Token = effects.enter(tt.chunkType, {
      contentType: constants.contentTypeType,
      previous
    })

    // link tokens.
    // this inserts the chunk represented by `token` into the expression stream.
    token.previous = previous
    if (previous) previous.next = token
    previous = token

    return insideTypeExpression(code)
  }

  /**
   * Inside the type expression chunk.
   *
   * Unescaped nested left and right curly braces are consumed as part of the
   * type expression and adjust the current nesting depth. A brace preceded by
   * an odd-length run of consecutive backslashes is escaped and does not affect
   * the depth.
   *
   * The unescaped right curly brace that reduces the nesting depth to zero is
   * excluded from the type expression chunk and captured as the closing
   * metadata marker.
   *
   * End of stream closes unterminated type metadata without synthesizing a
   * closing marker.
   *
   * @example
   *  ```markdown
   *  > |@this {void}
   *            ^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@return {{ value: Value }}
   *              ^^^^^^^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@type {['\}', '\{']}
   *            ^^^^^^^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideTypeExpression(this: void, code: Code): State | undefined {
    // at line ending.
    // start new linked type expression chunk.
    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkType)
      return startChunk
    }

    // close unterminated chunk and type metadata at end of stream.
    if (eos(code)) {
      effects.exit(tt.chunkType)
      effects.exit(tt.typeExpression)
      effects.exit(tt.typeMetadata)
      return ok(code)
    }

    /**
     * Whether the current code is escaped by an odd-length run of immediately
     * preceding backslashes.
     *
     * @const {boolean} escaped
     */
    const escaped: boolean = backslashes % 2 === 1

    // extend the current run of consecutive backslashes.
    if (code === codes.backslash) {
      backslashes++
      effects.consume(code)
      return insideTypeExpression
    }

    // the current code ends the preceding backslash run.
    backslashes = 0

    // an unescaped left curly brace begins a nested brace pair.
    if (!escaped && code === codes.leftCurlyBrace) {
      depth++
      effects.consume(code)
      return insideTypeExpression
    }

    // an unescaped right curly brace can close the current brace pair.
    if (!escaped && code === codes.rightCurlyBrace) {
      depth--

      // the outer brace pair is complete.
      if (depth === 0) {
        effects.exit(tt.chunkType)
        effects.exit(tt.typeExpression)

        effects.enter(tt.typeMetadataMarker, { _close: true })
        effects.consume(code)
        effects.exit(tt.typeMetadataMarker)

        effects.exit(tt.typeMetadata)
        return ok
      }
    }

    // consume code as part of type expression chunk.
    effects.consume(code)
    return insideTypeExpression
  }
}
