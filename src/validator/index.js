'use strict'

const tv4 = require( 'tv4' )
const T = require( 'mtype' )

const Validator = schema => {
  const validator = tv4.freshApi()

  const schemas = Object.keys( schema ).map( name => schema[ name ] )

  schemas.forEach( schema => validator.addSchema( schema ) )

  return validator
}

Validator.mtype = validator => {
  const schemaNames = validator.getSchemaUris()

  const is = schemaNames.reduce( ( map, name ) => {
    map[ name ] = obj => validator.validate( obj, name )

    return map
  }, {} )

  return T( is )
}

module.exports = Validator
