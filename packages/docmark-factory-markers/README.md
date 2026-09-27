# docmark-factory-markers

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=docmark-factory-markers%40*)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-factory-markers.svg)](https://npmjs.com/package/@flex-development/docmark-factory-markers)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-factory-markers.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-factory-markers?interval=30)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-factory-markers?cache)](https://bundlephobia.com/package/@flex-development/docmark-factory-markers)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-factory-markers)](https://packagephobia.now.sh/result?p=@flex-development/docmark-factory-markers)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark-factory-markers)](https://bundlephobia.com/package/@flex-development/docmark-factory-markers)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark)](LICENSE.md)

[docmark][] factory to parse comment markers.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`factoryMarkers(effects, ok, nok, markers)`][api-factory]
  - Utilities
    - [`normalize(marker)`][api-normalize]
- [Types](#types)
  - [`Info`][api-info]
  - [`Sequence`][api-sequence]
- [Contribute](#contribute)

## What is this?

This package exposes states to parse comment markers.

## When should I use this?

This package may be useful when making your own docmark extensions.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-factory-markers
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { factorMarkers } from 'https://esm.sh/@flex-development/docmark-factory-markers'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { factoryMarkers } from 'https://esm.sh/@flex-development/docmark-factory-markers'
</script>
```

## Use

**TODO**: use

## API

This package exports the identifier [`factoryMarkers`][api-factory].\
There is no default export.

### `factoryMarkers(effects, ok, nok, markers)`

Create a state that tokenizes a sequence of comment markers.

The returned state consumes each marker in `markers` in order.\
Each marker produces a token using the specified token type, or [`tt.commentMarker`][tt] by default.

If the input does not match the expected sequence, tokenization fails without consuming the mismatching character.

#### Parameters

- `effects` ([`Effects`][effects])
  — the context object used to transition the state machine
- `ok` ([`State`][state])
  — the successful tokenization state
- `nok` ([`State`][state])
  — the failed tokenization state
- `markers` ([`CodeCheck`][code-check] | [`Info`][api-info] | [`Marker`][marker] | [`Sequence`][api-sequence])
  — the comment marker matcher, info object, code, or sequence

#### Returns

([`State`][state]) The initial state

### Utilities

`@flex-development/docmark-factory-markers/utils` exports the identifier [`normalize`][api-normalize].\
There is no default export.

#### `normalize(marker)`

Normalize a comment marker configuration.

##### Parameters

- `marker` ([`CodeCheck`][code-check] | [`Info`][api-info] | [`Marker`][marker])
  — the comment marker matcher, info object, or code

##### Returns

([`Info`][api-info]) The comment marker info object

## Types

This package is fully typed with [TypeScript][].\
It exports additional types.

### `Info`

Info about how to tokenize a comment marker (`interface`).

#### Properties

- `code` ([`CodeCheck`][code-check] | [`Marker`][marker])
  — the character code to consume or the character code matcher
- `fields` ([`TokenFields`][token-fields] | `null` | `undefined`, optional)
  — the fields to attach to the emitted token
- `optional` (`boolean` | `null` | `undefined`, optional)
  — whether the comment marker is optional.\
  if `true`, an unexpected code successfully terminates the marker sequence.
- `type` ([`TokenType`][token-type] | `null` | `undefined`, optional)
  — the token type to emit when `code`, or the character code matched by `code` is consumed.\
  if `type` is `undefined` [`tt.commentMarker`][tt] is used.\
  if `null`, `code` is consumed without emitting a token

### `Sequence`

A comment marker info list (`type` alias).

Each element specifies a marker to consume and, optionally, the token type to emit for that marker.

At least one element is required.

```ts
type Sequence = [
  marker: CodeCheck | Info | Marker,
  ...markers: (CodeCheck | Info | Marker)[]
]
```

## Project

### Version

docmark-factory-markers adheres to [semver][].

### Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

### Sponsor

Small primitives power larger systems.
Support long-term stability by sponsoring Flex Development.

[api-factory]: #factorymarkerseffects-ok-nok-markers

[api-info]: #info

[api-normalize]: #normalizemarker

[api-sequence]: #sequence

[code-check]: https://github.com/flex-development/mark/blob/main/src/parse/types/code-check.mts

[docmark]: ../../README.md

[effects]: ../docmark-util-types/src/effects.mts

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[marker]: ../docmark-util-types/src/marker.mts

[semver]: https://semver.org

[state]: ../docmark-util-types/src/state.mts

[token-fields]: ../docmark-util-types/src/token-fields.mts

[token-type]: ../docmark-util-types/src/token-type.mts

[tt]: ../docmark-util-symbol/src/tt.mts

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
