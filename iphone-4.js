const { booleans, colors, extrusions, primitives, transforms } = require('@jscad/modeling')

const { subtract, union } = booleans
const { colorize, cssColors, hexToRgb, rgbToHex } = colors
const { extrudeLinear } = extrusions
const { cylinder, cuboid, roundedRectangle } = primitives
const { rotateX, rotateY, rotateZ, translate } = transforms

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
  { name: 'iphone', type: 'group', caption: 'iPhone 4' },
  colorParameter({}),
  { name: 'others', type: 'group', caption: 'Other' },
  { name: 'segments', type: 'int', initial: 32, caption: 'Resolution?', min: 18, max: 144, step: 18 }
]

const iphone4 = (p) => {
  const iphone = {}
  iphone.w = 58.6
  iphone.h = 115.2
  iphone.d = 9.3
  iphone.e = 0.7 // edge around phone
  iphone.rw = iphone.w / 2
  iphone.rh = iphone.h / 2
  iphone.rd = 6.5 / 2
  iphone.rr = 7.75 // radius of corners

  iphone.rw2 = iphone.rw - iphone.e
  iphone.rh2 = iphone.rh - iphone.e
  iphone.rd2 = iphone.d / 2
  iphone.rr2 = iphone.rr - iphone.e
  // back sensor and back camera
  iphone.bs_rr = 2.5 / 2
  iphone.bs_xoff = 14.0
  iphone.bs_yoff = -8.5
  iphone.bc_rr = 7.0 / 2
  iphone.bc_xoff = iphone.bs_xoff + 6.5
  iphone.bc_yoff = iphone.bs_yoff
  // front home button
  iphone.hb_rr = 11.0 / 2
  iphone.hb_xoff = 0.0
  iphone.hb_yoff = 10.0 // from bottom
  // front display
  iphone.ds_rw = 51.5 / 2
  iphone.ds_rh = 76.0 / 2
  iphone.ds_rr = 1.0
  iphone.ds_xoff = 0.0
  iphone.ds_yoff = -19.0 // from top edge
  // front sensor
  iphone.fs_rr = 3.0 / 2
  iphone.fs_xoff = -10.0 // from center
  iphone.fs_yoff = -10.5 // from top
  // front mic
  iphone.fm_rw = 10.0 / 2
  iphone.fm_rh = 1.7 / 2
  iphone.fm_xoff = 0.0
  iphone.fm_yoff = -10.5
  // power button
  iphone.pb_rw = 10.0 / 2
  iphone.pb_rh = 3.0 / 2
  iphone.pb_rd = 0.5
  iphone.pb_xoff = 15.0 // from center
  iphone.pb_yoff = 0.0 // from center
  // earphone jack
  iphone.ej_rr = 4.7 / 2
  iphone.ej_xoff = -17.25
  iphone.ej_yoff = 0.0
  // power jack
  iphone.pj_rw = 22.0 / 2
  iphone.pj_rh = 2.8 / 2
  iphone.pj_xoff = 0.0
  iphone.pj_yoff = 0.0
  // bottom speaker(s)
  iphone.sp_rw = 6.5 / 2
  iphone.sp_rh = 2.0 / 2
  iphone.sp_xoff = iphone.pj_rw + 4.50 + iphone.sp_rw // from center
  iphone.sp_yoff = 0.0
  // silence switch
  iphone.ss_rw = 5.0 / 2
  iphone.ss_rh = 2.5 / 2
  iphone.ss_rd = 0.5 / 2
  iphone.ss_xoff = iphone.rh - 13.0
  iphone.ss_yoff = 0.0
  // volume buttons
  iphone.vb_rr = 4.5 / 2
  iphone.vb_rd = 0.5 / 2
  iphone.vb_xoff1 = iphone.ss_xoff - 11.5
  iphone.vb_xoff2 = iphone.vb_xoff1 - 10.5
  iphone.vb_yoff = 0.0
  // sim slot
  iphone.sm_rw = 18.0 / 2
  iphone.sm_rh = 2.0 / 2
  iphone.sm_xoff = iphone.rh - 61.0
  iphone.sm_yoff = 0.0

  p.iphone4 = iphone
}

