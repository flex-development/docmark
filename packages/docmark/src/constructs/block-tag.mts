/**
 * @file Constructs - blockTag
 * @module docmark/constructs/blockTag
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { codes, constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  Event,
  NamedConstruct,
  PartialConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import eoc from './eoc.mts'
import tagName from './tag-name.mts'
import typeMetadata from './type-metadata.mts'

/**
 * The block tag construct.
 *
 * A block tag is a comment region beginning with a tag name.
 * Content following the tag name on the same logical comment line is tokenized
 * as markdown flow content.
 * Subsequent logical comment lines remain part of the block tag until another
 * block tag begins or end of content is reached.
 *
 * Block tag content is not interpreted according to the tag name.
 * Tag-specific syntax, such as type metadata, namepaths, and code-block-only
 * content, can be recognized by additional constructs or later processing.
 *
 * The construct is concrete because the block tag owns its markdown content
 * until its continuation fails. Sibling comment regions cannot pierce the block
 * tag except at boundaries recognized by the initial `comment` construct.
 *
 * This construct is expected to run at the `comment` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} blockTag
 */
const blockTag: ContinuableConstruct & NamedConstruct = {
  concrete: true,
  continuation: { partial: true, tokenize: tokenizeBlockTagContinuation },
  exit: exitBlockTag,
  name: tt.blockTag,
  tokenize: tokenizeBlockTag
}

/**
 * The block tag start construct.
 *
 * A block tag start consists of zero or more line endings followed by a tag
 * name.
 *
 * This construct is used when a caller must determine whether a block tag
 * begins after one or more blank logical comment lines.
 * Line endings are consumed only as part of the partial attempt; failed
 * attempts are restored by the caller.
 *
 * This construct is partial because it recognizes only the position where a
 * block tag can begin. The enclosing construct remains responsible for
 * tokenizing the block tag itself.
 *
 * @const {PartialConstruct} blockTagStart
 */
const blockTagStart: PartialConstruct = {
  partial: true,
  tokenize: tokenizeBlockTagStart
}

/**
 * The inline block tag start construct.
 *
 * An inline block tag start consists of zero or more whitespace characters
 * followed by a tag name.
 *
 * This construct is used when a caller must determine whether a block tag
 * begins after zero or more whitespace characters.
 *
 * This construct is partial because it recognizes only the position where a
 * block tag can begin. The enclosing construct remains responsible for
 * tokenizing the block tag itself.
 *
 * @const {PartialConstruct} blockTagInlineStart
 */
const blockTagInlineStart: PartialConstruct = {
  partial: true,
  tokenize: tokenizeBlockTagInlineStart
}

export { blockTagInlineStart, blockTagStart, blockTag as default }

/**
 * Exit a block tag.
 *
 * If the block tag container is still open, the block tag token is closed.
 * The container is then marked closed so later exit calls do not emit duplicate
 * exit events.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {undefined}
 */
function exitBlockTag(this: TokenizeContext, effects: Effects): undefined {
  assert(this.containerState, 'expected `containerState` in container')
  if (this.containerState.open) effects.exit(tt.blockTag)
  return this.containerState.open = false, void effects
}

