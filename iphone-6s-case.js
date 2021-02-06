function getParameterDefinitions() { 
  return [ 
    { name: 'case', type: 'group', caption: 'Case' },
    { name: 'w_thickness', type: 'float', initial: 1.5, caption: 'Thickness (mm)?', step: 0.1, min: 1.0, max: 10.0 },
    { name: 'offset', type: 'float', initial: 0.30, caption: 'Fit (mm)?', step: 0.1, min: 0.1, max: 2.0 },
    { name: 'style', type: 'choice', initial: 'clip', caption: 'Style?', values: ['clip','exposed','ends','full'], captions: ['Clip On','Exposed Sides','Exposed Ends','Full Armor'] },
    { name: 'access', type: 'group', caption: 'iPhone Access' },
    { name: 'showscreen', type: 'checkbox', checked: false, caption: 'Touch Screen?' },
    { name: 'showringsilent', type: 'checkbox', checked: true, caption: 'Ring/Silent Switch?' },
    { name: 'showvolume', type: 'checkbox', checked: true, caption: 'Volume Switches?' },
    { name: 'showpower', type: 'checkbox', checked: true, caption: 'Power Switch?' },
    { name: 'showsim', type: 'checkbox', checked: false, caption: 'Sim Slot?' },
    { name: 'showheadphone', type: 'checkbox', checked: false, caption: 'Headphone?' },
    { name: 'showlight', type: 'checkbox', checked: true, caption: 'Power Port?' },
    { name: 'showmic', type: 'checkbox', checked: true, caption: 'Bottom Microphones?' },
    { name: 'showspeaker', type: 'checkbox', checked: true, caption: 'Bottom Speaker?' },
    { name: 'showcameraport', type: 'checkbox', checked: true, caption: 'Back Camera Port?' },
    { name: 'showcamera', type: 'checkbox', checked: true, caption: 'Back Camera?' },
    { name: 'showflash', type: 'checkbox', checked: true, caption: 'Back Flash?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'color', type: 'choice', initial: '253/102/054/255', caption: 'Color?', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] },
    { name: 'resolution', type: 'int', initial: 18, caption: 'Resolution?' }, 
    ]; 
} 

function use(url) {
    var xmlhttp = new XMLHttpRequest();
    var obj = null;
    xmlhttp.onreadystatechange = function(e) {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                obj = JSON.parse(xmlhttp.responseText);
            }
        }
    };

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    if (obj === null) {
        throw new Error('use('+url+') failed: '+xmlhttp.status+' - '+xmlhttp.statusText);
    }
    return obj;
}

// cut the given CSG object using a plane along the Y axis
// o - object to cut
// y - Y offset of the cut (optional)
// r - reverse the cut, returning the upper half (optional)
function cutY(o,y,r) {
    if (y === undefined) y = 0;
    if (r === undefined) r = false;
    var p = CSG.Plane.fromPoints([100,y,0],[0,y,-100],[-100,y,100]);
    if (r === true) p = p.flipped();
    return o.cutByPlane(p);
}

// cut the given CSG object using a plane along the Z axis
// o - object to cut
// z - Z offset of the cut (optional)
// r - reverse the cut, returning the upper half (optional)
function cutZ(o,z,r) {
    if (z === undefined) z = 0;
    if (r === undefined) r = false;
    var p = CSG.Plane.fromPoints([100,100,z],[-100,0,z],[100,-100,z]);
    if (r === true) p = p.flipped();
    return o.cutByPlane(p);
}

