'use strict'

const FileTree = require( '../fileTree' )
const readFiles = require( '../readFiles' )

const readComponents = componentPath =>
  FileTree( componentPath )
    .then( FileTree.populateData )
    .then( tree => {
      const components = {}

      const predicates = {
        style: value => value.name === 'style.css',
        template: value => value.name === 'template.html',
        schema: value => value.name === 'schema.json',
        defaultModel: value => value.name === 'defaultModel.json',
        config: value => value.name === 'config.json',
        transform: value => value.name === 'transform.json'
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
