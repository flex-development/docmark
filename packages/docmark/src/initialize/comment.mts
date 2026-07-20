/**
 * @file Initialize - comment
 *
 * @module docmark/initialize/comment
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Code,
  Construct,
  ContainerState,
  ContinuableConstruct,
  Effects,
  InitialConstruct,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The initial comment content construct.
 *
 * The initializer coordinates the parsing of comment content.
 * Comment content is expected to be normalized into logical chunks.
 * Physical comment syntax &mdash; such as line prefixes, suffixes, and comment
 * markers (e.g. openers, closers, line markers) &mdash; is expected to be
 * removed so region constructs can operate on normalized content rather than
 * raw source text.
 *
 * The initializer is responsible for:
 *
 * - discovering new regions
 * - coordinating transitions between sibling regions
 * - delegating markdown parsing to a child `document` tokenizer
 * - managing region ownership
 *
 * Comment regions are siblings and cannot be nested.
 * Therefore, at most one region may be active at any point in the stream.
 *
 * Default region constructs are intentionally small.
 * They identify and manage their own boundaries while markdown parsing is
 * delegated to the child tokenizer, ensuring `micromark` continues to own
 * markdown syntax.
 *
 * @const {InitialConstruct} comment
 */
const comment: InitialConstruct = { tokenize: tokenizeComment }

/**
 * The comment region construct.
 *
 * The construct dispatches constructs registered
 * for the `comment` content type.
 *
 * Centralizing region dispatch allows the initializer to discover, continue,
 * and transition between sibling regions without depending on specific region
 * implementations.
 *
 * @const {Construct} region
 */
const region: Construct = { tokenize: tokenizeRegion }

export default comment

