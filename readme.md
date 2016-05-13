# Wisk

Simple build tool that allows you to run shell commands when files or directories change.

Essentially `chokidar` + `child_process.spawn`.

## Configuration

Create a file that defines the tasks. Wisk config files can be either `js` or `json` and must return an `Array`.

Here we set up a single watcher on the current directory that runs two tasks when any change is made.

```js
// tasks.js
module.exports = [{
  paths: '.',  // The path to watch. Can be an array of paths and supports globs. See https://github.com/paulmillr/chokidar/blob/master/README.md#api
  options: {}, // `chokidar` watch options. See https://github.com/paulmillr/chokidar/blob/master/README.md#api
  on: {
    // Event listeners and the commands to run.
    // Listen for an FS event.
    // Available events: `add`, `addDir`, `change`, `unlink`, `unlinkDir`, `ready`, `raw`, `error`.
    // Additionally `all` is available which gets emitted with the underlying event
    // name and path for every event other than `ready`, `raw`, and `error`.
    all: ['date +%s', 'ls -al']
  }
}]
```

## Example

```js
module.exports = [{
  paths: ['client/**/*.js', 'client/**/*.html'],
  on: {
    all: ['npm run build:app:js']
  }
}, {
  paths: ['client/**/*.scss'],
  on: {
    all: ['npm run build:css']
  }
}]
```
## CLI

Use `wisk` from the command line:

`wisk tasks.js`

This is the easiest way to use wisk. It loads the `task.js` file and starts watching for changes.

  Command line options
  - `cwd` - the current working directory. Defaults to `process.cwd()`

## API

Use `wisk`:

```js
var wisk = require('wisk')
var tasks = require('./tasks')

wisk(tasks, __dirname)
```
