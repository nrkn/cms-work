'use strict'

const Tree = require( '1tree' )
const { escapeHtml } = require( 'mojule-utils' )

const mapNodeToComposerNodeModel = ( node, depth = 0 ) => {
  const value = node.value()
  const children = node.getChildren()

  const id = node.id()
  const name = value.name || ''
  const treeType = '1tree'
  const nodeType = node.nodeType()
  const title = `${ depth }: ${ name } ${ nodeType } [ ${ children.length } ]`
  const isEmpty = node.isEmpty()
  const isCollapsed = !!node.meta( 'isCollapsed' )
  const isChildrenCollapsed = !!node.meta( 'isChildrenCollapsed' )
  const preview = escapeHtml ( JSON.stringify( value ) )
  const childrenTitle = `${ depth }: children`

  const model = {
    id, title, treeType, nodeType, depth, isEmpty, isCollapsed,
    isChildrenCollapsed, preview, childrenTitle
  }

  return model
}

const mapNodeToComposerNode = ( node, depth = 0 ) => {
  const model = mapNodeToComposerNodeModel( node, depth )

  const value = {
    name: 'composer-node',
    model
  }

  const componentNode = node.createNode( value )

  const children = node.getChildren()

  children.forEach( childNode => {
    const componentChildNode = mapNodeToComposerNode( childNode, depth + 1 )
    componentNode.append( componentChildNode )
  })

  return componentNode
}

const mapTreeToComposerTree = tree => {
  const rootNodeValue = {
    name: 'composer'
  }

  const composerRootNode = Tree.createRoot( rootNodeValue )
  const composerNodes = mapNodeToComposerNode( tree )

  composerRootNode.append( composerNodes )

  return composerRootNode
}


module.exports = mapTreeToComposerTree
