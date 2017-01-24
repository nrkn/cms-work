'use strict'

// functions for finding different tree node types in the composer DOM
const Find = idMap => {
  const nodeEl = el => el.querySelector( '.composer-node' )
  const containerEl = el => el.closest( '.composer-node' )
  const elNode = el => idMap.findById( nodeEl( el ).id )
  const containerElNode = el => idMap.findById( containerEl( el ).id )

  return { nodeEl, containerEl, elNode, containerElNode }
}

module.exports = Find
