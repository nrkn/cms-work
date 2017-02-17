'use strict'

const assert = require( 'assert' )

const testData = require( './fixtures/test.json' )

const { toTree, toJson, pathFromNode, nodeFromPath } = require( '../src' )

describe( '1tree/json converter', () => {
  testData.forEach( el => {
    const originalJsonStr = JSON.stringify( el )

    it( 'is symmetrical for ' + originalJsonStr, () => {
      const dataTree = toTree( el )
      const dataBackToJson = toJson( dataTree )

      const roundTrippedJsonStr = JSON.stringify( dataBackToJson )

      assert.equal( originalJsonStr, roundTrippedJsonStr )
    })

    it( 'can get paths and find paths for ' + originalJsonStr, () => {
      const tree = toTree( el )
      const nodePaths = []

      tree.walk( n => {
        const nodePath = pathFromNode( n )

        if( nodePath ) nodePaths.push( nodePath )
      })

      const pathToNodeMap = nodePaths.reduce( ( map, nodePath ) => {
        map[ nodePath ] = nodeFromPath( tree, nodePath )

        return map
      }, {} )

      Object.keys( pathToNodeMap ).forEach( key => {
        assert( pathToNodeMap[ key ] !== undefined )
      })
    })
  })
})
