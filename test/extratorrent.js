'use strict';

const { assert } = require('chai');
const ExtraTorrentAPI = require('../extratorrent-api');

describe('ExtraTorrent', () => {

  describe('RSS', () => {

    let rssAPI, query, queryNull;
    before(() => {
      rssAPI = new ExtraTorrentAPI.RSS();

      query = {
        with_words: 'ettv',
        category: 'tv'
      };
      queryNull = {
        with_words: 'this should not return anything'
      };
    });

    it('should get results with an advanced search', done => {
      rssAPI.search(query).then(res => {
        assert.isArray(res.results);
        assert.isAtLeast(res.results.length, 1);
        assert.isNumber(res.total_results);

        done();
      }).catch(err => done(err));
    });

    it('should not get any results with an advanced search', done => {
      rssAPI.search(queryNull).then(res => {
        assert.isArray(res.results);
        assert.strictEqual(res.results.length, 0);
        assert.isNumber(res.total_results);

        done();
      }).catch(err => done(err));
    });

  });

  describe('Website', () => {

    let websiteAPI, query, queryNull;
    before(() => {
      websiteAPI = new ExtraTorrentAPI.Website();
      query = {
        with_words: 'ettv',
        without: '720p',
        page: 2,
        category: 'tv',
        added: 7,
        size_type: 'b'
      };
      queryNull = {
        with_words: 'this should not return anything',
        without: '720p',
        page: 2,
        category: 'tv',
        added: 7,
        size_type: 'b'
      };
    });

    it('should get results with a simple search', done => {
      websiteAPI.search('ettv').then(res => {
        assert.isArray(res.results);
        assert.isAtLeast(res.results.length, 1);
        assert.isNumber(res.total_results);

        done();
      }).catch(err => done(err));
    });

    it('should not any get results with a simple search', done => {
      websiteAPI.search('this should not return anything').then(res => {
        assert.isArray(res.results);
        assert.strictEqual(res.results.length, 0);
        assert.isNumber(res.total_results);

        done();
      }).catch(err => done(err));
    });

    it('should get results with an advanced search', done => {
      websiteAPI.search(query).then(res => {
        assert.isArray(res.results);
        assert.isAtLeast(res.results.length, 1);
        assert.isNumber(res.total_results);

        done();
      }).catch(err => done(err));
    });

    it('should not get any results with an advanced search', done => {
      websiteAPI.search(queryNull).then(res => {
        assert.isArray(res.results);
        assert.strictEqual(res.results.length, 0);
        assert.isNumber(res.total_results);

        done();
      }).catch(err => done(err));
    });

  });

});
