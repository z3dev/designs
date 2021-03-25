const { booleans, colors, extrusions, geometries, maths, measurements, primitives, transforms } = require('@jscad/modeling')

const { subtract, union } = booleans
const { colorize } = colors
const { extrudeFromSlices, extrudeLinear, slice } = extrusions
const { geom2, path2 } = geometries
const { mat4 } = maths
const { measureBoundingBox } = measurements
const { circle, cuboid, cylinder, rectangle, roundedCuboid } = primitives
const { center, translate } = transforms

const getParameterDefinitions = () => {
  return [
    { name: 'handle', type: 'group', caption: 'Handle' },
    { name: 'handle_offset', type: 'int', initial: 22, caption: 'Offset for fingers?' },
    { name: 'handle_thickness', type: 'int', initial: 10, caption: 'Thickness?' },
    { name: 'handle_width', type: 'int', initial: 20, caption: 'Width?' },
    { name: 'can', type: 'group', caption: 'Can' },
    { name: 'can_show', type: 'checkbox', checked: true, caption: 'Show?' },
    { name: 'can_diameter', type: 'int', initial: 66, caption: 'Diameter?' },
    { name: 'can_height', type: 'int', initial: 116, caption: 'Height?' },
    { name: 'can_lip', type: 'group', caption: 'Top Lip' },
    { name: 'can_lip_diameter', type: 'int', initial: 57, caption: 'Outside Diameter?' },
    { name: 'can_lip_thickness', type: 'float', initial: 2.0, step: 0.1, caption: 'Thickness?' },
    { name: 'can_lip_height', type: 'float', initial: 3.0, step: 0.1, caption: 'Height?' },
    { name: 'can_bot', type: 'group', caption: 'Bottom Lip' },
    { name: 'can_bot_diameter', type: 'int', initial: 53, caption: 'Outside Diameter?' },
    { name: 'can_bot_thickness', type: 'float', initial: 4.0, step: 0.1, caption: 'Thickness?' },
    { name: 'can_bot_height', type: 'float', initial: 3.0, step: 0.1, caption: 'Height?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'segments', type: 'int', initial: 36, caption: 'Segments?' }
  ]
}

// A handle for beer cans (and other cans as well)
// By JAG

const can = (p) => {
  let z = (p.can_height - p.can_lip_height - p.can_bot_height)
  let r = p.can_diameter / 2
  let c = cylinder({ height: z, radius: r, segments: p.segments })
  // top lip
  r = (p.can_lip_diameter / 2)
  let i = circle({ radius: r, segments: p.segments })
  r = (p.can_lip_diameter / 2) - p.can_lip_thickness
  let j = circle({ radius: r, segments: p.segments })
  i = extrudeLinear({ height: p.can_lip_height }, subtract(i, j))
  i = translate([0, 0, z / 2], i)
  c = union(c, i)
  // bottom rim
  r = (p.can_bot_diameter / 2)
  i = circle({ radius: r, segments: p.segments })
  r = (p.can_bot_diameter / 2) - p.can_bot_thickness
  j = circle({ radius: r, segments: p.segments })
  i = extrudeLinear({ height: p.can_bot_height }, subtract(i, j))
  i = translate([0, 0, -(z / 2) - p.can_bot_height], i)
  c = union(c, i)
  // position at 0,0,0
  const b = measureBoundingBox(c)
  z = 0 - b[0].z - ((b[1].z - b[0].z) / 2)
  c = center({}, c)
  c = colorize([0.5, 0.5, 0.5], c)
  return c
}

const top = (p) => {
  const x = p.top_r
  const y = p.handle_width / 2
  let z = p.top_h_r
  let t = roundedCuboid({ size: [x * 2, y * 2, z * 2], roundRadius: p.handle_rr, segments: p.segments })
  t = subtract(t, cuboid({ center: [-x, 0, 0], size: [x * 2, y * 2, z * 2] }))
  let r = (p.can_lip_diameter / 2) - p.can_lip_thickness - p.top_i_r
  let i = cylinder({ height: z * 2, radius: r, segments: p.segments })
  t = subtract(t, i)
  t = translate([0, 0, z], t)
  // less indent for lip
  r = (p.can_lip_diameter / 2) + 0.25
  i = circle({ radius: r, segments: p.segments })
  r = (p.can_lip_diameter / 2) - p.can_lip_thickness - 0.25
  const j = circle({ radius: r, segments: p.segments })
  z = p.can_lip_height
  i = extrudeLinear({ height: z }, subtract(i, j))
  t = subtract(t, i)
  // position
  z = p.can_z - p.can_lip_height
  t = translate([0, 0, z], t)
  return t
}

const bottom = (p) => {
  const x = p.bot_r
  let y = p.handle_width / 2
  let z = p.bot_h_r
  let b = roundedCuboid({ center: [0, 0, 0], size: [x * 2, y * 2, z * 2], roundRadius: p.handle_rr, segments: p.segments })
  b = subtract(b, cuboid({ center: [-x, 0, 0], size: [x * 2, y * 2, z * 2] }))
  let r = (p.can_bot_diameter / 2) - p.can_bot_thickness - p.bot_i_r
  let i = cylinder({ height: z * 2, radius: r, segments: p.segments })
  b = subtract(b, i)
  b = translate([0, 0, z], b)
  // less indent for rim
  r = (p.can_bot_diameter / 2) + 0.25
  i = circle({ radius: r, segments: p.segments })
  r = (p.can_bot_diameter / 2) - p.can_bot_thickness - 0.25
  const j = circle({ radius: r, segments: p.segments })
  z = (p.bot_h_r * 2) - p.bot_t
  y = p.bot_t
  i = extrudeLinear({ height: z }, subtract(i, j))
  i = translate([0, 0, y], i)
  b = subtract(b, i)
  // position
  z = 0 - p.can_z - p.bot_t
  b = translate([0, 0, z], b)
  return b
}

// the path must be centered at 0,0, and project into Y
// the number of slices is determined by the number of path segements
// each point in the path provides
// - the amount to offset the original geometry by the X axis
// - the slice thickness by the Y axis
const extrudeFromPath = (geometry, path) => {
  const points = path2.toPoints(path).slice().reverse()
  const base = slice.fromSides(geom2.toSides(geometry))
  return extrudeFromSlices({
    numberOfSlices: points.length,
    callback: (p, i, vecs) => {
      const vec = vecs[i]
      let x = vec[0]
      const y = vec[1]
      if (x < 0) x = 0.0
      const m = mat4.fromTranslation(mat4.create(), [x, 0, y])
      return slice.transform(m, base)
    }
  }, points)
}

const handle3 = (p) => {
  let z = (p.can_z * 2) + p.top_t - p.handle_rr + p.bot_t - p.handle_rr
  // create a path to follow for the shape of the handle
  let path = path2.fromPoints({}, [[0, 0]])
  path = path2.appendArc({
    endpoint: [0, -z],
    radius: [1.0, 5],
    segments: Math.round(z),
    clockwise: true,
    large: false
  }, path)

  let x = p.handle_thickness / 2
  const y = p.handle_width / 2
  let h = rectangle({ size: [x * 2, y * 2], roundRadius: p.handle_rr, segments: p.segments })

  h = extrudeFromPath(h, path)

  x = (p.can_diameter / 2) + p.handle_offset + (p.handle_thickness / 2)
  z = p.top_t - p.handle_rr + p.can_z
  h = translate([x, 0, z], h)
  return h
}

const main = (p) => {
  // p.segments = 36

  // p.can_diameter = 66
  // p.can_height = 70

  // p.can_lip_diameter  = 64  // lip outside diameter
  // p.can_lip_thickness = 2.5 // lip thickness
  // p.can_lip_height    = 2.0 // lip height

  // p.can_bot_diameter  = 67  // bottom rim diameter
  // p.can_bot_thickness = 1.5 // bottom rim thickness
  // p.can_bot_height    = 3.0 // bottom rim height

  // p.handle_offset     = 22 // handle offset from the can
  // p.handle_width      = 20 // handle width
  // p.handle_thickness  = 10 // handle thickness
  p.handle_rr = 0.25

  p.top_t = 2.0 // thickness of top above the lip
  p.top_h_r = (p.can_lip_height + p.top_t) / 2
  p.top_i_r = 2 // size of inside lip
  p.top_r = (p.can_diameter / 2) + p.handle_offset + p.handle_thickness

  p.bot_t = 2.0 // thickness of bottom below the rim
  p.bot_h_r = (p.can_bot_height + p.bot_t) / 2
  p.bot_r = (p.can_diameter / 2) + p.handle_offset + p.handle_thickness
  p.bot_i_r = 2 // size of inside lip

  // create a mock up of the can
  const c = can(p)
  const i = measureBoundingBox(c)
  p.can_x = i[1][0] // save the bounds for positioning
  p.can_y = i[1][1]
  p.can_z = i[1][2]

  // create the bottom of the holder
  const b = bottom(p)

  // create the top of the holder
  const t = top(p)

  // create the handle
  const h = union(b, t, handle3(p))

  if (p.can_show) return [h, c]
  return h
}

module.exports = { main, getParameterDefinitions }
