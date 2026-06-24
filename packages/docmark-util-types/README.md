# docmark-util-types

[![github release](https://img.shields.io/github/v/release/flex-development/docmark.svg?include_prereleases\&sort=semver)](https://github.com/flex-development/docmark-/releases/latest)
[![npm](https://img.shields.io/npm/v/@flex-development/docmark-util-types.svg)](https://npmjs.com/package/@flex-development/docmark-util-types)
[![npm downloads](https://img.shields.io/npm/dm/@flex-development/docmark-util-types.svg)](https://www.npmcharts.com/compare/@flex-development/docmark-util-types?interval=30)
[![install size](https://packagephobia.now.sh/badge?p=@flex-development/docmark-util-types)](https://packagephobia.now.sh/result?p=@flex-development/docmark-util-types)
[![minified bundle size](https://badgen.net/bundlephobia/min/@flex-development/docmark-util-types?cache)](https://bundlephobia.com/package/@flex-development/docmark-util-types)
[![license](https://img.shields.io/github/license/flex-development/docmark-util-types.svg)](LICENSE.md)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript\&logoColor=ffffff)](https://typescriptlang.org)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

[docmark][] utility package with TypeScript types.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Types](#types)
- [Contribute](#contribute)

## What is this?

This package exposes TypeScript types shared throughout the docmark ecosystem.

## When should I use this?

This package is useful when making your own, typed, docmark extensions.

## Install

This package is [ESM only][esm].

In Node.js with [yarn][]:

```sh
yarn add @flex-development/docmark-util-types
```

<blockquote>
  <small>
    See <a href='https://yarnpkg.com/protocol/git'>Git - Protocols | Yarn</a>
    &nbsp;for details regarding installing from Git.
  </small>
</blockquote>

In Deno with [`esm.sh`][esmsh]:

```ts
import type { Construct, /* … */ } from 'https://esm.sh/@flex-development/docmark-util-types'
```

## Use

```ts
import type { Construct } from '@flex-development/docmark-util-types'
```

```js
/**
 * @import {Construct} from '@flex-development/docmark-util-types'
 */
```

## API

This module exports no identifiers.
There is no default export.

See the [code](./src/index.mts) for all exposed types.

## Types

This package is fully typed with [TypeScript][].\
It exports interfaces and types.
For runtime values, see [`docmark-util-symbol`][docmark-util-symbol].

## Project

### Version

docmark-util-types adheres to [semver][].

### Contribute

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

This project has a [code of conduct](../../CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

### Sponsor

Support long-term stability by sponsoring Flex Development!

[docmark]: ../../README.md

[docmark-util-symbol]: ../docmark-util-symbol/README.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[semver]: https://semver.org

[typescript]: https://www.typescriptlang.org

[yarn]: https://yarnpkg.com
