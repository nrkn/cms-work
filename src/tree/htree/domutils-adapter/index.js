'use strict'

const stringify = require( 'tree/htree/stringify' )

const Adapter = ( fn, root ) => {
  const isTag = node => {
    const value = fn.value( node )

    return value && value.nodeType === 'element'
  }

  const getChildren = node => fn.getChildren( node )

  const getParent = node => fn.getParent( fn, root, node )

  const getSiblings = node => {
    const parent = getParent( node )

    if( parent ) return getChildren( node )

    return [ node ]
  }

  const getAttributeValue = ( node, name ) => {
    const value = fn.value( node )

    if( value.attributes ) return value.attributes[ name ]
  }

  const hasAttrib = ( node, name ) =>
    getAttributeValue( node, name ) !== undefined

  const getName = node => {
    const value = fn.value( node )

    if( value ) return value.tagName
  }

  const removeElement = node => fn.remove( fn, root, node )

  const replaceElement = ( node, replacement ) => {
    const parent = getParent( node )

    if( parent ) fn.replaceChild( fn, root, parent, node, replacement )
  }

  const appendChild = ( node, child ) => fn.append( fn, root, node, child )

  // confusing because argument order is different to ours
  const append = ( node, newNode ) => {
    const parent = getParent()

    return fn.insertAfter( fn, root, parent, newNode, node  )
  }

  const prepend = ( node, newNode ) => {
    const parent = getParent()

    return fn.insertBefore( fn, root, parent, newNode, node )
  }

  const filter = ( test, element, recurse, limit ) => {
    if( !Array.isArray( element ) ) element = [ element ]

    if( typeof limit !== "number" || !isFinite( limit ) ){
      limit = Infinity
    }

    return find( test, element, recurse !== false, limit )
  }

  const find = ( test, elems, recurse, limit ) => {
    let result = [], childs

    for( var i = 0, j = elems.length; i < j; i++ ){
      if( test( elems[ i ] ) ){
        result.push( elems[ i ] )
        if( --limit <= 0 ) break
      }

      childs = getChildren( elems[ i ] )
      if( recurse && childs && childs.length > 0 ){
        childs = find( test, childs, recurse, limit )
        result = result.concat( childs )
        limit -= childs.length
        if( limit <= 0 ) break
      }
    }

    return result
  }

  const findOneChild = ( test, elems ) => elems.find( test )

  const findOne = ( test, elems ) =>
    elems.find( elem => fn.find( fn, elem, test ) )

  const existsOne = ( test, elems ) => findOne( test, elems ) !== undefined

  const findAll = ( test, elems ) =>
    elems.reduce(
      ( found, elem ) => found.concat( fn.findAll( fn, elem, test ) ),
      []
    )

  const getText = node => {
    if( Array.isArray( node ) ) return node.map( getText ).join( '' )

    if( isTag( node ) ) return getText( getChildren( node ) )

    const value = fn.value( node )

    if( value && value.nodeType === 'text' ) return value.nodeValue

    return ''
  }

  const getOuterHTML = node => stringify( node )

  const getInnerHTML = node =>
    getChildren( node ).map( getOuterHTML ).join( '' )

  const removeSubsets = nodes => {
    let idx = nodes.length, node, ancestor, replace

    // Check if each node (or one of its ancestors) is already contained in the
    // array.
    while(--idx > -1) {
      node = ancestor = nodes[ idx ]

      // Temporarily remove the node under consideration
      nodes[ idx ] = null
      replace = true

      while( ancestor ){
        if( nodes.indexOf( ancestor ) > -1 ){
          replace = false
          nodes.splice( idx, 1 )
          break
        }

        ancestor = getParent( ancestor )
      }

      // If the node has been found to be unique, re-insert it.
      if( replace ){
        nodes[idx] = node
      }
    }

    return nodes
  }
}
