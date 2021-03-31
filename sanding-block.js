function getParameterDefinitions() {
  return [
    { name: 'paper', type: 'group', caption: 'Paper' },
    { name: 'p_thickness', type: 'float', initial: 0.95, caption: 'Thickness (mm)?', step: 0.05, min: 0.1, max: 2.0 },
    { name: 'p_length', type: 'float', initial: 230.0, caption: 'Length (mm)?', step: 1.0, min: 5.0, max: 1000.0 },
    { name: 'p_width', type: 'float', initial: 70.0, caption: 'Width (mm)?', step: 1.0, min: 1.0, max: 1000.0 },
    { name: 'p_fold', type: 'float', initial: 20.0, caption: 'End Fold (mm)?', step: 1.0, min: 1.0, max: 1000.0 },
    { name: 'p_use', type: 'checkbox', checked: true, caption: 'Use?' },
    { name: 'block', type: 'group', caption: 'Sanding Block' },
    { name: 'b_length', type: 'float', initial: 230.0, caption: 'Length (mm)?', step: 1.0, min: 5.0, max: 1000.0 },
    { name: 'b_width', type: 'float', initial: 70.0, caption: 'Width (mm)?', step: 1.0, min: 1.0, max: 1000.0 },
    { name: 'b_heigth', type: 'float', initial: 20.0, caption: 'Heigth (mm)?', step: 1.0, min: 1.0, max: 100.0 },
    { name: 'b_corner', type: 'float', initial: 5.0, caption: 'Corner radius (mm)?', step: 0.5, min: 1.0, max: 100.0 },
    { name: 'b_use', type: 'checkbox', checked: false, caption: 'Use?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'color', type: 'choice', initial: '253/102/054/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] },
    { name: 'resolution', type: 'int', initial: 32, caption: 'Resolution?' }
  ]
}

const toPolygon = (cag) => {
  const points = cag.getOutlinePaths()[0].points
  return CSG.Polygon.createFromPoints(points)
}

const createGrip = (p) => {
  const r = 20 / 2
  const x = (p.b_length / 2) - p.b_slot_length - r - 2
  let g = CAG.circle({ radius: r, resolution: p.resolution })
  g = hull(g.translate([x, 0]), g.translate([-x, 0]))

  const slice = toPolygon(g)
  slice.z = 3.0
  const f = slice.solidFromSlices({
    numslices: 2,
    callback: function (t, index) {
      const b = g.getBounds()
      const w = b[1].x - b[0].x
      const h = b[1].y - b[0].y

      if (index === 0) return this.translate([0, 3, 0])

      const x = (w - 7.0) / w
      const y = (h - 7.0) / h
      return this.scale([x, y]).translate([0, 3, this.z])
    }
  }
  )
  return f
}

const main = (p) => {
  if (p.p_use && p.b_use) p.b_use = false // use paper by default

  if (p.p_use) {
    // calculate slot in block
    p.b_slot_length = p.p_fold + 3
    p.b_slot_thickness = p.p_thickness + 0.1
    // calculate block sizes
    p.b_height = p.p_fold
    p.b_width = p.p_width
    p.b_length = p.p_length - (2 * (p.b_slot_length + p.b_height))
    p.b_corner = p.b_height * 0.25
    p.b_handle = p.b_height * 0.75
  }

  let x = p.b_length / 2
  let y = p.b_width / 2
  let z = p.b_height / 2
  const r = p.b_corner
  let b = CAG.roundedRectangle({ radius: [x, z], roundradius: r, resolution: p.resolution })

  x = (p.b_length - (2 * p.b_corner)) / 2
  y = p.b_height / 2
  z = p.b_handle
  let p1 = new CSG.Path2D([[x, y]], false)
  p1 = p1.appendArc([-x, y], { xradius: x, yradius: z, resolution: p.resolution })
  p1 = p1.close()
  const h = p1.innerToCAG()

  b = b.union(h)

  x = p.b_slot_length
  y = p.b_slot_thickness / 2
  let s1 = CAG.rectangle({ radius: [x, y] })
  let s2 = s1.rotateZ(-15)
  s1 = s1.rotateZ(15)
  x = p.b_length / 2
  y = p.b_height / 2
  s1 = s1.translate([x, y])
  s2 = s2.translate([-x, y])

  b = b.subtract([s1, s2])

  z = p.b_width
  b = b.extrude({ offset: [0, 0, z] })

  const grip1 = createGrip(p)
  z = p.b_width
  const grip2 = grip1.mirroredZ().translate([0, 0, z])
  // return grip2;

  b = b.subtract([grip1, grip2])

  return b
}
