'use strict'

const Store = require( 'store' )
const Adapter = require( './adapter' )

const LevelStore = ( name, options ) => Store( Adapter( name, options ) )

module.exports = LevelStore
