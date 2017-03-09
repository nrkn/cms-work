'use strict'

const express = require( 'express' )
const templateEngine = require( './templateEngine' )
const getDependencies = require( './fileSystem/getDependencies' )
const ComponentApi = require( '../components/componentApi' )
const SchemaToFieldComponents = require( '../forms/schemaToFieldComponents' )
const app = express()

const initApp = ( dependencies, resolve ) => {
  app.use( express.static( './static/files' ) )
  app.use( express.static( './dist' ) )

  //not sure about this, look into it
  app.use(( req, res, next ) => {
    req.dependencies = dependencies
    next()
  })
  app.dependencies = dependencies

  app.use( templateEngine )

  // routing
  app.get( '/', ( req, res ) => {
    const Tree = require( '1tree' )

    const { schemas } = dependencies

    const schemaNames = Object.keys( schemas )

    const componentApi = ComponentApi( dependencies )
    const schemaToFieldComponents = SchemaToFieldComponents( dependencies )


    const {
      document, row, inputRadioIcon, inputCheckboxIcon, linkList, breadcrumb,
      link, composer, headerBar, headerWindow, inputText, buttonText,
      inputFieldset, inputNumber, inputCheckbox, inputRadio, element, text,
      componentFragment
    } = componentApi

    const h1Model = {
      tagName: 'h1',
      elementClasses: [ 'theme-primary', 'padding-half', 'margin-vertical-1', 'shadow-medium' ]
    }

    const allSchemasAsFields = schemaNames.map( name =>
      componentFragment([
        element( h1Model, [ text( { value: name } ) ] ),
        schemaToFieldComponents( name )
      ])
    )

    const documentModel = {
      documentTitle: 'Cool Story Bro!',
      "headStyles": [
        {
          "src": "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        }
      ],
      "scripts": [
        {
          "src": "/client/index.js"
        }
      ]
    }

    const inputModels = [
      {
        title: 'New',
        iconName: 'fa-file'
      },
      {
        title: 'Open',
        iconName: 'fa-folder'
      },
      {
        title: 'Save',
        iconName: 'fa-floppy-o'
      },
      {
        title: 'Long name that should get cut off',
        iconName: 'fa-paw'
      }
    ]

    const radioModels = inputModels.map(
      ( input, i ) => Object.assign(
        {
          name: 'radios',
          isSelected: i === 0
        },
        input
      )
    )

    const checkboxModels = inputModels.map(
      ( input, i ) => Object.assign(
        {
          name: 'checkboxes',
          isSelected: i === 0
        },
        input
      )
    )

    const linkModels = [
      {
        "title": "Google",
        "uri": "http://google.com/"
      },
      {
        "title": "Example.com",
        "uri": "http://example.com/"
      },
      {
        "title": "Example.org",
        "uri": "http://example.org/"
      }
    ]

    const barModel = {
      title: 'This is a great toolbar!',
      actions: [
        {
          action: "close",
          iconName: 'fa-close',
          buttonClasses: [ 'button--alert' ]
        }
      ]
    }

    const windowModel = { bar: barModel }

    const inputText1 = {
      name: 'textInput1',
      title: 'Hello',
      value: 'World',
      isRequired: true
    }
    const inputText2 = {
      name: 'textInput2',
      title: 'Hello',
      placeholder: 'World',
      isRequired: true
    }
    const inputText3 = {
      name: 'textInput3',
      title: 'Hello',
      value: 'World',
      placeholder: 'World'
    }
    const inputNumber1 = {
      name: 'numberInput1',
      title: 'Age',
      value: 36,
      min: 18,
      max: 150,
      placeholder: '65'
    }

    const inputCheckbox1 = {
      name: 'checkbox1',
      title: 'Are you a pillock?',
      isSelected: true
    }
    const inputCheckbox2 = {
      name: 'checkbox2',
      title: 'Are you awesome?'
    }

    const inputRadio1 = {
      name: 'inputRadio',
      title: 'I am a pillock',
      isSelected: true
    }
    const inputRadio2 = {
      name: 'inputRadio',
      title: 'I am not a pillock (seems unlikely but OK)'
    }

    const buttonTextModel = { action: 'home', title: 'Home' }

    const documentNode =
      document( documentModel, [
        ...allSchemasAsFields
        /*
        breadcrumb( linkModels.map( link ) ),
        headerWindow( windowModel, [
          row( radioModels.map( inputRadioIcon ) )
        ]),
        headerWindow( windowModel, [
          row( checkboxModels.map( inputCheckboxIcon ) )
        ]),
        row( [ buttonText( buttonTextModel ), buttonText( buttonTextModel ) ] ),
        composer(),
        inputFieldset( { title: 'Cool Fieldset' }, [
          inputText( inputText1 ),
          inputText( inputText2 ),
          inputText( inputText3 ),
          inputNumber( inputNumber1 ),
          inputCheckbox( inputCheckbox1 ),
          inputCheckbox( inputCheckbox2 ),
          inputFieldset( { title: 'Level of pillockery' }, [
            inputRadio( inputRadio1 ),
            inputRadio( inputRadio2 )
          ])
        ])
        */
      ]
    )

    res.component( documentNode )
  })

  app.listen( 3000, () => {
    console.log( 'CMS started' )

    resolve()
  })
}

const start = resolve =>
  getDependencies( './data' )
    .then( dependencies =>
      initApp( dependencies, resolve )
    )

const cms = {
  start: () => new Promise( start )
}

module.exports = cms
