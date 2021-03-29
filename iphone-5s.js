const getParameterDefinitions = () => [
  { name: 'iphone', type: 'group', caption: 'iPhone 5' },
  { name: 'color', type: 'choice', initial: '042/041/038/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] },
  { name: 'others', type: 'group', caption: 'Other' },
  { name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?', min: 18, max: 144, step: 18 }
]

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

const makeBody = (p) => {
  let rx = p.iphone.rw
  let ry = p.iphone.rh
  let rz = p.iphone.rd
  let rr = p.iphone.rr
  let b = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  b = b.extrude({ offset: [0, 0, rz * 2] })
  b = b.translate([0, 0, -rz]).setColor(p.steel)

  rx = p.iphone.rw2
  ry = p.iphone.rh2
  rz = p.iphone.rd2
  rr = p.iphone.rr2
  let b1 = CSG.cube({ center: [0, 0, 0], radius: [rx, ry, rz] })
  b1 = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  b1 = b1.extrude({ offset: [0, 0, rz * 2] })
  b1 = b1.translate([0, 0, -rz])

  b = b.union(b1)
  return b
}

const makeBackCamera = (p) => {
  let z = 1.0
  let rr = p.iphone.bc_rr
  let bc = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  let x = p.iphone.bc_xoff
  let y = p.iphone.rh + p.iphone.bc_yoff
  z = -p.iphone.rd2 + z
  bc = bc.translate([x, y, z])

  z = 1.0
  rr = p.iphone.bs_rr
  let bs = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  x = p.iphone.bs_xoff
  y = p.iphone.rh + p.iphone.bs_yoff
  z = -p.iphone.rd2 + z
  bs = bs.translate([x, y, z])

  bc = bc.union(bs)
  return bc
}

const makeHomeButton = (p) => {
  let z = 1.0
  const rr = p.iphone.hb_rr
  let hb = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  const x = p.iphone.hb_xoff
  const y = (-p.iphone.rh) + p.iphone.hb_yoff
  z = p.iphone.rd2 - z
  hb = hb.translate([x, y, z])
  return hb
}

const makeDisplay = (p) => {
  const rr = 0.5 / 2
  const rx = p.iphone.ds_rw
  const ry = p.iphone.ds_rh
  let ds = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = 1.0
  ds = ds.extrude({ offset: [0, 0, z] })
  const x = p.iphone.ds_xoff
  const y = p.iphone.rh - p.iphone.ds_rh + p.iphone.ds_yoff
  z = p.iphone.rd2 - z
  ds = ds.translate([x, y, z])
  return ds
}

const makeFrontSensor = (p) => {
  let z = 1.0
  const rr = p.iphone.fs_rr
  let fs = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  const x = p.iphone.fs_xoff
  const y = p.iphone.rh + p.iphone.fs_yoff
  z = p.iphone.rd2 - z
  fs = fs.translate([x, y, z])
  return fs
}

const makeFrontMic = (p) => {
  const rx = p.iphone.fm_rw
  const ry = p.iphone.fm_rh
  const rr = ry * 0.90
  let fm = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = 1.0
  fm = fm.extrude({ offset: [0, 0, z] })
  const x = p.iphone.fm_xoff
  const y = p.iphone.rh + p.iphone.fm_yoff
  z = p.iphone.rd2 - z
  fm = fm.translate([x, y, z])
  return fm
}

const makePowerButton = (p) => {
  const rx = p.iphone.pb_rw
  const ry = p.iphone.pb_rh
  const rr = ry * 0.90
  let pb = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = p.iphone.pb_rd * 2
  pb = pb.extrude({ offset: [0, 0, z] }).rotateX(90) // flip to side
  const x = p.iphone.pb_xoff
  const y = p.iphone.rh + z
  z = p.iphone.pb_yoff
  pb = pb.translate([x, y, z])
  return pb
}

const makeEarphoneJack = (p) => {
  let z = 1.0
  const rr = p.iphone.ej_rr
  let ej = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  ej = ej.rotateX(90) // flip to side
  const x = p.iphone.ej_xoff
  const y = -p.iphone.rh + z
  z = p.iphone.ej_yoff
  ej = ej.translate([x, y, z])
  return ej
}

const makePowerJack = (p) => {
  const rx = p.iphone.pj_rw
  const ry = p.iphone.pj_rh
  const rr = ry * 0.90
  let pj = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = 1.0
  pj = pj.extrude({ offset: [0, 0, z] }).rotateX(-90) // flip to side
  const x = p.iphone.pj_xoff
  const y = (-p.iphone.rh)
  z = p.iphone.pj_yoff
  pj = pj.translate([x, y, z])
  return pj
}

const speakers = (p) => {
  const rx = p.iphone.sp_rw
  const ry = p.iphone.sp_rh
  const rr = 0.25
  let sp = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = 1.0
  sp = sp.extrude({ offset: [0, 0, z] }).rotateX(-90) // flip to side
  let x = p.iphone.sp_xoff
  const y = (-p.iphone.rh)
  z = p.iphone.sp_yoff
  const sp1 = sp.translate([x, y, z])
  x = -p.iphone.sp_xoff
  sp = sp.translate([x, y, z])
  sp = sp.union(sp1)
  return sp
}

const makeSilenceSwitch = (p) => {
  const rx = p.iphone.ss_rw
  const ry = p.iphone.ss_rh
  const rr = 0.5
  let ss = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = p.iphone.ss_rd * 2
  ss = ss.extrude({ offset: [0, 0, z] }).rotateZ(-90).rotateY(-90) // flip to side
  const x = (-p.iphone.rw)
  const y = p.iphone.ss_xoff
  z = p.iphone.ss_yoff
  ss = ss.translate([x, y, z])
  return ss
}

const makeVolumeButtons = (p) => {
  const rr = p.iphone.vb_rr
  let z = p.iphone.vb_rd * 2
  let vb = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, z], radius: rr, resolution: p.resolution })
  vb = vb.rotateY(-90) // flip to side
  const x = (-p.iphone.rw)
  let y = p.iphone.vb_xoff1
  z = p.iphone.vb_yoff
  const vb1 = vb.translate([x, y, z])
  y = p.iphone.vb_xoff2
  vb = vb.translate([x, y, z])
  vb = vb.union(vb1)
  return vb
}

