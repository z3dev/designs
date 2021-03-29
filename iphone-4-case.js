function getParameterDefinitions () {
  return [
    { name: 'case', type: 'group', caption: 'Case' },
    { name: 'thickness', type: 'float', initial: 1.0, caption: 'Thickness (mm)?', step: 0.1, min: 1.0, max: 10.0 },
    { name: 'offset', type: 'float', initial: 0.2, caption: 'Fit (mm)?', step: 0.1, min: 0.0, max: 12.0 },
    { name: 'style', type: 'choice', initial: 'clip', caption: 'Style?', values: ['clip', 'exposed', 'ends', 'full'], captions: ['Clip On', 'Exposed Sides', 'Exposed Ends', 'Full Armor'] },
    { name: 'access', type: 'group', caption: 'iPhone Access' },
    { name: 'showscreen', type: 'checkbox', checked: false, caption: 'Touch Screen?' },
    { name: 'showhome', type: 'checkbox', checked: false, caption: 'Home Button?' },
    { name: 'showringsilent', type: 'checkbox', checked: true, caption: 'Ring/Silent Switch?' },
    { name: 'showvolume', type: 'checkbox', checked: true, caption: 'Volume Switches?' },
    { name: 'showpower', type: 'checkbox', checked: true, caption: 'Power Switch?' },
    { name: 'showheadphone', type: 'checkbox', checked: true, caption: 'Headphone?' },
    { name: 'showsim', type: 'checkbox', checked: false, caption: 'Sim Slot?' },
    { name: 'showpowerjack', type: 'checkbox', checked: true, caption: 'Power Port?' },
    { name: 'showspeaker', type: 'checkbox', checked: true, caption: 'Bottom Speakers?' },
    { name: 'showcameraport', type: 'checkbox', checked: true, caption: 'Back Camera Port?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'color', type: 'choice', initial: '253/102/054/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] },
    { name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?' }
  ]
}

function use (url) {
  const xmlhttp = new XMLHttpRequest()
  let obj = null
  xmlhttp.onreadystatechange = function (e) {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        obj = JSON.parse(xmlhttp.responseText)
      }
    }
  }

  xmlhttp.open('GET', url, false)
  xmlhttp.send()
  if (obj === null) {
    throw new Error('use(' + url + ') failed: ' + xmlhttp.status + ' - ' + xmlhttp.statusText)
  }
  return obj
}

