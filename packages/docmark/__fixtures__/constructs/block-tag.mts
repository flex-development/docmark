/**
 * @file Constructs - blockTag
 * @module docmark/constructs/blockTag
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { trailingWhitespace } from '@flex-development/docmark-grammar'
import { codes, constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Code,
  ContinuableConstruct,
  Effects,
  Event,
  NamedConstruct,
  State,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos, whitespace } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'
import namepath from './namepath.mts'
import tagName from './tag-name.mts'
import typeMetadata from './type-metadata.mts'

/**
 * The block tag construct.
 *
 * A block tag is a comment region beginning with a tag name.
 * Content following the tag name on the same logical comment line is tokenized
 * as markdown `text`.
 * Subsequent logical comment lines remain part of the block tag until another
 * comment region begins or end of content is reached.
 *
 * This construct is expected to run at the `comment` content level.
 *
 * @const {ContinuableConstruct & NamedConstruct} blockTag
 */
const blockTag: ContinuableConstruct & NamedConstruct = {
  continuation: { tokenize: tokenizeBlockTagContinuation },
  exit: exitBlockTag,
  name: tt.blockTag,
  tokenize: tokenizeBlockTag
}

export default blockTag

/**
 * Exit a block tag.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {undefined}
 */
function exitBlockTag(this: TokenizeContext, effects: Effects): undefined {
  return void effects.exit(tt.blockTag)
}

