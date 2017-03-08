"use strict"

const assert = require( 'assert' )
const getDependencies = require( '../src/server/fileSystem/getDependencies' )
const normalizeSchema = require( '../src/schema/normalize' )
const SchemaTree = require( '1tree-schema' )
const fs = require( 'fs' )

describe( 'normalize schema', () => {
  it( 'does a thing', () => {
    return getDependencies( './data' )
      .then( dependencies => {
        const { schemas } = dependencies

        const schemaNames = Object.keys( schemas )

        schemaNames.forEach( name => {
          const normalized = normalizeSchema( schemas, name )
          const normalizedTree = normalizeSchema( schemas, name, true ).get()

          const schema = JSON.stringify( normalized, null, 2 )
          const tree = JSON.stringify( normalizedTree, null, 2 )

          fs.writeFile( './test/dump/schema/' + name + '.schema.json', schema, 'utf8' )
          fs.writeFile( './test/dump/schema-tree/' + name + '.schemaTree.json', tree, 'utf8' )
        })

        assert( true )
      })
  })
})
