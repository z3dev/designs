const { booleans, extrusions, hulls, primitives, transforms } = require('@jscad/modeling')

const { subtract, union } = booleans
const { extrudeLinear } = extrusions
const { hull } = hulls
const { circle, cylinder, rectangle } = primitives
const { rotateY, translate } = transforms

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
  { name: 'segments', type: 'int', initial: 36, caption: 'Resolution?' }
]

const makeBoltHole = (p) => {
  const fit = 0.20
  p.s_r = p.s_r + fit
  p.h_r = p.h_r + fit
  const s = cylinder({ center: [0, 0, -p.l / 2], height: p.l, radius: p.s_r, segments: p.segments })
  const h = cylinder({ center: [0, 0, p.l / 2], height: p.l, radius: p.h_r, segments: p.segments })
  return union(s, h)
}

const main = (p) => {
  // p.segments = 36
  // p.type = 2 // 0 - right, 1 - left, 2 - middle
  p.rail_r = p.rail_d / 2
  p.edge_v_r = p.edge_v / 2
  p.edge_h_r = p.edge_h / 2
  // p.offset_h = 30
  // p.offset_v = 5
  p.flange_h_r = 2 / 2
  p.flange_v_r = p.flange_v / 2
  p.arch = p.flange_a
  p.arch_r = p.arch / 2
  p.screw_h_r = p.screw_h_d / 2
  p.screw_s_r = p.screw_s_d / 2
  p.wall = 1.2
  p.h_r = p.screw_h_r + (p.wall * 2)
  p.cap_r = p.rail_r + p.wall
  // p.cap_l = 15
  // define the rail circle
  p.main_wall = 1.0
  p.main_r = p.rail_r + p.main_wall

  let a = circle({ center: [0, 0], radius: p.edge_v_r, segments: p.segments })
  let b = circle({ center: [p.offset_h, p.offset_v], radius: p.cap_r, segments: p.segments })
  let c = hull(a, b)

  let x = -(p.edge_h_r * 2) + (p.flange_h_r * 2) + p.arch_r
  let y = p.arch_r + p.edge_v_r // TBD calc fudge
  a = rectangle({ center: [0, 0], size: [p.arch_r * 2, p.arch_r * 2] })
  b = circle({ center: [p.arch_r, p.arch_r], radius: p.arch, segments: p.segments })
  a = subtract(a, b)
  a = translate([x, y], a)
  // TBD add a fudge to align the arch properly
  c = union(c, a)

  x = -(p.edge_h_r * 2) + p.flange_h_r + 0.001
  y = p.flange_v_r + p.edge_v_r
  const f = rectangle({ center: [x, y], size: [p.flange_h_r * 2, p.flange_v_r * 2] })
  c = union(c, f)

  x = -p.edge_h_r
  y = 0
  let d = rectangle({ center: [x, y], size: [p.edge_h_r * 2, p.edge_v_r * 2] })
  c = subtract(c, d)
  x = x - p.edge_v_r
  d = rectangle({ center: [x, y], size: [p.edge_v_r * 2, p.edge_v_r * 2] })
  c = subtract(c, d)

  c = extrudeLinear({ height: p.h_r * 2 }, c)

  // add a hollow cylinders to hold the curtain rod
  if (p.type === 0) {
    // right side holder
    const z1 = p.wall
    const z2 = z1 + p.cap_l
    const h = z2 - z1
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 + h / 2], height: h, radius: p.cap_r, segments: p.segments })
    c = union(c, b)
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 + h / 2], height: h, radius: p.rail_r, segments: p.segments })
    c = subtract(c, b)
  }
  if (p.type === 1) {
    // left side holder
    const z1 = (p.h_r * 2) - p.wall
    const z2 = z1 - p.cap_l
    const h = z1 - z2
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 - h / 2], height: h, radius: p.cap_r, segments: p.segments })
    c = union(c, b)
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 - h / 2], height: h, radius: p.rail_r, segments: p.segments })
    c = subtract(c, b)
  }
  if (p.type === 2) {
    // middle holder
    let z1 = p.h_r + (p.wall / 2)
    let z2 = z1 + p.cap_l
    let h = z2 - z1
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 + h / 2], height: h, radius: p.cap_r, segments: p.segments })
    c = union(c, b)
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 + h / 2], height: h, radius: p.rail_r, segments: p.segments })
    c = subtract(c, b)

    z1 = p.h_r - (p.wall / 2)
    z2 = z1 - p.cap_l
    h = z1 - z2
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 - h / 2], height: h, radius: p.cap_r, segments: p.segments })
    c = union(c, b)
    b = cylinder({ center: [p.offset_h, p.offset_v, z1 - h / 2], height: h, radius: p.rail_r, segments: p.segments })
    c = subtract(c, b)
  }
  // add a hole for the bolt
  b = makeBoltHole({ s_r: p.screw_s_r, h_r: p.screw_h_r, l: (p.edge_h_r * 2), segments: p.segments })
  b = translate([-(p.edge_h_r * 2) + (p.flange_h_r * 2), p.edge_v_r + p.flange_v_r, p.h_r], rotateY(Math.PI / 2, b))
  c = subtract(c, b)

  return c
}

module.exports = { main, getParameterDefinitions }
