const { circle, cuboid, cylinder, rectangle, roundedCuboid } = require('@jscad/modeling').primitives
const { rotateZ, scale, translate } = require('@jscad/modeling').transforms
const { intersect, subtract, union } = require('@jscad/modeling').booleans
const { degToRad } = require('@jscad/modeling').utils
const { extrudeLinear, extrudeRectangular } = require('@jscad/modeling').extrusions
const { vectorText } = require('@jscad/modeling').text
const { measureBoundingBox } = require('@jscad/modeling').measurements
const { path2 } = require('@jscad/modeling').geometries
const { colorize, cssColors, hexToRgb, rgbToHex } = require('@jscad/modeling').colors

const segmentToPath = (segment) => path2.fromPoints({ close: false }, segment)

const imprint = (p) => {
  p.inscription = p.inscription.replace('\\n', '\n')
  const lines = vectorText({}, p.inscription)
  const shapes = []
  lines.forEach((pl) => {
    shapes.push(extrudeRectangular({ size: 1, height: p.sticker_thickness * 2 }, segmentToPath(pl)))
  })
  const i = union(shapes)
  const xbounds = measureBoundingBox(i)
  let xscale = (p.sticker_radius * 2 - 1) / (xbounds[1][0] - xbounds[0][0])
  const yscale = (p.sticker_radius * 2 - 1) / (xbounds[1][1] - xbounds[0][1])
  // echo("xscale: "+xscale)
  // echo("yscale: "+yscale)
  if (yscale < xscale) xscale = yscale
  return scale([xscale, xscale, 1], i)
}

const generateTabs = (row, p) => {
  const segments = p.tab_segments
  const value = p.tab_values[row]
  // echo("ROW: "+row+" VALUE: "+typeof(value))

  let tab = null
  let tindex = 0
  let y = 0
  let z = 0
  const tabs = []
  if (value[3] === '1') {
    tindex = 3
    tab = roundedCuboid({ size: [p.tab_lengths[tindex] * 2, p.tab_widths[tindex] * 2, p.tab_heights[tindex] * 2], roundRadius: p.tab_radius, segments })
    y = p.base_radius - p.tab_rows[row]
    z = p.tab_heights[tindex] + p.base_thickness - p.sticker_thickness - p.tab_radius
    tabs.push(translate([p.tab_offsets[tindex] + p.tab_lengths[tindex], y, z], tab))
  }
  if (value[2] === '1') {
    tindex = 2
    tab = roundedCuboid({ size: [p.tab_lengths[tindex] * 2, p.tab_widths[tindex] * 2, p.tab_heights[tindex] * 2], roundRadius: p.tab_radius, segments })
    y = p.base_radius - p.tab_rows[row]
    z = p.tab_heights[tindex] + p.base_thickness - p.sticker_thickness - p.tab_radius
    tabs.push(translate([p.tab_offsets[tindex] + p.tab_lengths[tindex], y, z], tab))
  }
  if (value[1] === '1') {
    tindex = 1
    tab = roundedCuboid({ size: [p.tab_lengths[tindex] * 2, p.tab_widths[tindex] * 2, p.tab_heights[tindex] * 2], roundRadius: p.tab_radius, segments })
    y = p.base_radius - p.tab_rows[row]
    z = p.tab_heights[tindex] + p.base_thickness - p.sticker_thickness - p.tab_radius
    tabs.push(translate([p.tab_offsets[tindex] + p.tab_lengths[tindex], y, z], tab))
  }
  if (value[0] === '1') {
    tindex = 0
    tab = roundedCuboid({ size: [p.tab_lengths[tindex] * 2, p.tab_widths[tindex] * 2, p.tab_heights[tindex] * 2], roundRadius: p.tab_radius, segments })
    y = p.base_radius - p.tab_rows[row]
    z = p.tab_heights[tindex] + p.base_thickness - p.sticker_thickness - p.tab_radius
    tabs.push(translate([p.tab_offsets[tindex] + p.tab_lengths[tindex], y, z], tab))
  }
  return union(tabs)
}

