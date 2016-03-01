import { createRenderer } from 'react-addons-test-utils'

const renderShallow = (element, context = {}) => {
  const renderer = createRenderer()
  renderer.render(element, context)
  const output = renderer.getRenderOutput()
  return { output, renderer }
}

export default renderShallow

