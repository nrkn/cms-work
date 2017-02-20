'use strict'

const RenderCss = dependencies => {
  const { styles, transformCss, configs } = dependencies

  const renderCss = root => {
    let css = ''

    const alreadyAdded = new Set()

    const appendCss = componentName => {
      if( alreadyAdded.has( componentName ) )
        return

      alreadyAdded.add( componentName )

      const config = configs[ componentName ]

      if( config && config.inherit )
        appendCss( config.inherit )

      const style = styles[ componentName ]

      if( typeof style === 'string' ) {
        css += style
        css += ' '
      }
    }

    root.walk( node => {
      const value = node.value()
      const componentName = value.name

      appendCss( componentName )
    })

    if( typeof transformCss === 'function' )
      css = transformCss( css )

    return css
  }

  return renderCss
}

module.exports = RenderCss
