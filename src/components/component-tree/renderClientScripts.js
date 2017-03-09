'use strict'

const RenderClientScripts = dependencies => {
  const { clientScripts, configs } = dependencies

  const renderClientScripts = root => {
    let js = ''

    const alreadyAdded = new Set()

    const appendJs = componentName => {
      if( alreadyAdded.has( componentName ) )
        return

      alreadyAdded.add( componentName )

      const config = configs[ componentName ]

      if( config && config.inherit )
        appendJs( config.inherit )

      const clientScript = clientScripts[ componentName ]

      if( typeof clientScript === 'string' ) {
        js += clientScript
        js += '\n'
      }
    }

    root.walk( node => {
      const value = node.value()
      const componentName = value.name

      appendJs( componentName )
    })

    return js
  }

  return renderClientScripts
}

module.exports = RenderClientScripts
