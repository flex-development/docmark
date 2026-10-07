/**
 * @file Initialize - comments
 * @module docmark/initialize/comments
 */

import { blankLine } from '@flex-development/docmark-grammar'
import { codes, constants, ev, tt } from '@flex-development/docmark-util-symbol'
import type {
  Chunk,
  Code,
  Construct,
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
import {
  bos,
  eol,
  eos,
  whitespace
} from '@flex-development/mark-util-character'
import { ok as assert } from 'devlop'

/**
 * The initial source comments construct.
 *
 * The initializer scans source content for comments.\
 * Comment syntax is provided by extensions through constructs registered at the
 * `comments` level.
 * These constructs determine where comments begin and end.
 *
 * Content not consumed by a registered comment construct is consumed as opaque
 * source language input and is not represented directly in the resulting event
 * stream.
 *
 * Each discovered comment delegates its content to a child `comment` tokenizer,
 * keeping comment parsing independent from the surrounding source language.
 * Source language input is written incrementally to a child `language`
 * tokenizer so a language's lexical state can participate in comment discovery.
 *
 * Comments are siblings and cannot be nested.
 * Therefore, at most one comment may be active at any point in the stream.
 *
 * @const {InitialConstruct} comments
 */
const comments: InitialConstruct = { tokenize: tokenizeComments }

export default comments

/**
 * The source comment construct.
 *
 * The construct attempts constructs registered at the `comments` level in
 * extension order.
 *
 * Centralizing dispatch allows the initializer to discover comments without
 * depending on particular comment syntaxes.
 *
 * @const {Construct} sourceComment
 */
const sourceComment: Construct = { tokenize: tokenizeSourceComment }

/**
 * Tokenize source comments.
 *
 * The initializer scans source content for comments using constructs registered
 * at the `comments` level.
 * Content outside comments is consumed inside {@linkcode tt.chunkLanguage}
 * tokens and written incrementally to the active source {@linkcode language}
 * tokenizer.
 *
 * Each discovered comment is maintained as an active construct while its
 * content is delegated to a child `comment` tokenizer.
 * The active comment token is propagated to that tokenizer so comment-level
 * constructs can determine which syntax is currently being parsed.
 *
 * The source `language` tokenizer is advanced before comment discovery at each
 * source position.
 * This allows the source language to retain lexical state that may determine
 * whether comment syntax is valid at that position.
 *
 * @this {TokenizeContext}
 *
 * @param {Effects} effects
 *  The context object used to transition the state machine
 * @return {State}
 *  The initial state
 */
function tokenizeComments(this: TokenizeContext, effects: Effects): State {
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
   * child {@linkcode comment} tokenizer.
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

  /**
   * The most recently emitted source language chunk token.
   *
   * Used to form the doubly linked sequence of {@linkcode tt.chunkLanguage}
   * tokens spanning source language content.
   *
   * @var {Token | undefined} lang
   */
  let lang: Token | undefined

  /**
   * The active child source `language` tokenizer.
   *
   * The tokenizer is created lazily and reused for source language content
   * until the stream is finalized.
   *
   * @var {TokenizeContext | undefined} language
   */
  let language: TokenizeContext | undefined

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
   * Start or resume source scanning.
   *
   * When no comment is active, blank lines are written to the source `language`
   * tokenizer and comment constructs are attempted at the current position
   * otherwise.
   *
   * When a comment is active, its `continuation` construct is attempted with
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

    // lazily initialize container state.
    self.containerState ??= {}

    // no comment on stack.
    // delegate blank lines to the `language` parser.
    // otherwise, try to enter a new comment.
    if (!stack[0]) {
      return effects.check(blankLine, sourceStart, tryComment)(code)
    }

    // comment on stack.
    // try continuing the active comment.
    return tryContinuation(code)
  }

  /**
   * Continue the active comment.
   *
   * The active comment's `continuation` construct is attempted with its
   * persistent container state.
   * Before the attempt, the current event index is recorded so tokens emitted
   * by a successful continuation can be forwarded to the active child
   * {@linkcode comment} tokenizer.
   *
   * The initializer inherits the child `comment` tokenizer's interruption state
   * so comment continuation can respect constructs that are active inside the
   * normalized comment content stream.
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

    // capture the current number of events before attempting continuation.
    // this is used to determine where to begin forwarding tokens after
    // a successful continuation.
    continued = self.events.length

    // capture the current place before attempting continuation.
    // this is used to determine if continuation consumed any input.
    then = self.now()

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
   * Resume after a successful comment continuation.
   *
   * Any `comment` content chunks emitted by the `continuation` construct are
   * first forwarded to the active child {@linkcode comment} tokenizer.
   *
   * A successful continuation can:
   *
   * - request that the comment close
   * - consume no input, in which case a new chunk begins at the same position
   * - consume part of a line, in which case remaining content becomes a chunk
   * - consume an entire line, in which case the next line is processed
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
    assert(then, 'expected `then` after continuing')

    // forward any comment chunks emitted by continuation.
    forward()

    // close comment container.
    if (self.containerState._closeFlow) return noContinuation(code)

    // comment no longer considered fresh.
    self.parser.freshComment = false

    /**
     * The current place in the content.
     *
     * @const {Place} now
     */
    const now: Place = self.now()

    // continuation succeeded without consuming input.
    // start comment chunk from unchanged stream position.
    if (
      then.line === now.line &&
      then.column === now.column &&
      then.offset === now.offset &&
      then._bufferIndex === now._bufferIndex &&
      then._index === now._index
    ) {
      return chunkStart(code)
    }

    // continuation construct did not consume entire line.
    // start comment chunk from current point in the stream.
    if (!eol(self.previous)) return chunkStart(code)

    // continuation construct consumed entire line.
    return start(code)
  }

  /**
   * Resume scanning after a failed comment continuation.
   *
   * The active comment content stream and comment are finalized before a new
   * comment is attempted at the current position.
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
   * Attempt to enter a comment.
   *
   * The container state is reset before registered constructs are attempted.\
   * Whitespace is consumed as opaque content before the attempt.
   *
   * If no construct succeeds, the current code is consumed as opaque content.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function tryComment(this: void, code: Code): State | undefined {
    assert(stack.length === 0, 'expected empty comment stack')

    // capture whitespace before attempting comment.
    if (whitespace(code)) return sourceStart(code)

    // reset container state to get ready for new comment.
    self.containerState = {}

    // capture current number of events before attempting the comment.
    // this is used to determine where to begin forwarding tokens after
    // successfully entering the comment.
    continued = self.events.length

    // try entering a comment.
    // register new comment if one can begin.
    // start new source language chunk otherwise.
    return effects.attempt(sourceComment, takeComment, sourceStart)(code)
  }

  /**
   * Register a newly entered comment.
   *
   * The successful comment construct and its persistent container state are
   * registered as the sole active comment.
   * The emitted `comment` token is stored on {@linkcode self.containerState}
   * and propagated to the active child {@linkcode comment} tokenizer.
   *
   * Comment content tokens emitted while entering the comment are forwarded to
   * the child `comment` tokenizer.
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

    /**
     * The first event produced by the comment's `tokenize` method.
     *
     * @const {Event | undefined} event
     */
    const event: Event | undefined = self.events[continued]

    assert(event, 'expected `self.events[continued]`')
    assert(event[0] === ev.enter, 'expected `enter` event')
    assert(event[1].type === tt.comment, 'expected `comment` enter event')

    // capture the active comment token.
    self.containerState.comment = event[1]

    // forward any comment chunks emitted by `tokenize`.
    forward()

    // register new comment.
    assert(stack.length === 0, 'expected empty comment stack')
    stack[0] = [self.currentConstruct, self.containerState] as Comment

    // signal freshly added comment.
    self.parser.freshComment = true

    // signal active comment.
    self.parser.activeComment = true

    // immediate closure requested; bypass continuation attempt.
    if (self.containerState._closeFlow) return noContinuation(code)

    // try to continue comment from beginning of new line.
    if (eol(self.previous)) return start(code)

    // start comment chunk from current position.
    return chunkStart(code)
  }

  /**
   * Start a comment content chunk.
   *
   * The child {@linkcode comment} tokenizer is created lazily and associated
   * with the new `chunkComment` token.
   *
   * The chunk is linked to the preceding comment {@linkcode content} token so
   * normalized comment content can span multiple tokens while remaining a part
   * of one logical child stream.
   *
   * The active comment token is propagated to the child tokenizer's container
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
    assert(self.containerState, 'expected `containerState` inside comment')
    assert(self.containerState.comment, 'expected comment token')
    assert(stack.length === 1, 'expected comment on `stack`')

    // end of stream.
    // finalize the current comment content stream and active comment.
    if (eos(code)) return void end(code)

    // lazily initialize comment content parser.
    comment ??= self.parser.comment(self.now())

    // lazily initialize the comment content parser's container state.
    comment.containerState ??= {}

    // expose the active `comment` token to `comment`-level constructs.
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
   * written to the child {@linkcode comment} tokenizer.
   *
   * After consuming a line ending, processing then returns to the active
   * comment's `continuation` so it can recognize prefixes, closing syntax,
   * or other line-boundary specific behavior before another chunk begins.
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

    // at end of stream.
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
      self.interrupt = undefined // get ready for the next line.
      return start
    }

    // consume ordinary comment content.
    effects.consume(code)
    return chunkContinue
  }

  /**
   * Start a source language chunk.
   *
   * The source {@linkcode language} tokenizer is created lazily and receives
   * source input incrementally as it is consumed.\
   * The emitted {@linkcode tt.chunkLanguage} token represents the corresponding
   * source language slice and is linked to the preceding source language chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function sourceStart(this: void, code: Code): State | undefined {
    assert(!comment, 'did not expect comment content parser')
    assert(stack.length === 0, 'expected empty comment stack')

    // at end of stream.
    // finalize all streams.
    if (eos(code)) return void end(code)

    // lazily initialize the source language parser.
    language ??= self.parser.language?.(self.now())

    // tell the source `language` parser to advance at stream breaks.
    // stream breaks are written to the active `language` tokenizer after an
    // active comment has been exited. they're used to ensure the child parser
    // advances position correctly when a comment is active.
    // afterwards, set the `language` tokenizer's previous character code.
    // this is so the parser does not think it is at the beginning of its stream
    // when a source language chunk starts in the middle of this stream.
    if (language) {
      language.moveOnBreak = true
      language.previous = self.previous
    }

    // create the source language chunk token
    // and link it to the previous source language chunk.
    lang = link(lang, effects.enter(tt.chunkLanguage, {
      _tokenizer: language,
      contentType: constants.contentTypeLanguage
    }))

    return sourceContinue(code)
  }

  /**
   * Continue a source language chunk.
   *
   * Source input is written to the active {@linkcode language} tokenizer as it
   * is consumed.\
   * At a line ending, the line ending is written to the tokenizer and included
   * in the completed {@linkcode tt.chunkLanguage} token.
   *
   * When a comment can begin at the current position, the source language chunk
   * is closed before the comment is captured.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function sourceContinue(this: void, code: Code): State | undefined {
    // at end of stream.
    // finish the source language chunk and finalize all streams.
    if (eos(code)) {
      effects.exit(tt.chunkLanguage) // finish source language chunk.
      return void end(code) // finalize all streams.
    }

    // at the end of a line.
    if (eol(code)) {
      write(code) // write to the active `language` parser.
      effects.consume(code) // add to source language chunk.
      effects.exit(tt.chunkLanguage) // finish source language chunk.
      return start // resume scanning from beginning of next line.
    }

    // finish chunk if a comment can start.
    // consume `code` as source content otherwise.
    return effects.check(sourceComment, atSourceComment, sourceConsume)(code)
  }

  /**
   * Consume `code` as part of the current source language chunk.
   *
   * The code is written as a character to the active child {@linkcode language}
   * tokenizer before being added to the current language chunk.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function sourceConsume(this: void, code: Code): State | undefined {
    write(code) // write to the active `language` parser.
    effects.consume(code) // add to source language chunk.
    return sourceContinue // continue source language chunk.
  }

  /**
   * Finish the current source language chunk before a confirmed comment.
   *
   * The comment is left unconsumed so the attempt can be delegated to
   * {@linkcode tryComment} and the new comment can be properly registered.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The current character code
   * @return {State | undefined}
   *  The next state
   */
  function atSourceComment(this: void, code: Code): State | undefined {
    effects.exit(tt.chunkLanguage) // finish source language chunk.
    return tryComment(code) // start new comment.
  }

  /**
   * Finish the stream.
   *
   * The active comment and child {@linkcode comment} tokenizer are finalized
   * before the source {@linkcode language} stream is ended.
   *
   * The end-of-content token is emitted after all child streams have been
   * finalized.
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

    // finish the source language stream.
    // eos will be forwarded to the active `language` tokenizer by `write`.
    write(codes.eos)
    language = undefined
    lang = undefined

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
   * The active child {@linkcode comment} tokenizer is finalized
   * and its token-link state is cleared.
   * The active comment's persistent container state is then restored before its
   * `exit` hook is called.
   *
   * The source {@linkcode language} tokenizer is synchronized with the current
   * stream so its source positions remain aligned.
   *
   * Later comments create independent child tokenizers and do not inherit
   * parsing state from the finalized comment.
   *
   * > 👉 **Note**: Comments cannot nest, so the stack always contains at most
   * > one item. The loop keeps teardown generic.
   *
   * @this {void}
   *
   * @return {undefined}
   */
  function flush(this: void): undefined {
    assert(stack.length <= 1, 'expected no more than 1 comment')

    // finish the comment content stream.
    !eos(comment?.code ?? codes.eos) && comment!.write([codes.eos])
    comment = undefined
    content = undefined

    // exit the active comment.
    while (stack.length) {
      const [construct, containerState] = stack.pop()!
      self.containerState = containerState
      construct.exit.call(self, effects)
    }

    // sync stream positions.
    // this is required for proper token positions at the `language` level.
    // also needed for `subtokenize` to properly replace chunks.
    if (self.containerState?.comment && language) {
      /**
       * The chunks spanning the current comment token.
       *
       * @const {Chunk[]} chunks
       */
      const chunks: Chunk[] = self.sliceStream(self.containerState.comment)

      // propagate comments as stream breaks to the `language` tokenizer.
      for (const chunk of chunks) {
        assert(!eos(chunk), 'did not expect `codes.eos`')

        // write a line ending directly.
        // the code is written even though it is comment content so that custom
        // `language` tokenizers advance position correctly.
        // custom `language` initializers are responsible for checking if the
        // line ending is inside a comment.
        // because transient parsing state hasn't been cleared yet, this can be
        // done by checking `self.parser.activeComment`, or for a more targeted
        // check, `self.parser.activeComment && eol(code)`.
        if (typeof chunk === 'number') {
          assert(eol(chunk), 'expected line ending')
          language.write([chunk])
          continue
        }

        // write string chunks as a series of stream breaks.
        // a stream break means an active comment has been encountered.
        // the child `language` tokenizer is preconfigured to advance position.
        for (const char of chunk) {
          language.write([codes.break])
          void char
        }
      }
    }

    // get ready for the next comment.
    self.currentConstruct = undefined
    self.containerState = {}
    self.parser.activeComment = undefined
    self.parser.skipSummary = undefined

    return void stack
  }

  /**
   * Forward emitted tokens to the child {@linkcode comment} tokenizer.
   *
   * Comment constructs may emit `chunkComment` tokens.\
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
   * Link the current chunk `token` to the `previous` token.
   *
   * @this {void}
   *
   * @param {Token | undefined} previous
   *  The previous chunk token
   * @param {Token} token
   *  The current chunk token
   * @return {Token}
   *  The new previous token
   */
  function link(
    this: void,
    previous: Token | undefined,
    token: Token
  ): Token {
    assert(token !== previous, 'did not expect `token` to match `previous`')

    // link the tokens together.
    token.previous = previous
    if (previous) previous.next = token

    return token
  }

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Write a chunk to the active child {@linkcode language} tokenizer.
   *
   * Ordinary characters are serialized into a single-character chunk before
   * being written.\
   * Line endings and end-of-stream are written directly as character codes.
   *
   * @this {void}
   *
   * @param {Code} code
   *  The character code representing the source language input
   * @return {undefined}
   */
  function write(this: void, code: Code): undefined

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * Write a chunk to the child {@linkcode comment} tokenizer.
   *
   * The token is linked to the previously written comment content token,
   * associated with the active child tokenizer, sliced from the current stream,
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
   *  The token representing the comment content chunk
   * @param {boolean | undefined} [end]
   *  Whether to end the child stream after writing `token`
   * @return {undefined}
   */
  function write(this: void, token: Token, end?: boolean | undefined): undefined

  /**
   * Write a source language or comment content chunk.
   *
   * @this {void}
   *
   * @param {Code | Token} chunk
   *  The chunk to write
   * @param {boolean | undefined} [end]
   *  If `chunk` is a token,
   *  whether to end the child stream after writing `chunk`
   * @return {undefined}
   */
  function write(
    this: void,
    chunk: Code | Token,
    end?: boolean | undefined
  ): undefined {
    if (typeof chunk === 'object' && chunk && 'start' in chunk) {
      assert(chunk !== content, 'did not expect `token` to match `content`')

      // lazily initialize comment content parser.
      comment ??= self.parser.comment(chunk.start)

      // associate child tokenizer with chunk for postprocessing.
      chunk._tokenizer ??= comment

      /**
       * The chunks spanning the current token.
       *
       * @const {Chunk[]} stream
       */
      const stream: Chunk[] = self.sliceStream(chunk)

      // signal end of child stream.
      if (end) stream.push(codes.eos)

      // link tokens.
      // this inserts the chunk represented by `token` into the child stream.
      content = link(content, chunk)

      // tell the child tokenizer where normalized content starts.
      // comments can "nibble" a prefix from margins.
      // where a logical comment line starts is defined here.
      if (chunk.previous) comment.defineSkip(chunk.start)

      // write the chunk to the child stream.
      comment.write(stream)

      // mirror concrete markdown state onto `self`.
      // this prevents comments from piercing concrete markdown content.
      self.concrete = comment.concrete
    } else if (language) {
      /**
       * The current place in the content.
       *
       * @const {Place} now
       */
      const now: Place = self.now()

      // sync stream positions.
      // this is required for proper token positions at the `language` level.
      // also needed for `subtokenize` to properly replace chunks.
      language.place.column = now.column
      language.place.line = now.line
      language.place.offset = now.offset

      // write the chunk to the child stream.
      if (eol(chunk) || eos(chunk)) language.write([chunk])
      else language.write([self.serializeChunks([chunk])])
    }

    return void chunk
  }
}

/**
 * Tokenize a source comment.
 *
 * Constructs registered at the `comments` level are attempted
 * in extension order.
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
  return effects.attempt(this.parser.constructs.comments, ok, nok)
}
