'use strict'

const enforceType = ( obj, name, typeName ) => {
  if( typeof obj !== typeName )
    throw new Error( `A ${ name } ${ typeName } is required` )
}

module.exports = enforceType
