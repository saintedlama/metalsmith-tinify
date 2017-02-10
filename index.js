const path = require('path');
const os = require('os');

const mkdirp = require('mkdirp');
const multimatch = require('multimatch');
const async = require('async');
const tinify = require('tinify');
const debug = require('debug')('metalsmith-tinify');

const cache = require('./lib/cache');

module.exports = function(options) {
  options = options || {};
  options.cacheDir = options.cacheDir || path.join(os.tmpdir(), 'metalsmith-tinify-cache');
  options.pattern = options.pattern || ['**/*.jpg', '**/*.jpeg', '**/*.png'];

  if (!options.apiKey) {
    throw new Error('Option "apiKey" is required. You can get a tinify API key here https://tinypng.com/developers');
  }

  tinify.key = options.apiKey;

  const localCache = cache(options.cacheDir);

  return function(files, metalsmith, done) {
    const matchedFiles = multimatch(Object.keys(files), options.pattern);

    mkdirp(options.cacheDir, (err) => {
      if (err) {
        debug(`Could not create cache dir ${options.cacheDir}`);

        return next(err);
      }

      debug(`Using directory ${options.cacheDir} for cached images`);

      async.eachLimit(matchedFiles, 5, tinifyFile(files, localCache, options), (err) => {
        if (err) {
          return next(err);
        }

        if (tinify.compressionCount !== undefined) {
          debug(`Monthly tinify compression count ${tinify.compressionCount}`);
        }

        done();
      });
    });
  };
};

function tinifyFile(files, localCache, options) {
  return function(file, next) {
    const contents = files[file].contents;

    localCache.get(file, contents, (err, cachedResult) => {
      if (err) {
        return next(err);
      }

      if (cachedResult) {
        debug(`Using a cached copy for image ${file}. Compressed from ${contents.length}byte to ${cachedResult.length}byte.`);

        files[file].contents = cachedResult;
        return next();
      }

      tinify.fromBuffer(contents).toBuffer(function(err, tinified) {
        if (err) {
          return next(err);
        }

        debug(`Compressed image ${file}. Compressed from ${contents.length}byte to ${tinified.length}byte.`);

        localCache.add(file, contents, tinified, next);
      });
    });
  }
}