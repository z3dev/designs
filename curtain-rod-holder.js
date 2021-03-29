const getParameterDefinitions = () => [
  { name: 'rails', type: 'group', caption: 'Rails' },
  { name: 'rail_d', type: 'int', initial: 11, caption: 'Diameter (mm)?' },
  { name: 'edges', type: 'group', caption: 'Edges' },
  { name: 'edge_v', type: 'int', initial: 18, caption: 'Height (mm)?' },
  { name: 'edge_h', type: 'int', initial: 12, caption: 'Thickness (mm)?' },
  { name: 'holders', type: 'group', caption: 'Holders' },
  { name: 'type', type: 'choice', initial: 0, caption: 'Type?', values: [0, 1, 2], captions: ['Right', 'Left', 'Middle'] },
  { name: 'offset_v', type: 'int', initial: 5, caption: 'Vertical Offset (mm)?' },
  { name: 'offset_h', type: 'int', initial: 30, caption: 'Horizontal Offset (mm)?' },
  { name: 'cap_l', type: 'int', initial: 15, caption: 'Length (mm)?' },
  { name: 'flanges', type: 'group', caption: 'Flanges' },
  { name: 'flange_v', type: 'int', initial: 40, caption: 'Height (mm)?' },
  { name: 'flange_a', type: 'int', initial: 40, caption: 'Arch (mm)?' },
  { name: 'screws', type: 'group', caption: 'Screws' },
  { name: 'screw_h_d', type: 'float', initial: 5.25, step: 0.25, caption: 'Head Diameter (mm)?' },
  { name: 'screw_s_d', type: 'float', initial: 3.25, step: 0.25, caption: 'Shank Diameter (mm)?' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution?' },
  { name: 'color', type: 'choice', initial: '255/180/050/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
]

const makeBoltHole = (p) => {
  const fit = 0.20
  p.s_r = p.s_r + fit
  p.h_r = p.h_r + fit
  const s = CSG.cylinder({ start: [0, 0, -p.l], end: [0, 0, 0], radius: p.s_r, resolution: p.resolution })
  const h = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, p.l], radius: p.h_r, resolution: p.resolution })
  return s.union(h)
}

const main = (p) => {
  // p.resolution = 36;
  // p.type = 2; // 0 - right, 1 - left, 2 - middle
  p.rail_r = p.rail_d / 2
  p.edge_v_r = p.edge_v / 2
  p.edge_h_r = p.edge_h / 2
  // p.offset_h = 30;
  // p.offset_v = 5;
  p.flange_h_r = 2 / 2
  p.flange_v_r = p.flange_v / 2
  p.arch = p.flange_a
  p.arch_r = p.arch / 2
  p.screw_h_r = p.screw_h_d / 2
  p.screw_s_r = p.screw_s_d / 2
  p.wall = 1.2
  p.h_r = p.screw_h_r + (p.wall * 2)
  p.cap_r = p.rail_r + p.wall
  // p.cap_l = 15;
  // define the rail circle
  p.main_wall = 1.0
  p.main_r = p.rail_r + p.main_wall

  let a = CAG.circle({ center: [0, 0], radius: p.edge_v_r, resolution: p.resolution })
  let b = CAG.circle({ center: [p.offset_h, p.offset_v], radius: p.cap_r, resolution: p.resolution })
  let c = hull(a, b)

  let x = -(p.edge_h_r * 2) + (p.flange_h_r * 2) + p.arch_r
  let y = p.arch_r + p.edge_v_r // TBD calc fudge
  a = CAG.rectangle({ center: [0, 0], radius: [p.arch_r, p.arch_r] })
  b = CAG.circle({ center: [p.arch_r, p.arch_r], radius: p.arch, resolution: p.resolution })
  a = a.subtract(b)
  a = a.translate([x, y])
  // TBD add a fudge to align the arch properly
  c = c.union(a)

  x = -(p.edge_h_r * 2) + p.flange_h_r
  y = p.flange_v_r + p.edge_v_r
  const f = CAG.rectangle({ center: [x, y], radius: [p.flange_h_r, p.flange_v_r] })
  c = c.union(f)

  x = -p.edge_h_r
  y = 0
  let d = CAG.rectangle({ center: [x, y], radius: [p.edge_h_r, p.edge_v_r] })
  c = c.subtract(d)
  x = x - p.edge_v_r
  d = CAG.rectangle({ center: [x, y], radius: [p.edge_v_r, p.edge_v_r] })
  c = c.subtract(d)

  c = c.extrude({ offset: [0, 0, p.h_r * 2] })

  // add a hollow cylinders to hold the curtain rod
  if (p.type === 0) {
    // right side holder
    const z1 = p.wall
    const z2 = z1 + p.cap_l
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.cap_r, resolution: p.resolution })
    c = c.union(b)
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.rail_r, resolution: p.resolution })
    c = c.subtract(b)
  }
  if (p.type === 1) {
    // left side holder
    const z1 = (p.h_r * 2) - p.wall
    const z2 = z1 - p.cap_l
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.cap_r, resolution: p.resolution })
    c = c.union(b)
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.rail_r, resolution: p.resolution })
    c = c.subtract(b)
  }
  if (p.type === 2) {
    // middle holder
    let z1 = p.h_r + (p.wall / 2)
    let z2 = z1 + p.cap_l
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.cap_r, resolution: p.resolution })
    c = c.union(b)
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.rail_r, resolution: p.resolution })
    c = c.subtract(b)

    z1 = p.h_r - (p.wall / 2)
    z2 = z1 - p.cap_l
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.cap_r, resolution: p.resolution })
    c = c.union(b)
    b = CSG.cylinder({ start: [p.offset_h, p.offset_v, z1], end: [p.offset_h, p.offset_v, z2], radius: p.rail_r, resolution: p.resolution })
    c = c.subtract(b)
  }
  // add a hole for the bolt
  b = makeBoltHole({ s_r: p.screw_s_r, h_r: p.screw_h_r, l: (p.edge_h_r * 2), resolution: p.resolution })
  b = b.rotateY(90).translate([-(p.edge_h_r * 2) + (p.flange_h_r * 2), p.edge_v_r + p.flange_v_r, p.h_r])
  c = c.subtract(b)

  return c
}
