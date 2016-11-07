"use strict";

const cheerio = require("cheerio");
const req = require("request");
const querystring = require("querystring");

const defaultOptions = {
  baseUrl: "https://extratorrent.cc",
  timeout: 4 * 1000
};

module.exports = class ExtraTorrentAPI {

  constructor({options = defaultOptions, debug = false} = {}) {
    ExtraTorrentAPI._options = options;

    this._request = req.defaults(options);
    this._debug = debug;

    this._s_cat = {
      "anime": "1",
      "books": "2",
      "games": "3",
      "movies": "4",
      "music": "5",
      "pictures": "6",
      "software": "7",
      "tv": "8",
      "other": "9",
      "mobile": "416",
      "adult": "533"
    };

    this._added = {
      "1": 1,
      "3": 3,
      "7": 7
    };

    this._size_types = {
      "b": "b",
      "kb": "kb",
      "mb": "mb",
      "gb": "gb"
    };
  };

  _get(uri, qs, retry = true) {
    if (this._debug) console.warn(`Making request to: '${uri}?${querystring.stringify(qs)}'`);
    return new Promise((resolve, reject) => {
      this._request({ uri, qs }, (err, res, body) => {
        if (err && retry) {
          return resolve(this._get(uri, qs, false));
        } else if (err) {
          return reject(err);
        } else if (!body || res.statusCode >= 400) {
          return reject(new Error(`No data found for uri: '${uri}', statuscode: ${res.statusCode}`));
        } else {
          return resolve(body);
        }
      });
    });
  };

  _formatPage(res, page, date) {
    const $ = cheerio.load(res);

    const total_results = parseInt($("td[width]").text().match(/total\s+(\d+)\s+torrents\s+found/i)[1], 10);
    let total_pages = Math.ceil(total_results / 50);
    if (total_pages > 200) total_pages = 200;

    const result = {
      response_time: parseInt(date, 10),
      page: parseInt(page, 10),
      total_results: parseInt(total_results, 10),
      total_pages: parseInt(total_pages, 10),
      results: []
     };

    $("tr.tlr , tr.tlz").each(function() {
      const entry = $(this).find("td");

      let language, title, sub_category

      const torrent_link = ExtraTorrentAPI._options.baseUrl + entry.eq(0).find("a").eq(0).attr("href");
      const magnet = entry.eq(0).find("a").eq(1).attr("href");
      const added = entry.eq(3).text();
      const size = entry.eq(4).text();
      const seeds = ($(this).find("td.sy").text() == '') ? 0 : parseInt($(this).find("td.sy").text(), 10);
      const leechers = ($(this).find("td.ly").text() == '') ? 0 : parseInt($(this).find("td.ly").text(), 10);
      const peers = seeds + leechers;
      const quality = parseInt(entry.last().find("div").attr("class").replace(/r/i, ""), 10);

      let comments = $(this).find("td.tli").find("div#tcmm");
      if (comments.length !== 0) {
        language = entry.eq(2).find("img.icon").eq(1).attr("alt");
        title = entry.eq(2).find("a").eq(1).text();
        sub_category = entry.eq(2).find("a").eq(2).text();
        comments = parseInt(entry.eq(2).find("a").eq(0).text(), 10);
      } else {
        language = entry.eq(2).find("img.icon").eq(0).attr("alt");
        title = entry.eq(2).find("a").eq(0).text();
        sub_category = entry.eq(2).find("a").eq(0).text();
        comments = comments.length;
      };

      result.results.push({ torrent_link, magnet, language, title, sub_category, comments, added, size, seeds, leechers, peers, quality });
    });

    return result;
  };

  _advancedSearch({page, with_words, extact, without, category, added, seeds_from, seeds_to, leechers_from, leechers_to, size_from, size_to, size_type} = {}, date) {
    if (!with_words) throw new Error("'with_words' is a required field");
    if (added && !this._added[added]) throw new Error(`'${added}' is not a valid value for added!`);
    if (size_type && !this._size_types[size_type]) throw new Error(`'${size_type}' is not a valid value for value size_type!`);

    if (category && !this._s_cat[category]) {
      throw new Error(`${category} is not a valid value for category!`);
    } else if (category && this._s_cat[category]) {
      category = this._s_cat[category];
    }

    return this._get("/advanced_search/", {
      page,
      "with": with_words,
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
  };

  _simpleSearch(query, date) {
    return this._get("/search/", {search: query}).then(res => this._formatPage(res, 1, Date.now() - date));
  };

  search(query) {
    const t = Date.now();
    if (typeof(query) === "string") {
      return this._simpleSearch(query, t);
    } else if (typeof(query) === "object") {
      return this._advancedSearch(query, t)
    } else {
      throw new Error(`Query needs to be an object or a string!`);
    }
  };

};