/**
 * Tokenize a block tag.
 *
 * A block tag begins with a {@linkcode tagName}. Content following the tag name
 * on the same logical line is captured in a flow markdown chunk.
 *
 * The construct stops before another block tag or end of content. If the tag
 * name occupies the remainder of its line, the line ending is captured outside
 * markdown so the markdown tokenizer does not interpret the line as blank.
 *
 * @todo change content type if multiple block tags are on same line
 * @todo namepaths
 * @todo codeblock-only tags (e.g. `@example`)
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
function tokenizeBlockTag(
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

  return blockTag

  /**
   * At the beginning of a block tag.
   *
   * The current code must begin a tag name. The block tag container is opened
   * before a {@linkcode tagName} is attempted.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@internal␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@this {void}␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@extends {Position}␊
   *     ^
   *  > |@extends {TokenFields}␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *     ^
   *  > |The current character code␊
   *  > |@return {State | undefined}␊
   *     ^
   *  > |The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental@todo item 1␊
   *     ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental @todo item 1␊
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
  function blockTag(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')
    assert(code === codes.atSign, 'expected `codes.atSign`')
    self.containerState.open = true
    effects.enter(tt.blockTag, { _container: true })
    return effects.attempt(tagName, afterTagName, nok)(code)
  }

  /**
   * After the tag name.
   *
   * A block tag or end of content beginning after the current line ending
   * closes the block tag without creating a markdown chunk.
   * End of stream also closes the block tag immediately.
   *
   * Otherwise, any whitespace after the tag name is captured and tokenization
   * continues from the next non-whitespace code.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@internal␊
   *              ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@this {void}␊
   *          ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@extends {Position}␊
   *             ^
   *  > |@extends {TokenFields}
   *             ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *           ^
   *  > |The current character code␊
   *  > |@return {State | undefined}␊
   *            ^
   *  > |The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental@todo item 1
   *                  ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental @todo item 1
   *                  ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterTagName(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside container')

    // summary is no longer allowed.
    self.summaryAllowed = false

    /**
     * The second-to-last event.
     *
     * @const {Event | undefined} almostLast
     */
    const id: Event | undefined = self.events.at(-2)

    assert(id, 'expected second-to-last event')
    assert(id[1].type === tt.tagNameIdentifier, 'expected tag name identifier')
    assert(id[0] === ev.exit, 'expected tag name identifier exit event')

    // store tag name identifier.
    self.containerState.tag = self.sliceSerialize(id[1])

    // at end of stream.
    if (eos(code)) return endBlockTag(code)

    // check for block tag after one or more blank lines.
    // if check fails, check for end of content after one or more blank lines.
    if (eol(code)) {
      return effects.check(
        blockTagStart,
        endBlockTag,
        effects.check(eoc, endBlockTag, beforeChunk)
      )(code)
    }

    // content on same line as tag name.
    // check for inline block tag start before starting markdown flow chunk.
    return effects.check(
      blockTagInlineStart,
      endBlockTag,
      // capture any whitespace before starting markdown flow chunk so markdown
      // tokenizers don't consider the whitespace a line prefix.
      factorySpace(effects, beforeChunk, tt.whitespace)
    )(code)
  }

  /**
   * Before a markdown flow chunk.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@internal␊
   *              ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@this {void}␊
   *           ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@extends {Position}␊
   *              ^
   *  > |@extends {TokenFields}
   *              ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *            ^
   *  > |The current character code␊
   *  > |@return {State | undefined}␊
   *             ^
   *  > |The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental@todo item 1
   *                        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental @todo item 1
   *                         ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeChunk(this: void, code: Code): State | undefined {
    assert(!eos(code), 'did not expect end of stream')

    // capture line ending after tag name so its not considered a blank line.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return ok
    }

    // capture type metadata so it's not part of type metadata.
    if (code === codes.leftCurlyBrace) {
      return effects.attempt(typeMetadata, afterTypeMetadata, startChunk)(code)
    }

    // start markdown flow chunk.
    return startChunk(code)
  }

  /**
   * After type metadata.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@this {void}␊
   *                 ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *                  ^
   *  > |The current character code␊
   *  > |@return {State | undefined}␊
   *                                ^
   *  > |The next state
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterTypeMetadata(code: Code): State | undefined {
    if (eol(code)) {
      return effects.check(
        blockTagStart,
        endBlockTag,
        effects.check(eoc, endBlockTag, eatLineEnding)
      )(code)
    }

    return factorySpace(effects, startChunk, tt.whitespace)(code)
  }

  /**
   * At a line ending.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function eatLineEnding(code: Code): State | undefined {
    assert(eol(code), 'expected eol')

    effects.enter(tt.lineEnding)
    effects.consume(code)
    effects.exit(tt.lineEnding)

    return ok
  }

  /**
   * Start of markdown flow chunk.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@this {void}␊
   *           ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@extends {Position}␊
   *              ^
   *  > |@extends {TokenFields}
   *              ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *            ^
   *  > |The current character code␊
   *  > |@return {State | undefined}␊
   *             ^
   *  > |The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental@todo item 1
   *                        ^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental @todo item 1
   *                         ^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startChunk(this: void, code: Code): State | undefined {
    if (eos(code)) return endBlockTag(code)
    effects.enter(tt.chunkMarkdown, { contentType: constants.contentTypeFlow })
    return insideChunk(code)
  }

  /**
   * Inside markdown flow chunk.
   *
   * @example
   *  ```markdown
   *  > |@this {void}␊
   *           ^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@extends {Position}␊
   *              ^^^^^^^^^^^
   *  > |@extends {TokenFields}
   *              ^^^^^^^^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *            ^^^^^^^^^^^^
   *  > |The current character code␊
   *  > |@return {State | undefined}␊
   *             ^^^^^^^^^^^^^^^^^^^^
   *  > |The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental@todo item 1
   *                        ^^^^^^
   *  ```
   *
   * @example
   *  ```markdown
   *  > |@experimental @todo item 1
   *                         ^^^^^^
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideChunk(this: void, code: Code): State | undefined {
    // end before content's end.
    if (eos(code)) return endBefore(code)

    // check for inline block tag start.
    if (code === codes.atSign || whitespace(code)) {
      return effects.check(blockTagInlineStart, endBefore, afterEndCheck)(code)
    }

    // check for block tag or end-of-content after one or more blank lines.
    if (eol(code)) {
      return effects.check(
        blockTagStart,
        endBefore,
        effects.check(eoc, endBefore, endFlow)
      )(code)
    }

    // consume code that cannot end current block tag, then move onto next code.
    return effects.consume(code), insideChunk
  }

  /**
   * At the end of markdown flow chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endFlow(this: void, code: Code): State | undefined {
    assert(eol(code), 'expected eol')
    return effects.consume(code), effects.exit(tt.chunkMarkdown), ok
  }

  /**
   * Inside markdown flow chunk, after checking for an inline block tag start.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterEndCheck(this: void, code: Code): State | undefined {
    return effects.consume(code), insideChunk
  }

  /**
   * At end of markdown flow chunk and block tag, before a block tag start
   * sequence or end-of-content.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endBefore(this: void, code: Code): State | undefined {
    effects.exit(tt.chunkMarkdown)
    return endBlockTag(code)
  }

  /**
   * At the end of a block tag.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endBlockTag(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')
    self.containerState.open = false
    effects.exit(tt.blockTag)

    // capture line ending so its not considered a blank line.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return ok
    }

    return ok(code)
  }
}

/**
 * Continue tokenizing a block tag.
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
function tokenizeBlockTagContinuation(
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

  // block tag container is not open, so a block tag cannot continue.
  if (!self.containerState?.open) return nok

  return continueBlockTag

  /**
   * After tokenizing a tag name.
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code
   *  > | The current character code
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
  function continueBlockTag(this: void, code: Code): State | undefined {
    // end of stream.
    if (eos(code)) return endAt(code)

    // check for block tag after zero or more blank lines.
    if (code === codes.atSign || eol(code)) {
      return effects.check(blockTagStart, endAt, ok)(code)
    }

    // block tag is allowed to continue.
    return ok(code)
  }

  /**
   * At the end of a multiline block tag.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function endAt(this: void, code: Code): State | undefined {
    self.summaryAllowed = false
    return nok(code)
  }
}

/**
 * Tokenize the start of a block tag.
 *
 * Line endings are consumed until the first non-line-ending code is reached.
 * A tag name is then attempted at the current position.
 *
 * The construct succeeds when a tag name can begin after the consumed line
 * endings. Otherwise, the construct fails and the enclosing partial attempt can
 * restore the original tokenizer position and events.
 *
 * > 👉 **Note**: `␊` represents a line ending.
 *
 * @example
 *  ```markdown
 *  > |@this {void}
 *     ^
 *  ```
 *
 * @example
 *  ```markdown
 *  > |@param {State} nok
 *     ^
 *  > |The failed tokenization state
 *  > |@return {State}
 *     ^
 *  > |The initial state
 *  ```
 *
 * @example
 *  ```markdown
 *  > |␊
 *     ^
 *  > |␊
 *  > |@todo item 1
 *  ```
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
function tokenizeBlockTagStart(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return maybeBlockTag

  /**
   * Consume line endings before a possible block tag.
   *
   * After all consecutive line endings are consumed, a tag name is attempted at
   * the first non-line-ending code.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function maybeBlockTag(this: void, code: Code): State | undefined {
    if (eol(code)) return effects.consume(code), maybeBlockTag
    return effects.attempt(tagName, ok, nok)(code)
  }
}

/**
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
function tokenizeBlockTagInlineStart(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return factorySpace(effects, effects.attempt(tagName, ok, nok))
}
