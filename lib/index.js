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
var Builder = require('swaggerize-routes');
var MockDataGenerator = require('./utils/mockdata-generator');
var Logger = require('testarmada-midway-logger');
var Utils = require('./utils/common-utils');

//Logger.setLogLevel('DEBUG');


module.exports = {
  builder: function (options, callback) {

    if (!callback) {
      throw Error('Expected callback in method');
    }

    if (!options.handlers) {
      options.handlers = {};
    }

    if (options.generateMockdata && options.generateMockdata === true) {
      MockDataGenerator.generateMockData(options, function (err) {
        if (err) {
          return callback(err);
        }
        Logger.debug('All mockfiles generated');
      });
    }

    if (!options.defaulthandler) {
      options.defaulthandler = this.getDefaultHandler().handler;
    }

    var routes = Builder(options);

    Utils.createMidwayProperties(routes, options);

    if (options.storeEndpointsToFile && options.storeEndpointsToFile === true) {
      Utils.storeEndpointsToFile(routes, options, function (err) {
        if (err) {
          return callback(err);
        }
        return callback(null, routes);
      });
    } else {
      return callback(null, routes);
    }
  },

  addRoutesToMidway: function (midwayInstance, routes) {
    return Utils.addRoutesToMidway(midwayInstance, routes);
  },

  getSwaggerFile: function (options, callback) {
    return Utils.getSwaggerFile(options, callback);
  },

  getDefaultHandler: function (Midway) {
    return Utils.getDefaultHandler(Midway);
  }
};

