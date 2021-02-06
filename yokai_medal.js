function imprint(p) {
    p.inscription = p.inscription.replace("\\n", "\n");
    var lines = vector_text(0,0,p.inscription);
    var shapes = [];
    lines.forEach(
        function(pl) {shapes.push(rectangular_extrude(pl, {w: 1, h: p.sticker_thickness*2}));}
    );
    var i = union(shapes)
    var xbounds = i.getBounds();
    var xscale = (p.sticker_radius*2-1)/(xbounds[1].x - xbounds[0].x);
    var yscale = (p.sticker_radius*2-1)/(xbounds[1].y - xbounds[0].y);
    //echo("xscale: "+xscale);
    //echo("yscale: "+yscale);
    if (yscale < xscale) xscale = yscale;
    return i.scale([xscale,xscale,1]);
}

function generateTabs(row,p) {
    var value = p.tab_values[row];
    //echo("ROW: "+row+" VALUE: "+typeof(value));
    
    var tab = null;
    var tindex = 0;
    var y = 0;
    var z = 0;
    var tabs = [];
    if (value[3] === '1') {
        tindex = 3;
        tab = CSG.roundedCube({center: [0,0,0], radius: [p.tab_lengths[tindex],p.tab_widths[tindex],p.tab_heights[tindex]], roundradius: p.tab_radius});
        y = p.base_radius-p.tab_rows[row];
        z = p.tab_heights[tindex]+p.base_thickness-p.sticker_thickness-p.tab_radius;
        tabs.push(tab.translate([p.tab_offsets[tindex]+p.tab_lengths[tindex],y,z]));
    }
    if (value[2] === '1') {
        tindex = 2;
        tab = CSG.roundedCube({center: [0,0,0], radius: [p.tab_lengths[tindex],p.tab_widths[tindex],p.tab_heights[tindex]], roundradius: p.tab_radius});
        y = p.base_radius-p.tab_rows[row];
        z = p.tab_heights[tindex]+p.base_thickness-p.sticker_thickness-p.tab_radius;
        tabs.push(tab.translate([p.tab_offsets[tindex]+p.tab_lengths[tindex],y,z]));
    }
    if (value[1] === '1') {
        tindex = 1;
        tab = CSG.roundedCube({center: [0,0,0], radius: [p.tab_lengths[tindex],p.tab_widths[tindex],p.tab_heights[tindex]], roundradius: p.tab_radius});
        y = p.base_radius-p.tab_rows[row];
        z = p.tab_heights[tindex]+p.base_thickness-p.sticker_thickness-p.tab_radius;
        tabs.push(tab.translate([p.tab_offsets[tindex]+p.tab_lengths[tindex],y,z]));
    }
    if (value[0] === '1') {
        tindex = 0;
        tab = CSG.roundedCube({center: [0,0,0], radius: [p.tab_lengths[tindex],p.tab_widths[tindex],p.tab_heights[tindex]], roundradius: p.tab_radius});
        y = p.base_radius-p.tab_rows[row];
        z = p.tab_heights[tindex]+p.base_thickness-p.sticker_thickness-p.tab_radius;
        tabs.push(tab.translate([p.tab_offsets[tindex]+p.tab_lengths[tindex],y,z]));
    }
    return union(tabs);
}

function generateRows(p) {
    // for each of the rows
    // - generate the tabs
    var rows = [];
    var i = 0;
    for (i = 0; i < p.tab_values.length; i++) {
        if (p.tab_values[i].length == 4) {
            rows.push(generateTabs(i,p));
        }
    }
    return union(rows);
}

function inset(p) {
    var a = CAG.circle({center: [0,0], radius: p.base_radius, resolution: p.resolution});
    var b = CAG.rectangle({center: [0,0], radius: [3, p.base_radius+5]});
    var i = b.rotateZ(p.inset_tab_angle);
    i = i.union(b.rotateZ(-p.inset_tab_angle));
    b = CAG.rectangle({center: [0,0], radius: [p.base_radius,p.inset_gap_radius]});
    i = i.subtract(b);
    i = i.intersect(a);
    b = CAG.circle({center: [0,0], radius: p.inset_radius, resolution: p.resolution});
    a = a.subtract(b);
    i = i.union(a);
    b = CAG.circle({center: [0,0], radius: p.base_radius, resolution: p.resolution});
    i = b.subtract(i);
    i = i.extrude({offset: [0,0,p.inset_thickness]});
    return i;
}

