'use strict'

const fs = require( 'fs' )
const pify = require( 'pify' )
const KitchenSink = require( '../data/kitchen-sink' )
const kitchenSinkModel = require( '../data/kitchen-sink.json' )
const Templating = require( 'templating' )

const writeFile = pify( fs.writeFile )

KitchenSink()
  .then( kitchenSink => {
    const templates = Templating.getTemplates( kitchenSink )

    const templating = Templating( templates )

    const populated = templating( 'kitchen-sink', kitchenSinkModel )

    const html = populated.stringify()

    return html
  })
  .then( html =>
    writeFile( './data/kitchen-sink-populated.html', html, 'utf8' )
  )
  .catch( console.error )
