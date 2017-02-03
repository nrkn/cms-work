'use strict'

const Tree = require( '../trees/toolbar-tree' )
const nodeToModel = require( './defaultNodeToModel' )

const defaultOptions = {
  depth: 0,
  createNode: Tree.createRoot,
  alwaysRenderChildren: false,
  nodeToModel
}

const nodeToComposerNode = ( node, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const { depth, createNode, nodeToModel, alwaysRenderChildren } = options

  const model = nodeToModel( node, { depth } )

  const nodeType = node.nodeType()

  const value = {
    name: nodeType,
    model
  }

  const componentNode = createNode( value )

  const shouldRenderChildren = alwaysRenderChildren || !model.isChildrenCollapsed

  if( shouldRenderChildren ) {
    const children = node.getChildren()

    children.forEach( childNode => {
      const childOptions = Object.assign(
        {},
        options,
        {
          depth: depth + 1
        }
      )

      const componentChildNode = nodeToComposerNode( childNode, childOptions )

      componentNode.append( componentChildNode )
    })
  }

  return componentNode
}

module.exports = nodeToComposerNode
