'use strict'

const TreeNode = require( 'tree/tree-node' )
const utils = require( 'utils' )

const { escapeHtml, capitalizeFirstLetter } = utils

const nodeMap = {
  element: () => ({
    tagName: 'div',
    attributes: {}
  }),
  comment: () => ({
    nodeValue: ''
  }),
  text: () => ({
    nodeValue: ''
  }),
  documentType: () => ({
    name: 'html', 
    publicId: '', 
    systemId: ''    
  })
}

const createDomNode = ( fn, nodeType, value ) => {
  const defaultValue = ( nodeType in nodeMap ) ? nodeMap[ nodeType ]() : {}

  value = Object.assign( 
    { nodeType }, 
    defaultValue, 
    value || {}
  )

  const treeNode = TreeNode( value )

  const node = fn.createNode( treeNode.value )

  const capNodeType = capitalizeFirstLetter( nodeType )
  const assertName = 'assert' + capNodeType

  fn[ assertName ]( node )

  return node
}

const createDomNodeDef = ( nodeType, argTypes ) => ({
  argTypes,
  returnType: 'node',
  requires: [ 'createNode', 'assert' + capitalizeFirstLetter( nodeType ) ],
  categories: [ 'create', 'plugin' ]
})

const create = fn => {
  const createElement = ( tagName, attributes )  => 
    createDomNode( fn, 'element', { tagName, attributes } )

  createElement.def = createDomNodeDef( 'element', [ 'string', 'object' ] ) 

  const createComment = nodeValue =>
    createDomNode( fn, 'element', { nodeValue } )    

  createComment.def = createDomNodeDef( 'comment', [ 'string' ] )

  const createDocument = () => createDomNode( fn, 'document' )

  createDocument.def = createDomNodeDef( 'document', [] )

  const createDocumentFragment = () => createDomNode( fn, 'documentFragment' )

  createDocumentFragment.def = createDomNodeDef( 'documentFragment', [] )

  const createText = nodeValue => 
    createDomNode( fn, 'text', { 
      nodeValue: escapeHtml( String( nodeValue ) ) 
    })

  createText.def = createDomNodeDef( 'text', [ 'string' ] )    

  const createDocumentType = ( name, publicId, systemId ) =>
    createDomNode( fn, 'documentType', { name, publicId, systemId } ) 
  
  createDocumentType.def = 
    createDomNodeDef( 'documentType', [ 'string', 'string', 'string' ] )    

  const plugins = {
    createText, createElement, createComment, createDocument,
    createDocumentFragment, createDocumentType
  }

  return Object.assign( fn, plugins )
}

module.exports = create
