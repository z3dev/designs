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
  let a = chain_hull(
    CAG.circle({ center: [-p.fan_bolt_gap, -p.fan_bolt_gap], radius: p.fan_bolt_m_r }),
    CAG.circle({ center: [-p.fan_bolt_gap, p.fan_bolt_gap], radius: p.fan_bolt_m_r }),
    CAG.circle({ center: [p.fan_bolt_gap, p.fan_bolt_gap], radius: p.fan_bolt_m_r }),
    CAG.circle({ center: [p.fan_bolt_gap, -p.fan_bolt_gap], radius: p.fan_bolt_m_r })
  )
  a = a.extrude({ offset: [0, 0, p.thickness * 2] })
  let b = CSG.cube({ center: [0, p.thickness * 2, p.thickness], radius: [w, h, p.thickness] })
  a = a.union(b)
  b = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, p.thickness * 2], radius: p.fan_height / 2 })
  a = a.subtract(b)

  b = CSG.cylinder({ start: [-p.fan_bolt_gap, -p.fan_bolt_gap, 0], end: [-p.fan_bolt_gap, -p.fan_bolt_gap, p.thickness * 2], radius: p.fan_bolt_r })
  a = a.subtract(b)
  b = CSG.cylinder({ start: [-p.fan_bolt_gap, p.fan_bolt_gap, 0], end: [-p.fan_bolt_gap, p.fan_bolt_gap, p.thickness * 2], radius: p.fan_bolt_r })
  a = a.subtract(b)
  b = CSG.cylinder({ start: [p.fan_bolt_gap, p.fan_bolt_gap, 0], end: [p.fan_bolt_gap, p.fan_bolt_gap, p.thickness * 2], radius: p.fan_bolt_r })
  a = a.subtract(b)
  b = CSG.cylinder({ start: [p.fan_bolt_gap, -p.fan_bolt_gap, 0], end: [p.fan_bolt_gap, -p.fan_bolt_gap, p.thickness * 2], radius: p.fan_bolt_r })
  a = a.subtract(b)

  const r = p.fan_m_bolt_z
  b = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, p.thickness * 2], radius: r })
  let c = CSG.cube({ center: [0, -(p.fan_m_bolt_x + p.fan_thickness) / 2, p.thickness], radius: [r, (p.fan_m_bolt_x + p.fan_thickness) / 2, p.thickness] })
  b = b.union(c)
  c = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, p.thickness * 2], radius: p.fan_m_bolt_r })
  b = b.subtract(c)

  let x = (p.fan_height / 2) + (p.thickness * 2) - (p.thickness * 2)
  const y = (p.fan_height / 2) + r - 5
  b = b.rotateX(90).rotateZ(90).translate([x, y, (p.thickness * 2) + p.fan_m_bolt_x + p.fan_thickness])
  a = a.union(b)
  x = ((p.thickness * 2) + p.tolerence) * 2
  b = b.translate([x, 0, 0])
  a = a.union(b)

  w = ((p.thickness * 2) + ((p.thickness * 2) + p.tolerence) * 2) / 2
  h = r
  b = CSG.cube({ center: [w + (p.fan_height / 2), y, p.thickness], radius: [w, h, p.thickness] })
  a = a.union(b)

  return a
}
