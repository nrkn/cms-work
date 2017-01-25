'use strict'

const express = require( 'express' )
const templateEngine = require( './templateEngine' )
const getDependencies = require( './fileSystem/getDependencies' )
const app = express()

const initApp = ( dependencies, resolve ) => {
  app.use( express.static( './static/files' ) )
  app.use( express.static( './dist' ) )

  //not sure about this, look into it
  app.use( ( req, res, next ) => {
    req.dependencies = dependencies
    next()
  })
  app.dependencies = dependencies

  app.use( templateEngine )

  // routing
  app.get( '/', ( req, res ) => {
    const Tree = require( '1tree' )

    const documentValue = {
      name: 'document',
      model: {
        documentTitle: 'Cool Story Bro!',
        "headStyles": [
          {
            "src": "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          }
        ],
        "scripts": [
          {
            "src": "/client/index.js"
          }
        ]
      }
    }

    const documentNode = Tree.createRoot( documentValue )

    const composerValue = { name: 'composer' }
    const composerNode = documentNode.createNode( composerValue )

    documentNode.append( composerNode )

    res.component( documentNode )
  })

  app.listen( 3000, () => {
    console.log( 'CMS started' )

    resolve()
  })
}

const start = resolve =>
  getDependencies( './data' )
    .then( dependencies =>
      initApp( dependencies, resolve )
    )

const cms = {
  start: () => new Promise( start )
}

module.exports = cms
