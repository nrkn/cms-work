'use strict'

const express = require( 'express' )
const templateEngine = require( './templateEngine' )
const getDependencies = require( './fileSystem/getDependencies' )
const app = express()

const initApp = ( dependencies, resolve ) => {
  app.use( express.static( './static/files' ) )
  app.use( express.static( './dist' ) )

  //not sure about this, look into it
  app.use(( req, res, next ) => {
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

    const rowValue = {
      name: 'row'
    }
    const rowNode = documentNode.createNode( rowValue )
    documentNode.append( rowNode )

    const radio1Value = {
      name: 'input-radio-icon',
      model: {
        name: 'menu',
        title: 'File',
        iconName: 'fa-file'
      }
    }
    const radio1Node = documentNode.createNode( radio1Value )
    rowNode.append( radio1Node )

    const radio2Value = {
      name: 'input-radio-icon',
      model: {
        name: 'menu',
        title: 'Open',
        iconName: 'fa-folder',
        isSelected: true
      }
    }
    const radio2Node = documentNode.createNode( radio2Value )
    rowNode.append( radio2Node )

    const radio3Value = {
      name: 'input-radio-icon',
      model: {
        name: 'menu',
        title: 'Save',
        iconName: 'fa-floppy-o'
      }
    }
    const radio3Node = documentNode.createNode( radio3Value )
    rowNode.append( radio3Node )

    const radio4Value = {
      name: 'input-radio-icon',
      model: {
        name: 'menu',
        title: 'Long name that should get cut off',
        iconName: 'fa-floppy-o'
      }
    }
    const radio4Node = documentNode.createNode( radio4Value )
    rowNode.append( radio4Node )

    /*
    const buttonTextValue = {
      name: 'button-text',
      model: {
        title: 'New File',
        action: 'new'
      }
    }
    const buttonTextNode = documentNode.createNode( buttonTextValue )
    documentNode.append( buttonTextNode )

    const headerBarValue = {
      name: 'header-bar',
      model: {
        title: 'Hello world',
        actions: [
          {
            action: "collapse-all",
            iconName: "fa-minus-square"
          },
          {
            action: "expand-all",
            iconName: "fa-plus-square"
          }
        ],
        classes: [ 'test1', 'test2' ]
      }
    }

    const headerBarNode = documentNode.createNode( headerBarValue )
    documentNode.append( headerBarNode )

    const toolbarValue = { name: 'toolbar' }
    const toolbarNode = documentNode.createNode( toolbarValue )
    documentNode.append( toolbarNode )

    const composerValue = { name: 'composer' }
    const composerNode = documentNode.createNode( composerValue )
    documentNode.append( composerNode )
    */

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
