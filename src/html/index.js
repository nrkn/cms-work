'use strict'

const hinfo = require( 'hinfo' )

const Html = defs => {
  defs = defs || hinfo()

  const tagNames = Object.keys( defs )

  const empty = tagName =>
    !Array.isArray( defs[ tagName ].content ) ||
    defs[ tagName ].content.length === 0

  const accept = parentName => {
    const parent = defs[ parentName ]

    if( !Array.isArray( parent.content ) || parent.content.length === 0 )
      return []

    return Object.keys( defs ).filter( childName => {
      return parent.content.includes( '<' + childName + '>' ) || (
        Array.isArray( defs[ childName ].categories ) &&
        defs[ childName ].categories.some( category => parent.content.includes( category ) )
      )
    })
  }

  const allCategories = Object.keys( defs ).reduce(
    ( allCategories, key ) => {
      const def = defs[ key ]

      if( Array.isArray( def.categories ) ){
        allCategories = allCategories.concat( def.categories )
      }

      return allCategories
    }, []
  )

  const categoryNames = Array.from( new Set( allCategories ) ).sort()

  const metadata = tagName =>
    Array.isArray( defs[ tagName ].categories ) &&
    defs[ tagName ].categories.includes( 'metadata content' )

  const text = tagName =>
    Array.isArray( defs[ tagName ].content ) &&
    defs[ tagName ].content.includes( 'phrasing content' )

  const embedded = tagName =>
    Array.isArray( defs[ tagName ].categories ) &&
    defs[ tagName ].categories.includes( 'embedded content' )

  const block = tagName =>
    Array.isArray( defs[ tagName ].content ) &&
    defs[ tagName ].content.includes( 'flow content' ) &&
    !text( tagName )

  const container = tagName => !empty( tagName )

  const decorators = {
    empty: empty,
    accept: accept,
    reject: reject,
    metadata: metadata,
    text: text,
    embedded: embedded,
    block: block,
    container: container
  }

  const acceptMap = Object.keys( defs ).reduce( ( acceptMap, parentName ) => {
    const tagAccepts = accept( parentName )

    acceptMap[ parentName ] = {}

    Object.keys( defs ).forEach( childName => {
      acceptMap[ parentName ][ childName ] = tagAccepts.includes( childName )
    })

    return acceptMap
  }, {} )

  const decorated = Object.keys( defs ).reduce( ( decorated, tagName ) => {
    decorated[ tagName ] = Object.assign(
      {
        categories: [],
        parent: [],
        content: [],
        disallow: [],
        previous: [],
        next: [],
        singular: false
      },
      defs[ tagName ],
      Object.keys( decorators ).reduce( ( extra, decoratorName ) => {
        extra[ decoratorName ] = decorators[ decoratorName ]( tagName )

        return extra
      }, {} )
    )

    return decorated
  }, {} )

  return {
    tags: decorated,
    acceptMap: acceptMap
  }
}

module.exports = Html
