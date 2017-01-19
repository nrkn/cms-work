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
    const model = {
      preview: '<strong>Test</strong> Preview',
      title: 'cool title bro',
      isChildrenCollapsed: true,
      children: [
        {
          "id": "child1",
          "title": "child 1 title",
          "treeType": "treeType1",
          "nodeType": "nodeType1",
          "depth": 0,
          "isEmpty": true,
          "isCollapsed": true,
          children: [

          ]
        },
        {
          "id": "child2",
          "title": "child 2 title",
          "treeType": "treeType2",
          "nodeType": "nodeType2",
          "depth": 1,
          "isEmpty": true,
          "isCollapsed": true
        }
      ]
    }

    res.template( 'composer-main', model )
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
