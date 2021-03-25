const { booleans, colors, extrusions, geometries, hulls, primitives, utils } = require('@jscad/modeling')

const { subtract, union } = booleans
const { colorize, colorNameToRgb } = colors
const { extrudeLinear } = extrusions
const { geom3 } = geometries
const { hullChain } = hulls
const { circle, cylinder } = primitives
const { degToRad } = utils

const main = () => {
  // control settings
  const showGears = true

  // general settings
  const axissize = 5
  const axisfit = 0.4
  const holesize = axissize + axisfit

  // list of gears
  // diameters of each layer (3) of the gear
  // [external dia, external dia, external dia, hole dia, base dia]
  const gear30x0x0 = [57 + 7, 0, 0, holesize, holesize + (2 * 6.0)]
  const gear0x0x30 = [0, 0, 57 + 7, holesize, holesize + (2 * 6.0)]
  // const gear30x6 = [57 + 7, 11, 0, holesize, holesize + (2 * 6.0)]
  // const gear18x6 = [34 + 6, 11, 0, holesize, holesize + (2 * 5.0)]
  const gear0x18x6 = [0, 34 + 6, 11, holesize, holesize + (2 * 5.0)]
  const gear6x18x0 = [11, 34 + 6, 0, holesize, holesize + (2 * 5.0)]
  const gear12x6x0 = [23 + 5, 11, 0, holesize, holesize + (2 * 4.0)]
  const gear0x6x12 = [0, 11, 23 + 5, holesize, holesize + (2 * 4.0)]
  // const gear0x0x6 = [0, 0, 11, holesize, holesize + (2 * 3.0)]
  const gear6x0x6 = [11, 0, 11, holesize, holesize + (2 * 3.0)]
  const gear6x6x6 = [11, 11, 11, holesize, holesize + (2 * 3.0)]
  const space15 = [0, 0, 0, 0, 15]
  const space30 = [0, 0, 0, 0, 30]

  // frame layout
  const layout = {
    c: [0, 0], // center / start of layout
    t: 4.0, // thickness of frame
    g: 4.0, // thickness of each gear layer
    gears: [
      gear6x6x6,
      gear0x0x30,
      gear0x18x6,
      gear12x6x0,
      gear6x6x6,
      gear30x0x0,
      gear6x18x0,
      gear0x6x12,
      gear6x0x6,
      gear30x0x0,
      space15,
      space30
    ],
    angles: [
      0,
      135,
      20,
      320,
      45,
      90,
      160,
      210,
      140,
      70,
      35,
      0
    ]
  }
  // calculate points for holes / gears / etc
  calculatePoints(layout)

  // create the frame
  const frame = createFrame(layout)

  // create the gears
  let gears = []
  if (showGears === true) {
    gears = createGears(layout)
  }

  return [frame, gears]
}

const rotatePointAboutCenter = (center, angle, point) => {
  const s = Math.sin(degToRad(angle)) // angle is in degrees
  const c = Math.cos(degToRad(angle)) // angle is in degrees

  let px = point[0] - center[0]
  let py = point[1] - center[1]

  // clockwise
  const x = px * c + py * s
  const y = -px * s + py * c

  px = x + center[0]
  py = y + center[1]

  return [px, py]
}

const calculatePoints = (layout) => {
  // calculate placement of gears
  let previous = null
  const points = layout.gears.map((gear, i) => {
    if (previous === null) {
      previous = layout.c
      return layout.c
    }
    const angle = layout.angles[i]
    const x = previous[0]
    const g0 = layout.gears[i - 1]
    const g1 = layout.gears[i]
    // select the first layer that meshes
    let y = 0
    if ((g0[0] > 0.0) && (g1[0] > 0.0)) {
      y = previous[1] + (g0[0] / 2) + (g1[0] / 2)
    } else {
      if ((g0[1] > 0.0) && (g1[1] > 0.0)) {
        y = previous[1] + (g0[1] / 2) + (g1[1] / 2)
      } else {
        if ((g0[2] > 0.0) && (g1[2] > 0.0)) {
          y = previous[1] + (g0[2] / 2) + (g1[2] / 2)
        } else {
          y = previous[1] + (g0[4] / 2) + (g1[4] / 2) // use base
        }
      }
    }
    const point = [x, y]
    const newpoint = rotatePointAboutCenter(previous, angle, point)
    previous = newpoint
    return newpoint
  })
  // console.log(points)
  // attach to layout
  layout.points = points
}

const createFrame = (layout) => {
  const points = layout.points

  // create a frame from round corners
  const corners = points.map((point, i) => {
    const x = point[0]
    const y = point[1]
    const g = layout.gears[i]
    const r = g[4] / 2
    return circle({ center: [x, y], radius: r })
  })
  const holes = points.map((point, i) => {
    const x = point[0]
    const y = point[1]
    const g = layout.gears[i]
    const r = g[3] / 2
    if (r === 0) return []
    return circle({ center: [x, y], radius: r })
  })

  let frame = hullChain(corners)
  frame = subtract(frame, holes)

  // extrude the 2D frame to 3D
  const z = layout.t
  frame = extrudeLinear({ height: z }, frame)

  return colorize(colorNameToRgb('steelblue'), frame)
}

const createGears = (layout) => {
  const points = layout.points

  const gears = points.map((point, i) => {
    const x = point[0]
    const y = point[1]
    let z = 0
    const g = layout.gears[i]
    let gear = geom3.create()

    // layer 1
    let r = g[0] / 2
    let height = layout.g
    z = layout.t + (height / 2)
    if (r > 0.0) {
      gear = union(gear, cylinder({ center: [x, y, z], height, radius: r, segements: 16 }))
    }
    // layer 2
    z = layout.t + layout.g + (height / 2)
    r = g[1] / 2
    if (r > 0.0) {
      gear = union(gear, cylinder({ center: [x, y, z], height, radius: r, segements: 16 }))
    }
    // layer 3
    z = layout.t + layout.g + layout.g + (height / 2)
    r = g[2] / 2
    if (r > 0.0) {
      gear = union(gear, cylinder({ center: [x, y, z], height, radius: r, segements: 16 }))
    }

    // hole
    height = layout.g * 3
    z = layout.t + (height / 2)
    r = g[3] / 2
    if (r > 0.0) {
      const hole = cylinder({ center: [x, y, z], height, radius: r, segements: 16 })
      gear = subtract(gear, hole)
    }
    return gear
  })

  return gears
}

module.exports = { main }
