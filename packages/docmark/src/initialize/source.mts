/**
 * @file Initialize - source
 * @module docmark/initialize/source
 */

import { factorySpace } from '@flex-development/docmark-factory-space'
import { blankLine } from '@flex-development/docmark-grammar'
import { codes, constants, ev, tt } from '@flex-development/docmark-util-symbol'
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
import {
  bos,
  eol,
  eos,
  whitespace
} from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The initial source document construct.
 *
 * The initializer scans a source document for comments.\
 * Comment syntax is provided by extensions through constructs registered at the
 * `source` content level.
 *
 * Constructs registered at the `source` content level determine where comments
 * begin and end.
 * Source content not consumed by a registered construct is consumed as opaque
 * input and is not represented in the resulting event stream.
 *
 * Each discovered comment delegates its content to a child `comment` tokenizer,
 * keeping comment parsing independent from the surrounding source language.
 *
 * Comments are siblings and cannot be nested.
 * Therefore, at most one comment may be active at any point in the stream.
 *
 * @const {InitialConstruct} source
 */
const source: InitialConstruct = { tokenize: tokenizeSource }

export default source

/**
 * The source comment construct.
 *
 * The construct attempts constructs registered for the `source` content level
 * in extension order.
 *
 * Centralizing dispatch allows the initializer to discover comments without
 * depending on particular comment syntaxes.
 *
 * @const {Construct} sourceComment
 */
const sourceComment: Construct = { tokenize: tokenizeSourceComment }

