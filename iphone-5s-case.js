function getParameterDefinitions() { 
  return [ 
    {name: 'iphone', type: 'group', caption: 'iPhone 5S' },
    {name: 'color', type: 'choice', initial: '042/041/038/255', caption: 'Color?', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] },
    {name: 'rendering', type: 'group', caption: 'Render' }, 
    {name: 'showscreen', type: 'checkbox', checked: true, caption: 'Touch Screen?' },
    {name: 'showhome', type: 'checkbox', checked: true, caption: 'Home Buttom?' },
    {name: 'showfrontcam', type: 'checkbox', checked: true, caption: 'Front Camera?' },
    {name: 'showfrontspk', type: 'checkbox', checked: true, caption: 'Front Speaker?' },
    {name: 'showringsilent', type: 'checkbox', checked: true, caption: 'Ring/Silent Switch?' },
    {name: 'showvolume', type: 'checkbox', checked: true, caption: 'Volume Switches?' },
    {name: 'showpower', type: 'checkbox', checked: true, caption: 'Power Switch?' },
    {name: 'showsim', type: 'checkbox', checked: true, caption: 'Sim Slot?' },
    {name: 'showheadphone', type: 'checkbox', checked: true, caption: 'Headphone?' },
    {name: 'showlight', type: 'checkbox', checked: true, caption: 'Power Port?' },
    {name: 'showmic', type: 'checkbox', checked: true, caption: 'Bottom Microphones?' },
    {name: 'showspeaker', type: 'checkbox', checked: true, caption: 'Bottom Speaker?' },
    {name: 'showcamera', type: 'checkbox', checked: true, caption: 'Back Camera?' },
    {name: 'showflash', type: 'checkbox', checked: true, caption: 'Back Flash?' },
    {name: 'others', type: 'group', caption: 'Other' },
    {name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?', min: 18, max: 144, step: 18 }, 
    ]; 
} 


function toPolygon(cag) {
    var points = cag.getOutlinePaths()[0].points;
    return CSG.Polygon.createFromPoints(points);
}

// the path must be centered at 0,0, and project into Y
// the number of slices is determined by the number of path segements
// each point in the path provides
// - the amount (X) to expand the original cag radius
// - the slice thickness (Y) to extrude
function extrudeFromPath(cag,path) {
    var b = cag.getBounds();
    var w = b[1].x - b[0].x;
    var h = b[1].y - b[0].y;

    var slice = toPolygon(cag);
    slice.path = path;
    slice.original_x = w;
    slice.original_y = h;

    return slice.solidFromSlices({
            numslices: slice.path.points.length,
            callback: function(t, sliceno) {
                //OpenJsCad.log("t=["+t+"]");
                //OpenJsCad.log("sliceno=["+sliceno+"]");
                var z = this.Z_step * (sliceno+1);
                var v = this.path.points[sliceno];
                //OpenJsCad.log("point=["+v._x+","+v._y+"]");
                var sx = (this.original_x + (v._x*2)) / this.original_x;
                var sy = (this.original_y + (v._x*2)) / this.original_y;
                //OpenJsCad.log("s=["+sx+":"+sy+"]");
                return this.scale([sx,sy]).translate([0,0,v._y]); //.setColor(hsl2rgb(t,1,0.5));
            }
        }
    );
}

