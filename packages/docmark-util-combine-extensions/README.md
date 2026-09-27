# docmark-util-combine-extensions

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=docmark-util-combine-extensions%40*)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-util-combine-extensions.svg)](https://npmjs.com/package/@flex-development/docmark-util-combine-extensions)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-util-combine-extensions.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-util-combine-extensions?interval=30)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-util-combine-extensions?cache)](https://bundlephobia.com/package/@flex-development/docmark-util-combine-extensions)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-util-combine-extensions)](https://packagephobia.now.sh/result?p=@flex-development/docmark-util-combine-extensions)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark-util-combine-extensions)](https://bundlephobia.com/package/@flex-development/docmark-util-combine-extensions)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark)](LICENSE.md)

[docmark][] utility to combine extensions.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`combineExtensions<T>(extensions)`][api-combine-extensions]
- [Types](#types)
- [Contribute](#contribute)

## What is this?

This package exposes a utility to merge multiple syntax extensions into one.

## When should I use this?

This package is useful when building docmark extensions.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-util-combine-extensions
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { combineExtensions } from 'https://esm.sh/@flex-development/docmark-util-combine-extensions'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { combineExtensions } from 'https://esm.sh/@flex-development/docmark-util-combine-extensions'
</script>
```

## Use

**TODO**: use

## API

The default, and only, export is [`combineExtensions`][api-combine-extensions].

### `combineExtensions<T>(extensions)`

Combine multiple extensions into one.

#### Overloads

```ts
function combineExtensions<T extends NormalizedExtension>(
  extensions: AnyExtension | AnyExtension[] | null | undefined
): T
```

```ts
function combineExtensions<T extends NormalizedExtension>(
  ...extensions: (AnyExtension | AnyExtension[] | null | undefined)[]
): T
```

#### Type Parameters

- `T` ([`NormalizedExtension`][normalized-extension])
  — the combined extension

#### Parameters

- `extensions` ([`AnyExtension`][any-extension] | [`AnyExtension[]`][any-extension] | `null` | `undefined`)
  — the extension to copy or the list of extensions to combine
- `...extensions` ([`(AnyExtension | AnyExtension[] | null | undefined)[]`][any-extension])
  — the extensions to combine

#### Returns

(`T`) The combined extension

## Types

This package is fully typed with [TypeScript][].\
It exports no additional types.

## Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

[api-combine-extensions]: #combineextensionstextensions

[any-extension]: ../docmark-util-types/src/any-extension.mts

[docmark]: ../../README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[normalized-extension]: ../docmark-util-types/src/normalized-extension.mts

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
