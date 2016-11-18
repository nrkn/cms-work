'use strict'

const assert = require( 'assert' )
const Html = require( 'html' )

const html = Html()

const isNonEmptyArrayOfString = obj =>
  Array.isArray( obj ) &&
  obj.length > 0 &&
  obj.every( tagName => typeof tagName === 'string' )


describe( 'HTML API', () => {
  it( 'tagNames', () => {
    const tagNames = html.tagNames()

    assert( isNonEmptyArrayOfString( tagNames ) )
  })

  it( 'categoryNames', () => {
    const categoryNames = html.categoryNames()

    assert( isNonEmptyArrayOfString( categoryNames ) )
  })

  describe( 'isEmpty', () => {
    const expectTrue = [ 'img', 'link', 'hr' ]
    const expectFalse = [ 'ul', 'div', 'span' ]

    describe( 'expect true', () => {
      expectTrue.forEach( tagName => {
        it( tagName, () => {
          assert( html.isEmpty( tagName ) )
        })
      })
    })

    describe( 'expect false', () => {
      expectFalse.forEach( tagName => {
        it( tagName, () => {
          assert( !html.isEmpty( tagName ) )
        })
      })
    })
  })

  describe( 'accepts', () => {
    const expectTrue = [
      [ 'ul', 'li' ],
      [ 'div', 'span' ],
      [ 'html', 'head' ]
    ]

    const expectFalse = [
      [ 'ul', 'div' ],
      [ 'span', 'div' ],
      [ 'img', 'div' ]
    ]

    describe( 'expect true', () => {
      expectTrue.forEach( pair => {
        const [ parent, child ] = pair
        it( `${ parent } accepts ${ child }`, () => {
          assert( html.accepts( parent, child ) )
        })
      })
    })

    describe( 'expect false', () => {
      expectFalse.forEach( pair => {
        const [ parent, child ] = pair
        it( `${ parent } accepts ${ child }`, () => {
          assert( !html.accepts( parent, child ) )
        })
      })
    })
  })
})
