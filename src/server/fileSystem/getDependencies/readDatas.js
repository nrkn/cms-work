'use strict'

const path = require( 'path' )
const FileTree = require( '../fileTree' )
const readFiles = require( '../readFiles' )

const readDatas = dataPath =>
  FileTree( dataPath )
    .then( FileTree.populateData )
    .then( tree => {
      const datas = {}

      tree.walk( ( currentNode, parentNode, depth ) => {
        if( depth === 0 ) return

        const value = currentNode.value()
        const data = value.data
        const name = path.parse( value.name ).name

        datas[ name ] = data
      })

      return datas
    })

module.exports = readDatas
