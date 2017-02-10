const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const mkdirp = require('mkdirp');
const debug = require('debug')('metalsmith-tinify');

module.exports = function(cacheDir) {
  mkdirp.sync(cacheDir);

  return {
    get(filePath, uncompressed, next) {
      fs.readFile(getCacheHashFile(cacheDir, filePath), (err, cachedHash) => {
        if (err) {
          debug(`Cache file for ${filePath} does not exist`);

          return next();
        }

        const uncompressedHash = hashBuffer(uncompressed);

        if (cachedHash != uncompressedHash) {
          debug(`Cache file exists but cached file hash ${cachedHash} does not match ${uncompressedHash}`);

          return next(); // No cache hit
        }

        debug(`Serving contents for ${filePath} from cache`);

        fs.readFile(getCacheFile(cacheDir, filePath), next);
      });
    },

    add(filePath, uncompressed, compressed, next) {
      // Write the compressed file with hash of uncompressed for lookup
      fs.writeFile(getCacheFile(cacheDir, filePath), compressed, (err) => {
        if (err) { return next(err); }

        fs.writeFile(getCacheHashFile(cacheDir, filePath), hashBuffer(uncompressed), next);
      });
    }
  }
}

function getCacheFile(cacheDir, filePath) {
  return path.join(cacheDir, filePath);
}


function getCacheHashFile(cacheDir, filePath) {
  return path.join(cacheDir, filePath + '-hash');
}

function hashBuffer(buf) {
  return crypto.createHash('md5').update(buf).digest('hex');
}
