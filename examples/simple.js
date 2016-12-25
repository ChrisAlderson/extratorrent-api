"use strict";

// Import the neccesary modules.
const ExtraTorrentAPI = require("../extratorrent-api");

const extraTorrentAPI = new ExtraTorrentAPI({debug: false});

// Execute a simple search
extraTorrentAPI.search("ettv")
  .then(res => console.log(res))
  .catch(err => console.error(err));
