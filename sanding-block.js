const { circle, rectangle, roundedRectangle } = require('@jscad/modeling').primitives
const { geom2, path2 } = require('@jscad/modeling').geometries
const { subtract, union } = require('@jscad/modeling').booleans
const { mirrorZ, rotateZ, scale, translate } = require('@jscad/modeling').transforms
const { degToRad } = require('@jscad/modeling').utils
const { extrudeFromSlices, extrudeLinear, slice } = require('@jscad/modeling').extrusions
const { hull } = require('@jscad/modeling').hulls
const { mat4 } = require('@jscad/modeling').maths
const { measureBoundingBox } = require('@jscad/modeling').measurements
const { colorize, cssColors, hexToRgb, rgbToHex } = require('@jscad/modeling').colors

const colorParameter = (options) => {
  const defaults = { name: 'color', initial: '#000000', caption: 'Color?' }
  const { name, initial, caption } = Object.assign({}, defaults, options)
  const type = 'choice'
  const values = []
  const captions = []
  for (const [key, value] of Object.entries(cssColors)) {
    captions.push(`${key}`)
    values.push(rgbToHex(value))
  }
  return { name, type, initial, caption, values, captions }
}

const getParameterDefinitions = () => {
  return [
    { name: 'paper', type: 'group', caption: 'Paper' },
    { name: 'p_thickness', type: 'float', initial: 0.95, caption: 'Thickness (mm)?', step: 0.05, min: 0.1, max: 2.0 },
    { name: 'p_length', type: 'float', initial: 230.0, caption: 'Length (mm)?', step: 1.0, min: 5.0, max: 1000.0 },
    { name: 'p_width', type: 'float', initial: 70.0, caption: 'Width (mm)?', step: 1.0, min: 1.0, max: 1000.0 },
    { name: 'p_fold', type: 'float', initial: 20.0, caption: 'End Fold (mm)?', step: 1.0, min: 1.0, max: 1000.0 },
    { name: 'p_use', type: 'checkbox', checked: true, caption: 'Use?' },
    { name: 'block', type: 'group', caption: 'Sanding Block' },
    { name: 'b_length', type: 'float', initial: 230.0, caption: 'Length (mm)?', step: 1.0, min: 5.0, max: 1000.0 },
    { name: 'b_width', type: 'float', initial: 70.0, caption: 'Width (mm)?', step: 1.0, min: 1.0, max: 1000.0 },
    { name: 'b_height', type: 'float', initial: 20.0, caption: 'Heigth (mm)?', step: 1.0, min: 1.0, max: 100.0 },
    { name: 'b_corner', type: 'float', initial: 5.0, caption: 'Corner radius (mm)?', step: 0.5, min: 1.0, max: 100.0 },
    { name: 'b_use', type: 'checkbox', checked: false, caption: 'Use?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'segments', type: 'int', initial: 32, caption: 'Resolution?' },
    colorParameter({})
  ]
}

const createGrip = (p) => {
  const r = 20 / 2
  let x = (p.b_length / 2) - p.b_slot_length - r - 2
  const g = circle({ radius: r, segments: p.segments })
  let y = 3 // offset of handle
  const g0 = hull(translate([x, y], g), translate([-x, y], g))

  const b = measureBoundingBox(g)
  const w = b[1][0] - b[0][0]
  const h = b[1][1] - b[0][1]
  x = (w - 7.0) / w
  y = (h - 7.0) / h
  const g1 = scale([x, y], g0)

  const slice0 = slice.fromSides(geom2.toSides(g0))
  let slice1 = slice.fromSides(geom2.toSides(g1))
  slice1 = slice.transform(mat4.fromTranslation(mat4.create(), [0, 0, 3]), slice1)

  const f = extrudeFromSlices({
    numberOfSlices: 2,
    callback: (p, i, b) => {
      if (i === 0) return slice0
      return slice1
    },
    slice0
  })
  return f
}

const main = (p) => {
  if (p.p_use && p.b_use) p.b_use = false // use paper by default

  if (p.p_use) {
    // calculate slot in block
    p.b_slot_length = p.p_fold + 3
    p.b_slot_thickness = p.p_thickness + 0.1
    // calculate block sizes
    p.b_height = p.p_fold
    p.b_width = p.p_width
    p.b_length = p.p_length - (2 * (p.b_slot_length + p.b_height))
    p.b_corner = p.b_height * 0.25
  }
  p.b_handle = p.b_height * 0.75

  let x = p.b_length / 2
  let y = p.b_width / 2
  let z = p.b_height / 2
  const r = p.b_corner
  let b = roundedRectangle({ size: [x * 2, z * 2], roundRadius: r, segments: p.segments })

  x = (p.b_length - (2 * p.b_corner)) / 2
  y = p.b_height / 2
  z = p.b_handle
  let p1 = path2.fromPoints({}, [[x, y]])
  p1 = path2.appendArc({ endpoint: [-x, y], radius: [x, z], segments: p.segments }, p1)
  p1 = path2.close(p1)
  const h = geom2.fromPoints(path2.toPoints(p1))

  b = union(b, h)

  x = p.b_slot_length
  y = p.b_slot_thickness / 2
  let s1 = rectangle({ size: [x * 2, y * 2] })
  let s2 = rotateZ(degToRad(-15), s1)
  s1 = rotateZ(degToRad(15), s1)
  x = p.b_length / 2
  y = p.b_height / 2
  s1 = translate([x, y], s1)
  s2 = translate([-x, y], s2)

  b = subtract(b, s1, s2)

  z = p.b_width
  b = extrudeLinear({ height: z }, b)

  const grip1 = createGrip(p)
  z = p.b_width
  let grip2 = mirrorZ(grip1)
  grip2 = translate([0, 0, z], grip2)

  b = subtract(b, grip1, grip2)

  b = colorize(hexToRgb(p.color), b)
  return b
}

module.exports = { main, getParameterDefinitions }