const generateRows = (p) => {
  // for each of the rows
  // - generate the tabs
  const rows = []
  for (let i = 0; i < p.tab_values.length; i++) {
    if (p.tab_values[i].length === 4) {
      rows.push(generateTabs(i, p))
    }
  }
  return union(rows)
}

const inset = (p) => {
  let a = circle({ center: [0, 0], radius: p.base_radius, segments: p.segments })
  let b = rectangle({ center: [0, 0], size: [3 * 2, (p.base_radius + 5) * 2] })
  let i = rotateZ(degToRad(p.inset_tab_angle), b)
  i = union(i, rotateZ(degToRad(-p.inset_tab_angle), b))
  b = rectangle({ center: [0, 0], size: [p.base_radius * 2, p.inset_gap_radius * 2] })
  i = subtract(i, b)
  i = intersect(i, a)
  b = circle({ center: [0, 0], radius: p.inset_radius, segments: p.segments })
  a = subtract(a, b)
  i = union(i, a)
  b = circle({ center: [0, 0], radius: p.base_radius + 0.01, segments: p.segments })
  i = subtract(b, i)
  i = extrudeLinear({ height: p.inset_thickness }, i)
  return i
}

const edges2 = (p) => {
  let b = circle({ radius: p.base_radius, segments: p.segments })
  let c = circle({ radius: p.base_radius - p.edge_thickness, segments: p.segments })
  b = subtract(b, c)

  c = circle({ radius: p.base_radius - p.edge_thickness - p.inner_edge_offset, segments: p.segments })
  let d = circle({ radius: p.base_radius - p.edge_thickness - p.inner_edge_offset - p.edge_thickness, segments: p.segments })
  c = subtract(c, d)
  b = union(b, c)

  c = rectangle({ size: [(p.slot_radius + p.edge_thickness) * 2, p.base_radius * 2] })
  d = circle({ radius: p.base_radius, segments: p.segments })
  c = intersect(c, d)
  b = union(b, c)
  d = rectangle({ size: [p.slot_radius * 2, p.base_radius * 2 + 0.01] })
  b = subtract(b, d)

  c = rectangle({ center: [0, p.base_radius], size: [p.edge_thickness, p.base_radius * 2] })
  b = subtract(b, rotateZ(degToRad(27), c))
  b = subtract(b, rotateZ(degToRad(-27), c))

  b = extrudeLinear({ height: p.edge_thickness }, b)
  return translate([0, 0, p.base_thickness], b)
}

const colorParameter = (options) => {
  const defaults = { name: 'color', initial: '#000000', caption: 'Color?' }
  const { name, initial, caption } = Object.assign({}, defaults, options)
  const type = 'choice'
  const values = []
  const captions = []
  for (const [key, value] of Object.entries(cssColors)) {
    captions.push(`${key}`)
    values.push(rgbToHex(value))
  }
  return { name, type, initial, caption, values, captions }
}

const getParameterDefinitions = () => [
  { name: 'front', type: 'group', caption: 'Front' },
  { name: 'style', type: 'choice', initial: 1, caption: 'Face Style?', values: [1, 0], captions: ['Normal', 'Flat'] },
  { name: 'back', type: 'group', caption: 'Back' },
  { name: 'row_1', type: 'text', initial: '1011', caption: 'ROW 1?' },
  { name: 'row_2', type: 'text', initial: '0001', caption: 'ROW 2?' },
  { name: 'row_3', type: 'text', initial: '0111', caption: 'ROW 3?' },
  { name: 'row_4', type: 'text', initial: '0101', caption: 'ROW 4?' },
  { name: 'inscription', type: 'text', initial: '', caption: 'Caption (0-20 letters)?' },
  { name: 'imprint', type: 'choice', initial: 0, caption: 'Rendering?', values: [0, 1], captions: ['Imprinted', 'Raised'] },
  { name: 'others', type: 'group', caption: 'Others' },
  { name: 'segments', type: 'int', initial: 36, caption: 'Resolution:' },
  colorParameter({})
]

