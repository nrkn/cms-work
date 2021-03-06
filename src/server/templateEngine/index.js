'use strict'

const sassy = require( '../css/sassy' )
const Templates = require( '../../templates' )
const RenderComponent = require( '../../components/component-tree/renderNode' )

const templateEngineMiddleware = ( req, res, next ) => {
  if( typeof res.template === 'function' && typeof res.component === 'function' )
    return next()

  const { dependencies } = req

  dependencies.transformCss = sassy

  const templates = Templates( dependencies )
  const renderComponent = RenderComponent( dependencies )

  const { renderTemplate } = templates

  res.template = ( name, model ) => {
    renderTemplate( name, model, ( err, dom ) => {
      if( err ) throw err

      const html = dom.stringify()

      res.send( html )
    })
  }

  res.component = node => {
    const dom = renderComponent( node )
    const html = dom.stringify()

    res.send( html )
  }

  next()
}

module.exports = templateEngineMiddleware
