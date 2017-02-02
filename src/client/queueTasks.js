'use strict'

const queueTasks = ( items, fn ) => {
  const modalEl = document.querySelector( '.modal' )
  const progressContainerEl = document.querySelector( '.progress' )
  const progressEl = progressContainerEl.querySelector( 'progress' )

  const max = items.length
  let current = 0

  modalEl.classList.remove( 'modal--hidden' )
  progressContainerEl.classList.remove( 'progress--hidden' )

  progressEl.setAttribute( 'max', max )
  progressEl.setAttribute( 'value', current )

  items = items.slice()

  const next = () => {
    if( items.length === 0 ){
      modalEl.classList.add( 'modal--hidden' )
      progressContainerEl.classList.add( 'progress--hidden' )

      return
    }

    const item = items.shift()

    fn( item )
    current++
    progressEl.setAttribute( 'value', current )
    progressEl.innerHTML = `${ current } / ${ max }`

    window.setTimeout( next, 0 )
  }

  next()
}

module.exports = queueTasks
