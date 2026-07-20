/**
 * @file Constructs - source
 * @module docmark/initialize/source
 */

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
import { eol, eos } from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The initial source document construct.
 *
 * The initializer scans a source document for comments.\
 * By default, it tokenizes docblock comments, but extensions can add other
 * comment constructs, such as constructs for hashbang (also known as shebang)
 * or line comments.\
 * Constructs registered for the `source` content type determine where comments
 * begin, while all other source text is treated as opaque input.
 *
 * Comments are delegated to a child `comment` tokenizer,
 * allowing comment parsing to remain independent of the surrounding language.
 *
 * Comments are siblings and cannot be nested.
 * Therefore, at most one comment may be active at any point in the stream.
 *
 * @const {InitialConstruct} source
 */
const source: InitialConstruct = { tokenize: tokenizeSource }

/**
 * The source comment construct.
 *
 * The construct acts as a dispatcher and attempts constructs registered
 * for the `source` content type.
 *
 * Centralizing dispatch allows the initializer to discover and continue
 * comments without depending on specific comment implementations.
 *
 * @const {Construct} comment
 */
const comment: Construct = { tokenize: tokenizeComment }

export default source

/**
 * Tokenize a source document.
 *
 * The initializer scans the source stream for comments.
 * Source text outside comments is consumed without interpretation, while
 * comment content is delegated to a child `comment` tokenizer.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeSource(this: TokenizeContext, effects: Effects): State {
  /**
   * A comment and its persistent state.
   *
   * This is a tuple where the first value is a continuable construct,
   * and the second value is the current container state.
   */
  type Comment = [construct: ContinuableConstruct, state: ContainerState]

  /**
   * The tokenization context.
   *
   * @const {TokenizeContext} self
   */
  const self: TokenizeContext = this

  /**
   * The comment stack.
   *
   * > 👉 **Note**: Comments do not nest.\
   * > The stack always contains at most one comment.
   *
   * @const {[Region?]} stack
   */
  const stack: [Comment?] = []

  /**
   * The comment content tokenizer.
   *
   * @var {TokenizeContext | undefined} child
   */
  let child: TokenizeContext | undefined

  /**
   * The most recently written comment chunk token.
   *
   * Used to link adjacent chunks written to the same child tokenizer.
   *
   * @var {Token | undefined} markdownToken
   */
  let childToken: Token | undefined

  /**
   * The index of the first event produced by the current continuation attempt.
   *
   * Events emitted after this index are linked to the active {@linkcode child}.
   *
   * @var {number} continued
   */
  let continued: number = 0

  return start

  /**
   * Start processing the source document.
   *
   * Source text is scanned for comments.
   * When a comment is already active, its `continuation` construct is given an
   * opportunity to continue before ordinary source parsing resumes.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function start(this: void, code: Code): State | undefined {
    if (!stack[0]) return tryComment(code)
    const [construct, containerState] = stack[0]

    continued = self.events.length
    self.containerState = containerState

    assert(construct.continuation, 'expected continuable construct')

    return effects.attempt(
      construct.continuation,
      afterContinuation,
      noContinuation
    )(code)
  }

  /**
   * After a successful comment continuation.
   *
   * Tokens produced by the continuation construct are first linked to the
   * comment content tokenizer.
   *
   * A continuation may finalize the active comment before consuming the entire
   * physical line. When that happens, the comment is closed and source parsing
   * resumes from the current position.
   *
   * Otherwise, any remaining content on the current line begins a new comment
   * chunk. If the continuation consumed the entire line, parsing resumes at the
   * beginning of the next line.
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

    // link any tokens produced by the current continuation construct.
    link()

    // close comment container.
    if (self.containerState._closeFlow) return noContinuation(code)

    // continuation construct did not process entire line.
    // start comment chunk from current point in the stream.
    if (!eol(self.previous)) return chunkStart(code)

    // get ready for next line.
    self.interrupt = Boolean(child?.currentConstruct)
    self.concrete = child?.concrete

    // continuation construct processed an entire line.
    assert(stack.length === 1, 'expected comment on `stack`')
    return start(code)
  }

  /**
   * Resume source parsing.
   *
   * The active comment is finalized before parsing continues from the current
   * position.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function noContinuation(this: void, code: Code): State | undefined {
    return flush(), tryComment(code)
  }

  /**
   * Attempt to enter a comment.
   *
   * Constructs registered for the `source` content type are tried.
   * If no comment can begin, `code` is consumed as ordinary source text.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryComment(this: void, code: Code): State | undefined {
    self.containerState = {}
    return effects.attempt(comment, takeComment, restart)(code)
  }

  /**
   * Resume scanning the source document.
   *
   * The current character does not begin a comment and is consumed as ordinary
   * source text.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function restart(this: void, code: Code): State | undefined {
    if (eos(code)) return void end(code)
    return effects.consume(code), start
  }

  /**
   * Register a newly discovered comment.
   *
   * Comments are siblings rather than nested, so the active comment stack must
   * be empty before registration.
   *
   * If the comment begins in the middle of a physical line, parsing immediately
   * begins a comment chunk. Otherwise, the comment continuation construct is
   * given the first opportunity to process the following line.
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

    // register new comment.
    assert(stack.length === 0, 'expected empty comment stack')
    stack[0] = [self.currentConstruct, self.containerState] as Comment

    // close comment container before continuation attempt.
    if (self.containerState._closeFlow) return noContinuation(code)

    // try to continue comment from beginning of new line.
    if (eol(self.previous)) return start(code)

    // start comment chunk from current position.
    return chunkStart(code)
  }

  /**
   * Start a comment chunk.
   *
   * Comment chunks are written to a child `comment` tokenizer.
   * The child tokenizer is created lazily and reused until the active comment
   * is finalized.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function chunkStart(this: void, code: Code): State | undefined {
    // chunk cannot start on eos code.
    if (eos(code)) return void end(code)

    // initialize comment content tokenizer.
    child ??= self.parser.comment(self.now())

    // start new comment chunk.
    effects.enter(tt.chunkComment, {
      _tokenizer: child,
      contentType: constants.contentTypeComment,
      previous: childToken
    })

    // consume code as part of chunk.
    return chunkContinue(code)
  }

  /**
   * Continue a comment chunk.
   *
   * Comment chunks consume ordinary comment content through the current
   * physical line. When the line ends, the completed chunk is written to the
   * child `comment` tokenizer before parsing resumes.
   *
   * The next line begins with another continuation attempt, allowing the active
   * comment to recognize line prefixes, closing syntax, or other continuation
   * constructs before another chunk is started.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function chunkContinue(this: void, code: Code): State | undefined {
    if (eos(code)) {
      write(effects.exit(tt.chunkComment), true)
      return void end(code)
    }

    if (eol(code)) {
      effects.consume(code)
      write(effects.exit(tt.chunkComment))

      // clear interruption state to get ready for the next line.
      self.interrupt = undefined

      return start
    }

    effects.consume(code)
    return chunkContinue
  }

  /**
   * Finish the source document.
   *
   * Any active comment and child tokenizer are finalized before the end-of-
   * stream marker is consumed.
   *
   * Source content remaining outside comments is intentionally discarded before
   * the end-of-stream marker is emitted.
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

    flush()

    effects.enter(tt.eoc)
    effects.consume(code)
    effects.exit(tt.eoc)

    return void code
  }

  /**
   * Finalize the active comment.
   *
   * Any open comment chunk is closed before the active comment construct exits.
   * Persistent parser state associated with the comment is then discarded,
   * allowing source parsing to resume with a clean context.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function flush(this: void): undefined {
    assert(stack.length <= 1, 'expected no more than 1 comment')

    // finish comment chunk.
    if (child && !eos(child.code)) closeChunk()

    // exit the active comment.
    while (stack.length) {
      const [construct, containerState] = stack.pop()!
      self.containerState = containerState
      construct.exit.call(self, effects)
    }

    // get ready for new comment.
    self.containerState = {}

    // get ready for the next line.
    self.concrete = undefined
    self.interrupt = undefined

    return void stack
  }

  /**
   * Link continuation output to the child `comment` tokenizer.
   *
   * Continuation constructs may emit completed comment chunks while deciding
   * how a comment should continue. Newly emitted chunks are forwarded to the
   * active child tokenizer in emission order.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function link(this: void): undefined {
    while (continued < self.events.length) {
      assert(self.events[continued], 'expected `self.events[continued]`')
      const [event, token] = self.events[continued]!
      if (event === ev.exit && token.type === tt.chunkComment) write(token)
      continued++
    }

    return void self.events
  }

  /**
   * Write a comment chunk to the {@linkcode child} tokenizer.
   *
   * The chunk token is linked to the previously written chunk before its source
   * range is sliced from the parent stream and written to the child tokenizer.
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
    child ??= self.parser.comment(token.start)

    /**
     * The source chunks spanning {@linkcode token}.
     *
     * @const {Chunk[]} stream
     */
    const stream: Chunk[] = self.sliceStream(token)

    // signal end of child stream.
    if (end) stream.push(codes.eos)

    // link tokens.
    token.previous = childToken
    if (childToken) childToken.next = token
    childToken = token

    // tell the child tokenizer where to start.
    child.defineSkip(token.start)

    // write chunks to child stream.
    child.write(stream)

    // signal concrete content was encountered.
    self.concrete = child.concrete

    return void 0
  }

  /**
   * Finalize the active child `comment` tokenizer.
   *
   * Closing the child tokenizer completes the current comment content steam.
   * Later comments will create a new tokenizer with independent parser state.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function closeChunk(this: void): undefined {
    assert(child, 'expected `child` to be defined when closing it')

    child.write([codes.eos])
    child = undefined
    childToken = undefined

    return void child
  }
}

/**
 * Tokenize a source-level comment.
 *
 * Constructs registered for the `source` content type are attempted
 * in extension order.
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
function tokenizeComment(
  this: TokenizeContext,
  effects: Effects,
  ok: State,
  nok: State
): State {
  return effects.attempt(this.parser.constructs.source, ok, nok)
}
