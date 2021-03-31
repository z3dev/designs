function getParameterDefinitions() {
  return [
    { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution?' },
    { name: 'color', type: 'choice', initial: '255/180/050/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
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
  let a = CSG.cube({ center: [0, 0, 0], radius: [p.width, p.thickness, p.height] })

  let x = p.width - p.tab_x - p.tab_width
  let z = p.height + p.tab_height
  let b = CAG.roundedRectangle({ center: [x, z], radius: [p.tab_width, p.tab_height], roundradius: p.tab_radius })
  b = b.extrude({ offset: [0, 0, p.thickness * 2] }).rotateX(90).translate([0, p.thickness, -p.tab_radius])
  a = a.union(b)

  x = p.width + p.fan_mount_width - p.tab_radius
  z = -p.height + p.fan_mount_height
  b = CAG.roundedRectangle({ center: [x, z], radius: [p.fan_mount_width + p.tab_radius, p.fan_mount_height], roundradius: p.tab_radius })
  b = b.extrude({ offset: [0, 0, p.thickness * 2] }).rotateX(90).translate([0, p.thickness, 0])
  a = a.union(b)

  // plate less the tab bolt holes
  x = p.width - p.tab_x - p.tab_bolt_x
  z = p.height + p.tab_bolt_z
  b = CSG.cylinder({ start: [0, 0, -p.thickness], end: [0, 0, p.thickness], radius: p.tab_bolt_r }).rotateX(90)
  a = a.subtract(b.translate([x, 0, z]))
  z = p.height + p.tab_bolt_z + p.tab_bolt_gap
  a = a.subtract(b.translate([x, 0, z]))
  // plate less the fan mount bolt holes
  // TBD move the hole up 5 mm
  x = p.width + (p.fan_mount_width * 2) - p.fan_m_bolt_x
  z = -p.height + p.fan_m_bolt_z
  b = CSG.cylinder({ start: [0, 0, -p.thickness], end: [0, 0, p.thickness], radius: p.fan_m_bolt_r }).rotateX(90)
  a = a.subtract(b.translate([x, 0, z]))
  // plate less the set screw holes
  x = p.width - p.set_bolt_x
  z = -p.height + p.set_bolt_z
  b = CSG.cylinder({ start: [0, 0, -p.thickness], end: [0, 0, p.thickness], radius: p.set_bolt_r }).rotateX(90)
  a = a.subtract(b.translate([x, 0, z]))
  x = x - p.set_bolt_gap
  a = a.subtract(b.translate([x, 0, z]))

  // plate less the main bolt holes
  x = p.width - p.bolt_x
  z = -p.height + p.bolt_z
  b = CSG.cylinder({ start: [0, 0, -p.thickness], end: [0, 0, p.thickness], radius: p.bolt_r }).rotateX(90)
  a = a.subtract(b.translate([x, 0, z]))
  x = x - p.bolt_gap_i
  a = a.subtract(b.translate([x, 0, z]))

  x = p.width - p.bolt_x - p.bolt_gap
  a = a.subtract(b.translate([x, 0, z]))
  x = x + p.bolt_gap_i
  a = a.subtract(b.translate([x, 0, z]))

  // plate less the fan motor holes
  b = CSG.cylinder({ start: [0, 0, -p.thickness], end: [0, 0, p.thickness], radius: p.fan_r, resolution: p.resolution }).rotateX(90)
  x = p.width - p.fan_x
  z = -p.height + p.fan_z
  a = a.subtract(b.translate([x, 0, z]))
  x = -p.width + p.fan_x
  a = a.subtract(b.translate([x, 0, z]))

  // plate less the notches for the filament tube holders
  b = CSG.cube({ center: [0, 0, 0], radius: [p.notch_width, p.thickness, p.notch_height] })
  x = p.width - p.notch_x
  z = -p.height + p.notch_z
  a = a.subtract(b.translate([x, 0, z]))
  x = x - p.notch_gap
  a = a.subtract(b.translate([x, 0, z]))

  return a
}