const body = (p) => {
  let rx = p.iphone4.rw
  let ry = p.iphone4.rh
  let rz = p.iphone4.rd
  let rr = p.iphone4.rr
  let b = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  b = extrudeLinear({ height: rz * 2 }, b)
  b = translate([0, 0, -rz], b)

  rx = p.iphone4.rw2
  ry = p.iphone4.rh2
  rz = p.iphone4.rd2
  rr = p.iphone4.rr2
  let b1 = cuboid({ center: [0, 0, 0], size: [rx * 2, ry * 2, rz * 2] })
  b1 = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  b1 = extrudeLinear({ height: rz * 2 }, b1)
  b1 = translate([0, 0, -rz], b1)

  b = union(b, b1)
  return b
}

const makeBackCamera = (p) => {
  let z = 1.0
  let rr = p.iphone4.bc_rr
  let bc = cylinder({ height: z, radius: rr, segments: p.segments })
  let x = p.iphone4.bc_xoff
  let y = p.iphone4.rh + p.iphone4.bc_yoff
  z = -p.iphone4.rd2 + z / 2 - 0.001
  bc = translate([x, y, z], bc)

  z = 1.0
  rr = p.iphone4.bs_rr
  let bs = cylinder({ height: z, radius: rr, segments: p.segments })
  x = p.iphone4.bs_xoff
  y = p.iphone4.rh + p.iphone4.bs_yoff
  z = -p.iphone4.rd2 + z / 2 - 0.001
  bs = translate([x, y, z], bs)

  bc = union(bc, bs)
  return bc
}

const makeHomeButton = (p) => {
  let z = 1.0
  const rr = p.iphone4.hb_rr
  let hb = cylinder({ height: z, radius: rr, segments: p.segments })
  const x = p.iphone4.hb_xoff
  const y = (-p.iphone4.rh) + p.iphone4.hb_yoff
  z = p.iphone4.rd2 - z / 2
  hb = translate([x, y, z], hb)
  return hb
}

const makeDisplay = (p) => {
  const rr = 0.5 / 2
  const rx = p.iphone4.ds_rw
  const ry = p.iphone4.ds_rh
  let ds = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  ds = extrudeLinear({ height: z }, ds)
  const x = p.iphone4.ds_xoff
  const y = p.iphone4.rh - p.iphone4.ds_rh + p.iphone4.ds_yoff
  z = p.iphone4.rd2 - z
  ds = translate([x, y, z], ds)
  return ds
}

const makeFrontSensor = (p) => {
  let z = 1.0
  const rr = p.iphone4.fs_rr
  let fs = cylinder({ height: z, radius: rr, segments: p.segments })
  const x = p.iphone4.fs_xoff
  const y = p.iphone4.rh + p.iphone4.fs_yoff
  z = p.iphone4.rd2 - z / 2
  fs = translate([x, y, z], fs)
  return fs
}

const makreFrontMic = (p) => {
  const rr = 0.5 / 2
  const rx = p.iphone4.fm_rw
  const ry = p.iphone4.fm_rh
  let fm = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  fm = extrudeLinear({ height: z }, fm)
  const x = p.iphone4.fm_xoff
  const y = p.iphone4.rh + p.iphone4.fm_yoff
  z = p.iphone4.rd2 - z
  fm = translate([x, y, z], fm)
  return fm
}

const makePowerButton = (p) => {
  const rx = p.iphone4.pb_rw
  const ry = p.iphone4.pb_rh
  const rr = ry * 0.90
  let pb = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = p.iphone4.pb_rd * 2
  pb = extrudeLinear({ height: z }, pb)
  pb = rotateX(Math.PI / 2, pb) // flip to side
  const x = p.iphone4.pb_xoff
  const y = p.iphone4.rh + z
  z = p.iphone4.pb_yoff
  pb = translate([x, y, z], pb)
  return pb
}

const makeEarphoneJack = (p) => {
  let z = 1.0
  const rr = p.iphone4.ej_rr
  let ej = cylinder({ height: z, radius: rr, segments: p.segments })
  ej = rotateX(Math.PI / 2, ej) // flip to side
  const x = p.iphone4.ej_xoff
  const y = p.iphone4.rh - z / 2
  z = p.iphone4.ej_yoff
  ej = translate([x, y, z], ej)
  return ej
}

