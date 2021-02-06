function bolt_hole(p) {
    var r1 = p.b_s_radius + p.tolerence;
    var r2 = p.b_h_radius + p.tolerence;
    var s = CSG.cylinder( {start: [0, 0, 0], end: [0, 0, p.m_base],
      radius: r1,
      resolution: p.resolution
      } );
    var x = p.m_base - p.b_h_height - (2*p.tolerence);
    var h = CSG.cylinder( {start: [0, 0, x], end: [0, 0, p.m_base],
      radiusStart: r1 + p.tolerence,
      radiusEnd: r2 + p.tolerence,
      resolution: p.resolution
      } );
    return s.union(h);
}

function half_of_top(p) {
    var t = CSG.cylinder( {start: [0, 0, 0], end: [0, 0, p.m_height],
      radiusStart: p.m_o_radius,
      radiusEnd: p.m_i_radius,
      resolution: p.resolution
      } );
    var c = CSG.cube({center: [0, p.m_o_radius - p.tolerence, 0], radius: [p.m_o_radius, p.m_o_radius, p.m_height]} );
    t = t.subtract(c);
    return t;
}

function top_half(p) {
    var t = half_of_top(p);
// add the flange
    var w = p.f_weight;
    var z1 = (p.m_height - w) / 2;
    var z2 = z1 + w;
    var f = CSG.cylinder( {start: [0, 0, z1], end: [0, 0, z2],
      radius: p.f_radius,
      resolution: p.resolution
      } );
    t = t.union(f);
// make a hole for the curtain rod
    var h = CSG.cylinder( {start: [0, 0, 0], end: [0, 0, p.m_height],
      radius: p.r_radius + p.tolerence,
      resolution: p.resolution
      } );
    t = t.subtract(h);
// remove a slice off the bottom
    var c = CSG.cube({center: [0, 0, 0], radius: [p.m_o_radius, p.m_o_radius, p.tolerence]} );
    return t.subtract(c).rotateZ(180);
}

function bottom_half(p) {
    var t = half_of_top(p);
// make a hole for the flange
    var w = p.f_weight + (2*p.tolerence);
    var z1 = (p.m_height - w) / 2;
    var z2 = z1 + w;
    var f = CSG.cylinder( {start: [0, 0, z1], end: [0, 0, z2],
      radius: p.f_radius + p.tolerence,
      resolution: p.resolution
      } );
    t = t.subtract(f);
// make a hole for the curtain rod
    var h = CSG.cylinder( {start: [0, 0, 0], end: [0, 0, p.m_height],
      radius: p.r_radius + p.tolerence,
      resolution: p.resolution
      } );
    return t.subtract(h);
}

function base(p) {
    var a = CSG.cylinder( {start: [0, 0, -p.m_base], end: [0, 0, 0],
      radius: p.m_o_radius,
      resolution: p.resolution
      } );
// add holes for screws
    var x = p.m_o_radius / 2;
    var y = p.b_h_radius + 1;
    var b = bolt_hole(p).translate([x,y,-p.m_base]);
    a = a.subtract(b);
    b = bolt_hole(p).translate([-x,y,-p.m_base]);
    a = a.subtract(b);
// add holes for the drywall bolts if necessary
    if (p.dwb_height > 0) {
      b = CSG.cylinder( {start: [0, 0, 0], end: [0, 0, p.dwb_height],
              radius: p.dwb_radius + p.tolerence,
              resolution: p.resolution
          } );
      b = b.translate([x,y,-p.m_base]);
      a = a.subtract(b);
      b = CSG.cylinder( {start: [0, 0, 0], end: [0, 0, p.dwb_height],
              radius: p.dwb_radius + p.tolerence,
              resolution: p.resolution
          } );
      b = b.translate([-x,y,-p.m_base]);
      a = a.subtract(b);
    }
    return a;
}

function main(p){
    p.tolerence = 0.35 / 2; // radius of 3D printer nozzle
    p.resolution = 36;    // circle resolution
    //p.explode = 1;
    
    p.r_radius = p.r_diameter / 2; // radius of curtain rod
    
    //p.m_height = 10; // height of mount (mm)
    //p.m_base = 4; // height of base of mount (mm)
    //p.m_ring = 3; // thickness of ring around the rod (mm)
    p.m_corners = 4;
    p.m_o_radius = p.m_diameter / 2; // outer radius of mount
    p.m_i_radius = p.r_radius + p.m_ring; // inner radius of mount
    
    p.f_radius = p.m_i_radius + (p.m_ring*0.5) + ((p.m_o_radius-p.m_i_radius)*0.10);
    p.f_weight = p.m_height / 4;
    
    p.b_s_radius = p.b_s_diameter / 2; // radius of bolt shanks
    p.b_h_radius = p.b_h_diameter / 2; // radius of bolt heads
    //p.b_h_height = 1.8; // height of bolt heads

    p.dwb_radius = p.dwb_diameter / 2;
    // p.dwb_height = 1;
    
    var b = base(p).union( bottom_half(p) );
    var t = top_half(p);
    if (p.explode > 0) {
    // explode and translate for printing
      t = t.translate([0,p.m_o_radius*2,-p.tolerence]);
      b = b.translate([0,0,p.m_base]);
    }
    return b.union(t);
}


