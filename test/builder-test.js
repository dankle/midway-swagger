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
var MidwaySwagger = require('./../lib/index');
var Path = require('path');
var Fs = require('fs');

var pathToHandlers = Path.join(__dirname, './resources/handlers');
var swaggerFile = require('./resources/pets.json');
var swaggerFileData = require('./resources/petstore.json');

var testDataDir = Path.join(__dirname, '/resources/test-data');
var mockDataDir = Path.join(__dirname, '/resources/test-data/mocked-data');

describe('build-routes-test', function () {

  it('check that all routes are generated', function (done) {
    MidwaySwagger.builder({
      api: swaggerFile,
      handlers: pathToHandlers
    }, function (err, routes) {
      Expect(err).to.equal(null);
      Expect(routes.length).to.equal(6);

      done();
    });
  });

  it('check that error is returned if no callback is provided', function (done) {
    try {
      MidwaySwagger.builder({
        api: swaggerFile,
        handlers: pathToHandlers
      });
    } catch (err) {
      Expect(err).to.not.equal(null);
      done();
    }
  });

  it('check that the correct routes are generated', function (done) {
    var routesInDefinition = {
      findPets: '/pets',
      addPet: '/pets',
      findPetById: '/pets/{id}',
      deletePet: '/pets/{id}',
      findItemOfPet: '/pets/{id}/items',
      createItemForPet: '/pets/{id}/items'
    };

    MidwaySwagger.builder({
      api: swaggerFile,
      handlers: pathToHandlers
    }, function (err, routes) {
      Expect(err).to.equal(null);

      routes.forEach(function (route) {
        var routeName = route.name;
        Expect(routesInDefinition).to.have.property(routeName);
        var routePath = route.path;
        Expect(routePath).to.equal(routesInDefinition[routeName]);
      });

      done();
    });
  });

  it('check that the handlers in the routes are matching the ones in handlers path', function (done) {
    MidwaySwagger.builder({
      api: swaggerFile,
      handlers: pathToHandlers
    }, function (err, routes) {
      Expect(err).to.equal(null);

      routes.forEach(function (route) {
        var pathToFile = Path.join(pathToHandlers, route.path);
        var handlerFile = require(pathToFile);
        if (route.method === 'get') {
          var handlerFromFile = handlerFile.get;
          Expect(handlerFromFile).to.equal(route.handler);
        } else if (route.method === 'post') {
          var handlerFromFile = handlerFile.post;
          Expect(handlerFromFile).to.equal(route.handler);
        }
      });

      done();
    });
  });

  it('check that default handler is working', function (done) {
    var defaultHandler = function (req, reply) {
      Midway.util.respondWithFile(this, reply);
    };

    MidwaySwagger.builder({
      api: swaggerFile,
      defaulthandler: defaultHandler
    }, function (err, routes) {
      Expect(err).to.equal(null);

      routes.forEach(function (route) {
        Expect(route.handler.toString()).to.equal(defaultHandler.toString());
      });

      done();
    });
  });

  it('check that data is generated', function (done) {
    var defaultHandler = function (req, reply) {
      Midway.util.respondWithFile(this, reply);
    };

    MidwaySwagger.builder({
      api: swaggerFileData,
      defaulthandler: defaultHandler,
      generateMockdata: true,
      generateMockDataOptions: {
        mockedDirectory: mockDataDir
      }
    }, function (err, routes) {
      Expect(err).to.equal(null);

      routes.forEach(function (route) {
        var routePath = route.path.replace(/{|}/g, '');
        var method = route.method.toUpperCase();
        var filePath = Path.join(mockDataDir, routePath, method, 'default.json');
        setTimeout(function () {
          Expect(Fs.existsSync(filePath)).to.be.true;
        }, 5000);
      });
      done();
    });
  });

  it('check that endpoints-swagger.js is generated', function (done) {
    var defaultHandler = function (req, reply) {
      Midway.util.respondWithFile(this, reply);
    };

    MidwaySwagger.builder({
      api: swaggerFileData,
      defaulthandler: defaultHandler,
      storeEndpointsToFile: true,
      endpointsFilePath: testDataDir
    }, function () {
      var filePath = Path.join(testDataDir, 'endpoints-swagger.js');
      Expect(Fs.existsSync(filePath)).to.be.true;

      done();
    });
  });

  it('check that handler is generated', function (done) {
    try {
      MidwaySwagger.builder({
        api: 'not/existing',
        storeEndpointsToFile: false,
        endpointsFilePath: testDataDir
      }, function () {

      });
    } catch (err) {
      Expect(err.message).to.equal('Expected an api definition.');
      done();
    }
  });

  it('check that handler is generated', function (done) {
    try {
      MidwaySwagger.builder({
        api: 'not/existing',
        storeEndpointsToFile: false,
        endpointsFilePath: testDataDir
      }, function () {

      });
    } catch (err) {
      Expect(err.message).to.equal('Expected an api definition.');
      done();
    }
  });
});

