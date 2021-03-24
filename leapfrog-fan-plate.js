const { booleans, extrusions, primitives, transforms, utils } = require('@jscad/modeling')

const { subtract, union } = booleans
const { extrudeLinear } = extrusions
const { cuboid, cylinder, roundedRectangle } = primitives
const { rotateX, translate } = transforms
const { degToRad } = utils

const getParameterDefinitions = () => {
  return [
    { name: 'segments', type: 'int', initial: 36, caption: 'Segments?' }
  ]
}

const main = (p) => {
  p.tolerence = 0.35 / 2

  // dimensions of the basic plate
  p.width = 85 / 2 // OK
  p.height = 48 / 2 // OK
  p.thickness = 3.95 / 2 // OK

  // dimensions of tab on upper left
  p.tab_radius = p.thickness * 0.90
  p.tab_width = 15 / 2 + 10 // OK
  p.tab_height = 29 / 2 // OK + 10
  p.tab_x = 50 // inset from right side OK
  p.tab_bolt_diameter = 3 // OK
  p.tab_bolt_r = p.tab_bolt_diameter / 2 + p.tolerence
  p.tab_bolt_x = 6 + p.tab_bolt_r // inset from right side OK
  p.tab_bolt_z = 0.5 + p.tab_bolt_r + 8 // inset from bottom OK
  p.tab_bolt_gap = 12 // offset from centers OK

  p.bolt_diameter = 3 // OK
  p.bolt_r = p.bolt_diameter / 2 + p.tolerence
  p.bolt_x = 3.0 + p.bolt_r // inset from right side OK
  p.bolt_z = 1.5 + p.bolt_r // inset from bottom OK
  p.bolt_gap = 75.8 // distance between outside bolt centers OK
  p.bolt_gap_i = 31 // distance between motor bolt centers OK

  // dimensions of the fans
  p.fan_height = 40
  p.fan_diameter = p.fan_height - 4 - 10 // diameter of blades less fudge
  p.fan_r = p.fan_diameter / 2
  p.fan_x = 0 + (p.fan_height / 2) // inset from side OK
  p.fan_z = 1 + (p.fan_height / 2) // inset from bottom OK

  // dimensions of the tab on the lower right
  p.fan_mount_width = 12 / 2 // width of tab on right OK
  p.fan_mount_height = 20 / 2 // height of tab on right OK
  p.fan_m_bolt_diameter = 3.95 // OK
  p.fan_m_bolt_r = p.fan_m_bolt_diameter / 2 + p.tolerence
  p.fan_m_bolt_x = 4 + p.fan_m_bolt_r // inset from right side OK
  p.fan_m_bolt_z = 11 + p.fan_m_bolt_r // inset from bottom OK

  // dimensions of the square holes on the top
  p.notch_width = 12 / 2 + p.tolerence // OK
  p.notch_height = 3.95 / 2 + p.tolerence // OK
  p.notch_x = 20 + p.notch_width // inset from the right side OK
  p.notch_z = 40.5 + p.notch_height // inset from botton OK
  p.notch_gap = 33 // OK

  p.set_bolt_diameter = 4
  p.set_bolt_r = p.set_bolt_diameter / 2
  p.set_bolt_x = 24 + p.set_bolt_r // inset from right side OK
  p.set_bolt_z = 1 + p.set_bolt_r // inset from bottom OK
  p.set_bolt_gap = 33 // distance betweeen set bolt holes

  // assemble the plate
  let a = cuboid({ center: [0, 0, 0], size: [p.width * 2, p.thickness * 2, p.height * 2] })

  let x = p.width - p.tab_x - p.tab_width
  let z = p.height + p.tab_height
  let b = roundedRectangle({ center: [x, z], size: [p.tab_width * 2, p.tab_height * 2], roundRadius: p.tab_radius })
  b = extrudeLinear({ height: p.thickness * 2 }, b)
  b = rotateX(degToRad(90), b)
  b = translate([0, p.thickness, -p.tab_radius], b)
  a = union(a, b)

  x = p.width + p.fan_mount_width - p.tab_radius
  z = -p.height + p.fan_mount_height
  b = roundedRectangle({ center: [x, z], size: [(p.fan_mount_width + p.tab_radius) * 2, p.fan_mount_height * 2], roundRadius: p.tab_radius })
  b = extrudeLinear({ height: p.thickness * 2 }, b)
  b = rotateX(degToRad(90), b)
  b = translate([0, p.thickness, 0], b)
  a = union(a, b)

  // plate less the tab bolt holes
  x = p.width - p.tab_x - p.tab_bolt_x
  z = p.height + p.tab_bolt_z
  b = cylinder({ height: p.thickness * 2, radius: p.tab_bolt_r })
  b = rotateX(degToRad(90), b)
  a = subtract(a, translate([x, 0, z], b))
  z = p.height + p.tab_bolt_z + p.tab_bolt_gap
  a = subtract(a, translate([x, 0, z], b))

  // plate less the fan mount bolt holes
  // TBD move the hole up 5 mm
  x = p.width + (p.fan_mount_width * 2) - p.fan_m_bolt_x
  z = -p.height + p.fan_m_bolt_z
  b = cylinder({ height: p.thickness * 2, radius: p.fan_m_bolt_r })
  b = rotateX(degToRad(90), b)
  a = subtract(a, translate([x, 0, z], b))

  // plate less the set screw holes
  x = p.width - p.set_bolt_x
  z = -p.height + p.set_bolt_z
  b = cylinder({ height: p.thickness * 2, radius: p.set_bolt_r })
  b = rotateX(degToRad(90), b)
  a = subtract(a, translate([x, 0, z], b))
  x = x - p.set_bolt_gap
  a = subtract(a, translate([x, 0, z], b))

  // plate less the main bolt holes
  x = p.width - p.bolt_x
  z = -p.height + p.bolt_z
  b = cylinder({ height: p.thickness * 2, radius: p.bolt_r })
  b = rotateX(degToRad(90), b)
  a = subtract(a, translate([x, 0, z], b))
  x = x - p.bolt_gap_i
  a = subtract(a, translate([x, 0, z], b))

  x = p.width - p.bolt_x - p.bolt_gap
  a = subtract(a, translate([x, 0, z], b))
  x = x + p.bolt_gap_i
  a = subtract(a, translate([x, 0, z], b))

  // plate less the fan motor holes
  b = cylinder({ height: p.thickness * 2, radius: p.fan_r, segments: p.segments })
  b = rotateX(degToRad(90), b)
  x = p.width - p.fan_x
  z = -p.height + p.fan_z
  a = subtract(a, translate([x, 0, z], b))
  x = -p.width + p.fan_x
  a = subtract(a, translate([x, 0, z], b))

  // plate less the notches for the filament tube holders
  b = cuboid({ center: [0, 0, 0], size: [p.notch_width * 2, p.thickness * 2, p.notch_height * 2] })
  x = p.width - p.notch_x
  z = -p.height + p.notch_z
  a = subtract(a, translate([x, 0, z], b))
  x = x - p.notch_gap
  a = subtract(a, translate([x, 0, z], b))

  return a
}

module.exports = { main, getParameterDefinitions }
