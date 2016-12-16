'use strict'

const pify = require( 'pify' )
const fs = require( 'fs' )
const Htree = require( 'tree/htree' )

const readFile = pify( fs.readFile )

module.exports = () => readFile( './data/kitchen-sink.html', 'utf8' )
  .then(
    html => Htree( html )
  )