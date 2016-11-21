'use strict'

const parseStr = require( 'htree/parse' )

// should be added after the default plugins so that createTree exists!
const createTreeFromStr = fn => {
  // override createTree to allow passing a string
  const originalCreateTree = fn.createTree

  const createTree = rootValue => {
    if( typeof rootValue === 'string' )
      rootValue = parseStr( rootValue )

    return originalCreateTree( rootValue )
  }

  createTree.def = originalCreateTree.def

  return Object.assign( fn, { createTree } )
}

module.exports = createTreeFromStr
