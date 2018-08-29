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
var MidwaySwagger = require('./../../lib/index');
var Utils = require('./../../lib/utils/common-utils');
var Path = require('path');
var Logger = require('testarmada-midway-logger');
var Midway = require('testarmada-midway');
Midway.id('login-proxy');

module.exports = {
  init: function () {
    try {
      var Config = require(Path.join(process.cwd(), 'config') + '/default');
    } catch (err) {
      return Logger.warn('No config file exist, please run midway-swagger with --config flag to generate config');
    }
    Logger.debug('Config: ' + JSON.stringify(Config, null, 2));
    Utils.getSwaggerFile(Config.swaggerOptions, function (err, swaggerDef) {
      if (err) {
        return Logger.error(err);
      }
      MidwaySwagger.builder({
        api: swaggerDef,
        defaulthandler: Utils.getDefaultHandler().handler,
        storeEndpointsToFile: Config.storeEndpointsToFile,
        endpointsFilePath: Config.endpointsFilePath,
        generateMockdata: Config.generateMockdata,
        generateMockDataOptions: Config.generateMockDataOptions
      }, function (err, routes) {
        if (err) {
          Logger.error('Problem when building endpoints: ' + err);
        }
        Logger.debug('Routes in swagger file: ' + JSON.stringify(routes, null, 2));
        if (Config.startMidwayInstance) {
          Utils.addRoutesToMidway(Midway, routes);
          Midway.start(Config.midwayOptions);
        }
      });
    });
  }
};
