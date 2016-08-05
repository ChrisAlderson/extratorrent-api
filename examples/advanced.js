"use strict";

// Import the neccesary modules.
const ExtraTorrentAPI = require("../extratorrent-api");

const extraTorrentAPI = new ExtraTorrentAPI();

// Execute an advanced search
extraTorrentAPI.search({
  with_words: "ettv",
  widthout: "720p",
  category: "tv",
  added: 1,
  size_type: "b"
}).then(res => console.log(res))
  .catch(err => console.error(err));
