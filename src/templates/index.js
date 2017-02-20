'use strict'

const Templating = require( 'mojule-templating' )
const Validator = require( 'mtype-tv4' )
const componentTransformMapper = require( '../components/componentTransformMapper' )
const ensureModel = require( '../schema/ensureModel' )

const Templates = dependencies => {
  const { components, templates, defaultModels, schemas, configs } = dependencies

  const templating = Templating( templates )
  const validator = Validator( schemas )

  const resolveTemplateName = name => {
    if( templates[ name ] ) return name

    const config = configs[ name ]

    if( config && config.inherit )
      return resolveTemplateName( config.inherit )

    throw new Error( `Could not resolve template name for ${ name }` )
  }

  const renderComponent = ( name, model ) => {
    const templateModel = Object.assign( {}, defaultModels[ name ] || {}, model )

    ensureModel( validator, templateModel, name )

    const viewModel = componentTransformMapper( dependencies, name, templateModel )

    name = resolveTemplateName( name )

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