function iphone5(p) {
    var iphone = {};
    iphone.w = 58.6;
    iphone.h = 123.8;
    iphone.d = 7.6;
    iphone.bb = 0.5; // bottom bevel around phone
    iphone.tb = 1.0; // top bevel around phone
    iphone.rw = iphone.w / 2;
    iphone.rh = iphone.h / 2;
    iphone.rd = iphone.d / 2;
    iphone.rr = 9.0; // radius of corners
    
//    iphone.rw2 = iphone.rw - iphone.e;
//    iphone.rh2 = iphone.rh - iphone.e;
    iphone.rd2 = iphone.d / 2;
//    iphone.rr2 = iphone.rr - iphone.e;
// back sensor and back camera
    iphone.bs_rr   = 3.0 / 2;
    iphone.bs_xoff = iphone.rw - 18.5;
    iphone.bs_yoff = -8.5;
    iphone.bc_rr   = 7.0 / 2;
    iphone.bc_xoff = iphone.bs_xoff + 10.0;
    iphone.bc_yoff = iphone.bs_yoff;
// front home button
    iphone.hb_rr   = 11.0 / 2;
    iphone.hb_xoff = 0.0;
    iphone.hb_yoff = 9.0; // from bottom
// front display
    iphone.ds_rw = 50.0 / 2;
    iphone.ds_rh = 89.0 / 2;
    iphone.ds_rr = 1.0;
    iphone.ds_xoff = 0.0;
    iphone.ds_yoff = -17.0; // from top edge
// front sensor
    iphone.fs_rr = 2.2 / 2;
    iphone.fs_xoff = 0.0; // from center
    iphone.fs_yoff = -6.0; // from top
// front mic
    iphone.fm_rw = 10.5 / 2;
    iphone.fm_rh = 2.0 / 2;
    iphone.fm_rr = 0.7;
    iphone.fm_xoff = 0.0;
    iphone.fm_yoff = -11.0;
// power button
    iphone.pb_rw = 10.0 / 2;
    iphone.pb_rh = 2.0 / 2;
    iphone.pb_rd = 0.5;
    iphone.pb_xoff = (iphone.rw - 14.0); // from center
    iphone.pb_yoff =  0.0; // from center
// earphone jack
    iphone.ej_rr = 4.5 / 2;
    iphone.ej_xoff = (-iphone.rw + 10.0);
    iphone.ej_yoff =   0.0;
// power jack
    iphone.pj_rw = 9.0 / 2;
    iphone.pj_rh =  3.0 / 2;
    iphone.pj_rr =  1.2;
    iphone.pj_xoff = 0.0;
    iphone.pj_yoff = 0.0;
// bottom speaker(s)
    iphone.sp_rw = 6.5 / 2;
    iphone.sp_rh = 2.0 / 2;
    iphone.sp_xoff = iphone.pj_rw + 4.50 + iphone.sp_rw; // from center
    iphone.sp_yoff = 0.0;
    iphone.sp_rr = 0.7 / 2;
    iphone.sp_lb_rows = 2;
    iphone.sp_lb_columns = 5;
    iphone.sp_lb_rowoff = 1.5;
    iphone.sp_lb_coloff = 6 / (iphone.sp_lb_columns - 1);
    iphone.sp_lb_xoff = -iphone.rw + 17.0;
    iphone.sp_rb_rows = 2;
    iphone.sp_rb_columns = 8;
    iphone.sp_rb_rowoff = 1.5;
    iphone.sp_rb_coloff = 11 / (iphone.sp_rb_columns - 1);
    iphone.sp_rb_xoff = iphone.rw - 15.0;
// silence switch
    iphone.ss_rw = 6.0 / 2;
    iphone.ss_rh = 2.5 / 2;
    iphone.ss_rd = 0.5;
    iphone.ss_xoff = iphone.rh - 20.0;
    iphone.ss_yoff = 0.0;
// volume buttons
    iphone.vb_rr = 4.5 / 2;
    iphone.vb_rd = 0.5 / 2;
    iphone.vb_xoff1 = iphone.ss_xoff - 11.0;
    iphone.vb_xoff2 = iphone.vb_xoff1 - 10.0;
    iphone.vb_yoff = 0.0;
// sim slot
    iphone.sm_rw = 16.0 / 2;
    iphone.sm_rh = 2.0 / 2;
    iphone.sm_xoff = iphone.rh - 60.0;  // from top
    iphone.sm_yoff = 0.0;
    
    p.iphone = iphone;
}

function body(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.rw;
    ry = p.iphone.rh;
    rz = p.iphone.rd;
    rr = p.iphone.rr;
    var b = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    b = b.extrude({offset: [0,0,rz*2]});
    b = b.translate([0,0,-rz]);
    
    rx = p.iphone.rw2;
    ry = p.iphone.rh2;
    rz = p.iphone.rd2;
    rr = p.iphone.rr2;
    var b1 = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    b1 = b1.extrude({offset: [0,0,rz*2]});
    b1 = b1.translate([0,0,-rz]);

    b = b.union(b1);
    return b;
}

