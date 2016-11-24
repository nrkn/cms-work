'use strict'

const Validator = require( 'validator' )
const utils = require( 'utils' )
const schema = require( 'tree/tree-node/schema' )

const { id, identifier } = utils

const validator = Validator( schema )
const t = Validator.mtype( validator )

const TreeNode = ( ...args ) => {
  let value = { 
    nodeType: 'node',
    isEmpty: false 
  }

  const children = []

  args.forEach( arg => {
    if( typeof arg === 'string' ){
      value.nodeType = identifier( arg, true )
    } else if( typeof arg === 'object' ){
      Object.assign( value, arg )
    } else if( typeof arg === 'boolean' ){
      value.isEmpty = arg
    }
  })

  if( typeof value._id !== 'string' )
    value._id = id( value.nodeType ) 
  
  const treeNode = { value, children } 

  if( !t.is( treeNode, 'node' ) )
    throw new TypeError( 'Cannot create a node with those arguments' )

  return treeNode
}

module.exports = TreeNode
