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

  if( !view ) return

  const dom = renderNode( tree )

  view.innerHTML = dom.stringify()

  /*
   TODO the functions should take the actual el node, not the clicked node, any
   logic inside the various fns below for finding the el node should be moved
   here
  */
  const clickHandler = {
  }

  const clickSelectors = Object.keys( clickHandler )

  const handleClick = el => {
    const selector = clickSelectors.find( sel => el.matches( sel ) )

    if( selector ){
      clickHandler[ selector ]( el )
      return false
    }
  }

  view.addEventListener( 'click', e => {
    return handleClick( e.target )
  })

  const api = {
    remove: () => view.innerHTML = '',
    tree: () => tree,
    idMap: () => idMap
  }

  return api
}

module.exports = Toolbar
