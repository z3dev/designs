function getParameterDefinitions() {
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
    { name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?' },
    { name: 'color', type: 'choice', initial: '190/133/085/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
  ]
}

// given the screen dimensions, create a hole to fit
const createHole = (d) => {
// shank
  const x = d.len
  let rr = (d.shnk / 2) + 0.10
  const hole = CSG.cylinder({ start: [0, -x, 0], end: [0, 0, 0], radius: rr, resolution: d.resolution })
  // head
  rr = (d.head / 2) + 0.10
  const head = CSG.cylinder({ start: [0, 0, 0], end: [0, x, 0], radius: rr, resolution: d.resolution })
  return hole.union(head)
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
  const ct = CSG.cube({ center: [xr, yr, -z], radius: [xr, yr, zr], roundradius: rr, resolution: p.resolution })
  zr = p.c_top + p.a_len
  x = xr + p.c_ins
  y = yr + p.c_ins
  z = 0 - zr
  const cb = CSG.cube({ center: [x, y, z], radius: [xr, yr, zr] })
  const cabinet = ct.union(cb)
  // create bottom half of anchor for the cabinet
  xr = p.c_frm + p.c_ins
  yr = p.c_frm + p.c_ins
  zr = (p.c_top + p.a_len) / 2
  z = 0 - zr + p.c_top
  let ar = CSG.cube({ center: [0, 0, z], radius: [xr, yr, zr] })
  // create top half of anchor for the main screw
  xr = p.c_frm + p.c_ins
  yr = p.c_frm + p.c_ins
  zr = (p.m_head * 3) / 2
  x = 0
  y = 0 - yr
  z = 0 + zr + p.c_top
  let hb = CSG.cube({ center: [x, y, z], radius: [xr, yr, zr] })
  let h = createHole({ len: xr * 2, shnk: p.m_shnk, head: p.m_head, resolution: p.resolution })
  hb = hb.subtract(h.translate([0, -(p.m_head / 2), z]))
  hb = hb.rotateZ(-45)
  ar = ar.union(hb)
  // remove holes for side screws
  // FIXME this should be a loop through the number of holes
  h = createHole({ len: xr * 2, shnk: p.s_shnk, head: p.s_head, resolution: p.resolution })
  y = p.c_ins - (p.s_head * 2)
  h = h.rotateZ(180).translate([0, y, 0])
  x = (p.c_frm * 0.75) + p.c_ins
  y = 0
  z = p.a_len * 0.20
  ar = ar.subtract(h.translate([x, -y, -z]))
  z = p.a_len * 0.60
  ar = ar.subtract(h.translate([x, -y, -z]))
  x = (p.c_frm * 0.25) + p.c_ins
  z = p.a_len * 0.40
  ar = ar.subtract(h.translate([x, -y, -z]))
  z = p.a_len * 0.80
  ar = ar.subtract(h.translate([x, -y, -z]))

  h = h.rotateZ(-90)
  y = (p.c_frm * 0.25) + p.c_ins
  z = p.a_len * 0.20
  ar = ar.subtract(h.translate([0, y, -z]))
  z = p.a_len * 0.60
  ar = ar.subtract(h.translate([0, y, -z]))
  y = (p.c_frm * 0.75) + p.c_ins
  z = p.a_len * 0.40
  ar = ar.subtract(h.translate([0, y, -z]))
  z = p.a_len * 0.80
  ar = ar.subtract(h.translate([0, y, -z]))
  // now apply offsets from wall
  rr = 2.0
  xr = p.c_frm + p.c_ins + 0.05
  yr = p.c_frm + p.c_ins + 0.05
  zr = (p.a_len + p.c_top + (p.m_head * 3)) / 2
  z = p.c_top
  let off = CSG.roundedCube({ center: [0, 0, -z], radius: [xr, yr, zr], roundradius: rr, resolution: p.resolution })
  y = yr - p.a_lft
  x = xr - p.a_rgt
  off = off.translate([x, y, 0])
  ar = off.intersect(ar)

  return ar.subtract(cabinet)
}
