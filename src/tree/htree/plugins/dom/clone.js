'use strict'

const utils = require( 'utils' )

const clonePlugin = fn => {
  const clone = ( fn, node ) =>
    fn.deserialize( utils.clone( fn.serialize( node ) ) )

  clone.def = {
    argTypes: [ 'fn', 'node' ],
    returnType: 'node',
    requires: [ 'serialize', 'deserialize' ],
    categories: [ 'clone', 'plugin' ]
  }

  return Object.assign( fn, { clone } )
}

module.exports = clonePlugin
