'use strict'

const Tree = require( '1tree' )
const nodeToModel = require( './defaultNodeToModel' )
const nodeToComposerNode = require( './defaultNodeToComposerNode' )
const ComponentRenderNode = require( '../components/component-tree/renderNode' )

const defaultOptions = {
  depth: 0,
  createNode: Tree.createRoot,
  nodeToModel,
  nodeToComposerNode
}

const RenderNode = dependencies => {
  const componentRenderNode = ComponentRenderNode( dependencies )

  const renderNode = ( node, options ) => {
    options = Object.assign( {}, defaultOptions, options )

    const { nodeToModel, nodeToComposerNode, depth, createNode } = options

    const toComposerNodeOptions = { depth, createNode, nodeToModel }
    const composerNode = nodeToComposerNode( node, toComposerNodeOptions )
    const componentNode = componentRenderNode( composerNode )

    return componentNode
  }

  return renderNode
}

module.exports = RenderNode
