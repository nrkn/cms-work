'use strict'

const TreeNode = require( 'tree/tree-node' )
const Events = require( 'events' )
const utils = require( 'utils' )

const { matches } = utils

const typeError = ( fnName, argName, expectType ) => {
  throw new TypeError(
    `${ fnName } expects ${ argName } to be ${ expectType }`
  )
}

const defaults = {
  find: ( api, source ) => {
    const allCandidates = typeof source.nodeType === 'string' ?
      api.get( source.nodeType ) : api.all()

    return allCandidates
      .then( candidates =>
        candidates.filter( node => matches( node, source ) )
      )
  }
}

const Store = ( adapter ) => {
  const events = Events()

  const exists = id => {
    if( typeof id !== 'string' )
      typeError( 'Store.exists', 'id', 'a string' )

    return adapter.exists( id )
  }

  const save = obj => {
    if( !TreeNode.isTreeNode( obj ) )
      typeError( 'Store.save', 'obj', 'an instance of TreeNode' )

    const now = ( new Date() ).toJSON()

    if( typeof obj.value._created !== 'string' )
      obj.value._created = now

    obj.value._updated = now

    events.emit( 'save', obj )

    return adapter.save( obj )
  }

  const load = id => {
    if( typeof id !== 'string' && !Array.isArray( id ) )
      typeError( 'Store.load', 'id', 'a string or an array' )

    return adapter.load( id )
  }

  const get = nodeType => {
    if( typeof nodeType !== 'string' )
      typeError( 'Store.get', 'nodeType', 'a string' )

    return adapter.get( nodeType )
  }

  const remove = id => {
    if( typeof id !== 'string' )
      typeError( 'Store.remove', 'id', 'a string' )

    events.emit( 'remove', id )

    return adapter.remove( id )
  }

  const find = source => {
    if( typeof source !== 'object' )
      typeError( 'Store.find', 'id', 'a string' )

    if( typeof adapter.find === 'function' )
      return adapter.find( source )

    return defaults.find( api, source )
  }

  const all = () => {
    return adapter.all()
  }

  const on = events.on

  const api = {
    exists, save, load, get, remove, all, on
  }

  return api
}

module.exports = Store
