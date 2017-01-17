'use strict'

const treeSchema = require( '1tree-schema' )
const treeJson = require( '1tree-json' )
const transformMapper = require( './transformMapper' )
const utils = require( 'mojule-utils' )

const { clone } = utils

const mapComponents = ( dependencies, componentName, model ) => {
  model = clone( model )

  const modelTree = treeJson.toTree( model )

  const { componentNames, schemas, transforms } = dependencies

  const schemaNames = Object.keys( schemas )

  const findRefComponents = schemaNode =>
    schemaNode.findAll( n =>
      componentNames.includes( n.value().$ref )
    )

  const transform = transforms[ componentName ]
  const componentSchema = schemas[ componentName ]

  if( transform && !componentSchema ){
    return transformMapper( model, transform )
  }

  const componentSchemaTree = treeSchema.toTree( componentSchema )
  const refComponents = findRefComponents( componentSchemaTree )

  refComponents.forEach( refComponentNode => {
    const value = refComponentNode.value()
    const componentName = value.$ref
    const componentTransform = transforms[ componentName ]

    if( !componentTransform ) return

    const refNodePath = treeSchema.pathFromNode( refComponentNode )
    const modelNode = treeJson.nodeFromPath( modelTree, refNodePath )

    if( !modelNode ) return

    const modelNodeValue = modelNode.value()

    if( value.arrayItem ){
      const modelArray = treeJson.toJson( modelNode )

      const transformed = modelArray.map( item =>
        //mapComponents( dependencies, componentName, item )
        transformMapper( item, componentTransform )
      )

      const transformedNode = treeJson.toTree( transformed )
      const modelNodeParent = modelNode.getParent()

      if( modelNodeValue.propertyName ){
        const transformedNodeValue = transformedNode.value()
        transformedNodeValue.propertyName = modelNodeValue.propertyName
        transformedNode.value( transformedNodeValue )
      }

      modelNodeParent.replaceChild( transformedNode, modelNode  )
    } else {
      throw new Error( 'Non arrayitem not implemented yet' )
    }
  })

  model = treeJson.toJson( modelTree )

  if( transform )
    model = transformMapper( model, transform )

  return model
}

module.exports = mapComponents
