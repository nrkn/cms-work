'use strict'

const entityNode = require( 'tree/entity-node/schema/entityNode.schema.json' )
const entityNodeValue = require( 'tree/entity-node/schema/entityNodeValue.schema.json' )
const emptyNode = require( 'tree/entity-node/schema/emptyNode.schema.json' )
const emptyNodeValue = require( 'tree/entity-node/schema/emptyNodeValue.schema.json' )
const parentNode = require( 'tree/entity-node/schema/parentNode.schema.json' )

const schema = {
  entityNode, entityNodeValue, emptyNode, emptyNodeValue, parentNode
}

module.exports = schema
