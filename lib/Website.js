'use strict';

const cheerio = require('cheerio');
const querystring = require('querystring');

const constants = require('./constants');
const Helper = require('./Helper');

module.exports = class Website extends Helper {

  constructor({baseUrl = 'https://extratorrent.cc', debug = false} = {}) {
    super({baseUrl, debug});
  }

  _formatPage(res, page, date) {
    const $ = cheerio.load(res);

    const total_results = parseInt(res.match(/total\s\<b\>(\d+)\<\/b\>\storrents\sfound/i)[1]);
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

    return this.get('advanced_search/', {
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
    return this.get('search/', {
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
