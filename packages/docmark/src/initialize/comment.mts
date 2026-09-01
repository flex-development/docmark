/**
 * @file Initialize - comment
 * @module docmark/initialize/comment
 */

import postprocess from '#lib/postprocess'
import { blankLine, region } from '@flex-development/docmark-grammar'
import { codes, constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Code,
  ContainerState,
  ContinuableConstruct,
  Effects,
  Event,
  InitialConstruct,
  Place,
  State,
  Token,
  TokenizeContext
} from '@flex-development/docmark-util-types'
import { bos, eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * Initialize tokenization of a comment content stream.
 *
 * The initializer coordinates comment region discovery with markdown parsing.
 * Comment regions are parsed by registered `comment` constructs, while markdown
 * content between regions is delegated to child `document` tokenizers.
 *
 * The input stream is expected to contain normalized comment content.\
 * Physical comment syntax &mdash; such as comment openers, closers, and line
 * markers &mdash; is represented by the surrounding tokenizer rather than this
 * initializer.
 *
 * Comment regions are siblings and cannot be nested.
 * Therefore, at most one region may be active at any point in the stream.
 *
 * @const {InitialConstruct} comment
 */
const comment: InitialConstruct = {
  resolve: resolveComment,
  tokenize: tokenizeComment
}

export default comment

/**
 * Resolve events emitted while tokenizing a comment stream.
 *
 * Comment content is transparent: it's parsed right now.
 *
 * That way, line endings, region exits, and trailing whitespace are resolved
 * when a standalone `comment` content parser is instantiated.\
 * Transparency also allows definitions to be parsed right now: before text in
 * paragraphs (specifically, media) are parsed.
 *
 * @this {void}
 *
 * @param {Event[]} events
 *  The current list of events
 * @return {Event[]}
 *  The list of changed events
 */
function resolveComment(this: void, events: Event[]): Event[] {
  return postprocess(events)
}

/**
 * Tokenize a `comment` content stream.
 *
 * The initializer coordinates two kinds of content:
 *
 * - comment regions, which are discovered through registered `comment`
 *   constructs and continue across logical lines via `continuation` constructs
 * - markdown content, which is delegated to child `document` tokenizers
 *
 * At most one comment region is active at a time.\
 * When a region is active, eligible markdown constructs are given precedence
 * over region continuation. When continuation fails, the region is closed and
 * region discovery resumes.
 *
 * Markdown chunks belonging to a region are linked and written to the same
 * child `document` tokenizer until that region is closed.
 * A new region receives a fresh child markdown stream so parser state cannot
 * leak across region boundaries.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeComment(this: TokenizeContext, effects: Effects): State {
  /**
   * The active comment region and its persistent state.
   *
   * This is a tuple where the first value is the continuable construct managing
   * the region and the second value is its persistent container state.
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
   * A stack is nevertheless maintained to keep lifecycle handling consistent
   * with other container initializers.
   *
   * @const {[Region?]} stack
   */
  const stack: [Region?] = []

  /**
   * The event index from which to forward tokens emitted by the current region
   * construct or continuation.
   *
   * Events emitted at or after this index are inspected by {@linkcode forward}
   * for completed markdown chunk tokens.
   *
   * @var {number} continued
   */
  let continued: number = 0

  /**
   * The active child `document` tokenizer.
   *
   * The tokenizer is created lazily and reused for the current markdown stream
   * until the active region is finalized.
   *
   * @var {TokenizeContext | undefined} markdown
   */
  let markdown: TokenizeContext | undefined

  /**
   * The most recently written markdown chunk.
   *
   * Used to form the doubly linked sequence of tokens written to the active
   * child `document` tokenizer.
   *
   * @var {Token | undefined} md
   */
  let md: Token | undefined

  /**
   * The stream position before the current `continuation` attempt.
   *
   * The position is compared with the position after a successful continuation
   * to determine whether the continuation consumed any input.
   *
   * @var {Place | undefined} then
   */
  let then: Place | undefined

  return start

  /**
   * Process the beginning of a logical or physical line.
   *
   * At the end of the stream, active markdown and region state is finalized.\
   * Otherwise:
   *
   * - without an active region, attempt to discover a new region
   * - with an active region at a fresh line, give blank lines and initial flow
   *   syntax precedence before region continuation
   * - with an active region on an ordinary line, check for a sibling region,
   *   then classify the line and attempt region continuation
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function start(this: void, code: Code): State | undefined {
    assert(
      bos(self.previous) || eol(self.previous) || eos(code),
      'expected beginning of stream, beginning of line, or end of stream'
    )

    // initialize container state.
    restate()

    // no region on stack; check for a new one.
    // first check for a blank line because regions cannot start on them.
    // otherwise, check for a new region.
    if (!stack[0]) {
      return effects.check(blankLine, beforeBlankLine, checkNewRegions)(code)
    }

    // region on stack.
    // try continuing the active region.
    return effects.check(
      blankLine,
      continueAtBlankLine,
      continueAtNoBlankLine
    )(code)
  }

  /**
   * Record a blank line before delegating it to markdown parsing.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeBlankLine(this: void, code: Code): State | undefined {
    self.parser.atBlankLine = true // mark blank line.
    return beforeMarkdown(code) // delegate blank line to markdown.
  }

  /**
   * Continue an active region on a blank line.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueAtBlankLine(this: void, code: Code): State | undefined {
    assert(stack.length, 'expected region on `stack`')
    self.parser.atBlankLine = true // mark blank line.
    return tryContinuation(code) // try continuing the active region.
  }

  /**
   * Continue an active region on a non-blank line.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function continueAtNoBlankLine(this: void, code: Code): State | undefined {
    assert(stack.length, 'expected region on `stack`')

    // mark non-blank line.
    self.parser.atBlankLine = false

    // check for new region before trying to continue the active region.
    // this line is non-blank, so we can check for a region here.
    return checkNewRegions(code)
  }

  /**
   * Check for a new comment region at the current position.
   *
   * When markdown is active, a new region may interrupt it only when the
   * markdown parser is not currently parsing concrete content.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function checkNewRegions(this: void, code: Code): State | undefined {
    assert(!self.parser.atBlankLine, 'expected no blank line')

    // if there's document or flow content, we're interrupting with a region.
    self.interrupt = Boolean(markdown?.currentConstruct ?? markdown?.interrupt)

    // region on stack.
    if (stack.length === 1) {
      // note: if a region is already on stack at the beginning of stream,
      // the region's `tokenize` method did not not consume any input.

      // no markdown child exists yet.
      // the region has yet to delegate chunk creation to the initializer.
      if (!markdown) {
        // fresh region on stack.
        // no markdown parser means the region's `tokenize` method
        // parsed the entirety of the previous line.
        return effects.check(region, aNewRegion, tryContinuation)(code)
      }

      // if we have concrete subcontent, such as block HTML or fenced code,
      // we cannot have regions "pierce" into them, so we can immediately
      // attempt region continuation.
      if (markdown.concrete) return tryContinuation(code)

      // try to enter a new region.
      // no need to worry about blank lines because they've already been parsed.
      return effects.check(region, aNewRegion, tryContinuation)(code)
    }

    // no region on stack.
    assert(!stack.length, 'expected no region on `stack`')

    // no markdown child exists yet or parsing markdown outside of a region.
    // try entering a new region.
    // if attempt fails, begin or resume parsing markdown outside of region.
    // no need to worry about blank lines because they've already been parsed.
    return tryRegion(code)
  }

  /**
   * Enter a new comment region.
   *
   * The current markdown stream and active region are finalized before the new
   * region is entered.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function aNewRegion(this: void, code: Code): State | undefined {
    assert(stack.length === 1, 'expected region on `stack`')
    flush() // close the active region.
    return tryRegion(code) // try to enter a comment region.
  }

  /**
   * Attempt to enter a comment region.
   *
   * Region discovery resets the transient container state before the attempt.
   * When no region can start, markdown parsing begins or resumes from the
   * current position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryRegion(this: void, code: Code): State | undefined {
    restate() // reset container state to get ready for new region.

    // capture current number of events before attempting the region.
    // this is used to determine where to begin forwarding tokens after
    // successfully entering the region.
    continued = self.events.length

    // try entering a comment region.
    // if no region can begin, resume markdown parsing at the same position.
    return effects.attempt(region, addRegion, beforeMarkdown)(code)
  }

  /**
   * Register a newly entered comment region.
   *
   * Events emitted while entering the region are first inspected for completed
   * markdown chunks. The `currentConstruct` and its persistent container state
   * are then registered as the sole active region.
   *
   * A region may request immediate closure through its container state using
   * the `_closeFlow` flag.
   * Otherwise, parsing proceeds according to whether the stream is at its
   * beginning, the beginning of a line, or end of stream.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function addRegion(this: void, code: Code): State | undefined {
    assert(self.currentConstruct, 'expected a current construct')
    assert(self.currentConstruct.continuation, 'expected continuable construct')
    assert(self.containerState, 'expected `containerState` when adding region')

    // forward any markdown chunks emitted by `tokenize`.
    forward()

    // register new region.
    assert(stack.length === 0, 'expected empty region stack')
    stack[0] = [self.currentConstruct, self.containerState] as Region

    // signal freshly added region.
    self.parser.freshRegion = true

    // summary no longer allowed.
    self.parser.skipSummary = true

    // region marked as closed before continuation attempt.
    if (self.containerState._closeFlow) flush()

    // beginning of stream or beginning of new line.
    if (bos(self.previous) || eol(self.previous)) return start(code)

    // `tokenize` finished before a line ending.
    // capture line ending so its not mistaken for a blank markdown line.
    // no need to check for blank lines because regions cannot start on them.
    if (eol(code)) {
      effects.enter(tt.lineEnding)
      effects.consume(code)
      effects.exit(tt.lineEnding)
      return start
    }

    // at end of stream.

    // a region's `tokenize` method is expected to parse the entire first line,
    // the entirety of the line up until the first line ending, or a prefix.
    // if only a prefix is consumed, users are expected to finish out the line.
    //
    // this is because markdown `document` content comes from the line.
    // so to mirror an inner markdown document, a chunk cannot start here.
    //
    // the remainder of the line can be parsed as a `commentChunk` token so it's
    // eligible for forwarding, or another type/content of the user's choice.

    assert(eos(code), 'expected end of stream')
    return start(code)
  }

  /**
   * Attempt to continue the active comment region.
   *
   * The region's persistent state is restored and supplemented with additional
   * metadata before its `continuation` construct is attempted.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryContinuation(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` when continuing')
    assert(stack[0], 'expected region on `stack` when continuing')
    const [construct, containerState] = stack[0]

    // attach region's state before attempting continuation.
    self.containerState = containerState

    // capture current number of events before attempting continuation.
    // this is used to determine where to begin forwarding tokens after
    // a successful continuation.
    continued = self.events.length

    // capture current place in the content before attempting continuation.
    // this is used to determine if the region's `continuation` construct
    // consumed any input.
    then = self.now()

    // if there's document or flow content,
    // we're interrupting with a comment region line.
    self.interrupt = Boolean(markdown?.currentConstruct ?? markdown?.interrupt)

    // try continuing the active comment region.
    return effects.attempt(
      construct.continuation,
      afterContinuation,
      noContinuation
    )(code)
  }

  /**
   * Resume after a successful region continuation.
   *
   * Any markdown chunks emitted by the continuation construct are first
   * forwarded to the active child `document` tokenizer.
   *
   * A successful continuation can:
   *
   * - request that the region close
   * - consume no input, in which case markdown begins at the same position
   * - consume part of a line, in which case remaining content becomes markdown
   * - consume an entire line, in which case the next logical line is processed
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterContinuation(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState` after continuing')
    assert(stack.length === 1, 'expected region on `stack`')
    assert(then, 'expected `then` after continuing')

    // forward any markdown chunks emitted by continuation.
    forward()

    // continuation explicitly requested that the active region be closed.
    if (self.containerState._closeFlow) return noContinuation(code)

    // region no longer considered fresh.
    self.parser.freshRegion = false

    /**
     * The current place in the content.
     *
     * @const {Place} now
     */
    const now: Place = self.now()

    // continuation succeeded without consuming input.
    // start markdown chunk from unchanged stream position.
    if (
      then.line === now.line &&
      then.column === now.column &&
      then.offset === now.offset &&
      then._bufferIndex === now._bufferIndex &&
      then._index === now._index
    ) {
      return beforeMarkdown(code)
    }

    // continuation construct did not consume entire line.
    // start markdown chunk from current point in the stream.
    if (!eol(self.previous)) return beforeMarkdown(code)

    // continuation construct consumed entire line.
    return start(code)
  }

  /**
   * Resume after a failed region continuation.
   *
   * The active region and markdown stream are finalized before region discovery
   * resumes.
   *
   * If continuation fails at a blank line, the line is instead delegated to a
   * fresh markdown parser after the active region has been finalized.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noContinuation(this: void, code: Code): State | undefined {
    flush() // finalize the active region and current markdown stream.

    // delegate blank line parsing to markdown.
    // this is done after a call to `flush` so blank lines are parsed with a new
    // markdown parser outside the former region.
    if (self.parser.atBlankLine) return beforeMarkdown(code)

    return start(code) // resume region discovery at non-blank line.
  }

  /**
   * Prepare to tokenize markdown content.
   *
   * At end of stream, the active {@linkcode markdown} child and comment region
   * are finalized before the {@linkcode eos} code is consumed.
   *
   * Otherwise, a new markdown chunk is started.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeMarkdown(this: void, code: Code): State | undefined {
    // end of comment content stream.
    // finalize the current markdown stream and active region.
    if (eos(code)) return void end(code)

    // start new markdown chunk.
    return markdownStart(code)
  }

  /**
   * Start a markdown chunk.
   *
   * The child `document` tokenizer is created lazily and attached to the new
   * chunk token.
   *
   * The chunk is linked to {@linkcode md} so markdown content can span multiple
   * normalized comment chunks.
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

    // lazily initialize markdown parser.
    markdown ??= self.parser.document(self.now())

    // start markdown chunk.
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
   * Content is consumed until a line ending or end of stream is reached.
   * The line ending is included in the current chunk before it is written to
   * the active child `document` tokenizer.
   * Otherwise, end-of-content and inline-region constructs are checked before
   * ordinary content is consumed.
   *
   * Concrete markdown owns its content and therefore bypasses region-boundary
   * checks until the concrete construct is complete.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function markdownContinue(this: void, code: Code): State | undefined {
    assert(markdown, 'expected `markdown` when continuing markdown')
    assert(self.containerState, 'expected `containerState` inside markdown')

    // at end of stream.
    // write completed markdown chunk, then finalize streams and active region.
    if (eos(code)) {
      write(effects.exit(tt.chunkMarkdown), true)
      return void end(code)
    }

    // at the end of a line.
    // consume the current line ending and write the completed markdown chunk.
    if (eol(code)) {
      effects.consume(code) // consume line ending.
      write(effects.exit(tt.chunkMarkdown)) // write completed chunk.
      return start // resume region discovery or continuation.
    }

    // consume as ordinary markdown content.
    effects.consume(code)
    return markdownContinue
  }

  /**
   * Finalize and detach the active child `document` tokenizer.
   *
   * If the child tokenizer has not reached end of stream, an `eos` code is
   * written before the tokenizer is detached.
   *
   * The next markdown stream receives a fresh child tokenizer and chunk-link
   * chain.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function closeMarkdown(this: void): undefined {
    // finalize the markdown stream.
    if (markdown && !eos(markdown.code)) markdown.write([codes.eos])

    // get ready for a new markdown stream.
    // reset child tokenizer reference and clear chunk-link chain.
    markdown = undefined
    md = undefined

    return void markdown
  }

  /**
   * Finish the comment content stream.
   *
   * The active child `document` tokenizer and comment region are finalized
   * before the `eos` code is consumed. Transient parsing state is also reset.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {undefined}
   *  The next state
   */
  function end(this: void, code: Code): undefined {
    assert(eos(code), 'expected end of stream')

    // finalize active region state before consuming end of content.
    flush()

    // clear transient parsing state.
    self.parser.atBlankLine = undefined
    self.parser.freshRegion = undefined
    self.parser.previousBlankLine = undefined

    // eat eos code.
    return void effects.consume(code)
  }

  /**
   * Finalize the active comment region and its child markdown stream.
   *
   * The active markdown stream is finalized before the region's persistent
   * container state is restored and its `exit` hook is called.
   *
   * After the active region is finalized, the current construct, concrete
   * state, and transient container state are reset so the next region starts
   * with a clean parsing context.
   *
   * > 👉 **Note**: Comment regions cannot nest, so the stack contains at most
   * > one item. The loop keeps teardown consistent with other initializers.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function flush(this: void): undefined {
    assert(stack.length <= 1, 'expected no more than 1 region')

    // finalize markdown stream.
    closeMarkdown()

    // exit the active region.
    // 👉 **note**: regions cannot nest, so the stack contains at most one item.
    // the loop keeps teardown consistent with other container initializers.
    while (stack.length) {
      const [construct, containerState] = stack.pop()!
      self.containerState = containerState
      construct.exit.call(self, effects)
    }

    // get ready for the next region.

    // reset current construct.
    self.currentConstruct = undefined

    // clear concrete state.
    // regions should never close in the middle of concrete content,
    // so this state can be safely cleared when a region is closed.
    self.concrete = undefined

    return void restate()
  }

  /**
   * Forward completed markdown chunk tokens to the child {@linkcode markdown}
   * tokenizer.
   *
   * Region constructs may emit `chunkMarkdown` tokens.\
   * Completed tokens are located in emission order and written to the active
   * child tokenizer.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function forward(this: void): undefined {
    // inspect events emitted since the last region attempt or continuation.
    while (continued < self.events.length) {
      assert(self.events[continued], 'expected `self.events[continued]`')
      const [event, token] = self.events[continued]!

      // only completed markdown chunks are written to the child stream.
      if (
        event === ev.exit &&
        token.type === tt.chunkMarkdown &&
        token.contentType === constants.contentTypeDocument
      ) {
        write(token)
      }

      continued++
    }

    return void self.events
  }

  /**
   * Reset container state.
   *
   * The current `comment` kind is retained after reset.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function restate(this: void): undefined {
    const { comment } = self.containerState ?? {}

    self.containerState = {} // get ready for the next region.
    self.containerState.comment = comment // re-expose the current comment kind.

    return void self.containerState
  }

  /**
   * Write to the child {@linkcode markdown} tokenizer.
   *
   * The token is associated with the active child tokenizer, linked to the
   * previously written markdown chunk, sliced from the comment content stream,
   * and then written to the child.
   *
   * Before writing to the child tokenizer, `defineSkip` is used to correctly
   * position the child and account for prefixes consumed by registered region
   * constructs and their continuation.
   *
   * The child's `concrete` state is mirrored onto {@linkcode self} so region
   * dispatch cannot interrupt concrete markdown content.
   *
   * @this {void}
   *
   * @param {Token} token
   *  The markdown chunk to write
   * @param {boolean | undefined} [end]
   *  Whether to end the child stream.\
   *  The {@linkcode eos} code will be appended to the child stream
   * @return {undefined}
   */
  function write(
    this: void,
    token: Token,
    end?: boolean | undefined
  ): undefined {
    assert(self.containerState, 'expected `containerState` during write')
    assert(token !== md, 'did not expect `token` to match previous token')

    // lazily initialize markdown parser.
    markdown ??= self.parser.document(token.start)

    // associate child tokenizer with chunk for postprocessing.
    token._tokenizer ??= markdown

    /**
     * The source chunks spanning {@linkcode token}.
     *
     * @const {Chunk[]} stream
     */
    const stream: Chunk[] = self.sliceStream(token)

    // update blank line history after an entire line is consumed.
    if (eol(stream.at(-1))) {
      self.parser.previousBlankLine = self.parser.atBlankLine
      self.parser.atBlankLine = null
    }

    // signal end of `markdown` stream.
    if (end) stream.push(codes.eos)

    // link tokens.
    // this inserts the chunk represented by `token` into the `markdown` stream.
    token.previous = md
    if (md) md.next = token
    md = token

    // tell the `markdown` tokenizer where normalized content starts.
    // regions can "nibble" a prefix from margins.
    // where a logical markdown line starts is defined here.
    if (token.previous) markdown.defineSkip(token.start)

    // write the chunk to the child tokenizer.
    markdown.write(stream)

    // mirror concrete markdown state onto `self`.
    // this prevents regions from piercing concrete markdown content.
    self.concrete = markdown.concrete

    return void markdown
  }
}
