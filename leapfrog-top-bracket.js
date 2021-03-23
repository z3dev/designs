const { booleans, primitives, transforms } = require('@jscad/modeling')

const { subtract, union } = booleans
const { cylinder, cuboid } = primitives
const { translate } = transforms

const getParameterDefinitions = () => {
  return [
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
}

// Leapfrog Creatr Top Bracket
// By Z3 Development

const main = (p) => {
  // tolerence for fitting nuts and clip
  const tolerence = 0.40

  // calculate the dimension of the back
  const backNutInset = 1
  const backWidthR = p.bracket_width / 2
  const backHeightR = (p.nut_weight + backNutInset) / 2
  const backLengthR = (p.plate_width / 2) + (backHeightR * 2) + (tolerence * 2)

  // calculate the dimensions of the front
  const frontWidthR = backWidthR
  const frontHeightR = (p.plate_weight / 2) + (backHeightR * 2) + tolerence
  const frontLengthR = backHeightR
  const frontTabR = backHeightR * 3

  let clip = cuboid({ center: [0, 0, 0], size: [backWidthR * 2, backLengthR * 2, backHeightR * 2] })
  let back = cuboid({ center: [0, 0, 0], size: [backWidthR * 2, backHeightR * 2, backWidthR * 2] })
  back = translate([0, -backLengthR + backHeightR, -backWidthR + backHeightR - 1], back)
  let front = cuboid({ center: [0, 0, 0], size: [frontWidthR * 2, frontLengthR * 2, frontHeightR * 2] })
  front = translate([0, backLengthR - frontLengthR, -frontHeightR + backHeightR], front)
  let tab = cuboid({ center: [0, 0, 0], size: [frontWidthR * 2, frontTabR * 2, backHeightR * 2] })
  tab = translate([0, backLengthR - frontTabR, -(frontHeightR * 2) + backHeightR + backHeightR], tab)
  clip = union(clip, back, front, tab)

  // remove holes for the bolts and the nuts if necessary
  if (p.hole_offset > 0) {
    let r = p.hole_size / 2
    const bolt = cylinder({ height: backHeightR * 2, radius: r, segments: 32 })
    const y = p.hole_offset / 2
    clip = subtract(clip, translate([0, y, 0], bolt))
    clip = subtract(clip, translate([0, -y, 0], bolt))

    r = (p.nut_size + tolerence) / 2
    const nut = cylinder({ height: backHeightR * 2, radius: r, segments: 6 })
    clip = subtract(clip, translate([0, y, -backNutInset], nut))
    clip = subtract(clip, translate([0, -y, -backNutInset], nut))
  }
  return clip
}

module.exports = { main, getParameterDefinitions }
