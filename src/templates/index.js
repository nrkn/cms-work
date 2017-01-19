'use strict'

const Templating = require( 'mojule-templating' )
const Validator = require( 'mtype-tv4' )
const componentTransformMapper = require( '../components/componentTransformMapper' )

const ensureModel = ( validator, model, name ) => {
  const schemaNames = validator.getSchemaUris()

  if( !schemaNames.includes( name ) ) return

  const result = validator.validateMultiple( model, name )

  if( result.valid ) return

  const message = `Template model validation failed for ${ name }: ${ JSON.stringify( result.errors ) }`
  throw new Error( message )
}

const Templates = dependencies => {
  const { components, templates, defaultModels, schemas } = dependencies

  const templating = Templating( templates )
  const validator = Validator( schemas )

  const renderTemplate = ( name, model, callback ) => {
    try {
      const documentModel = Object.assign( {}, defaultModels.document, model )

      if( name !== 'document' ){
        const templateModel = Object.assign( {}, defaultModels[ name ] || {}, model )

        ensureModel( validator, templateModel, name )

        const viewModel = componentTransformMapper( dependencies, name, templateModel )

        const body = templating( name, viewModel ).stringify()
        Object.assign( documentModel, { body } )
      }

      ensureModel( validator, documentModel, 'document' )

      const viewModel = componentTransformMapper( dependencies, 'document', documentModel )

      const dom = templating( 'document', viewModel )

      callback( null, dom )
    } catch( e ){
      callback( e )
    }
  }

  return renderTemplate
}

module.exports = Templates
