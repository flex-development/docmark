# docmark

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=docmark%40*)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark.svg)](https://npmjs.com/package/@flex-development/docmark)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark.svg)](https://www.npmcharts.com/compare/@flex-development/docmark?interval=30)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark?cache)](https://bundlephobia.com/package/@flex-development/docmark)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark)](https://packagephobia.now.sh/result?p=@flex-development/docmark)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark)](https://bundlephobia.com/package/@flex-development/docmark)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark)](LICENSE.md)

a comment parser with support for markdown.

> **Note**: This is the `docmark` package from the docmark monorepo.\
> See the [monorepo readme][docmark] for more on the project.\
> See this readme for how to use it.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`docmark(value[, encoding][, options])`][api-docmark]
  - [`parse([options])`][api-parse]
  - [`postprocess(events)`][api-postprocess]
  - [`preprocess([options])`][api-preprocess]
- [Types](#types)
  - [`Options`][types-options]
- [Contribute](#contribute)

## What is this?

<!-- note: this section has to be in sync with the monorepo readme. -->

`docmark` is an open source comment parser with support for markdown written in TypeScript.\
The parser is implemented as a state machine that emits concrete tokens with positional info.\
External tools and libraries can turn these tokens into different things.

## When should I use this?

**TODO**: when should i use this?

## Install

This package is [ESM only][esm].

In Node.js (version 22+) with [yarn][]:

```sh
yarn add @flex-development/docmark
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { docmark } from 'https://esm.sh/@flex-development/docmark'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { docmark } from 'https://esm.sh/@flex-development/docmark'
</script>
```

## Use

**TODO**: use

## API

This package exports the identifiers [`docmark`][api-docmark], [`parse`][api-parse], [`postprocess`][api-postprocess],
and [`preprocess`][api-preprocess].\
The default export is `docmark`.

### `docmark(value[, encoding][, options])`

Create an event stream.

#### Overloads

```ts
function docmark(
  this: void,
  value: FileLike | Value | null | undefined,
  encoding?: Encoding | null | undefined,
  options?: Options | null | undefined
): Event[]
```

```ts
function docmark(
  this: void,
  value: FileLike | Value | null | undefined,
  options?: Options | null | undefined
): Event[]
```

#### Parameters

- `value` ([`FileLike`][file-like] | [`Value`][value] | `null` | `undefined`)
  — the source file or content to parse
- `encoding` ([`Encoding`][encoding] | `null` | `undefined`, optional)
  — the character encoding to use when `value` or its contents is an `Uint8Array`
- `options` ([`Options`][types-options] | `null` | `undefined`, optional)
  — the configuration options

#### Returns

([`Event[]`][event]) The list of events

### `parse([options])`

Create a parser.

Tokenizers deal with one content type.\
The parser is the object dealing with it all.

#### Parameters

- `options` ([`ParseOptions`][parse-options] | `null` | `undefined`, optional)
  — the parse options

#### Returns

([`ParseContext`][parse-context]) The parse context

### `postprocess(events)`

Postprocess events.

#### Parameters

- `events` ([`Event[]`][event])
  — the current list of events

#### Returns

([`Event[]`][event]) The list of changed events

### `preprocess([options])`

Create a preprocessor to turn a value into chunks.

#### Parameters

- `options` ([`PreprocessOptions`][preprocess-options] | `null` | `undefined`, optional)
  — the configuration options

#### Returns

([`Preprocessor`][preprocessor]) The preprocessor

## Types

This package is fully typed with [TypeScript][].\
It exports additional types.

### `Options`

#### Extends

- [`ParseOptions`][parse-options]
- [`PreprocessOptions`][preprocess-options]

#### Properties

- `contentType` ([`ContentType`][content-type] | `null` | `undefined`, optional)
  — the content type of the parser to run
  - **default**: [`constants.contentTypeComments`][constants]
- `from` ([`Point`][point] | `null` | `undefined`, optional)
  — the point before the first character in the content.\
  token positions will be relative to this point
  - **default**: `{ column: 1, line: 1, offset: 0 }`

## Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).\
By interacting with this repository, organization, or community you agree to abide by its terms.

[api-docmark]: #docmarkvalue-encoding-options

[api-parse]: #parseoptions

[api-postprocess]: #postprocessevents

[api-preprocess]: #preprocessoptions

[constants]: ../docmark-util-symbol/src/constants.mts

[content-type]: ../docmark-util-types/src/content-type.mts

[docmark]: ../../README.md

[encoding]: ../docmark-util-types/src/encoding.mts

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[event]: ../docmark-util-types/src/event.mts

[file-like]: ../docmark-util-types/src/file-like.mts

[parse-context]: ../docmark-util-types/src/parse-context.mts

[parse-options]: ../docmark-util-types/src/parse-options.mts

[point]: ../docmark-util-types/src/point.mts

[preprocess-options]: ../docmark-util-types/src/preprocess-options.mts

[preprocessor]: ../docmark-util-types/src/preprocessor.mts

[types-options]: #options

[typescript]: https://www.typescriptlang.org

[value]: ../docmark-util-types/src/value.mts

[yarn]: https://yarnpkg.com
