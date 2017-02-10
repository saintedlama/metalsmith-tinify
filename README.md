# metalsmith-tinify

[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]

A metalsmith plugin to compress images uning the tinify API using a local cache to minimize API calls.

## Installation

```bash
$ npm i metalsmith-tinify --save
```

## Example

```Javascript
const Metalsmith = require('metalsmith');
const tinify = require('metalsmith-tinify');

Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .use(tinify({
    apiKey: 'yourapikey',     // Required: Get your API key from https://tinypng.com/developers
  }))
  .build(function(err) {
    if (err) throw err;
  });
```

## Options

You can pass options to `metalsmith-tinify` with the [Javascript API](https://github.com/segmentio/metalsmith#api)
or [CLI](https://github.com/segmentio/metalsmith#cli).

The options are:

##### apiKey

* `required`

Tinify API key - you can get your api key from https://tinypng.com/developers

##### pattern

* `optional`
* `default: ['**/*.jpg', '**/*.jpeg', '**/*.png']`

A [multimatch](https://github.com/sindresorhus/multimatch) pattern. Only files that match this pattern are tinified.
Can be a string or an array of strings.

##### cacheDir

* `optional`
* `default: path.join(os.tmpdir(), 'metalsmith-tinify-cache')`

All once tinified images are cached. This options specifies the cache directory to use.

## Problems?

You can allways switch debugging output on by setting NODE_DEBUG environment variable to `metalsmith-tinify`.
See the awesome [debug module](https://www.npmjs.com/package/debug) for more details.

## License

ISC

[npm-badge]: https://img.shields.io/npm/v/metalsmith-tinify.svg
[npm-url]: https://www.npmjs.com/package/metalsmith-tinify

[travis-badge]: https://travis-ci.org/saintedlama/metalsmith-tinify.svg?branch=master
[travis-url]: https://travis-ci.org/saintedlama/metalsmith-tinify
