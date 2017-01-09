'use strict'

const cms = require( './src/server' )

/*
cms
  .start()
  .catch( console.error )
*/

const FileTree = require( './src/server/fileTree' )
const readFiles = require( './src/server/readFiles' )
/*
FileTree( './views/templates' )
  .then( FileTree.filePaths )
  .then( readFiles )
  .then( console.log )
  .catch( console.error )
*/
FileTree( './src/server/components/defs' )
  .then( FileTree.populateData )
  .then( tree => {
    const components = {}

    const predicates = {
      css: value => value.name.endsWith( 'css' ),
      template: value => value.name.endsWith( 'html' ),
      schema: value => value.name.endsWith( 'schema.json' ),
      defaultModel: value => !predicates.schema( value ) && value.name.endsWith( 'json' )
    }

    tree.walk( ( node, parent, depth ) => {
      const value = node.value()
      const parentValue = parent ? parent.value() : null
      if( depth === 1 ){
        components[ value.name ] = {}
      } else if( depth === 2 ){
        const component = components[ parentValue.name ]

        const propertyName = Object.keys( predicates )
          .find( key => predicates[ key ]( value ) )

        if( propertyName )
          component[ propertyName ] = value.data
      }
    })

    return components
  })
  .then( data => JSON.stringify( data, null, 2 ) )
  .then( console.log )
  .catch( console.error )
