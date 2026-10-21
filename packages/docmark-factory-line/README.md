# docmark-factory-line

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=docmark-factory-line%40*)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-factory-line.svg)](https://npmjs.com/package/@flex-development/docmark-factory-line)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-factory-line.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-factory-line?interval=30)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-factory-line?cache)](https://bundlephobia.com/package/@flex-development/docmark-factory-line)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-factory-line)](https://packagephobia.now.sh/result?p=@flex-development/docmark-factory-line)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark-factory-line)](https://bundlephobia.com/package/@flex-development/docmark-factory-line)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark)](LICENSE.md)

[docmark][] factory to parse line comments.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`factoryLineComment<T>(options)`][api-factory]
- [Types](#types)
  - [`Options`][api-options]
- [Contribute](#contribute)

## What is this?

This package exposes a construct factory.

The returned construct parses line comments.

## When should I use this?

This package may be useful when making your own docmark extensions.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-factory-line
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { factoryLineComment } from 'https://esm.sh/@flex-development/docmark-factory-line'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { factoryLineComment } from 'https://esm.sh/@flex-development/docmark-factory-line'
</script>
```

## Use

**TODO**: use

## API

This package exports the identifier [`factoryLineComment`][api-factory].\
There is no default export.

### `factoryLineComment<T>(options)`

Create a construct that tokenizes line comments.

#### Type Parameters

- `T` ([`ContinuableConstruct`][continuable-construct])
  — the line comment construct

#### Parameters

- `options` ([`Options`][api-options])
  — the options for creating the construct

#### Returns

(`T`) The line comment construct

## Types

This package is fully typed with [TypeScript][].\
It exports additional types.

### `Options`

Options for creating a line comment construct (`interface`).

#### Properties

- `allowIndentedContinuation` ([`AllowIndentedLines`][allow-indented-lines] | `boolean` | `undefined`, optional)
  — whether continued lines can be indented in lieu of explicit line markers,
  or a function that returns a boolean indicating as such.\
  a continued line is any line after that first line of an active comment.\
  when indented syntax is enabled, line markers for a continued line are any character codes satisfying
  the [`whitespace`][whitespace] predicate
- `construct` ([`Partial<Construct>`][construct] | `null` | `undefined`, optional)
  — additional construct info.
  > 👉 **note**: the construct's `continuation` and `tokenize` properties will be overridden.\
  > the `exit` hook is called before the factory's `exit` hook exits the line comment
- `fields` ([`CreateFields`][create-fields] | [`TokenFields`][token-fields] | `null` | `undefined`, optional)
  — additional `comment` token fields, or a function that returns the token fields object.\
  fields are applied when the token is `enter`ed.
- `finalizeConstruct` ([`FinalizeConstruct<ContinuableConstruct>`][finalize-construct] | `null` | `undefined`, optional)
  — finalize the line comment construct
- `markers` ([`CreateMarkers`][create-markers] | [`Markers`][markers])
  — the line markers configuration, or a function that returns the configuration

## Project

### Version

docmark-factory-line adheres to [semver][].

### Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

### Sponsor

Small primitives power larger systems.
Support long-term stability by sponsoring Flex Development.

[allow-indented-lines]: ../docmark-util-types/src/allow-indented-lines.mts

[api-factory]: #factorylinecommenttoptions

[api-options]: #options

[construct]: ../docmark-util-types/src/construct.mts

[continuable-construct]: ../docmark-util-types/src/continuable-construct.mts

[create-fields]: ../docmark-util-types/src/create-fields.mts

[create-markers]: ../docmark-util-types/src/create-markers.mts

[docmark]: ../../README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[finalize-construct]: ../docmark-util-types/src/finalize-construct.mts

[markers]: ../docmark-util-types/src/markers.mts

[semver]: https://semver.org

[token-fields]: ../docmark-util-types/src/token-fields.mts

[typescript]: https://www.typescriptlang.org

[whitespace]: https://github.com/flex-development/mark-util-character/blob/main/src/lib/whitespace.mts

[yarn]: https://yarnpkg.com
