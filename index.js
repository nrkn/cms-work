'use strict'

const cms = require( './src/server' )

/*
cms
  .start()
  .catch( console.error )
*/

const readSchemas = require( './src/server/readSchemas' )
const fs = require( 'fs' )
const pify = require( 'pify' )

const writeFile = pify( fs.writeFile )

readSchemas( './data/schemas' )
    .then( schemas => JSON.stringify( schemas, null, 2 ) )
    .then( json => writeFile( './dist/data/schemas.json', json, 'utf8' ) )
    .catch( console.error )
