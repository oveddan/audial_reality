import './requires/chai-extensions'

// requiring by context makes sure another other pre-source code
// execution can happen first. webpack can copy source code into test
// files, which removes the single source of truth.
const testsContext = require.context('../../src', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
