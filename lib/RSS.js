'use strict';

const constants = require('./constants');
const Helper = require('./Helper');

module.exports = class RSS extends Helper {

  constructor({baseUrl = 'https://extra.to', debug = false} = {}) {
    super({baseUrl, debug});
  }

  _formatPage(res, date) {
    const data = res.rss.channel.item;

    return {
      response_time: parseInt(date, 10),
      page: NaN,
      total_results: data.length,
      total_pages: NaN,
      results: data.map(item => {
        return {
          url: item.link,
          torrent_link: item.link.replace(/\/torrent\//i, '/download/'),
          magnet: item.magnetURI,
          language: undefined,
          title: item.title,
          sub_category: undefined,
          comments: NaN,
          date_added: new Date(item.pubDate),
          size: parseInt(item.size, 10),
          seeds: parseInt(item.seeders, 10),
          leechers: parseInt(item.leechers, 10),
          peers: parseInt(item.seeders, 10) + parseInt(item.leechers, 10),
          quality: NaN
        };
      })
    };
  }

  _advancedSearch({with_words, category, user} = {}, date) {
    if (category && !constants.s_cat[category]) {
      throw new Error(`${category} is not a valid value for category!`);
    } else if (category && constants.s_cat[category]) {
      category = constants.s_cat[category];
    }

    let type;

    if (with_words) type = 'search';
    if (user) type = 'user';
    if (category) type = 'popular';

    return this.get('rss.xml', {
      cid: category,
      type,
      user,
      search: with_words
    }, true).then(res => this._formatPage(res, Date.now() - date));
  }

  search(query) {
    const t = Date.now();
    if (typeof(query) === 'object') return this._advancedSearch(query, t);

    throw new Error(`Query needs to be an object!`);
  }

}
