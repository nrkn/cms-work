'use strict'

const FileTree = require( '../fileTree' )
const readFiles = require( '../readFiles' )
const path = require( 'path' )

const readSchemas = schemaPath =>
  FileTree( schemaPath )
    .then( FileTree.populateData )
    .then( tree => {
      const schemas = {}

      tree.walk( ( currentNode, parentNode, depth ) => {
        if( depth === 0 ) return

        const value = currentNode.value()
        const schema = value.data
        const schemaName = schema.id

        schemas[ schemaName ] = schema
      })

      return schemas
    })

module.exports = readSchemas