/**
 * Tokenize a source document.
 *
 * The initializer scans the source stream for comments using constructs
 * registered at the `source` content level.
 * Source text outside comments is consumed as opaque input and is not
 * represented in the resulting event stream.
 *
 * Each discovered comment is maintained as an active source construct while
 * its content is delegated to a child `comment` tokenizer.
 * The active comment kind is propagated to that tokenizer so comment-level
 * constructs can determine which syntax is currently being parsed.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeSource(this: TokenizeContext, effects: Effects): State {
  /**
   * The active comment and its persistent state.
   *
   * This is a tuple where the first value is the continuable construct managing
   * the comment and the second value is its persistent container state.
   */
  type Comment = [construct: ContinuableConstruct, state: ContainerState]

  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * The active comment stack.
   *
   * Comments are siblings rather than nested, so the stack always contains at
   * most one item.
   * A stack is nevertheless maintained to provide a uniform mechanism for
   * tracking and finalizing active comment state.
   *
   * @const {[Comment?]} stack
   */
  const stack: [Comment?] = []

  /**
   * The active child `comment` tokenizer.
   *
   * The tokenizer is created lazily and reused for the current comment's
   * content stream until that comment is finalized.
   *
   * @var {TokenizeContext | undefined} comment
   */
  let comment: TokenizeContext | undefined

  /**
   * The most recently written comment content token.
   *
   * Used to form the doubly linked sequence of tokens written to the active
   * child `comment` tokenizer.
   *
   * @var {Token | undefined} content
   */
  let content: Token | undefined

  /**
   * The event index from which to forward tokens emitted by the current comment
   * construct or continuation.
   *
   * Events emitted at or after this index are inspected by {@linkcode forward}
   * for completed comment content tokens.
   *
   * @var {number} continued
   */
  let continued: number = 0

  return start

  /**
   * Start or resume source scanning.
   *
   * When no comment is active, registered source constructs are attempted at
   * the current position after blank lines are skipped.
   *
   * Otherwise, the active comment's `continuation` construct is attempted with
   * its persistent container state.
   * A failed continuation finalizes the current comment before ordinary source
   * scanning resumes.
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
      bos(self.previous) || eol(self.previous),
      'expected beginning of stream or line'
    )

    // initialize container state.
    self.containerState ??= {}

    // no comment on stack.
    // eat blank lines.
    // otherwise, try to enter a new comment.
    if (!stack[0]) return effects.attempt(blankLine, restart, tryComment)(code)

    // comment on stack.
    // try continuing the active comment.
    return tryContinuation(code)
  }

  /**
   * Continue the active source comment.
   *
   * The active comment's `continuation` construct is attempted with its
   * persistent container state.
   * Before the attempt, the current event index is recorded so tokens emitted
   * by a successful continuation can be forwarded to the child `comment`
   * tokenizer.
   *
   * The initializer is deemed as interrupting when the child tokenizer has a
   * `currentConstruct`, or when the child itself is interrupting.
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
    assert(stack[0], 'expected comment on `stack` when continuing')
    const [construct, containerState] = stack[0]

    assert(
      self.containerState === containerState,
      'expected `containerState` to match `stack[0][1]`'
    )

    // capture current number of events before attempting continuation.
    // this is used to determine where to begin forwarding tokens after
    // a successful continuation.
    continued = self.events.length

    // if there's a comment region or a region interrupting markdown content,
    // we're interrupting with a comment line.
    self.interrupt = Boolean(comment?.currentConstruct ?? comment?.interrupt)

    // try continuing the active comment.
    return effects.attempt(
      construct.continuation,
      afterContinuation,
      noContinuation
    )(code)
  }

  /**
   * After a successful comment continuation.
   *
   * Comment content tokens emitted by the `continuation` construct are first
   * forwarded to the active child tokenizer.
   *
   * If the continuation closes the comment, scanning resumes after finalizing
   * the active comment.
   * Otherwise, same-line content begins a new comment content chunk,
   * whereas a completely consumed line returns to control to {@linkcode start}.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function afterContinuation(this: void, code: Code): State | undefined {
    assert(stack.length === 1, 'expected comment on `stack`')
    assert(self.containerState, 'expected `containerState` after continuing')

    // forward any comment chunks emitted by continuation.
    forward()

    // close comment container.
    if (self.containerState._closeFlow) return noContinuation(code)

    // comment no longer considered fresh.
    self.parser.freshComment = false

    // continuation construct did not consume entire line.
    // start comment chunk from current point in the stream.
    if (!eol(self.previous)) return beforeChunk(code)

    // continuation construct consumed entire line.
    return start(code)
  }

  /**
   * Resume source scanning after a failed comment continuation.
   *
   * The active comment content stream and source comment are finalized before a
   * new source-level comment is attempted at the current position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noContinuation(this: void, code: Code): State | undefined {
    // comment cannot continue.
    // finalize the comment and content stream before the next comment attempt.
    flush()

    // attempt a comment directly.
    // no comment on stack (or comment content stream).
    return tryComment(code)
  }

  /**
   * Attempt to enter a source-level comment.
   *
   * The container state is reset before registered constructs are attempted.\
   * Whitespace is consumed as opaque source content before the attempt.
   *
   * If no construct succeeds, the current code is consumed as opaque source
   * content.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryComment(this: void, code: Code): State | undefined {
    // reset container state to get ready for new comment.
    self.containerState = {}

    // capture current number of events before attempting the comment.
    // this is used to determine where to begin forwarding tokens after
    // successfully entering the comment.
    continued = self.events.length

    // eat whitespace before attempting comment.
    if (whitespace(code)) return factorySpace(effects, tryComment)(code)

    // try entering a comment.
    return effects.attempt(sourceComment, takeComment, restart)(code)
  }

  /**
   * Register a newly entered source comment.
   *
   * The successful source comment construct and its persistent container state
   * are registered as the sole active comment. The comment kind emitted by the
   * construct is captured from its opening token.
   *
   * Comment content tokens emitted while entering the comment are forwarded to
   * a child `comment` tokenizer.
   *
   * Continuation begins at a line boundary, whereas same-line content begins
   * a new comment content chunk immediately.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function takeComment(this: void, code: Code): State | undefined {
    assert(self.containerState, 'expected `containerState`')
    assert(self.currentConstruct, 'expected `currentConstruct`')
    assert(self.currentConstruct.continuation, 'expected continuable construct')
    assert(self.events[continued], 'expected `self.events[continued]`')

    // capture new comment kind from the opening token.
    // the first event belonging to the new comment is at `continued`.
    assert(self.events[continued]![0] === ev.enter, 'expected `enter` event')
    self.containerState.comment ??= self.events[continued]![1]._kind

    // forward any comment chunks emitted by `tokenize`.
    forward()

    // register new comment.
    assert(stack.length === 0, 'expected empty comment stack')
    stack[0] = [self.currentConstruct, self.containerState] as Comment

    // signal freshly added comment.
    self.parser.freshComment = true

    // immediate closure requested; bypass continuation attempt.
    if (self.containerState._closeFlow) return noContinuation(code)

    // try to continue comment from beginning of new line.
    if (eol(self.previous)) return start(code)

    // start comment chunk from current position.
    return beforeChunk(code)
  }

  /**
   * Continue scanning opaque source content.
   *
   * The current code did not begin a registered source comment construct.
   * It is consumed without producing an event before source scanning resumes.
   *
   * At the end of the source stream, comment content and the active source
   * comment are finalized before the end-of-stream code is processed.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function restart(this: void, code: Code): State | undefined {
    assert(!comment, 'did not expect comment content parser')
    assert(stack.length === 0, 'expected empty comment stack')

    // end of source stream.
    if (eos(code)) return beforeChunk(code)

    // consume code as opaque content.
    effects.consume(code)

    // delegate to `start` at beginning of new line,
    // or attempt a comment directly from the middle of a line.
    if (eol(self.previous)) return start
    return tryComment
  }

  /**
   * Prepare to tokenize comment content.
   *
   * At the end of the source stream, the active child `comment` tokenizer and
   * source comment are finalized before the end-of-content token is emitted.
   *
   * Otherwise, a new comment content chunk is started.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function beforeChunk(this: void, code: Code): State | undefined {
    // end of source stream.
    // finalize the current comment content stream and active comment.
    if (eos(code)) return void end(code)

    // start new comment content chunk.
    return chunkStart(code)
  }

  /**
   * Start a comment content chunk.
   *
   * The child `comment` tokenizer is created lazily and associated with the new
   * `chunkComment` token.
   *
   * The chunk is linked to the preceding comment {@linkcode content} token so
   * normalized comment content can span multiple source tokens while remaining
   * apart of one logical child stream.
   *
   * The active comment kind is propagated to the child tokenizer's container
   * state before comment content is tokenized.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function chunkStart(this: void, code: Code): State | undefined {
    assert(!eos(code), 'did not expect end of stream')
    assert(self.containerState, 'expected `containerState` inside comment')
    assert(self.containerState.comment, 'expected comment kind')
    assert(stack.length === 1, 'expected comment on `stack`')

    // lazily initialize comment content parser.
    comment ??= self.parser.comment(self.now())

    // expose the current comment kind to `comment`-level constructs.
    comment.containerState ??= {}
    comment.containerState.comment = self.containerState.comment

    // start new comment content chunk.
    effects.enter(tt.chunkComment, {
      _tokenizer: comment,
      contentType: constants.contentTypeComment,
      previous: content
    })

    return chunkContinue(code)
  }

  /**
   * Continue a comment content chunk.
   *
   * Ordinary comment content is consumed through the current physical line.\
   * The line ending is included in the chunk before the completed token is
   * written to the child `comment` tokenizer.
   *
   * After consuming a line ending, processing then returns to the active source
   * comment's `continuation` so it can recognize prefixes, closing syntax, or
   * other line-boundary specific behavior before another chunk begins.
   *
   * At end of stream, the current chunk and child stream are finalized.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function chunkContinue(this: void, code: Code): State | undefined {
    assert(comment, 'expected comment content parser')

    // at end of comment stream.
    // finalize the current comment content stream and active comment.
    if (eos(code)) {
      write(effects.exit(tt.chunkComment), true)
      return void end(code)
    }

    // at the end of a line.
    // write the completed chunk before continuing the active comment.
    if (eol(code)) {
      effects.consume(code)
      write(effects.exit(tt.chunkComment))

      // get ready for the next line.
      self.interrupt = undefined

      return start
    }

    // consume ordinary comment content.
    effects.consume(code)
    return chunkContinue
  }

  /**
   * Finish the source content stream.
   *
   * The active child `comment` tokenizer and source comment are finalized
   * before the end-of-content token is emitted.
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

    // finalize active comment state before emitting end of content.
    flush()

    // clear transient parsing state.
    self.parser.freshComment = undefined

    // emit end of content.
    // this is the final event and token.
    effects.enter(tt.eoc)
    effects.consume(code)
    effects.exit(tt.eoc)

    return void code
  }

  /**
   * Close the current comment parsing context.
   *
   * The active child `comment` tokenizer is finalized and its token-link state
   * is cleared. The active source comment's persistent container state is then
   * restored before its `exit` hook is called.
   *
   * Later comments create independent child tokenizers and do not inherit
   * parsing state from the finalized comment.
   *
   * > 👉 **Note**: Source comments cannot nest, so the stack contains at most
   * > one item. The loop keeps teardown generic.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function flush(this: void): undefined {
    assert(stack.length <= 1, 'expected no more than 1 comment')

    // finish comment content stream.
    if (comment && !eos(comment.code)) comment.write([codes.eos])
    comment = undefined
    content = undefined

    // exit the active comment.
    while (stack.length) {
      const [construct, containerState] = stack.pop()!
      self.containerState = containerState
      construct.exit.call(self, effects)
    }

    // get ready for the next source comment.
    self.currentConstruct = undefined
    self.containerState = {}
    self.parser.skipSummary = undefined

    return void stack
  }

  /**
   * Forward emitted tokens to the child {@linkcode comment} tokenizer.
   *
   * Source comment constructs may emit `chunkComment` tokens.\
   * Completed tokens are located in emission order and written to the active
   * child tokenizer.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function forward(this: void): undefined {
    // inspect events emitted since the last comment attempt or continuation.
    while (continued < self.events.length) {
      assert(self.events[continued], 'expected `self.events[continued]`')
      const [event, token] = self.events[continued]!

      // only completed comment content chunks are written to the child stream.
      if (
        event === ev.exit &&
        token.type === tt.chunkComment &&
        token.contentType === constants.contentTypeComment
      ) {
        write(token)
      }

      continued++
    }

    return void self.events
  }

  /**
   * Write a comment content chunk to the child {@linkcode comment} tokenizer.
   *
   * The token is linked to the previously written comment content token,
   * associated with the active child tokenizer, sliced from the source stream,
   * and written to the child.
   *
   * When requested, the {@linkcode eos} code can be appended to the pending
   * child stream.
   *
   * Before writing to the child tokenizer, `defineSkip` is used to correctly
   * position the child and account for any prefixes consumed by registered
   * comment constructs and their continuation.
   *
   * The child's `concrete` state is mirrored onto {@linkcode self} so comment
   * dispatch cannot interrupt concrete markdown content.
   *
   * @this {void}
   *
   * @param {Token} token
   *  The comment content to write
   * @param {boolean | undefined} [end]
   *  Whether to end the child stream after writing `token`
   * @return {undefined}
   */
  function write(
    this: void,
    token: Token,
    end?: boolean | undefined
  ): undefined {
    assert(self.containerState, 'expected `containerState` during write')
    assert(token !== content, 'did not expect `token` to match previous token')

    // lazily initialize comment content parser.
    comment ??= self.parser.comment(token.start)

    // associate child tokenizer with chunk for postprocessing.
    token._tokenizer ??= comment

    /**
     * The source chunks spanning {@linkcode token}.
     *
     * @const {Chunk[]} stream
     */
    const stream: Chunk[] = self.sliceStream(token)

    // signal end of `comment` stream.
    if (end) stream.push(codes.eos)

    // link tokens.
    // this inserts the chunk represented by `token` into the `comment` stream.
    token.previous = content
    if (content) content.next = token
    content = token

    // tell the `comment` tokenizer where normalized content starts.
    // comments "nibble" a prefix from margins.
    // where a logical comment line starts is defined here.
    if (token.previous) comment.defineSkip(token.start)

    // write the chunk to the child tokenizer.
    comment.write(stream)

    // mirror concrete markdown state onto `self`.
    // this prevents comments from piercing concrete markdown content.
    self.concrete = comment.concrete

    return void token
  }
}

/**
 * Tokenize a source-level comment.
 *
 * Constructs registered at the `source` level are attempted in extension order.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The unsuccessful tokenization state
 * @return {State}
 *  The initial state
 */
function tokenizeSourceComment(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return effects.attempt(this.parser.constructs.source, ok, nok)
}
