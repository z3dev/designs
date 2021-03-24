const { booleans, colors, extrusions, primitives, transforms, utils } = require('@jscad/modeling')

const { subtract, union } = booleans
const { colorize, cssColors, hexToRgb, rgbToHex } = colors
const { extrudeLinear } = extrusions
const { cuboid, cylinder, roundedRectangle } = primitives
const { rotateX, rotateY, rotateZ, translate } = transforms
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
    { name: 'iphone', type: 'group', caption: 'iPhone 5' },
    { name: 'others', type: 'group', caption: 'Other' },
    { name: 'segments', type: 'int', initial: 18, caption: 'Segments?', min: 18, max: 144, step: 18 },
    colorParameter({})
  ]
}

const iphone5 = (p) => {
  const iphone = {}
  iphone.w = 58.6
  iphone.h = 123.8
  iphone.d = 7.6
  iphone.e = 0.5 // edge around phone
  iphone.rw = iphone.w / 2
  iphone.rh = iphone.h / 2
  iphone.rd = 6.5 / 2
  iphone.rr = 7.75 // radius of corners

  iphone.rw2 = iphone.rw - iphone.e
  iphone.rh2 = iphone.rh - iphone.e
  iphone.rd2 = iphone.d / 2
  iphone.rr2 = iphone.rr - iphone.e
  // back sensor and back camera
  iphone.bs_rr = 3.0 / 2
  iphone.bs_xoff = 11.0
  iphone.bs_yoff = -7.5
  iphone.bc_rr = 6.5 / 2
  iphone.bc_xoff = iphone.bs_xoff + 9.0
  iphone.bc_yoff = iphone.bs_yoff
  // front home button
  iphone.hb_rr = 11.0 / 2
  iphone.hb_xoff = 0.0
  iphone.hb_yoff = 9.0 // from bottom
  // front display
  iphone.ds_rw = 51.5 / 2
  iphone.ds_rh = 90.0 / 2
  iphone.ds_rr = 1.0
  iphone.ds_xoff = 0.0
  iphone.ds_yoff = -17.0 // from top edge
  // front sensor
  iphone.fs_rr = 2.0 / 2
  iphone.fs_xoff = 0.0 // from center
  iphone.fs_yoff = -6.5 // from top
  // front mic
  iphone.fm_rw = 10.0 / 2
  iphone.fm_rh = 2.0 / 2
  iphone.fm_xoff = 0.0
  iphone.fm_yoff = -10.5
  // power button
  iphone.pb_rw = 10.0 / 2
  iphone.pb_rh = 2.5 / 2
  iphone.pb_rd = 0.5
  iphone.pb_xoff = 19.0 // from center
  iphone.pb_yoff = 0.0 // from center
  // earphone jack
  iphone.ej_rr = 4.7 / 2
  iphone.ej_xoff = -17.25
  iphone.ej_yoff = 0.0 // from bottom
  // power jack
  iphone.pj_rw = 8.0 / 2
  iphone.pj_rh = 2.5 / 2
  iphone.pj_xoff = 0.0
  iphone.pj_yoff = 0.0
  // bottom speaker(s)
  iphone.sp_rw = 6.5 / 2
  iphone.sp_rh = 2.5 / 2
  iphone.sp_xoff = iphone.pj_rw + 3.50 + iphone.sp_rw // from center
  iphone.sp_yoff = 0.0
  // silence switch
  iphone.ss_rw = 6.0 / 2
  iphone.ss_rh = 2.0 / 2
  iphone.ss_rd = 0.5 / 2
  iphone.ss_xoff = iphone.rh - 13.0
  iphone.ss_yoff = 0.0
  // volume buttons
  iphone.vb_rr = 4.0 / 2
  iphone.vb_rd = 0.5 / 2
  iphone.vb_xoff1 = iphone.ss_xoff - 11.5
  iphone.vb_xoff2 = iphone.vb_xoff1 - 10.5
  iphone.vb_yoff = 0.0
  // sim slot
  iphone.sm_rw = 16.0 / 2
  iphone.sm_rh = 2.0 / 2
  iphone.sm_xoff = iphone.rh - 61.0
  iphone.sm_yoff = 0.0

  p.iphone = iphone
}

