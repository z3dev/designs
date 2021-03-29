const getParameterDefinitions = () => [
  { name: 'bottoms', type: 'group', caption: 'Bottom' },
  { name: 'bottom_show', type: 'checkbox', caption: 'Show?', checked: true },
  { name: 'bottom_thickness', type: 'float', initial: 2.0, step: 0.5, caption: 'Thickness?' },
  { name: 'bottom_length', type: 'int', initial: 150, caption: 'Length?' },
  { name: 'bottom_width', type: 'int', initial: 100, caption: 'Width?' },
  { name: 'sides', type: 'group', caption: 'Sides' },
  { name: 'side_thickness', type: 'float', initial: 2.0, caption: 'Thickness?', min: 1.0, step: 0.1 },
  { name: 'side_height', type: 'int', initial: 50, caption: 'Height?', step: 5, min: 5 },
  { name: 'corner_radius', type: 'float', initial: 0.50, caption: 'Corners?', step: 0.5, min: 0.5 },
  { name: 'tops', type: 'group', caption: 'Top' },
  { name: 'top_show', type: 'checkbox', caption: 'Show?', checked: true },
  { name: 'top_thickness', type: 'float', initial: 2.0, caption: 'Thickness?', step: 0.5, min: 1.0 },
  { name: 'top_height', type: 'int', initial: 35, caption: 'Height?', step: 5, min: 5 },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'explode', type: 'checkbox', caption: 'Explode?', checked: false },
  { name: 'color', type: 'choice', initial: '255/180/050/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
]

// A simple design for a box with a top
// By JAG

const main = (p) => {
  p.tolerence = 0.25
  p.resolution = 16

  p.bottom_thickness_r = p.bottom_thickness / 2
  p.bottom_length_r = p.bottom_length / 2
  p.bottom_width_r = p.bottom_width / 2

  // p.top_thickness = 5;
  p.top_thickness_r = p.top_thickness / 2
  p.top_length_r = p.bottom_length_r + p.top_thickness + p.tolerence
  p.top_width_r = p.bottom_width_r + p.top_thickness + p.tolerence
  // p.top_height = 35;

  // p.side_thickness = 2;
  // p.side_height = 50;

  // p.corner_radius = 0.5;
  // p.explode = 1;

  const shown = []
  if (p.bottomw_show === false & p.top_show === false) {
    p.bottom_show = true
    p.top_show = true
  }

  // create the bottom
  let b = CSG.roundedCube({ center: [0, 0, 0], radius: [p.bottom_length_r, p.bottom_width_r, p.bottom_thickness_r], roundradius: p.corner_radius, resolution: p.resolution })

  // create the sides for the bottom
  let o = CAG.roundedRectangle({ center: [0, 0], radius: [p.bottom_length_r, p.bottom_width_r], roundradius: p.corner_radius, resolution: p.resolution })
  let i = CAG.roundedRectangle({ center: [0, 0], radius: [p.bottom_length_r - p.side_thickness, p.bottom_width_r - p.side_thickness], roundradius: p.corner_radius, resolution: p.resolution })
  o = o.subtract(i)
  o = o.extrude({ offset: [0, 0, p.side_height - p.corner_radius] })

  b = b.union(o)

  // create the top
  let t = CSG.roundedCube({ center: [0, 0, 0], radius: [p.top_length_r, p.top_width_r, p.top_thickness_r], roundradius: p.corner_radius, resolution: p.resolution })

  // create the sides for the top
  o = CAG.roundedRectangle({ center: [0, 0], radius: [p.top_length_r, p.top_width_r], roundradius: p.corner_radius, resolution: p.resolution })
  i = CAG.roundedRectangle({ center: [0, 0], radius: [p.top_length_r - p.top_thickness, p.top_width_r - p.top_thickness], roundradius: p.corner_radius, resolution: p.resolution })
  o = o.subtract(i)
  o = o.extrude({ offset: [0, 0, p.top_height - p.corner_radius] })

  t = t.union(o)

  if (p.explode === true) {
    b = b.translate([0, p.bottom_width_r + p.side_thickness + p.top_thickness, p.bottom_thickness_r])
    t = t.translate([0, -p.bottom_width_r - p.side_thickness - p.top_thickness, p.top_thickness_r])
  } else {
    t = t.rotateX(180).translate([0, 0, p.top_thickness_r + p.side_height + p.tolerence])
  }
  if (p.bottom_show === true) {
    shown.push(b)
  }
  if (p.top_show === true) {
    shown.push(t)
  }

  return union(shown)
}