function makeBody(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.rw;
    ry = p.iphone.rh;
    rz = p.iphone.rd;
    rr = p.iphone.rr;
    var outline = CAG.roundedRectangle({center: [0,0], radius: [rx,ry], roundradius: rr, resolution: p.resolution});
    //return outline;
    var b = CSG.Path2D.arc({
            center: [-rr,0],
            radius: rr,
            startangle: 0,
            endangle: 90,
            resolution: p.resolution,
        });
    let p1 = [0,0];
    let p2 = [p.iphone.bb, p.iphone.bb];
    let p3 = [p.iphone.bb, p.iphone.d - p.iphone.tb];
    let p4 = [p.iphone.bb - p.iphone.tb, p.iphone.d];
    b = new CSG.Path2D([p1, p2, p3, p4]);
    //return b.close().innerToCAG(); // for debugging
    let b3 = extrudeFromPath(outline, b);
    return b3.translate([0, 0, -p.iphone.rd]);
}

function back_camera(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone.bc_rr;
    var bc = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone.bc_xoff;
    y = p.iphone.rh + p.iphone.bc_yoff;
    z = -p.iphone.rd + z;
    bc = bc.translate([x,y,z]);

    z = 1.0;
    rr = p.iphone.bs_rr;
    var bs = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone.bs_xoff;
    y = p.iphone.rh + p.iphone.bs_yoff;
    z = -p.iphone.rd + z;
    bs = bs.translate([x,y,z]);

    bc = bc.union(bs);
    return bc;
}

function makeHomeButton(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone.hb_rr;
    var hb = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone.hb_xoff;
    y = (-p.iphone.rh) + p.iphone.hb_yoff;
    z = p.iphone.rd - z;
    hb = hb.translate([x,y,z]);
    return hb;
}

function makeDisplay(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rr = 0.5 / 2;
    rx = p.iphone.ds_rw;
    ry = p.iphone.ds_rh;
    var ds = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    ds = ds.extrude({offset: [0,0,z]});
    x = p.iphone.ds_xoff;
    y = p.iphone.rh - p.iphone.ds_rh + p.iphone.ds_yoff;
    z = p.iphone.rd - z;
    ds = ds.translate([x,y,z]);
    return ds;
}

function makeFrontSensor(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone.fs_rr;
    var fs = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    x = p.iphone.fs_xoff;
    y = p.iphone.rh + p.iphone.fs_yoff;
    z = p.iphone.rd2 - z;
    fs = fs.translate([x,y,z]);
    return fs;
}

function makeFrontMic(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rr = p.iphone.fm_rr;
    rx = p.iphone.fm_rw;
    ry = p.iphone.fm_rh;
    var fm = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    fm = fm.extrude({offset: [0,0,z]});
    x = p.iphone.fm_xoff;
    y = p.iphone.rh + p.iphone.fm_yoff;
    z = p.iphone.rd2 - z;
    fm = fm.translate([x,y,z]);
    return fm;
}

function power_button(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.pb_rw;
    ry = p.iphone.pb_rh;
    rr = ry * 0.90;
    var pb = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = p.iphone.pb_rd * 2;
    pb = pb.extrude({offset: [0,0,z]}).rotateX(90); // flip to side
    x = p.iphone.pb_xoff;
    y = p.iphone.rh + z;
    z = p.iphone.pb_yoff;
    pb = pb.translate([x,y,z]);
    return pb;
}

function earphone_jack(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    z = 1.0;
    rr = p.iphone.ej_rr;
    var ej = CSG.cylinder({start: [0,0,-z], end: [0,0,z], radius: rr, resolution: p.resolution});
    ej = ej.rotateX(90); // flip to side
    x = p.iphone.ej_xoff;
    y = (-p.iphone.rh + z/2);
    z = p.iphone.ej_yoff;
    ej = ej.translate([x,y,z]);
    return ej;
}

