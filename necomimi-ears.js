function getParameterDefinitions() { 
  return [ 
    { name: 'design', type: 'group', caption: 'Design' }, 
    { name: 'scale', type: 'float', initial: 3.5, min: 1.0, max: 10.0, step: 0.1, caption: 'Scale?' }, 
    { name: 'fitx', type: 'float', initial: 0.0, min: -10.0, max: 10.0, step: 1, caption: 'Adjust X?' }, 
    { name: 'fity', type: 'float', initial: 0.0, min: -10.0, max: 10.0, step: 1, caption: 'Adjust Y?' }, 
    { name: 'fitz', type: 'float', initial: 0.0, min: -10.0, max: 10.0, step: 1, caption: 'Adjust Z?' }, 
    { name: 'ear', type: 'group', caption: 'Ear' }, 
    { name: 'type', type: 'choice', initial: 0, caption: 'Side?', values: [0,1], captions: ['Right','Left'] },
    { name: 'wall', type: 'float', initial: 1.6, min: 1.0, max: 10.0, step: 0.1, caption: 'Wall Thickness?' }, 
    { name: 'show', type: 'checkbox', checked: true, caption: 'Show?' }, 
    ]; 
} 

function necomimi(p) {
    p.necomimi_b_x = 39.5;
    p.necomimi_b_y = 18.5;
    p.necomimi_b_rr = 5;
    p.necomimi_t_x = 27;
    p.necomimi_t_y = 17;
    p.necomoni_t_rr = 1;
    p.necomimi_z = 30;
// motor stem
    p.necomimi_m_rr = 4; // radius of stem
    p.necomimi_m_o  = 5; // offset from center
}

function makePath(p) {
    var ex = 0 - (p.necomimi_t_x - p.necomimi_b_x)/2;
    var ey = p.necomimi_z - (p.necomoni_t_rr);
    var a = new CSG.Path2D([[0,0]]);
    a = a.appendBezier([[ex*0.25,ey*0.53], [ex*0.50,ey*0.86], [ex,ey], [ex,ey]],{resolution: 180});
    return a;

// append an arc to the end of the curve
    //var c = CSG.Path2D.arc({
    //    center: [0,0],
    //    radius: p.necomoni_t_rr,
    //    startangle: 180,
    //    endangle: 90,
    //    resolution: 16
    //});
    //x = a.points[a.points.length-1]._x + (p.necomoni_t_rr);
    //y = a.points[a.points.length-1]._y;
    //c = c.translate([x,y]);
    //return c;
}

