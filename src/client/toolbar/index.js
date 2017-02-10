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

  /*
   TODO the functions should take the actual el node, not the clicked node, any
   logic inside the various fns below for finding the el node should be moved
   here
  */
  const clickHandler = {
    '.toolbar-group > header > span': el => {
      toggleEl( el.parentNode )
    },
    '.toolbar-group > header': el => {
      toggleEl( el )
    }
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

  const toggleEl = el => {
    const groupEl = el.closest( '.toolbar-group' )

    if( !groupEl.matches( '.toolbar-group--collapsed' ))
      return

    const depth = groupEl.dataset.depth
    const parentGroup = groupEl.parentNode.closest( '.toolbar-group' )

    const siblings = Array.from(
      parentGroup.querySelectorAll( `.toolbar-group[data-depth="${depth}"]` )
    ).filter( sibling => sibling !== groupEl )

    siblings.forEach( sibling => {
      sibling.classList.add( 'toolbar-group--collapsed' )
    })

    groupEl.classList.remove( 'toolbar-group--collapsed' )
  }

  const api = {
    remove: () => view.innerHTML = '',
    tree: () => tree,
    idMap: () => idMap
  }

  return api
}

module.exports = Toolbar
