import App from 'src/app'
import { expect } from 'chai'
import renderShallow from 'render-shallow'
import React from 'react'

describe('App', () => {
  let component

  before(() => {
    component = renderShallow(<App />).output
  })

  it('exists', () => {
    expect(component).to.be.ok
  })

})

