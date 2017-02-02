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

const progressContainerEl = document.querySelector( '.composer__progress' )
const progressEl = progressContainerEl.querySelector( 'progress' )
const modalEl = document.querySelector( '.composer__modal' )

const bigTask = ( items, fn ) => {
  const max = items.length
  let current = 0

  modalEl.classList.remove( 'composer__modal--hidden' )

  progressContainerEl.classList.remove( 'composer__progress--hidden' )
  progressEl.setAttribute( 'max', max )
  progressEl.setAttribute( 'value', current )

  items = items.slice()

  const next = () => {
    if( items.length === 0 ){
      modalEl.classList.add( 'composer__modal--hidden' )
      progressContainerEl.classList.add( 'composer__progress--hidden' )

      return
    }

    const item = items.shift()

    fn( item )
    current++
    progressEl.setAttribute( 'value', current )
    progressEl.innerHTML = `${ current } / ${ max }`

    window.setTimeout( next, 0 )
  }

  next()
}

/*
  TODO

  * the expand/collapse children actions should be disabled if that action is
    not possible or necessary
  * the tree or options or something should be able to override the actions
    eg not all nodes may have all actions

*/
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

  composerView.innerHTML = initialDom.stringify()

  /*
   TODO the functions should take the actual el node, not the clicked node, any
   logic inside the various fns below for finding the el node should be moved
   here
  */
  const clickHandler = {
    '.composer-node__title, .composer-node__action > i':
      el => el.parentNode,

    '.composer-node__toolbar': el => {
      toggleEl( el )
    },

    '.composer-node__delete': el => {
      const shouldDelete = window.confirm( 'Are you sure?' )

      if( shouldDelete )
        removeEl( el )
    },

    '.composer-node__collapse-children': el => {
      collapseElChildren( el )
    },

    '.composer-node__expand-children': el => {
      expandElChildren( el )
    }
  }

  const clickSelectors = Object.keys( clickHandler )

  const handleClick = el => {
    const selector = clickSelectors.find( sel => el.matches( sel ) )

    if( selector ){
      el = clickHandler[ selector ]( el )
    }

    if( el )
      handleClick( el )

    return false
  }

  composerView.addEventListener( 'click', e => {
    return handleClick( e.target )
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
    updateNode( node )
  }

  const collapseElChildren = el => {
    const containerElNode = find.containerElNode( el )
    const children = containerElNode.getChildren().slice()

    bigTask( children, node => {
      toggle( node, 'isCollapsed', true )
      updateNode( node )
    })
  }

  const expandElChildren = el => {
    const containerElNode = find.containerElNode( el )
    const children = containerElNode.getChildren().slice()

    bigTask( children, node => {
      toggle( node, 'isCollapsed', false )
      updateNode( node )
    })
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

  const toggle = ( node, key, isCollapsed ) => {
    node.meta( key, isCollapsed )
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
