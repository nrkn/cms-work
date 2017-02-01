'use strict'

const RenderCss = dependencies => {
  const { styles, transformCss } = dependencies

  const renderCss = root => {
    let css = ''

    const alreadyAdded = new Set()

    root.walk( node => {
      const value = node.value()
      const componentName = value.name

      if( alreadyAdded.has( componentName ) )
        return

      alreadyAdded.add( componentName )

      const style = styles[ componentName ]

      if( typeof style === 'string' ){
        css += style
        css += ' '
      }
    })

    if( typeof transformCss === 'function' )
      css = transformCss( css )

    return css
  }

  return renderCss
}

module.exports = RenderCss
