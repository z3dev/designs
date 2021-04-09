const { booleans, colors, extrusions, geometries, hulls, maths, measurements, primitives, transforms, utils } = require('@jscad/modeling')

const { arc, circle, roundedRectangle } = primitives
const { measureBoundingBox } = measurements
const { geom2, path2 } = geometries
const { extrudeFromSlices, extrudeLinear, slice } = extrusions
const { mat4 } = maths
const { degToRad } = utils
const { rotateX, rotateY, rotateZ, translate } = transforms
const { subtract, union } = booleans
const { hull } = hulls
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
  { name: 'rendering', type: 'group', caption: 'Render' },
  { name: 'showscreen', type: 'checkbox', checked: true, caption: 'Touch Screen?' },
  { name: 'showhome', type: 'checkbox', checked: true, caption: 'Home Buttom?' },
  { name: 'showfrontcam', type: 'checkbox', checked: true, caption: 'Front Camera?' },
  { name: 'showfrontsen', type: 'checkbox', checked: true, caption: 'Front Sensor?' },
  { name: 'showfrontspk', type: 'checkbox', checked: true, caption: 'Front Speaker?' },
  { name: 'showringsilent', type: 'checkbox', checked: true, caption: 'Ring/Silent Switch?' },
  { name: 'showvolume', type: 'checkbox', checked: true, caption: 'Volume Switches?' },
  { name: 'showpower', type: 'checkbox', checked: true, caption: 'Power Switch?' },
  { name: 'showsim', type: 'checkbox', checked: true, caption: 'Sim Slot?' },
  { name: 'showheadphone', type: 'checkbox', checked: true, caption: 'Headphone?' },
  { name: 'showlight', type: 'checkbox', checked: true, caption: 'Power Port?' },
  { name: 'showmic', type: 'checkbox', checked: true, caption: 'Bottom Microphones?' },
  { name: 'showspeaker', type: 'checkbox', checked: true, caption: 'Bottom Speaker?' },
  { name: 'showcamera', type: 'checkbox', checked: true, caption: 'Back Camera?' },
  { name: 'showflash', type: 'checkbox', checked: true, caption: 'Back Flash?' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'segments', type: 'int', initial: 36, caption: 'Segments?' },
  colorParameter({})
]

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

const iPhone6S = (p) => {
  // body
  p.i_x = 67.10
  p.i_y = 138.30
  p.i_zr = 7.10 / 2 // radius of thickness
  p.i_cr = 10.00 // radius of corners
  // screen
  p.s_x = 59.00 // screen
  p.s_y = 105.00
  p.s_cr = 0.50 / 2
  p.s_o = 16.50 // offset of screen from bottom of body
  // home button
  p.hm_r = 11.00 / 2 // radius of home button
  p.hm_o = 1.00 // offset of home button from screen
  // front speaker
  p.fs_x = 10.50
  p.fs_y = 1.00
  p.fs_o = 7.50 // offset of front speaker from screen (center)
  // front camera
  p.fc_r = 2.00 / 2
  p.fc_o = 10.50 // offset of front camera from screen (center) CHANGE
  // front sensor
  p.fe_r = 1.60 / 2
  p.fe_o = 4.00 // offset of front sensor from speaker (center)
  // bottom lightning port
  p.bl_x = 8.50
  p.bl_y = 3.00
  // bottom microphone(s)
  p.bm_r = 1.50 / 2
  p.bm_o = 15.50 // offset from body center (center)
  p.bm_p = 12.00 // offset from body center (center)
  // bottom headphone port
  p.bh_r = 4.00 / 2
  p.bh_o = 5.00 // offset from microphone (center)
  // bottom speaker(s)
  p.bs_r = 1.5 / 2
  p.bs_o = 11.00 / 5
  // left side ring/silent swicth
  p.rs_x = 6.00
  p.rs_y = 2.00
  p.rs_o = 17.50 // offset from top edge
  // left side volume buttons
  p.vs_x = 23.00
  p.vs_y = 2.50
  p.vs_o = 5.50 // offset from ring/slient switch
  //  right side power switch
  p.ps_x = 11.00 // power switch
  p.ps_y = 2.50
  p.ps_o = 29.00 // offset from top edge
  // rigth side sim slot
  p.ss_x = 15.50 // sim slot
  p.ss_y = 2.50
  p.ss_o = 12.50 // offset from power button
  // back camera
  p.bc_r = 7.00 / 2 // back camera
  p.bc_z = 1.00
  p.bc_o = 13.00 // offset from left side of body (center)
  p.bc_p = 7.00 // offset from top edge of body (center)
  // back sensor
  p.be_r = 1.50 / 2 // back sensor
  p.be_o = 6.00 // offset from camera (center)
  // back flash
  p.bf_r = 4.00 / 2 // back flash
  p.bf_o = 3.75 // offset from back sensor (center)
}

