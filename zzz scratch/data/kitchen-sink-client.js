'use strict'

const html = require( './kitchen-sink.html.json' )
const Htree = require( 'tree/htree' )

module.exports = () => Htree( html )
