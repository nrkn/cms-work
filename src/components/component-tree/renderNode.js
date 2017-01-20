'use strict'

const Templates = require( '../../templates' )

const RenderNode = dependencies => {
  const { configs } = dependencies
  const { renderComponent } = Templates( dependencies )

  const defaultConfig = {
    containerSelector: "[data-container]"
  }

  const renderNode = node => {
    const value = node.value()
    const componentName = value.name
    const componentModel = value.model
    const dom = renderComponent( componentName, componentModel )
    const config = Object.assign( {}, defaultConfig, configs[ componentName ] )
    const childContainer = dom.select( config.containerSelector )
    const children = node.getChildren()

    if( childContainer && children.length ){
      children.forEach( childNode => {
        const childDom = renderNode( childNode )

        if( dom.nodeName() === 'ul' || dom.nodeName() === 'ol' ){
          const liNode = dom.createNode( '<li></li>' )

          liNode.append( childNode )
          dom.append( liNode )

          return
        }

        dom.append( childNode )
      })
    }

    return dom
  }

  return renderNode
}

module.exports = RenderNode
