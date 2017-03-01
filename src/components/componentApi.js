'use strict'

const Tree = require( '1tree' )
const Validator = require( 'mtype-tv4' )
const utils = require( 'mojule-utils' )
const ensureModel = require( '../schema/ensureModel' )

const { hyphenatedToCamelCase } = utils

const ComponentApi = dependencies => {
  const { componentNames, schemas, configs } = dependencies
  const validator = Validator( schemas )
  const api = {}

  componentNames.forEach( name => {
    const config = configs[ name ]

    if( config && config.isAbstract )
      return

    const apiName = hyphenatedToCamelCase( name, true )

    const factory = ( model, children ) => {
      if( Array.isArray( model ) ){
        children = model
        model = {}
      }

      ensureModel( validator, model, name )

      const value = {
        name, model
      }

      const node = Tree( { value, children: [] } )

      if( Array.isArray( children ) )
        children.forEach( child => node.append( child ) )

      return node
    }

    api[ apiName ] = factory
  })

  return api
}

module.exports = ComponentApi
