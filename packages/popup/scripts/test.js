'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''
process.env.REACT_APP_ENV = 'test'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const path = require('path')
const paths = require('../config/paths')
const spawn = require('cross-spawn')

const jest = require('jest')
// Ensure environment variables are read.
let argv = process.argv.slice(2)

// Watch unless on CI, in coverage mode, or explicitly running all tests
if (!process.env.CI && !process.env.E2E && argv.indexOf('--coverage') === -1 && argv.indexOf('--watchAll') === -1) {
  argv.push('--watch')
}

if (process.env.CI) {
  argv.push('--ci')
}

if (process.env.E2E) {
  require('./checkBuildExist')
  argv.push('--config=jest.e2e.config.json')
} else {
  require('../config/env')
  argv.push('--config=jest.config.json')
}

argv.push('--detectOpenHandles')

const result = spawn.sync(path.normalize('./node_modules/.bin/jest'), argv, { stdio: 'inherit' })

process.exit(result.status)
