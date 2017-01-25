'use strict'

const Composer = require( './composer' )

window.mojule = { Composer }

/*
TODO this is test code to get the composer up and running, needs to be init'ed
properly as and where needed
*/

const Tree = require( '1tree' )
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
