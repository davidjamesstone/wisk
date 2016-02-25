const chokidar = require('chokidar')
const spawn = require('child_process').spawn
const log = console.log
const logError = console.error

function Wisk (items) {
  items.forEach((item, index) => {
    const watch = item.watch
    const task = item.task

    log(`-- Setting up item ${index} --`)
    log(`Setting up watcher ${watch.paths}`)
    const watcher = chokidar.watch(watch.paths, watch.options)

    const watchedPaths = watcher.getWatched()
    log(watchedPaths)

    watcher.on('all', (event, path, stat) => {
      log(`${event} file ${path}`)

      if (stat) {
        log(`File ${path} changed size to ${stat.size}`)
      }

      if (typeof task.command === 'function') {
        log(`Executing task function ${task.command}`)

        try {
          task.command.apply(task.options, task.args)
          log(`Executed task function ${task.command}`)
        } catch (e) {
          logError(`Error executing task function ${task.command}`, e)
        }
      } else if (typeof task.command === 'string') {
        log(`Spawning task command ${task.command}`)

        const proc = spawn(task.command, task.args)
        log(`Spawned task command ${task.command}`, proc.pid)
        proc.on('exit', (code) => {
          (code ? logError : log)(`Spawned task ${proc.pid} exited with code ${code}`)
        })
      }
    })
  })
}

module.exports = Wisk