function edges2(p) {
    var b = CAG.circle({center: [0,0], radius: p.base_radius, resolution: p.resolution});
    var c = CAG.circle({center: [0,0], radius: p.base_radius-p.edge_thickness, resolution: p.resolution});
    b = b.subtract(c);

    c = CAG.circle({center: [0,0], radius: p.base_radius-p.edge_thickness-p.inner_edge_offset, resolution: p.resolution});
    var d = CAG.circle({center: [0,0], radius: p.base_radius-p.edge_thickness-p.inner_edge_offset-p.edge_thickness, resolution: p.resolution});
    c = c.subtract(d);
    b = b.union(c);

    c = CAG.rectangle({center: [0,0], radius: [p.slot_radius+p.edge_thickness,p.base_radius]});
    d = CAG.circle({center: [0,0], radius: p.base_radius, resolution: p.resolution});
    c = c.intersect(d);
    b = b.union(c);
    d = CAG.rectangle({center: [0,0], radius: [p.slot_radius,p.base_radius]});
    b = b.subtract(d);

    c = CAG.rectangle({center: [0,p.base_radius], radius: [p.edge_thickness/2,p.base_radius]});
    b = b.subtract(c.rotateZ(27));
    b = b.subtract(c.rotateZ(-27));

    b = b.extrude({offset: [0,0,p.edge_thickness]});
    return b.translate([0,0,p.base_thickness]);
}

function edges(p) {
    var b = CAG.circle({center: [p.base_radius-p.edge_thickness,0], radius: p.edge_thickness, resolution: p.edge_resolution});
    var c = rotate_extrude({fn: p.resolution}, b ).translate([0,0,p.base_thickness]);
    b = CAG.circle({center: [p.base_radius-p.edge_thickness-p.inner_edge_offset,0], radius: p.edge_thickness, resolution: p.edge_resolution});
    var d = rotate_extrude({fn: p.resolution}, b ).translate([0,0,p.base_thickness]);
    c = c.union(d);
    var e = CSG.cube({center: [0,0,0], radius: [p.slot_radius,p.base_radius,p.edge_thickness]}).translate([0,0,p.base_thickness]);
    c = c.subtract(e);

    var f = CSG.roundedCylinder({start: [0,-p.base_radius,0], end: [0,p.base_radius,0], radius: p.edge_thickness, resolution: p.edge_resolution});
    var fc = CSG.cube({center: [p.edge_thickness,0,0], radius: [p.edge_thickness,p.base_radius,p.edge_thickness*2]});
    fc = fc.subtract(f);
    fc = fc.translate([-p.slot_radius-p.edge_thickness,0,p.base_thickness]);
    c = c.subtract(fc);
    fc = fc.rotateY(180);
    fc = fc.translate([0,0,p.base_thickness*2]);
    c = c.subtract(fc);

    f = CSG.roundedCylinder({start: [0,-p.base_radius+p.slot_fudge,0], end: [0,p.base_radius-p.slot_fudge,0], radius: p.edge_thickness, resolution: p.edge_resolution});
    g = f.translate([p.slot_radius+p.edge_thickness,0,p.base_thickness]);
    f = f.translate([-p.slot_radius-p.edge_thickness,0,p.base_thickness]);
    return c.union([f,g]);
};

function getParameterDefinitions() { 
  return [ 
    { name: 'front', type: 'group', caption: 'Front' },
    { name: 'style', type: 'choice', initial: 1, caption: 'Face Style?', values: [1,0], captions: ['Normal','Flat'] }, 
    { name: 'back', type: 'group', caption: 'Back' },
    { name: 'row_1', type: 'text', initial: '1011', caption: 'ROW 1?' },
    { name: 'row_2', type: 'text', initial: '0001', caption: 'ROW 2?' },
    { name: 'row_3', type: 'text', initial: '0111', caption: 'ROW 3?' },
    { name: 'row_4', type: 'text', initial: '0101', caption: 'ROW 4?' },
    { name: 'inscription', type: 'text', initial: '', caption: 'Caption (0-20 letters)?' },
    { name: 'imprint', type: 'choice', initial: 0, caption: 'Rendering?', values: [0,1], captions: ['Imprinted','Raised'] }, 
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution:' }, 
    { name: 'color', type: 'choice', initial: '035/141/053/255', caption: 'Color?', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] }, 
   ];
}

