'use strict'

const { toTree, toJson } = require( '1tree-json' )

const transformMapper = ( model, transform ) => {
  const clone = Object.assign( {}, model )

  const mappingKeys = Object.keys( transform )

  mappingKeys.forEach( key => {
    const replacement = transform[ key ]

    const repTree = toTree( replacement )

    const propertyNodes = repTree.findAll( n =>
      n.value().propertyName === '$value'
    )

    propertyNodes.forEach( propertyNode => {
      const objectNode = propertyNode.getParent()
      const objectNodeParent = objectNode.getParent()

      const value = propertyNode.value()
      const sourcePropertyName = value.nodeValue
      const sourceValue = model[ sourcePropertyName ]

      const newValueNode = toTree( sourceValue )

      objectNodeParent.replaceChild( newValueNode, objectNode )
    })

    const replacementObj = toJson( repTree )

    clone[ key ] = replacementObj
  })

  return clone
}

module.exports = transformMapper