function iPhone6S(p) {
// body
    p.i_x  =  67.10;
    p.i_y  = 138.30;
    p.i_zr =   7.10/2; // radius of thickness
    p.i_cr =  10.00;   // radius of corners
// screen
    p.s_x  =  59.00;   // screen
    p.s_y  = 105.00;
    p.s_cr =   0.50/2;
    p.s_o  =  16.50;   // offset of screen from bottom of body
// home button
    p.hm_r =  11.00/2; // radius of home button
    p.hm_o =   1.00;   // offset of home button from screen
// front speaker
    p.fs_x =  10.50;
    p.fs_y =   1.00;
    p.fs_o =   7.50;   // offset of front speaker from screen (center)
// front camera
    p.fc_r =   2.00/2;
    p.fc_o =   10.50;  // offset of front camera from screen (center) CHANGE
// front sensor
    p.fe_r =   1.60/2;
    p.fe_o =   4.00;   // offset of front sensor from speaker (center)
// bottom lightning port
    p.bl_x =   8.50;
    p.bl_y =   3.00;
// bottom microphone(s)
    p.bm_r =   1.50/2;
    p.bm_o =  15.50;   // offset from body center (center)
    p.bm_p =  12.00;   // offset from body center (center)
// bottom headphone port
    p.bh_r =   4.00/2;
    p.bh_o =   5.00;   // offset from microphone (center)
// bottom speaker(s)
    p.bs_r =   1.5/2;
    p.bs_o =   11.00/5;
// left side ring/silent swicth
    p.rs_x =   6.00;
    p.rs_y =   2.00;
    p.rs_o =  17.50;   // offset from top edge
// left side volume buttons
    p.vs_x =  23.00;
    p.vs_y =   2.50;
    p.vs_o =   5.50;   // offset from ring/slient switch
//  right side power switch
    p.ps_x =  11.00;   // power switch
    p.ps_y =   2.50;
    p.ps_o =  29.00;   // offset from top edge
// rigth side sim slot
    p.ss_x =  15.50;   // sim slot
    p.ss_y =   2.50;
    p.ss_o =  12.50;   // offset from power button
// back camera
    p.bc_r =   7.00/2; // back camera
    p.bc_z =   1.00;
    p.bc_o =  13.00;   // offset from left side of body (center)
    p.bc_p =   6.75;   // offset from top edge of body (center)
// back sensor
    p.be_r =   1.50/2; // back sensor
    p.be_o =   7.00;   // offset from camera (center)
// back flash
    p.bf_r =   4.00/2; // back flash
    p.bf_o =   3.75;   // offset from back sensor (center)
}

function LightningCable(p) {
    p.light_r = 5.30/2; // radius
    p.light_w = 7.75;   // width
}

function makeScreen(p) {
    var x = (p.s_x / 2) + p.offset;
    var y = (p.s_y / 2) + p.offset;
    var z = 10.00;
    var b = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: p.s_cr, resolution: p.resolution});
    b = b.extrude({offset: [0,0,z]});

    y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o;
    b = b.translate([0,y,0]);
    return b;
}

function makePower(p) {
    var r = (p.ps_y/2);
    var x = p.ps_x/2 - r;
    r = r + 1.00; // extra space for access
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateZ(90).rotateY(-90);
    x = (p.i_x/2) + z;
    y = (p.i_y/2) - (p.ps_x/2) - p.ps_o;
    b = b.translate([x,y,0]);
    return b;   
}

function makeSimSlot(p) {
    var r = p.ss_y/2;
    var x = p.ss_x/2 - r;
    r = r + p.offset;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateZ(90).rotateY(-90);
    x = (p.i_x/2) + z;
    y = (p.i_y/2) - p.ps_o - p.ps_x - p.ss_o - (p.ss_x/2);
    b = b.translate([x,y,0]);
    return b;   
}

function makeVolume(p) {
    var r = p.vs_y/2;
    var x = p.vs_x/2 - r;
    r = r + 0.75;  // extra space for access
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateZ(90).rotateY(90);
    x = 0 - (p.i_x/2) - z;
    y = (p.i_y/2) - p.rs_o - p.rs_x - p.vs_o - (p.vs_x/2);
    b = b.translate([x,y,0]);
    return b;   
}

function makeRingSilent(p) {
    var r = p.rs_y/2;
    var x = p.rs_x/2 - r;
    r = r + 1.00; // extra space for access
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateZ(90).rotateY(90);
    x = 0 - (p.i_x/2) - z;
    y = (p.i_y/2) - (p.rs_x/2) - p.rs_o;
    b = b.translate([x,y,0]);
    return b;   
}

function makeHeadphone(p) {
    var r = p.bh_r + p.offset;
    var b = CAG.circle({center: [0,0], radius: r, resolution: 16});
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateX(-90);
    y = (-p.i_y/2) - z + 1;
    x = 0 - p.bm_o - p.bh_o;
    b = b.translate([x,y,0]);
    return b;
}

function makeMic(p) {
    var r = p.bm_r + p.offset;
    var b = CAG.circle({center: [0,0], radius: r, resolution: 16});
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateX(-90);
    y = (-p.i_y/2) - z + 1;
    x = 0 - p.bm_o;
    var c = b.translate([x,y,0]);
    x = 0 + p.bm_p;
    c = c.union(b.translate([x,y,0]));
    return c;
}

function makeLightning(p) {
    var r = p.light_r;
    var x = p.light_w/2 - r;
    r = r + 0.25;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateX(-90);
    y = (-p.i_y/2) - z + 1;
    b = b.translate([0,y,0]);
    return b;   
}

