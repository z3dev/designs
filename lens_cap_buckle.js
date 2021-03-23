const { booleans, extrusions, primitives, transforms, utils } = require('@jscad/modeling')

const { subtract, union } = booleans
const { extrudeLinear } = extrusions
const { circle, rectangle } = primitives
const { rotateZ, translate } = transforms
const { degToRad } = utils

const capmount = (p) => {
  // NOTE: All calculations are radius
  const baseRadius = p.lens_radius + p.mount_width
  const innerRadius = p.lens_radius - p.mount_width

  // generate the base of the mount
  let a1 = circle({ radius: baseRadius, segments: p.segments })
  if (p.buckle_fill === 'hollow') {
    // remove the fill
    let a2 = circle({ radius: innerRadius, segments: p.segments })
    a1 = subtract(a1, a2)
    // generate extra base support
    a2 = rectangle({ size: [(baseRadius - 1) * 2, p.mount_width] })
    a2 = rotateZ(degToRad(-45), a2)
    a1 = union(a1, a2)
    a2 = rectangle({ size: [(baseRadius - 1) * 2, p.mount_width] })
    a2 = rotateZ(degToRad(45), a2)
    a1 = union(a1, a2)
  }
  a1 = extrudeLinear({ height: p.mount_base }, a1)

  // generate the mount
  let b1 = circle({ radius: baseRadius, segments: p.segments })
  const b2 = circle({ radius: p.lens_radius, segments: p.segments })
  b1 = subtract(b1, b2)
  b1 = extrudeLinear({ height: p.mount_base + p.mount_height }, b1)

  // add the lips if any to the mount
  let b3 = circle({ radius: baseRadius, segments: p.segments })
  const b4 = circle({ radius: p.lens_radius - p.mount_lip_width, segments: p.segments })
  b3 = subtract(b3, b4)
  b3 = extrudeLinear({ height: p.mount_lip_height }, b3)

  let xheight = (p.mount_base + p.mount_height)
  for (let i = 0; i < p.mount_lip_count; i++) {
    xheight -= p.mount_lip_height
    b1 = union(b1, translate([0, 0, xheight], b3))
    xheight -= p.mount_lip_spacing
  }

  return union(a1, b1)
}

const buckle = (p) => {
  // NOTE: All calculations are radius
  // same as above for the mount
  const baseRadius = p.lens_radius + p.mount_width

  const radiusInner = baseRadius + p.buckle_gap
  const radiusOuter = radiusInner + p.buckle_thickness

  const squareInner = p.strap_width / 2
  const squareOuter = squareInner + p.buckle_thickness

  // sides of the buckle
  let b3 = rectangle({ size: [radiusOuter * 2 * 2, radiusOuter * 2 * 2] })
  b3 = subtract(b3, rectangle({ size: [radiusOuter * 2 * 2, squareInner * 2] }))

  // inner circle - trimmed to inside buckle width
  let b1 = circle({ radius: radiusInner, segments: p.segments })
  b1 = subtract(b1, b3)

  // inner - buckle split if necessary
  if (p.buckle_split > 0) {
    b1 = union(b1, rectangle({ size: [radiusOuter * 2 * 2, p.buckle_split * 2] }))
  }

  // sides of the buckle
  b3 = rectangle({ size: [radiusOuter * 2 * 2, radiusOuter * 2 * 2] })
  b3 = subtract(b3, rectangle({ size: [radiusOuter * 2 * 2, squareOuter * 2] }))

  // outer circle - trimmed to outside of buckle
  let b2 = circle({ radius: radiusOuter, segments: p.segments })
  b2 = subtract(b2, b3)

  // outer circle - innner circle
  b3 = subtract(b2, b1)

  return extrudeLinear({ height: p.mount_base }, b3)
}

const getParameterDefinitions = () => {
  return [
    { name: 'lens', type: 'group', caption: 'Lens' },
    { name: 'lens_diameter', type: 'int', initial: 77, caption: 'Diameter (mm)?' },
    { name: 'strap', type: 'group', caption: 'Strap' },
    { name: 'strap_width', type: 'int', initial: 40, caption: 'Width (mm)?' },
    { name: 'buckle', type: 'group', caption: 'Buckle' },
    { name: 'buckle_gap', type: 'int', initial: 6, caption: 'Gap for strap (mm)?' },
    { name: 'buckle_split', type: 'int', initial: 0, caption: 'Split for strap (mm or 0)?' },
    { name: 'buckle_fill', type: 'choice', initial: 'hollow', caption: 'Base?', values: ['hollow', 'solid'], captions: ['Hollow', 'Solid'] },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'segments', type: 'int', initial: 36, min: 16, max: 144, caption: 'Segments?' }
  ]
}

const main = (parameters) => {
  const tolerance = 0.35 // XY precision of 3D printer

  // set additional parameters
  parameters.buckle_thickness = 6 // thickness of buckle

  parameters.mount_width = 4.0 // width of ring
  parameters.mount_base = 3.0 // height of mount base
  parameters.mount_height = 4.0 // height of mount

  parameters.mount_lip_width = 0.2 // width of lip tip (to help secure cap)
  parameters.mount_lip_height = 0.2 // lip tip height (to help secure cap)
  parameters.mount_lip_spacing = 0.4 // distance between lips
  parameters.mount_lip_count = 3 // number of lips to generate

  parameters.lens_radius = (parameters.lens_diameter - tolerance) / 2

  const v1 = capmount(parameters)
  const v2 = buckle(parameters)
  return union(v1, v2)
}

module.exports = { main, getParameterDefinitions }
