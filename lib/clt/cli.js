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
// Midway-swagger command line tool
var yargs = require('yargs');
var argv = require('yargs')
  .usage('Usage: $0 <command>')
  .completion()
  .alias('s', 'start')
  .describe('start', 'Start with existing config')
  .alias('c', 'config')
  .describe('config', 'Configure and create config')
  .alias('h', 'help')
  .help('help')
  .argv;

var Fs = require('fs');
var Path = require('path');
var Inquirer = require('inquirer');
var Logger = require('testarmada-midway-logger');
var StartMidwaySwagger = require('./start-midway-swagger');


var questions = [
  {
    type: 'input',
    name: 'swaggerOptions',
    message: 'Enter the URL to the swagger definition file you want to use(enter in the format of host:port/swagger)',
    default: 'petstore.swagger.io:80/v2/swagger',
    validate: function (value) {
      var pass = value.match(/^.*\:\d+\/.+$/i);
      if (pass) {
        return true;
      } else {
        return 'Please enter host and port in a valid format (petstore.swagger.io:80/v2/swagger)';
      }
    }
  },
  {
    type: 'confirm',
    name: 'startMidwayInstance',
    message: '[?] Do you want Midway-Swagger to start a Midway mock server with the generated routes',
    default: false,
    filter: function (str) {
      return str.toLowerCase();
    }
  },
  {
    type: 'input',
    name: 'midwayOptions',
    message: 'Enter the host and port that will be used for Midway mock server(enter in the format of host:port)',
    default: 'localhost:8080',
    when: function (answers) {
      return answers.startMidwayInstance === true;
    },
    validate: function (value) {
      var pass = value.match(/^.*\:\d+$/i);
      if (pass) {
        return true;
      } else {
        return 'Please enter host and port in a valid format (host:post)';
      }
    }
  },
  {
    type: 'confirm',
    name: 'storeEndpointsToFile',
    message: '[?] Do you want to save generated routes to a endpoints-swagger.js file',
    default: false,
    filter: function (str) {
      return str.toLowerCase();
    }
  },
  {
    type: 'input',
    name: 'endpointsFilePath',
    message: 'Enter path to where the endpoints-swagger.js file should be generated(relative path)',
    default: '.',
    when: function (answers) {
      return answers.storeEndpointsToFile === true;
    }
  },
  {
    type: 'confirm',
    name: 'generateMockedData',
    message: '[?] Do you want random mock data to be generated',
    default: false,
    filter: function (str) {
      return str.toLowerCase();
    }
  },
  {
    type: 'input',
    name: 'mockedDirectory',
    message: 'Enter path to where the mock data shall be generated(relative path)',
    default: './mocked-data',
    when: function (answers) {
      return answers.generateMockedData === true;
    }
  },
  {
    type: 'list',
    name: 'mockType',
    message: 'Which type of mock structure do you want to use for the generated mock data?',
    choices: ['variant', 'mockId'],
    default: 'variant',
    when: function (answers) {
      return answers.generateMockedData === true;
    }
  },
  {
    type: 'input',
    name: 'mockId',
    message: 'Enter mockId for your mock data',
    default: 'swaggerMockId',
    when: function (answers) {
      return answers.mockType === 'mockId';
    }
  }
];

if (argv.config) {
  console.log('\n==========================================='); // eslint-disable-line no-console
  console.log('Midway-Swagger Mock Server Configuration Helper');  // eslint-disable-line no-console
  console.log('===========================================\n'); // eslint-disable-line no-console

  Inquirer.prompt(questions).then(function (answers) {

    Logger.debug(JSON.stringify(answers, null, '  '));

    var options = {};

    var matcher = answers.swaggerOptions.match(/(.+):(\d+)(.+)/);
    options.swaggerOptions = { host: matcher[1], port: matcher[2], path: matcher[3]};

    if (answers.startMidwayInstance) {
      var midway = answers.midwayOptions.split(':');
      options.midwayOptions = {host: midway[0], port: midway[1], mockedDirectory: answers.mockedDirectory};
      options.startMidwayInstance = answers.startMidwayInstance;
    }

    options.generateMockdata = answers.generateMockedData;

    if (answers.generateMockedData) {
      if (answers.mockType === 'mockId') {
        options.generateMockDataOptions = { mockedDirectory: answers.mockedDirectory, mockId: answers.mockId };
      } else {
        options.generateMockDataOptions = { mockedDirectory: answers.mockedDirectory};
      }
    }

    options.storeEndpointsToFile = answers.storeEndpointsToFile;
    options.endpointsFilePath = answers.endpointsFilePath;

    // setting up config dir
    var dir = Path.join(process.cwd(), 'config');
    if (!Fs.existsSync(dir)) {
      Fs.mkdirSync(dir);
    }

    // write config/default.json
    Fs.writeFileSync(Path.join(dir, 'default.json'), JSON.stringify(options, null, ' '));

    console.log('\n================================================================'); // eslint-disable-line no-console
    console.log('Successfully generated swagger routes');                              // eslint-disable-line no-console
    console.log('based on swagger running on ' + answers.swaggerOptions);              // eslint-disable-line no-console
    console.log('================================================================\n'); // eslint-disable-line no-console
    StartMidwaySwagger.init();
  });
} else if (argv.start) {
  StartMidwaySwagger.init();
} else {
  yargs.showHelp();
}
