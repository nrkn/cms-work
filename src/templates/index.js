'use strict'

const Templating = require( 'mojule-templating' )
const validator = require( '../validator' )

const extractFromComponents = ( components, propertyName ) => {
  const extracted = {}
  const componentNames = Object.keys( components )

  componentNames.forEach( name => {
    const component = components[ name ]

    if( !component[ propertyName ] ) return

    extracted[ name ] = component[ propertyName ]
  })

  return extracted
}

const ensureModel = ( model, name ) => {
  const schemaNames = validator.getSchemaUris()

  if( !schemaNames.includes( name ) ) return

  const result = validator.validateMultiple( model, name )

  if( result.valid ) return

  const message = `Template model validation failed for ${ name }: ${ JSON.stringify( result.errors ) }`
  throw new Error( message )
}

const Templates = components => {
  const templates = extractFromComponents( components, 'template' )
  const defaultModels = extractFromComponents( components, 'defaultModel' )

  const templating = Templating( templates )

  const renderTemplate = ( name, model, callback ) => {
    try {
      const documentModel = Object.assign( {}, defaultModels.document, model )

      if( name !== 'document' ){
        const templateModel = Object.assign( {}, defaultModels[ name ] || {}, model )

        ensureModel( templateModel, name )

        const body = templating( name, templateModel ).stringify()
        Object.assign( documentModel, { body } )
      }

      ensureModel( documentModel, 'document' )

      const dom = templating( 'document', documentModel )

      callback( null, dom )
    } catch( e ){
      callback( e )
    }
  }

  return renderTemplate
}

module.exports = Templates
