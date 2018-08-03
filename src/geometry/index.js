import { loadObjectGeometry } from 'lib/objectLoader'

const getGeometry = fileName => {
  const file = require(`./objects/${fileName}.obj`)

  return loadObjectGeometry(file)
}

const geometry = {
  getSphere: () => getGeometry('sphere'),
  getPlane: () => getGeometry('plane'),
  getCube: () => getGeometry('cube'),
  getTube: () => getGeometry('tube')
}

export default geometry
