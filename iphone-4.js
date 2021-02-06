function getParameterDefinitions() { 
  return [ 
    { name: 'iphone', type: 'group', caption: 'iPhone 4' },
    { name: 'color', type: 'choice', initial: '042/041/038/255', caption: 'Color?', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] },
    { name: 'others', type: 'group', caption: 'Other' },
    { name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?', min: 18, max: 144, step: 18 }, 
    ]; 
} 
 
function iphone4(p) {
    var iphone = {};
    iphone.w = 58.6;
    iphone.h = 115.2;
    iphone.d = 9.3;
    iphone.e = 0.7; // edge around phone
    iphone.rw = iphone.w / 2;
    iphone.rh = iphone.h / 2;
    iphone.rd = 6.5 / 2;
    iphone.rr = 7.75; // radius of corners
    
    iphone.rw2 = iphone.rw - iphone.e;
    iphone.rh2 = iphone.rh - iphone.e;
    iphone.rd2 = iphone.d / 2;
    iphone.rr2 = iphone.rr - iphone.e;
// back sensor and back camera
    iphone.bs_rr   = 2.5 / 2;
    iphone.bs_xoff = 14.0;
    iphone.bs_yoff = -8.5;
    iphone.bc_rr   = 7.0 / 2;
    iphone.bc_xoff = iphone.bs_xoff + 6.5;
    iphone.bc_yoff = iphone.bs_yoff;
// front home button
    iphone.hb_rr   = 11.0 / 2;
    iphone.hb_xoff = 0.0;
    iphone.hb_yoff = 10.0; // from bottom
// front display
    iphone.ds_rw = 51.5 / 2;
    iphone.ds_rh = 76.0 / 2;
    iphone.ds_rr = 1.0;
    iphone.ds_xoff = 0.0;
    iphone.ds_yoff = -19.0; // from top edge
// front sensor
    iphone.fs_rr = 3.0 / 2;
    iphone.fs_xoff = -10.0; // from center
    iphone.fs_yoff = -10.5; // from top
// front mic
    iphone.fm_rw = 10.0 / 2;
    iphone.fm_rh = 1.7 / 2;
    iphone.fm_xoff = 0.0;
    iphone.fm_yoff = -10.5;
// power button
    iphone.pb_rw = 10.0 / 2;
    iphone.pb_rh = 3.0 / 2;
    iphone.pb_rd = 0.5;
    iphone.pb_xoff = 15.0; // from center
    iphone.pb_yoff =  0.0; // from center
// earphone jack
    iphone.ej_rr = 4.7 / 2;
    iphone.ej_xoff = -17.25;
    iphone.ej_yoff =   0.0;
// power jack
    iphone.pj_rw = 22.0 / 2;
    iphone.pj_rh =  2.8 / 2;
    iphone.pj_xoff = 0.0;
    iphone.pj_yoff = 0.0;
// bottom speaker(s)
    iphone.sp_rw = 6.5 / 2;
    iphone.sp_rh = 2.0 / 2;
    iphone.sp_xoff = iphone.pj_rw + 4.50 + iphone.sp_rw; // from center
    iphone.sp_yoff = 0.0;
// silence switch
    iphone.ss_rw = 5.0 / 2;
    iphone.ss_rh = 2.5 / 2;
    iphone.ss_rd = 0.5 / 2;
    iphone.ss_xoff = iphone.rh - 13.0;
    iphone.ss_yoff = 0.0;
// volume buttons
    iphone.vb_rr = 4.5 / 2;
    iphone.vb_rd = 0.5 / 2;
    iphone.vb_xoff1 = iphone.ss_xoff - 11.5;
    iphone.vb_xoff2 = iphone.vb_xoff1 - 10.5;
    iphone.vb_yoff = 0.0;
// sim slot
    iphone.sm_rw = 18.0 / 2;
    iphone.sm_rh = 2.0 / 2;
    iphone.sm_xoff = iphone.rh - 61.0;
    iphone.sm_yoff = 0.0;
    
    p.iphone4 = iphone;
}

