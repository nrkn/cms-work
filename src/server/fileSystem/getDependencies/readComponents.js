'use strict'

const sass = require( 'node-sass' )
const FileTree = require( '../fileTree' )
const readFiles = require( '../readFiles' )

const readComponents = componentPath =>
  FileTree( componentPath )
    .then( FileTree.populateData )
    .then( tree => {
      const components = {}

      const mapperPredicates = {
        style: value => value.name === 'style.scss',
      }

      const mappers = {
        style: data => sass.renderSync({ data })
      }

      const predicates = {
        style: value => value.name === 'style.css' || value.name === 'style.scss',
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

          if( propertyName ){
            let data = value.data

            const hasMapper =
              propertyName in mapperPredicates &&
              mapperPredicates[ propertyName ]( value )

            if( hasMapper )
              data = mappers[ propertyName ]( data )

            component[ propertyName ] = data
          }

        }
      })

      return components
    })

module.exports = readComponents
