'use strict'

const abstractComposer = require( './abstract-composer' )

// entry point for everything bundled for browser
const init = () => window.alert( 'Hello, world!' )

window.mojule = { init, abstractComposer }