const makeScreen = (p) => {
  const x = p.s_x / 2
  let y = p.s_y / 2
  let b = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: p.s_cr, segments: p.segments })
  let z = 1.0
  b = extrudeLinear({ height: z }, b)
  y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o
  z = p.i_zr - z
  b = translate([0, y, z], b)
  return b
}

const makeHome = (p) => {
  const r = p.hm_r
  let b = circle({ center: [0, 0], radius: r, segments: p.segments })
  b = subtract(b, circle({ center: [0, 0], radius: r - 1, segments: p.segments }))
  let z = 1.0
  b = extrudeLinear({ height: z }, b)
  const y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o - (p.s_y / 2) - p.hm_r - p.hm_o
  z = p.i_zr - z
  b = translate([0, y, z], b)
  return b
}

const makeFrontSpeaker = (p) => {
  const r = p.fs_y / 2
  const x = p.fs_x / 2 - r
  const a = circle({ center: [-x, 0], radius: r, segments: 16 })
  let b = circle({ center: [+x, 0], radius: r, segments: 16 })
  b = hull(a, b)
  let z = 1.0
  b = extrudeLinear({ height: 1.0 }, b)
  const y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o + (p.s_y / 2) + p.fs_o
  z = p.i_zr - z
  b = translate([0, y, z], b)
  return b
}

const makeFrontCamera = (p) => {
  const r = p.fc_r
  let b = circle({ center: [0, 0], radius: r, segments: p.segments })
  let z = 1.0
  b = extrudeLinear({ height: z }, b)
  const y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o + (p.s_y / 2) + p.fs_o
  const x = 0 - p.fc_o - p.fc_r
  z = p.i_zr - z
  b = translate([x, y, z], b)
  return b
}

const makeFrontSensor = (p) => {
  const r = p.fe_r
  let b = circle({ center: [0, 0], radius: r, segments: p.segments })
  let z = 1.0
  b = extrudeLinear({ height: 1.0 }, b)
  const y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o + (p.s_y / 2) + p.fs_o + p.fe_o
  z = p.i_zr - z
  b = translate([0, y, z], b)
  return b
}

const makeLightning = (p) => {
  const r = p.bl_y / 2
  const x = p.bl_x / 2 - r
  const a = circle({ center: [-x, 0], radius: r, segments: 16 })
  let b = circle({ center: [+x, 0], radius: r, segments: 16 })
  b = hull(a, b)
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateX(degToRad(-90), b)
  const y = (-p.i_y / 2)
  b = translate([0, y, 0], b)
  return b
}

const makeHeadphone = (p) => {
  const r = p.bh_r
  let b = circle({ center: [0, 0], radius: r, segments: 16 })
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateX(degToRad(-90), b)
  const x = 0 - p.bm_o - p.bh_o
  const y = (-p.i_y / 2)
  b = translate([x, y, 0], b)
  return b
}