function iphone4 (p) {
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

function makeDisplay (p) {
  let x = (p.iphone4.ds_rw) + p.offset
  let y = (p.iphone4.ds_rh) + p.offset
  let z = p.iphone4.d + ((p.offset + p.thickness) * 2)
  let b = CAG.roundedRectangle({ center: [0, 0], radius: [x, y], roundradius: p.iphone4.ds_rr, resolution: p.resolution })
  b = b.extrude({ offset: [0, 0, z] })

  x = p.iphone4.ds_xoff
  y = p.iphone4.rh - p.iphone4.ds_rh + p.iphone4.ds_yoff
  z = 0
  b = b.translate([x, y, z])
  return b
}
function makeHomeButton (p) {
  let x, y, z
  let rx, ry, rz, rr
  z = p.iphone4.d
  rr = p.iphone4.hb_rr
  rr = rr + 0.50 // extra space for access
  let hb = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, z], radius: rr, resolution: p.resolution })
  x = p.iphone4.hb_xoff
  y = (-p.iphone4.rh) + p.iphone4.hb_yoff
  z = 0
  hb = hb.translate([x, y, z])
  return hb
}
function makeRingSilent (p) {
  let r = p.iphone4.ss_rh
  let x = p.iphone4.ss_rw
  r = r + 1.50 // extra space for access
  const a = CAG.circle({ center: [-x, 0], radius: r, resolution: 16 })
  let b = CAG.circle({ center: [+x, 0], radius: r, resolution: 16 })
  b = hull(a, b)
  let z = p.thickness + p.offset
  b = b.extrude({ offset: [0, 0, z * 2] }).rotateZ(90).rotateY(90)
  x = (-p.iphone4.rw) - z
  const y = p.iphone4.ss_xoff
  z = p.iphone4.ss_yoff
  b = b.translate([x, y, z])
  return b
}
function makeVolumeButtons (p) {
  let x, y, z
  let rx, ry, rz, rr
  rr = p.iphone4.vb_rr
  rr = rr + 1.50 // extra space for access
  z = p.thickness + p.offset
  let vb = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  vb = vb.rotateY(-90) // flip to side
  x = (-p.iphone4.rw) - z
  y = p.iphone4.vb_xoff1
  z = p.iphone4.vb_yoff
  const vb1 = vb.translate([x, y, z])
  y = p.iphone4.vb_xoff2
  vb = vb.translate([x, y, z])
  vb = vb.union(vb1)
  return vb
}
function makePower (p) {
  let x, y, z
  let rx, ry, rz, rr
  rx = p.iphone4.pb_rw
  rx = rx + 1.50 // extra space for access
  ry = p.iphone4.pb_rh
  ry = ry + 1.50 // extra space for access
  rr = ry * 0.90
  let pb = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  z = p.thickness + p.offset
  pb = pb.extrude({ offset: [0, 0, z * 2] }).rotateX(90) // flip to side
  x = p.iphone4.pb_xoff
  y = p.iphone4.rh + z
  z = p.iphone4.pb_yoff
  pb = pb.translate([x, y, z])
  return pb
}
function makeHeadPhone (p) {
  let x, y, z
  let rx, ry, rz, rr
  z = p.thickness + p.offset
  rr = p.iphone4.ej_rr
  rr = rr + 0.50 // extra space for access
  let ej = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: rr, resolution: p.resolution })
  ej = ej.rotateX(90) // flip to side
  x = p.iphone4.ej_xoff
  y = p.iphone4.rh + z
  z = p.iphone4.ej_yoff
  ej = ej.translate([x, y, z])
  return ej
}
function makeSimSlot (p) {
  let x, y, z
  let rx, ry, rz, rr
  rx = p.iphone4.sm_rw
  rx = rx + 0.50 // extra space for access
  ry = p.iphone4.sm_rh
  ry = ry + 0.50 // extra space for access
  rr = ry * 0.90
  let sm = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  z = p.thickness + p.offset
  sm = sm.extrude({ offset: [0, 0, z * 2] }).rotateZ(-90).rotateY(90) // flip to side
  x = (p.iphone4.rw) - z
  y = p.iphone4.sm_xoff
  z = p.iphone4.sm_yoff
  sm = sm.translate([x, y, z])
  return sm
}
function makePowerJack (p) {
  let x, y, z
  let rx, ry, rz, rr
  rx = p.iphone4.pj_rw
  rx = rx + 0.50 // extra space for access
  ry = p.iphone4.pj_rh
  ry = ry + 0.50 // extra space for access
  rr = 0.5
  let pj = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  z = p.thickness + p.offset
  pj = pj.extrude({ offset: [0, 0, z * 2] }).rotateX(-90) // flip to side
  x = p.iphone4.pj_xoff
  y = (-p.iphone4.rh) - z
  z = p.iphone4.pj_yoff
  pj = pj.translate([x, y, z])
  return pj
}
function makeSpeakers (p) {
  let x, y, z
  let rx, ry, rz, rr
  rx = p.iphone4.sp_rw
  rx = rx + 0.50 // extra space for access
  ry = p.iphone4.sp_rh
  ry = ry + 0.50 // extra space for access
  rr = ry * 0.90
  let sp = CAG.roundedRectangle({ center: [0, 0], radius: [rx, ry], roundradius: rr, resolution: p.resolution })
  z = p.thickness + p.offset
  sp = sp.extrude({ offset: [0, 0, z] }).rotateX(-90) // flip to side
  x = p.iphone4.sp_xoff
  y = (-p.iphone4.rh) - z
  z = p.iphone4.sp_yoff
  const sp1 = sp.translate([x, y, z])
  x = -p.iphone4.sp_xoff
  sp = sp.translate([x, y, z])
  sp = sp.union(sp1)
  return sp
}
function makeCameraPort (p) {
  let x, y, z
  let rx, ry, rz, rr

  rr = p.iphone4.bc_rr
  rr = rr + 1.00 // extra space for access
  let bc = CAG.circle({ radius: rr, resolution: p.resolution })
  x = p.iphone4.bc_xoff
  y = p.iphone4.rh + p.iphone4.bc_yoff
  bc = bc.translate([x, y])

  rr = p.iphone4.bs_rr
  rr = rr + 1.00 // extra space for access
  let bs = CAG.circle({ radius: rr, resolution: p.resolution })
  x = p.iphone4.bs_xoff
  y = p.iphone4.rh + p.iphone4.bs_yoff
  bs = bs.translate([x, y])

  bc = hull(bc, bs)
  z = p.thickness + p.offset
  bc = bc.extrude({ offset: [0, 0, z] })
  z = -p.iphone4.rd2 - z
  bc = bc.translate([0, 0, z])

  return bc
}
// works only for flush case
function makeFitSlots (p) {
  const x = p.iphone4.rw
  let y = p.iphone4.rr * 0.25
  const rr = y * 0.50
  let z = p.iphone4.rd2 + (p.offset / 2)
  let c = CAG.roundedRectangle({ center: [0, 0], radius: [y, z], roundradius: rr, resolution: 16 })
  c = c.translate([0, -(p.offset / 2)])
  const c1 = CAG.roundedRectangle({ center: [0, 0], radius: [y * 3, z], roundradius: rr })
  z = (z * 2) - (p.offset / 2) - rr
  let c2 = c1.translate([0, z])
  c = c.union(c2)
  c2 = c1.translate([(y * 4), -(p.offset / 2)])
  c = c.subtract(c2)
  c2 = c1.translate([-(y * 4), -(p.offset / 2)])
  c = c.subtract(c2)
  c = c.extrude({ offset: [0, 0, x * 2] }).translate([0, 0, -x]).rotateZ(90).rotateY(90)// .translate([0,y,0]);
  b = c.rotateZ(p.fit_angle)
  y = (p.iphone4.rh) - x / 2
  z = 0
  b = b.translate([x / 2, y, z])
  // return b;
  c = c.rotateZ(-p.fit_angle)
  c = c.translate([-x / 2, y, z])
  b = b.union(c)
  b = b.union(b.rotateZ(180))
  return b
}

