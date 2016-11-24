'use strict'

const element = require( './element' )
const create = require( './create' )
const clone = require( './clone' )

const dom = fn => {
  element( fn )
  create( fn )
  clone( fn )
}

module.exports = dom