const makeMic = (p) => {
  const r = p.bm_r
  let b = circle({ center: [0, 0], radius: r, segments: 16 })
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateX(degToRad(-90), b)
  const y = (-p.i_y / 2)
  let x = 0 - p.bm_o
  const c = translate([x, y, 0], b)
  x = 0 + p.bm_p
  b = union(c, translate([x, y, 0], b))
  return b
}

const makeBottomSpeaker = (p) => {
  const r = p.bs_r
  let b = circle({ center: [0, 0], radius: r, segments: 16 })
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateX(degToRad(-90), b)
  let s5 = b
  s5 = union(s5, translate([p.bs_o * 1, 0, 0], b))
  s5 = union(s5, translate([p.bs_o * 2, 0, 0], b))
  s5 = union(s5, translate([p.bs_o * 3, 0, 0], b))
  s5 = union(s5, translate([p.bs_o * 4, 0, 0], b))
  const x = 0 + p.bm_p + p.bs_o
  const y = (-p.i_y / 2)
  b = translate([x, y, 0], s5)
  return b
}

const makeRingSilent = (p) => {
  const r = p.rs_y / 2
  let x = p.rs_x / 2 - r
  const a = circle({ center: [-x, 0], radius: r, segments: 16 })
  let b = circle({ center: [+x, 0], radius: r, segments: 16 })
  b = hull(a, b)
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateZ(degToRad(90), b)
  b = rotateY(degToRad(90), b)
  x = 0 - (p.i_x / 2)
  const y = (p.i_y / 2) - (p.rs_x / 2) - p.rs_o
  b = translate([x, y, 0], b)
  return b
}

const makeVolume = (p) => {
  const r = p.vs_y / 2
  let x = p.vs_x / 2 - r
  const a = circle({ center: [-x, 0], radius: r, segments: 16 })
  let b = circle({ center: [+x, 0], radius: r, segments: 16 })
  b = hull(a, b)
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateZ(degToRad(90), b)
  b = rotateY(degToRad(90), b)
  x = 0 - (p.i_x / 2)
  const y = (p.i_y / 2) - p.rs_o - p.rs_x - p.vs_o - (p.vs_x / 2)
  b = translate([x, y, 0], b)
  return b
}

const makePower = (p) => {
  const r = p.ps_y / 2
  let x = p.ps_x / 2 - r
  const a = circle({ center: [-x, 0], radius: r, segments: 16 })
  let b = circle({ center: [+x, 0], radius: r, segments: 16 })
  b = hull(a, b)
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateZ(degToRad(90), b)
  b = rotateY(degToRad(-90), b)
  x = (p.i_x / 2)
  const y = (p.i_y / 2) - (p.ps_x / 2) - p.ps_o
  b = translate([x, y, 0], b)
  return b
}

const makeSimSlot = (p) => {
  const r = p.ss_y / 2
  let x = p.ss_x / 2 - r
  const a = circle({ center: [-x, 0], radius: r, segments: 16 })
  let b = circle({ center: [+x, 0], radius: r, segments: 16 })
  b = hull(a, b)
  b = extrudeLinear({ height: 1.0 }, b)
  b = rotateZ(degToRad(90), b)
  b = rotateY(degToRad(-90), b)
  x = (p.i_x / 2)
  const y = (p.i_y / 2) - p.ps_o - p.ps_x - p.ss_o - (p.ss_x / 2)
  b = translate([x, y, 0], b)
  return b
}

const makeBackCamera = (p) => {
  const r = p.bc_r
  let b = circle({ center: [0, 0], radius: r, segments: p.segments })
  b = subtract(b, circle({ center: [0, 0], radius: r - 1, segments: p.segments }))
  b = extrudeLinear({ height: p.bc_z }, b)
  const x = 0 + (p.i_x / 2) - p.bc_o
  const y = 0 + (p.i_y / 2) - p.bc_p
  const z = 0 - p.i_zr - p.bc_z
  b = translate([x, y, z], b)
  return b
}