function main (p) {
  // var p = {};

  const s = use('http://www.z3d.jp/lab/data/lab-000000056/iPhone4_72.json')
  let iphone = CSG.cube()
  iphone = iphone.fromJSON(s)// .setColor([0,0,0]);
  iphone4(p)
  // create the case around the iphone
  let xs, ys, zs

  const ibounds = iphone.getBounds()
  const iphone_w = ibounds[1]._x - ibounds[0]._x
  const iphone_h = ibounds[1]._y - ibounds[0]._y
  const iphone_d = ibounds[1]._z - ibounds[0]._z

  let x, y, z, rr
  x = p.iphone4.rw + (p.offset + p.thickness)
  y = p.iphone4.rh + (p.offset + p.thickness)
  z = p.iphone4.rd2 + (p.offset + p.thickness) // use full depth
  rr = p.iphone4.rr + (p.offset + p.thickness)

  let c = CAG.roundedRectangle({ center: [0, 0], radius: [x, y], roundradius: rr, resolution: p.resolution })
  c = c.extrude({ offset: [0, 0, z * 2] }).translate([0, 0, -z])

  // scale the iPhone to obtain the inside of the case (negative)
  xs = ((iphone_w / 2) + p.offset) / (iphone_w / 2)
  ys = ((iphone_h / 2) + p.offset) / (iphone_h / 2)
  zs = ((iphone_d / 2) + p.offset) / (iphone_d / 2)
  const ci = iphone.scale([xs, ys, zs]).setColor([1, 1, 1])

  c = c.subtract(ci)// .setColor([0,0,0]);
  // create access to the switches, etc
  let n
  if (p.showscreen) {
    n = makeDisplay(p)
    c = c.subtract(n)
  }
  if (p.showhome) {
    n = makeHomeButton(p)
    c = c.subtract(n)
  }
  if (p.showringsilent) {
    n = makeRingSilent(p)
    c = c.subtract(n)
  }
  if (p.showvolume) {
    n = makeVolumeButtons(p)
    c = c.subtract(n)
  }
  if (p.showpower) {
    n = makePower(p)
    c = c.subtract(n)
  }
  if (p.showheadphone) {
    n = makeHeadPhone(p)
    c = c.subtract(n)
  }
  if (p.showsim) {
    n = makeSimSlot(p)
    c = c.subtract(n)
  }
  if (p.showpowerjack) {
    n = makePowerJack(p)
    c = c.subtract(n)
  }
  if (p.showspeaker) {
    n = makeSpeakers(p)
    c = c.subtract(n)
  }
  if (p.showcameraport) {
    n = makeCameraPort(p)
    c = c.subtract(n)
  }
  // apply the style
  if (p.style == 'clip') {
    const sl = CSG.cube({ center: [0, 0, 50 + p.iphone4.rd2], radius: [200, 200, 50] })
    c = c.subtract(sl)

    p.fit_angle = 45
    n = makeFitSlots(p)
    /// return n;
    c = c.subtract(n)
    /// c = c.union(n);
    return c
    // c = cutZ(c,p.i_zr-0.50);
  }

  // return iphone;
  return c
  return [c, iphone]
}
