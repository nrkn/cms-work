'use strict'

const Mtree = require( 'mtree' )

const createTree = require( 'htree/plugins/createTree' )
const insertBefore = require( 'htree/plugins/insertBefore' )
const dom = require( 'htree/plugins/dom' )
const parse = require( 'htree/plugins/parse' )
const select = require( 'htree/plugins/select' )
const stringify = require( 'htree/plugins/stringify' )
const types = require( 'htree/plugins/types' )

const Htree = Mtree( dom, parse, select, stringify, types, insertBefore )

// add afterwards because the original createTree doesn't exist until now
Htree.plugin( createTree )

module.exports = Htree
