'use strict'

const gulp = require( 'gulp' )
const babelify = require( 'babelify' )
const browserify = require( 'browserify' )
const buffer = require( 'vinyl-buffer' )
const source = require( 'vinyl-source-stream' )
const runSequence = require( 'run-sequence' )
const fs = require( 'fs' )
const pify = require( 'pify' )

const writeFile = pify( fs.writeFile )

gulp.task( 'browserify', () => {
  var bundler = browserify( './src/client/index.js' )

  bundler.transform( babelify )

  return bundler.bundle()
    .on( 'error', console.error )
    .pipe( source( 'index.js' ) )
    .pipe( buffer() )
    .pipe( gulp.dest( './dist/client' ) )
})

gulp.task( 'default', cb =>
  runSequence( 'browserify', cb )
)