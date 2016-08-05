# extratorrent-api

[![Build Status](https://travis-ci.org/ChrisAlderson/extratorrent-api.svg?branch=master)]()
[![Dependency Status](https://david-dm.org/ChrisAlderson/extratorrent-api.svg)](https://david-dm.org/ChrisAlderson/extratorrent-api)
[![devDependency Status](https://david-dm.org/ChrisAlderson/extratorrent-api/dev-status.svg)](https://david-dm.org/ChrisAlderson/extratorrent-api#info=devDependencies)

An ExtraTorrent wrapper for NodeJS.

## Usage

#### Setup
```
npm install --save extratorrent-api
```

### Initialize
```js
const ExtraTorrentAPI = require("../extratorrent-api");

// Options are the request default options.
const extraTorrentAPI = new ExtraTorrentAPI();
```

### Example usage

#### Simple search
```js
// Execute a simple search
extraTorrentAPI.search("ettv")
  .then(res => console.log(res))
  .catch(err => console.error(err));

```

#### Advanced search
```js
// Execute an advanced search
extraTorrentAPI.search({
  with_words: "ettv",
  widthout: "720p",
  category: "tv",
  added: 1,
  size_type: "b"
}).then(res => console.log(res))
  .catch(err => console.error(err));
```

## Response

Example of a response
```js
{
  "total_results": 35937,
  "results": [{
      "torrent_link": "/download/5089468/Queen.of.the.South.S01E07.WEB-DL.XviD-FUM%5Bettv%5D.torrent",
      "language": "English",
      "title": "Queen.of.the.South.S01E07.WEB-DL.XviD-FUM[ettv]",
      "sub_category": "Queen.of.the.South.S01E07.WEB-DL.XviD-FUM[ettv]",
      "comments": 0,
      "size": "348.07 MB",
      "seeds": 2193,
      "leechers": 2094,
      "quality": 10
    },
    ...
  ]
}
```

## Parameters

These are the parameters available for the advanced search:

- with_words
- extact
- without
- category
- added
- seeds_from
- seeds_to
- leechers_from
- leechers_to
- size_from
- size_to
- size_type

# License

MIT License

Copyright (c) 2016 - extratorrent-api - Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
