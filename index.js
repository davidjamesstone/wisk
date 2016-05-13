'use strict'

const spawnargs = require('spawn-args')
const chokidar = require('chokidar')
const extend = require('util')._extend
const spawn = require('child_process').spawn
const log = console.log
const logError = console.error

function wisk (items, cwd) {
  if (!Array.isArray(items)) {
    items = [items]
  }

  let watchers = []

  // Default cwd to process.cwd
  cwd = cwd || process.cwd()

  const spawnOptions = {
    cwd: cwd,
    stdio: 'inherit'
  }

  // Iterate over passed items
  items.forEach((item, index) => {
    // Set up watch options with defaults
    const watchOptions = extend({
      cwd: cwd,
      ignoreInitial: true
    }, item.options)

    // Set up chokidar watcher
    log('Setting up watcher %d', index, item.paths)
    const watcher = chokidar.watch(item.paths, watchOptions)

    for (let key in item.on) {
      log('Setting up watcher event listeners: `%s`', key)
      let tasks = item.on[key]

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]

        // get task args
        let args = spawnargs(task)

        // Set up handler to and
        log('Setting up watcher task: `%s`', task)

        watcher.on(key, (event, path, stat) => {
          log('Event `%s` on path `%s`', event, path)
          log('Running `%s`', task)

          // Spawn child process
          const proc = spawn(args[0], args.slice(1), spawnOptions)
          log('Spawned task `%s` (%d)', task, proc.pid)

          // Log result on process exit
          proc.on('exit', (code) => {
            (code ? logError : log)('Spawned task `%s` (%d) exited with code %d', task, proc.pid, code)
          })
        })
      }
    }

    watchers.push(watcher)
  })

  return watchers
}

module.exports = wisk
