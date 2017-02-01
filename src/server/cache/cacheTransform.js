'use strict'

const hasha = require( 'hasha' )
const fs = require( 'fs' )
const path = require( 'path' )

const existsSync = filename => {
  try {
    fs.accessSync( filename )
    return true
  } catch( ex ) {
    return false
  }
}

const cacheTransform = ( value, transform, ext ) => {
  const hash = hasha( value )

  let hashedFilePath = `./static/cache/${ hash }`

  if( typeof ext === 'string' )
    hashedFilePath += ext

  let transformed = ''

  if( existsSync( hashedFilePath ) ){
    transformed = fs.readFileSync( hashedFilePath, 'utf8' )
  } else {
    transformed = transform( value )

    fs.writeFileSync( hashedFilePath, transformed, 'utf8' )
  }

  return transformed
}

module.exports = cacheTransform
