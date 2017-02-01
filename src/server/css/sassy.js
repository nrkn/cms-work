'use strict'

const sass = require( 'node-sass' )
const cacheTransform = require( '../cache/cacheTransform' )

const transform = scss =>
  sass.renderSync({ data: scss }).css.toString()

const sassy = scss =>
  cacheTransform( scss, transform, '.css' )

module.exports = sassy
