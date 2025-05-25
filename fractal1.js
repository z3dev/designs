const jscad = require('@jscad/modeling')
const { sphere } = jscad.primitives
const { rotate, scale, translate } = jscad.transforms
const { TAU } = jscad.maths.constants
const { colorize, cssColors } = jscad.colors

const levelColors = [
  [1.0, 1.0, 1.0, 1.0],
  cssColors.aqua,
  cssColors.blue,
  cssColors.maroon,
  cssColors.red,
  cssColors.pink,
  [0.0, 1.0, 1.0, 1.0],
  [0.0, 0.0, 1.0, 1.0],
  [1.0, 0.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0, 1.0],
]

const createLevel = (params, level, pg, pr) => {
  console.log('createLevel',level)
  pg = colorize(levelColors[level], pg)
  if (level == params.levels) return [pg]

  // create next level
  const nr = pr * params.l2l_scale
  const ns = [params.l2l_scale, params.l2l_scale, params.l2l_scale]
  const ng = createLevel(params, level + 1, scale(ns, pg), nr)
  // offset ng about pg
  const lo = pr + pr * params.l2l_offset
  const lg = translate([lo,0,0], ng)
  const lr = TAU / params.l2l_count
  const lgs = []
  for (let i = 0; i < params.l2l_count; i++) {
    lgs.push(rotate([0,0,lr*i], lg))
  }
  return [pg, lgs]
}

const getParameterDefinitions = () => [
  { name: 'group0', type: 'group', caption: 'Level (above 5 is CPU intensive)' },
  { name: 'levels', type: 'int', initial: 3, min: 2, max: 16, step: 1, caption: 'Levels:' },
  { name: 'group1', type: 'group', caption: 'Level 1' },
  { name: 'l1radius', type: 'int', initial: 10, min: 1, max: 100, step: 5, caption: 'Radius:' },
  { name: 'l1segments', type: 'int', initial: 8, min: 4, max: 64, step: 1, caption: 'Segments:' },
  { name: 'group2', type: 'group', caption: 'Level to Level' },
  { name: 'l2l_scale', type: 'number', initial: 0.20, min: 0.01, max: 0.5, caption: 'Scale:' },
  { name: 'l2l_count', type: 'int', initial: 5, min: 3, max: 64, step: 1, caption: 'Count:' },
  { name: 'l2l_offset', type: 'number', initial: 0.80, min: 0.10, max: 2.5, caption: 'Offset:' },
]

const main = (params) => {
  console.log(params)

  let l1 = sphere({radius: params.l1radius, segments: params.l1segments})

  return [l1, createLevel(params, 1, l1, params.l1radius)]
}

module.exports = { main, getParameterDefinitions }