function body(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone4.rw;
    ry = p.iphone4.rh;
    rz = p.iphone4.rd;
    rr = p.iphone4.rr;
    var b = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    b = b.extrude({offset: [0,0,rz*2]});
    b = b.translate([0,0,-rz]).setColor(p.steel);
    
    rx = p.iphone4.rw2;
    ry = p.iphone4.rh2;
    rz = p.iphone4.rd2;
    rr = p.iphone4.rr2;
    var b1 = CSG.cube({center:[0,0,0],radius:[rx,ry,rz]});
    b1 = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    b1 = b1.extrude({offset: [0,0,rz*2]});
    b1 = b1.translate([0,0,-rz]);

    b = b.union(b1);
    return b;
}

function back_camera(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone4.bc_rr;
    var bc = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone4.bc_xoff;
    y = p.iphone4.rh + p.iphone4.bc_yoff;
    z = -p.iphone4.rd2 + z;
    bc = bc.translate([x,y,z]);

    z = 1.0;
    rr = p.iphone4.bs_rr;
    var bs = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone4.bs_xoff;
    y = p.iphone4.rh + p.iphone4.bs_yoff;
    z = -p.iphone4.rd2 + z;
    bs = bs.translate([x,y,z]);

    bc = bc.union(bs);
    return bc;
}
function home_button(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone4.hb_rr;
    var hb = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone4.hb_xoff;
    y = (-p.iphone4.rh) + p.iphone4.hb_yoff;
    z = p.iphone4.rd2 - z;
    hb = hb.translate([x,y,z]);
    return hb;
}
function display(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rr = 0.5 / 2;
    rx = p.iphone4.ds_rw;
    ry = p.iphone4.ds_rh;
    var ds = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    ds = ds.extrude({offset: [0,0,z]});
    x = p.iphone4.ds_xoff;
    y = p.iphone4.rh - p.iphone4.ds_rh + p.iphone4.ds_yoff;
    z = p.iphone4.rd2 - z;
    ds = ds.translate([x,y,z]);
    return ds;
}
function front_sensor(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone4.fs_rr;
    var fs = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone4.fs_xoff;
    y = p.iphone4.rh + p.iphone4.fs_yoff;
    z = p.iphone4.rd2 - z;
    fs = fs.translate([x,y,z]);
    return fs;
}
function front_mic(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rr = 0.5 / 2;
    rx = p.iphone4.fm_rw;
    ry = p.iphone4.fm_rh;
    var fm = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    fm = fm.extrude({offset: [0,0,z]});
    x = p.iphone4.fm_xoff;
    y = p.iphone4.rh + p.iphone4.fm_yoff;
    z = p.iphone4.rd2 - z;
    fm = fm.translate([x,y,z]);
    return fm;
}
function power_button(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone4.pb_rw;
    ry = p.iphone4.pb_rh;
    rr = ry * 0.90;
    var pb = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = p.iphone4.pb_rd * 2;
    pb = pb.extrude({offset: [0,0,z]}).rotateX(90); // flip to side
    x = p.iphone4.pb_xoff;
    y = p.iphone4.rh + z;
    z = p.iphone4.pb_yoff;
    pb = pb.translate([x,y,z]);
    return pb;
}
function earphone_jack(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone4.ej_rr;
    var ej = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    ej = ej.rotateX(90); // flip to side
    x = p.iphone4.ej_xoff;
    y = p.iphone4.rh - z;
    z = p.iphone4.ej_yoff;
    ej = ej.translate([x,y,z]);
    return ej;
}
function power_jack(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone4.pj_rw;
    ry = p.iphone4.pj_rh;
    rr = 0.5;
    var pj = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    pj = pj.extrude({offset: [0,0,z]}).rotateX(-90); // flip to side
    x = p.iphone4.pj_xoff;
    y = (-p.iphone4.rh);
    z = p.iphone4.pj_yoff;
    pj = pj.translate([x,y,z]);
    return pj;
}
function speakers(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone4.sp_rw;
    ry = p.iphone4.sp_rh;
    rr = ry * 0.90;
    var sp = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    sp = sp.extrude({offset: [0,0,z]}).rotateX(-90); // flip to side
    x = p.iphone4.sp_xoff;
    y = (-p.iphone4.rh);
    z = p.iphone4.sp_yoff;
    var sp1 = sp.translate([x,y,z]);
    x = -p.iphone4.sp_xoff;
    sp = sp.translate([x,y,z]);
    sp = sp.union(sp1);
    return sp;
}
function silence_switch(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone4.ss_rw;
    ry = p.iphone4.ss_rh;
    rr = 0.5;
    var ss = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = p.iphone4.ss_rd * 2;
    ss = ss.extrude({offset: [0,0,z]}).rotateZ(-90).rotateY(-90); // flip to side
    x = (-p.iphone4.rw);
    y = p.iphone4.ss_xoff;
    z = p.iphone4.ss_yoff;
    ss = ss.translate([x,y,z]);
    return ss;
}
function volume_buttons(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rr = p.iphone4.vb_rr;
    z = p.iphone4.vb_rd * 2;
    var vb = CSG.cylinder({start: [0,0,0], end: [0,0,z], radius: rr, resolution: p.resolution});
    vb = vb.rotateY(-90); // flip to side
    x = (-p.iphone4.rw);
    y = p.iphone4.vb_xoff1;
    z = p.iphone4.vb_yoff;
    var vb1 = vb.translate([x,y,z]);
    y = p.iphone4.vb_xoff2;
    vb = vb.translate([x,y,z]);
    vb = vb.union(vb1);
    return vb;
}
function sim_slot(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone4.sm_rw;
    ry = p.iphone4.sm_rh;
    rr = ry * 0.90;
    var sm = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    sm = sm.extrude({offset: [0,0,z]}).rotateZ(-90).rotateY(90); // flip to side
    x = (p.iphone4.rw) - z;
    y = p.iphone4.sm_xoff;
    z = p.iphone4.sm_yoff;
    sm = sm.translate([x,y,z]);
    return sm;
}

