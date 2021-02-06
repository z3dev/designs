function getParameterDefinitions() { 
  return [ 
    { name: 'creatr', type: 'group', initial: 10, caption: 'Printer Top' }, 
    { name: 'plate_width', type: 'int', initial: 120, caption: 'Width (mm)?' }, 
    { name: 'plate_weight', type: 'int', initial: 4, caption: 'Weight (mm)?' }, 
    { name: 'bracket', type: 'group', initial: 10, caption: 'Bracket' }, 
    { name: 'bracket_width', type: 'int', initial: 20, caption: 'Width (mm)?' }, 
    { name: 'hole_offset', type: 'int', initial: 68, caption: 'Bolt Offset (mm)?' }, 
    { name: 'bolt', type: 'group', initial: 10, caption: 'Bolts' }, 
    { name: 'hole_size', type: 'int', initial: 3, caption: 'Shank (mm)?' }, 
    { name: 'nut', type: 'group', initial: 10, caption: 'Nuts' }, 
    { name: 'nut_size', type: 'int', initial: 6, caption: 'Width (mm)?' }, 
    { name: 'nut_weight', type: 'int', initial: 3, caption: 'Weight (mm)?' }, 
    ]; 
} 

// Leapfrog Creatr Top Bracket
// By Z3 Development

function main( p ) {
// tolerence for fitting nuts and clip
    var tolerence = 0.40;
// calculate the dimension of the back
    var b_n_s = 1;
    var b_w_r = p.bracket_width / 2;
    var b_h_r = (p.nut_weight + b_n_s) / 2;
    var b_l_r = (p.plate_width / 2) + (b_h_r * 2) + (tolerence * 2);
// calculate the dimensions of the front
    var f_w_r = b_w_r;
    var f_h_r = (p.plate_weight/2) + (b_h_r * 2) + tolerence;
    var f_l_r = b_h_r;
    var f_t_r = b_h_r * 3;

    var clip = CSG.cube({center: [0,0,0], radius: [b_w_r,b_l_r,b_h_r]});
    var back = CSG.cube({center: [0,0,0], radius: [b_w_r,b_h_r,b_w_r]});
    back = back.translate([0,-(b_l_r)+b_h_r,-b_w_r+b_h_r-1]);
    var front = CSG.cube({center: [0,0,0], radius: [f_w_r,f_l_r,f_h_r]});
    front = front.translate([0,b_l_r-f_l_r,-f_h_r+b_h_r]);
    var tab = CSG.cube({center: [0,0,0], radius: [f_w_r,f_t_r,b_h_r]});
    tab = tab.translate([0,b_l_r-f_t_r,-(f_h_r*2)+b_h_r+b_h_r]);
    clip = clip.union([back,front,tab]);
// remove holes for the bolts and the nuts if necessary
    if (p.hole_offset > 0) {
        var bolt_r = p.hole_size / 2;
        var bolt = CSG.cylinder({start: [0,0,-b_h_r], end: [0,0,b_h_r], radius: bolt_r, resolution: 32});
        var y = p.hole_offset / 2;
        clip = clip.subtract(bolt.translate([0,y,0]));
        clip = clip.subtract(bolt.translate([0,-y,0]));
        var nut_r = (p.nut_size+tolerence) / 2;
        var nut = CSG.cylinder({start: [0,0,-b_h_r], end: [0,0,b_h_r], radius: nut_r, resolution: 6});
        clip = clip.subtract(nut.translate([0,y,-b_n_s]));
        clip = clip.subtract(nut.translate([0,-y,-b_n_s]));
    }
    return clip;
    //var top = CSG.cube({center: [0,0,0], radius: [b_w_r*3,p.plate_width/2,p.plate_weight/2]});
    //top = top.translate([0,0,-(b_h_r*2)]).setColor(0,1,0,1);
    //return clip.union(top);
}
