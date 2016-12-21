'use strict'

const fs = require( 'fs' )
const path = require( 'path' )
const pify = require( 'pify' )
const Tree = require( '1tree' )

const readdir = pify( fs.readdir )
const stat = pify( fs.stat )

const handleFile = ( currentPath, root ) => root.createNode({
  nodeType: 'file',
  path: currentPath
})

const handleDirectory = ( currentPath, root ) => {
  const create = root ? root.createNode : Tree.createRoot

  const value = {
    nodeType: 'directory',
    path: currentPath
  }

  const node = create( value )

  root = root || node

  return readdir( currentPath )
    .then( childPaths => Promise.all(
      childPaths
        .map( childPath => path.join( currentPath, childPath ) )
        .map( childPath => handlePath( childPath, root ) )
    ))
    .then( nodes =>
      nodes.forEach( child => {
        node.append( child )
      })
    )
    .then(
      () => node
    )
}

const handlePath = ( currentPath, root ) => {
  return stat( currentPath )
    .then( stats => {
      if( stats.isFile() )
        return handleFile( currentPath, root )

      if( stats.isDirectory() )
        return handleDirectory( currentPath, root )

      throw new Error( 'FileTree can only handle files or directories' )
    })
}

const FileTree = rootPath => handleDirectory( rootPath )

FileTree.filePaths = tree =>
  tree
    .findAll(
      n => n.value().nodeType === 'file'
    )
    .map( n => n.value().path )

module.exports = FileTree
