'use strict'

const gulp = require( 'gulp' )
const babelify = require( 'babelify' )
const browserify = require( 'browserify' )
const buffer = require( 'vinyl-buffer' )
const source = require( 'vinyl-source-stream' )
const runSequence = require( 'run-sequence' )
const readComponents = require( './src/server/readComponents' )
const readSchemas = require( './src/server/readSchemas' )
const fs = require( 'fs' )
const pify = require( 'pify' )

const writeFile = pify( fs.writeFile )

gulp.task( 'components', () => {
  return readComponents( './data/components' )
    .then( components => JSON.stringify( components, null, 2 ) )
    .then( json => writeFile( './dist/data/components.json', json, 'utf8' ) )
})

gulp.task( 'schemas', () => {
  return readSchemas( './data/schemas' )
    .then( schemas => JSON.stringify( schemas, null, 2 ) )
    .then( json => writeFile( './dist/data/schemas.json', json, 'utf8' ) )
})

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
  runSequence( 'components', 'schemas', 'browserify', cb )
)