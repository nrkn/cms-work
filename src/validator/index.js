'use strict'

const Validator = require( 'mtype-tv4' )
const schemas = require( '../../dist/data/schemas.json' )

const validator = Validator( schemas )

module.exports = validator
