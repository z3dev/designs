function getParameterDefinitions() {
  return [
    { name: 'basket', type: 'group', caption: 'Desktop Waste Basket' },
    { name: 'b_z', type: 'int', initial: 100, min: 10, max: 1000, step: 1, caption: 'Height (mm)?' },
    { name: 'b_td', type: 'int', initial: 90, min: 10, max: 500, step: 1, caption: 'Top Diameter (mm)?' },
    { name: 'b_bd', type: 'int', initial: 75, min: 10, max: 500, step: 1, caption: 'Bottom Diameter (mm)?' },
    { name: 'mesh', type: 'group', caption: 'Mesh' },
    { name: 'm_d', type: 'float', initial: 2.4, min: 1.0, max: 10.0, step: 0.1, caption: 'Diameter (mm)?' },
    { name: 'm_a', type: 'int', initial: 20, min: 15, max: 50, step: 1, caption: 'Angle (degrees)?' },
    { name: 'm_h', type: 'int', initial: 10, min: 1, max: 30, step: 1, caption: 'Gap Size (mm)?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'color', type: 'choice', initial: '019/040/177/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] },
    { name: 'resolution', type: 'int', initial: 4, min: 4, max: 144, step: 4, caption: 'Resolution?' }
  ]
}

const toPolygon = (cag) => {
  const points = cag.getOutlinePaths()[0].points
  return CSG.Polygon.createFromPoints(points)
}

const createTwistCW = (p) => {
  const o = CAG.circle({ radius: p.m_r, center: [p.m_br, 0], resolution: p.resolution })

  const step = p.m_r * Math.tan(p.m_a * (Math.PI / 180))
  const steps = p.b_z / step

  const slice = toPolygon(o)
  slice.steps = steps
  slice.x = p.m_br
  slice.y = 0
  slice.z = 0
  slice.xinc = ((p.b_td / 2) - (p.b_bd / 2)) / steps
  slice.zinc = step
  slice.rinc = p.m_r
  return slice.solidFromSlices({
    numslices: slice.steps,
    callback: function (t, sliceno) {
      // console.log("t=["+t+"]");
      // console.log("sliceno=["+sliceno+"]");
      const x = slice.xinc * sliceno
      const z = slice.zinc * sliceno
      const r = slice.rinc * (sliceno + 1)
      // console.log("values=["+x+","+z+","+r+"]");
      return this.translate([x, 0, z]).rotateZ(r)
    }
  }
  )
}

const createTopRim = (p) => {
  const x = (p.m_d * 1.5) / 2
  const y = p.b_z * 0.040
  let z = p.b_td / 2
  const rr = x * 0.95
  let o = y - rr
  let a = CAG.roundedRectangle({ center: [0, -o], radius: [x, y], roundradius: rr, resolution: 32 })
  o = -p.b_a // angle of mesh
  a = a.rotateZ(o)
  a = a.translate([z, 0])
  a = a.rotateExtrude({ resolution: 64 })
  z = p.b_z - rr
  a = a.translate([0, 0, z])
  return a
}

const createBottom = (p) => {
  let x = p.m_d / 2
  const y = p.b_z * 0.065
  const rr = x * 0.95
  let o = y - rr
  let a = CAG.roundedRectangle({ center: [0, o], radius: [x, y], roundradius: rr, resolution: 32 })
  o = -p.b_a // angle of mesh
  a = a.rotateZ(o)
  const r = (p.b_bd / 2) + x + rr
  a = a.translate([r, 0])
  a = a.rotateExtrude({ resolution: 64 })
  let z = p.b_z - rr
  a = a.translate([0, 0, rr])

  x = r
  z = (p.m_d * 1.5) / 2
  const b = CSG.cylinder({ start: [0, 0, 0], end: [0, 0, z], radius: x, resolution: 64 })
  return a.union(b).translate([0, 0, -z])
}

const main = (p) => {
  // calculate some values for later functions
  p.m_r = p.m_d / 2
  p.m_br = (p.b_bd / 2)
  p.b_a = Math.atan((p.b_td - (p.b_bd * 1.10)) / p.b_z) / (Math.PI / 180) // angle of basket, not mesh

  const tr = createTopRim(p)
  const br = createBottom(p)

  // create the mesh
  let rotation = (p.m_d + p.m_h) // before adjusting
  const circ = Math.PI * 2 * (p.b_bd / 2)
  let rotations = Math.floor((circ / rotation))
  rotation = 360 / rotations // circ / rotations;
  // console.log(rotation);

  const cwWire = createTwistCW(p).reTesselated()
  const ccWire = cwWire.mirroredX()
  const mesh = []
  while (rotations >= 0) {
    mesh.push(cwWire.rotateZ(rotation * rotations))
    mesh.push(ccWire.rotateZ(rotation * rotations))
    rotations--
  }
  // compose the requested shape
  let s = [tr, br]
  s = s.concat(mesh)
  return s
}
