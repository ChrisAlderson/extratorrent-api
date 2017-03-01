'use strict';

const { assert } = require('chai');
const ExtraTorrentAPI = require('../extratorrent-api');

describe('ExtraTorrent', () => {

  describe('RSS', () => {

    let rssAPI, query;
    before(() => {
      rssAPI = new ExtraTorrentAPI.RSS();

      query = {
        with_words: 'ettv',
        category: 'tv'
      };
    });

    it('should get results with an advanced search', done => {
      rssAPI.search(query).then(res => {
        assert.isArray(res.results);
        assert.isNumber(res.total_results);
        done();
      }).catch(err => done(err));
    });

  });

  describe('Website', () => {

    let websiteAPI, query;
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
    });

    it('should get results with a simple search', done => {
      websiteAPI.search('ettv').then(res => {
        assert.isArray(res.results);
        assert.isNumber(res.total_results);
        done();
      }).catch(err => done(err));
    });

    it('should get results with an advanced search', done => {
      websiteAPI.search(query).then(res => {
        assert.isArray(res.results);
        assert.isNumber(res.total_results);
        done();
      }).catch(err => done(err));
    });

  });

});
