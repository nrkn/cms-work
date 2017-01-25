'use strict'

const Tree = require( '1tree' )
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

  const value = {
    name: 'composer-node',
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
