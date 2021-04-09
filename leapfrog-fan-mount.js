const { booleans, extrusions, hulls, primitives, transforms, utils } = require('@jscad/modeling')

const { circle, cuboid, cylinder } = primitives
const { hullChain } = hulls
const { extrudeLinear } = extrusions
const { subtract, union } = booleans
const { rotateX, rotateZ, translate } = transforms
const { degToRad } = utils

const main = (p) => {
  p.tolerence = 0.35 / 2

  p.thickness = 3.95 / 2 // OK

  p.fan_height = 40
  p.fan_thickness = 10
  p.fan_bolt_gap = 32 / 2
  p.fan_bolt_m_r = 8.5 / 2 // radius of mount areas on the fan
  p.fan_bolt_r = 3.8 / 2 + p.tolerence // radius of the bolts on the fan

  p.fan_mount_width = 12 / 2 // width of tab on right OK
  p.fan_mount_height = 20 / 2 // height of tab on right OK
  p.fan_m_bolt_diameter = 3.95 // OK
  p.fan_m_bolt_r = p.fan_m_bolt_diameter / 2 + p.tolerence
  p.fan_m_bolt_x = 4 + p.fan_m_bolt_r // inset from right side OK
  p.fan_m_bolt_z = (9 / 2 - p.fan_m_bolt_r) + p.fan_m_bolt_r // inset from bottom OK

  let w = (p.fan_height / 2) + (p.thickness * 2)
  let h = (p.fan_height / 2)

  // make the adapter for the fan
  let a = hullChain(
    circle({ center: [-p.fan_bolt_gap, -p.fan_bolt_gap], radius: p.fan_bolt_m_r }),
    circle({ center: [-p.fan_bolt_gap, p.fan_bolt_gap], radius: p.fan_bolt_m_r }),
    circle({ center: [p.fan_bolt_gap, p.fan_bolt_gap], radius: p.fan_bolt_m_r }),
    circle({ center: [p.fan_bolt_gap, -p.fan_bolt_gap], radius: p.fan_bolt_m_r })
  )
  a = extrudeLinear({ height: p.thickness * 2 }, a)
  let b = cuboid({ center: [0, p.thickness * 2, p.thickness], size: [w * 2, h * 2, p.thickness * 2] })
  a = union(a, b)
  b = cylinder({ center: [0, 0, p.thickness], height: p.thickness * 2, radius: p.fan_height / 2 })
  a = subtract(a, b)

  b = cylinder({ center: [-p.fan_bolt_gap, -p.fan_bolt_gap, p.thickness], height: p.thickness * 2, radius: p.fan_bolt_r })
  a = subtract(a, b)
  b = cylinder({ center: [-p.fan_bolt_gap, p.fan_bolt_gap, p.thickness], height: p.thickness * 2, radius: p.fan_bolt_r })
  a = subtract(a, b)
  b = cylinder({ center: [p.fan_bolt_gap, p.fan_bolt_gap, p.thickness], height: p.thickness * 2, radius: p.fan_bolt_r })
  a = subtract(a, b)
  b = cylinder({ center: [p.fan_bolt_gap, -p.fan_bolt_gap, p.thickness], height: p.thickness * 2, radius: p.fan_bolt_r })
  a = subtract(a, b)

  const r = p.fan_m_bolt_z
  b = cylinder({ center: [0, 0, p.thickness], height: p.thickness * 2, radius: r })
  let c = cuboid({ center: [0, -(p.fan_m_bolt_x + p.fan_thickness) / 2, p.thickness], size: [r * 2, (p.fan_m_bolt_x + p.fan_thickness), p.thickness * 2] })
  b = union(b, c)
  c = cylinder({ center: [0, 0, p.thickness], height: p.thickness * 2, radius: p.fan_m_bolt_r })
  b = subtract(b, c)

  let x = (p.fan_height / 2) + (p.thickness * 2) - (p.thickness * 2)
  const y = (p.fan_height / 2) + r - 5
  b = rotateZ(degToRad(90), rotateX(degToRad(90), b))
  b = translate([x, y, (p.thickness * 2) + p.fan_m_bolt_x + p.fan_thickness], b)
  a = union(a, b)
  x = ((p.thickness * 2) + p.tolerence) * 2
  b = translate([x, 0, 0], b)
  a = union(a, b)

  w = ((p.thickness * 2) + ((p.thickness * 2) + p.tolerence) * 2) / 2
  h = r
  b = cuboid({ center: [w + (p.fan_height / 2), y, p.thickness], size: [w * 2, h * 2, p.thickness * 2] })
  a = union(a, b)

  return a
}

module.exports = { main }
