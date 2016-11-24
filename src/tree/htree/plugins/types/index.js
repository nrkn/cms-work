'use strict'

const tv4 = require( 'tv4' )
const T = require( 'mtype' )
const schema = require( 'tree/htree/schema' )
const utils = require( 'utils' )

const { capitalizeFirstLetter } = utils

const validator = tv4.freshApi()

const schemaNames = Object.keys( schema )
const schemas = schemaNames.map( name => schema[ name ] )

schemas.forEach( schema => validator.addSchema( schema ) )

const is = schemaNames.reduce( ( map, name ) => {
  map[ name ] = obj => validator.validate( obj, name )

  return map
}, {} )

// could get this from the names, but better to be explicit
const nodeTypes = [
  'text', 'element', 'comment', 'document', 'documentType', 'documentFragment'
]

const t = T( is )

const isType = ( node, typename ) => t.is( node, typename )

isType.def = {
  argTypes: [ 'node', 'string' ],
  returnType: 'boolean',
  requires: [],
  categories: [ 'type', 'plugin' ]
}

const types = fn => {
  const assertType = ( node, typename ) => {
    if( !fn.isType( node, typename ) )
      throw new TypeError( `Expected node to be ${ typename }` )
  }

  assertType.def = {
    argTypes: [ 'node', 'string' ],
    requires: [ 'isType' ],
    categories: [ 'type', 'plugin' ]
  }

  const plugins = { isType, assertType }

  // add isDocument, isText etc
  nodeTypes.forEach( typename => {
    const capTypename = capitalizeFirstLetter( typename )
    const isName = 'is' + capTypename
    const assertName = 'assert' + capTypename

    plugins[ isName ] = node => fn.isType( node, typename )
    plugins[ isName ].def = isType.def

    plugins[ assertName ] = node => fn.assertType( node, typename )
    plugins[ assertName ].def = assertType.def
  })

  return Object.assign( fn, plugins )
}

module.exports = types
