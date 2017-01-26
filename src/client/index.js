'use strict'

const Composer = require( './composer' )

require( './polyfills' )

window.mojule = { Composer }

/*
TODO this is test code to get the composer up and running, needs to be init'ed
properly as and where needed
*/

//const Tree = require( '1tree' )
const TreeFactory = require( '1tree-factory' )

const isEmptyPlugin = fn => {
  const isEmpty = ( fn, node ) => {
    const value = fn.value( node )

    return value.nodeType === 'file'
  }

  isEmpty.def = fn.isEmpty.def

  return Object.assign( fn, { isEmpty } )
}

const Tree = TreeFactory( isEmptyPlugin )

const dragula = require( 'dragula' )
const morphdom = require( 'morphdom' )
const componentDependencies = require( '../../dist/dependencies.json' )
const RenderNode = require( '../composer-tree/renderNode' )
const renderNode = RenderNode( componentDependencies )

const composerDependencies = {
  dragula, morphdom, document, renderNode
}

const treeRaw = componentDependencies.datas[ 'data-small' ]
const tree = Tree( treeRaw )
const options = {
  selector: '.composer'
}

const composerState = { tree, options }

const composerApi = Composer( composerDependencies, composerState )
