'use strict'

const utils = require( 'utils' )

const { clone } = utils

const element = fn => {
  const expectElement = ( node, fname ) => {
    if( !fn.isElement( node ) )
      throw new TypeError( `${ fname } can only be called on element nodes` )
  }

  const attributes = ( node, value ) => {
    expectElement( node, 'attributes' )

    const nodeValue = fn.value( node )

    if( typeof value === 'object' ){
      nodeValue.attributes = value

      fn.value( node, nodeValue )
    }

    if( nodeValue.attributes === undefined )
      return {}

    return clone( nodeValue.attributes )
  }

  attributes.def = {
    argTypes: [ 'node', 'object?' ],
    returnType: 'object',
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'attributes', 'plugins' ]
  }

  const tagName = ( node, value ) => {
    expectElement( node, 'tagName' )

    const nodeValue = fn.value( node )

    if( value !== undefined ){
      nodeValue.tagName = value

      fn.value( node, nodeValue )
    }

    return nodeValue.tagName
  }

  tagName.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'string',
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'tagName', 'plugins' ]
  }

  const attr = ( node, name, value ) => {
    expectElement( node, 'attr' )

    const nodeValue = fn.value( node )

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
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'attr', 'plugins' ]
  }

  const hasAttr = ( node, name ) => {
    expectElement( node, 'hasAttr' )

    return fn.attr( node, name ) !== undefined
  }

  hasAttr.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'boolean',
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'hasAttr', 'plugins' ]
  }

  const removeAttr = ( node, name ) => {
    expectElement( node, 'removeAttr' )

    const nodeValue = fn.value( node )

    if( typeof nodeValue.attributes === 'object' )
      delete nodeValue.attributes[ name ]

    fn.value( node, nodeValue )
  }

  removeAttr.def = {
    argTypes: [ 'node', 'string' ],
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'removeAttr', 'plugins' ]
  }

  const clearAttrs = node => {
    expectElement( node, 'clearAttr' )

    const nodeValue = fn.value( node )

    nodeValue.attributes = {}

    fn.value( node, nodeValue )
  }

  clearAttrs.def = {
    argTypes: [ 'node' ],
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'clearAttrs', 'plugins' ]
  }

  const clearClasses = node => {
    expectElement( node, 'clearAttr' )

    fn.attr( node, 'class', '' )
  }

  clearClasses.def = {
    argTypes: [ 'node' ],
    requires: [ 'value', 'isElement' ],
    categories: [ 'dom', 'clearClasses', 'plugins' ]
  }

  const classNames = node => {
    expectElement( node, 'classNames' )

    const classNames = fn.attr( node, 'class' )

    if( typeof classNames === 'string' ) return classNames.split( ' ' )

    return []
  }

  classNames.def = {
    argTypes: [ 'node' ],
    returnType: '[string]',
    requires: [ 'attr', 'isElement' ],
    categories: [ 'dom', 'classNames', 'plugins' ]
  }

  const hasClass = ( node, className ) => {
    expectElement( node, 'hasClass' )

    return fn.classNames( node ).some( name => name === className )
  }

  hasClass.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'boolean',
    requires: [ 'classNames', 'isElement' ],
    categories: [ 'dom', 'hasClass', 'plugins' ]
  }

  const addClass = ( node, className ) => {
    expectElement( node, 'addClass' )

    className = className.trim()

    const existing = fn.classNames( node )

    existing.push( className )

    fn.attr( node, 'class', existing.join( ' ' ) )

    return node
  }

  addClass.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'node',
    requires: [ 'classNames', 'attr', 'isElement' ],
    categories: [ 'dom', 'addClass', 'plugins' ]
  }

  const removeClass = ( node, className ) => {
    expectElement( node, 'removeClass' )

    className = className.trim()

    const existing = fn.classNames( node ).filter( name => name !== className )

    fn.attr( node, 'class', existing.join( ' ' ) )

    return node
  }

  removeClass.def = {
    argTypes: [ 'node', 'string' ],
    returnType: 'node',
    requires: [ 'classNames', 'attr', 'isElement' ],
    categories: [ 'dom', 'removeClass', 'plugins' ]
  }

  const toggleClass = ( node, className, shouldHave ) => {
    expectElement( node, 'toggleClass' )

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
    requires: [ 'hasClass', 'removeClass', 'addClass', 'isElement' ],
    categories: [ 'dom', 'toggleClass', 'plugins' ]
  }

  const plugins = {
    attributes, attr, hasAttr, removeAttr, classNames, hasClass, addClass,
    removeClass, toggleClass, tagName, clearAttrs, clearClasses
  }

  return Object.assign( fn, plugins )
}

module.exports = element
