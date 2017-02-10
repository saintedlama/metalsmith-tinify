const os = require('os');
const path = require('path');

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const expect = require('chai').expect;

const cache = require('../../lib/cache');
const tempDir = path.join(os.tmpdir(), 'metalsmith-tinify');

describe('cache', function() {
  before((next) => rimraf(tempDir, next));
  before((next) => mkdirp(tempDir, next));

  it('should yield no error if a file was not found in cache', (done) => {
    const imgCache = cache(tempDir);
    const imageContent = new Buffer('');

    imgCache.get('image.png', imageContent, done);
  });

  it('should yield a falsy value if a file was not found in cache', (done) => {
    const imgCache = cache(tempDir);
    const imageContent = new Buffer('');

    imgCache.get('image.png', imageContent, (err, cached) => {
      expect(err).to.not.exist;
      expect(cached).to.be.not.ok;

      done();
    });
  });

  it('should add a file to the cache', (done) => {
    const imgCache = cache(tempDir);
    const imageContent = new Buffer('');

    imgCache.add('image.png', imageContent, imageContent, (err) => {
      expect(err).to.not.exist;

      done();
    });
  });

  it('should add and get a file from the cache', (done) => {
    const imgCache = cache(tempDir);
    const imageContent = new Buffer('');

    imgCache.add('image.png', imageContent, imageContent, (err) => {
      expect(err).to.not.exist;

      imgCache.get('image.png', imageContent, (err, cached) => {
        expect(err).to.not.exist;
        expect(cached).to.exist;
        expect(cached).to.deep.equal(imageContent);

        done();
      });
    });
  });

  it('should yield a falsy value if the cached file does not match', (done) => {
    const imgCache = cache(tempDir);
    const imageContent = new Buffer('');
    const newImageContent = new Buffer('abc');

    imgCache.add('image.png', imageContent, imageContent, (err) => {
      expect(err).to.not.exist;

      imgCache.get('image.png', newImageContent, (err, cached) => {
        expect(err).to.not.exist;
        expect(cached).to.not.exist;

        done();
      });
    });
  });

  it('should create directories in cache if a file with directory part is cached', (done) => {
    const imgCache = cache(tempDir);
    const imageContent = new Buffer('');

    imgCache.add(path.join('img', 'image.png'), imageContent, imageContent, (err) => {
      expect(err).to.not.exist;

      imgCache.get(path.join('img', 'image.png'), imageContent, (err, cached) => {
        expect(err).to.not.exist;
        expect(cached).to.exist;

        done();
      });
    });
  });
});
