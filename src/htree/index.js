'use strict'

const parse = require( 'htree/parse' )
const stringify = require( 'htree/stringify' )

const Htree = () => {
  const htree = {
    parse, stringify
  }

  return htree
}

module.exports = Htree