const body = (p) => {
  let rx = p.iphone.rw
  let ry = p.iphone.rh
  let rz = p.iphone.rd
  let rr = p.iphone.rr
  let b = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  b = extrudeLinear({ height: rz * 2 }, b)
  b = translate([0, 0, -rz], b)

  rx = p.iphone.rw2
  ry = p.iphone.rh2
  rz = p.iphone.rd2
  rr = p.iphone.rr2
  let b1 = cuboid({ center: [0, 0, 0], size: [rx * 2, ry * 2, rz * 2] })
  b1 = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  b1 = extrudeLinear({ height: rz * 2 }, b1)
  b1 = translate([0, 0, -rz], b1)

  b = union(b, b1)
  return b
}

const makeBackCamera = (p) => {
  let z = 1.0
  let rr = p.iphone.bc_rr
  let bc = cylinder({ height: z, radius: rr, segments: p.segments })
  let x = p.iphone.bc_xoff
  let y = p.iphone.rh + p.iphone.bc_yoff
  z = -p.iphone.rd2 + z / 2
  bc = translate([x, y, z], bc)

  z = 1.0
  rr = p.iphone.bs_rr
  let bs = cylinder({ height: z, radius: rr, segments: p.segments })
  x = p.iphone.bs_xoff
  y = p.iphone.rh + p.iphone.bs_yoff
  z = -p.iphone.rd2 + z / 2
  bs = translate([x, y, z], bs)

  bc = union(bc, bs)
  return bc
}

const makeHomeButton = (p) => {
  let z = 1.0
  const rr = p.iphone.hb_rr
  let hb = cylinder({ height: z, radius: rr, segments: p.segments })
  const x = p.iphone.hb_xoff
  const y = (-p.iphone.rh) + p.iphone.hb_yoff
  z = p.iphone.rd2 - z / 2
  hb = translate([x, y, z], hb)
  return hb
}

const makeDisplay = (p) => {
  const rr = 0.5 / 2
  const rx = p.iphone.ds_rw
  const ry = p.iphone.ds_rh
  let ds = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  ds = extrudeLinear({ height: z }, ds)
  const x = p.iphone.ds_xoff
  const y = p.iphone.rh - p.iphone.ds_rh + p.iphone.ds_yoff
  z = p.iphone.rd2 - z
  ds = translate([x, y, z], ds)
  return ds
}

const makeFrontSensor = (p) => {
  let z = 1.0
  const rr = p.iphone.fs_rr
  let fs = cylinder({ height: z, radius: rr, segments: p.segments })
  const x = p.iphone.fs_xoff
  const y = p.iphone.rh + p.iphone.fs_yoff
  z = p.iphone.rd2 - z / 2
  fs = translate([x, y, z], fs)
  return fs
}

const makeFrontMic = (p) => {
  const rx = p.iphone.fm_rw
  const ry = p.iphone.fm_rh
  const rr = ry * 0.90
  let fm = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  fm = extrudeLinear({ height: z }, fm)
  const x = p.iphone.fm_xoff
  const y = p.iphone.rh + p.iphone.fm_yoff
  z = p.iphone.rd2 - z
  fm = translate([x, y, z], fm)
  return fm
}

const makePowerButton = (p) => {
  const rx = p.iphone.pb_rw
  const ry = p.iphone.pb_rh
  const rr = ry * 0.90
  let pb = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = p.iphone.pb_rd * 2
  pb = extrudeLinear({ height: z }, pb)
  pb = rotateX(degToRad(90), pb) // flip to side
  const x = p.iphone.pb_xoff
  const y = p.iphone.rh + z / 2
  z = p.iphone.pb_yoff
  pb = translate([x, y, z], pb)
  return pb
}

const makeEarphoneJack = (p) => {
  let z = 1.0
  const rr = p.iphone.ej_rr
  let ej = cylinder({ height: z, radius: rr, segments: p.segments })
  ej = rotateX(degToRad(90), ej) // flip to side
  const x = p.iphone.ej_xoff
  const y = -p.iphone.rh + z / 2 - 0.1
  z = p.iphone.ej_yoff
  ej = translate([x, y, z], ej)
  return ej
}

