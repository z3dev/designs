function getParameterDefinitions() { 
  return [ 
    { name: 'emblem', type: 'group', caption: 'Emblem (1 unit = 1 mm)' },
    { name: 'base', type: 'int', initial: 2, caption: 'Base Thickness?' }, 
    { name: 'emboss', type: 'int', initial: 2, caption: 'Embossing Thickness?' }, 
    { name: 'ring', type: 'group', caption: 'Ring' },
    { name: 'len', type: 'int', initial: 20, caption: 'Length?' }, 
    { name: 'dia', type: 'int', initial: 20, caption: 'Center Diameter?' }, 
    { name: 'thick', type: 'int', initial: 2, caption: 'Outer Walls?' }, 
    { name: 'other', type: 'group', caption: 'Others' },
    { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution:' }, 
    { name: 'color', type: 'choice', initial: '190/170/235/255', caption: 'Color?', values: ['016/169/240/255','019/040/177/255','165/190/215/255','242/243/242/255','190/170/235/255','243/110/202/255','252/088/166/255','248/060/033/255','253/102/054/255','255/180/050/255','240/202/029/255','252/230/037/255','190/212/003/255','166/246/029/255','035/141/053/255','032/163/145/255','245/030/015/230','255/160/000/220','250/210/000/220','060/145/040/230','195/000/070/230','236/228/212/255','215/200/164/255','183/180/140/255','132/134/096/255','042/041/038/255','255/255/255/250','184/185/189/255','080/049/039/255','190/133/085/255'], captions: ['Sky Blue','Ultra Marine Blue','Blue Grey','Bluish White','Lila','Magenta','Flourescent Pink','Traffic Red','Warm Red','Dutch Orange','Olympic Gold','Signal Yellow','Flourescent Green','Intense Green','Leaf Green','Mint Turquoise','Red Transparent','Orange Transparent','Yellow Transparent','Green Transparent','Violet Transparent','Naturel','Pale Gold','Greenish Beige','Olive Green','Standard Black','Standard White','Shining Silver','Chocolate Brown','Light Brown'] }, 
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

function main( p ) {
// create the base
    var obj = use("http://www.z3d.jp/lab/data/lab-000000061/bs_base.json");
    var base = square();
    base = base.fromJSON(obj);
    base = base.extrude({offset: [0,0,p.base]});
// create the embossing
    obj = use("http://www.z3d.jp/lab/data/lab-000000061/bs_simple.json");
    var emboss = square();
    emboss = emboss.fromJSON(obj);
    emboss = emboss.extrude({offset: [0,0,p.emboss]});
// scale appropriately
    base = base.union(emboss.translate([0,0,p.base]));
    var scale = 0.5;
    base = base.scale([scale,scale,1]);
// create the ring
    var xr = p.len / 2;
    var yr = (p.dia + (p.thick*2)) / 2;
    var rr = (p.thick / 2) - 0.1;
    var outer = CSG.cylinder({start: [-xr,0,0], end: [xr,0,0], radius: yr, resolution: p.resolution});
    yr = p.dia / 2;
    var inner = CSG.cylinder({start: [-xr,0,0], end: [xr,0,0], radius: yr, resolution: p.resolution});
    var ring = outer.subtract(inner);
// put everything together
    var z = (p.dia / 2) + p.thick - p.base;
    ring = ring.union(base.translate([0,0,z]));
    return ring;
}
