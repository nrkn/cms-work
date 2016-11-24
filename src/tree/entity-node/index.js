'use strict'

const Validator = require( 'validator' )
const utils = require( 'utils' )
const schema = require( 'tree/entity-node/schema' )

const { id, identifier } = utils

const validator = Validator( schema )
const t = Validator.mtype( validator )

const EntityNodeValue = ( ...args ) => {
  let value = {
    nodeType: 'entityNode'
  }

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

  if( !t.is( value, 'entityNodeValue' ) )
    throw new TypeError( 'Cannot create an entityNodeValue with those arguments' )

  return value
}

const EntityNode = ( ...args ) => {
  const value = EntityNodeValue( ...args )
  const children = []

  return { value, children }
}

EntityNode.Value = EntityNodeValue
EntityNode.mtype = t

module.exports = EntityNode
