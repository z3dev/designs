const { booleans, extrusions, geometries, maths, primitives, transforms } = require('@jscad/modeling')

// functions used below
const { union } = booleans
const { extrudeFromSlices, extrudeRotate, slice } = extrusions
const { geom2 } = geometries
const { mat4 } = maths
const { circle, cylinder, roundedRectangle } = primitives
const { mirrorX, rotateZ, translate } = transforms

const getParameterDefinitions = () => [
  { name: 'basket', type: 'group', caption: 'Desktop Waste Basket' },
  { name: 'b_z', type: 'int', initial: 100, min: 10, max: 1000, step: 1, caption: 'Height (mm)?' },
  { name: 'b_td', type: 'int', initial: 90, min: 10, max: 500, step: 1, caption: 'Top Diameter (mm)?' },
  { name: 'b_bd', type: 'int', initial: 75, min: 10, max: 500, step: 1, caption: 'Bottom Diameter (mm)?' },
  { name: 'mesh', type: 'group', caption: 'Mesh' },
  { name: 'm_d', type: 'float', initial: 2.4, min: 1.0, max: 10.0, step: 0.1, caption: 'Diameter (mm)?' },
  { name: 'm_a', type: 'int', initial: 20, min: 15, max: 50, step: 1, caption: 'Angle (degrees)?' },
  { name: 'm_h', type: 'int', initial: 20, min: 1, max: 30, step: 1, caption: 'Gap Size (mm)?' },
  { name: 'm_s', type: 'int', initial: 8, min: 4, max: 144, step: 4, caption: 'Segments?' },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'segments', type: 'int', initial: 32, min: 16, max: 144, step: 4, caption: 'Segments?' }
]

const createTwistCW = (p) => {
  let o = circle({ radius: p.m_r, segments: p.m_s })
  o = translate([p.m_br, 0], o)

  let step = p.m_r * Math.tan(p.m_a * (Math.PI / 180))
  const steps = Math.floor(p.b_z / step) // steps to reach Z
  step = p.b_z / steps // exact

  const base = slice.fromSides(geom2.toSides(o))
  base.steps = steps
  base.x = p.m_br
  base.y = 0
  base.z = 0
  base.xinc = ((p.b_td / 2) - (p.b_bd / 2)) / steps
  base.zinc = step
  base.rinc = p.m_r

  const createSlice = (progress, index, baseslice) => {
    const x = baseslice.xinc * index
    const z = baseslice.zinc * index
    const r = baseslice.rinc * (index + 1) * 0.017453292519943295 // radians
    // console.log("values=["+x+","+z+","+r+"]")
    let newslice = slice.transform(mat4.fromTranslation(mat4.create(), [x, 0, z]), baseslice)
    newslice = slice.transform(mat4.fromZRotation(mat4.create(), r), newslice)
    return newslice
  }

  return extrudeFromSlices({ numberOfSlices: base.steps, callback: createSlice }, base)
}

const createTopRim = (p) => {
  const x = (p.m_d * 1.5) / 2
  const y = p.b_z * 0.040
  const rr = x * 0.95
  let o = y - rr
  let rim = roundedRectangle({ center: [0, -o], size: [x * 2, y * 2], roundRadius: rr, segments: p.segments })

  let z = p.b_td / 2
  o = -p.b_a // angle of mesh
  rim = translate([z, 0], rim)
  rim = rotateZ(o, rim)
  rim = extrudeRotate({ segments: p.segments }, rim)
  z = p.b_z + y / 2 + rr * 2
  rim = translate([0, 0, z], rim)
  return rim
}

const createBottom = (p) => {
  const x = p.m_d / 2
  const y = p.b_z * 0.065
  const rr = x * 0.95
  let o = 0
  let a = roundedRectangle({ size: [x * 2, y * 2], roundRadius: rr, segments: p.segments })
  const r = (p.b_bd / 2) + x + rr
  o = -p.b_a // angle of mesh
  a = rotateZ(o, a)
  a = translate([r, 0], a)
  a = extrudeRotate({ segments: p.segments }, a)

  const z = p.m_d * 1.5
  o = -10 + (z / 2)

  const b = cylinder({ center: [0, 0, -z / 2], height: z, radius: r, segments: p.segments })

  a = translate([0, 0, y - z], a)

  return union(a, b)
}

const main = (p) => {
  // calculate some values for later functions
  p.m_r = p.m_d / 2
  p.m_br = (p.b_bd / 2)
  p.b_a = Math.atan((p.b_td - (p.b_bd * 1.10)) / p.b_z) // angle of basket, not mesh

  // create the top rim and bottom plate
  const tr = createTopRim(p)
  const br = createBottom(p)

  // create the mesh
  const cwwire = createTwistCW(p)
  const ccwire = mirrorX(cwwire)

  let rotation = (p.m_d + p.m_h) // before adjusting
  const circ = Math.PI * 2 * (p.b_bd / 2)
  let rotations = Math.floor((circ / rotation))
  rotation = Math.PI * 2 / rotations
  const mesh = []
  while (rotations >= 0) {
    mesh.push(rotateZ(rotation * rotations, cwwire))
    mesh.push(rotateZ(rotation * rotations, ccwire))
    rotations--
  }
  // mesh = union(mesh)

  // compose the requested shape
  return [tr, br, mesh]
}

module.exports = { main, getParameterDefinitions }
