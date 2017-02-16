'use strict'

const { escapeHtml } = require( 'mojule-utils' )

const defaultOptions = {
  depth: 0
}

const nodeToModel = ( node, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const { depth } = options

  const value = node.value()
  const children = node.getChildren()

  const id = node.id()
  const name = value.name || ''
  const treeType = '1tree'
  const nodeType = node.nodeType()
  const title = `${ depth }: ${ name } ${ nodeType } [ ${ children.length } ]`
  const isEmpty = node.isEmpty()

  let isCollapsed = node.meta( 'isCollapsed' )

  isCollapsed = typeof isCollapsed === 'boolean' ? isCollapsed : depth > 0

  const isChildrenCollapsed = isCollapsed || !!node.meta( 'isChildrenCollapsed' )

  const preview = escapeHtml( JSON.stringify( value ) )
  const childrenTitle = `${ depth }: children`

  const nodeActions = [
    {
      "action": "delete",
      "iconName": "fa-trash",
      "buttonClasses": [
        "button--delete"
      ]
    }
  ]

  const childActions = [
    {
      "action": "collapse-all",
      "iconName": "fa-minus-square"
    },
    {
      "action": "expand-all",
      "iconName": "fa-plus-square"
    }
  ]

  const model = {
    id, title, treeType, nodeType, depth, isEmpty, isCollapsed,
    isChildrenCollapsed, preview, childrenTitle, nodeActions, childActions
  }

  return model
}

module.exports = nodeToModel
