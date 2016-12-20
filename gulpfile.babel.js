'use strict'

const gulp = require( 'gulp' )
const babelify = require( 'babelify' )
const browserify = require( 'browserify' )
const buffer = require( 'vinyl-buffer' )
const source = require( 'vinyl-source-stream' )

gulp.task( 'default', () => {
  var bundler = browserify( './src/client/index.js' )

  bundler.transform( babelify )
  bundler.bundle()
    .on( 'error', console.error )
    .pipe( source( 'index.js' ) )
    .pipe( buffer() )
    // .pipe( uglify() )
    .pipe( gulp.dest( './dist/client' ) )
})
