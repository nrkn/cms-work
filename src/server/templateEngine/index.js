'use strict'

const Templates = require( '../../templates' )
const components = require( '../../../dist/data/components.json' )

const renderTemplate = Templates( components )

const templateEngineMiddleware = ( req, res, next ) => {
  res.template = ( name, model ) => {
    renderTemplate( name, model, ( err, dom ) => {
      if( err ) throw err

      const html = dom.stringify()

      res.send( html )
    })
  }

  next()
}

module.exports = templateEngineMiddleware