function main(p) {
    p.xy_tolerence = 0.320/2;
    p.z_tolerence  = 0.200/2;

    p.medal_diameter = 43;
    p.medal_thickness = 4.0-(p.z_tolerence*2);
    p.medal_slot = 19;

    p.edge_thickness = 1.7;
    p.base_thickness = p.medal_thickness-p.edge_thickness;
    p.base_radius = p.medal_diameter/2;
    p.inner_edge_offset = 4-p.edge_thickness;
    p.slot_radius = p.medal_slot/2+p.xy_tolerence;
    p.slot_fudge = 5.55;
    p.sticker_radius = p.slot_radius-1.5;
    p.sticker_thickness = 0.500;
    p.sticker_offset = 3;

    p.inset_gap_radius = 15;
    p.inset_radius = p.base_radius-2;
    p.inset_thickness = 0.65;
    p.inset_tab_angle = 5;
    
    p.tab_radius  = 0.2;
    p.tab_values  = [p.row_1,p.row_2,p.row_3,p.row_4]; // these come from parameters
    p.tab_lengths = [4.0/2,4.0/2,4.0/2,4.0/2];
    p.tab_widths  = [1.2/2,1.2/2,1.2/2,1.2/2];
    p.tab_heights = [p.edge_thickness/2+p.tab_radius,p.edge_thickness/2+p.tab_radius,p.edge_thickness/2+p.tab_radius,p.edge_thickness/2+p.tab_radius];
    p.tab_offsets = [0.0-p.sticker_radius,4.0-p.sticker_radius,p.sticker_radius-8.0,p.sticker_radius-4.0];
    p.tab_rows    = [3.0,9.0,15.0,21.0];

    //p.resolution = 72; // 180(2) 120(3) 90(4) 72(5) 60(6) 40(9) 36(10) 30(12)
    p.edge_resolution = 16;

// make the top
    var a = CSG.cylinder({start: [0,0,0], end: [0,0,p.base_thickness], radius: p.base_radius, resolution: p.resolution});
// remove small indents for easy removal
    var b = {};
    if (p.style == 0) { // flat
      b = CSG.cube({center: [0,0,0], radius: [3.5,0.5,10]}).translate([0,-p.base_radius+2.0,0]);
      a = a.subtract(b);
    }
    if (p.style == 1 ) { // inset
      b = CSG.cube({center: [0,0,0], radius: [2.5,0.5,0.5]}).translate([0,-p.base_radius+4.7,0]);
      a = a.subtract(b);
      b = CSG.cube({center: [0,0,0], radius: [3.5,0.5,0.5]}).translate([0,-p.base_radius+2.0,0]);
      a = a.subtract(b);
    // and an inset on the top
      b = inset(p);
      a = a.subtract(b);
    }

// remove a small slice for the sticker and the tabs
    b = CSG.cube({center: [0,0,0], radius: [p.sticker_radius,p.base_radius,p.sticker_thickness]}).translate([0,p.sticker_offset,p.base_thickness]);
    a = a.subtract(b);

// add text for the sticker if available
    if (p.inscription.length > 0 && p.inscription.length < 20) {
      if (p.imprint == 0) {
        a = a.subtract(imprint(p).translate([-p.sticker_radius,-p.base_radius+(p.sticker_radius*2),p.base_thickness-(p.sticker_thickness*2)]));
      } else {
        a = a.union(imprint(p).translate([-p.sticker_radius,-p.base_radius+(p.sticker_radius*2),p.base_thickness-(p.sticker_thickness*2)]));
      }
    }

// add edges around the bottom
    var e = edges2(p);

// add four rows of tabs
    var r = generateRows(p);

    a = a.union([e,r]);

    return a;
}


