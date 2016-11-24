'use strict'

const Validator = require( 'validator' )
const schema = require( 'tree/htree/schema' )
const utils = require( 'utils' )

const { capitalizeFirstLetter } = utils

// could get this from the names, but better to be explicit
const nodeTypes = [
  'text', 'element', 'comment', 'document', 'documentType', 'documentFragment'
]

const validator = Validator( schema )
const t = Validator.mtype( validator )

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
