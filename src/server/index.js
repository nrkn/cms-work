'use strict'

const express = require( 'express' )
const templateEngine = require( './templateEngine' )
const getDependencies = require( './fileSystem/getDependencies' )
const ComponentApi = require( '../components/componentApi' )
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

    const componentApi = ComponentApi( dependencies )

    const {
      Document, Row, InputRadioIcon, InputCheckboxIcon, LinkList, Breadcrumb,
      Link, Composer, HeaderBar, HeaderWindow, InputText, ButtonText,
      InputFieldset, InputNumber, InputCheckbox, InputRadio
    } = componentApi

    const document = {
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

    const inputs = [
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

    const radios = inputs.map(
      ( input, i ) => Object.assign(
        {
          name: 'radios',
          isSelected: i === 0
        },
        input
      )
    )

    const checkboxes = inputs.map(
      ( input, i ) => Object.assign(
        {
          name: 'checkboxes',
          isSelected: i === 0
        },
        input
      )
    )

    const links = [
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

    const bar = {
      title: 'This is a great toolbar!',
      actions: [
        {
          action: "close",
          iconName: 'fa-close',
          buttonClasses: [ 'button--alert' ]
        }
      ]
    }

    const window = { bar }

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

    const buttonText = { action: 'home', title: 'Home' }

    const documentNode =
      Document( document, [
        Breadcrumb( links.map( Link ) ),
        /*
        HeaderWindow( window, [
          Row( radios.map( InputRadioIcon ) )
        ]),
        HeaderWindow( window, [
          Row( checkboxes.map( InputCheckboxIcon ) )
        ]),
        */
        Row( [ ButtonText( buttonText ), ButtonText( buttonText ) ] ),
        //Composer(),
        InputFieldset( { title: 'Cool Fieldset' }, [
          InputText( inputText1 ),
          InputText( inputText2 ),
          InputText( inputText3 ),
          InputNumber( inputNumber1 ),
          InputCheckbox( inputCheckbox1 ),
          InputCheckbox( inputCheckbox2 ),
          InputFieldset( { title: 'Level of pillockery' }, [
            InputRadio( inputRadio1 ),
            InputRadio( inputRadio2 )
          ])
        ])
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
