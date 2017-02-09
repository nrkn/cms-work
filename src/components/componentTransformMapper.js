'use strict'

const SchemaTree = require( '1tree-schema' )
const JsonTree = require( '1tree-json' )
//const transformMapper = require( 'mojule-transform' )
const utils = require( 'mojule-utils' )

const { clone } = utils

// old versions for debugging
const oldSchemaTree = require( '../../zzz scratch/old-versions/1tree-schema' )
const oldJsonTree = require( '../../zzz scratch/old-versions/1tree-json' )
const runOld = false

let transformMapper
if( runOld ){
  transformMapper = require( '../../zzz scratch/old-versions/mojule-transform' )
} else {
  transformMapper = require( 'mojule-transform' )
}

const toJsonTree = obj => {
  if( runOld ){
    return oldJsonTree.toTree( obj )
  } else {
    return JsonTree( obj )
  }
}

const fromJsonTree = tree => {
  if( runOld ){
    return oldJsonTree.toJson( tree )
  } else {
    return tree.toJson()
  }
}

const toSchemaTree = obj => {
  if( runOld ){
    return oldSchemaTree.toTree( obj )
  } else {
    return SchemaTree( obj )
  }
}

const fromSchemaTree = tree => {
  if( runOld ){
    return oldSchemaTree.toJson( tree )
  } else {
    return tree.toSchema()
  }
}

const getJsonPath = node => {
  if( runOld ){
    return oldJsonTree.pathFromNode( node )
  } else {
    return node.getPath()
  }
}

const getSchemaPath = node => {
  if( runOld ){
    return oldSchemaTree.pathFromNode( node )
  } else {
    return node.getPath()
  }
}

const getJsonNode = ( tree, path ) => {
  if( runOld ){
    return oldJsonTree.nodeFromPath( tree, path )
  } else {
    return tree.atPath( path )
  }
}

const getSchemaNode = ( tree, path ) => {
  if( runOld ){
    return oldSchemaTree.nodeFromPath( tree, path )
  } else {
    return tree.atPath( path )
  }
}

const mapComponents = ( dependencies, componentName, model ) => {
  model = clone( model )

  //const modelTree = JsonTree( model )
  const modelTree = toJsonTree( model )

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

  //const componentSchemaTree = SchemaTree( componentSchema )
  const componentSchemaTree = toSchemaTree( componentSchema )
  const refComponents = findRefComponents( componentSchemaTree )

  refComponents.forEach( refComponentNode => {
    const value = refComponentNode.value()
    const componentName = value.$ref
    const componentTransform = transforms[ componentName ]

    if( !componentTransform ) return

    //const refNodePath = refComponentNode.getPath()
    //const refNodePath = refComponentNode.getParent().getPath()
    let refNodePath
    if( runOld ){
      refNodePath = getSchemaPath( refComponentNode )
    } else {
      refNodePath = getSchemaPath( refComponentNode.getParent() )
    }
    //const modelNode = modelTree.atPath( refNodePath )
    const modelNode = getJsonNode( modelTree, refNodePath )

    if( !modelNode ) return

    const modelNodeValue = modelNode.value()

    if( value.arrayItem ){
      //const modelArray = modelNode.toJson()
      const modelArray = fromJsonTree( modelNode )

      const transformed = modelArray.map( item =>
        mapComponents( dependencies, componentName, item )
      )

      //const transformedNode = JsonTree( transformed )
      const transformedNode = toJsonTree( transformed )
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

  //model = modelTree.toJson()
  model = fromJsonTree( modelTree )

  if( transform )
    model = transformMapper( model, transform )

  return model
}

module.exports = mapComponents
