const makeBoltHole = (p) => {
  const r1 = p.b_s_radius + p.tolerence
  const r2 = p.b_h_radius + p.tolerence
  const s = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, p.m_base],
    radius: r1,
    resolution: p.resolution
  })
  const x = p.m_base - p.b_h_height - (2 * p.tolerence)
  const h = CSG.cylinder({
    start: [0, 0, x],
    end: [0, 0, p.m_base],
    radiusStart: r1 + p.tolerence,
    radiusEnd: r2 + p.tolerence,
    resolution: p.resolution
  })
  return s.union(h)
}

const makeHalfOfTop = (p) => {
  let t = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, p.m_height],
    radiusStart: p.m_o_radius,
    radiusEnd: p.m_i_radius,
    resolution: p.resolution
  })
  const c = CSG.cube({ center: [0, p.m_o_radius - p.tolerence, 0], radius: [p.m_o_radius, p.m_o_radius, p.m_height] })
  t = t.subtract(c)
  return t
}

const makeTopHalf = (p) => {
  let t = makeHalfOfTop(p)
  // add the flange
  const w = p.f_weight
  const z1 = (p.m_height - w) / 2
  const z2 = z1 + w
  const f = CSG.cylinder({
    start: [0, 0, z1],
    end: [0, 0, z2],
    radius: p.f_radius,
    resolution: p.resolution
  })
  t = t.union(f)
  // make a hole for the curtain rod
  const h = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, p.m_height],
    radius: p.r_radius + p.tolerence,
    resolution: p.resolution
  })
  t = t.subtract(h)
  // remove a slice off the bottom
  const c = CSG.cube({ center: [0, 0, 0], radius: [p.m_o_radius, p.m_o_radius, p.tolerence] })
  return t.subtract(c).rotateZ(180)
}

const makeBottomHalf = (p) => {
  let t = makeHalfOfTop(p)
  // make a hole for the flange
  const w = p.f_weight + (2 * p.tolerence)
  const z1 = (p.m_height - w) / 2
  const z2 = z1 + w
  const f = CSG.cylinder({
    start: [0, 0, z1],
    end: [0, 0, z2],
    radius: p.f_radius + p.tolerence,
    resolution: p.resolution
  })
  t = t.subtract(f)
  // make a hole for the curtain rod
  const h = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, p.m_height],
    radius: p.r_radius + p.tolerence,
    resolution: p.resolution
  })
  return t.subtract(h)
}

const base = (p) => {
  let a = CSG.cylinder({
    start: [0, 0, -p.m_base],
    end: [0, 0, 0],
    radius: p.m_o_radius,
    resolution: p.resolution
  })
  // add holes for screws
  const x = p.m_o_radius / 2
  const y = p.b_h_radius + 1
  let b = makeBoltHole(p).translate([x, y, -p.m_base])
  a = a.subtract(b)
  b = makeBoltHole(p).translate([-x, y, -p.m_base])
  a = a.subtract(b)
  // add holes for the drywall bolts if necessary
  if (p.dwb_height > 0) {
    b = CSG.cylinder({
      start: [0, 0, 0],
      end: [0, 0, p.dwb_height],
      radius: p.dwb_radius + p.tolerence,
      resolution: p.resolution
    })
    b = b.translate([x, y, -p.m_base])
    a = a.subtract(b)
    b = CSG.cylinder({
      start: [0, 0, 0],
      end: [0, 0, p.dwb_height],
      radius: p.dwb_radius + p.tolerence,
      resolution: p.resolution
    })
    b = b.translate([-x, y, -p.m_base])
    a = a.subtract(b)
  }
  return a
}

const getParameterDefinitions = () => [
  { name: 'curtain_rod', type: 'group', caption: 'Curtain Rods' },
  { name: 'r_diameter', type: 'float', initial: 13.0, step: 0.25, caption: 'Diameter (mm)?' },
  { name: 'mounts', type: 'group', caption: 'Mounts' },
  { name: 'm_height', type: 'int', initial: 10, caption: 'Height (mm)?' },
  { name: 'm_diameter', type: 'float', initial: 45.0, step: 0.25, caption: 'Diameter (mm)?' },
  { name: 'm_base', type: 'int', initial: 4, caption: 'Base Height (mm)?' },
  { name: 'm_ring', type: 'int', initial: 3, caption: 'Ring Thickness (mm)?' },
  { name: 'bolts', type: 'group', caption: 'Screws' },
  { name: 'b_s_diameter', type: 'float', initial: 3.4, step: 0.2, caption: 'Shank Diameter (mm)?' },
  { name: 'b_h_diameter', type: 'float', initial: 5.4, step: 0.2, caption: 'Head Diameter (mm)?' },
  { name: 'b_h_height', type: 'float', initial: 1.8, step: 0.2, caption: 'Head Height (mm)?' },
  { name: 'dw_bolts', type: 'group', caption: 'Dry Wall Bolts' },
  { name: 'dw_height', type: 'int', initial: 8, caption: 'Height (mm or 0)?' },
  { name: 'dw_diameter', type: 'float', initial: 13.0, step: 0.25, caption: 'Head Diameter (mm)?' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'explode', type: 'checkbox', caption: 'Explode?', checked: false },
  { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution:' },
  { name: 'color', type: 'choice', initial: '035/141/053/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
]

const main = (p) => {
  p.tolerence = 0.35 / 2 // radius of 3D printer nozzle
  // p.resolution = 36;    // circle resolution
  // p.explode = 1;

  p.r_radius = p.r_diameter / 2 // radius of curtain rod

  // p.m_height = 10; // height of mount (mm)
  // p.m_base = 4; // height of base of mount (mm)
  // p.m_ring = 3; // thickness of ring around the rod (mm)
  p.m_corners = 4
  p.m_o_radius = p.m_diameter / 2 // outer radius of mount
  p.m_i_radius = p.r_radius + p.m_ring // inner radius of mount

  p.f_radius = p.m_i_radius + (p.m_ring * 0.5) + ((p.m_o_radius - p.m_i_radius) * 0.10)
  p.f_weight = p.m_height / 4

  p.b_s_radius = p.b_s_diameter / 2 // radius of bolt shanks
  p.b_h_radius = p.b_h_diameter / 2 // radius of bolt heads
  // p.b_h_height = 1.8; // height of bolt heads

  p.dwb_radius = p.dwb_diameter / 2
  // p.dwb_height = 1;

  let b = base(p).union(makeBottomHalf(p))
  let t = makeTopHalf(p)
  if (p.explode > 0) {
    // explode and translate for printing
    t = t.translate([0, p.m_o_radius * 2, -p.tolerence])
    b = b.translate([0, 0, p.m_base])
  }
  return b.union(t)
}
