'use strict'

const Templating = require( 'mojule-templating' )

const extractTemplates = components => {
  const templates = {}
  const componentNames = Object.keys( components )

  componentNames.forEach( name => {
    const component = components[ name ]

    if( !component.template ) return

    templates[ name ] = component.template
  })

  return templates
}

const extractDefaultModels = components => {
  const models = {}
  const componentNames = Object.keys( components )

  componentNames.forEach( name => {
    const component = components[ name ]

    if( !component.defaultModel ) return

    models[ name ] = component.defaultModel
  })

  return models
}

const Templates = components => {
  const templates = extractTemplates( components )
  const defaultModels = extractDefaultModels( components )

  const templating = Templating( templates )

  const renderTemplate = ( name, model, callback ) => {
    try {
      const documentModel = Object.assign( {}, defaultModels.document, model )

      if( name !== 'document' ){
        const templateModel = Object.assign( {}, defaultModels[ name ] || {}, model )
        const body = templating( name, templateModel ).stringify()
        Object.assign( documentModel, { body } )
      }

      const dom = templating( 'document', documentModel )

      return callback( null, dom )
    } catch( e ){
      return callback( e )
    }
  }

  return renderTemplate
}

module.exports = Templates
