'use strict'

const fs = require( 'fs' )
const path = require( 'path' )
const pify = require( 'pify' )
const Tree = require( '1tree' )

const readdir = pify( fs.readdir )
const stat = pify( fs.stat )

const handleFile = ( currentPath, root ) => root.createNode({
  nodeType: 'file',
  path: currentPath,
  name: path.parse( currentPath ).base
})

const handleDirectory = ( currentPath, root ) => {
  const create = root ? root.createNode : Tree.createRoot

  const value = {
    nodeType: 'directory',
    path: currentPath,
    name: path.parse( currentPath ).base
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

FileTree.populateMime = tree => {
  const mime = require( 'mime' )

  tree.walk( n => {
    const value = n.value()

    if( value.nodeType === 'directory' ) return

    value.mimeType = mime.lookup( value.path )

    n.value( value )
  })

  return tree
}

FileTree.populateData = tree => {
  const readFiles = require( '../readFiles' )
  const transformJson = require( './transforms/json' )
  const transformHtml = require( './transforms/html' )

  const transformMap = {
    'application/json': transformJson,
    'text/html': transformHtml
  }

  tree = FileTree.populateMime( tree )

  const filePaths = FileTree.filePaths( tree )

  return readFiles( filePaths )
    .then(
      fileData => {
        tree.walk( n => {
          const value = n.value()

          if( value.mimeType in transformMap ){
            const transform = transformMap[ value.mimeType ]
            fileData[ value.path ] = transform( fileData[ value.path ] )
          }

          value.data = fileData[ value.path ]

          n.value( value )
        })

        return tree
      }
    )
}


module.exports = FileTree
