const attributes = require( './attributes' )
const create = require( './create' )

const dom = fn => {
  attributes( fn )
  create( fn )
}

module.exports = dom
