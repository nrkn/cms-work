'use strict'

const express = require( 'express' )
const templateEngine = require( './templateEngine' )

const app = express()

const start = resolve => {
  app.use( express.static( './static/files' ) )
  app.use( express.static( './dist' ) )
  app.use( templateEngine )

  // routing
  app.get( '/', ( req, res ) => {
    res.template( 'testview', { message: 'Hello, world!', title: 'Test View' } )
  })

  app.listen( 3000, () => {
    console.log( 'CMS started' )

    resolve()
  })
}

const cms = {
  start: () => new Promise( start )
}

module.exports = cms
