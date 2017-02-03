'use strict'

'use strict'

const { escapeHtml } = require( 'mojule-utils' )

const defaultOptions = {
  depth: 0
}

const groupToModel = ( node, options ) => {
  const { depth } = options

  const value = node.value()
  const id = node.id()
  const treeType = '1tree'
  const nodeType = node.nodeType()
  const title = value.name || ''

  let isFirstChild = false
  if( depth === 1 ){
    const parentNode = node.getParent()
    const parentFirstChild = parentNode.firstChild()

    if( parentFirstChild ){
      isFirstChild = id === parentFirstChild.id()
    }
  }

  let isCollapsed = node.meta( 'isCollapsed' )

  /*
    unless the user has collapsed the node, the first child at depth 1 is
    always expanded
  */
  if( typeof isCollapsed !== 'boolean' ){
    isCollapsed = depth > 0 && !isFirstChild
  }

  const model = {
    id, title, treeType, nodeType, depth, isCollapsed
  }

  return model
}

const buttonToModel = ( node, options ) => {
  const { depth } = options

  const value = node.value()
  const id = node.id()
  const treeType = '1tree'
  const nodeType = node.nodeType()
  const title = value.name || ''

  const model = {
    id, title, treeType, nodeType, depth
  }

  return model
}

const nodeTypeMap = {
  'toolbar-group': groupToModel,
  'toolbar-button': buttonToModel
}

const nodeToModel = ( node, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const nodeType = node.nodeType()

  const mapper = nodeTypeMap[ 'toolbar-group' ]

  if( typeof mapper !== 'function' )
    throw new Error( `Unexpected nodeType: ${ nodeType }` )

  return mapper( node, options )
}

module.exports = nodeToModel
