'use strict'

const hinfo = require( 'hinfo' )

const ensureArray = ( obj, name ) => {
  if( !Array.isArray( obj[ name ] ) )
    obj[ name ] = []
}

const ensureProperties = def => {
  ensureArray( def, 'categories' )
  ensureArray( def, 'content' )
}

const Html = defs => {
  if( defs === undefined ){
    defs = hinfo()
  } else {
    defs = JSON.parse( JSON.stringify( defs ) )
  }

  const tagNames = Object.keys( defs )

  const hasCategory = ( tagName, categoryName ) =>
    defs[ tagName ].categories.includes( categoryName )

  const predicates = {
    empty: tagName => defs[ tagName ].content.length === 0,
    metadata: tagName => hasCategory( tagName, 'metadata content' ),
    inline: tagName => hasCategory( tagName, 'phrasing content' ),
    embedded: tagName => hasCategory( tagName, 'embedded content' ),
    block: tagName =>
      hasCategory( tagName, 'flow content' ) && !predicates.inline( tagName ),
    container: tagName => !predicates.empty( tagName )
  }

  const doesAccept = ( tagName, childTagName ) => {
    if( predicates.empty( tagName ) ) return false

    const def = defs[ tagName ]

    if( def.content.includes( `<${ childTagName }>` ) )
      return true

    const childDef = defs[ childTagName ]

    return childDef.categories.some( category =>
      def.content.includes( category )
    )
  }

  const predicateNames = Object.keys( predicates )

  const maps = {
    accepts: {}
  }

  predicateNames.forEach( name => maps[ name ] = {} )

  let allCategories = []

  tagNames.forEach( tagName => {
    const def = defs[ tagName ]

    ensureProperties( def )

    allCategories = allCategories.concat( def.categories )

    predicateNames.forEach( predicateName =>
      maps[ predicateName ][ tagName ] = predicates[ predicateName ]( tagName )
    )

    maps.accepts[ tagName ] = {}

    tagNames.forEach( childTagName =>{
      ensureProperties( defs[ childTagName ] )

      maps.accepts[ tagName ][ childTagName ] = doesAccept( tagName, childTagName )
    })
  })

  const categoryNames = Array.from( new Set( allCategories ) ).sort()

  const api = {
    tagNames: () => tagNames,
    categoryNames: () => categoryNames,
    isEmpty: tagName => maps.empty[ tagName ],
    isMetadata: tagName => maps.metadata[ tagName ],
    isInline: tagName => maps.inline[ tagName ],
    isEmbedded: tagName => maps.embedded[ tagName ],
    isBlock: tagName => maps.block[ tagName ],
    isContainer: tagName => maps.container[ tagName ],
    accepts: ( tagName, childTagName ) => maps.accepts[ tagName ][ childTagName ],
    def: tagName => {
      if( defs[ tagName ] )
        return JSON.parse( JSON.stringify( defs[ tagName ] ) )
    }
  }

  return api
}

module.exports = Html