const makeSimSlot = (p) => {
  const rx = p.iphone.sm_rw
  const ry = p.iphone.sm_rh
  const rr = ry * 0.90
  let sm = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  let z = 1.0
  sm = sm.extrude({ offset: [0, 0, z] }).rotateZ(-90).rotateY(90) // flip to side
  const x = (p.iphone.rw) - z
  const y = p.iphone.sm_xoff
  z = p.iphone.sm_yoff
  sm = sm.translate([x, y, z])
  return sm
}

const main = (p) => {
  // var p = {};
  // p.resolution = 16;
  p.steel = [0.9777, 0.9777, 0.9777]
  p.silver = [0.7529, 0.7529, 0.7529]
  p.blue = [0.3921, 0.5843, 0.9294]
  // main body
  iphone5(p)
  let b = makeBody(p)
  // back
  const bc = makeBackCamera(p).setColor(p.silver)
  b = b.subtract(bc).union(bc)
  // front
  const hb = makeHomeButton(p).setColor(1.0, 1.0, 1.0)
  b = b.subtract(hb).union(hb)
  const ds = makeDisplay(p).setColor(p.blue)
  b = b.subtract(ds).union(ds)
  const fs = makeFrontSensor(p).setColor(p.silver)
  b = b.subtract(fs).union(fs)
  const fm = makeFrontMic(p).setColor(p.silver)
  b = b.subtract(fm).union(fm)
  // top edge
  const pb = makePowerButton(p).setColor(p.silver)
  b = b.union(pb)
  const ej = makeEarphoneJack(p).setColor(0, 0, 0)
  b = b.subtract(ej).union(ej)
  // bottom edge
  const pj = makePowerJack(p).setColor(0, 0, 0)
  b = b.subtract(pj).union(pj)
  const sp = speakers(p).setColor(0, 0, 0)
  b = b.subtract(sp).union(sp)
  // left edge
  const ss = makeSilenceSwitch(p).setColor(p.silver)
  b = b.union(ss)
  const vb = makeVolumeButtons(p).setColor(p.silver)
  b = b.union(vb)
  // right edge
  const sm = makeSimSlot(p).setColor(p.silver)
  b = b.subtract(sm).union(sm)

  return b
}
