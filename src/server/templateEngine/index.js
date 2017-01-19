'use strict'

const Templates = require( '../../templates' )

const templateEngineMiddleware = ( req, res, next ) => {
  if( typeof res.template === 'function' )
    return next()

  const { dependencies } = req
  const renderTemplate = Templates( dependencies )

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
