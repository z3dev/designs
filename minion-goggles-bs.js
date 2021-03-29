const { booleans, colors, extrusions, hulls, primitives, transforms, utils } = require('@jscad/modeling')

const { circle, cuboid, cylinder, rectangle, roundedCuboid, roundedCylinder, roundedRectangle } = primitives
const { mirrorX, rotateX, rotateY, rotateZ, translate } = transforms
const { subtract, union } = booleans
const { extrudeLinear, extrudeRotate } = extrusions
const { degToRad } = utils
const { hullChain } = hulls
const { colorize, cssColors, hexToRgb, rgbToHex } = colors

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

const getParameterDefinitions = () => [
  { name: 'face', type: 'group', caption: 'Face Dimensions' },
  { name: 'pupils_d', type: 'int', initial: 65, caption: 'Distance between pupils? (mm)' },
  { name: 'face_d', type: 'int', initial: 140, caption: 'Distance across cheek bones? (mm)' },
  { name: 'forehead_f', type: 'int', initial: 30, caption: 'Distance across flat area of forehead? (mm)' },
  { name: 'nose', type: 'group', caption: 'Nose Dimensions' },
  { name: 'nose_width', type: 'int', initial: 26, caption: 'Width across nostrals? (mm)' },
  { name: 'nose_height', type: 'int', initial: 23, caption: 'Height of bridge? (mm)' },
  { name: 'nose_angle', type: 'int', initial: 30, caption: 'Angle of bridge? (mm)' },
  { name: 'nose_offset', type: 'int', initial: 10, caption: 'Start point of bridge? (mm)' },
  { name: 'strap', type: 'group', caption: 'Straps' },
  { name: 'strap_w', type: 'int', initial: 15, caption: 'Width? (mm)' },
  { name: 'strap_t', type: 'int', initial: 1, caption: 'Thickness? (mm)' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'segments', type: 'int', initial: 36, caption: 'Segments?' },
  colorParameter({})
]

const rivets = (p) => {
  const balls = []
  const rr = p.rim_b_r * 0.8
  let b = roundedCylinder({ height: p.rim_b_r * 2, radius: p.rim_b_r, roundRadius: rr, segments: p.c_segments })
  b = rotateX(degToRad(90), b)
  let b1 = translate([0, p.rim_b_p, p.rim_b_z], b)
  balls.push(b1)
  b1 = rotateZ(degToRad(-45), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(90), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(45), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(45), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(45), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(45), b1) // removed in order to render a better nose
  // balls.push(b1)
  return balls
}

const nose = (p) => {
  const x = p.nose_w_r * 3
  const y = -(p.nose_r * 2)
  let n = hullChain(
    circle({ center: [0, p.nose_h], radius: p.nose_r, segments: p.segments }),
    circle({ center: [-p.nose_w_r, 0], radius: p.nose_r, segments: p.segments }),

    circle({ center: [-x, y], radius: p.nose_r, segments: p.segments }),
    circle({ center: [+x, y], radius: p.nose_r, segments: p.segments }),

    circle({ center: [+p.nose_w_r, 0], radius: p.nose_r, segments: p.segments }),
    circle({ center: [0, p.nose_h], radius: p.nose_r, segments: p.segments })
  )
  n = extrudeLinear({ height: p.face_l_r }, n)
  n = rotateX(degToRad(-90), n)
  n = translate([p.face_x, p.nose_y, p.nose_z], n)
  return n
}

const buckle = (p) => {
  const ri = (p.buckle_w / 2) + p.strap_t_r + 0.5
  let i = cylinder({ height: p.strap_w_r * 2, radius: ri, segments: p.c_segments })
  let r = (p.buckle_w / 2)
  i = subtract(i, cylinder({ height: p.strap_w_r * 2, radius: r, segments: p.c_segments }))
  r = ri + (p.buckle_w / 2)
  const h = p.strap_w_r
  const cr = r * 0.60
  let z = (p.strap_w_r + cr + cr) / 2
  const c = roundedCylinder({ radius: r, roundRadius: cr, height: z * 2, segments: p.c_segments })
  z = p.strap_w_r / 2 + 0.5
  let e = translate([0, 0, -z], c)
  e = union(e, translate([0, 0, z], c))
  let b = cuboid({ center: [0, 0, 0], size: [r * 2, r * 2, (h + r) * 2] })
  b = translate([r + (p.buckle_w / 2), 0, 0], b)
  e = subtract(e, b, i)
  b = rotateY(degToRad(90), e)
  b = rotateX(degToRad(180), b)
  b = rotateZ(degToRad(90), b)
  return b
}

