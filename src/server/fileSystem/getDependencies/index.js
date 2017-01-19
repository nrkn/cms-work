'use strict'

const path = require( 'path' )
const readComponents = require( './readComponents' )
const readSchemas = require( './readSchemas' )
const componentDestructurer = require( '../../../components/componentDestructurer' )

const assignSchemas = ( dataPath, dependencies ) =>
  readSchemas( path.join( dataPath, 'schemas' ) )
    .then( schemas => {
      Object.assign( dependencies.schemas, schemas )

      return dependencies
    })

const getDependencies = dataPath =>
  readComponents( path.join( dataPath, 'components' ) )
    .then( componentDestructurer )
    .then( dependencies => assignSchemas( dataPath, dependencies ) )

module.exports = getDependencies
