// Based on aa by edwardh
// Translated and Optimized to JSCAD by Z3 Development

const capmount = (p) => {
// NOTE: All calculations are radius
  const baseRadius = p.lens_radius + p.mount_width
  const innerRadius = p.lens_radius - p.mount_width

  // generate the base of the mount
  let a1 = CAG.circle({ radius: baseRadius, resolution: p.resolution })
  if (p.buckle_fill === 'hollow') {
  // remove the fill
    let a2 = CAG.circle({ radius: innerRadius, resolution: p.resolution })
    a1 = a1.subtract(a2)
    // generate extra base support
    a2 = CAG.rectangle({ radius: [baseRadius - 1, p.mount_width / 2], center: [0, 0] })
    a2 = a2.rotateZ(-45)
    a1 = union(a1, a2)
    a2 = CAG.rectangle({ radius: [baseRadius - 1, p.mount_width / 2], center: [0, 0] })
    a2 = a2.rotateZ(45)
    a1 = union(a1, a2)
  }
  a1 = a1.extrude({ offset: [0, 0, p.mount_base] })

  // generate the mount
  let b1 = CAG.circle({ radius: baseRadius, resolution: p.resolution })
  const b2 = CAG.circle({ radius: p.lens_radius, resolution: p.resolution })
  b1 = b1.subtract(b2)
  b1 = b1.extrude({ offset: [0, 0, p.mount_base + p.mount_height] })

  // add the lips if any to the mount
  let b3 = CAG.circle({ radius: baseRadius, resolution: p.resolution })
  const b4 = CAG.circle({ radius: p.lens_radius - p.mount_lip_width, resolution: p.resolution })
  b3 = b3.subtract(b4)
  b3 = b3.extrude({ offset: [0, 0, p.mount_lip_height] })

  let xheight = (p.mount_base + p.mount_height)
  for (let i = 0; i < p.mount_lip_count; i++) {
    xheight -= p.mount_lip_height
    b1 = b1.union(b3.translate([0, 0, xheight]))
    xheight -= p.mount_lip_spacing
  }

  return union(a1, b1)
}

const buckle = (p) => {
// NOTE: All calculations are radius
// same as above for the mount
  const baseRadius = p.lens_radius + p.mount_width

  const radiusInner = baseRadius + p.buckle_gap
  const radiusOuter = radiusInner + p.buckle_thickness

  const squareInner = p.strap_width / 2
  const squareOuter = squareInner + p.buckle_thickness

  // sides of the buckle
  let b3 = CAG.rectangle({ radius: [radiusOuter * 2, radiusOuter * 2], center: [0, 0] })
  b3 = b3.subtract(CAG.rectangle({ radius: [radiusOuter * 2, squareInner], center: [0, 0] }))
  // inner circle - trimmed to inside buckle width
  let b1 = CAG.circle({ radius: radiusInner, center: [0, 0], resolution: p.resolution })
  b1 = b1.subtract(b3)
  // inner - buckle split if necessary
  if (p.buckle_split > 0) {
    b1 = b1.union(CAG.rectangle({ radius: [radiusOuter * 2, p.buckle_split], center: [0, 0] }))
  }

  // sides of the buckle
  b3 = CAG.rectangle({ radius: [radiusOuter * 2, radiusOuter * 2], center: [0, 0] })
  b3 = b3.subtract(CAG.rectangle({ radius: [radiusOuter * 2, squareOuter], center: [0, 0] }))
  // outer circle - trimmed to outside of buckle
  let b2 = CAG.circle({ radius: radiusOuter, center: [0, 0], resolution: p.resolution })
  b2 = b2.subtract(b3)

  // outer circle - innner circle
  b3 = b2.subtract(b1)

  return b3.extrude({ offset: [0, 0, p.mount_base] })
}

function getParameterDefinitions() {
  return [
    { name: 'lens', type: 'group', caption: 'Lens' },
    { name: 'lens_diameter', type: 'int', initial: 77, caption: 'Diameter (mm)?' },
    { name: 'strap', type: 'group', caption: 'Strap' },
    { name: 'strap_width', type: 'int', initial: 40, caption: 'Width (mm)?' },
    { name: 'buckle', type: 'group', caption: 'Buckle' },
    { name: 'buckle_gap', type: 'int', initial: 6, caption: 'Gap for strap (mm)?' },
    { name: 'buckle_split', type: 'int', initial: 0, caption: 'Split for strap (mm or 0)?' },
    { name: 'buckle_fill', type: 'choice', initial: 'hollow', caption: 'Base?', values: ['hollow', 'solid'], captions: ['Hollow', 'Solid'] },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution:' },
    { name: 'color', type: 'choice', initial: '035/141/053/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
  ]
}

const main = (parameters) => {
  const tolerance = 0.35 // XY precision of 3D printer

  // set additional parameters
  parameters.buckle_thickness = 6 // thickness of buckle

  parameters.mount_width = 4.0 // width of ring
  parameters.mount_base = 3.0 // height of mount base
  parameters.mount_height = 4.0 // height of mount

  parameters.mount_lip_width = 0.2 // width of lip tip (to help secure cap)
  parameters.mount_lip_height = 0.2 // lip tip height (to help secure cap)
  parameters.mount_lip_spacing = 0.4 // distance between lips
  parameters.mount_lip_count = 3 // number of lips to generate

  parameters.lens_radius = (parameters.lens_diameter - tolerance) / 2

  const v1 = capmount(parameters)
  const v2 = buckle(parameters)
  return v1.union(v2)
}
