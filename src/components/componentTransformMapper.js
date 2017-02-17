'use strict'

const SchemaTree = require( '1tree-schema' )
const JsonTree = require( '1tree-json' )
const transformMapper = require( 'mojule-transform' )
const utils = require( 'mojule-utils' )

const { clone } = utils

const mapComponents = ( dependencies, componentName, model ) => {
  model = clone( model )

  const modelTree = JsonTree( model )

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

  if( !transform && !componentSchema ){
    return model
  }

  const componentSchemaTree = SchemaTree( componentSchema )
  const refComponents = findRefComponents( componentSchemaTree )

  refComponents.forEach( refComponentNode => {
    const value = refComponentNode.value()
    const componentName = value.$ref
    const componentTransform = transforms[ componentName ]

    if( !componentTransform ) return

    /*
      Important to remember that schema paths do not necessarily match up to
      model - this will work for now, but need to investigate and consider a
      more robust solution
    */
    const refPathNode = value.arrayItem ?
      refComponentNode.getParent() :
      refComponentNode

    const refNodePath = refPathNode.getPath()
    const modelNode = modelTree.atPath( refNodePath )

    if( !modelNode ) return

    const modelNodeValue = modelNode.value()

    if( value.arrayItem ){
      const modelArray = modelNode.toJson()

      const transformed = modelArray.map( item =>
        mapComponents( dependencies, componentName, item )
      )

      const transformedNode = JsonTree( transformed )
      const modelNodeParent = modelNode.getParent()

      if( modelNodeValue.propertyName ){
        const transformedNodeValue = transformedNode.value()
        transformedNodeValue.propertyName = modelNodeValue.propertyName
        transformedNode.value( transformedNodeValue )
      }

      modelNodeParent.replaceChild( transformedNode, modelNode  )
    } else if( value.propertyName ){
      const model = modelNode.toJson()

      const transformed = mapComponents( dependencies, componentName, model )

      const transformedNode = JsonTree( transformed )
      const modelNodeParent = modelNode.getParent()

      if( modelNodeValue.propertyName ){
        const transformedNodeValue = transformedNode.value()
        transformedNodeValue.propertyName = modelNodeValue.propertyName
        transformedNode.value( transformedNodeValue )
      }

      modelNodeParent.replaceChild( transformedNode, modelNode  )
    }
  })

  model = modelTree.toJson()

  if( transform )
    model = transformMapper( model, transform )

  return model
}

module.exports = mapComponents
