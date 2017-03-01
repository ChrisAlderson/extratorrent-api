'use strict';

const atob = require('atob');
const Canvas = require('canvas');
const cheerio = require('cheerio');
const CryptoJS = require("crypto-js");
const querystring = require('querystring');

const constants = require('./constants');
const Helper = require('./Helper');

// taken from http://extratorrent.cc/scripts/main.js
const CryptoJSAesJson = {

  stringify(a) {
    const j = {
      ct: a.ciphertext.toString(CryptoJS.enc.Base64)
    };
    if (a.iv) j.iv = a.iv.toString();
    if (a.salt) j.s = a.salt.toString();

    return JSON.stringify(j);
  },

  parse(a) {
    const j = JSON.parse(a);
    const b = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct)
    });

    if (j.iv) b.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) b.salt = CryptoJS.enc.Hex.parse(j.s);

    return b;
  }

};

module.exports = class Website {

  constructor({baseUrl = 'https://extratorrent.cc', debug = false} = {}) {
    this._baseUrl = baseUrl;
    this._helper = new Helper(debug);
  }

  _unpack(str) {
    const begin = 'iVBORw0KGgoAAAANSUhEU';
    const base64String = `${begin}${str.split(begin)[1].split("'")[0]}`;

    const imageObject = new Canvas.Image;
    imageObject.src = new Buffer(base64String, 'base64');

    const canvasObject = new Canvas(imageObject.width, imageObject.height);
    const canvasContext = canvasObject.getContext('2d');
    canvasContext.drawImage(imageObject, 0, 0);

    const imageData = canvasContext.getImageData(0, 0, canvasObject.width, canvasObject.height);

    let resultString = '';
    for(let i = 0; i < imageData.data.length; i += 4) {
      resultString += (imageData.data[i] != 255) ? String.fromCharCode(imageData.data[i]) : '';
    }
    resultString = resultString.trim();

    return querystring.unescape(decodeURIComponent(atob(resultString)));
  }

  _formatPage(res, page, date) {
    let $ = cheerio.load(res);

    const hashObject = $('#e_content').text();

    const unpacked = this._unpack($('div#e_content + script').eq(0).text());
    const key = unpacked.match(/\.decrypt\(ll\.html\(\), \'(.*)\',/i)[1];

    const data = JSON.parse(CryptoJS.AES.decrypt(hashObject, key, {
      format: CryptoJSAesJson
    }).toString(CryptoJS.enc.Utf8));

    $ = cheerio.load(data);

    const total_results = parseInt(data.match(/total\s\<b\>(\d+)\<\/b\>\storrents\sfound/i)[1]);
    let total_pages = Math.ceil(total_results / 50);
    if (total_pages > 200) total_pages = 200;

    const result = {
      response_time: parseInt(date, 10),
      page: parseInt(page, 10),
      total_results,
      total_pages: parseInt(total_pages, 10),
      results: []
    };

    const _this = this;
    $('tr.tlr, tr.tlz').each(function() {
      const entry = $(this).find('td');

      let language, title, sub_category;

      const url = _this._baseUrl + entry.eq(2).find('a').attr('href');
      const torrent_link = _this._baseUrl + entry.eq(0).find('a').eq(0).attr('href');
      const magnet = entry.eq(0).find('a').eq(1).attr('href');
      const date_added = entry.eq(3).text();
      const size = entry.eq(4).text();
      const seeds = ($(this).find('td.sy').text() == '') ? 0 : parseInt($(this).find('td.sy').text(), 10);
      const leechers = ($(this).find('td.ly').text() == '') ? 0 : parseInt($(this).find('td.ly').text(), 10);
      const peers = seeds + leechers;
      const quality = parseInt(entry.last().find('div').attr('class').replace(/r/i, ''), 10);

      let comments = $(this).find('td.tli').find('div#tcmm');
      if (comments.length !== 0) {
        language = entry.eq(2).find('img.icon').eq(1).attr('alt');
        title = entry.eq(2).find('a').eq(1).text();
        sub_category = entry.eq(2).find('a').eq(2).text();
        comments = parseInt(entry.eq(2).find('a').eq(0).text(), 10);
      } else {
        language = entry.eq(2).find('img.icon').eq(0).attr('alt');
        title = entry.eq(2).find('a').eq(0).text();
        sub_category = entry.eq(2).find('a').eq(0).text();
        comments = comments.length;
      };

      result.results.push({ url, torrent_link, magnet, language, title, sub_category, comments, date_added, size, seeds, leechers, peers, quality });
    });

    return result;
  }

  _advancedSearch({page, with_words, extact, without, category, added, seeds_from, seeds_to, leechers_from, leechers_to, size_from, size_to, size_type} = {}, date) {
    if (!with_words) throw new Error(`'with_words' is a required field`);
    if (added && !constants.added[added]) throw new Error(`'${added}' is not a valid value for added!`);
    if (size_type && !constants.size_types[size_type]) throw new Error(`'${size_type}' is not a valid value for value size_type!`);

    if (category && !constants.s_cat[category]) {
      throw new Error(`${category} is not a valid value for category!`);
    } else if (category && constants.s_cat[category]) {
      category = constants.s_cat[category];
    }

    return this._helper.get('advanced_search/', {
      page,
      'with': with_words,
      extact,
      without,
      s_cat: category,
      added,
      seeds_from,
      seeds_to,
      leechers_from,
      leechers_to,
      size_from,
      size_type,
      size_to
    }).then(res => this._formatPage(res, page, Date.now() - date));
  }

  _simpleSearch(query, date) {
    return this._helper.get('search/', {
      search: query
    }).then(res => this._formatPage(res, 1, Date.now() - date));
  }

  search(query) {
    const t = Date.now();
    if (typeof(query) === 'string') {
      return this._simpleSearch(query, t);
    } else if (typeof(query) === 'object') {
      return this._advancedSearch(query, t);
    }

    throw new Error(`Query needs to be an object or a string!`);
  }

}
