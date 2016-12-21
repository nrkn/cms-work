'use strict'

const cms = require( './src/server' )

/*
cms
  .start()
  .catch( console.error )
*/

const FileTree = require( './src/server/fileTree' )
const readFiles = require( './src/server/readFiles' )

FileTree( './views/templates' )
  .then( FileTree.filePaths )
  .then( readFiles )
  .then( console.log )
  .catch( console.error )