function main(p) {
    //var p = {};
    //p.resolution = 16;
    p.steel  = [0.9777,0.9777,0.9777];
    p.silver = [0.7529,0.7529,0.7529];
    p.blue   = [0.3921,0.5843,0.9294];
// main body
    iphone4(p);
    var b = body(p);
// back
    var bc = back_camera(p).setColor(p.silver);
    b = b.subtract(bc).union(bc);
// front
    var hb = home_button(p).setColor(1.0,1.0,1.0);
    b = b.subtract(hb).union(hb);
    var ds = display(p).setColor(p.blue);
    b = b.subtract(ds).union(ds);
    var fs = front_sensor(p).setColor(p.silver);
    b = b.subtract(fs).union(fs);
    var fm = front_mic(p).setColor(p.silver);
    b = b.subtract(fm).union(fm);
// top edge
    var pb = power_button(p).setColor(p.silver);
    b = b.union(pb);
    var ej = earphone_jack(p).setColor(0,0,0);
    b = b.subtract(ej).union(ej);
// bottom edge
    var pj = power_jack(p).setColor(0,0,0);
    b = b.subtract(pj).union(pj);
    var sp = speakers(p).setColor(0,0,0);
    b = b.subtract(sp).union(sp);
// left edge
    var ss = silence_switch(p).setColor(p.silver);
    b = b.union(ss);
    var vb = volume_buttons(p).setColor(p.silver);
    b = b.union(vb);
// right edge
    var sm = sim_slot(p).setColor(p.silver);
    b = b.subtract(sm).union(sm);
    
    return b;
}
