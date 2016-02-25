# Wisk

Simple build tool that allows you to run shell commands or execute functions when files or directories change.

## Configuration

Create a file that defines the tasks. Wisk config files can be either `js` or `json` and must return an `Array`.

Here we set up a single watcher on the current directory that runs two tasks when changes are made.

```js
// tasks.js
module.exports = [{
  watch: {
    paths: '.'
  },
  tasks: [{
    command: 'browserify',
    args: ['index.js', 'bundle.js']
  }, {
    command: 'npm',
    args: ['run', 'test']
  }]
}]
```

## CLI

Use `wisk` from the command line:

```js
`wisk tasks.js`
```
This is the easiest way to use wisk. It loads the `task.js` file and starts watching for changes.

  Command line options
  - `cwd` - the current working directory. Defaults to `process.cwd()`

## API

Use `wisk` from the command line:

```js
`wisk tasks.js`
```