const makePowerJack = (p) => {
  const rx = p.iphone4.pj_rw
  const ry = p.iphone4.pj_rh
  const rr = 0.5
  let pj = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  pj = extrudeLinear({ height: z }, pj)
  pj = rotateX(-Math.PI / 2, pj) // flip to side
  const x = p.iphone4.pj_xoff
  const y = (-p.iphone4.rh)
  z = p.iphone4.pj_yoff
  pj = translate([x, y, z], pj)
  return pj
}

const makeSpeakers = (p) => {
  const rx = p.iphone4.sp_rw
  const ry = p.iphone4.sp_rh
  const rr = ry * 0.90
  let sp = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  sp = extrudeLinear({ height: z }, sp)
  sp = rotateX(-Math.PI / 2, sp) // flip to side
  let x = p.iphone4.sp_xoff
  const y = (-p.iphone4.rh)
  z = p.iphone4.sp_yoff
  const sp1 = translate([x, y, z], sp)
  x = -p.iphone4.sp_xoff
  sp = translate([x, y, z], sp)
  sp = union(sp, sp1)
  return sp
}

const makeSilenceSwitch = (p) => {
  const rx = p.iphone4.ss_rw
  const ry = p.iphone4.ss_rh
  const rr = 0.5
  let ss = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = p.iphone4.ss_rd * 2
  ss = extrudeLinear({ height: z }, ss)
  ss = rotateY(-Math.PI / 2, rotateZ(-Math.PI / 2, ss)) // flip to side
  const x = (-p.iphone4.rw)
  const y = p.iphone4.ss_xoff
  z = p.iphone4.ss_yoff
  ss = translate([x, y, z], ss)
  return ss
}

const makeVolumeButtons = (p) => {
  const rr = p.iphone4.vb_rr
  let z = p.iphone4.vb_rd * 2
  let vb = cylinder({ center: [0, 0, z / 2], height: z, radius: rr, segments: p.segments })
  vb = rotateY(-Math.PI / 2, vb) // flip to side
  const x = (-p.iphone4.rw)
  let y = p.iphone4.vb_xoff1
  z = p.iphone4.vb_yoff
  const vb1 = translate([x, y, z], vb)
  y = p.iphone4.vb_xoff2
  vb = translate([x, y, z], vb)
  vb = union(vb, vb1)
  return vb
}

const makeSimSlot = (p) => {
  const rx = p.iphone4.sm_rw
  const ry = p.iphone4.sm_rh
  const rr = ry * 0.90
  let sm = roundedRectangle({ center: [0, 0], size: [rx * 2, ry * 2], roundRadius: rr, segments: p.segments })
  let z = 1.0
  sm = extrudeLinear({ height: z }, sm)
  sm = rotateY(Math.PI / 2, rotateZ(-Math.PI / 2, sm)) // flip to side
  const x = (p.iphone4.rw) - z
  const y = p.iphone4.sm_xoff
  z = p.iphone4.sm_yoff
  sm = translate([x, y, z], sm)
  return sm
}

const main = (p) => {
  // let p = {}
  // p.segments = 16
  p.steel = [0.9777, 0.9777, 0.9777]
  p.silver = [0.7529, 0.7529, 0.7529]
  p.blue = [0.3921, 0.5843, 0.9294]
  // main body
  iphone4(p)
  let b = body(p)
  // back
  let bc = makeBackCamera(p)
  b = subtract(b, bc)
  bc = colorize([0, 0, 0, 1], bc)
  // front
  let hb = makeHomeButton(p)
  b = subtract(b, hb)
  hb = colorize([0, 0, 0, 1], hb)
  let ds = makeDisplay(p)
  b = subtract(b, ds)
  ds = colorize(p.blue, ds)
  const fs = makeFrontSensor(p)
  b = subtract(b, fs)
  const fm = makreFrontMic(p)
  b = subtract(b, fm)
  // top edge
  const pb = makePowerButton(p)
  b = union(b, pb)
  const ej = makeEarphoneJack(p)
  b = subtract(b, ej)
  // bottom edge
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
  return [b, ds, bc, hb]
}

module.exports = { main, getParameterDefinitions }
