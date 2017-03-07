"use strict"

const assert = require( 'assert' )
const getDependencies = require( '../src/server/fileSystem/getDependencies' )
const normalizeSchema = require( '../src/schema/normalize' )
const SchemaTree = require( '1tree-schema' )

describe( 'normalize schema', () => {
  it( 'does a thing', () => {
    return getDependencies( './data' )
      .then( dependencies => {
        const { schemas } = dependencies

        const buttonIconSchema = schemas[ 'button-icon' ]
        const buttonTextSchema = schemas[ 'button-text' ]

        const buttonTextSchemaTree = SchemaTree( buttonTextSchema )

        const testSchemas = {
          'button-icon': buttonIconSchema
          //,'button-text': buttonTextSchema
        }

        const normalizedSchemas = Object.keys( testSchemas ).reduce(
          ( norm, schemaName ) => {
            norm[ schemaName ] = normalizeSchema( schemas, schemaName )

            return norm
          },
          {}
        )

        Object.keys( normalizedSchemas ).forEach( schemaName => {
          console.log( 'Normalized schema for ', schemaName )
          console.log( JSON.stringify( normalizedSchemas[ schemaName ], null, 2 ))
        })



        assert( true )
      })
  })
})
