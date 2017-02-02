'use strict'

const morphdom = require( 'morphdom' )
const IdMap = require( '../idmap' )
const enforceType = require( '../enforceType' )

const defaultOptions = {
  document: typeof window === 'undefined' ? null : window.document,
  morphdom,
  selector: '.toolbar'
}

const Toolbar = ( tree, renderNode, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const { document, morphdom, selector } = options

  enforceType( document, 'document', 'object' )
  enforceType( renderNode, 'renderNode', 'function' )
  enforceType( selector, 'selector', 'string' )

  const idMap = IdMap( tree )
  const view = document.querySelector( selector )
  const dom = renderNode( tree )

  view.innerHTML = dom.stringify()

  //events here

  const api = {
    remove: () => view.innerHTML = '',
    tree: () => tree,
    idMap: () => idMap
  }

  return api
}

module.exports = Toolbar
