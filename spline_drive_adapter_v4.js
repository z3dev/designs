/*
const getParameterDefinitions = () => {
  return [
    { name:     'n_splines',
      type:     'int',
      caption:  'Number of splines',
      initial:  6 },

    { name:     'spline_width',
      type:     'float',
      caption:  'Spline width (mm)',
      initial:  2.9 },

    { name:     'spline_inner_diameter',
      type:     'float',
      caption:  'Spline shaft inner diameter (mm)',
      initial:  10.65 },

    { name:     'spline_outer_diameter',
      type:     'float',
      caption:  'Spline outer diameter (mm)',
      initial:  13.65 },

    { name:     'spline_depth',
      type:     'float',
      caption:  'Spline depth (mm)',
      initial:  23.9 },

    { name:     'adapter_length',
      type:     'float',
      caption:  'Adapter length (mm)',
      initial:  40.0 },

    { name:     'adapter_diameter',
      type:     'float',
      caption:  'Adapter diameter (mm)',
      initial:  23.0 },

    { name:     'tooth_profile',
      type:     'choice',
      caption:  'Spline profile',
      values:   ["square", "curved"],
      captions: ["square", "curved"],
      initial:  "curved" },

    { name:     'drive_size',
      type:     'choice',
      caption:  'Ratchet socket wrench drive size',
      values:   [6.35, 12.7],
      captions: ["1/4\"", "1/2\""],
      initial:  12.7 },
  ];
}
*/

const main = (params) => {
  const p = {}

  p.resolution = 72
  p.tolerance = 0.40 / 2 // printer filament diameter / 2
  p.adapter_length = params.adapter_length
  p.adapter_radius = params.adapter_diameter / 2
  p.spline_outer_radius = params.spline_outer_diameter / 2
  p.spline_inner_radius = params.spline_inner_diameter / 2
  p.spline_width = params.spline_width / 2
  p.spline_depth = params.spline_depth
  p.min_drive_socket_depth = 15
  p.drive_socket_hole_tolerance = 0.15 // empirical?
  p.drive_socket_hole_size = (parseFloat(params.drive_size) +
                                   p.drive_socket_hole_tolerance) / 2
  p.drive_socket_depth = p.adapter_length - p.spline_depth

  // sanity check model parameters
  if (params.n_splines < 2) { throw new Error('Number of splines must be > 1') }

  if (p.drive_socket_depth < p.min_drive_socket_depth) { throw new Error('Adapter length must be >= ' + (p.spline_depth + p.min_drive_socket_depth)) }

  if (params.adapter_diameter < (params.spline_outer_diameter + 2)) { throw new Error('Adapter diameter must be >= ' + (params.spline_outer_diameter + 2)) }

  // create the splines
  let splines, chamfers
  const chamferDepth = 2 // must be > 1
  const outerCircle = CAG.circle({
    center: [0, 0],
    radius: p.spline_outer_radius,
    resolution: p.resolution
  })
  for (let n = 0; n < params.n_splines; n++) {
    let s = CAG.rectangle({
      center: [0, -p.spline_outer_radius / 2],
      radius: [p.spline_width, p.spline_outer_radius / 2],
      resolution: p.resolution
    })
    const angle = n * (360.0 / params.n_splines)
    s = s.rotateZ(angle)
    if (params.tooth_profile === 'curved') {
      // change spline teeth from square profile to circular
      s = outerCircle.intersect(s)
    }

    const x = s.getOutlinePaths()[0].points
    const y = CSG.Polygon.createFromPoints(x)
    const splineLobe = s.extrude({ offset: [0, 0, p.spline_depth] })
    const chamferLobe = y.solidFromSlices({
      numslices: chamferDepth,
      callback: function (t, sliceno) {
        // echo("in callback chamferLobe");
        // echo("t=["+t+"]");
        // echo("sliceno=["+sliceno+"]");
        const coef = 1 - t
        // echo("coef=["+coef+"]");
        const h = t * chamferDepth
        // echo("h=["+h+"]");
        return this.scale([1 + coef / 10, 1 + coef / 10, 1]).translate([0, 0, h])
      }
    })
    splines = splines ? splines.union(splineLobe) : splineLobe
    chamfers = chamfers ? chamfers.union(chamferLobe) : chamferLobe
  }
  // return splines.union(chamfers);

  // create the spline shaft
  let splineShaft = CAG.circle({
    center: [0, 0],
    radius: p.spline_inner_radius,
    resolution: p.resolution
  })
  splineShaft = splineShaft.extrude({ offset: [0, 0, p.spline_depth] })
  splineShaft = splineShaft.union([splines, chamfers])
  // return splineShaft;

  // create the drive shaft
  let driveShaft = CAG.rectangle({
    center: [0, 0],
    radius: [p.drive_socket_hole_size, p.drive_socket_hole_size],
    resolution: p.resolution
  })
  driveShaft = driveShaft.extrude({ offset: [0, 0, p.drive_socket_depth] })
  driveShaft = driveShaft.translate([0, 0, p.adapter_length - p.drive_socket_depth])

  // assemble the adapter piece
  let adapter = CAG.circle({
    center: [0, 0],
    radius: p.adapter_radius,
    resolution: p.resolution
  })
  adapter = adapter.extrude({ offset: [0, 0, p.adapter_length] })
  adapter = adapter.subtract(splineShaft)
  adapter = adapter.subtract(driveShaft)
  adapter = adapter.translate([0, 0, -p.spline_depth])

  return adapter
}