const main = (p) => {
  // parameters
  p.c_segments = p.segments / 2
  // p.forehead_f = 10 // width of forehead, flat space only
  p.face_radius = (p.face_d - p.forehead_f) / 2 // radius of forehead, across temples
  // p.nose_width = 26 // width of nose
  // p.nose_height = 23 // height of nose
  // p.nose_angle = 40 // angle of nose
  // p.nose_offset = 5 // start of nose, typically slightly higher from pupils

  // calculate rim properties
  p.glasses_width = p.pupils_d * 2.0 // total width of glasse is propotional to distance between pupils
  p.rim_width = p.glasses_width * 0.125 // rim with is propotional to width of glasses
  p.rim_w_r = p.rim_width / 2
  p.rim_d = (p.glasses_width / 2) + (p.rim_w_r)
  p.rim_r = p.rim_d / 2
  p.rim_t = p.rim_width * 0.95 // rim thickness is proportional to rim width
  p.rim_c_r = (p.rim_t / 2) * 0.75
  p.rim_b_r = p.rim_c_r * 0.50 // size of balls for the rivets
  p.rim_b_z = 0 - p.rim_b_r - 0.0 // Z position of rivets on the rim
  p.rim_b_p = p.rim_r + p.rim_w_r - (p.rim_w_r / 2) - (p.rim_b_r * 0.25) // R position of rivets on the rim

  // create the rim
  let r1 = roundedRectangle({ size: [p.rim_w_r * 2, p.rim_w_r * 2], roundRadius: p.rim_c_r, segments: p.c_segments })
  let r2 = roundedRectangle({ size: [p.rim_w_r * 2, p.rim_w_r * 2], roundRadius: p.rim_c_r / 4, segments: p.c_segments })
  const r3 = rectangle({ size: [p.rim_w_r * 2, p.rim_w_r * 2] })
  r1 = subtract(r1, translate([-p.rim_w_r, 0], r3))
  r2 = subtract(r2, translate([p.rim_w_r, 0], r3))
  r1 = union(r1, r2)
  r1 = translate([p.rim_r - (p.rim_w_r / 2), 0], r1)
  r1 = extrudeRotate({ segments: p.segments }, r1)
  r1 = subtract(r1, cuboid({ center: [0, 0, p.rim_w_r], size: [p.glasses_width * 2, p.glasses_width * 2, p.rim_w_r * 2] }))
  r1 = union(r1, rivets(p))

  // calculate the cylinder properties
  p.cyl_h = p.glasses_width * 0.190 // height of cylinder is proportional to width of glasses
  p.cyl_t = 2.2 // thickness of cylinder, thin is better
  p.cyl_r = p.rim_r * 0.95
  p.cyl_g_h = p.cyl_h * 0.15 // inset gap is proportional to cylinder height
  p.cyl_g_t = 1 // thickness of inset gap
  p.cyl_g_z = p.cyl_g_h * 3.0 // position of inset gap on cylinder
  p.buckle_w = 2
  p.strap_w_r = (p.strap_w / 2) + 0.5
  p.strap_t_r = (p.strap_t / 2) + 0.5
  p.strap_z = p.cyl_h - p.strap_t_r - p.buckle_w
  p.buckle_r = (p.strap_t_r * 2) + (p.cyl_t / 2)
  p.buckle_l = (p.buckle_w * 2) + (p.strap_w_r * 2) - (p.buckle_r * 2)
  p.buckle_l_r = p.buckle_l / 2

  // create the cylinder
  let c = cylinder({ center: [0, 0, p.cyl_h / 2], height: p.cyl_h, radius: p.cyl_r, segments: p.segments })

  // add the buckle
  const r = (p.buckle_w / 2) + p.strap_t_r
  let b = cuboid({ size: [r * 2, p.strap_w_r * 2, r * 2] })
  b = translate([-(p.cyl_r - p.cyl_t + (p.buckle_w / 2)), 0, p.cyl_h - (p.buckle_w / 2)], b)
  c = subtract(c, b)
  b = buckle(p)
  b = translate([-(p.cyl_r - p.cyl_t + (p.buckle_w / 2)), 0, p.cyl_h - (p.buckle_w / 2)], b)
  c = union(c, b)

  // remove the interior
  const ci = cylinder({ center: [0, 0, p.cyl_h / 2], height: p.cyl_h + 0.5, radius: p.cyl_r - p.cyl_t, segments: p.segments })
  c = subtract(c, ci)

  r1 = union(r1, c)

  r2 = mirrorX(r1)
  r2 = translate([p.pupils_d, 0, 0], r2)
  r1 = union(r1, r2)

  // create a face
  p.face_w_r = p.face_d / 2
  p.face_t_r = p.face_radius
  p.face_l_r = p.rim_d * 2
  p.face_x = p.pupils_d / 2
  p.face_z = p.face_t_r + p.cyl_g_z + p.cyl_g_h

  let f = roundedCuboid({ center: [p.face_x, 0, p.face_z], size: [p.face_w_r * 2, p.face_l_r * 2, p.face_t_r * 2], roundRadius: (p.face_t_r - 1), segments: p.c_segments })

  // add the nose
  p.nose_r = 6 // TBD calculate this
  p.nose_w_r = (p.nose_width / 2) - p.nose_r // TBD calculate this
  p.nose_h = p.nose_height - p.nose_r - p.nose_r // TBD calculate this
  p.nose_r = 5 // TBD calculate this
  p.nose_z = p.nose_h + p.nose_r + p.cyl_g_z + p.cyl_g_h
  p.nose_y = -(p.face_l_r / 2)

  let n = nose(p)
  n = rotateX(degToRad(p.nose_angle), n)
  n = translate([0, p.nose_offset, 0], n)

  f = union(f, n)

  r1 = subtract(r1, f)
  r1 = colorize(hexToRgb(p.color), r1)
  return r1
}

module.exports = { main, getParameterDefinitions }
