'use strict'

const EntityNode = require( 'tree/entity-node' )
const LocalStore = require( 'client/local-store' )
const Templating = require( 'templating' )

const getTestData = () => {
  const TestTree = require( '../../data/kitchen-sink-client' )

  const tree = TestTree()
  const model = require( '../../data/kitchen-sink.json' )

  return { tree, model }
}

const testData = getTestData()

window.mojule = { LocalStore, EntityNode, Templating, testData }
