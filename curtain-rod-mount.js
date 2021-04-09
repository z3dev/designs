const { booleans, primitives, transforms } = require('@jscad/modeling')

const { subtract, union } = booleans
const { cuboid, cylinder, cylinderElliptic } = primitives
const { rotateZ, translate } = transforms

const makeBoltHole = (p) => {
  const r1 = p.b_s_radius + p.tolerence
  const r2 = p.b_h_radius + p.tolerence
  const shank = cylinder({ center: [0, 0, p.m_base / 2], height: p.m_base, radius: r1, segments: p.segments })
  const h = p.b_h_height + p.tolerence
  const head = cylinderElliptic({
    center: [0, 0, 0 + h / 2],
    height: h,
    startRadius: [r2 + p.tolerence, r2 + p.tolerence],
    endRadius: [r1 + p.tolerence, r1 + p.tolerence],
    segments: p.segments
  })
  return union(shank, head)
}

const makeHalfOfTop = (p) => {
  let t = cylinderElliptic({
    center: [0, 0, p.m_height / 2],
    height: p.m_height,
    startRadius: [p.m_o_radius, p.m_o_radius],
    endRadius: [p.m_i_radius, p.m_i_radius],
    segments: p.segments
  })
  const c = cuboid({ center: [0, p.m_o_radius - p.tolerence, 0], size: [p.m_o_radius * 2, p.m_o_radius * 2, p.m_height * 2] })
  t = subtract(t, c)
  return t
}

const makeTopHalf = (p) => {
  let t = makeHalfOfTop(p)

  // add the flange
  const w = p.f_weight
  const z1 = (p.m_height - w) / 2
  const z2 = z1 + w
  let h = z2 - z1
  const f = cylinder({ center: [0, 0, z1 + h / 2], height: h, radius: p.f_radius, segments: p.segments })
  t = union(t, f)

  // make a hole for the curtain rod
  h = cylinder({ center: [0, 0, p.m_height / 2], height: p.m_height, radius: p.r_radius + p.tolerence, segments: p.segments })
  t = subtract(t, h)

  // remove a slice off the bottom
  const c = cuboid({ center: [0, 0, 0], size: [p.m_o_radius * 2, p.m_o_radius * 2, p.tolerence * 2] })
  return rotateZ(Math.PI, subtract(t, c))
}

const makeBottomHalf = (p) => {
  let t = makeHalfOfTop(p)

  // make a hole for the flange
  const w = p.f_weight + (2 * p.tolerence)
  const z1 = (p.m_height - w) / 2
  const z2 = z1 + w
  let h = z2 - z1
  const f = cylinder({ center: [0, 0, z1 + h / 2], height: h, radius: p.f_radius + p.tolerence, segments: p.segments })
  t = subtract(t, f)

  // make a hole for the curtain rod
  h = cylinder({ center: [0, 0, p.m_height / 2], height: p.m_height, radius: p.r_radius + p.tolerence, segments: p.segments })
  return subtract(t, h)
}

const makeBase = (p) => {
  let a = cylinder({ center: [0, 0, -p.m_base / 2], height: p.m_base, radius: p.m_o_radius, segments: p.segments })

  // add holes for screws
  const x = p.m_o_radius / 2
  const y = p.b_h_radius + 1
  let b = translate([x, y, -p.m_base], makeBoltHole(p))
  a = subtract(a, b)
  b = translate([-x, y, -p.m_base], makeBoltHole(p))
  a = subtract(a, b)

  // add holes for the drywall bolts if necessary
  if (p.dwb_height > 0) {
    b = cylinder({ center: [0, 0, p.dwb_height / 2], height: p.dwb_height, radius: p.dwb_radius + p.tolerence, segments: p.segments })
    b = translate([x, y, -p.m_base], b)
    a = subtract(a, b)
    b = cylinder({ center: [0, 0, p.dwb_height / 2], height: p.dwb_height, radius: p.dwb_radius + p.tolerence, segments: p.segments })
    b = translate([-x, y, -p.m_base], b)
    a = subtract(a, b)
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
  // { name: 'dwb_bolts', type: 'group', caption: 'Dry Wall Bolts' },
  // { name: 'dwb_height', type: 'int', initial: 0, min: 0, caption: 'Height (mm or 0)?' },
  // { name: 'dwb_diameter', type: 'float', initial: 13.0, step: 0.25, caption: 'Head Diameter (mm)?' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'explode', type: 'checkbox', caption: 'Explode?', checked: false },
  { name: 'segments', type: 'int', initial: 36, caption: 'Resolution:' }
]

const main = (p) => {
  p.tolerence = 0.35 / 2 // radius of 3D printer nozzle
  // p.segments = 36    // circle segments
  // p.explode = 1

  p.r_radius = p.r_diameter / 2 // radius of curtain rod

  // p.m_height = 10 // height of mount (mm)
  // p.m_base = 4 // height of base of mount (mm)
  // p.m_ring = 3 // thickness of ring around the rod (mm)
  p.m_corners = 4
  p.m_o_radius = p.m_diameter / 2 // outer radius of mount
  p.m_i_radius = p.r_radius + p.m_ring // inner radius of mount

  p.f_radius = p.m_i_radius + (p.m_ring * 0.5) + ((p.m_o_radius - p.m_i_radius) * 0.10)
  p.f_weight = p.m_height / 4

  p.b_s_radius = p.b_s_diameter / 2 // radius of bolt shanks
  p.b_h_radius = p.b_h_diameter / 2 // radius of bolt heads
  // p.b_h_height = 1.8 // height of bolt heads

  p.dwb_radius = p.dwb_diameter / 2

  let b = union(makeBase(p), makeBottomHalf(p))
  let t = makeTopHalf(p)
  if (p.explode > 0) {
    // explode and translate for printing
    t = translate([0, p.m_o_radius * 2, -p.tolerence], t)
    b = translate([0, 0, p.m_base], b)
  }
  return [b, t]
}

module.exports = { main, getParameterDefinitions }
