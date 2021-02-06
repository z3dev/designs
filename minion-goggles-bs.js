function getParameterDefinitions() { 
  return [ 
      { name: 'face', type: 'group', caption: 'Face Dimensions' },
      { name: 'pupils_d', type: 'int', initial: 65, caption: 'Distance between pupils？ (mm)' }, 
      { name: 'face_d', type: 'int', initial: 140, caption: 'Distance across cheek bones？ (mm)' }, 
      { name: 'forehead_f', type: 'int', initial: 30, caption: 'Distance across flat area of forehead？ (mm)' }, 
      { name: 'nose', type: 'group', caption: 'Nose Dimensions' },
      { name: 'nose_width', type: 'int', initial: 26, caption: 'Width across nostrals？ (mm)' }, 
      { name: 'nose_height', type: 'int', initial: 23, caption: 'Height of bridge？ (mm)' }, 
      { name: 'nose_angle', type: 'int', initial: 30, caption: 'Angle of bridge？ (mm)' }, 
      { name: 'nose_offset', type: 'int', initial: 10, caption: 'Start point of bridge？ (mm)' }, 
      { name: 'strap', type: 'group', caption: 'Straps' },
      { name: 'strap_w', type: 'int', initial: 15, caption: 'Width？ (mm)' }, 
      { name: 'strap_t', type: 'int', initial: 1, caption: 'Thickness？ (mm)' }, 
      { name: 'others', type: 'group', caption: 'Others' },
      { name: 'color', type: 'choice', initial: '215/200/164/255', caption: 'Color?', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] },
      { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution?' }, 
   ]; 
} 

// the path must be centered at 0,0, and project into Y
// the number of slices is determined by the number of path segements
// each point in the path provides
// - the amount to expand the original cag radius (X)
// - the slice thickness (Y)
function toPolygon(cag) {
    var points = cag.getOutlinePaths()[0].points;
    return CSG.Polygon.createFromPoints(points);
}

function extrudeFromPath(cag,path,p) {
    var slice = toPolygon(cag);
    slice.path = path;
    slice.original_width = p.width;
    return slice.solidFromSlices({
            numslices: slice.path.points.length,
            callback: function(t, sliceno) {
                //OpenJsCad.log("t=["+t+"]");
                //OpenJsCad.log("sliceno=["+sliceno+"]");
                var z = this.Z_step * (sliceno+1);
                var v = this.path.points[sliceno];
                //OpenJsCad.log("point=["+v._x+","+v._y+"]");
                var swidth = this.original_width - (v._x);
                var s = swidth / this.original_width;
                //OpenJsCad.log("s=["+s+"]");
                return this.scale(s).translate([0,0,v._y]); //.setColor(hsl2rgb(t,1,0.5));
            }
        }
    );
}

function radiusCylinder(p) {
// check parameters on p
// - center[x,y]
// - radius
// - roundRadius, also < radius < heightRadius
// - heightRadius
// - resolution
    var x  = p.center[0];
    var y  = p.center[1];
    var r  = p.radius
    var rr = p.roundRadius;
    var h  = p.heightRadius;
    
    var circle = CAG.circle({center: [x,y], radius: r, resolution: p.resolution});
    //return points.extrude({offset: [0,0,h]});
    //points = points.getOutlinePaths()[0].points;
    //var slice = CSG.Polygon.createFromPoints(points);
    
// create a path to follow
    var z = h - r;
    var a = new CSG.Path2D([ [0,0], [0,z] ]);
    var b = CSG.Path2D.arc({
            center: [0,0],
            radius: rr,
            startangle: 0,
            endangle: 90,
            resolution: p.resolution,
        });
    b = b.translate([-b.points[0]._x,z,0]).rotateY(180);
    a = a.concat(b);
    //a = a.close();
    //return a.innerToCAG();
// extrude the slice along the path
    var solid = extrudeFromPath(circle, a, {width: r});
    return solid.union(solid.mirroredZ());
}

function rivets( p ) {
    var balls = [];
    var b = CSG.roundedCylinder({start: [0,-p.rim_b_r-1,0], end: [0,+p.rim_b_r+1,0], radius: p.rim_b_r, resolution: p.c_resolution});
    //var b = CSG.sphere({center: [0,0,0], radius: p.rim_b_r, resolution: p.c_resolution});
    b1 = b.translate([0,p.rim_b_p-p.rim_b_r-1,p.rim_b_z]);
    balls.push(b1);
    b1 = b1.rotateZ(-45);
    balls.push(b1);
    b1 = b1.rotateZ(90);
    balls.push(b1);
    b1 = b1.rotateZ(45);
    balls.push(b1);
    b1 = b1.rotateZ(45);
    balls.push(b1);
    b1 = b1.rotateZ(45);
    balls.push(b1);
    b1 = b1.rotateZ(45); // removed in order to render a better nose
    balls.push(b1);
    return balls;
}

