'use strict'

const gulp = require( 'gulp' )
const babelify = require( 'babelify' )
const browserify = require( 'browserify' )
const buffer = require( 'vinyl-buffer' )
const source = require( 'vinyl-source-stream' )
const uglify = require( 'gulp-uglify' )

gulp.task( 'default', () => {
  var bundler = browserify( './src/client/index.js' )

  bundler.transform( babelify )
  bundler.bundle()
    .on( 'error', console.error )
    .pipe( source( 'client.js' ) )
    .pipe( buffer() )
    // gulp plugins below this line
    // .pipe( uglify() )
    .pipe( gulp.dest( './dist/static/js' ) )
})
