/**
* MIT License
*
* Copyright (c) 2018-present, Walmart Inc.,
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/
var Http = require('http');
var Logger = require('testarmada-midway-logger');

module.exports = function (options, callback) {

  var req = Http.request(options, function (res) {
    var string = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      string += chunk;
    });
    res.on('end', function () {
      try {
        var result = JSON.parse(string);
      } catch (err) {
        var errMessage = 'Problem when parsing incoming swagger definition, please make sure that the URL ' +
          'you have entered points to a Swagger v2.0 definition: ' + err;
        Logger.error(errMessage);
        return callback(errMessage);
      }
      return callback(null, result);
    });
  });

  req.on('error', function (err) {
    var url = options.host + ':' + options.port + options.path;
    Logger.error('Error when fetching swagger definition for url: ' + url + ' ' + err);
    callback(err);
  });

  req.on('timeout', function () {
    Logger.warn('Request timed out');
    req.abort();
  });

  req.setTimeout(5000);
  req.end();

};
