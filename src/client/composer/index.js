'use strict'

const dragula = require( 'dragula' )
const morphdom = require( 'morphdom' )
const IdMap = require( './idmap' )
const Drake = require( './drake' )
const Find = require( './find' )

const defaultOptions = {
  document: typeof window === 'undefined' ? null : window.document,
  dragula,
  morphdom,
  selector: '.composer'
}

const validateObj = ( obj, name, typeName ) => {
  if( typeof obj !== typeName )
    throw new Error( `A ${ name } ${ typeName } is required` )
}

const Composer = ( tree, renderNode, options ) => {
  options = Object.assign( {}, defaultOptions, options )

  const { document, dragula, morphdom, selector } = options

  validateObj( document, 'document', 'object' )
  validateObj( renderNode, 'renderNode', 'function' )
  validateObj( selector, 'selector', 'string' )

  const idMap = IdMap( tree )
  const find = Find( idMap )

  const composerView = document.querySelector( selector )

  const initialDom = renderNode( tree )

  morphdom( composerView, initialDom.stringify() )

  composerView.addEventListener( 'click', e => {
    let el = e.target

    if( el.matches( '.composer-node__title, .composer-node__delete > i' ) )
      el = el.parentNode

    if( el.matches( '.composer-node__toolbar' ) ){
      toggleEl( el )
    } else if( el.matches( '.composer-node__delete' ) ){
      const shouldDelete = window.confirm( 'Are you sure?' )

      if( !shouldDelete ) return

      removeEl( el )
    }
  })

  const toggleEl = el => {
    const isNode = el.parentNode.matches( '.composer-node' )
    const key = isNode ? 'isCollapsed' : 'isChildrenCollapsed'
    const collapsedClass = isNode ? 'composer-node--collapsed' : 'composer-node__children--collapsed'

    el.parentNode.classList.toggle( collapsedClass )

    const node = isNode ?
      idMap.findById( el.parentNode.id ) :
      find.containerElNode( el.parentNode )

    const isCollapsed = el.parentNode.matches( '.composer-node--collapsed, .composer-node__children--collapsed' )

    toggle( node, key, isCollapsed )
  }

  const removeEl = el => {
    const nodeEl = el.closest( '.composer-node' )
    const id = nodeEl.id
    const node = idMap.findById( id )
    const parentNode = node.getParent()

    node.remove()
    /*
      It may seem as though by just removing the node, the parentNode will be
      regenerated correctly, however this is not the case sometimes, like when
      the node is the first child of the element. Not sure if problem with
      morphdom or if I've made some mistaken assumption somewhere, but in any
      case also removing the node's element representation from the DOM ensures
      that this works correctly. Not removing the DOM node and calling
      updateNode twice also works - go figure :/
    */
    nodeEl.remove()

    updateNode( parentNode )
  }

  const updateNode = node => {
    const nodeEl = document.getElementById( node.id() )
    const parentNode = node.getParent()

    let depth = 0
    let parentEl

    if( parentNode ){
      parentEl = document.getElementById( parentNode.id() )
      depth = parentEl.dataset.depth * 1 + 1
    }

    const newElDom = renderNode( node, { depth } )
    const newElHtml = newElDom.stringify()

    morphdom( nodeEl, newElHtml )
  }

  let dropHandler

  const ondrop = ( ...args ) => {
    if( dropHandler ) dropHandler( ...args )
  }

  const drakeDeps = { dragula, updateNode, find, ondrop }

  const drake = Drake( drakeDeps )

  const toggle = ( node, key, isCollapsed ) => {
    node.meta( key, isCollapsed )

    if( !isCollapsed )
      updateNode( node )
  }

  const api = {
    remove: () => composerView.innerHTML = '',
    tree: () => tree,
    idMap: () => idMap,
    dropHandler: handler => {
      if( typeof handler === 'function' )
        dropHandler = handler

      return dropHandler
    }
  }

  return api
}

module.exports = Composer
