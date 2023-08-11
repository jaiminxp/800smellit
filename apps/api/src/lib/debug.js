const dbg = require('debug')
const log = dbg('INFO')
const error = dbg('ERROR')
const status = dbg('STATUS')

log.log = console.log.bind(console)
status.log = console.log.bind(console)

error.color = dbg.colors[5]
log.color = dbg.colors[3]
status.color = dbg.colors[1]

const debug = { log, error, status }

module.exports = debug
