const { booleans, colors, extrusions, geometries, hulls, maths, measurements, primitives, transforms, utils } = require('@jscad/modeling')

// functions that this design uses
const { subtract, union } = booleans
const { colorize, cssColors, hexToRgb, rgbToHex } = colors
const { geom2, path2 } = geometries
const { hullChain } = hulls
const { mat4 } = maths
const { measureBoundingBox } = measurements
const { circle, cuboid, cylinder, rectangle, roundedCuboid, roundedCylinder, roundedRectangle, sphere } = primitives
const { mirrorX, rotateX, rotateY, rotateZ, translate } = transforms
const { extrudeFromSlices, extrudeLinear, extrudeRotate, slice } = extrusions
const { degToRad } = utils

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
    { name: 'strap_w', type: 'int', initial: 12, caption: 'Width? (mm)' },
    { name: 'strap_t', type: 'int', initial: 1, caption: 'Thickness? (mm)' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'segments', type: 'int', initial: 32, caption: 'Segments?' },
    colorParameter({})
  ]
}

// the path must be centered at 0,0, and project into Y
// the number of slices is determined by the number of path segements
// each point in the path provides
// - the amount (X) to expand the original cag radius
// - the slice thickness (Y) to extrude
const extrudeFromPath = (cag, path) => {
  const b = measureBoundingBox(cag)
  const width = b[1][0] - b[0][0]
  const height = b[1][1] - b[0][1]

  const points = path2.toPoints(path)
  const base = slice.fromSides(geom2.toSides(cag))
  return extrudeFromSlices({
    numberOfSlices: points.length,
    callback: (p, i, vecs) => {
      const vec = vecs[i]
      const x = vec[0]
      const y = vec[1]

      const sx = (width + (x * 2)) / width
      const sy = (height + (x * 2)) / height
      const mS = mat4.fromScaling(mat4.create(), [sx, sy, 1])
      const mT = mat4.fromTranslation(mat4.create(), [0, 0, y])
      return slice.transform(mat4.multiply(mat4.create(), mS, mT), base)
    }
  }, points)
}

const rivets = (p) => {
  const balls = []
  const b = sphere({ center: [0, 0, 0], radius: p.cyl_b_r, segments: p.c_segments })
  let b1 = translate([0, p.cyl_b_p, p.cyl_b_z], b)
  balls.push(b1)
  b1 = rotateZ(degToRad(-30), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(60), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(30), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(30), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(30), b1)
  balls.push(b1)
  b1 = rotateZ(degToRad(30), b1)
  balls.push(b1)
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
  const rr = p.strap_t_r * 2
  let h = p.strap_w_r * 2
  let r = (p.buckle_w / 2) + p.strap_t_r
  let i = cylinder({ height: h, radius: r, segments: p.c_segments })
  r = (p.buckle_w / 2)
  i = subtract(i, cylinder({ height: h, radius: r, segments: p.c_segments }))

  h = p.strap_w_r + rr
  r = (p.buckle_w / 2) + p.strap_t_r + (p.buckle_w / 2)
  let e = roundedCylinder({ height: h, center: [0, 0, 0 - (h / 2) + (rr / 2)], radius: r, roundRadius: rr, segments: p.c_segments })
  const f = roundedCylinder({ height: h, center: [0, 0, 0 + (h / 2) - (rr / 2)], radius: r, roundRadius: rr, segments: p.c_segments })
  e = union(e, f)

  let b = cuboid({ center: [0, 0, 0], size: [r * 2, r * 2, (h + r) * 2] })
  b = translate([r + (p.buckle_w / 2), 0, 0], b)
  e = subtract(subtract(e, b), i)
  b = rotateY(degToRad(90), e)
  b = rotateX(degToRad(180), b)
  b = rotateZ(degToRad(90), b)
  return b
}

const createRim = (p) => {
  const x = p.rim_w_r
  const y = p.rim_w_r
  const rr1 = p.rim_c_r
  const rr2 = 1.0

  let r1 = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: rr1, segments: p.c_segments })
  r1 = subtract(r1, rectangle({ center: [0, y - rr2], size: [x * 2, y * 2] }))
  let r2 = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: rr2, segments: p.c_segments })
  r2 = translate([0, -y], r2)
  r2 = subtract(r2, rectangle({ center: [0, -y - rr2 - 0.1], size: [x * 2, y * 2] }))
  r1 = union(r1, r2)

  r1 = translate([p.rim_r - (p.rim_w_r / 2), 0], r1)
  const rim = extrudeRotate({ segments: p.segments }, r1)
  return rim
}

