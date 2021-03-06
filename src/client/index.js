'use strict'

const Composer = require( './composer' )

require( './polyfills' )
require( './component-enhancers' )

window.mojule = { Composer }

/*
TODO this is test code to get the composer up and running, needs to be init'ed
properly as and where needed
*/
const componentDependencies = require( '../../dist/dependencies.json' )

const getComposerApi = () => {
  //const Tree = require( '1tree' )
  const TreeFactory = require( '1tree-factory' )

  //in reality this would be implemented by the specific tree type, this is just a
  //hack for testing
  const isEmptyPlugin = fn => {
    const isEmpty = ( fn, node ) => {
      const value = fn.value( node )

      return value.nodeType === 'file' || value.nodeType === 'text'
    }

    isEmpty.def = fn.isEmpty.def

    return Object.assign( fn, { isEmpty })
  }

  const Tree = TreeFactory( isEmptyPlugin )

  const RenderNode = require( '../render-composer/renderNode' )
  const renderNode = RenderNode( componentDependencies )

  const treeRaw = componentDependencies.datas[ 'data-small' ]
  const tree = Tree( treeRaw )

  const modulesNodes = tree.findAll( n => n.value().name === 'node_modules' )

  modulesNodes.forEach( n => n.remove() )

  return Composer( tree, renderNode )
}

const composerApi = getComposerApi()
