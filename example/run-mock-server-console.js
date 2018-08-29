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
var MidwaySwagger = require('./../lib/index');
var Midway = require('testarmada-midway');
Midway.id('example');

var mockedDirectory = __dirname + '/../test/resources/test-data/mocked-data';


Midway.route({
  id: 'message',
  label: 'message',
  path: '/message',
  handler: function (req, reply) {
    reply({'message': 1});
  }
});

/**
 use "handlers" for custom handlers.
 use "useDefaultHandler" for default handlers for all routes, i.e respondWithFile.
 **/

MidwaySwagger.builder({
  api: require('./../test/resources/petstore.json'),
  defaulthandler: MidwaySwagger.getDefaultHandler(Midway).handler,
  storeEndpointsToFile: true,
  endpointsFilePath: __dirname + '/../test/resources/test-data/',
  generateMockdata: true,
  generateMockDataOptions: {
    mockedDirectory: mockedDirectory
  }
}, function (err, routes) {
  MidwaySwagger.addRoutesToMidway(Midway, routes);

  Midway.start({
    host: 'localhost',
    mockedDirectory: mockedDirectory,
    port: 8080
  });
});
