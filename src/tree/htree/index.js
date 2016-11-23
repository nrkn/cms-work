'use strict'

const Mtree = require( 'tree/mtree' )

const createTree = require( 'tree/htree/plugins/createTree' )
const insertBefore = require( 'tree/htree/plugins/insertBefore' )
const dom = require( 'tree/htree/plugins/dom' )
const parse = require( 'tree/htree/plugins/parse' )
const select = require( 'tree/htree/plugins/select' )
const stringify = require( 'tree/htree/plugins/stringify' )
const types = require( 'tree/htree/plugins/types' )

const Htree = Mtree( dom, parse, select, stringify, types )

// add afterwards because the original createTree doesn't exist until now
Htree.plugin( createTree )
// add afterwards so that it wraps parentMap and not the other way round
Htree.plugin( insertBefore )

module.exports = Htree
