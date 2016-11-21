'use strict'

const attributes = fn => {
  const attr = ( node, name, value ) => {
    const nodeValue = fn.value( node )

    if( typeof name === 'object' ){
      nodeValue.attributes = name

      fn.value( node, nodeValue )

      return node
    }

    if( value !== undefined ){
      if( nodeValue.attributes === undefined ) nodeValue.attributes = {}

      nodeValue.attributes[ name ] = value

      fn.value( node, nodeValue )
    }

    if( typeof nodeValue.attributes === 'object' )
      return nodeValue.attributes[ name ]
  }

  attr.def = {
    argTypes: [ 'node', 'string', 'string' ],
    returnType: 'string',
    requires: [ 'value' ],
    categories: [ 'dom', 'attr', 'plugins' ]
  }

  const hasAttr = ( node, name ) => fn.attr( node, name ) !== undefined

  hasAttr.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'boolean',
    requires: [ 'value' ],
    categories: [ 'dom', 'hasAttr', 'plugins' ]
  }

  const classNames = node => {
    const classNames = fn.attr( node, 'class' )

    if( typeof classNames === 'string' ) return classNames.split( ' ' )

    return []
  }

  classNames.def = {
    argTypes: [ 'node' ],
    returnType: '[string]',
    requires: [ 'attr' ],
    categories: [ 'dom', 'classNames', 'plugins' ]
  }

  const hasClass = ( node, className ) =>
    fn.classNames( node ).some( name => name === className )

  hasClass.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'boolean',
    requires: [ 'classNames' ],
    categories: [ 'dom', 'hasClass', 'plugins' ]
  }

  const addClass = ( node, className ) => {
    className = className.trim()

    const existing = fn.classNames( node )

    existing.push( className )

    fn.attr( node, 'class', existing.join( ' ' ) )

    return node
  }

  addClass.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'node',
    requires: [ 'classNames', 'attr' ],
    categories: [ 'dom', 'addClass', 'plugins' ]
  }

  const removeClass = ( node, className ) => {
    className = className.trim()

    const existing = fn.classNames( node ).filter( name => name !== className )

    fn.attr( node, 'class', existing.join( ' ' ) )

    return node
  }

  removeClass.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'node',
    requires: [ 'classNames', 'attr' ],
    categories: [ 'dom', 'removeClass', 'plugins' ]
  }

  const toggleClass = ( node, className, shouldHave ) => {
    const alreadyHas = fn.hasClass( node, className )

    if( typeof shouldHave !== 'boolean' )
      return fn.toggleClass( node, className, !alreadyHas )

    if( alreadyHas ){
      if( shouldHave ) return node

      return fn.removeClass( node, className )
    }

    if( shouldHave ) return fn.addClass( node, className )

    return node
  }

  toggleClass.def = {
    argTypes: [ 'node', 'string', 'boolean' ],
    returnType: 'node',
    requires: [ 'hasClass', 'removeClass', 'addClass' ],
    categories: [ 'dom', 'toggleClass', 'plugins' ]
  }

  const plugins = {
    attr, hasAttr, classNames, hasClass, addClass, removeClass, toggleClass
  }

  return Object.assign( fn, plugins )
}

module.exports = attributes
