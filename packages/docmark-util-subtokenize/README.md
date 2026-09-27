# docmark-util-subtokenize

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=docmark-util-subtokenize%40*)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-util-subtokenize.svg)](https://npmjs.com/package/@flex-development/docmark-util-subtokenize)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-util-subtokenize.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-util-subtokenize?interval=30)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-util-subtokenize?cache)](https://bundlephobia.com/package/@flex-development/docmark-util-subtokenize)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-util-subtokenize)](https://packagephobia.now.sh/result?p=@flex-development/docmark-util-subtokenize)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark-util-subtokenize)](https://bundlephobia.com/package/@flex-development/docmark-util-subtokenize)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark)](LICENSE.md)

[docmark][] utility to tokenize subtokens.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`subtokenize(events)`][api-subtokenize]
  - [`subcontent(events, eventIndex)`][api-subcontent]
- [Types](#types)
- [Contribute](#contribute)

## What is this?

This packages exposes utilities to tokenize embedded content.

## When should I use this?

This package is useful when building ecosystems on top of docmark.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-util-subtokenize
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { subcontent, subtokenize } from 'https://esm.sh/@flex-development/docmark-util-subtokenize'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { subcontent, subtokenize } from 'https://esm.sh/@flex-development/docmark-util-subtokenize'
</script>
```

## Use

**TODO**: use

## API

This package exports the identifiers [`subtokenize`][api-subtokenize] and [`subcontent`][api-subcontent].\
There is no default export.

### `subtokenize(events)`

Tokenize embedded content.

Some tokens declare a [`ContentType`][content-type].\
These tokens do not contain fully parsed content themselves.
Tokens with a `chunk*` (i.e. `chunkMarkdown`, `chunkDocument`, `chunkFlow`) type and `contentType` act as containers
for another tokenizer.

For example:

```txt
comment
└─ chunkComment
```

A `chunkComment` token may contain embedded syntax.\
This function replaces those chunk tokens with the events produced by their child tokenizer.

#### Parameters

- `events` ([`Event[]`][event])
  — the current list of events

#### Returns

(`boolean`) Whether subtokens (embedded content) were found

### `subcontent(events, eventIndex)`

Tokenize embedded content for a single token.

The algorithm has three phases:

1. Feed linked chunk tokens to a child tokenizer
2. Determine which child events belong to each linked token
3. Replace `chunk*` events with their corresponding child events

#### Parameters

- `events` ([`Event[]`][event])
  — the parent event stream
- `eventIndex` (`number`)
  — the index of the corresponding `enter` event in `events`

#### Returns

(`undefined`) Nothing

## Types

This package is fully typed with [TypeScript][].\
It exports no additional types.

## Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

[api-subcontent]: #subcontentevents-eventindex

[api-subtokenize]: #subtokenizeevents

[content-type]: ../docmark-util-types/src/content-type.mts

[docmark]: ../../README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[event]: ../docmark-util-types/src/event.mts

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
