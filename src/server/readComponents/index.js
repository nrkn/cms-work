'use strict'

const FileTree = require( '../fileTree' )
const readFiles = require( '../readFiles' )

const readComponents = componentPath =>
  FileTree( componentPath )
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

module.exports = readComponents