const makeBackSensor = (p) => {
  const r = p.be_r
  let b = circle({ center: [0, 0], radius: r, segments: p.segments })
  b = extrudeLinear({ height: 1.0 }, b)
  const x = 0 + (p.i_x / 2) - p.bc_o - p.be_o
  const y = 0 + (p.i_y / 2) - p.bc_p
  const z = 0 - p.i_zr
  b = translate([x, y, z], b)
  return b
}

const makeBackFlash = (p) => {
  const r = p.bf_r
  let b = circle({ center: [0, 0], radius: r, segments: p.segments })
  b = extrudeLinear({ height: 1.0 }, b)
  const x = 0 + (p.i_x / 2) - p.bc_o - p.be_o - p.bf_o
  const y = 0 + (p.i_y / 2) - p.bc_p
  const z = 0 - p.i_zr
  b = translate([x, y, z], b)
  return b
}

const main = (p) => {
  p.blue = [0.3921, 0.5843, 0.9294]

  iPhone6S(p)

  // create the body
  const x = p.i_x / 2
  const y = p.i_y / 2
  const rx = p.i_cr
  let iphone = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: rx, segments: p.segments })
  let b = arc({
    center: [-p.i_zr, 0],
    radius: p.i_zr,
    startAngle: 0,
    endAngle: degToRad(90),
    segments: p.segments
  })
  iphone = extrudeFromPath(iphone, b)
  iphone = union(iphone, rotateY(degToRad(180), iphone))
  // add front screen
  let ds
  if (p.showscreen) {
    ds = makeScreen(p)
    ds = colorize(p.blue, ds)
    iphone = subtract(iphone, ds)
  }
  // add front home button
  if (p.showhome) {
    b = makeHome(p)
    iphone = subtract(iphone, b)
  }
  // add front camera
  if (p.showfrontcam) {
    b = makeFrontCamera(p)
    iphone = subtract(iphone, b)
  }
  // add front sensor
  if (p.showfrontsen) {
    b = makeFrontSensor(p)
    iphone = subtract(iphone, b)
  }
  // add front speaker
  if (p.showfrontspk) {
    b = makeFrontSpeaker(p)
    iphone = subtract(iphone, b)
  }
  // add back camera
  if (p.showcamera) {
    b = makeBackCamera(p)
    iphone = union(iphone, b)
    // add back sensor
    b = makeBackSensor(p)
    iphone = subtract(iphone, b)
  }
  // add back flash
  if (p.showflash) {
    b = makeBackFlash(p)
    iphone = subtract(iphone, b)
  }
  // add bottom headphone jack
  if (p.showheadphone) {
    b = makeHeadphone(p)
    iphone = subtract(iphone, b)
  }
  // add bottom microphones
  if (p.showmic) {
    b = makeMic(p)
    iphone = subtract(iphone, b)
  }
  // add bottom lightning port
  if (p.showlight) {
    b = makeLightning(p)
    iphone = subtract(iphone, b)
  }
  // add bottom speaker holes
  if (p.showspeaker) {
    b = makeBottomSpeaker(p)
    iphone = subtract(iphone, b)
  }
  // add left side ring/slient switch
  if (p.showringsilent) {
    b = makeRingSilent(p)
    iphone = union(iphone, b)
  }
  // add left side volume adjustment buttons
  if (p.showvolume) {
    b = makeVolume(p)
    iphone = union(iphone, b)
  }
  // add right side power switch
  if (p.showpower) {
    b = makePower(p)
    iphone = union(iphone, b)
  }
  // add right side sim slot
  if (p.showsim) {
    b = makeSimSlot(p)
    iphone = subtract(iphone, b)
  }

  iphone = colorize(hexToRgb(p.color), iphone)
  return [iphone, ds]
}

module.exports = { main, getParameterDefinitions }