const main = (p) => {
  p.xy_tolerence = 0.320 / 2
  p.z_tolerence = 0.200 / 2

  p.medal_diameter = 43
  p.medal_thickness = 4.0 - (p.z_tolerence * 2)
  p.medal_slot = 19

  p.edge_thickness = 1.7
  p.base_thickness = p.medal_thickness - p.edge_thickness
  p.base_radius = p.medal_diameter / 2
  p.inner_edge_offset = 4 - p.edge_thickness
  p.slot_radius = p.medal_slot / 2 + p.xy_tolerence
  p.slot_fudge = 5.55
  p.sticker_radius = p.slot_radius - 1.5
  p.sticker_thickness = 0.500
  p.sticker_offset = 3

  p.inset_gap_radius = 15
  p.inset_radius = p.base_radius - 2
  p.inset_thickness = 0.65
  p.inset_tab_angle = 5

  p.tab_radius = 0.2
  p.tab_values = [p.row_1, p.row_2, p.row_3, p.row_4] // these come from parameters
  p.tab_lengths = [4.0 / 2, 4.0 / 2, 4.0 / 2, 4.0 / 2]
  p.tab_widths = [1.2 / 2, 1.2 / 2, 1.2 / 2, 1.2 / 2]
  p.tab_heights = [p.edge_thickness / 2 + p.tab_radius, p.edge_thickness / 2 + p.tab_radius, p.edge_thickness / 2 + p.tab_radius, p.edge_thickness / 2 + p.tab_radius]
  p.tab_offsets = [0.0 - p.sticker_radius, 4.0 - p.sticker_radius, p.sticker_radius - 8.0, p.sticker_radius - 4.0]
  p.tab_rows = [3.0, 9.0, 15.0, 21.0]
  p.tab_segments = 16

  // p.segments = 72 // 180(2) 120(3) 90(4) 72(5) 60(6) 40(9) 36(10) 30(12)
  p.edge_segments = 16

  // make the top
  let a = cylinder({ center: [0, 0, p.base_thickness / 2], height: p.base_thickness, radius: p.base_radius, segments: p.segments })
  // remove small indents for easy removal
  let b = { }
  if (p.style === 0) { // flat
    b = cuboid({ center: [0, 0, 0], size: [3.5 * 2, 0.5 * 2, 10 * 2] })
    b = translate([0, -p.base_radius + 2.0, 0], b)
    a = subtract(a, b)
  }
  if (p.style === 1) { // inset
    b = cuboid({ center: [0, 0, 0], size: [2.5 * 2, 0.5 * 2, 0.5 * 2] })
    b = translate([0, -p.base_radius + 4.7, 0], b)
    a = subtract(a, b)
    b = cuboid({ center: [0, 0, 0], size: [3.5 * 2, 0.5 * 2, 0.5 * 2] })
    b = translate([0, -p.base_radius + 2.0, 0], b)
    a = subtract(a, b)
    // and an inset on the top
    b = inset(p)
    a = subtract(a, b)
  }

  // remove a small slice for the sticker and the tabs
  b = cuboid({ size: [p.sticker_radius * 2, p.base_radius * 2, p.sticker_thickness * 2] })
  b = translate([0, p.sticker_offset, p.base_thickness], b)
  a = subtract(a, b)

  // add text for the sticker if available
  if (p.inscription.length > 0 && p.inscription.length < 20) {
    let i = imprint(p)
    if (p.imprint === 0) {
      i = translate([-p.sticker_radius, -p.base_radius + (p.sticker_radius * 2), p.base_thickness - (p.sticker_thickness * 2)], i)
      a = subtract(a, i)
    } else {
      i = translate([-p.sticker_radius, -p.base_radius + (p.sticker_radius * 2), p.base_thickness - (p.sticker_thickness * 2)], i)
      a = union(a, i)
    }
  }

  // add edges around the bottom
  const e = edges2(p)

  // add four rows of tabs
  const r = generateRows(p)

  a = union(a, e, r)
  a = colorize(hexToRgb(p.color), a)
  return a
}

module.exports = { main, getParameterDefinitions }
