'use strict'

const Tree = require( '1tree' )
const T = require( 'mtype' )
const paths = require( './paths' )

const { pathFromNode, nodeFromPath } = paths

const t = T()

const valueTypes = [ 'string', 'number', 'boolean' ]

const extendValue = ( node, value ) =>
  node.value( Object.assign( {}, node.value(), value ) )

const toNode = ( jsonObj, parent ) => {
  const create = parent ? parent.createNode : Tree.createRoot

  const nodeType = t.of( jsonObj )
  const value = { nodeType }

  if( valueTypes.includes( nodeType ) )
    value.nodeValue = jsonObj

  const node = create( value )

  if( nodeType === 'array' ){
    jsonObj.forEach( ( el, index ) => {
      const arrayItemNode = toNode( el, node )

      extendValue( arrayItemNode, { arrayIndex: index })

      node.append( arrayItemNode )
    })
  } else if( nodeType === 'object' ){
    const propertyNames = Object.keys( jsonObj )

    propertyNames.forEach( name => {
      const propertyValue = jsonObj[ name ]
      const valueNode = toNode( propertyValue, node )

      extendValue( valueNode, { propertyName: name })

      node.append( valueNode )
    })
  }

  return node
}

const toTree = jsonObj => toNode( jsonObj, null )

const toJson = tree => {
  const value = tree.value()
  const nodeType = value.nodeType

  if( nodeType === 'null' ) return null

  if( valueTypes.includes( nodeType ) )
    return value.nodeValue

  if( nodeType === 'array' )
    return tree.getChildren().map( toJson )

  if( nodeType === 'object' ){
    const obj = {}

    tree.getChildren().forEach( nameValueNode => {
      const value = nameValueNode.value()
      const { propertyName } = value
      const propertyValue = toJson( nameValueNode )

      obj[ propertyName ] = propertyValue
    })

    return obj
  }

  throw new Error( 'Unexpected node' )
}

module.exports = { toTree, toJson, pathFromNode, nodeFromPath }
