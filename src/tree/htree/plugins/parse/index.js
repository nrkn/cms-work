'use strict'

const parseStr = require( 'tree/htree/parse' )

const parser = fn => {
  const parse = str => fn.deserialize( parseStr( str ) )

  parse.def = {
    argTypes: [ 'string' ],
    returnType: 'node',
    requires: [ 'deserialize' ],
    categories: [ 'parser', 'plugin' ]
  }

  return Object.assign( fn, { parse } )
}

module.exports = parser
