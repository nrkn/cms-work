"use strict"

const assert = require( 'assert' )
const Tree = require( '1tree' )

describe( 'debug testing', () => {
  it( 'does a thing', () => {
    const value = {
      nodeType: 'node'
    }

    const node = Tree.createRoot( value )

    const id = node.id()

    assert.equal( typeof id, 'string' )
  })
})