function nose( p ) {
    var x = p.nose_w_r * 3; //+(p.nose_r*2);
    var y = -(p.nose_r * 2);
    var n = chain_hull(
        CAG.circle({center: [0,p.nose_h],    radius: p.nose_r, resolution: p.resolution}),
        CAG.circle({center: [-p.nose_w_r,0], radius: p.nose_r, resolution: p.resolution}),
        
        CAG.circle({center: [-x,y], radius: p.nose_r, resolution: p.resolution}),
        CAG.circle({center: [+x,y], radius: p.nose_r, resolution: p.resolution}),

        CAG.circle({center: [+p.nose_w_r,0], radius: p.nose_r, resolution: p.resolution}),
        CAG.circle({center: [0,p.nose_h],    radius: p.nose_r, resolution: p.resolution})
        );
    n = n.extrude({offset: [0,0,p.face_l_r]}).rotateX(-90).translate([p.face_x,p.nose_y,p.nose_z]);
    return n;
}

function buckle2( p ) {
    var r = (p.buckle_w / 2) + p.strap_t_r;
    var i = CSG.cylinder({start: [0,0,-p.strap_w_r], end: [0,0,p.strap_w_r], radius: r, resolution: p.c_resolution});
    r = (p.buckle_w / 2);
    i = i.subtract(CSG.cylinder({start: [0,0,-p.strap_w_r], end: [0,0,p.strap_w_r], radius: r, resolution: p.c_resolution}));
    r = (p.buckle_w / 2) + p.strap_t_r + (p.buckle_w/2);
    h = p.strap_w_r;
    var e = CSG.roundedCylinder({start: [0,0,-h], end: [0,0,0-(r/2)], radius: r, resolution: p.c_resolution});
    e = e.union(CSG.roundedCylinder({start: [0,0,0+(r/2)], end: [0,0,h], radius: r, resolution: p.c_resolution}));
    var b = CSG.cube({center: [0,0,0], radius: [r,r,h+r]}).translate([r+(p.buckle_w/2),0,0]);
    e = e.subtract(b).subtract(i);
    b = e.rotateY(90).rotateX(180).rotateZ(90);
    return b;
}

function buckle( p ) {
    var ri = (p.buckle_w / 2) + p.strap_t_r + 0.5;
    var i = CSG.cylinder({start: [0,0,-p.strap_w_r], end: [0,0,p.strap_w_r], radius: ri, resolution: p.c_resolution});
    var r = (p.buckle_w / 2);
    i = i.subtract(CSG.cylinder({start: [0,0,-p.strap_w_r], end: [0,0,p.strap_w_r], radius: r, resolution: p.c_resolution}));
    r = ri + (p.buckle_w/2);
    h = p.strap_w_r;
    var cr = r * 0.60;
    var z = (p.strap_w_r + cr + cr + 1)/2;
    var c = radiusCylinder({center: [0,0], radius: r, roundRadius: cr, heightRadius: z, resolution: p.c_resolution});
    z = p.strap_w_r/2 + 0.5;
    e = c.translate([0,0,-z]);
    e = e.union(c.translate([0,0,z]));
    var b = CSG.cube({center: [0,0,0], radius: [r,r,h+r]}).translate([r+(p.buckle_w/2),0,0]);
    e = e.subtract(b).subtract(i);
    b = e.rotateY(90).rotateX(180).rotateZ(90);
    return b;
}

