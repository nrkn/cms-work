'use strict'

const { toTree, toJson } = require( '1tree-json' )

const processValues = ( model, repTree ) => {
  const propertyNodes = repTree.findAll( n =>
    n.value().propertyName === '$value'
  )

  propertyNodes.forEach( propertyNode => {
    const objectNode = propertyNode.getParent()
    const objectNodeParent = objectNode.getParent()

    const value = propertyNode.value()
    const sourcePropertyName = value.nodeValue
    const sourceValue = model[ sourcePropertyName ]

    if( sourceValue === undefined )
      throw new Error(
        'Tried to transform using a value not present in model: ' +
        sourcePropertyName +
        '; ' +
        JSON.stringify( model )
      )

    const newValueNode = toTree( sourceValue )

    objectNodeParent.replaceChild( newValueNode, objectNode )
  })
}

const processIfs = ( model, repTree ) => {
  const propertyNodes = repTree.findAll( n =>
    n.value().propertyName === '$if'
  )

  propertyNodes.forEach( propertyNode => {
    const objectNode = propertyNode.getParent()
    const objectNodeParent = objectNode.getParent()

    const ifArgNodes = propertyNode.getChildren()

    const isValue = ifArgNodes[ 0 ].value().nodeValue

    if( isValue ){
      const ifValueNode = ifArgNodes[ 1 ]
      objectNodeParent.insertBefore( ifValueNode, objectNode )
    }

    objectNode.remove()
  })
}

const transformMapper = ( model, transform ) => {
  const clone = Object.assign( {}, model )

  const mappingKeys = Object.keys( transform )

  mappingKeys.forEach( key => {
    const replacement = transform[ key ]

    const repTree = toTree( replacement )

    processValues( model, repTree )
    processIfs( model, repTree )

    const replacementObj = toJson( repTree )

    clone[ key ] = replacementObj
  })

  return clone
}

module.exports = transformMapper
