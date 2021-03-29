const getParameterDefinitions = () => [
  { name: 'handle', type: 'group', caption: 'Handle' },
  { name: 'handle_offset', type: 'int', initial: 22, caption: 'Offset for fingers?' },
  { name: 'handle_thickness', type: 'int', initial: 10, caption: 'Thickness?' },
  { name: 'handle_width', type: 'int', initial: 20, caption: 'Width?' },
  { name: 'can', type: 'group', caption: 'Can' },
  { name: 'can_show', type: 'checkbox', checked: true, caption: 'Show?' },
  { name: 'can_diameter', type: 'int', initial: 66, caption: 'Diameter?' },
  { name: 'can_height', type: 'int', initial: 116, caption: 'Height?' },
  { name: 'can_lip', type: 'group', caption: 'Top Lip' },
  { name: 'can_lip_diameter', type: 'int', initial: 57, caption: 'Outside Diameter?' },
  { name: 'can_lip_thickness', type: 'float', initial: 2.0, step: 0.1, caption: 'Thickness?' },
  { name: 'can_lip_height', type: 'float', initial: 3.0, step: 0.1, caption: 'Height?' },
  { name: 'can_bot', type: 'group', caption: 'Bottom Lip' },
  { name: 'can_bot_diameter', type: 'int', initial: 53, caption: 'Outside Diameter?' },
  { name: 'can_bot_thickness', type: 'float', initial: 4.0, step: 0.1, caption: 'Thickness?' },
  { name: 'can_bot_height', type: 'float', initial: 3.0, step: 0.1, caption: 'Height?' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'color', type: 'choice', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
]

// A handle for beer cans (and other cans as well)
// By JAG

const can = (p) => {
  let z = (p.can_height - p.can_lip_height - p.can_bot_height) / 2
  let r = p.can_diameter / 2
  let c = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: r, resolution: p.resolution })
  // top lip
  r = (p.can_lip_diameter / 2)
  let i = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  r = (p.can_lip_diameter / 2) - p.can_lip_thickness
  let j = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  i = i.subtract(j).extrude({ offset: [0, 0, p.can_lip_height] })
  i = i.translate([0, 0, z])
  c = c.union(i)
  // bottom rim
  r = (p.can_bot_diameter / 2)
  i = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  r = (p.can_bot_diameter / 2) - p.can_bot_thickness
  j = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  i = i.subtract(j).extrude({ offset: [0, 0, p.can_bot_height] })
  i = i.translate([0, 0, -z - p.can_bot_height])
  c = c.union(i)
  // position at 0,0,0
  const b = c.getBounds()
  const x = 0 - b[0].x - ((b[1].x - b[0].x) / 2)
  const y = 0 - b[0].y - ((b[1].y - b[0].y) / 2)
  z = 0 - b[0].z - ((b[1].z - b[0].z) / 2)
  c = c.translate([x, y, z])
  c = c.setColor([0.5, 0.5, 0.5])
  return c
}

const top = (p) => {
  const x = p.top_r
  const y = p.handle_width / 2
  let z = p.top_h_r
  let t = CSG.roundedCube({ center: [0, 0, 0], radius: [x, y, z], roundradius: p.handle_rr, resolution: p.resolution })
  t = t.subtract(CSG.cube({ center: [-x, 0, 0], radius: [x, y, z] }))
  let r = (p.can_lip_diameter / 2) - p.can_lip_thickness - p.top_i_r
  let i = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: r, resolution: p.resolution })
  t = t.subtract(i)
  t = t.translate([0, 0, z])
  // less indent for lip
  r = (p.can_lip_diameter / 2) + 0.25
  i = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  r = (p.can_lip_diameter / 2) - p.can_lip_thickness - 0.25
  const j = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  z = p.can_lip_height
  i = i.subtract(j).extrude({ offset: [0, 0, z] })
  t = t.subtract(i)
  // position
  z = p.can_z - p.can_lip_height
  t = t.translate([0, 0, z])
  return t
}

