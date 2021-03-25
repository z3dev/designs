const { booleans, primitives, transforms } = require('@jscad/modeling')

const { intersect, subtract, union } = booleans
const { cuboid, cylinder, roundedCuboid } = primitives
const { rotateX, rotateZ, translate } = transforms

const getParameterDefinitions = () => {
  return [
    { name: 'cabinet', type: 'group', caption: 'Cabinet' },
    { name: 'c_top', type: 'float', initial: 13, step: 0.25, caption: 'Top Thickness (mm)?' },
    { name: 'c_frm', type: 'float', initial: 27, step: 0.25, caption: 'Frame Width (mm)?' },
    { name: 'c_ins', type: 'float', initial: 3, step: 0.25, caption: 'Frame Inset (mm)?' },
    { name: 'anchor', type: 'group', caption: 'Anchor' },
    { name: 'a_rgt', type: 'float', initial: 20.0, step: 0.25, caption: 'Right-hand Offset (mm)?' },
    { name: 'a_lft', type: 'float', initial: 17.0, step: 0.25, caption: 'Left-hand Offset (mm)?' },
    { name: 'a_len', type: 'float', initial: 60.0, step: 0.25, caption: 'Length (mm)?' },
    { name: 'a_fit', type: 'float', initial: 1.0, step: 0.05, caption: 'Tolerence (mm)?' },
    { name: 'mscrews', type: 'group', caption: 'Main Screw' },
    { name: 'm_head', type: 'float', initial: 7.80, step: 0.10, caption: 'Head Diamerter (mm)?' },
    { name: 'm_shnk', type: 'float', initial: 4.10, step: 0.10, caption: 'Shank Diameter (mm)?' },
    { name: 'sscrews', type: 'group', caption: 'Side Screws' },
    { name: 's_head', type: 'float', initial: 5.80, step: 0.10, caption: 'Head Diamerter (mm)?' },
    { name: 's_shnk', type: 'float', initial: 3.10, step: 0.10, caption: 'Shank Diameter (mm)?' },
    { name: 's_numb', type: 'int', initial: 4, caption: 'Number?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?' }
  ]
}

// given the screw dimensions, create a hole to fit
const createHole = (d) => {
  // shank
  const x = d.len
  let rr = (d.shnk / 2) + 0.10
  const hole = cylinder({ center: [0, 0, -x / 2], height: x, radius: rr, segments: d.segments })
  // head
  rr = (d.head / 2) + 0.10
  const head = cylinder({ center: [0, 0, x / 2], height: x, radius: rr, segments: d.segments })
  return union(hole, head)
}

const main = (p) => {
  let x = 0
  let y = 0
  let z = 0
  let xr = 0
  let yr = 0
  let zr = 0
  let rr = 0

  // create a simulation of the cabinet
  xr = p.c_frm // 2 times frame width
  yr = p.c_frm
  zr = p.c_top / 2
  rr = 1.0
  z = zr - p.c_top
  const ct = roundedCuboid({ center: [xr, yr, -z], size: [xr * 2, yr * 2, zr * 2], roundRadius: rr, segments: p.resolution })
  zr = p.c_top + p.a_len
  x = xr + p.c_ins
  y = yr + p.c_ins
  z = 0 - zr
  const cb = cuboid({ center: [x, y, z], size: [xr * 2, yr * 2, zr * 2] })
  const cabinet = union(ct, cb)

  // create bottom half of anchor for the cabinet
  xr = p.c_frm + p.c_ins
  yr = p.c_frm + p.c_ins
  zr = (p.c_top + p.a_len) / 2
  z = 0 - zr + p.c_top
  let ar = cuboid({ center: [0, 0, z], size: [xr * 2, yr * 2, zr * 2] })

  // create top half of anchor for the main screw
  xr = p.c_frm + p.c_ins
  yr = p.c_frm + p.c_ins
  zr = (p.m_head * 3) / 2
  x = 0
  y = 0 - yr
  z = 0 + zr + p.c_top
  let hb = cuboid({ center: [x, y, z], size: [xr * 2, yr * 2, zr * 2] })
  let h = createHole({ len: xr * 2, shnk: p.m_shnk, head: p.m_head, segments: p.resolution })
  h = rotateX(-Math.PI / 2, h)
  hb = subtract(hb, translate([0, -(p.m_head / 2), z], h))
  hb = rotateZ(-Math.PI / 4, hb)
  ar = union(ar, hb)

  // remove holes for side screws
  // FIXME this should be a loop through the number of holes
  h = createHole({ len: xr * 2, shnk: p.s_shnk, head: p.s_head, segments: p.resolution })
  h = rotateX(-Math.PI / 2, h)
  y = p.c_ins - (p.s_head * 2)
  h = rotateZ(Math.PI, translate([0, 0, 0], h))
  x = (p.c_frm * 0.75) + p.c_ins
  y = 0
  z = p.a_len * 0.20
  ar = subtract(ar, translate([x, -y, -z], h))
  z = p.a_len * 0.60
  ar = subtract(ar, translate([x, -y, -z], h))
  x = (p.c_frm * 0.25) + p.c_ins
  z = p.a_len * 0.40
  ar = subtract(ar, translate([x, -y, -z], h))
  z = p.a_len * 0.80
  ar = subtract(ar, translate([x, -y, -z], h))

  h = rotateZ(-Math.PI / 2, h)
  y = (p.c_frm * 0.25) + p.c_ins
  z = p.a_len * 0.20
  ar = subtract(ar, translate([0, y, -z], h))
  z = p.a_len * 0.60
  ar = subtract(ar, translate([0, y, -z], h))
  y = (p.c_frm * 0.75) + p.c_ins
  z = p.a_len * 0.40
  ar = subtract(ar, translate([0, y, -z], h))
  z = p.a_len * 0.80
  ar = subtract(ar, translate([0, y, -z], h))

  // now apply offsets from wall
  rr = 2.0
  xr = p.c_frm + p.c_ins + 0.05
  yr = p.c_frm + p.c_ins + 0.05
  zr = (p.a_len + p.c_top + (p.m_head * 3)) / 2
  z = p.c_top
  let off = roundedCuboid({ center: [0, 0, -z], size: [xr * 2, yr * 2, zr * 2], roundRadius: rr, segments: p.resolution })
  y = yr - p.a_lft
  x = xr - p.a_rgt
  off = translate([x, y, 0], off)
  ar = intersect(ar, off)

  return subtract(ar, cabinet)
}

module.exports = { main, getParameterDefinitions }
