const { primitives } = require('@jscad/modeling')

const main = (params) => {
  // calculate require parameters

  // create the parts of the sharpener

  let obj1 = primitives.ellipsoid({radius: [30, 20, 10], segments: 32})

  return obj1
}

module.exports = { main }