// outline of the right ear of a panda (from the panda's view point)
function pandaEar() {
    var cag101 = new CSG.Path2D([[21.693121693121693,-0.25925925925925924]],false);
    cag101 = cag101.appendBezier([[19.365079365079367,-0.2619047619047619],[18.743386243386244,-0.35449735449735453],[17.857142857142858,-0.828042328042328]]);
    cag101 = cag101.appendBezier([[17.275132275132275,-1.1402116402116402],[16.264550264550266,-1.8650793650793651],[15.60846560846561,-2.4391534391534395]]);
    cag101 = cag101.appendBezier([[14.955026455026456,-3.0132275132275135],[14.060846560846562,-3.552910052910053],[13.624338624338625,-3.6375661375661377]]);
    cag101 = cag101.appendBezier([[13.132275132275133,-3.7354497354497354],[12.222222222222223,-4.404761904761904],[11.230158730158731,-5.402116402116403]]);
    cag101 = cag101.appendBezier([[10.34920634920635,-6.2857142857142865],[9.380952380952381,-7.547619047619048],[9.074074074074074,-8.201058201058201]]);
    cag101 = cag101.appendBezier([[8.76984126984127,-8.857142857142858],[8.33068783068783,-10.105820105820108],[8.103174603174603,-10.97883597883598]]);
    cag101 = cag101.appendBezier([[7.8730158730158735,-11.851851851851851],[7.571428571428572,-13.6984126984127],[7.428571428571429,-15.07936507936508]]);
    cag101 = cag101.appendBezier([[7.261904761904762,-16.701058201058203],[7.261904761904762,-18.388888888888893],[7.428571428571429,-19.841269841269842]]);
    cag101 = cag101.appendBezier([[7.568783068783069,-21.079365079365083],[7.85978835978836,-22.685185185185187],[8.074074074074074,-23.412698412698415]]);
    cag101 = cag101.appendBezier([[8.288359788359788,-24.140211640211643],[8.923280423280422,-25.449735449735453],[9.484126984126984,-26.322751322751323]]);
    cag101 = cag101.appendBezier([[10.391534391534393,-27.732804232804234],[10.664021164021165,-27.962962962962965],[11.933862433862434,-28.37830687830688]]);
    cag101 = cag101.appendBezier([[13.174603174603174,-28.78571428571429],[13.886243386243388,-28.82010582010582],[17.40476190476191,-28.642857142857142]]);
    cag101 = cag101.appendPoint([21.44973544973545,-28.43915343915344]);
    cag101 = cag101.appendPoint([22.055555555555557,-27.24867724867725]);
    cag101 = cag101.appendBezier([[22.38624338624339,-26.5952380952381],[22.933862433862434,-25.582010582010582],[23.26984126984127,-25]]);
    cag101 = cag101.appendBezier([[23.603174603174605,-24.417989417989418],[24.880952380952383,-22.870370370370374],[26.103174603174605,-21.560846560846564]]);
    cag101 = cag101.appendBezier([[27.32539682539683,-20.251322751322753],[28.322751322751326,-19.08994708994709],[28.31746031746032,-18.98148148148148]]);
    cag101 = cag101.appendBezier([[28.312169312169313,-18.873015873015873],[29.43915343915344,-17.891534391534393],[30.820105820105823,-16.7989417989418]]);
    cag101 = cag101.appendBezier([[32.8994708994709,-15.158730158730158],[33.31216931216932,-14.711640211640212],[33.214285714285715,-14.21957671957672]]);
    cag101 = cag101.appendBezier([[33.14814814814815,-13.891534391534393],[32.78042328042328,-12.314814814814815],[32.3994708994709,-10.714285714285715]]);
    cag101 = cag101.appendBezier([[32.01587301587302,-9.113756613756616],[31.60846560846561,-7.6269841269841265],[31.494708994708997,-7.407407407407407]]);
    cag101 = cag101.appendBezier([[31.380952380952383,-7.190476190476191],[31.126984126984127,-6.357142857142858],[30.931216931216934,-5.555555555555556]]);
    cag101 = cag101.appendBezier([[30.656084656084655,-4.423280423280423],[30.27777777777778,-3.788359788359789],[29.243386243386247,-2.7010582010582014]]);
    cag101 = cag101.appendBezier([[28.148148148148152,-1.5476190476190477],[27.603174603174605,-1.2063492063492063],[26.190476190476193,-0.7777777777777778]]);
    cag101 = cag101.appendBezier([[24.947089947089946,-0.40211640211640215],[23.701058201058203,-0.25925925925925924],[21.693121693121693,-0.25925925925925924]]);
    cag101 = cag101.close();
    return cag101;
    //cag101 = cag101.innerToCAG();
}

function toPolygon(cag) {
    var points = cag.getOutlinePaths()[0].points;
    return CSG.Polygon.createFromPoints(points);
}

function extrudeFromPathA(cag,path) {
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
                var sx = (this.original_x - (v._x*2)) / this.original_x;
                var sy = (this.original_y - (v._x*2)) / this.original_y;
                //OpenJsCad.log("s=["+sx+":"+sy+"]");
                return this.scale([sx,1]).translate([0,0,v._y]); //.setColor(hsl2rgb(t,1,0.5));
            }
        }
    );
}

function createNecomimi(p) {
    var x,y,rr;
    x = p.necomimi_b_x/2;
    y = p.necomimi_b_y/2;
    rr = p.necomimi_b_rr;
    var b = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: rr, resolution:32});
    var z = makePath(p);
    var bs = extrudeFromPathA(b,z);
    var s = CSG.cylinder({start: [0,0,-5], end: [0,0,0], radius: 4, resolution: p.resolution});
    if (p.type == 0) { // right side ear
        s = s.translate([-p.necomimi_m_o,0,0]);
    } else {          // left side ear
        s = s.translate([p.necomimi_m_o,0,0]);
    }
    bs = bs.union(s);
    bs = bs.setColor([0,0,0]);
    return bs;
}

