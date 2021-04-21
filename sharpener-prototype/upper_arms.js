const { booleans, colors, extrusions, hulls, primitives, transforms, utils } = require('@jscad/modeling')

const { subtract } = booleans
const { colorize, cssColors } = colors
const { extrudeLinear } = extrusions
const { hull } = hulls
const { circle, cylinder } = primitives
const { rotateX, rotateY, rotateZ, translate } = transforms
const { degToRad } = utils

const createUpperArms = (params) => {
  // bolt holes to hold plates to pipes
  let radius = params.arms.bolt / 2
  let height = (params.pipe.diameter * 2) + (params.arms.endShim * 2)
  const boltHole = rotateX(Math.PI / 2, cylinder({ height, radius }))

  // upper and lower pipes
  height = params.pipe.length
  radius = params.pipe.diameter / 2
  let pipe = subtract(
    cylinder({ height, radius }),
    cylinder({ height, radius: radius - params.pipe.thickness }),
  )
  let pipeLower = rotateY(Math.PI / 2, pipe)
  let x = (params.pipe.length / 2) - (params.plastic.thickness / 2)
  pipeLower = subtract(
    pipeLower,
    translate([-x, 0, 0], boltHole),
    translate([x, 0, 0], boltHole)
  )
  let pipeUpper = rotateY(Math.PI / 2, pipe)
  pipeUpper = subtract(
    pipeUpper,
    translate([-x, 0, 0], boltHole),
    translate([x, 0, 0], boltHole)
  )

  // front and back plates
  radius = (params.pipe.diameter / 2) + params.assembly.tolerence
  let a = (params.plastic.thickness / Math.sin(degToRad(180 - 90 - params.arms.maxAngle)))
  let y = (params.arms.offset / 2) + a
  const inner = hull(
    circle({radius, center: [0, -y]}),
    circle({radius, center: [0, y]})
  )
  radius = radius + params.arms.endShim
  const outer = hull(
    circle({radius, center: [0, -y]}),
    circle({radius, center: [0, y]})
  )
  height = params.plastic.thickness
  z = height / 2
  let endPlate = rotateZ(Math.PI / 2, rotateX(Math.PI / 2, translate([0, 0, -z], extrudeLinear({ height }, subtract(outer, inner)))))
  z = params.arms.offset
  endPlate = subtract(endPlate,
    translate([0, 0, -z], boltHole),
    translate([0, 0, z], boltHole)
  )

  x = params.pipe.length / 2 - height / 2
  let frontPlate = translate([x, 0, 0], endPlate)
  let backPlate = translate([-x, 0, 0], endPlate)

  // assemble to required position
  radius = params.pipe.diameter / 2
  z = params.arms.offset
  pipeLower = translate([0, 0, -z], pipeLower)
  pipeUpper = translate([0, 0, z], pipeUpper)

  // give some color
  pipeLower = colorize(cssColors.silver, pipeLower)
  pipeUpper = colorize(cssColors.silver, pipeUpper)
  frontPlate = colorize([0.8, 0.8, 0.8, 0.7], frontPlate)
  backPlate = colorize([0.8, 0.8, 0.8, 0.7], backPlate)

  return [pipeLower, pipeUpper, frontPlate, backPlate]
}

// THIS IS FOR TESTING
const main = (params) => {
  params = {}

  // pipe specifications
  params.pipe = {
    diameter: 13,
    thickness: 0.8, // outside walls
    length: 300 // millimeters TODO how to calculate length?
  }

  // plastic sheet specifications
  params.plastic = {
    thickness: 8 // millimeters
  }

  params.arms = {
    offset: 10, // offset of arms TODO calculate this based on maximum angle and pipe diameter
    maxAngle: 30, // maximum supported angle (0-45)
    endShim: 10,
    bolt: 5 // diameter of bolts that hold plates to pipes
  }

  // assembly specifications
  params.assembly = {
    arms: 0, // angle of arms
    tolerence: 0.200 // tolerence of parts
  }

  return createUpperArms(params)
}

module.exports = { main, createUpperArms }
