# docmark-factory-block

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=docmark-factory-block%40*)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-factory-block.svg)](https://npmjs.com/package/@flex-development/docmark-factory-block)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-factory-block.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-factory-block?interval=30)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-factory-block?cache)](https://bundlephobia.com/package/@flex-development/docmark-factory-block)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-factory-block)](https://packagephobia.now.sh/result?p=@flex-development/docmark-factory-block)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark-factory-block)](https://bundlephobia.com/package/@flex-development/docmark-factory-block)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark)](LICENSE.md)

[docmark][] factory to parse block comments.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`factoryBlockComment<T>(options)`][api-factory]
- [Types](#types)
  - [`AllowIndentedLines`][api-allow-indented-lines]
  - [`CreateFields`][api-create-fields]
  - [`CreateMarkers`][api-create-markers]
  - [`FinalizeConstruct`][api-finalize-construct]
  - [`Markers`][api-markers]
  - [`Options`][api-options]
- [Contribute](#contribute)

## What is this?

This package exposes a construct factory.

The returned construct parses block comments.

## When should I use this?

This package may be useful when making your own docmark extensions.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-factory-block
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { factoryBlockComment } from 'https://esm.sh/@flex-development/docmark-factory-block'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { factoryBlockComment } from 'https://esm.sh/@flex-development/docmark-factory-block'
</script>
```

## Use

**TODO**: use

## API

This package exports the identifier [`factoryBlockComment`][api-factory].\
There is no default export.

### `factoryBlockComment<T>(options)`

Create a construct that tokenizes block comments.

#### Type Parameters

- `T` ([`ContinuableConstruct`][continuable-construct])
  — the block comment construct

#### Parameters

- `options` ([`Options`][api-options])
  — the options for creating the construct

#### Returns

(`T`) The block comment construct

## Types

This package is fully typed with [TypeScript][].\
It exports additional types.

### `AllowIndentedLines`

Check whether continued lines can be indented in lieu of an explicit marker (`type` alias).

A continued line is any line after the first line of an active comment.\
When indented syntax is enabled, the line marker for a continued line is any character code satisfying
the [`whitespace`][whitespace] predicate.

```ts
type AllowIndentedLines = (this: TokenizeContext) => boolean
```

#### Parameters

- **`this`** ([`TokenizeContext`][tokenize-context])
  — the tokenization context

#### Returns

(`boolean`) Whether a continued line can be indented

### `CreateFields`

Create a token fields object (`type` alias).

```ts
type CreateFields = (this: TokenizeContext) => TokenFields
```

#### Parameters

- **`this`** ([`TokenizeContext`][tokenize-context])
  — the tokenization context

#### Returns

([`TokenFields`][token-fields]) The token fields object

### `CreateMarkers`

Create a markers configuration (`type` alias).

```ts
type CreateMarkers = (this: TokenizeContext) => Markers
```

#### Parameters

- **`this`** ([`TokenizeContext`][tokenize-context])
  — the tokenization context

#### Returns

([`Markers`][api-markers]) The markers configuration

### `FinalizeConstruct`

Finalize a block comment construct (`type` alias).

```ts
type FinalizeConstruct = (
  this: void,
  construct: ContinuableConstruct
) => undefined
```

#### Parameters

- `construct` ([`ContinuableConstruct`][continuable-construct])
  — the construct to finalize

#### Returns

(`undefined`) Nothing

### `Markers`

Settings for configuring block comment markers (`interface`).

#### Properties

- `closer` ([`Info`][info] | [`Marker`][marker] | [`Sequence`][sequence])
  — the comment closer marker code, info, or sequence
- `line` ([`Info`][info] | [`Marker`][marker] | `undefined`, optional)
  — the comment line marker code or info
- `opener` ([`Info`][info] | [`Marker`][marker] | [`Sequence`][sequence])
  — the comment opener marker code, info, or sequence

### `Options`

Options for creating a block comment construct (`interface`).

#### Properties

- `allowIndentedContinuation` ([`AllowIndentedLines`][api-allow-indented-lines] | `boolean` | `undefined`, optional)
  — whether continued lines can be indented in lieu of an explicit line marker,
  or a function that returns a boolean indicating as such.\
  a continued line is any line after that first line of an active comment.\
  when indented syntax is enabled, the line marker for a continued line is any character codes satisfying
  the [`whitespace`][whitespace] predicate
- `construct` ([`Partial<Construct>`][construct] | `null` | `undefined`, optional)
  — additional construct info.
  > 👉 **note**: the construct's `continuation` and `tokenize` properties will be overridden.\
  > the `exit` hook is called before the factory's `exit` hook exits the block comment
- `fields` ([`CreateFields`][api-create-fields] | [`TokenFields`][token-fields] | `null` | `undefined`, optional)
  — additional `comment` token fields, or a function that returns the token fields object.\
  fields are applied when the token is `enter`ed.
- `finalizeConstruct` ([`FinalizeConstruct`][api-finalize-construct] | `null` | `undefined`, optional)
  — finalize the block comment construct
- `markers` ([`CreateMarkers`][api-create-markers] | [`Markers`][api-markers])
  — the markers configuration, or a function that returns the configuration

## Project

### Version

docmark-factory-block adheres to [semver][].

### Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

### Sponsor

Small primitives power larger systems.
Support long-term stability by sponsoring Flex Development.

[api-allow-indented-lines]: #allowindentedlines

[api-create-fields]: #createfields

[api-create-markers]: #createmarkers

[api-factory]: #factoryblockcommenttoptions

[api-finalize-construct]: #finalizeconstruct

[api-markers]: #markers

[api-options]: #options

[construct]: ../docmark-util-types/src/construct.mts

[continuable-construct]: ../docmark-util-types/src/continuable-construct.mts

[docmark]: ../../README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[info]: ../docmark-factory-markers/README.md#info

[marker]: ../docmark-util-types/src/marker.mts

[semver]: https://semver.org

[sequence]: ../docmark-factory-markers/README.md#sequence

[token-fields]: ../docmark-util-types/src/token-fields.mts

[tokenize-context]: ../docmark-util-types/src/tokenize-context.mts

[typescript]: https://www.typescriptlang.org

[whitespace]: https://github.com/flex-development/mark-util-character/blob/main/src/lib/whitespace.mts

[yarn]: https://yarnpkg.com
