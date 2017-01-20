'use strict'

const path = require( 'path' )
const readComponents = require( './readComponents' )
const readSchemas = require( './readSchemas' )
const readDatas = require( './readDatas' )
const componentDestructurer = require( '../../../components/componentDestructurer' )

const assignSchemas = ( dataPath, dependencies ) =>
  readSchemas( path.join( dataPath, 'schemas' ) )
    .then( schemas => {
      Object.assign( dependencies.schemas, schemas )

      return dependencies
    })

const assignDatas = ( dataPath, dependencies ) =>
  readDatas( path.join( dataPath, 'datas' ) )
    .then( datas => {
      Object.assign( dependencies, { datas } )

      return dependencies
    })

const getDependencies = dataPath =>
  readComponents( path.join( dataPath, 'components' ) )
    .then( componentDestructurer )
    .then( dependencies => assignSchemas( dataPath, dependencies ) )
    .then( dependencies => assignDatas( dataPath, dependencies ) )

module.exports = getDependencies
