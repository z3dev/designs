const getParameterDefinitions = () => [
  { name: 'creatr', type: 'group', initial: 10, caption: 'Printer Top' },
  { name: 'plate_width', type: 'int', initial: 120, caption: 'Width (mm)?' },
  { name: 'plate_weight', type: 'int', initial: 4, caption: 'Weight (mm)?' },
  { name: 'bracket', type: 'group', initial: 10, caption: 'Bracket' },
  { name: 'bracket_width', type: 'int', initial: 20, caption: 'Width (mm)?' },
  { name: 'hole_offset', type: 'int', initial: 68, caption: 'Bolt Offset (mm)?' },
  { name: 'bolt', type: 'group', initial: 10, caption: 'Bolts' },
  { name: 'hole_size', type: 'int', initial: 3, caption: 'Shank (mm)?' },
  { name: 'nut', type: 'group', initial: 10, caption: 'Nuts' },
  { name: 'nut_size', type: 'int', initial: 6, caption: 'Width (mm)?' },
  { name: 'nut_weight', type: 'int', initial: 3, caption: 'Weight (mm)?' }
]

// Leapfrog Creatr Top Bracket
// By Z3 Development

const main = (p) => {
// tolerence for fitting nuts and clip
  const tolerence = 0.40
  // calculate the dimension of the back
  const bns = 1
  const bwr = p.bracket_width / 2
  const bhr = (p.nut_weight + bns) / 2
  const blr = (p.plate_width / 2) + (bhr * 2) + (tolerence * 2)
  // calculate the dimensions of the front
  const fwr = bwr
  const fhr = (p.plate_weight / 2) + (bhr * 2) + tolerence
  const flr = bhr
  const ftr = bhr * 3

  let clip = CSG.cube({ center: [0, 0, 0], radius: [bwr, blr, bhr] })
  let back = CSG.cube({ center: [0, 0, 0], radius: [bwr, bhr, bwr] })
  back = back.translate([0, -(blr) + bhr, -bwr + bhr - 1])
  let front = CSG.cube({ center: [0, 0, 0], radius: [fwr, flr, fhr] })
  front = front.translate([0, blr - flr, -fhr + bhr])
  let tab = CSG.cube({ center: [0, 0, 0], radius: [fwr, ftr, bhr] })
  tab = tab.translate([0, blr - ftr, -(fhr * 2) + bhr + bhr])
  clip = clip.union([back, front, tab])
  // remove holes for the bolts and the nuts if necessary
  if (p.hole_offset > 0) {
    const boltr = p.hole_size / 2
    const bolt = CSG.cylinder({ start: [0, 0, -bhr], end: [0, 0, bhr], radius: boltr, resolution: 32 })
    const y = p.hole_offset / 2
    clip = clip.subtract(bolt.translate([0, y, 0]))
    clip = clip.subtract(bolt.translate([0, -y, 0]))
    const nutr = (p.nut_size + tolerence) / 2
    const nut = CSG.cylinder({ start: [0, 0, -bhr], end: [0, 0, bhr], radius: nutr, resolution: 6 })
    clip = clip.subtract(nut.translate([0, y, -bns]))
    clip = clip.subtract(nut.translate([0, -y, -bns]))
  }
  return clip
  // var top = CSG.cube({center: [0,0,0], radius: [bwr*3,p.plate_width/2,p.plate_weight/2]});
  // top = top.translate([0,0,-(bhr*2)]).setColor(0,1,0,1);
  // return clip.union(top);
}
