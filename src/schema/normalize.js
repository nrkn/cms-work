'use strict'

const SchemaTree = require( '1tree-schema' )
const utils = require( 'mojule-utils' )

const { clone } = utils

const findRefNodes = schemaNode =>
  schemaNode.findAll( n => '$ref' in n.value() )

const findAllOfNodes = schemaNode =>
  schemaNode.findAll( n => n.value().allOf )

const extendSchema = ( baseNode, extendNode ) => {
  const baseNodeValue = baseNode.value()
  const extendNodeValue = extendNode.value()

  Object.keys( extendNodeValue ).forEach( propertyName => {
    if( propertyName === 'required' ){
      if( !Array.isArray( baseNodeValue.required ) )
        baseNodeValue.required = []

      baseNodeValue.required.push( ...extendNodeValue.required )

      return
    }

    if( propertyName === 'id' )
      return

    baseNodeValue[ propertyName ] = extendNodeValue[ propertyName ]
  })

  extendNode.getChildren().forEach( childNode => {
    baseNode.append( childNode )
  })

  baseNode.value( baseNodeValue )
}

const normalize = ( schemas, name ) => {
  const schemaNames = Object.keys( schemas )
  const schema = clone( schemas[ name ] )
  const schemaTree = SchemaTree( schema )

  const refNodes = findRefNodes( schemaTree )

  refNodes.forEach( refNode => {
    const replaceWithName = refNode.value().$ref
    const replaceWithSchema = normalize( schemas, replaceWithName )
    const replaceWithNode = SchemaTree( replaceWithSchema )

    const refNodeValue = refNode.value()
    delete refNodeValue.$ref
    refNode.value( refNodeValue )

    extendSchema( refNode, replaceWithNode )
  })

  const allOfNodes = findAllOfNodes( schemaTree )

  allOfNodes.forEach( allOfNode => {
    const parentNode = allOfNode.getParent()

    const allOfValue = allOfNode.value()
    delete allOfValue.allOf
    allOfNode.value( allOfValue )

    extendSchema( parentNode, allOfNode )

    allOfNode.remove()
  })

  return schemaTree.toSchema()
}

module.exports = normalize
