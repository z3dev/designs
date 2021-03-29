const { booleans, extrusions, geometries, maths, measurements, primitives, transforms } = require('@jscad/modeling')

const { cylinder, roundedCuboid, roundedRectangle } = primitives
const { geom2, path2 } = geometries
const { extrudeFromSlices, extrudeLinear, slice } = extrusions
const { measureBoundingBox } = measurements
const { mat4 } = maths
const { center, mirrorX, rotateX, rotateZ, scale, translate } = transforms
const { subtract, union } = booleans

const getParameterDefinitions = () => [
  { name: 'design', type: 'group', caption: 'Design' },
  { name: 'scale', type: 'float', initial: 3.5, min: 1.0, max: 10.0, step: 0.1, caption: 'Scale?' },
  { name: 'fitx', type: 'float', initial: 0.0, min: -10.0, max: 10.0, step: 1, caption: 'Adjust X?' },
  { name: 'fity', type: 'float', initial: 0.0, min: -10.0, max: 10.0, step: 1, caption: 'Adjust Y?' },
  { name: 'fitz', type: 'float', initial: 0.0, min: -10.0, max: 10.0, step: 1, caption: 'Adjust Z?' },
  { name: 'ear', type: 'group', caption: 'Ear' },
  { name: 'type', type: 'choice', initial: 0, caption: 'Side?', values: [0, 1], captions: ['Right', 'Left'] },
  { name: 'wall', type: 'float', initial: 1.6, min: 1.0, max: 10.0, step: 0.1, caption: 'Wall Thickness?' },
  { name: 'show', type: 'checkbox', checked: true, caption: 'Show?' }
]

const necomimi = (p) => {
  p.necomimi_b_x = 39.5
  p.necomimi_b_y = 18.5
  p.necomimi_b_rr = 5
  p.necomimi_t_x = 27
  p.necomimi_t_y = 17
  p.necomoni_t_rr = 1
  p.necomimi_z = 30
  // motor stem
  p.necomimi_m_rr = 4 // radius of stem
  p.necomimi_m_o = 5 // offset from center
}

const makePath = (p) => {
  const ex = 0 - (p.necomimi_t_x - p.necomimi_b_x) / 2
  const ey = p.necomimi_z - (p.necomoni_t_rr)
  let a = path2.fromPoints({}, [[0, 0]])
  a = path2.appendBezier({ controlPoints: [[ex * 0.25, ey * 0.53], [ex * 0.50, ey * 0.86], [ex, ey], [ex, ey]], segments: 180 }, a)
  return a
}

