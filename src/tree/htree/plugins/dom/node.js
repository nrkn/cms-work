'use strict'

const nodeNameMap = {
  element: ( fn, node ) => fn.tagName( node ),
  documentType: ( fn, node ) => {
    const value = fn.value( node )

    return value.name
  }
}

const nodePlugins = fn => {
  const nodeType = ( fn, node ) => {
    const value = fn.value( node )
    
    return value.nodeType        
  }

  nodeType.def = {
    argTypes: [ 'fn', 'node' ],
    returnType: 'string',
    requires: [ 'value' ],
    categories: [ 'node', 'plugin' ]
  }

  const nodeName = ( fn, node ) => {
    const nodeType = fn.nodeType( fn, node )

    if( nodeType in nodeNameMap )
      return nodeNameMap[ nodeType ]( fn, node )

    return `#${ nodeType }`
  } 

  nodeName.def = {
    argTypes: [ 'fn', 'node' ],
    returnType: 'string',
    requires: [ 'nodeType' ],
    categories: [ 'node', 'plugin' ]
  }

  return Object.assign( fn, { nodeType, nodeName } )
}

module.exports = nodePlugins
