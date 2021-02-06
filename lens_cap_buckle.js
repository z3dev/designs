// Based on aa by edwardh
// Translated and Optimized to JSCAD by Z3 Development

function capmount( p )
{
// NOTE: All calculations are radius
  var base_radius  = p.lens_radius + p.mount_width;
  var inner_radius = p.lens_radius - p.mount_width;

// generate the base of the mount
  var a1 = CAG.circle({radius: base_radius, resolution: p.resolution});
  if (p.buckle_fill === "hollow") {
  // remove the fill
    var a2 = CAG.circle({radius: inner_radius, resolution: p.resolution});
    a1 = a1.subtract( a2 );
  // generate extra base support
    a2 = CAG.rectangle( {radius: [base_radius-1, p.mount_width/2], center: [0,0]} );
    a2 = a2.rotateZ( -45 );
    a1 = union( a1, a2 );
    a2 = CAG.rectangle( {radius: [base_radius-1, p.mount_width/2], center: [0,0]} );
    a2 = a2.rotateZ( 45 );
    a1 = union( a1, a2 );
  }
  a1 = a1.extrude({offset: [0,0,p.mount_base]});

// generate the mount
  var b1 = CAG.circle( {radius: base_radius, resolution: p.resolution});
  var b2 = CAG.circle( {radius: p.lens_radius, resolution: p.resolution});
  b1 = b1.subtract( b2 );
  b1 = b1.extrude({offset: [0,0,p.mount_base + p.mount_height]});

// add the lips if any to the mount
  var b3 = CAG.circle( {radius: base_radius, resolution: p.resolution} );
  var b4 = CAG.circle( {radius: p.lens_radius - p.mount_lip_width, resolution: p.resolution});
  b3 = b3.subtract( b4 );
  b3 = b3.extrude( {offset: [0,0,p.mount_lip_height]} );

  var xheight = (p.mount_base + p.mount_height);
  for (i = 0; i < p.mount_lip_count; i++) {
    xheight -= p.mount_lip_height;
    b1 = b1.union( b3.translate( [0,0,xheight] ) );
    xheight -= p.mount_lip_spacing;
  }

  return union( a1, b1 );
}

function buckle( p )
{
// NOTE: All calculations are radius
// same as above for the mount
  var base_radius  = p.lens_radius + p.mount_width;

  var radius_inner = base_radius + p.buckle_gap;
  var radius_outer = radius_inner + p.buckle_thickness;

  var square_inner = p.strap_width / 2;
  var square_outer = square_inner + p.buckle_thickness;

// sides of the buckle
  var b3 =          CAG.rectangle( {radius: [radius_outer*2, radius_outer*2], center: [0,0]} );
  b3 = b3.subtract( CAG.rectangle( {radius: [radius_outer*2, square_inner  ], center: [0,0]} ) );
// inner circle - trimmed to inside buckle width
  var b1 = CAG.circle( {radius: radius_inner, center: [0,0], resolution: p.resolution} );
  b1 = b1.subtract( b3 );
// inner - buckle split if necessary
  if ( p.buckle_split > 0 ) {
    b1 = b1.union( CAG.rectangle( {radius: [radius_outer*2, p.buckle_split], center: [0,0]} ) );
  }

// sides of the buckle
  b3 =              CAG.rectangle( {radius: [radius_outer*2, radius_outer*2], center: [0,0]} );
  b3 = b3.subtract( CAG.rectangle( {radius: [radius_outer*2, square_outer  ], center: [0,0]} ) );
// outer circle - trimmed to outside of buckle
  var b2 = CAG.circle( {radius: radius_outer, center: [0,0], resolution: p.resolution} );
  b2 = b2.subtract( b3 );
 
// outer circle - innner circle
  b3 = b2.subtract( b1 );

  return b3.extrude( {offset: [0,0,p.mount_base]} );
}

function main( parameters ) {
  var tolerance = 0.35;         // XY precision of 3D printer

// set additional parameters
  parameters.buckle_thickness  = 6;      // thickness of buckle

  parameters.mount_width       = 4.0;    // width of ring
  parameters.mount_base        = 3.0;    // height of mount base
  parameters.mount_height      = 4.0;    // height of mount

  parameters.mount_lip_width   = 0.2;    // width of lip tip (to help secure cap)
  parameters.mount_lip_height  = 0.2;    // lip tip height (to help secure cap)
  parameters.mount_lip_spacing = 0.4;    // distance between lips
  parameters.mount_lip_count   = 3;      // number of lips to generate

  parameters.lens_radius = (parameters.lens_diameter - tolerance) / 2;

  var v1 = capmount( parameters );
  var v2 = buckle( parameters );
  return v1.union( v2 );
}
