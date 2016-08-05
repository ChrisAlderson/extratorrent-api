"use strict";

const chai = require("chai");
const assert = chai.assert;
const ExtraTorrentAPI = require("../extratorrent-api");

describe("ExtraTorrent", () => {

  let extraTorrentAPI, query;
  before(() => {
    extraTorrentAPI = new ExtraTorrentAPI();
    query = {
      with_words: "ettv",
      widthout: "720p",
      category: "tv",
      added: 1,
      size_type: "b"
    };
  });

  it("Should get results with a simple search", done => {
    extraTorrentAPI.search("ettv")
      .then(res => {
        assert.isArray(res.results);
        assert.isNumber(res.total_results);
        done();
      }).catch(err => done(err));
  });

  it("Should get results with an advanced search", done => {
    extraTorrentAPI.search(query)
      .then(res => {
        assert.isArray(res.results);
        assert.isNumber(res.total_results);
        done();
      }).catch(err => done(err));
  });

});
