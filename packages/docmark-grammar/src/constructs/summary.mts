/**
 * @file Constructs - summary
 * @module docmark-grammar/constructs/summary
 */

import { tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { bos, eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import region from './region.mts'

/**
 * The comment summary construct.
 *
 * A summary is the initial markdown region of a comment.\
 * Summary content is only allowed at the beginning of a comment and continues
 * across subsequent logical comment lines until another region begins or the
 * end of content is reached.
 *
 * Summary content is not tokenized by this construct,
 * nor its `continuation` construct.
 * Markdown chunk creation, region-boundary detection, and continuation routing
 * are handled by the `comment` initializer.
 *
 * This construct is expected to run at the `comment` content level.
 *
 * @category
 *  constructs
 *
 * @const {ContinuableConstruct & NamedConstruct} summary
 */
const summary: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeSummaryContinuation },
  exit: exitSummary,
  name: tt.summary,
  previous: previousSummary,
  tokenize: tokenizeSummary
}

export default summary

/**
 * Exit a comment summary.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitSummary(this: TokenizeContext, effects: Effects): undefined {
  return void effects.exit(tt.summary)
}

/**
 * Check if `code` can come before a comment summary.
 *
 * A comment summary may start at the beginning of stream or after a new line.
 *
 * @this {TokenizeContext}
 *
 * @param {Code} code
 *  The previous character code
 * @return {boolean}
 *  Whether `code` can precede a comment summary
 */
function previousSummary(this: TokenizeContext, code: Code): boolean {
  return bos(code) || eol(code)
}

/**
 * Tokenize a comment summary.
 *
 * A summary is only allowed at the beginning of a comment and when the current
 * code is not the {@linkcode eos} code.
 *
 * This tokenizer opens the summary container and emits an empty summary marker.
 * Markdown content remains unconsumed so the initial `comment` construct can
 * create the corresponding markdown chunk.
 *
 * After a summary is exited, summary content is disabled for the remainder of
 * the current comment stream.
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
function tokenizeSummary(
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

  // no need to check for blank line.
  // the `comment` initializer prevents regions from starting on blank lines.
  return startSummary

  /**
   * At the beginning of a comment summary.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
   *
   * @example
   *  ```markdown
   *  > |Consider a sequence `u` where `u` is defined as follows:␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |␊
   *  > |␊
   *  > |␊
   *  > |Attention marker settings.
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |␊
   *  > |␊
   *  > |␊
   *  > |␠␠␠Disabled construct settings.
   *       ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startSummary(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')
    assert(!self.parser.atBlankLine, 'did not expect blank line')
    assert(!eol(code), 'did not expect line ending')
    assert(!eos(code), 'did not expect end of stream')

    // summary already started.
    if (self.containerState.open) return nok(code)

    // summary not allowed here.
    if (self.parser.skipSummary) return nok(code)

    // start summary.
    effects.enter(tt.summary, { _container: true, _region: true })
    self.containerState.open = true

    // add summary marker.
    // this event pack is required because upon successful construct,
    // `mark` tokenizers expect the last event to be an `exit` event.
    effects.enter(tt.summaryMarker)
    effects.exit(tt.summaryMarker)

    // fail if another region can start.
    // otherwise, let `tokenizeSummaryContinuation` take over from here.
    return effects.check(region, nok, ok)(code)
  }
}

/**
 * Continue a comment summary.
 *
 * Summary continuation itself consumes no content.
 * The `comment` initializer handles region-boundary detection, so successful
 * continuation simply returns control to the initializer to begin the next
 * markdown chunk.
 *
 * > 👉 **Note**: `␊` represents a line ending.
 *
 * @example
 *  ```markdown
 *  > |Union of construct positions.␊
 *  > |␊
 *     ^
 *  > |Positions determine whether a construct,␊
 *     ^
 *  > |when in a {@linkcode ConstructRecord}, takes precedence over existing␊
 *     ^
 *  > |constructs for the same character code when merged.␊
 *     ^
 *  ```
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
function tokenizeSummaryContinuation(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return continueSummary

  /**
   * Continue tokenizing a summary.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueSummary(this: void, code: Code): State | undefined {
    if (eos(code)) return nok(code) // at end of stream.
    return ok(code) // start markdown chunk via `comment` initializer.
  }
}
