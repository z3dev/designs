// title      : Door Bolt
// author     : JAG
// license    : MIT License

function getParameterDefinitions() { 
  return [ 
    { name: 'bolt', type: 'group', caption: 'Bolt' }, 
    { name: 'bolt_diameter', type: 'float', initial: 10.0, min: 2.0, max: 50.0, step: 1.0, caption: 'Diameter:' }, 
    { name: 'bolt_travel', type: 'float', initial: 45.0, min: 10.0, max: 100.0, step: 1.0, caption: 'Travel:' }, 
    { name: 'bolt_handle', type: 'float', initial: 30.0, min: 0.0, max: 50.0, step: 1.0, caption: 'Handle:' }, 
    { name: 'bolt_style', type: 'choice', initial: 'left', caption: 'Style:', values: ['left','right','both','none'], captions: ['Left','Right','Both','None'] },
    { name: 'bolt_lead', type: 'float', initial: 30.0, min: 0.0, max: 100.0, step: 1.0, caption: 'Extra Length:' }, 
    { name: 'base', type: 'group', caption: 'Base' }, 
    { name: 'base_weight', type: 'float', initial: 3.0, min: 2.0, max: 10.0, step: 1.0, caption: 'Thickness:' }, 
    { name: 'base_width', type: 'float', initial: 30.0, min: 10.0, max: 100.0, step: 1.0, caption: 'Width:' }, 
    { name: 'screw_size', type: 'float', initial: 3.0, min: 1.0, max: 10.0, step: 0.25, caption: 'Holes:' }, 
    { name: 'flanges', type: 'group', caption: 'Flanges' }, 
    { name: 'bolt_center', type: 'float', initial: 20.0, min: 5.0, max: 75.0, step: 1.0, caption: 'Bolt Center:' }, 
    { name: 'flange_weight', type: 'float', initial: 5.0, min: 2.0, max: 10.0, step: 1.0, caption: 'Thickness:' }, 
    { name: 'others', type: 'group', caption: 'Other' }, 
    { name: 'display', type: 'choice', initial: 'in', caption: 'Display Bolt:', values: ['zero','out','in'], captions: ['Centered','Extended','Retracted'] },
    { name: 'resolution', type: 'int', initial: 18, min: 18, max: 72, step: 6, caption: 'Resolution?' }, 
    ]; 
} 

function scaleBy(obj, byx, byy, byz) {
    byx = byx || 0.0;
    byy = byy || byx;
    byz = byz || byx;
// get the bounds of the given object
    var bounds = obj.getBounds();
    var x = bounds[1]._x - bounds[0]._x;
    var y = bounds[1]._y - bounds[0]._y;
    var z = bounds[1]._z - bounds[0]._z;
// calculate the percentages required
    x = ((x/2)+byx) / (x/2);
    y = ((y/2)+byy) / (y/2);
    z = ((z/2)+byz) / (z/2);
    return obj.scale([x,y,z]);
}

function base(p) {
    var x,y,z,rr;
    x = (p.base_length)/2;
    y = p.base_width/2;
    rr = (p.screw_size*1.5);
    var b = CAG.roundedRectangle({radius: [x,y], roundradius: rr, resolution: 18}); 
// less holes for the bolts
    rr = (p.screw_size/2) + 0.2;
    var h = CAG.circle({radius: rr, resolution: 18});
    x = x-(p.screw_size*1.5);
    y = y-(p.screw_size*1.5);
    b = b.subtract(h.translate([x,y]));
    b = b.subtract(h.translate([-x,y]));
    b = b.subtract(h.translate([-x,-y]));
    b = b.subtract(h.translate([x,-y]));

    z = p.base_weight;
    b = b.extrude({offset: [0,0,z]});

    return b;
}

function flange(p) {
    var x,y,z,rr;
    x = p.flange_weight/2;
    y = p.base_width/2;
    z = p.flange_height/2;
    rr = 0.5;
    var f = CSG.roundedCube( {radius: [x,y,z], roundradius: rr, resolution: 18} );
// less holes for the bolts
    return f;
}

function bolt(p) {
    var x,y,z,r;
    r = p.bolt_diameter/2;
    x = (p.bolt_total_length)/2-r;
// square and round parts of the bolt
    var b = CSG.roundedCylinder({start: [-x,0,0], end: [x,0,0], radius: r, resolution: p.resolution});
    b = b.translate([-(p.bolt_lead/2)-r,0,0]);
    x = p.bolt_square_length/2-(r/2);
    var s = CSG.cube({radius: [x,r,r]});
    b = b.union(s.translate([x,0,0]));
// add the handle
    y = (p.bolt_handle/2);
    var h = CSG.roundedCylinder({start: [0,-y,0], end: [0,y,0], radius: r, resolution: p.resolution});
    if (p.bolt_style == 'right' || p.bolt_style == 'both') {
        b = b.union(h.translate([-r,y,0]));
    }
    if (p.bolt_style == 'left' || p.bolt_style == 'both') {
        b = b.union(h.translate([-r,-y,0]));
    }
    return b;
}

function main(p) {
    var x,y,z;
    var offset = 0.20; // offset around the bolt for movement

    p.flange_gap   = p.bolt_travel+p.bolt_diameter;
    p.flange_height = p.bolt_center+p.bolt_diameter;
    
    p.base_length= (p.screw_size*3)+p.flange_weight+p.bolt_travel+p.bolt_diameter+p.flange_weight+(p.screw_size*3);

// calculated values
    p.bolt_square_length=p.flange_weight+p.flange_gap;
    p.bolt_round_length =p.flange_weight+p.flange_gap+p.bolt_lead;
    p.bolt_total_length =p.bolt_square_length+p.bolt_round_length;

// build the parts
    var db = base(p);
    var f = flange(p);
    var b = bolt(p);
    var n = scaleBy(b, offset).translate([0,0,p.bolt_center]); // negative of the bolt
    b = b.translate([0,0,p.bolt_center]);
// put this together
    x = (p.flange_weight/2)-(p.base_length/2)+(p.screw_size*3);
    y = 0;
    z = p.flange_height/2;
    db = db.union(f.translate([x,y,z]));
    x = x+p.flange_gap+p.flange_weight;
    db = db.union(f.translate([x,y,z]));

    db = db.subtract(n);

    if (p.display == 'out') {
        x = -(p.bolt_travel/2)+(p.bolt_diameter/2);
        b = b.translate([x,0,0]);
    }
    if (p.display == 'in') {
        x = (p.bolt_travel/2)+(p.bolt_diameter/2);
        b = b.translate([x,0,0]);
    }
    db = db.union(b);
    return db;
}
