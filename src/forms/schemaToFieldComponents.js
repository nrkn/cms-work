'use strict'

const ComponentApi = require( '../components/componentApi' )
const normalizeSchema = require( '../schema/normalize' )

const SchemaToFieldComponents = dependencies => {
  const componentApi = ComponentApi( dependencies )
  const nodeToComponent = NodeToComponent( componentApi )

  const { schemas } = dependencies
  const { form } = componentApi

  const schemaToFieldComponents = name => {
    const normalizedTree = normalizeSchema( schemas, name, true )

    return nodeToComponent( normalizedTree )
  }

  return schemaToFieldComponents
}

const NodeToComponent = componentApi => {
  const {
    inputFieldset, inputCheckbox, inputNumber, inputRadio, inputText,
    componentFragment
  } = componentApi

  const nodeToComponent = node => {
    const value = node.value()
    const { type } = value

    if( !mapper[ type ] )
      throw new Error( `Unsupported type ${ type }` )

    const component = mapper[ type ]( node )

    node.getChildren().forEach( childNode => {
      component.append( nodeToComponent( childNode ) )
    })

    return component
  }

  const getTitle = value => value.title || value.propertyName || value.id || value.type

  const inputModel = node => {
    const value = node.value()
    const name = node.getPath()
    const title = getTitle( value )

    // add isRequired to 1tree-schema!

    const model = { name, title }

    if( value.default )
      Object.assign( model, { value: value.default } )

    return model
  }

  const inputNumberModel = node => {
    const value = node.value()
    const model = inputModel( node )

    const { min, max } = value

    if( typeof min === 'number' )
      Object.assign( model, { min } )

    if( typeof max === 'number' )
      Object.assign( model, { max } )

    return model
  }

  const mapper = {
    // standard mappings from type
    object: node => {
      const value = node.value()
      const title = getTitle( value )

      return inputFieldset( { title } )
    },
    string: node => {
      const model = inputModel( node )

      return inputText( model )
    },
    number: node => {
      const model = inputNumberModel( node )

      return inputNumber( model )
    },
    integer: node => {
      const model = inputNumberModel( node )

      Object.assign( model, { step: 1 })

      return inputNumber( model )
    },
    boolean: node => {
      const model = inputModel( node )

      if( model.value )
        model.isSelected = true

      model.value = 'true'

      return inputCheckbox( model )
    },
    array: node => {
      /*
       this is going to need to be enhanced with javascript so that you can
       add/remove the items ala mojule v1
      */
      const value = node.value()
      const title = getTitle( value )
      const fieldsetClasses = [ 'input-fieldset--list' ]

      return inputFieldset( { title, fieldsetClasses } )
    },
    any: node => {
      const children = node.getChildren()

      const childrenAreOneOf = children.every( childNode => {
        return childNode.value().oneOf
      })

      // there may be other cases here, but for now handle oneOf
      if( !childrenAreOneOf )
        throw new Error( 'Type "any" only currently supported when children are "oneOf"' )

      // field name for the oneOf node
      const name = node.getPath()
      const value = node.value()

      const title = getTitle( value )
      const fieldsetClasses = [ 'input-fieldset--select' ]

      const radioModels = children.map( childNode => {
        const value = childNode.value()
        const title = getTitle( value )
        const radioClasses = [ 'input-radio--select' ]

        const model = { title, name, radioClasses }

        return inputRadio( model )
      })

      const fieldsetModel = { title, fieldsetClasses }

      return inputFieldset( fieldsetModel, radioModels )
    }
  }

  return nodeToComponent
}

module.exports = SchemaToFieldComponents

/*
  object -> fieldset
  array -> fieldset with add/remove controls
  string -> input[type='text']
  number -> input[type='number']
  integer -> input[type='number',min=xxx,max=xxx,step=1]
  boolean -> checkbox
  null -> shouldn't happen! why do you have a schema with nulls as an accepted

  SPECIAL CASES:

  enum -> radio / select

  allOf -> doesn't matter, gets normalized out
  anyOf -> this is weird, don't see a use case for it, throw an unsupported exception
  not -> doesn't make sense, or maybe use input[text]?
  oneOf? -> radio with subfields / mashup of fieldset and radio?

  format -> multiline is textarea instead of input[text], email is input[email] instead etc.
  pattern -> html input supports regex patterns!


  NOTES:

  label comes from title, falls back to id

  hover text comes from description if available, falls back to title

  the existing value comes from default - you can use schema-tree to decorate an
  existing schema with defaults from a model, and not only that, but because
  1tree-schema and 1tree-json both support path, mapping these in is trivial


*/