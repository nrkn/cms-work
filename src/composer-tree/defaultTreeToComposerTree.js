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

const mapNodeToComposerNode = ( node, createNode, depth = 0 ) => {
  const model = mapNodeToComposerNodeModel( node, depth )

  const value = {
    name: 'composer-node',
    model
  }

  const componentNode = createNode( value )

  const children = node.getChildren()

  children.forEach( childNode => {
    const componentChildNode = mapNodeToComposerNode( childNode, node.createNode, depth + 1 )
    componentNode.append( componentChildNode )
  })

  return componentNode
}

const mapTreeToComposerTree = tree =>
  mapNodeToComposerNode( tree, Tree.createRoot )

module.exports = mapTreeToComposerTree
