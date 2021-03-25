const { booleans, extrusions, primitives, transforms } = require('@jscad/modeling')

const { subtract, union } = booleans
const { extrudeLinear } = extrusions
const { roundedCuboid, roundedRectangle } = primitives
const { rotateX, translate } = transforms

const getParameterDefinitions = () => {
  return [
    { name: 'bottoms', type: 'group', caption: 'Bottom' },
    { name: 'bottom_show', type: 'checkbox', caption: 'Show?', checked: true },
    { name: 'bottom_thickness', type: 'float', initial: 2.0, step: 0.5, caption: 'Thickness?' },
    { name: 'bottom_length', type: 'int', initial: 150, caption: 'Length?' },
    { name: 'bottom_width', type: 'int', initial: 100, caption: 'Width?' },
    { name: 'sides', type: 'group', caption: 'Sides' },
    { name: 'side_thickness', type: 'float', initial: 2.0, caption: 'Thickness?', min: 1.0, step: 0.1 },
    { name: 'side_height', type: 'int', initial: 50, caption: 'Height?', step: 5, min: 5 },
    { name: 'corner_radius', type: 'float', initial: 0.50, caption: 'Corners?', step: 0.5, min: 0.5 },
    { name: 'tops', type: 'group', caption: 'Top' },
    { name: 'top_show', type: 'checkbox', caption: 'Show?', checked: true },
    { name: 'top_thickness', type: 'float', initial: 2.0, caption: 'Thickness?', step: 0.5, min: 1.0 },
    { name: 'top_height', type: 'int', initial: 35, caption: 'Height?', step: 5, min: 5 },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'explode', type: 'checkbox', caption: 'Explode?', checked: false },
    { name: 'segments', type: 'int', initial: 36, caption: 'Segments:' }
  ]
}

// A simple design for a box with a top
// By JAG

const main = (p) => {
  p.tolerence = 0.25

  p.bottom_thickness_r = p.bottom_thickness / 2
  p.bottom_length_r = p.bottom_length / 2
  p.bottom_width_r = p.bottom_width / 2

  p.top_thickness_r = p.top_thickness / 2
  p.top_length = p.bottom_length + (p.top_thickness * 2) + (p.tolerence * 2)
  p.top_width = p.bottom_width + (p.top_thickness * 2) + (p.tolerence * 2)

  const shown = []
  if (p.bottomw_show === false & p.top_show === false) {
    p.bottom_show = true
    p.top_show = true
  }

  // create the bottom
  let b = roundedCuboid({ size: [p.bottom_length, p.bottom_width, p.bottom_thickness], roundRadius: p.corner_radius, segments: p.segments })

  // create the sides for the bottom
  let o = roundedRectangle({ size: [p.bottom_length, p.bottom_width], roundRadius: p.corner_radius, segments: p.segments })
  let i = roundedRectangle({ size: [p.bottom_length - (p.side_thickness * 2), p.bottom_width - (p.side_thickness * 2)], roundRadius: p.corner_radius, segments: p.segments })
  o = subtract(o, i)
  o = extrudeLinear({ height: p.side_height - p.corner_radius }, o)

  b = union(b, o)

  // create the top
  let t = roundedCuboid({ size: [p.top_length, p.top_width, (p.top_thickness * 2)], roundRadius: p.corner_radius, segments: p.segments })

  // create the sides for the top
  o = roundedRectangle({ size: [p.top_length, p.top_width], roundRadius: p.corner_radius, segments: p.segments })
  i = roundedRectangle({ size: [p.top_length - (p.top_thickness * 2), p.top_width - (p.top_thickness * 2)], roundRadius: p.corner_radius, segments: p.segments })
  o = subtract(o, i)
  o = extrudeLinear({ height: p.top_height - p.corner_radius }, o)

  t = union(t, o)

  if (p.explode === true) {
    b = translate([0, p.bottom_width_r + p.side_thickness + p.top_thickness, p.bottom_thickness_r], b)
    t = translate([0, -p.bottom_width_r - p.side_thickness - p.top_thickness, p.top_thickness_r], t)
  } else {
    t = translate([0, 0, p.top_thickness_r + p.side_height + p.tolerence], rotateX(Math.PI, t))
  }
  if (p.bottom_show === true) {
    shown.push(b)
  }
  if (p.top_show === true) {
    shown.push(t)
  }

  return shown
}

module.exports = { main, getParameterDefinitions }