const bottom = (p) => {
  const x = p.bot_r
  let y = p.handle_width / 2
  let z = p.bot_h_r
  let b = CSG.roundedCube({ center: [0, 0, 0], radius: [x, y, z], roundradius: p.handle_rr, resolution: p.resolution })
  b = b.subtract(CSG.cube({ center: [-x, 0, 0], radius: [x, y, z] }))
  let r = (p.can_bot_diameter / 2) - p.can_bot_thickness - p.bot_i_r
  let i = CSG.cylinder({ start: [0, 0, -z], end: [0, 0, z], radius: r, resolution: p.resolution })
  b = b.subtract(i)
  b = b.translate([0, 0, z])
  // less indent for rim
  r = (p.can_bot_diameter / 2) + 0.25
  i = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  r = (p.can_bot_diameter / 2) - p.can_bot_thickness - 0.25
  const j = CAG.circle({ center: [0, 0], radius: r, resolution: p.resolution })
  z = (p.bot_h_r * 2) - p.bot_t
  y = p.bot_t
  i = i.subtract(j).extrude({ offset: [0, 0, z] }).translate([0, 0, y])
  b = b.subtract(i)
  // position
  z = 0 - p.can_z - p.bot_t
  b = b.translate([0, 0, z])
  return b
}

const toPolygon = (cag) => {
  const points = cag.getOutlinePaths()[0].points
  return CSG.Polygon.createFromPoints(points)
}

// the path must be centered at 0,0, and project into Y
// the number of slices is determined by the number of path segements
// each point in the path provides
// - the amount to offset the original cag X-axis
// - the slice thickness (Y)
const extrudeFromPath = (cag, path) => {
  const slice = toPolygon(cag)
  slice.path = path
  return slice.solidFromSlices({
    numslices: slice.path.points.length,
    callback: function (t, sliceno) {
      // OpenJsCad.log("t=["+t+"]");
      // OpenJsCad.log("sliceno=["+sliceno+"]");
      const v = this.path.points[sliceno]
      let x = v._x
      const y = v._y
      if (x < 0) x = 0.0
      // OpenJsCad.log("point=["+x+","+y+"]");
      return this.translate([x, 0, y])// .setColor(hsl2rgb(t,1,0.5));
    }
  }
  )
}

const handle3 = (p) => {
  let z = (p.can_z * 2) + p.top_t - p.handle_rr + p.bot_t - p.handle_rr
  // create a path to follow for the shape of the handle
  let path = new CSG.Path2D([[0, 0]])
  path = path.appendArc([0, -z], {
    xradius: 1.0,
    yradius: 5,
    resolution: Math.round(z),
    clockwise: true,
    large: false
  })
  let x = p.handle_thickness / 2
  const y = p.handle_width / 2
  let h = CAG.roundedRectangle({ center: [0, 0], radius: [x, y], roundradius: p.handle_rr, resolution: p.resolution })
  h = extrudeFromPath(h, path)

  x = (p.can_diameter / 2) + p.handle_offset + (p.handle_thickness / 2)
  z = p.top_t - p.handle_rr + p.can_z
  h = h.translate([x, 0, z])
  return h
}

const main = (p) => {
  p.resolution = 36

  // p.can_diameter = 66;
  // p.can_height = 70;

  // p.can_lip_diameter  = 64;  // lip outside diameter
  // p.can_lip_thickness = 2.5; // lip thickness
  // p.can_lip_height    = 2.0; // lip height

  // p.can_bot_diameter  = 67;  // bottom rim diameter
  // p.can_bot_thickness = 1.5; // bottom rim thickness
  // p.can_bot_height    = 3.0; // bottom rim height

  // p.handle_offset     = 22;    // handle offset from the can
  // p.handle_width      = 20;    // handle width
  // p.handle_thickness  = 10; // handle thickness
  p.handle_rr = 0.25

  p.top_t = 2.0 // thickness of top above the lip
  p.top_h_r = (p.can_lip_height + p.top_t) / 2
  p.top_i_r = 2 // size of inside lip
  p.top_r = (p.can_diameter / 2) + p.handle_offset + p.handle_thickness

  p.bot_t = 2.0 // thickness of bottom below the rim
  p.bot_h_r = (p.can_bot_height + p.bot_t) / 2
  p.bot_r = (p.can_diameter / 2) + p.handle_offset + p.handle_thickness
  p.bot_i_r = 2 // size of inside lip

  // create a mock up of the can
  const c = can(p)
  const i = c.getBounds()
  p.can_x = i[1].x // save the bounds for positioning
  p.can_y = i[1].y
  p.can_z = i[1].z

  // create the bottom of the holder
  const b = bottom(p)
  // create the top of the holder
  const t = top(p)
  // create the handle
  const h = handle3(p)

  return h.union([c, b, t])
}