function makeLightningSlot(p) {
    var r = p.light_r;
    var x = p.light_w/2 - r;
    r = r + 0.25;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    b = hull(b,b.translate([0,r*-2]));
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateX(-90);
    y = (-p.i_y/2) - z + 5;
    b = b.translate([0,y,0]);
    return b;   
}

function makeBottomSpeaker(p) {
    var r = p.bs_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: 16});
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]}).rotateX(-90);
    var s5 = b;
    s5 = s5.union(b.translate([p.bs_o*1,0,0]));
    s5 = s5.union(b.translate([p.bs_o*2,0,0]));
    s5 = s5.union(b.translate([p.bs_o*3,0,0]));
    s5 = s5.union(b.translate([p.bs_o*4,0,0]));
    var x = 0 + p.bm_p + p.bs_o;
    var y = (-p.i_y/2) - z + 1;
    b = s5.translate([x,y,0]);
    return b;
}

function makeBackCamera(p) {
    var r = p.bc_r + p.offset;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]});
    var x = 0 + (p.i_x/2) - p.bc_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    z = 0 - p.i_zr - z;
    b = b.translate([x,y,z]);
    return b;    
}

function makeBackSensor(p) {
    var r = p.be_r + p.offset;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]});
    var x = 0 + (p.i_x/2) - p.bc_o - p.be_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    z = 0 - p.i_zr - z;
    b = b.translate([x,y,z]);
    return b;    
}

function makeBackFlash(p) {
    var r = p.bf_r + p.offset;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    var z = 10.0;
    b = b.extrude({offset: [0,0,z]});
    var x = 0 + (p.i_x/2) - p.bc_o - p.be_o - p.bf_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    z = 0 - p.i_zr - z;
    b = b.translate([x,y,z]);
    return b;    
}

function makeBackCameraPort(p) {
    var r = p.bc_r + 1.0;
    var c = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    var z = 10.0;
    r = p.bf_r + 1.0;
    var f = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    x = 0 - p.be_o - p.bf_o;
    y = 0;
    f = f.translate([x,y]);
    c = hull(c,f);
    c = c.extrude({offset: [0,0,z]});
    var x = 0 + (p.i_x/2) - p.bc_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    z = 0 - p.i_zr - z;
    c = c.translate([x,y,z]);
    return c;
}

function makeFitSlots(p) {
    var x = (p.i_x/2);
    var y = p.i_cr * 0.25;
    var z = p.i_zr+p.offset+p.w_thickness;
    var rr = y * 0.50;
    var c = CSG.roundedCube({center: [0,0,0], radius: [x,y,z], roundradius: rr});
    b = c.rotateZ(p.fit_angle);
    y = (p.i_y/2) - x/2;
    z = p.w_thickness;
    b = b.translate([x/2,y,z]);
    c = c.rotateZ(-p.fit_angle);
    c = c.translate([-x/2,y,z]);
    b = b.union(c);
    b = b.union(b.rotateZ(180));
    return b;
}

// works only for flush case
function makeFitSlots2(p) {
    var x = (p.i_x/2);
    var y = p.i_cr * 0.25;
    var z = p.i_zr + 1.5 + p.offset;
    var rr = y * 0.50;

    // touge
    var c = CAG.roundedRectangle({center: [0,0], radius: [y,z], roundradius: rr, resolution: p.resolution});
    // top
    z = p.i_zr;
    var c1 = CAG.roundedRectangle({center: [0,0], radius: [y*3,z], roundradius: rr, resolution: p.resolution});
    var c2 = c1.translate([0,z]);
    c = c.union(c2);
    z = p.w_thickness + 0.5;
    c2 = c1.translate([(y*4),-z]);
    c = c.subtract(c2);
    c2 = c1.translate([-(y*4),-z]);
    c = c.subtract(c2);
    c = c.extrude({offset: [0,0,x*2]}).translate([0,0,-x]).rotateZ(90).rotateY(90);//.translate([0,y,0]);
    b = c.rotateZ(p.fit_angle);
    y = (p.i_y/2) - x/2;
    z = p.w_thickness;
    b = b.translate([x/2,y,z]);
    //return b;
    c = c.rotateZ(-p.fit_angle);
    c = c.translate([-x/2,y,z]);
    b = b.union(c);
    b = b.union(b.rotateZ(180));
    return b;
}

function makeExposure(p) {
    var x = p.i_zr+p.offset+p.w_thickness;
    var y = (p.i_y/2) - p.expose_o;
    var rr = x * 0.75;
    b = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: rr, resolution: p.resolution}); 
    var z = (p.i_zr*2)+(p.offset*2)+(p.w_thickness*2);
    b = b.extrude({offset: [0,0,z]});
    x = (p.i_x/2)+p.offset;//+p.w_thickness;
    z = -z/2;
    b = b.translate([x,0,z]);
    b = b.union(b.rotateY(180));
    return b;
}

