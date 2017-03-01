'use strict';

// Import the neccesary modules.
const ExtraTorrentAPI = require('../extratorrent-api').Website;

const extraTorrentAPI = new ExtraTorrentAPI();

// Execute a simple search
extraTorrentAPI.search('ettv')
  .then(res => console.log(res))
  .catch(err => console.error(err));
