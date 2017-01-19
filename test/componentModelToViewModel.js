"use strict"

const assert = require( 'assert' )
const getDependencies = require( '../src/server/fileSystem/getDependencies' )
const componentTransformMapper = require( '../src/components/componentTransformMapper' )

describe( 'component model to view model', () => {
  it( 'does a thing', () => {
    return getDependencies( './data' )
      .then( dependencies => {
        const { defaultModels } = dependencies

        const componentName = 'document'
        const model = defaultModels[ componentName ]

        const viewModel = componentTransformMapper( dependencies, componentName, model )

        assert( viewModel )
      })
  })
})