const attributes = require( './attributes' )
const create = require( './create' )

const dom = fn => {
  attributes( fn )
  create( fn )

  // handle document fragments
  const originalInsertBefore = fn.insertBefore

  const insertBefore = ( fn, root, parentNode, childNode, referenceNode ) => {
    if( fn.isDocumentFragment( childNode ) ){
      const children = fn.getChildren( childNode )

      children.forEach( child =>
        originalInsertBefore( fn, root, parentNode, child, referenceNode )
      )

      return childNode
    }

    return originalInsertBefore( fn, root, parentNode, childNode, referenceNode )
  }

  insertBefore.def = originalInsertBefore.def

  return Object.assign( fn, { insertBefore } )
}

module.exports = dom
