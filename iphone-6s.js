function getParameterDefinitions() { 
  return [ 
    {name: 'rendering', type: 'group', caption: 'Render' }, 
    {name: 'showscreen', type: 'checkbox', checked: true, caption: 'Touch Screen?' },
    {name: 'showhome', type: 'checkbox', checked: true, caption: 'Home Buttom?' },
    {name: 'showfrontcam', type: 'checkbox', checked: true, caption: 'Front Camera?' },
    {name: 'showfrontsen', type: 'checkbox', checked: true, caption: 'Front Sensor?' },
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
    {name: 'others', type: 'group', caption: 'Others' },
    {name: 'resolution', type: 'int', initial: 36, caption: 'Resolution?' },
    {name: 'color', type: 'choice', caption: 'Color?', initial: '184/185/189/255', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] }, 
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
    p.bc_p =   7.00;   // offset from top edge of body (center)
// back sensor
    p.be_r =   1.50/2; // back sensor
    p.be_o =   6.00;   // offset from camera (center)
// back flash
    p.bf_r =   4.00/2; // back flash
    p.bf_o =   3.75;   // offset from back sensor (center)
}


function makeScreen(p) {
    var x = p.s_x / 2;
    var y = p.s_y / 2;
    var b = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: p.s_cr, resolution: p.resolution});
    var z = 1.0;
    b = b.extrude({offset: [0,0,z]}).setColor([0,0,0]);
    y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o;
    z = p.i_zr - z;
    b = b.translate([0,y,z]);
    return b;
}

function makeHome(p) {
    var r = p.hm_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    b = b.subtract(CAG.circle({center: [0,0], radius: r-1, resolution: p.resolution}));
    var z = 1.0;
    b = b.extrude({offset: [0,0,z]}).setColor([0,0,0]);
    var y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o - (p.s_y/2) - p.hm_r - p.hm_o;
    z = p.i_zr - z;
    b = b.translate([0,y,z]);
    return b;
}

function makeFrontSpeaker(p) {
    var r = p.fs_y/2;
    var x = p.fs_x/2 - r;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    var z = 1.0;
    b = b.extrude({offset: [0,0,1.0]}).setColor([0,0,0]);
    var y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o + (p.s_y/2) + p.fs_o;
    z = p.i_zr - z;
    b = b.translate([0,y,z]);
    return b;    
}

function makeFrontCamera(p) {
    var r = p.fc_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    var z = 1.0;
    b = b.extrude({offset: [0,0,z]}).setColor([0,0,0]);
    var y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o + (p.s_y/2) + p.fs_o;
    var x = 0 - p.fc_o - p.fc_r;
    z = p.i_zr - z;
    b = b.translate([x,y,z]);
    return b;    
}

function makeFrontSensor(p) {
    var r = p.fe_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    var z = 1.0;
    b = b.extrude({offset: [0,0,1.0]}).setColor([0,0,0]);
    var y = (-p.i_y / 2) + (p.s_y / 2) + p.s_o + (p.s_y/2) + p.fs_o + p.fe_o;
    z = p.i_zr - z;
    b = b.translate([0,y,z]);
    return b;    
}

function makeLightning(p) {
    var r = p.bl_y/2;
    var x = p.bl_x/2 - r;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    b = b.extrude({offset: [0,0,1.0]}).rotateX(-90);
    var y = (-p.i_y/2);
    b = b.translate([0,y,0]);
    return b;   
}

function makeHeadphone(p) {
    var r = p.bh_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: 16});
    b = b.extrude({offset: [0,0,1.0]}).rotateX(-90);
    var x = 0 - p.bm_o - p.bh_o;
    var y = (-p.i_y/2);
    b = b.translate([x,y,0]);
    return b;
}

function makeMic(p) {
    var r = p.bm_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: 16});
    b = b.extrude({offset: [0,0,1.0]}).rotateX(-90);
    var y = (-p.i_y/2);
    var x = 0 - p.bm_o;
    var c = b.translate([x,y,0]);
        x = 0 + p.bm_p;
    b = c.union(b.translate([x,y,0]));
    return b;
}

function makeBottomSpeaker(p) {
    var r = p.bs_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: 16});
    b = b.extrude({offset: [0,0,1.0]}).rotateX(-90);
    var s5 = b;
        s5 = s5.union(b.translate([p.bs_o*1,0,0]));
        s5 = s5.union(b.translate([p.bs_o*2,0,0]));
        s5 = s5.union(b.translate([p.bs_o*3,0,0]));
        s5 = s5.union(b.translate([p.bs_o*4,0,0]));
    var x = 0 + p.bm_p + p.bs_o;
    var y = (-p.i_y/2);
    b = s5.translate([x,y,0]);
    return b;
}

function makeRingSilent(p) {
    var r = p.rs_y/2;
    var x = p.rs_x/2 - r;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    b = b.extrude({offset: [0,0,1.0]}).rotateZ(90).rotateY(90);
    x = 0 - (p.i_x/2);
    var y = (p.i_y/2) - (p.rs_x/2) - p.rs_o;
    b = b.translate([x,y,0]);
    return b;   
}

