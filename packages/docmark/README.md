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
  - [`parse([options])`][api-parse]
  - [`postprocess(events)`][api-postprocess]
  - [`preprocess([options])`][api-preprocess]
- [Types](#types)
- [Contribute](#contribute)

## What is this?

**TODO**: what is this?

## When should I use this?

**TODO**: when should i use this?

## Install

This package is [ESM only][esm].

In Node.js (version 20+) with [yarn][]:

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
import { parse, postprocess, preprocess } from 'https://esm.sh/@flex-development/docmark'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { parse, postprocess, preprocess } from 'https://esm.sh/@flex-development/docmark'
</script>
```

## Use

**TODO**: use

## API

This package exports the identifiers [`parse`][api-parse], [`postprocess`][api-postprocess],
and [`preprocess`][api-preprocess].\
There is no default export.

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
It exports no additional types.

## Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

[api-parse]: #parseoptions

[api-postprocess]: #postprocessevents

[api-preprocess]: #preprocessoptions

[docmark]: ../../README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[event]: ../docmark-util-types/src/event.mts

[parse-context]: ../docmark-util-types/src/parse-context.mts

[parse-options]: ../docmark-util-types/src/parse-options.mts

[preprocess-options]: ../docmark-util-types/src/preprocess-options.mts

[preprocessor]: ../docmark-util-types/src/preprocessor.mts

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
