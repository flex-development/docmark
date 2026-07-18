/**
 * @file Constructs - summary
 * @module docmark/constructs/summary
 */

import { codes, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import { blockTagStart } from './block-tag.mts'
import eoc from './eoc.mts'

/**
 * The comment summary construct.
 *
 * A summary is the initial markdown region of a comment.\
 * Summary content is only allowed at the beginning of a comment and continues
 * across subsequent logical comment lines until a block tag begins or end of
 * content is reached.
 *
 * Summary content is not tokenized by this construct.
 * The initial `comment` construct owns markdown chunk creation and writes the
 * resulting chunks to the markdown tokenizer while the summary region is open.
 *
 * The construct is concrete because the summary owns its markdown content until
 * its continuation fails. Sibling comment regions cannot pierce the summary
 * except at boundaries recognized by the initial `comment` construct.
 *
 * This construct is expected to run at the `comment` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} summary
 */
const summary: ContinuableConstruct & NamedConstruct = {
  concrete: true,
  continuation: { tokenize: tokenizeSummaryContinuation },
  exit: exitSummary,
  name: tt.summary,
  tokenize: tokenizeSummary
}

export default summary

/**
 * Exit a comment summary.
 *
 * The summary token is closed when the initial `comment` construct removes the
 * active summary region.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {undefined}
 */
function exitSummary(this: TokenizeContext, effects: Effects): undefined {
  this.summaryAllowed = false
  return void effects.exit(tt.summary)
}

/**
 * Tokenize a comment summary.
 *
 * A summary can begin only when summary content is allowed and the current code
 * is not end of stream.
 *
 * The construct opens the summary container and emits an empty summary marker.
 * Markdown content remains unconsumed so the initial `comment` construct can
 * create the corresponding markdown chunk.
 *
 * After a summary begins, summary content is disabled for the remainder of the
 * current comment stream.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
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

  return summaryAllowance

  /**
   * Checking if a comment summary is allowed.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@return {State | undefined}␊
   *  > |The next state
   *     ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function summaryAllowance(this: void, code: Code): State | undefined {
    /**
     * The index of the current event.
     *
     * @var {number} index
     */
    let index: number = -1

    // check if a summary already exists.
    while (++index < self.events.length) {
      assert(self.events[index], 'expected `self.events[index]`')
      if (self.events[index]![1].type === tt.summary) return nok(code)
    }

    return summaryStart(code)
  }

  /**
   * At the beginning of a comment summary.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |Consider a sequence `u` where `u` is defined as follows:
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
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function summaryStart(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')

    // summary not allowed here, or at end of stream.
    if (self.summaryAllowed === false || eos(code)) return nok(code)

    // summary cannot start on blank line.
    if (eol(code)) return nok(code)

    // start summary.
    effects.enter(tt.summary, { _container: true })

    // add summary marker.
    // this event pack is required because upon successful construct,
    // `mark` tokenizers expect the last event to be an `exit` event.
    effects.enter(tt.summaryMarker)
    effects.exit(tt.summaryMarker)

    // tell initial `comment` construct to start markdown chunk.
    return ok(code)
  }
}

/**
 * Continue tokenizing a comment summary.
 *
 * Summary continuation determines whether the active summary owns the next
 * logical comment line.
 *
 * A summary continues unless a block tag begins at the current position or
 * end of content is reached.
 * {@linkcode blockTagStart} recognizes block tags beginning at the current
 * position or after one or more blank lines, while {@linkcode eoc} recognizes
 * end of content after those lines.
 *
 * The continuation construct does not consume summary markdown content.
 * It only determines ownership of the next logical line.\
 * The initial `comment` construct remains responsible for markdown chunks.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
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
  return summaryContinue

  /**
   * Determine whether the summary continues at the current position.
   *
   * The current code is either the first code of the next logical comment line
   * or a line ending belonging to one or more blank lines.
   *
   * End of stream, a block tag, or end of content after blank lines ends the
   * summary. Otherwise, the next line remains part of the active summary.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function summaryContinue(this: void, code: Code): State | undefined {
    // at end of stream.
    if (eos(code)) return nok(code)

    // code cannot start a block tag or precede one; summary can continue.
    if (code !== codes.atSign && !eol(code)) return ok(code)

    // check for block tag at current position or after one or more blank lines.
    // if check fails, check for end of content after one or more blank lines.
    // checks are performed only on known start codes for performance.
    return effects.check(
      blockTagStart,
      nok,
      effects.check(eoc, nok, ok)
    )(code)
  }
}
