"use strict"

const assert = require( 'assert' )
const readComponents = require( '../src/server/fileSystem/readComponents' )
const readSchemas = require( '../src/server/fileSystem/readSchemas' )
const componentDestructurer = require( '../src/components/componentDestructurer' )
const componentTransformMapper = require( '../src/components/componentTransformMapper' )

const assignSchemas = dependencies =>
  readSchemas( './data/schemas' )
    .then( schemas => {
      Object.assign( dependencies.schemas, schemas )

      return dependencies
    })

const getDependencies = () =>
  readComponents( './data/components' )
    .then( componentDestructurer )
    .then( assignSchemas )

describe( 'component model to view model', () => {
  it( 'does a thing', () => {
    return getDependencies()
      .then( dependencies => {
        const { defaultModels } = dependencies

        const componentName = 'document'
        const model = defaultModels[ componentName ]

        const viewModel = componentTransformMapper( dependencies, componentName, model )

        assert( viewModel )
      })
  })
})