function main( p ) {
// parameters
    p.c_resolution = p.resolution/2;
//    p.forehead_f = 10; // width of forehead, flat space only
    p.face_radius = (p.face_d - p.forehead_f) / 2; // radius of forehead, across temples
//    p.nose_width = 26; // width of nose
//    p.nose_height = 23; // height of nose
//    p.nose_angle = 40; // angle of nose
//    p.nose_offset = 5; // start of nose, typically slightly higher from pupils

// calculate rim properties
    p.glasses_width = p.pupils_d * 2.0; // total width of glasse is propotional to distance between pupils
    p.rim_width = p.glasses_width * 0.125; // rim with is propotional to width of glasses
    p.rim_w_r = p.rim_width / 2;
    p.rim_d = (p.glasses_width / 2) + (p.rim_w_r);
    p.rim_r = p.rim_d / 2;
    p.rim_t = p.rim_width * 0.95; // rim thickness is proportional to rim width
    p.rim_c_r = (p.rim_t/2) * 0.75;
    p.rim_b_r = p.rim_c_r * 0.50; // size of balls for the rivets
    p.rim_b_z = 0 - p.rim_b_r - 0.0; // Z position of rivets on the rim
    p.rim_b_p = p.rim_r + p.rim_w_r - (p.rim_w_r/2) - (p.rim_b_r*0.25); // R position of rivets on the rim
// create the rim
    var r1 = CAG.roundedRectangle({center: [0,0], radius: [p.rim_w_r,p.rim_w_r], roundradius: p.rim_c_r, resolution: p.c_resolution});
    var r2 = CAG.roundedRectangle({center: [0,0], radius: [p.rim_w_r,p.rim_w_r], roundradius: p.rim_c_r/4, resolution: p.c_resolution});
    var r3 = CAG.rectangle({center: [0,0], radius: [p.rim_w_r,p.rim_w_r]});
    r1 = r1.subtract(r3.translate([-p.rim_w_r,0]));
    r2 = r2.subtract(r3.translate([p.rim_w_r,0]))
    r1 = r1.union(r2);
    //return r1;
    r1 = r1.translate([p.rim_r-(p.rim_w_r/2),0]);
    r1 = rotate_extrude({fn: p.resolution}, r1);
    r1 = r1.subtract(CSG.cube({center: [0,0,p.rim_w_r], radius: [p.glasses_width,p.glasses_width,p.rim_w_r]}))
    r1 = r1.union(rivets(p));

// calculate the cylinder properties
    p.cyl_h = p.glasses_width * 0.190; // height of cylinder is proportional to width of glasses
    p.cyl_t = 2.2; // thickness of cylinder, thin is better
    p.cyl_r = p.rim_r * 0.95;
    p.cyl_g_h = p.cyl_h * 0.15; // inset gap is proportional to cylinder height
    p.cyl_g_t = 1; // thickness of inset gap
    p.cyl_g_z = p.cyl_g_h * 3.0; // position of inset gap on cylinder
    p.buckle_w = 2;
    p.strap_w_r = (p.strap_w / 2) + 0.5;
    p.strap_t_r = (p.strap_t / 2) + 0.5;
    p.strap_z = p.cyl_h - p.strap_t_r - p.buckle_w;
    p.buckle_r = (p.strap_t_r*2) + (p.cyl_t/2);
    p.buckle_l = (p.buckle_w*2) + (p.strap_w_r*2) - (p.buckle_r*2);
    p.buckle_l_r = p.buckle_l / 2;
// create the cylinder
    var c = CSG.cylinder({start: [0,0,0], end: [0,0,p.cyl_h], radius: p.cyl_r, resolution: p.resolution});
// add the buckle
    var r = (p.buckle_w / 2) + p.strap_t_r;
    b = CSG.cube({center: [0,0,0], radius: [r,p.strap_w_r,r]});
    b = b.translate([-(p.cyl_r-p.cyl_t+(p.buckle_w / 2)),0,p.cyl_h-(p.buckle_w / 2)]);
    c = c.subtract(b);
    b = buckle(p);
    b = b.translate([-(p.cyl_r-p.cyl_t+(p.buckle_w / 2)),0,p.cyl_h-(p.buckle_w / 2)]);
    c = c.union(b);
// remove the interior
    var ci = CSG.cylinder({start: [0,0,0], end: [0,0,p.cyl_h+0.5], radius: p.cyl_r-p.cyl_t, resolution: p.resolution});
    c = c.subtract(ci);

    r1 = r1.union(c);

    var r2 = r1.mirroredX();
    r2 = r2.translate([p.pupils_d,0,0]);
    r1 = r1.union(r2);
    //return r1;
    
// create a face
    p.face_w_r = p.face_d / 2;
    p.face_t_r = p.face_radius;
    p.face_l_r = p.rim_d * 2;
    p.face_x = p.pupils_d / 2;
    p.face_z = p.face_t_r + p.cyl_g_z + p.cyl_g_h;
    
    var f = CSG.roundedCube({center: [p.face_x,0,p.face_z], radius: [p.face_w_r,p.face_l_r,p.face_t_r], roundradius: (p.face_t_r - 1), resolution: p.c_resolution});
// add the nose
    p.nose_r = 6; // TBD calculate this
    p.nose_w_r = (p.nose_width / 2) - p.nose_r;  // TBD calculate this
    p.nose_h = p.nose_height - p.nose_r - p.nose_r; // TBD calculate this
    p.nose_r = 5; // TBD calculate this
    p.nose_z = p.nose_h + p.nose_r + p.cyl_g_z + p.cyl_g_h;
    p.nose_y = -(p.face_l_r/2);
   
    var n = nose(p);
    n = n.rotateX(p.nose_angle).translate([0,p.nose_offset,0]);

    f = f.union(n);

    r1 = r1.subtract(f);

    return r1;
}
