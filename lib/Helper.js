'use strict';

const { Parser } = require('xml2js');
const got = require('got');

module.exports = class Helper {

  constructor({baseUrl = 'https://extra.to', debug = false} = {}) {
    this._baseUrl = baseUrl;
    this._debug = debug;

    this._parser = new Parser({
      explicitArray: false
    });
  }

  _toJSON(xml) {
    return new Promise((resolve, reject) => {
      return this._parser.parseString(xml, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  get(uri, data = {}, xml = false) {
    if (this._debug) console.warn(`Making request to: '${uri}', opts: ${JSON.stringify(opts)}`);

    const opts = {
      method: 'GET',
      query: data
    };

    return got(`${this._baseUrl}/${uri}`, opts).then(({body}) => {
      if (xml) return this._toJSON(body);
      return body;
    });
  }

}
