'use strict'

const Store = require( 'store' )
const Adapter = require( 'client/local-store/adapter' )

const LocalStore = ( name, options ) =>
  Adapter( name, options ).then( adapter => Store( adapter ) )

module.exports = LocalStore