// outline of the right ear of a panda (from the panda's view point)
const pandaEar = () => {
  let cag101 = path2.fromPoints({}, [[21.693121693121693, -0.25925925925925924]])
  cag101 = path2.appendBezier({ controlPoints: [[19.365079365079367, -0.2619047619047619], [18.743386243386244, -0.35449735449735453], [17.857142857142858, -0.828042328042328]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[17.275132275132275, -1.1402116402116402], [16.264550264550266, -1.8650793650793651], [15.60846560846561, -2.4391534391534395]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[14.955026455026456, -3.0132275132275135], [14.060846560846562, -3.552910052910053], [13.624338624338625, -3.6375661375661377]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[13.132275132275133, -3.7354497354497354], [12.222222222222223, -4.404761904761904], [11.230158730158731, -5.402116402116403]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[10.34920634920635, -6.2857142857142865], [9.380952380952381, -7.547619047619048], [9.074074074074074, -8.201058201058201]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[8.76984126984127, -8.857142857142858], [8.33068783068783, -10.105820105820108], [8.103174603174603, -10.97883597883598]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[7.8730158730158735, -11.851851851851851], [7.571428571428572, -13.6984126984127], [7.428571428571429, -15.07936507936508]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[7.261904761904762, -16.701058201058203], [7.261904761904762, -18.388888888888893], [7.428571428571429, -19.841269841269842]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[7.568783068783069, -21.079365079365083], [7.85978835978836, -22.685185185185187], [8.074074074074074, -23.412698412698415]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[8.288359788359788, -24.140211640211643], [8.923280423280422, -25.449735449735453], [9.484126984126984, -26.322751322751323]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[10.391534391534393, -27.732804232804234], [10.664021164021165, -27.962962962962965], [11.933862433862434, -28.37830687830688]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[13.174603174603174, -28.78571428571429], [13.886243386243388, -28.82010582010582], [17.40476190476191, -28.642857142857142]] }, cag101)
  cag101 = path2.appendPoints([[21.44973544973545, -28.43915343915344]], cag101)
  cag101 = path2.appendPoints([[22.055555555555557, -27.24867724867725]], cag101)
  cag101 = path2.appendBezier({ controlPoints: [[22.38624338624339, -26.5952380952381], [22.933862433862434, -25.582010582010582], [23.26984126984127, -25]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[23.603174603174605, -24.417989417989418], [24.880952380952383, -22.870370370370374], [26.103174603174605, -21.560846560846564]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[27.32539682539683, -20.251322751322753], [28.322751322751326, -19.08994708994709], [28.31746031746032, -18.98148148148148]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[28.312169312169313, -18.873015873015873], [29.43915343915344, -17.891534391534393], [30.820105820105823, -16.7989417989418]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[32.8994708994709, -15.158730158730158], [33.31216931216932, -14.711640211640212], [33.214285714285715, -14.21957671957672]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[33.14814814814815, -13.891534391534393], [32.78042328042328, -12.314814814814815], [32.3994708994709, -10.714285714285715]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[32.01587301587302, -9.113756613756616], [31.60846560846561, -7.6269841269841265], [31.494708994708997, -7.407407407407407]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[31.380952380952383, -7.190476190476191], [31.126984126984127, -6.357142857142858], [30.931216931216934, -5.555555555555556]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[30.656084656084655, -4.423280423280423], [30.27777777777778, -3.788359788359789], [29.243386243386247, -2.7010582010582014]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[28.148148148148152, -1.5476190476190477], [27.603174603174605, -1.2063492063492063], [26.190476190476193, -0.7777777777777778]] }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[24.947089947089946, -0.40211640211640215], [23.701058201058203, -0.25925925925925924], [21.693121693121693, -0.25925925925925924]] }, cag101)
  cag101 = path2.close(cag101)
  cag101 = geom2.fromPoints(path2.toPoints(cag101))
  return cag101
}

const extrudeFromPathA = (cag, path) => {
  const b = measureBoundingBox(cag)
  const w = b[1][0] - b[0][0]
  const h = b[1][1] - b[0][1]

  const points = path2.toPoints(path)
  const slice0 = slice.fromSides(geom2.toSides(cag))
  slice0.original_x = w
  slice0.original_y = h

  const f = extrudeFromSlices({
    numberOfSlices: points.length,
    callback: (p, sliceno, base) => {
      const v = points[sliceno]
      const sx = (base.original_x - (v[0] * 2)) / base.original_x

      const mS = mat4.fromScaling(mat4.create(), [sx, 1, 1])
      const mT = mat4.fromTranslation(mat4.create(), [0, 0, v[1]])
      return slice.transform(mat4.multiply(mat4.create(), mS, mT), base)
    }
  }, slice0)
  return f

/*
  return slice.solidFromSlices({
    numslices: slice.path.points.length,
    callback: function(t, sliceno) {
      var v = this.path.points[sliceno];
      var sx = (this.original_x - (v._x*2)) / this.original_x;
      return this.scale([sx,1]).translate([0,0,v._y]);
    }
  });
*/
}

const createNecomimi = (p) => {
  const x = p.necomimi_b_x / 2
  const y = p.necomimi_b_y / 2
  const rr = p.necomimi_b_rr
  const b = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: rr, segments: 32 })
  const z = makePath(p)
  let bs = extrudeFromPathA(b, z)
  let s = cylinder({ height: 10, center: [0, 0, -5], radius: 4, segments: p.segments })
  if (p.type === 0) { // right side ear
    s = translate([-p.necomimi_m_o, 0, 0], s)
  } else { // left side ear
    s = translate([p.necomimi_m_o, 0, 0], s)
  }
  bs = union(bs, s)
  // bs = bs.setColor([0,0,0]);
  return bs
}

