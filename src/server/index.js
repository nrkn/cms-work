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
    const treeToComposerTree = require( '../composer-tree/defaultTreeToComposerTree' )
    const fsTreeRaw = req.dependencies.datas[ 'data-small' ]
    const fsTree = Tree( fsTreeRaw )

    const fsComposerTree = treeToComposerTree( fsTree )

    const documentValue = {
      name: 'document',
      model: {
        documentTitle: 'Cool Story Bro!'
      }
    }

    const documentNode = Tree.createRoot( documentValue )

    //documentNode.append( fsComposerTree )

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
