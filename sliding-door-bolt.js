// title      : Door Bolt
// author     : JAG
// license    : MIT License

const { circle, cuboid, roundedCuboid, roundedCylinder, roundedRectangle } = require('@jscad/modeling').primitives
const { rotateX, rotateY, scale, translate } = require('@jscad/modeling').transforms
const { subtract, union } = require('@jscad/modeling').booleans
const { extrudeLinear } = require('@jscad/modeling').extrusions
const { degToRad } = require('@jscad/modeling').utils
const { measureBoundingBox } = require('@jscad/modeling').measurements

const getParameterDefinitions = () => [
  { name: 'bolt', type: 'group', caption: 'Bolt' },
  { name: 'bolt_diameter', type: 'float', initial: 10.0, min: 2.0, max: 50.0, step: 1.0, caption: 'Diameter:' },
  { name: 'bolt_travel', type: 'float', initial: 45.0, min: 10.0, max: 100.0, step: 1.0, caption: 'Travel:' },
  { name: 'bolt_handle', type: 'float', initial: 30.0, min: 0.0, max: 50.0, step: 1.0, caption: 'Handle:' },
  { name: 'bolt_style', type: 'choice', initial: 'left', caption: 'Style:', values: ['left', 'right', 'both', 'none'], captions: ['Left', 'Right', 'Both', 'None'] },
  { name: 'bolt_lead', type: 'float', initial: 30.0, min: 0.0, max: 100.0, step: 1.0, caption: 'Extra Length:' },
  { name: 'base', type: 'group', caption: 'Base' },
  { name: 'base_weight', type: 'float', initial: 3.0, min: 2.0, max: 10.0, step: 1.0, caption: 'Thickness:' },
  { name: 'base_width', type: 'float', initial: 30.0, min: 10.0, max: 100.0, step: 1.0, caption: 'Width:' },
  { name: 'screw_size', type: 'float', initial: 3.0, min: 1.0, max: 10.0, step: 0.25, caption: 'Holes:' },
  { name: 'flanges', type: 'group', caption: 'Flanges' },
  { name: 'bolt_center', type: 'float', initial: 20.0, min: 5.0, max: 75.0, step: 1.0, caption: 'Bolt Center:' },
  { name: 'flange_weight', type: 'float', initial: 5.0, min: 2.0, max: 10.0, step: 1.0, caption: 'Thickness:' },
  { name: 'others', type: 'group', caption: 'Other' },
  { name: 'display', type: 'choice', initial: 'in', caption: 'Display Bolt:', values: ['zero', 'out', 'in'], captions: ['Centered', 'Extended', 'Retracted'] },
  { name: 'segments', type: 'int', initial: 18, min: 18, max: 72, step: 6, caption: 'Segments?' }
]

const scaleBy = (obj, byx, byy, byz) => {
  byx = byx || 0.0
  byy = byy || byx
  byz = byz || byx
  // get the bounds of the given object
  const bounds = measureBoundingBox(obj)
  let x = bounds[1][0] - bounds[0][0]
  let y = bounds[1][1] - bounds[0][1]
  let z = bounds[1][2] - bounds[0][2]
  // calculate the percentages required
  x = ((x / 2) + byx) / (x / 2)
  y = ((y / 2) + byy) / (y / 2)
  z = ((z / 2) + byz) / (z / 2)
  return scale([x, y, z], obj)
}

const base = (p) => {
  let x = (p.base_length) / 2
  let y = p.base_width / 2
  let rr = (p.screw_size * 1.5)
  let b = roundedRectangle({ size: [x * 2, y * 2], roundRadius: rr, segments: 18 })
  // less holes for the bolts
  rr = (p.screw_size / 2) + 0.2
  const h = circle({ radius: rr, segments: 18 })
  x = x - (p.screw_size * 1.5)
  y = y - (p.screw_size * 1.5)
  b = subtract(b, translate([x, y], h))
  b = subtract(b, translate([-x, y], h))
  b = subtract(b, translate([-x, -y], h))
  b = subtract(b, translate([x, -y], h))

  const z = p.base_weight
  b = extrudeLinear({ height: z }, b)

  return b
}

const flange = (p) => {
  const x = p.flange_weight / 2
  const y = p.base_width / 2
  const z = p.flange_height / 2
  const rr = 0.5
  const f = roundedCuboid({ size: [x * 2, y * 2, z * 2], roundRadius: rr, segments: 18 })
  // less holes for the bolts
  return f
}

const bolt = (p) => {
  const rr = 1.0
  const r = p.bolt_diameter / 2
  let x = p.bolt_round_length + rr
  // square and round parts of the bolt
  let b = roundedCylinder({ height: x, radius: r, roundRadius: rr, segments: p.segments })
  b = rotateY(degToRad(90), b)
  x = 0 - p.bolt_round_length / 2 + rr
  b = translate([x, 0, 0], b)

  x = p.bolt_square_length / 2
  const s = cuboid({ size: [x * 2, r * 2, r * 2] })
  b = union(b, translate([x, 0, 0], s))
  // add the handle
  const y = (p.bolt_handle / 2)
  let h = roundedCylinder({ height: y * 2, radius: r, roundRadius: rr, segments: p.segments })
  h = rotateX(degToRad(90), h)
  if (p.bolt_style === 'right' || p.bolt_style === 'both') {
    b = union(b, translate([-r, y, 0], h))
  }
  if (p.bolt_style === 'left' || p.bolt_style === 'both') {
    b = union(b, translate([-r, -y, 0], h))
  }
  return b
}

const main = (p) => {
  const offset = 0.20 // offset around the bolt for movement

  p.flange_gap = p.bolt_travel + p.bolt_diameter
  p.flange_height = p.bolt_center + p.bolt_diameter

  p.base_length = (p.screw_size * 3) + p.flange_weight + p.bolt_travel + p.bolt_diameter + p.flange_weight + (p.screw_size * 3)

  // calculated values
  p.bolt_square_length = p.flange_weight + p.bolt_travel
  p.bolt_round_length = p.flange_weight + p.flange_gap + p.bolt_lead
  p.bolt_total_length = p.bolt_square_length + p.bolt_round_length

  // build the parts
  let db = base(p)
  const f = flange(p)
  let b = bolt(p)
  let n = scaleBy(b, offset)
  n = translate([0, 0, p.bolt_center], n) // negative of the bolt
  b = translate([0, 0, p.bolt_center], b)
  // put this together
  let x = (p.flange_weight / 2) - (p.base_length / 2) + (p.screw_size * 3)
  const y = 0
  const z = p.flange_height / 2
  db = union(db, translate([x, y, z], f))
  x = x + p.flange_gap + p.flange_weight
  db = union(db, translate([x, y, z], f))

  db = subtract(db, n)

  if (p.display === 'out') {
    x = -(p.bolt_travel / 2) + (p.bolt_diameter / 2)
    b = translate([x, 0, 0], b)
  }
  if (p.display === 'in') {
    x = (p.bolt_travel / 2) + (p.bolt_diameter / 2)
    b = translate([x, 0, 0], b)
  }
  return [db, b]
}

module.exports = { main, getParameterDefinitions }
