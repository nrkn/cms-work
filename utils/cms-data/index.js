'use strict'

const T = require( 'mtype' )

const data = require( './cms.json' )

const is = {
  site: obj => is.dbItem( obj ) && obj.key === 'site',
  container: obj => is.dbItem( obj ) && Array.isArray( obj.children ),
  dbItem: obj => typeof obj._id === 'string' && typeof obj.key === 'string',
  unknown: obj => true
}

const t = T( is )

const propertiesForType = new Map()

const walkArray = arr => {
  arr.forEach( item => {
    // prefer cms type names to those produced from predicates above
    const typename = item.key || t.of( item )

    // lazily add a property set for the type if it doesn't exist yet
    if( !propertiesForType.has( typename ) ){
      propertiesForType.set( typename, new Set() )
    }

    // get the property set for this type
    const propertyNames = propertiesForType.get( typename )

    // add each property name from this item to the set
    Object.keys( item ).forEach( key => {
      propertyNames.add( key )
    })

    if( t.is( item, 'site' )){
      // recurse to get site item types
      walkArray( item.items )
    }

    if( t.is( item, 'container' ) ){
      // recurse to get child types
      walkArray( item.children )
    }
  })
}

// walk the cms data
walkArray( data )

// keys returns an iterator, an array is easier to work with
const typenames = Array.from( propertiesForType.keys() )

// typenames is an array of keys into the propertiesForType map
typenames.forEach( typename => {
  console.log( typename )

  // get the set of names
  const propertyNames = propertiesForType.get( typename )

  // convert set to array so we can iterate with forEach
  Array.from( propertyNames ).forEach( propertyName => {
    console.log( '  ', propertyName )
  })
})
