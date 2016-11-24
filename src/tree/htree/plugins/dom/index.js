'use strict'

const element = require( './element' )
const create = require( './create' )
const clone = require( './clone' )
const node = require( './node' )

const dom = fn => {
  element( fn )
  create( fn )
  clone( fn )
  node( fn )
}

module.exports = dom
