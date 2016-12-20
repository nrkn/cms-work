'use strict'

const cms = require( './src/server' )

cms
  .start()
  .catch( console.error )