function makeVolume(p) {
    var r = p.vs_y/2;
    var x = p.vs_x/2 - r;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    b = b.extrude({offset: [0,0,1.0]}).rotateZ(90).rotateY(90);
    x = 0 - (p.i_x/2);
    var y = (p.i_y/2) - p.rs_o - p.rs_x - p.vs_o - (p.vs_x/2);
    b = b.translate([x,y,0]);
    return b;   
}

function makePower(p) {
    var r = p.ps_y/2;
    var x = p.ps_x/2 - r;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    b = b.extrude({offset: [0,0,1.0]}).rotateZ(90).rotateY(-90);
    x = (p.i_x/2);
    var y = (p.i_y/2) - (p.ps_x/2) - p.ps_o;
    b = b.translate([x,y,0]);
    return b;   
}

function makeSimSlot(p) {
    var r = p.ss_y/2;
    var x = p.ss_x/2 - r;
    var a = CAG.circle({center: [-x,0], radius: r, resolution: 16});
    var b = CAG.circle({center: [+x,0], radius: r, resolution: 16});
    b = hull(a,b);
    b = b.extrude({offset: [0,0,1.0]}).rotateZ(90).rotateY(-90);
    x = (p.i_x/2);
    var y = (p.i_y/2) - p.ps_o - p.ps_x - p.ss_o - (p.ss_x/2);
    b = b.translate([x,y,0]);
    return b;   
}

function makeBackCamera(p) {
    var r = p.bc_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    b = b.subtract(CAG.circle({center: [0,0], radius: r-1, resolution: p.resolution}));
    b = b.extrude({offset: [0,0,p.bc_z]});
    var x = 0 + (p.i_x/2) - p.bc_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    var z = 0 - p.i_zr - p.bc_z;
    b = b.translate([x,y,z]);
    return b;    
}

function makeBackSensor(p) {
    var r = p.be_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    b = b.extrude({offset: [0,0,1.0]}).setColor([0,0,0]);
    var x = 0 + (p.i_x/2) - p.bc_o - p.be_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    var z = 0 - p.i_zr;
    b = b.translate([x,y,z]);
    return b;    
}

function makeBackFlash(p) {
    var r = p.bf_r;
    var b = CAG.circle({center: [0,0], radius: r, resolution: p.resolution});
    b = b.extrude({offset: [0,0,1.0]}).setColor([0,0,0]);
    var x = 0 + (p.i_x/2) - p.bc_o - p.be_o - p.bf_o;
    var y = 0 + (p.i_y/2) - p.bc_p;
    var z = 0 - p.i_zr;
    b = b.translate([x,y,z]);
    return b;    
}

function main(p) {
    iPhone6S(p);

// create the body
    var x,y,z,rx,ry,rz,sx,sy,sz;
    x = p.i_x / 2;
    y = p.i_y / 2;
    rx = p.i_cr;
    var iphone = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: rx, resolution: p.resolution});
    var b = CSG.Path2D.arc({
            center: [-p.i_zr,0],
            radius: p.i_zr,
            startangle: 0,
            endangle: 90,
            resolution: p.resolution,
        });
    //return b.close().innerToCAG(); // for debugging
    iphone = extrudeFromPath(iphone,b);
    iphone = iphone.union(iphone.rotateY(180));
// add front screen
    if (p.showscreen) {
        b = makeScreen(p);
        iphone = iphone.subtract(b).union(b);
    }
// add front home button
    if (p.showhome) {
        b = makeHome(p);
        iphone = iphone.subtract(b).union(b);
    }
// add front camera
    if (p.showfrontcam) {
        b = makeFrontCamera(p);
        iphone = iphone.subtract(b).union(b);
    }
// add front sensor
    if (p.showfrontsen) {
        b = makeFrontSensor(p);
        iphone = iphone.subtract(b).union(b);
    }
// add front speaker
    if (p.showfrontspk) {
        b = makeFrontSpeaker(p);
        iphone = iphone.subtract(b).union(b);
    }
// add back camera
    if (p.showcamera) {
        b = makeBackCamera(p);
        iphone = iphone.union(b);
// add back sensor
        b = makeBackSensor(p);
        iphone = iphone.subtract(b).union(b);
    }
// add back flash
    if (p.showflash) {
        b = makeBackFlash(p);
        iphone = iphone.subtract(b).union(b);
    }
// add bottom headphone jack
    if (p.showheadphone) {
        b = makeHeadphone(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add bottom microphones
    if (p.showmic) {
        b = makeMic(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add bottom lightning port
    if (p.showlight) {
        b = makeLightning(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add bottom speaker holes
    if (p.showspeaker) {
        b = makeBottomSpeaker(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add left side ring/slient switch
    if (p.showringsilent) {
        b = makeRingSilent(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add left side volume adjustment buttons
    if (p.showvolume) {
        b = makeVolume(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add right side power switch
    if (p.showpower) {
        b = makePower(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
// add right side sim slot
    if (p.showsim) {
        b = makeSimSlot(p);
        b = b.intersect(iphone).setColor([0,0,0]);
        iphone = iphone.subtract(b).union(b);
    }
    
    return iphone;
}