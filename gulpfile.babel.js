'use strict'

const gulp = require( 'gulp' )
const babelify = require( 'babelify' )
const browserify = require( 'browserify' )
const buffer = require( 'vinyl-buffer' )
const source = require( 'vinyl-source-stream' )
const FileTree = require( './src/server/fileTree' )

gulp.task( 'components', () => {
  FileTree( './src/server/components/defs' )
    .then( FileTree.populateData )
    .then( tree => {
      const components = {}

      tree.walk( ( node, parent, depth ) => {

      })
    })
})

gulp.task( 'browserify', () => {
  var bundler = browserify( './src/client/index.js' )

  bundler.transform( babelify )
  bundler.bundle()
    .on( 'error', console.error )
    .pipe( source( 'index.js' ) )
    .pipe( buffer() )
    .pipe( gulp.dest( './dist/client' ) )
})

gulp.task( 'default', [ 'browserify' ], () => {
  console.log( 'OK mate' )
})
