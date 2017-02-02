'use strict'

/*
  cache that maps between tree nodes and their DOM representations using the id
  attribute
*/
const IdMap = tree => {
  const idMap = new Map()

  const findById = id => {
    if( idMap.has( id ) ) return idMap.get( id )

    const node = tree.find( n => n.id() === id )

    if( node === undefined )
      throw new Error( `No node exists in the tree with id ${ id }` )

    idMap.set( id, node )

    return node
  }

  const refresh = node => {
    node.walk( n => idMap.set( n.id(), n ) )
  }

  refresh( tree )

  return Object.assign( idMap, { findById, refresh } )
}

module.exports = IdMap
