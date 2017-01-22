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

        if( childContainer.nodeName() === 'ul' || childContainer.nodeName() === 'ol' ){
          const liNode = dom.parse( '<li></li>' )

          liNode.append( childDom )
          childContainer.append( liNode )

          return
        }

        childContainer.append( childDom )
      })
    }

    return dom
  }

  return renderNode
}

module.exports = RenderNode