function makeExposureEnds(p) {
    var x = (p.i_x/2) - p.expose_o;
    var y = (p.i_zr/2)+p.offset+p.w_thickness;
    var rr = x * 0.75;
    b = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: rr, resolution: p.resolution}); 
    var z = (p.i_zr*2)+(p.offset*2)+(p.w_thickness*2);
    b = b.extrude({offset: [0,0,z]});
    y = (p.i_y/2)+p.offset;
    z = -z/2;
    b = b.translate([0,y,z]);
    b2 = b.rotateX(180);
    b = b.translate([0,0,p.w_thickness]);
    b = b.union(b2);
    return b;
}

function main(p) {
    var s = use("http://www.z3d.jp/lab/data/lab-000000041/iphone_6s_case_v3.json");
    var iphone = CSG.cube();
    iphone = iphone.fromJSON(s);
    p.iphone = iphone;
    iPhone6S(p);
    LightningCable(p);

// create the case around the iphone
    var xs,ys,zs;

    var ibounds = iphone.getBounds();
    var iphone_w = ibounds[1]._x - ibounds[0]._x;
    var iphone_h = ibounds[1]._y - ibounds[0]._y;
    var iphone_d = ibounds[1]._z - ibounds[0]._z;

// scale the iPhone to obtain the inside of the case (negative)
    xs = ((iphone_w/2)+p.offset) / (iphone_w/2);
    ys = ((iphone_h/2)+p.offset) / (iphone_h/2);
    zs = ((iphone_d/2)+p.offset) / (iphone_d/2);
    var ci = iphone.scale([xs,ys,zs]);
// scale the iPhone to obtain the outside of the case (positive)
    xs = ((iphone_w/2)+p.offset+p.w_thickness) / (iphone_w/2);
    ys = ((iphone_h/2)+p.offset+p.w_thickness) / (iphone_h/2);
    zs = ((iphone_d/2)+p.offset+p.w_thickness) / (iphone_d/2);
    var ce = iphone.scale([xs,ys,zs]);
    var c = ce.subtract(ci);
// create access to the switches, etc
    var n;
    if (p.showscreen) {
        n = makeScreen(p);
        c = c.subtract(n);
    }
// left side
    if (p.showringsilent) {
        n = makeRingSilent(p);
        c = c.subtract(n);
    }
    if (p.showvolume) {
        n = makeVolume(p);
        c = c.subtract(n);
    }
// right side
    if (p.showpower) {
        n = makePower(p);
        c = c.subtract(n);
    }
    if (p.showsim) {
        n = makeSimSlot(p);
        c = c.subtract(n);
    }
// bottom
    if (p.showheadphone) {
        n = makeHeadphone(p);
        c = c.subtract(n);
    }
    if (p.showmic) {
        n = makeMic(p);
        c = c.subtract(n);
    }
    if (p.showlight) {
        n = makeLightning(p);
        c = c.subtract(n);
    }
    if (p.showspeaker) {
        n = makeBottomSpeaker(p);
        c = c.subtract(n);
    }
// back
    if (p.showcameraport) {
        n = makeBackCameraPort(p);
        c = c.subtract(n);
    } else {
        if (p.showcamera) {
            n = makeBackCamera(p);
            c = c.subtract(n);
            n = makeBackSensor(p);
            c = c.subtract(n);
        }
        if (p.showflash) {
            n = makeBackFlash(p);
            c = c.subtract(n);
        }
    }
// apply the style
    if (p.style == 'clip') {
        p.fit_angle = 45;
        //n = makeLightningSlot(p);
        //c = c.subtract(n);
        c = cutZ(c,p.i_zr-0.50);
        n = makeFitSlots2(p);
        c = c.subtract(n);
    }
    if (p.style == 'exposed') {
        p.fit_angle = 40;
        p.expose_o = 1.50;
        c = cutZ(c,p.i_zr-0.50);
        n = makeLightningSlot(p);
        c = c.subtract(n);
        n = makeFitSlots2(p);
        c = c.subtract(n);
        n = makeExposure(p);
        c = c.subtract(n);
    }
    if (p.style == 'ends') {
        p.fit_angle = 50;
        p.expose_o = 1.50;
        n = makeFitSlots2(p);
        c = c.subtract(n);
        p.fit_angle = 55;
        n = makeFitSlots2(p);
        c = c.subtract(n);
        c = cutZ(c,p.i_zr-0.50);
        n = makeExposureEnds(p);
        c = c.subtract(n);
    }

    return c;
}
