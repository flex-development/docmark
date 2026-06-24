# docmark-util-symbol

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/docmark/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-util-symbol.svg)](https://npmjs.com/package/@flex-development/docmark-util-symbol)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-util-symbol.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-util-symbol?interval=30)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-util-symbol)](https://packagephobia.now.sh/result?p=@flex-development/docmark-util-symbol)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-util-symbol?cache)](https://bundlephobia.com/package/@flex-development/docmark-util-symbol)
[![tree shaking suppport](https://badgen.net/bundlephobia/tree-shaking/@flex-development/docmark-util-symbol)](https://bundlephobia.com/package/@flex-development/docmark-util-symbol)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![license](https://img.shields.io/github/license/flex-development/docmark-util-symbol.svg)](LICENSE.md)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript\&logoColor=ffffff)](https://typescriptlang.org)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

[docmark][] utility with symbols.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Types](#types)
- [Contribute](#contribute)

## What is this?

This package exposes constants used throughout the docmark ecosystem.

## When should I use this?

This package is useful when making your docmark extensions.
It’s useful to reference these constants by name instead of value while developing.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-util-symbol
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import { chars, codes, constants, ct, ev, tt } from 'https://esm.sh/@flex-development/docmark-util-symbol'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import { chars, codes, constants, ct, ev, tt } from 'https://esm.sh/@flex-development/docmark-util-symbol'
</script>
```

## Use

```js
import { chars, codes, constants, ct, ev, tt } from '@flex-development/docmark-util-symbol'

console.log(chars.at) // '@'
console.log(codes.at) // 64
console.log(constants.tabSize) // 4
console.log(ct.comment) // 'comment'
console.log(ev.enter) // 'enter'
console.log(tt.tagName) // 'tagName'
```

## API

This package exports the identifiers `chars`, `codes`, `constants`, `ct`, `ev`, and `tt`.\
There is no default export.

Each identifier is an object mapping strings to values.\
See the [code](./src/) for the exposed data.

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Project

### Version

docmark-util-symbol adheres to [semver][].

### Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

### Sponsor

Small primitives power larger systems.
Support long-term stability by sponsoring Flex Development.

[docmark]: ../../README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[semver]: https://semver.org

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