function createFrame(p) {
    var ear = pandaEar().scale([p.scale,p.scale]);
    //var frame = ear.rectangularExtrude(4,1,32).center(); // w, h, r
    //frame = frame.union(ear.rectangularExtrude(2,2,32).center());
    var frame = ear.innerToCAG().center([true, true, true]).extrude({offset: [0,0,p.wall]});
    frame = frame.rotateZ(-45);
// rotate to Z space and orientate to Z=0
    frame = frame.rotateX(90);
    var b = frame.getBounds();
    frame = frame.translate([0,0,-(b[0].z)]);
// add ribs for strength
    var x = p.wall/2;
    var z = 76;
    var rr = x/2;
    var r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([0,0,z/2+6]);
    frame = frame.union(r);
    z = 73;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([10,0,z/2+7]);
    frame = frame.union(r);
    z = 72;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([20,0,z/2+6]);
    frame = frame.union(r);
    z = 70;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([30,0,z/2+5]);
    frame = frame.union(r);
    z = 46;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([40,0,z/2+20]);
    frame = frame.union(r);
    z = 20;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([48,0,z/2+35]);
    frame = frame.union(r);

    z = 75;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([-10,0,z/2+5]);
    frame = frame.union(r);
    z = 72;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([-20,0,z/2+4]);
    frame = frame.union(r);
    z = 68;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([-30,0,z/2+1]);
    frame = frame.union(r);
    z = 51;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([-40,0,z/2+9]);
    frame = frame.union(r);
    z = 28;
    r = CSG.roundedCube({center: [0, 0, 0], radius: [x,p.wall*2,z/2], roundradius: rr, resolution: p.resolution});
    r = r.translate([-50,0,z/2+19]);
    frame = frame.union(r);

    frame = frame.translate([p.fitx,p.fity,p.fitz]);
    if (p.type == 0) { // right side ear
    } else {
        //frame = frame.rotateZ(180);
        frame = frame.mirroredX();
    }
    return frame;
}

function createBase(p) {
    var x,y,rr;
    x = p.necomimi_b_x/2;
    y = p.necomimi_b_y/2;
    rr = p.necomimi_b_rr;
    var c = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: rr, resolution:32});
    var z = makePath(p);
    var nm = extrudeFromPathA(c,z);
// and scale to create a shell
    var b = nm.getBounds();
    x = b[1].x - b[0].x;
    y = b[1].y - b[0].y;
    z = b[1].z - b[0].z;
    
    x = (x + (p.offset*2) + (p.wall*2)) / x; // percent
    y = (y + (p.offset*2) + (p.wall*2)) / y;
    z = (z + (p.offset*2) + (p.wall*2)) / z;
    
    var base = nm.scale([x,y,z]);

    return base;
}

function createCore(p) {
    var x,y,rr;
    x = p.necomimi_b_x/2;
    y = p.necomimi_b_y/2;
    rr = p.necomimi_b_rr;
    var c = CAG.roundedRectangle({center: [0,0], radius: [x,y], roundradius: rr, resolution:32});
    var z = makePath(p);
    var nm = extrudeFromPathA(c,z);
// and scale to create a shell
    var b = nm.getBounds();
    x = b[1].x - b[0].x;
    y = b[1].y - b[0].y;
    z = b[1].z - b[0].z;
    
    x = (x + (p.offset*2)) / x; // percent
    y = (y + (p.offset*2)) / y;
    z = (z + (p.offset*2)) / z;

    var core = nm.scale([x,y,z]);
    return core;
}

function main(p) {
    necomimi(p);
    
    //p.wall = 2;
    p.angle = 7;
    p.offset = 0.5;
    p.resolution = 32;

    var nm = createNecomimi(p);
    
    var base = createBase(p);
    var core = createCore(p);
    var frame = createFrame(p);
    
    var all = new CSG();
    all = all.union(base);
    all = all.union(frame);
    all = all.subtract(core);
    if (p.show === true) {
        all = all.union(nm);
    }
    return all;
}