const createFrame = (p) => {
  let ear = pandaEar()
  ear = scale([p.scale, p.scale], ear)
  let frame = extrudeLinear({ height: p.wall }, ear)
  frame = center({ axes: [true, true, true] }, frame)
  frame = rotateZ(Math.PI / -4, frame)
  // rotate to Z space and orientate to Z=0
  frame = rotateX(Math.PI / 2, frame)
  const b = measureBoundingBox(frame)
  frame = translate([0, 0, -(b[0][2])], frame)
  // add ribs for strength
  const x = p.wall / 2
  let z = 76
  const rr = x / 2
  let r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([0, 0, z / 2 + 6], r)
  frame = union(frame, r)
  z = 73
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([10, 0, z / 2 + 7], r)
  frame = union(frame, r)
  z = 72
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([20, 0, z / 2 + 6], r)
  frame = union(frame, r)
  z = 70
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([30, 0, z / 2 + 5], r)
  frame = union(frame, r)
  z = 46
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([40, 0, z / 2 + 20], r)
  frame = union(frame, r)
  z = 20
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([48, 0, z / 2 + 35], r)
  frame = union(frame, r)

  z = 75
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([-10, 0, z / 2 + 5], r)
  frame = union(frame, r)
  z = 72
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([-20, 0, z / 2 + 4], r)
  frame = union(frame, r)
  z = 68
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([-30, 0, z / 2 + 1], r)
  frame = union(frame, r)
  z = 51
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([-40, 0, z / 2 + 9], r)
  frame = union(frame, r)
  z = 28
  r = roundedCuboid({ center: [0, 0, 0], size: [x * 2, p.wall * 2 * 2, z], roundRadius: rr, segments: 16 })
  r = translate([-50, 0, z / 2 + 19], r)
  frame = union(frame, r)

  frame = translate([p.fitx, p.fity, p.fitz], frame)
  if (p.type === 0) { // right side ear
  } else {
    frame = mirrorX(frame)
  }
  return frame
}

const createBase = (p) => {
  let x = p.necomimi_b_x / 2
  let y = p.necomimi_b_y / 2
  const rr = p.necomimi_b_rr
  const c = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: rr, segments: 32 })
  let z = makePath(p)
  const nm = extrudeFromPathA(c, z)
  // and scale to create a shell
  const b = measureBoundingBox(nm)
  x = b[1][0] - b[0][0]
  y = b[1][1] - b[0][1]
  z = b[1][2] - b[0][2]

  x = (x + (p.offset * 2) + (p.wall * 2)) / x // percent
  y = (y + (p.offset * 2) + (p.wall * 2)) / y
  z = (z + (p.offset * 2) + (p.wall * 2)) / z

  const base = scale([x, y, z], nm)

  return base
}

const createCore = (p) => {
  let x = p.necomimi_b_x / 2
  let y = p.necomimi_b_y / 2
  const rr = p.necomimi_b_rr
  const c = roundedRectangle({ center: [0, 0], size: [x * 2, y * 2], roundRadius: rr, segments: 32 })
  let z = makePath(p)
  const nm = extrudeFromPathA(c, z)
  // and scale to create a shell
  const b = measureBoundingBox(nm)
  x = b[1][0] - b[0][0]
  y = b[1][1] - b[0][1]
  z = b[1][2] - b[0][2]

  x = (x + (p.offset * 2)) / x // percent
  y = (y + (p.offset * 2)) / y
  z = (z + (p.offset * 2)) / z

  const core = scale([x, y, z], nm)
  return core
}

const main = (p) => {
  necomimi(p)

  // p.wall = 2;
  p.angle = 7
  p.offset = 0.5
  p.segments = 32

  const nm = createNecomimi(p)

  const base = createBase(p)
  const core = createCore(p)
  const frame = createFrame(p)

  let all = subtract(union(base, frame), core)
  if (p.show === true) {
    all = union(all, nm)
  }
  return all
}

module.exports = { main, getParameterDefinitions }
