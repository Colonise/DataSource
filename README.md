# DataSource

[![Build][build-badge]][build-url]
[![Code Climate Test Coverage][code-climate-coverage-badge]][code-climate-coverage-url]
[![Code Climate Maintainability][code-climate-maintainability-badge]][code-climate-maintainability-url]
[![License][license-badge]][license-url]
[![npm version][npm-version-badge]][npm-version-url]
[![npm bundle size \(minified\)][npm-minified-badge]][npm-minified-url]
[![npm bundle size \(minified, zipped\)][npm-minified-minzipped-badge]][npm-minified-minzipped-url]

> A simple and highly configurable library to control temporal changes in data.

### Overview

The DataSource library is designed to make creating complex data structures easy.

Through the use of [Processors](src/processors), a data structure can be processed to output a temprarily altered version of the input data.

The best use cases for this are UI Tables that use [Filtering](src/processors/filter-processor.md), [Sorting](src/processors/sorter-processor.md), [Paging](src/processors/pager-processor.md), and [more](src/processors).

### Documentation

Full documentation can be found under [documentation][documentation-url], or by looking for the identically named Markdown file adjacent to each source file.

### Want to contribute?

That's great! We'd love to see what suggestions you have.

[Read the contributing guide.][contributing-url]

### Open Source

DataSource is part of Colonise's Open Source Software, and is made with love by the Colonise team.

[![Colonise Logo][colonise-logo]][colonise-url]

### [License][license-url]

[documentation-url]: /documentation/README.md
[contributing-url]: /CONTRIBUTING.md

[colonise-logo]: /documentation/assets/colonise256.png
[colonise-url]: https://colonise.org/

[build-badge]: https://img.shields.io/github/workflow/status/colonise/datasource/Node.js%20CI
[build-url]: https://github.com/Colonise/DataSource/actions?query=workflow%3A%22Node.js+CI%22

[code-climate-coverage-badge]: https://img.shields.io/codeclimate/coverage/Colonise/DataSource.svg
[code-climate-coverage-url]: https://codeclimate.com/github/Colonise/DataSource

[code-climate-maintainability-badge]: https://img.shields.io/codeclimate/maintainability-percentage/Colonise/DataSource.svg
[code-climate-maintainability-url]: https://codeclimate.com/github/Colonise/DataSource

[license-badge]: https://img.shields.io/github/license/Colonise/DataSource.svg
[license-url]: https://github.com/Colonise/DataSource/blob/master/LICENSE

[npm-version-badge]: https://img.shields.io/npm/v/@colonise/datasource.svg
[npm-version-url]: https://www.npmjs.com/package/@colonise/datasource

[npm-minified-badge]: https://img.shields.io/bundlephobia/min/@colonise/datasource.svg
[npm-minified-url]: https://bundlephobia.com/result?p=@colonise/datasource

[npm-minified-minzipped-badge]: https://img.shields.io/bundlephobia/minzip/@colonise/datasource.svg
[npm-minified-minzipped-url]: https://bundlephobia.com/result?p=@colonise/datasource
