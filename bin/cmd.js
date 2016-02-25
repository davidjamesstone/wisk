#!/usr/bin/env node

'use strict'

const path = require('path')
const assert = require('assert')
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

const file = argv._[0]
assert(file, 'No task file supplied')

const cwd = argv.cwd || process.cwd()
const items = require(path.resolve(cwd, file))
const Wisk = require('../')

Wisk(cwd, items)