const makePowerJack = (p) => {
  const rx = p.iphone.pj_rw
  const ry = p.iphone.pj_rh
  const rr = ry * 0.90
  let pj = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  pj = extrudeLinear({ height: z }, pj)
  pj = rotateX(degToRad(-90), pj) // flip to side
  const x = p.iphone.pj_xoff
  const y = (-p.iphone.rh)
  z = p.iphone.pj_yoff
  pj = translate([x, y, z], pj)
  return pj
}

const makeSpeakers = (p) => {
  const rx = p.iphone.sp_rw
  const ry = p.iphone.sp_rh
  const rr = 0.25
  let sp = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  sp = extrudeLinear({ height: z }, sp)
  sp = rotateX(degToRad(-90), sp) // flip to side
  let x = p.iphone.sp_xoff
  const y = (-p.iphone.rh)
  z = p.iphone.sp_yoff
  const sp1 = translate([x, y, z], sp)
  x = -p.iphone.sp_xoff
  sp = translate([x, y, z], sp)
  sp = union(sp, sp1)
  return sp
}

const makeSilenceSwitch = (p) => {
  const rx = p.iphone.ss_rw
  const ry = p.iphone.ss_rh
  const rr = 0.5
  let ss = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = p.iphone.ss_rd * 2
  ss = extrudeLinear({ height: z }, ss)
  ss = rotateY(degToRad(-90), rotateZ(degToRad(-90), ss)) // flip to side
  const x = (-p.iphone.rw)
  const y = p.iphone.ss_xoff
  z = p.iphone.ss_yoff
  ss = translate([x, y, z], ss)
  return ss
}

const makeVolumeButtons = (p) => {
  const rr = p.iphone.vb_rr
  let z = p.iphone.vb_rd * 2
  let vb = cylinder({ center: [0, 0, z / 2], height: z, radius: rr, segments: p.segments })
  vb = rotateY(degToRad(-90), vb) // flip to side
  const x = (-p.iphone.rw)
  let y = p.iphone.vb_xoff1
  z = p.iphone.vb_yoff
  const vb1 = translate([x, y, z], vb)
  y = p.iphone.vb_xoff2
  vb = translate([x, y, z], vb)
  vb = union(vb, vb1)
  return vb
}

const makeSimSlot = (p) => {
  const rx = p.iphone.sm_rw
  const ry = p.iphone.sm_rh
  const rr = ry * 0.90
  let sm = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  sm = extrudeLinear({ height: z }, sm)
  sm = rotateY(degToRad(90), rotateZ(degToRad(-90), sm)) // flip to side
  const x = (p.iphone.rw) - z
  const y = p.iphone.sm_xoff
  z = p.iphone.sm_yoff
  sm = translate([x, y, z], sm)
  return sm
}

const main = (p) => {
  p.steel = [0.9777, 0.9777, 0.9777]
  p.silver = [0.7529, 0.7529, 0.7529]
  p.blue = [0.3921, 0.5843, 0.9294]

  // main body
  iphone5(p)
  let b = body(p)

  // back
  const bc = makeBackCamera(p)
  b = subtract(b, bc)

  // front
  const hb = makeHomeButton(p)
  b = subtract(b, hb)
  let ds = makeDisplay(p)
  ds = colorize(p.blue, ds)
  b = subtract(b, ds)
  const fs = makeFrontSensor(p)
  b = subtract(b, fs)
  const fm = makeFrontMic(p)
  b = subtract(b, fm)

  // top edge
  const pb = makePowerButton(p)
  b = union(b, pb)

  // bottom edge
  const ej = makeEarphoneJack(p)
  b = subtract(b, ej)
  const pj = makePowerJack(p)
  b = subtract(b, pj)
  const sp = makeSpeakers(p)
  b = subtract(b, sp)

  // left edge
  const ss = makeSilenceSwitch(p)
  b = union(b, ss)
  const vb = makeVolumeButtons(p)
  b = union(b, vb)

  // right edge
  const sm = makeSimSlot(p)
  b = subtract(b, sm)

  b = colorize(hexToRgb(p.color), b)
  return [b, ds]
}

module.exports = { main, getParameterDefinitions }
