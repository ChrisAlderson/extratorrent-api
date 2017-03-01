'use strict';

// Import the neccesary modules.
const ExtraTorrentAPI = require('../extratorrent-api').Website;

const extraTorrentAPI = new ExtraTorrentAPI();

// Execute an advanced search
extraTorrentAPI.search({
  with_words: 'ettv',
  without: '720p',
  page: 2,
  category: 'tv',
  added: 7,
  size_type: 'b'
}).then(res => console.log(res))
  .catch(err => console.error(err));

// extraTorrentAPI.search({
//   width_words: 'zeke23'
//   category: 'books',
//   added: 3
// }).then(res => console.log(res))
//   .catch(err => console.error(err));
