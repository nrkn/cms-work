const tv4 = require( 'tv4' )
const T = require( 'mtype' )
const schema = require( 'tree/htree/schema' )

const validator = tv4.freshApi()

const schemaNames = Object.keys( schema )
const schemas = schemaNames.map( name => schema[ name ] )

schemas.forEach( schema => validator.addSchema( schema ) )

const is = schemaNames.reduce( ( map, name ) => {
  map[ name ] = obj => validator.validate( obj, name )

  return map
}, {} )

const capitalizeFirstLetter = str =>
  str.charAt( 0 ).toUpperCase() + str.slice( 1 )

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
  const plugins = { isType }

  nodeTypes.forEach( typename => {
    const fname = 'is' + capitalizeFirstLetter( typename )

    plugins[ fname ] = node => fn.isType( node, typename )

    plugins[ fname ].def = isType.def
  })

  return Object.assign( fn, plugins )
}

module.exports = types
