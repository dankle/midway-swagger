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
var Expect = require('chai').expect;
var Utils = require('./../lib/utils/common-utils');
var MidwaySwagger = require('./../lib/index');
var Path = require('path');
var Fs = require('fs');

var swaggerFile = require('./resources/pets.json');
var testDataDir = Path.join(__dirname, '/resources/test-data');

describe('utils-test', function () {

  it('test add routes to midway', function (done) {
    Utils.getSwaggerFile({
      host: 'petstore.swagger.io',
      port: '80',
      path: '/v2/swagger.json'}, function (err, swaggerDef) {
      Expect(swaggerDef.swagger).to.equal('2.0');
      done();
    });
  });

  it('test connect to non existing server', function (done) {
    Utils.getSwaggerFile({
      host: 'not.existing',
      port: '80',
      path: '/swagger'}, function (err) {
      Expect(err.code).to.equal('ENOTFOUND');
      done();
    });
  });

  it('test get default handler', function (done) {
    var handler = Utils.getDefaultHandler();
    Expect(handler.handler).to.be.a('function');
    done();
  });

  it('create midway properties', function (done) {
    MidwaySwagger.builder({
      api: swaggerFile,
      defaulthandler: function () {}
    }, function (err, routes) {
      Utils.createMidwayProperties(routes, {});
      routes.forEach(function (route) {
        Expect(route.handler).to.be.a('function');
      });

      done();
    });
  });

  it('store endpoints to file', function (done) {
    MidwaySwagger.builder({
      api: swaggerFile,
      defaulthandler: function () {}
    }, function (err, routes) {
      Utils.storeEndpointsToFile(routes, {endpointsFilePath: testDataDir}, function () {
        var filePath = Path.join(testDataDir, 'endpoints-swagger.js');
        Expect(Fs.existsSync(filePath)).to.be.true;

        done();
      });
    });
  });

});

