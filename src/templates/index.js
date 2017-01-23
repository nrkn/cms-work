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

  const renderComponent = ( name, model ) => {
    const templateModel = Object.assign( {}, defaultModels[ name ] || {}, model )

    ensureModel( validator, templateModel, name )

    const viewModel = componentTransformMapper( dependencies, name, templateModel )

    return templating( name, viewModel )
  }

  //TODO I believe that this doesn't need to use callbacks anymore
  const renderTemplate = ( name, model, callback ) => {
    try {
      const documentModel = Object.assign( {}, defaultModels.document, model )

      if( name !== 'document' ){
        const body = renderComponent( name, model ).stringify()

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

  return { renderTemplate, renderComponent }
}

module.exports = Templates
