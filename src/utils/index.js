'use strict'

const clone = obj => JSON.parse( JSON.stringify( obj ) )

const matches = ( obj, source ) =>
  Object.keys( source ).every( key => obj[ key ] === source[ key ] )

const id = ( ...args ) => {
  let str = ''
  let length = 32

  args.forEach( arg => {
    if( typeof arg === 'string' ){
      str = identifier( arg ) + '-'
    } else if( typeof arg === 'number' ){
      length = arg
    }
  })

  for( let i = 0; i < length; i++ ){
    str += Math.floor( Math.random() * 16 ).toString( 16 )
  }

  return str
}

const identifier = ( value, caseSensitive ) => {
  let id = value.replace( /[^a-z0-9]/gi, '-' ).replace( /-{2,}/g, '-' )

  if( !caseSensitive )
    id = id.toLowerCase()

  return id
}

const escapeHtml = str => {
  while( str.indexOf( '<' ) !== -1 )
    str = str.replace( '<', '&lt;' )

  return str
}

const capitalizeFirstLetter = str =>
  str.charAt( 0 ).toUpperCase() + str.slice( 1 )

module.exports = {
  id, identifier, matches, clone, escapeHtml, capitalizeFirstLetter
}