/**
 * Tokenize comment content.
 *
 * Comment content is processed one logical line at a time.
 *
 * At the beginning of each line, the active region is first given an
 * opportunity to continue. If continuation fails, the region is closed before
 * a new sibling region is attempted.
 *
 * Region boundaries are also checked while processing markdown content,
 * allowing sibling regions to interrupt non-concrete markdown at valid
 * boundaries.
 *
 * Markdown belonging to the active region is delegated to a child `document`
 * tokenizer. Concrete markdown constructs, such as block HTML or fenced code,
 * retain ownership of their content, preventing comment regions from
 * interrupting markdown syntax.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeComment(this: TokenizeContext, effects: Effects): State {
  /**
   * A comment region and its persistent state.
   *
   * This is a tuple where the first value is a continuable construct,
   * and the second value is the current container state.
   */
  type Region = [construct: ContinuableConstruct, state: ContainerState]

  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * The active comment region.
   *
   * Comment regions are siblings rather than nested, so the stack always
   * contains at most one region.
   * A stack is nevertheless maintained because it provides a uniform mechanism
   * for region lifecycle management.
   *
   * @const {[Region?]} stack
   */
  const stack: [Region?] = []

  /**
   * The markdown tokenizer.
   *
   * @var {TokenizeContext | undefined} markdown
   */
  let markdown: TokenizeContext | undefined

  /**
   * The most recently written markdown chunk token.
   *
   * Used to link adjacent chunks written to the same child tokenizer.
   *
   * @var {Token | undefined} markdownToken
   */
  let md: Token | undefined

  return start

  /**
   * Start processing a comment line.
   *
   * When the stack is empty, a new comment region is checked for.\
   * If a region is open, its `continuation` construct is attempted first.
   *
   * A successful continuation sends the current line directly to the markdown
   * tokenizer. A failed continuation closes the region and checks whether a new
   * region can begin at the current position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function start(this: void, code: Code): State | undefined {
    if (!stack[0]) return checkNewRegions(code)

    assert(eol(self.previous), 'expected to be at beginning of line')
    const [construct, containerState] = stack[0]

    self.containerState = containerState
    assert(construct.continuation, 'expected continuable construct')

    return effects.attempt(
      construct.continuation,
      beforeMarkdown,
      afterFailedContinuation
    )(code)
  }

  /**
   * After a failed continuation.
   *
   * The active region is closed before checking whether a new region can begin
   * at the current position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterFailedContinuation(this: void, code: Code): State | undefined {
    return flush(), checkNewRegions(code)
  }

  /**
   * Check for a new comment region.
   *
   * If no markdown child exists yet, a region is attempted directly.
   * Otherwise, `interrupt` indicates whether markdown has an active construct
   * that a user-defined comment region may need to account for.
   *
   * The region check is non-consuming.\
   * If it succeeds, the current markdown stream is closed before the new region
   * is entered. If it fails, control passes to the current {@linkcode markdown}
   * tokenizer at the same position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function checkNewRegions(this: void, code: Code): State | undefined {
    assert(stack.length === 0, 'expected empty region stack')

    // no markdown has been written yet, so attempt a region immediately.
    if (!markdown) return commentContinued(code)

    // if there’s a current construct, we're interrupting with a region.
    // exposing whether the markdown tokenizer has an active construct
    // primarily supports user-defined comment constructs that need to
    // distinguish between ordinary content and an interruption of active
    // markdown content.
    self.interrupt = Boolean(markdown.currentConstruct)

    // get ready for new region.
    self.containerState = {}

    // signal concrete content.
    self.concrete = markdown.concrete

    // check for new region.
    return effects.check(region, aNewRegion, beforeMarkdown)(code)
  }

  /**
   * After a successful new-region check.
   *
   * The current markdown stream and active comment region are closed before
   * the new region is tokenized.
   *
   * This state is entered between markdown chunks, after the previous
   * `chunkMarkdown` token has already been closed and written to the child
   * tokenizer.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function aNewRegion(this: void, code: Code): State | undefined {
    closeMarkdown() // finish markdown chunk.
    flush() // exit active comment region.
    return commentContinued(code) // start new comment region.
  }

  /**
   * Attempt to enter a new comment region.
   *
   * When no region can start, the current {@linkcode markdown} tokenizer takes
   * over from the current position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function commentContinued(this: void, code: Code): State | undefined {
    self.containerState = {}
    return effects.attempt(region, addRegion, beforeMarkdown)(code)
  }

  /**
   * Register a newly entered comment region.
   *
   * Comment regions cannot nest, so the region stack must be empty when a new
   * region is registered.
   *
   * After registration, control passes to the current {@linkcode markdown}
   * tokenizer at the current position. The region's `continuation` construct
   * determines whether the region remains active on subsequent lines.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function addRegion(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState`')
    assert(self.currentConstruct, 'expected `currentConstruct`')
    assert(self.currentConstruct.continuation, 'expected continuable construct')

    assert(stack.length === 0, 'expected empty region stack')
    stack[0] = [self.currentConstruct, self.containerState] as Region

    // at beginning of new line.
    if (eol(self.previous)) return afterNewRegion(code)

    // capture inline whitespace so it's not mistaken for a line prefix.
    return factorySpace(effects, afterNewRegion, tt.whitespace)(code)
  }

  /**
   * Prepare a newly entered region for markdown parsing.
   *
   * After a region has been entered, adjacent sibling regions are checked
   * before markdown begins.
   * This allows multiple regions to appear consecutively without requiring
   * intervening markdown content.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterNewRegion(this: void, code: Code): State | undefined {
    // get ready for adjacent region check.
    self.containerState = {}

    // start new region or begin markdown chunk.
    return effects.check(region, anAdjacentRegion, noAdjacentRegion)(code)
  }

  /**
   * Prepare to enter an adjacent sibling region.
   *
   * The active region is closed before control returns to {@linkcode start},
   * allowing the next sibling region to be discovered from the current
   * position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function anAdjacentRegion(code: Code): State | undefined {
    assert(markdown === undefined, 'did not expect `markdown` tokenizer')
    return flush(), start(code)
  }

  /**
   * Resume the active region.
   *
   * No adjacent sibling region begins at the current position, so markdown
   * parsing resumes using the active region's persistent state.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noAdjacentRegion(code: Code): State | undefined {
    assert(stack[0], 'expected region on `stack`')
    self.containerState = stack[0][1]
    return beforeMarkdown(code)
  }

  /**
   * Prepare to tokenize markdown content.
   *
   * Markdown is tokenized from normalized comment chunks rather than raw
   * comment text.
   * When the end of the stream is reached, any active markdown tokenizer and
   * comment region are finalized before consuming the end-of-stream marker.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeMarkdown(this: void, code: Code): State | undefined {
    if (!eos(code)) return markdownStart(code) // start markdown chunk.

    if (markdown) closeMarkdown() // finish markdown chunk.
    flush() // exit active comment region.

    return void effects.consume(code)
  }

  /**
   * Start a markdown chunk.
   *
   * Markdown chunks are written to a child `document` tokenizer.\
   * Reusing the same child tokenizer allows markdown constructs to span
   * multiple normalized comment chunks while remaining part of a single
   * markdown document.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function markdownStart(this: void, code: Code): State | undefined {
    assert(!eos(code), 'did not expect end of stream')

    markdown ??= self.parser.document(self.now())

    effects.enter(tt.chunkMarkdown, {
      _tokenizer: markdown,
      contentType: constants.contentTypeDocument,
      previous: md
    })

    return markdownContinue(code)
  }

  /**
   * Continue a markdown chunk.
   *
   * Each comment line is written to the current {@linkcode markdown} tokenizer
   * as a separate linked chunk.
   *
   * While markdown content is not concrete, the tokenizer checks for sibling
   * comment regions at each position. A successful region check ends the
   * current markdown chunk and active region before tokenizing the new region.
   *
   * After a line ending, concrete markdown content bypasses region checks.
   * This is so any markdown content that looks like a comment region (e.g. a
   * `codeFlowValue` that looks like a block tag inside a fenced code block)
   * remains markdown content.
   *
   * When markdown is not concrete at the end of a line, processing returns to
   * {@linkcode start} so the active comment region can continue or a new one
   * can begin.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function markdownContinue(this: void, code: Code): State | undefined {
    if (eos(code)) {
      write(effects.exit(tt.chunkMarkdown), true)
      return flush(), void effects.consume(code)
    }

    if (eol(code)) {
      effects.consume(code)
      write(effects.exit(tt.chunkMarkdown))

      // concrete markdown constructs own their content.
      // continue writing markdown so regions cannot pierce markdown content.
      if (self.concrete) return beforeMarkdown

      // clear interruption state to get ready for the next line.
      self.interrupt = undefined

      return start
    }

    return consumeMarkdown(code)
  }

  /**
   * Consume markdown content.
   *
   * The current character belongs to the active markdown chunk and cannot begin
   * a sibling comment region.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State}
   *  The next state
   */
  function consumeMarkdown(this: void, code: Code): State {
    return effects.consume(code), markdownContinue
  }

  /**
   * Close the active comment region.
   *
   * > 👉 **Note**: The stack contains at most one item, but the loop keeps
   * > region teardown generic.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function flush(this: void): undefined {
    assert(stack.length <= 1, 'expected no more than 1 region')

    while (stack.length) {
      const [construct, containerState] = stack.pop()!
      self.containerState = containerState
      construct.exit.call(self, effects)
    }

    return void stack
  }

  /**
   * Write a markdown chunk to the child tokenizer.
   *
   * The chunk `token` is linked to the previously written token.
   * Its source range is then sliced from the parent stream and written to the
   * {@linkcode markdown} tokenizer.
   *
   * @this {void}
   *
   * @param {Token} token
   *  The next markdown chunk token
   * @param {boolean | undefined} [end]
   *  Whether to signal the end of the child stream
   * @return {undefined}
   */
  function write(
    this: void,
    token: Token,
    end?: boolean | undefined
  ): undefined {
    assert(markdown, 'expected `markdown` to be defined when writing')

    /**
     * The source chunks spanning {@linkcode token}.
     *
     * @const {Chunk[]} stream
     */
    const stream: Chunk[] = self.sliceStream(token)

    // signal end of child stream.
    if (end) stream.push(codes.eos)

    // link tokens.
    token.previous = md
    if (md) md.next = token
    md = token

    // tell the child tokenizer where to start.
    markdown.defineSkip(token.start)

    // write chunks to child stream.
    markdown.write(stream)

    // signal concrete content was encountered.
    // this prevents comments from piericing concrete markdown content.
    self.concrete = markdown.concrete

    return void markdown
  }

  /**
   * Close the child markdown stream.
   *
   * Closing the child tokenizer finalizes the current markdown document.
   * Subsequent markdown content begins a new document tokenizer, preventing
   * separate markdown regions from sharing parser state.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function closeMarkdown(this: void): undefined {
    assert(markdown, 'expected `markdown` when closing it')

    markdown.write([codes.eos])
    markdown = undefined
    md = undefined

    return void markdown
  }
}

/**
 * Tokenize a comment region.
 *
 * Constructs registered under the `comment` content type are attempted in
 * extension order. Constructs at the `comment` level must be continuable
 * because the initializer may ask them to accept subsequent lines or determine
 * whether they can begin at a region boundary.
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
function tokenizeRegion(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return effects.attempt(this.parser.constructs.comment, ok, nok)
}
