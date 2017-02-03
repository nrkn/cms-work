'use strict'

const TreeFactory = require( '1tree-factory' )

const empty = [ 'toolbar-button' ]

const isEmptyPlugin = fn => {
  const isEmpty = ( fn, node ) => {
    const nodeType = fn.nodeType( fn, node )

    return empty.includes( nodeType )
  }

  isEmpty.def = fn.isEmpty.def

  return Object.assign( fn, { isEmpty } )
}

const ToolbarTree = TreeFactory( isEmptyPlugin )

module.exports = ToolbarTree
