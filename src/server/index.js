'use strict'

const express = require( 'express' )

const app = express()

const start = resolve => {
  app.use( express.static( './static/files' ) )
  app.use( express.static( './dist' ) )

  // routing

  app.listen( 3000, () => {
    console.log( 'CMS started' )

    resolve()
  })
}

const cms = {
  start: () => new Promise( start )
}

module.exports = cms