/**
 * Tokenize the first line of a block tag.
 *
 * A block tag begins with a {@linkcode tagName}.
 * Content following the tag name on the same logical line is captured in a
 * markdown `text` chunk.
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

  return startBlockTag

  /**
   * At the beginning of a block tag.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
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
   *  > |␠The current character code␊
   *  > |@return {State | undefined}␊
   *     ^
   *  > |␠The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |␊
   *  > |@experimental␊
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
  function startBlockTag(this: void, code: Code): State | undefined {
    assert(code === codes.atSign, 'expected `codes.atSign`')
    effects.enter(tt.blockTag, { _container: true, _region: true })
    return effects.attempt(tagName, afterTagName, nok)(code)
  }

  /**
   * After the tag name.
   *
   * > 👉 **Note**: `␊` represents a line ending and `␠` represents a space.
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
   *  > |␠The current character code␊
   *  > |@return {State | undefined}␊
   *            ^
   *  > |␠The next state
   *  ```
   *
   * @example
   *  ```markdown
   *  > |␊
   *  > |@experimental␊
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
    assert(self.containerState, 'expected `containerState` inside region')

    // at end of stream.
    if (eos(code)) return self.containerState._closeFlow = true, ok(code)

    /**
     * The tag name identifier.
     *
     * @const {Event | undefined} id
     */
    const id: Event | undefined = self.events.at(-2)

    assert(id, 'expected second-to-last event')
    assert(id[1].type === tt.tagNameIdentifier, 'expected tag name identifier')
    assert(id[0] === ev.exit, 'expected tag name identifier exit event')

    // store tag name identifier.
    self.containerState.tag = self.sliceSerialize(id[1])

    // at a line ending.
    // let the `comment` initializer take over from here.
    // the initializer will ensure line endings are not considered blank lines.
    if (eol(code)) return ok(code)

    // capture trailing whitespace to finish out the line.
    // if found, let the `comment` initializer take over.
    // otherwise, capture whitespace and prepare to start markdown chunk.
    // note: it's okay to capture trailing whitespace here because the first
    // line of a block tag after block tag specific syntax is markdown `text`
    // content and any subsequent lines are `document` content.
    // this means the capture will not break the markdown chunk chain.
    if (whitespace(code)) {
      return effects.attempt(
        trailingWhitespace,
        ok,
        factorySpace(effects, beforeChunk, tt.whitespace)
      )(code)
    }

    return beforeChunk(code)
  }

  /**
   * Before a markdown chunk.
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
   *  > | The current character code␊
   *  > |@return {State | undefined}␊
   *             ^
   *  > | The next state
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
    assert(!eol(code), 'did not expect line ending')
    assert(!eos(code), 'did not expect end of stream')
    assert(!whitespace(code), 'did not expect whitespace')

    // try capturing type metadata so it's not part of markdown chunk.
    // if attempt fails, try capturing namepath before starting chunk.
    return effects.attempt(
      typeMetadata,
      afterTypeMetadata,
      tryNamepath
    )(code)
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
   *  > | The current character code␊
   *  > |@return {State | undefined}␊
   *                                ^
   *  > | The next state
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
    // the `comment` initializer requires a `ContinuableConstruct`.
    // reset here because `typeMetadata` is not partial and not continuable.
    self.currentConstruct = blockTag

    // at end of stream or a line ending.
    // let the `comment` initializer take over from here.
    // the initializer will ensure line endings are not considered blank lines.
    if (eos(code) || eol(code)) return ok(code)

    // capture trailing whitespace to finish out the line.
    // if found, let the `comment` initializer take over.
    // otherwise, start markdown chunk after whitespace.
    // note: it's okay to capture trailing whitespace here because the first
    // line of a block tag after block tag specific syntax is markdown `text`
    // content and any subsequent lines are `document` content.
    // this means the capture will not break the markdown chunk chain.
    if (whitespace(code)) {
      return effects.attempt(
        trailingWhitespace,
        ok,
        factorySpace(effects, tryNamepath, tt.whitespace)
      )(code)
    }

    return tryNamepath(code)
  }

  /**
   * Try parsing a namepath.
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
   *                   ^
   *  > | The current character code␊
   *  > |@return {State | undefined}␊
   *                                ^
   *  > | The next state
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryNamepath(code: Code): State | undefined {
    assert(!whitespace(code), 'did not expect whitespace')
    return effects.attempt(namepath, afterNamepath, startChunk)(code)
  }

  /**
   * After a namepath.
   *
   * > 👉 **Note**: `␊` represents a line ending.
   *
   * @example
   *  ```markdown
   *  > |@param {Code} code␊
   *                       ^
   *  > | The current character code␊
   *  ```
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterNamepath(code: Code): State | undefined {
    // capture trailing whitespace to finish out the line.
    // afterwards, let the `comment` initializer take over.
    // no need for a failure state because the `namepath` constructs only allows
    // whitespace after a namepath if it is trailing whitespace.
    // note: it's okay to capture trailing whitespace here because the first
    // line of a block tag after block tag specific syntax is markdown `text`
    // content and any subsequent lines are `document` content.
    // this means the capture will not break the markdown chunk chain.
    if (whitespace(code)) return effects.attempt(trailingWhitespace, ok)(code)

    // at end of stream or a line ending.
    // let the `comment` initializer take over from here.
    // the initializer will ensure line endings are not considered blank lines.
    assert(eos(code) || eol(code), 'expected end of stream or line ending')
    return ok(code)
  }

  /**
   * At the beginning of a markdown chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startChunk(this: void, code: Code): State | undefined {
    assert(!eol(code), 'did not expect line ending')
    assert(!eos(code), 'did not expect end of stream')

    // after capturing block tag specific syntax,
    // content on same line as the tag name is considered markdown text.
    effects.enter(tt.chunkMarkdown, { contentType: constants.contentTypeText })

    return insideChunk(code)
  }

  /**
   * Inside markdown text chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideChunk(this: void, code: Code): State | undefined {
    // markdown chunk and block tag terminated by end of stream.
    // the `comment` initializer will handle closing the region.
    if (eos(code)) {
      effects.exit(tt.chunkMarkdown)
      return ok(code)
    }

    // finish markdown chunk after line ending.
    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkMarkdown)

      // mark previous line as non-blank.
      // the `comment` initializer cannot track this line because it is part
      // of a markdown `text` chunk, rather than a `document` chunk.
      // the initializer only forwards `document` chunks, and therefore it only
      // updates blank line history for such chunks.
      self.parser.previousBlankLine = false

      return ok
    }

    return addToChunk(code)
  }

  /**
   * Consume `code` as a part of a markdown chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function addToChunk(this: void, code: Code): State | undefined {
    return effects.consume(code), insideChunk
  }
}

/**
 * Continue tokenizing a block tag.
 *
 * Block tag continuation determines whether the active block tag owns the next
 * logical comment line.
 *
 * A block tag continues unless a region is detected or the end of content (eoc)
 * is reached. This tokenizer delegates boundary detection and markdown chunk
 * creation to the `comment` initializer.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeBlockTagContinuation(
  this: TokenizeContext,
  effects: Effects,
  ok: State
): State {
  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  return continueBlockTag

  /**
   * Continue tokenizing a block tag.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueBlockTag(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')
    if (eos(code)) return self.containerState._closeFlow = true, ok(code)
    if (self.parser.atBlankLine) return ok(code)
    return startChunk(code)
  }

  /**
   * At the beginning of a markdown chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function startChunk(this: void, code: Code): State | undefined {
    assert(!self.parser.atBlankLine, 'did not expect blank line')
    assert(!eol(code), 'did not expect line ending')
    assert(!eos(code), 'did not expect end of stream')

    effects.enter(tt.chunkMarkdown, {
      contentType: constants.contentTypeDocument
    })

    return insideChunk(code)
  }

  /**
   * Inside markdown chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function insideChunk(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` inside region')

    // markdown chunk and block tag terminated by end of stream.
    if (eos(code)) {
      effects.exit(tt.chunkMarkdown)
      return ok(code)
    }

    // finish markdown chunk after line ending.
    if (eol(code)) {
      effects.consume(code)
      effects.exit(tt.chunkMarkdown)
      return ok
    }

    effects.consume(code)
    return insideChunk
  }
}
