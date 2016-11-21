'use strict'

const create = fn => {
  const createElement = ( tagName, attributes )  => {
    tagName = tagName || 'div'
    attributes = attributes || {}

    const nodeType = 'element'

    const value = {
      nodeType, tagName, attributes
    }

    return fn.createNode( value )
  }

  createElement.def = {
    argTypes: [ 'string', 'object' ],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'create', 'plugin' ]
  }

  const createComment = nodeValue => {
    const nodeType = 'comment'

    const value = { nodeType, nodeValue }

    return fn.createNode( value )
  }

  createComment.def = {
    argTypes: [ 'string' ],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'create', 'plugin' ]
  }

  const createDocument = () => fn.createNode( { nodeType: 'document' } )

  createDocument.def = {
    argTypes: [],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'create', 'plugin' ]
  }

  const createDocumentFragment = () =>
    fn.createNode( { nodeType: 'documentFragment' } )

  createDocumentFragment.def = {
    argTypes: [],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'create', 'plugin' ]
  }

  const createText = nodeValue => {
    const nodeType = 'text'

    const value = { nodeType, nodeValue }

    return fn.createNode( value )
  }

  createText.def = {
    argTypes: [ 'string' ],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'create', 'plugin' ]
  }

  const createDocumentType = ( name, publicId, systemId ) => {
    const nodeType = 'documentType'

    const value = {
      nodeType, name, publicId, systemId
    }

    return fn.createNode( value )
  }

  createDocumentType.def = {
    argTypes: [ 'string', 'string', 'string' ],
    returnType: 'node',
    requires: [ 'createNode' ],
    categories: [ 'create', 'plugin' ]
  }

  const plugins = {
    createText, createElement, createComment, createDocument,
    createDocumentFragment, createDocumentType
  }

  return Object.assign( fn, plugins )
}

module.exports = create
