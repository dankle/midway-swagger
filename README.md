# midway-swagger
Module for generating midway mock routes(endpoints.js) with random data based on a swagger 2.0 definition file.


## Installation

```shell
$ npm install -g midway-swagger
```


## Use it as follows

### Initiate from CLI:

Use the cli to setup a complete Midway mocking server with routes based on a swagger definition file.
For each route a default handler with `midway.util.respondWithFile()` will be generated. 
Also, if you choose to, a default random mock dataset will be generated for you.

```bash
Usage: midway-swagger <command\>

Options:
  -s, --start   Start with existing config
  -c, --config  Configure and create config
  -h, --help    Show help

```

#### Options
##### --start
This will start a Midway mock server locally based on an existing environment configuration (`config/default.json`).
Any time you need to start a Midway mock server with fresh routes from the latest swagger definition just run 
`midway-swagger --start` anywhere on your system.
Use option `--config` if you do not have an existing midway-swagger environment configuration. 

##### --config
This will start an interactive cli session to help you configure the environment.
You will need to know the URL for a running service with Swagger integrated in order for this to work. 
Midway-swagger will fetch the swagger 2.0 definition file from this service.


### Bash completion

`midway-swagger` comes with Bash-completion built in. To generate it, run

```
$ midway-swagger completion > midway-swagger-completion.sh
```

Put the generated file in your `bash-completion.d` directory or source it from
your `.bashrc` or similar.

```
# .bashrc
source /path/to/midway-swagger-completion.sh
```

### DEBUG:

It is possible to set the log level by simply setting the `MIDWAY_LOG_LEVEL` env variable to one of
`debug`, `info`, `warn` or `error`.

```bash
MIDWAY_LOG_LEVEL=debug node ./node_modules/.bin/midway-swagger
```

Documentation in this project is licensed under Creative Commons Attribution 4.0 International License.Full details available at https://creativecommons.org/licenses/by/4.0/