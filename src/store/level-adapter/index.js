'use strict'

const path = require( 'path' )
const level = require( 'levelup' )
const pify = require( 'pify' )

const Adapter = ( name, options ) => {
  const opts = Object.assign( {}, defaults, options )
  const dbName = path.join( opts.path, name )
  const db = level( dbName )

  const api = {
    exists: id => exists( db, id ),
    save: obj => save( db, obj ),
    load: id => load( db, id ),
    get: key => get( db, key ),
    remove: id => remove( db, id ),
    all: () => all( db )
  }

  // some adapters will need async, this doesn't but has to be consistent
  return Promise.resolve( api )
}

const defaults = {
  path: './data/level'
}

const exists = ( db, id ) => new Promise( resolve =>
  load( db, id )
    .then( () => resolve( true ) )
    .catch( err => resolve( false ) )
)

const save = ( db, obj ) =>
  pify( db.put )( obj._id, JSON.stringify( obj ) )

const load = ( db, id ) => Array.isArray( id ) ?
  Promise.all( id.map( id => load( db, id ) ) ) :
  pify( db.get )( id )

const get = ( db, key ) => new Promise( ( resolve, reject ) => {
  const items = []

  const stream = key ?
    db.createReadStream({ start: key + '-' , end: key + '-\uffff' }) :
    db.createReadStream()

  stream
    .on( 'data', item => items.push( JSON.parse( item.value ) ) )
    .on( 'error', reject )
    .on( 'close', () => resolve( items ) )
})

const remove = ( db, id ) => pify( db.del )( id )

const all = db => get( db )

module.exports = Adapter
