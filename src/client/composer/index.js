'use strict'

const dragula = require( 'dragula' )
const morphdom = require( 'morphdom' )
const IdMap = require( '../idmap' )
const enforceType = require( '../enforceType' )
const queueTasks = require( '../queueTasks' )
const Drake = require( './drake' )
const Find = require( './find' )

const defaultOptions = {
  document: typeof window === 'undefined' ? null : window.document,
  dragula,
  morphdom,
  selector: '.composer'
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

  enforceType( document, 'document', 'object' )
  enforceType( renderNode, 'renderNode', 'function' )
  enforceType( selector, 'selector', 'string' )

  const idMap = IdMap( tree )
  const find = Find( idMap )

  const composerView = document.querySelector( selector )

  if( !composerView ) return

  const initialDom = renderNode( tree )

  composerView.innerHTML = initialDom.stringify()

  /*
   TODO the functions should take the actual el node, not the clicked node, any
   logic inside the various fns below for finding the el node should be moved
   here
  */
  const clickHandler = {
    // do nothing
    '.button--disabled': () => {},

    '.header-bar, .header-bar__title': el => {
      toggleEl( el )
    },

    '[data-action="delete"]': el => {
      const shouldDelete = window.confirm( 'Are you sure?' )

      if( shouldDelete )
        removeEl( el )
    },

    '[data-action="collapse-all"]': el => {
      collapseElChildren( el )
    },

    '[data-action="expand-all"]': el => {
      expandElChildren( el )
    }
  }

  const clickSelectors = Object.keys( clickHandler )

  const handleClick = el => {
    const selector = clickSelectors.find( sel => el.matches( sel ) )

    if( selector ){
      clickHandler[ selector ]( el )
    }

    return false
  }

  composerView.addEventListener( 'click', e => {
    return handleClick( e.target )
  })

  const toggleEl = el => {
    const containerNode = el.closest( '.composer-node, .composer-node__children' )

    const isNode = containerNode.matches( '.composer-node' )
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

    queueTasks( children, node => {
      toggle( node, 'isCollapsed', true )
      updateNode( node )
    })
  }

  const expandElChildren = el => {
    const containerElNode = find.containerElNode( el )
    const children = containerElNode.getChildren().slice()

    queueTasks( children, node => {
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