function makePowerJack(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.pj_rw;
    ry = p.iphone.pj_rh;
    rr = p.iphone.pj_rr;
    var pj = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    pj = pj.extrude({offset: [0,0,z]}).rotateX(-90); // flip to side
    x = p.iphone.pj_xoff;
    y = (-p.iphone.rh - z/2);
    z = p.iphone.pj_yoff;
    pj = pj.translate([x,y,z]);
    return pj;
}

function makeSpeakers(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.sp_rw;
    ry = p.iphone.sp_rh;
    rr = ry * 0.90;
    var sp = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    sp = sp.extrude({offset: [0,0,z]}).rotateX(-90); // flip to side
    x = p.iphone.sp_xoff;
    y = (-p.iphone.rh - z/2);
    z = p.iphone.sp_yoff;
    var sp1 = sp.translate([x,y,z]);
    x = -p.iphone.sp_xoff;
    sp = sp.translate([x,y,z]);
    sp = sp.union(sp1);
    return sp;
}

function silence_switch(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.ss_rw;
    ry = p.iphone.ss_rh;
    rr = 0.5;
    var ss = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = p.iphone.ss_rd * 2;
    ss = ss.extrude({offset: [0,0,z]}).rotateZ(-90).rotateY(-90); // flip to side
    x = (-p.iphone.rw);
    y = p.iphone.ss_xoff;
    z = p.iphone.ss_yoff;
    ss = ss.translate([x,y,z]);
    return ss;
}

function volume_buttons(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rr = p.iphone.vb_rr;
    z = p.iphone.vb_rd * 2;
    var vb = CSG.cylinder({start: [0,0,0], end: [0,0,z], radius: rr, resolution: p.resolution});
    vb = vb.rotateY(-90); // flip to side
    x = (-p.iphone.rw - z);
    y = p.iphone.vb_xoff1;
    z = p.iphone.vb_yoff;
    var vb1 = vb.translate([x,y,z]);
    y = p.iphone.vb_xoff2;
    vb = vb.translate([x,y,z]);
    vb = vb.union(vb1);
    return vb;
}

function makeSimSlot(p) {
    var x,y,z;
    var rx,ry,rz,rr;
    rx = p.iphone.sm_rw;
    ry = p.iphone.sm_rh;
    rr = ry * 0.90;
    var sm = CAG.roundedRectangle({center:[0,0],radius:[rx,ry],roundradius:rr,resolution:p.resolution});
    z = 1.0;
    sm = sm.extrude({offset: [0,0,z]}).rotateZ(-90).rotateY(90); // flip to side
    x = p.iphone.rw - z/2;
    y = p.iphone.sm_xoff;
    z = p.iphone.sm_yoff;
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
    iphone5(p);
    var b = makeBody(p);
// back
    var bc = back_camera(p).setColor(p.silver);
    b = b.subtract(bc).union(bc);
// front
    var hb = makeHomeButton(p).setColor(1.0,1.0,1.0);
    b = b.subtract(hb).union(hb);
    var ds = makeDisplay(p).setColor(p.blue);
    b = b.subtract(ds).union(ds);
    var fs = makeFrontSensor(p).setColor(p.silver);
    b = b.subtract(fs).union(fs);
    var fm = makeFrontMic(p).setColor(p.silver);
    b = b.subtract(fm).union(fm);
// top edge
    var pb = power_button(p).setColor(p.silver);
    b = b.union(pb);
// bottom edge
    var pj = makePowerJack(p).setColor(0,0,0);
    b = b.subtract(pj).union(pj);
    var sp = makeSpeakers(p).setColor(0,0,0);
    b = b.subtract(sp).union(sp);
    var ej = earphone_jack(p).setColor(0,0,0);
    b = b.subtract(ej).union(ej);
// left edge
    var ss = silence_switch(p).setColor(p.silver);
    b = b.union(ss);
    var vb = volume_buttons(p).setColor(p.silver);
    b = b.union(vb);
// right edge
    var sm = makeSimSlot(p).setColor(p.silver);
    b = b.subtract(sm).union(sm);
    
    return b;
}
