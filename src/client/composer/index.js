'use strict'

const IdMap = require( './idmap' )
const Drake = require( './drake' )
const Find = require( './find' )

const Composer = ( deps, state ) => {
  const { dragula, morphdom, document, renderNode } = deps
  const { tree, options } = state

  const idMap = IdMap( tree )
  const find = Find( idMap )

  const composerView = document.querySelector( options.selector )

  const initialDom = renderNode( tree )

  morphdom( composerView, initialDom.stringify() )

  composerView.addEventListener( 'click', e => {
    const el = e.target

    if( el.matches( '.composer-node__toolbar' ) ){
      el.parentNode.classList.toggle( 'collapsed' )

      const isCollapsed = el.parentNode.matches( '.collapsed' )
      const isNode = el.parentNode.matches( '.composer-node' )

      const node = isNode ?
        idMap.findById( el.parentNode.id ) :
        find.containerElNode( el.parentNode )

      const key = isNode ? 'isCollapsed' : 'isChildrenCollapsed'

      toggle( node, key, isCollapsed )
    } else if( el.matches( '.composer-node__delete' ) ){
      const shouldDelete = window.confirm( 'Are you sure?' )

      if( !shouldDelete ) return

      const id = el.parentNode.parentNode.id

      const node = idMap.findById( id )
      const parentNode = node.getParent()

      node.remove()

      const parentEl = document.getElementById( parentNode.id() )
      const depth = parentEl.dataset.depth * 1

      const nodeDom = renderNode( parentNode, { depth } )
      const html = nodeDom.stringify()

      updateView( parentEl, html )
    }
  })

  const updateView = ( el, html ) => {
    const template = document.createElement( 'template' )
    template.innerHTML = html

    const newEl = template.content.querySelector( '.composer-node' )

    const result = morphdom( el, newEl )
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

    updateView( nodeEl, newElHtml )
  }

  let dropHandler

  const ondrop = ( ...args ) => {
    if( dropHandler ) dropHandler( ...args )

    console.log( '\n\n\n' )

    tree.walk( ( current, parent, depth ) => {
      const indent = '  '.repeat( depth )
      const value = current.value()
      const name = value.name || value.type

      console.log( indent + name + '#' + current.id() )
    })
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
    dropHandler: handler => dropHandler = handler
  }

  return api
}

module.exports = Composer
