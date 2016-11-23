'use strict'

const utils = require( 'utils' )

const { id, identifier } = utils

const TreeNode = ( ...args ) => {
  let nodeType = 'treeNode'
  let value = {}
  let isEmpty = false

  args.forEach( arg => {
    if( typeof arg === 'string' ){
      nodeType = identifier( arg, true )
    } else if( typeof arg === 'object' ){
      value = arg
    } else if( typeof arg === 'boolean' ){
      isEmpty = arg
    }
  })

  const treeNode = {
    value: Object.assign(
      {
        _id: id( nodeType ),
        nodeType,
        isEmpty
      },
      value
    ),
    children: []
  }

  if( !TreeNode.isTreeNode( treeNode ) )
    throw new TypeError( '_id or nodeType is not a string' )

  return treeNode
}

TreeNode.isTreeNode = obj =>
  obj !== undefined &&
  typeof obj.value === 'object' &&
  typeof obj.value._id === 'string' &&
  typeof obj.value.nodeType === 'string' &&
  Array.isArray( obj.children )

TreeNode.isNodeType = ( obj, nodeType ) =>
  TreeNode.isTreeNode( obj ) && obj.value.nodeType === nodeType

module.exports = TreeNode
