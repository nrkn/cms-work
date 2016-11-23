'use strict'

const node = require( 'tree/tree-node/schema/node.schema.json' )
const parentNode = require( 'tree/tree-node/schema/parentNode.schema.json' )
const value = require( 'tree/tree-node/schema/value.schema.json' )

const comment = require( './comment.schema.json' )
const commentValue = require( './commentValue.schema.json' )
const documentFragment = require( './documentFragment.schema.json' )
const documentFragmentValue = require( './documentFragmentValue.schema.json' )
const document = require( './document.schema.json' )
const documentValue = require( './documentValue.schema.json' )
const documentType = require( './documentType.json' )
const documentTypeValue = require( './documentTypeValue.schema.json' )
const element = require( './element.schema.json' )
const elementValue = require( './elementValue.schema.json' )
const text = require( './text.schema.json' )
const textValue = require( './textValue.schema.json' )

const schema = {
  comment, commentValue, documentFragment,
  documentFragmentValue, document, documentValue, documentType,
  documentTypeValue, element, elementValue, text, textValue,

  node, parentNode, value
}

module.exports = schema