const createCylinder = (p) => {
  // create a path for extruding a circle into a rounded cylinder
  let x = 0
  let y = 0
  const rr = p.cyl_g_t

  let path = path2.fromPoints({}, [[x, y]])
  y += p.cyl_g_z - rr
  path = path2.appendPoints([[x, y]], path)
  x -= rr
  y += rr
  path = path2.appendArc({ endpoint: [x, y], radius: [rr, rr], xaxisrotation: degToRad(90), clockwise: false, large: false, segments: p.c_segments }, path)
  y += p.cyl_g_h
  path = path2.appendPoints([[x, y]], path)
  x += rr
  y += rr
  path = path2.appendArc({ endpoint: [x, y], radius: [rr, rr], xaxisrotation: degToRad(90), clockwise: false, large: false, segments: p.c_segments }, path)
  y = p.cyl_h - rr
  path = path2.appendPoints([[x, y]], path)
  x -= rr
  y += rr
  path = path2.appendArc({ endpoint: [x, y], radius: [rr, rr], xaxisrotation: degToRad(90), clockwise: false, large: false, segments: p.c_segments }, path)

  let c = circle({ radius: p.cyl_r, segments: p.segments })
  c = extrudeFromPath(c, path)
  return c
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
  p.rim_width = p.glasses_width * 0.065 // rim with is propotional to width of glasses
  p.rim_w_r = p.rim_width / 2
  p.rim_d = (p.glasses_width / 2) + (p.rim_w_r)
  p.rim_r = p.rim_d / 2
  p.rim_t = p.rim_width * 0.75 // rim thickness is proportional to rim width
  p.rim_c_r = 1.5

  // create the rim
  let r1 = createRim(p)

  // calculate the cylinder properties
  p.cyl_h = p.glasses_width * 0.200 // height of cylinder is proportional to width of glasses
  p.cyl_t = 2.2 // thickness of cylinder, thin is better
  p.cyl_r = p.rim_r
  p.cyl_g_h = p.cyl_h * 0.15 // inset gap is proportional to cylinder height
  p.cyl_g_t = 1 // thickness of inset gap
  p.cyl_g_z = p.cyl_h * 0.5 - (p.cyl_g_h / 2) // position of inset gap on cylinder
  p.cyl_b_r = p.cyl_g_h * 0.70 // size of balls for the cylinder rivets
  p.cyl_b_z = p.cyl_b_r + 1 // position of rivets on cylinder
  p.cyl_b_p = p.cyl_r - p.cyl_b_r + (p.cyl_b_r * 0.70)
  p.buckle_w = 2
  p.strap_w_r = (p.strap_w / 2) + 0.5
  p.strap_t_r = (p.strap_t / 2) + 0.5
  p.strap_z = p.cyl_h - p.strap_t_r - p.buckle_w
  p.buckle_r = (p.strap_t_r * 2) + (p.cyl_t / 2)
  p.buckle_l = (p.buckle_w * 2) + (p.strap_w_r * 2) - (p.buckle_r * 2)
  p.buckle_l_r = p.buckle_l / 2

  // create the cylinder
  let c = createCylinder(p)
  c = union(c, rivets(p))

  // remove the gap (ring around the outside)
  // let cg = cylinder({ center: [0, 0, (p.cyl_g_z / 2) + p.cyl_g_z], height: p.cyl_g_z, radius: p.cyl_r, segments: p.segments })
  // let ci = cylinder({ center: [0, 0, (p.cyl_g_z / 2) + p.cyl_g_z], height: p.cyl_g_z, radius: p.cyl_r-p.cyl_g_t, segments: p.segments })
  // cg = subtract(cg, ci)

  // add the buckle
  const r = (p.buckle_w / 2) + p.strap_t_r
  let b = cuboid({ center: [0, 0, 0], size: [r * 2, p.strap_w_r * 2, r * 2] })
  b = translate([-(p.cyl_r - p.cyl_t + (p.buckle_w / 2)), 0, p.cyl_h - (p.buckle_w / 2)], b)
  c = subtract(c, b)
  b = buckle(p)
  b = translate([-(p.cyl_r - p.cyl_t + (p.buckle_w / 2)), 0, p.cyl_h - (p.buckle_w / 2)], b)
  c = union(c, b)

  // remove the interior
  const ci = cylinder({ center: [0, 0, p.cyl_h / 2], height: p.cyl_h + 0.5, radius: p.cyl_r - p.cyl_t, segments: p.segments })
  c = subtract(c, ci)

  r1 = union(r1, c)

  let r2 = mirrorX(r1)
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
