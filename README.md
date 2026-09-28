# docmark

[![github tag](https://img.shields.io/github/v/tag/flex-development/docmark.svg?include_prereleases\&sort=date\&filter=!^docmark*)](https://github.com/flex-development/docmark/releases/latest)
[![codecov](https://codecov.io/gh/flex-development/docmark/graph/badge.svg?token=QDeW8VDq8B)](https://codecov.io/gh/flex-development/docmark)
[![module type: esm](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![conventional commits](https://img.shields.io/badge/-conventional%20commits-fe5196?logo=conventional-commits\&logoColor=ffffff)](https://conventionalcommits.org)
[![typescript](https://img.shields.io/badge/-typescript-3178c6?logo=typescript\&logoColor=ffffff)](https://typescriptlang.org)
[![vitest](https://img.shields.io/badge/-vitest-6e9f18?style=flat\&logo=vitest\&logoColor=ffffff)](https://vitest.dev)
[![yarn](https://img.shields.io/badge/-yarn-2c8ebb?style=flat\&logo=yarn\&logoColor=ffffff)](https://yarnpkg.com)

comment parser with support for markdown, positional info, and concrete tokens.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Extensions](#extensions)
  - [List of extensions](#list-of-extensions)
  - [`Extension`](#extension)
  - [Extending docdown](#extending-docdown)
  - [Creating a docmark extension](#creating-a-docmark-extension)
- [Architecture](#architecture)
  - [Overview](#overview)
  - [Preprocess](#preprocess)
  - [Parse](#parse)
  - [Postprocess](#postprocess)
- [Examples](#examples)
  - [Directives](#directives)
  - [GitHub flavored markdown (GFM)](#github-flavored-markdown-gfm)
  - [Math](#math)
  - [Syntax tree](#syntax-tree)
- [Docdown](#docdown)
  - [CommonMark](#commonmark)
  - [Grammar](#grammar)
- [Project](#project)
  - [Version](#version)
  - [Contribute](#contribute)
  - [Sponsor](#sponsor)
  - [Origin](#origin)

## What is this?

<!-- note: this section has to be in sync with the `docmark` readme. -->

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

See [§ API][api] in the `docmark` readme.

## Extensions

`docmark` supports extensions.\
[`Extension`s][extension] change how comments are parsed.

### `Extension`

A syntax extension is an object whose fields are typically the names of hooks,
referring to where constructs "hook" into.
The fields at such objects are character codes, mapping to constructs as values,
while other fields provide parser configuration or additional behavior.

The [builtin extensions][extensions-builtin] are an example.\
See them and [existing extensions][extensions] for inspiration.

### List of extensions

- [`@flex-development/docmark-extension-hashbang`][extension-hashbang]
  — support hasbang comment syntax
- [`@flex-development/docmark-extension-js`][extension-js]
  — support javascript comment syntax
- [`@flex-development/docmark-extension-jsonc`][extension-jsonc]
  — support json comment syntax
- [`@flex-development/docmark-extension-sass`][extension-sass]
  — support sass comment syntax
- [`@flex-development/docmark-extension-shell`][extension-shell]
  — support shell comment syntax
- [`@flex-development/docmark-extension-ts`][extension-ts]
  — support typescript comment syntax
- [`@flex-development/docmark-extension-yaml`][extension-yaml]
  — support yaml comment syntax

### Extending docdown

**TODO**: extending docdown

### Creating a docmark extension

**TODO**: creating a docmark extension

## Architecture

### Overview

**TODO**: overview

### Preprocess

**TODO**: preprocess

### Parse

**TODO**: parse

### Postprocess

**TODO**: postprocess

## Examples

### Directives

**TODO**: directives

### GitHub flavored markdown (GFM)

**TODO**: github flavored markdown (gfm)

### Math

**TODO**: math

### Syntax tree

**TODO**: syntax tree

## Docdown

### CommonMark

**TODO**: commonmark

### Grammar

**TODO**: grammar

## Project

### Version

docmark adheres to [semver][].

### Contribute

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

This project has a [code of conduct](./CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.

### Sponsor

Consider sponsoring to support maintenance, tests, and long-term stability!

### Origin

**TODO**: origin

[api]: ./packages/docmark/README.md#api

[extension]: #extension

[extensions]: #list-of-extensions

[extensions-builtin]: ./packages/docmark/src/extensions/

[extension-hashbang]: https://github.com/flex-development/docmark-extension-hashnbang

[extension-js]: https://github.com/flex-development/docmark-extension-js

[extension-jsonc]: https://github.com/flex-development/docmark-extension-jsonc

[extension-sass]: https://github.com/flex-development/docmark-extension-sass

[extension-shell]: https://github.com/flex-development/docmark-extension-shell

[extension-ts]: https://github.com/flex-development/docmark-extension-ts

[extension-yaml]: https://github.com/flex-development/docmark-extension-yaml

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[semver]: https://semver.org

[yarn]: https://yarnpkg.com
