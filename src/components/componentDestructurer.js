'use strict'

const destructure = components => {
  const styles = {}
  const templates = {}
  const schemas = {}
  const defaultModels = {}
  const configs = {}
  const transforms = {}
  const clientScripts = {}

  const componentNames = Object.keys( components )

  const populate = ( map, componentName, key ) => {
    const component = components[ componentName ]
    const value = component[ key ]

    if( value )
      map[ componentName ] = value
  }

  componentNames.forEach( componentName => {
    populate( styles, componentName, 'style' )
    populate( templates, componentName, 'template' )
    populate( schemas, componentName, 'schema' )
    populate( defaultModels, componentName, 'defaultModel' )
    populate( configs, componentName, 'config' )
    populate( transforms, componentName, 'transform' )
    populate( clientScripts, componentName, 'clientScript' )
  })

  return {
    styles, templates, schemas, defaultModels, configs, transforms,
    componentNames, components, clientScripts
  }
}

module.exports = destructure
