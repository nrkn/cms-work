'use strict'

const ensureModel = ( validator, model, name ) => {
  const schemaNames = validator.getSchemaUris()

  if( !schemaNames.includes( name ) ) return

  const result = validator.validateMultiple( model, name )

  if( result.valid ) return

  const message = `Template model validation failed for ${ name }: ${ JSON.stringify( result.errors ) }`
  throw new Error( message )
}

module.exports = ensureModel
