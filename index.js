'use strict'

const assert = require('assert')
const chokidar = require('chokidar')
const extend = require('util')._extend
const spawn = require('child_process').spawn
const log = console.log
const logError = console.error

function Wisk (cwd, items) {
  assert(Array.isArray(items), 'Expected arguments `items` to be an array')

  cwd = cwd || process.cwd()

  items.forEach((item, index) => {
    var watch = item.watch
    const tasks = item.tasks

    watch.options = extend({
      cwd: cwd,
      ignoreInitial: true
    }, watch.options)

    for (let i = 0; i < tasks.length; i++) {
      if (typeof tasks[i].command === 'string') {
        tasks[i].options = extend({
          cwd: cwd,
          stdio: 'inherit'
        }, tasks[i].options)
      }
    }

    log(`Setting up watcher ${index}:`, watch.paths)
    const watcher = chokidar.watch(watch.paths, watch.options)

    watcher.on('all', (event, path, stat) => {
      log(`Event ${event} on item ${path}`, stat || '')

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]

        if (typeof task.command === 'function') {
          log(`Executing task function ${task.command.name}`, task.args)

          try {
            task.command.apply(task.options, task.args)
            log(`Executed task function ${task.command.name}`)
          } catch (e) {
            logError(`Error executing task function ${task.command.name}`, e)
          }
        } else if (typeof task.command === 'string') {
          log(`Spawning task command '${task.command}'`, task.args)

          const proc = spawn(task.command, task.args, task.options)
          log(`Spawned task command '${task.command}'`, proc.pid)

          proc.on('exit', (code) => {
            (code ? logError : log)(`Spawned task '${task.command}' (${proc.pid}) exited with code ${code}`)
          })
        }
      }
    })
  })
}

module.exports = Wisk
