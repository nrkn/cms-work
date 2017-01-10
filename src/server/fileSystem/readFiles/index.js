'use strict'

const fs = require( 'fs' )
const pify = require( 'pify' )

const readFile = pify( fs.readFile )

// need to expand properly!
const defaults = {
  binary: [ '.png', '.jpg', '.gif', '.pdf' ]
}

const readFiles = ( filepaths = [], options = {} ) => {
  options = Object.assign( {}, defaults, options )

  return Promise
    .all(
      filepaths.map( filepath => {
        const isBinary =
          Array.isArray( options.binary ) &&
          options.binary.some( extension => filepath.endsWith( extension ) )

        const encoding = isBinary ? null : 'utf8'

        return readFile( filepath, encoding )
          .then( contents => ({
            path: filepath,
            contents
          }))
      })
    )
    .then(
      fileData =>
        fileData.reduce(
          ( files, data ) => {
            files[ data.path ] = data.contents

            return files
          },
          {}
        )
    )
}

module.exports = readFiles
