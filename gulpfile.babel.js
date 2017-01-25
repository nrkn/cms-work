'use strict'

const gulp = require( 'gulp' )
const babelify = require( 'babelify' )
const browserify = require( 'browserify' )
const buffer = require( 'vinyl-buffer' )
const source = require( 'vinyl-source-stream' )
const runSequence = require( 'run-sequence' )
const fs = require( 'fs' )
const pify = require( 'pify' )
const getDependencies = require( './src/server/fileSystem/getDependencies' )

const writeFile = pify( fs.writeFile )

gulp.task( 'generateDependencies', () => {
  return getDependencies( './data' )
    .then( dependencies => {
      const json = JSON.stringify( dependencies )

      // TODO figure out wtf to do with this path
      return writeFile( './dist/dependencies.json', json, 'utf8' )
    })
})

gulp.task( 'browserify', () => {
  var bundler = browserify( './src/client/index.js', {debug: true} )

  bundler.transform( babelify )

  return bundler.bundle()
    .on( 'error', console.error )
    .pipe( source( 'index.js' ) )
    .pipe( buffer() )
    .pipe( gulp.dest( './dist/client' ) )
})

gulp.task( 'default', cb =>
  runSequence( 'generateDependencies', 'browserify', cb )
)