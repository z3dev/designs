function getParameterDefinitions() { 
  return [ 
    { name: 'board', type: 'group', initial: 0, caption: 'Raspberry PI:' }, 
    { name: 'board_v', type: 'checkbox', checked: false, caption: 'View?' }, 
    { name: 'base', type: 'group', initial: 0, caption: 'Base:' }, 
    { name: 'case_b_v', type: 'checkbox', checked: true, caption: 'View?' }, 
    { name: 'cover', type: 'group', initial: 0, caption: 'Cover:' }, 
    { name: 'case_c_v', type: 'checkbox', checked: true, caption: 'View?' }, 
    { name: 'case_c_gap', type: 'int', initial: 2.0, caption: 'Rim Vent (mm)?', step: 1, min: 0 }, 
    { name: 'case_c_dim', type: 'checkbox', checked: true, caption: 'Expose DIM Slot?' }, 
    { name: 'case_c_led', type: 'checkbox', checked: true, caption: 'Expose LEDs?' }, 
    { name: 'case_c_net', type: 'checkbox', checked: true, caption: 'Expose Network Port?' }, 
    { name: 'case_c_usb1', type: 'checkbox', checked: true, caption: 'Expose USB Bank 1?' }, 
    { name: 'case_c_usb2', type: 'checkbox', checked: true, caption: 'Expose USB Bank 2?' }, 
    { name: 'case_c_add_s', type: 'checkbox', checked: true, caption: 'Addition Support?' }, 
    { name: 'others', type: 'group', initial: 0, caption: 'Others Settings:' }, 
    { name: 'resolution', type: 'int', initial: 36, caption: 'Resolution?' }, 
    ]; 
}


//
// A case for the Raspberry PI 2 computer boards.
//
// By Jeff Gay
//

//
// create a mockup of the Raspberry PI board
//
function createBoard(p) {
// blank board
    var b = CAG.roundedRectangle({center: [0,0], radius: [p.pi_w_r, p.pi_l_r], roundradius: 3.0, resolution: p.resolution});
// less mounting holes
    var h = CAG.circle({center: [0,0], radius: p.pi_mh_ir, resolution: p.resolution});
    var x = -p.pi_w_r + p.pi_m_x;
    var y = -p.pi_l_r + p.pi_m_y;
    b = b.subtract(h.translate([x,y]));
    y = y + 58.0;
    b = b.subtract(h.translate([x,y]));
    x = x + 49.0;
    b = b.subtract(h.translate([x,y]));
    y = y - 58.0;
    b = b.subtract(h.translate([x,y]));
    b = b.extrude({offset: [0,0,p.pi_t_r*2]});
    b = b.translate([0,0,p.case_b_t + p.case_b_h]);
    b = b.setColor(60/255,145/255,40/255,230/255); // 060/145/040/230
    
    return b;
}

function makeRow(holes, p) {
   var i = 0, x = 0, y = 0;
   var c = CAG.circle({center: [x,y], radius: p.case_b_v_h, resolution: p.resolution});
   for (i = 1; i < holes; i++) {
       y = y + (p.case_b_v_h*2) + p.case_b_v_g;
       c = c.union(CAG.circle({center: [x,y], radius: p.case_b_v_h, resolution: p.resolution})); 
   }
   return c.translate([0,-(y/2)]);
}

function createVentHoles(p) {
    var h = p.case_b_v_n;
    var rows = null;
    var x = 0;
    for (var i = 0; i < p.case_b_v_r; i = i + 2) {
        var r = makeRow(h, p);
        if (rows === null) {
            rows = r;
        } else {
            rows = rows.union(r.translate([x,0]));
            rows = rows.union(r.translate([-x,0]));
        }
        h = h - 1;
        if (h === 0) break; // for safety
        x = x + p.case_b_v_h + p.case_b_v_g;
    }
    return rows.extrude({offset: [0,0,p.case_b_t]});
}
//
// Create the base of the case
//
function createBase(p) {
// calculate dimensions base on the Rasberry PI board
    var f = p.case_b_f;
    var r = p.pi_c_r + f;
    var w = p.pi_w_r + f;
    var l = p.pi_l_r + p.pi_usb_e_r + f;
    var d = p.case_b_t + p.case_b_h;
    
    var b = CAG.roundedRectangle({center: [0,0], radius: [w, l], roundradius: r, resolution: p.resolution});
    b = b.extrude({offset: [0,0,d]});
// less center for electronics and cooling
    var r2 = p.pi_c_r - p.case_b_w_t + f;
    var w2 = p.pi_w_r - p.case_b_w_t + f;
    var l2 = p.pi_l_r - p.case_b_w_t + f;
    var d2 = p.case_b_h;
    
    var c = CAG.roundedRectangle({center: [0,0], radius: [w2, l2], roundradius: r2, resolution: p.resolution});
    c = c.extrude({offset: [0,0,d]}).translate([0,-p.pi_usb_e_r,p.case_b_t]);
    b = b.subtract(c);
// less vents (optional)
    b = b.subtract(createVentHoles(p).translate([0,-p.pi_usb_e_r,0]));
// less slot for SSD card
    var s = CAG.rectangle({center: [0,-l], radius: [p.pi_sd_w_r, l]});
    s = s.extrude({offset: [0,0,p.pi_sd_d_r*2]}).translate([0,0,d-(p.pi_sd_d_r*2)]);
    b = b.subtract(s);
// plus mounts
    var m = CAG.circle({center: [0,0], radius: p.pi_mh_or, resolution: p.resolution});
    m = m.extrude({offset: [0,0,d]});
    s = CSG.sphere({center: [0,0,d], radius: p.pi_mh_ir, resolution: p.resolution});
    m = m.union(s);
    var x = -p.pi_w_r + p.pi_m_x;
    var y = -p.pi_l_r + p.pi_m_y - p.pi_usb_e_r;
    b = b.union(m.translate([x,y]));
    y = y + 58.0;
    b = b.union(m.translate([x,y]));
    x = x + 49.0;
    b = b.union(m.translate([x,y]));
    y = y - 58.0;
    b = b.union(m.translate([x,y]));
// plus block under the middle USB ports
    var b_r = 6 / 2;
    m = CAG.rectangle({center: [0,0], radius: [b_r, b_r]});
    m = m.extrude({offset: [0,0,d]});
    x = 0;
    y = p.pi_l_r - b_r - p.pi_usb_e_r;
    b = b.union(m.translate([x,y]));
// plus block under the audio jack
    x = (p.case_c_w_t + p.case_c_f)/2;
    r = p.pi_audio_r + p.case_c_f;
    m = CAG.rectangle({center: [0,0], radius: [x, r]});
    var z = d + (p.pi_t_r*2) + (p.pi_audio_r);
    m = m.extrude({offset: [0,0,z-1]});
    c = CSG.cylinder({start: [-x,0,z], end: [x,0,z], radius: r, resolution: p.resolution});
    m = m.subtract(c);
    x = w + x;
    y = -p.pi_l_r + p.pi_audio_o - p.pi_usb_e_r;
    b = b.union(m.translate([x,y]));
// plus block under the hdmi port
    x = (p.case_c_w_t + p.case_c_f)/2;
    r = p.pi_hdmi_r + p.case_c_f;
    m = CAG.rectangle({center: [0,0], radius: [x, r]});
    z = d + (p.pi_t_r*2);
    m = m.extrude({offset: [0,0,z]});
    x = w + x;
    y = -p.pi_l_r + p.pi_hdmi_o - p.pi_usb_e_r;
    b = b.union(m.translate([x,y]));
// plus block under the power port
    x = (p.case_c_w_t + p.case_c_f)/2;
    r = p.pi_pwr_r + p.case_c_f;
    m = CAG.rectangle({center: [0,0], radius: [x, r]});
    z = d + (p.pi_t_r*2);
    m = m.extrude({offset: [0,0,z]});
    x = w + x;
    y = -p.pi_l_r + p.pi_pwr_o - p.pi_usb_e_r;
    b = b.union(m.translate([x,y]));
// plus clips
    z = p.clip_z;
    var ci = CSG.roundedCylinder({start: [0,0,-z], end: [0,0,z], radius: p.clip_r, resolution: p.resolution});
    var cor = ((p.clip_r/2)+1)/2;
    var co = CAG.rectangle({center: [0,0], radius: [cor, p.clip_r+1]});
    z = p.clip_z + p.clip_r + 1;
    co = co.extrude({offset: [0,0,z]});
    x = -p.pi_w_r - p.case_b_f;
    y = -p.pi_l_r + p.pi_m_y - p.pi_usb_e_r + 58; // located at the mount
    b = b.union(co.translate([x+cor,y]));
    b = b.subtract(ci.translate([x,y]));
    y = -p.pi_l_r + p.pi_pwr_o - p.pi_usb_e_r;
    y = y + p.pi_pwr_r + ((p.pi_hdmi_o - p.pi_hdmi_r - p.pi_pwr_o - p.pi_pwr_r)/2);
    b = b.union(co.translate([x+cor,y]));
    b = b.subtract(ci.translate([x,y]));
    x = p.pi_w_r + p.case_b_f;
    b = b.union(co.translate([x-cor,y]));
    b = b.subtract(ci.translate([x,y]));
    y = -p.pi_l_r + p.pi_m_y - p.pi_usb_e_r + 58; // located at the mount
    b = b.union(co.translate([x-cor,y]));
    b = b.subtract(ci.translate([x,y]));

    return b;
}

function createCover(p) {
// calculate dimensions base on the Rasberry PI board
    var bf = p.case_b_f;
    var r = p.pi_c_r + bf + p.case_c_w_t + p.case_c_f;
    var w = p.pi_w_r + bf + p.case_c_w_t + p.case_c_f;
    var l = p.pi_l_r + p.pi_usb_e_r + bf + p.case_c_w_t + p.case_c_f;
    var d = p.case_c_t + p.case_c_h + p.case_c_gap + p.case_c_gap_s;
    
    var c = CAG.roundedRectangle({center: [0,0], radius: [w, l], roundradius: r, resolution: p.resolution});
    c = c.extrude({offset: [0,0,d]});
// less center for electronics and cooling
    var r2 = p.pi_c_r + bf + p.case_c_f;
    var w2 = p.pi_w_r + bf + p.case_c_f;
    var l2 = p.pi_l_r + p.pi_usb_e_r + bf + p.case_c_f;
    var d2 = p.case_c_h + p.case_c_gap + p.case_c_gap_s;
    
    var s = CAG.roundedRectangle({center: [0,0], radius: [w2, l2], roundradius: r2, resolution: p.resolution});
    s = s.extrude({offset: [0,0,d2]});
    c = c.subtract(s);
// plus lip below the USB ports for strength (optional)
    if (p.case_c_add_s === true) {
        m = CAG.rectangle({center: [0,0], radius: [w, p.pi_usb_e_r]});
        m = m.extrude({offset: [0,0,p.pi_t_r*2]});
        z = p.case_b_t + p.case_b_h + p.case_c_f;
        m = m.translate([0,l2-p.pi_usb_e_r,z]);
        m = m.intersect(s);
        c = c.union(m);
    }
// less gaps around the rim for ventilation
    var x,y,z,m;
    if (p.case_c_gap > 0) {
    // add support for the vent
        m = CAG.roundedRectangle({center: [0,0], radius: [w, l], roundradius: r, resolution: p.resolution});
        s = CAG.roundedRectangle({center: [0,0], radius: [w2-p.case_c_gap_s, l2-p.case_c_gap_s], roundradius: r2, resolution: p.resolution});
        m = m.subtract(s);

        x = p.pi_usb_r;
        s = CAG.rectangle({center: [0,0], radius: [x,l]});
        x = -w2 + r2 + p.pi_usb_r;
        y = 0;
        m = m.subtract(s.translate([x,y]));
        x =  w2 - r2 - p.pi_usb_r;
        m = m.subtract(s.translate([x,y]));
        var y2 = (l2 - r2 - ((5*3)/2))/4;
        s = CAG.rectangle({center: [0,0], radius: [w,y2]});
        x = 0;
        y = -l2 + r2 + y2;
        m = m.subtract(s.translate([x,y]));
        y = y + 5 + (y2*2);
        m = m.subtract(s.translate([x,y]));
        y = y + 5 + (y2*2);
        m = m.subtract(s.translate([x,y]));
        y = y + 5 + (y2*2);
        m = m.subtract(s.translate([x,y]));
        
        z = d - p.case_c_t - p.case_c_gap - p.case_c_gap_s;
        s = m.extrude({offset: [0,0,p.case_c_gap+p.case_c_gap_s]}).translate([0,0,z]);
        c = c.union(s);
    // less the vent
        m = CAG.roundedRectangle({center: [0,0], radius: [w, l], roundradius: r, resolution: p.resolution});
        s = CAG.roundedRectangle({center: [0,0], radius: [w2, l2], roundradius: r2, resolution: p.resolution});
        m = m.subtract(s);
        z = d - p.case_c_t - p.case_c_gap;
        s = m.extrude({offset: [0,0,p.case_c_gap]}).translate([0,0,z]);
        c = c.subtract(s);
    }
// less slot for sdd card (optional)
    if (p.case_c_dim === true) {
        z = p.case_b_t + p.case_b_h + p.case_c_f;
        y = p.pi_l_r + p.pi_usb_e_r + bf;
        s = CAG.rectangle({center: [0,-y], radius: [p.pi_sd_w_r, y]});
        s = s.extrude({offset: [0,0,z]});
        c = c.subtract(s);
    }
// less holes for the LEDs
    if (p.case_c_led === true) {
        s = CSG.cylinder({start: [0,-p.case_c_w_t,0], end: [0,p.case_c_w_t,0], radius: p.case_c_l_r, resolution: p.resolution});
        x = -p.pi_w_r + 8.0;
        y = -p.pi_l_r - p.pi_usb_e_r - p.case_c_w_t;
        z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + 0.5;
        c = c.subtract(s.translate([x,y,z]));
        x = x + 3.5;
        c = c.subtract(s.translate([x,y,z]));
    }
// less slot for the audio jack
    r = p.pi_audio_r + p.case_c_f  + p.case_c_f;
    z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + (p.pi_audio_r);
    m = CAG.rectangle({center: [0,0], radius: [p.case_c_w_t, r]});
    m = m.extrude({offset: [0,0,z]});
    s = CSG.cylinder({start: [-p.case_c_w_t,0,z], end: [p.case_c_w_t,0,z], radius: r, resolution: p.resolution});
    s = m.union(s);
    x = p.pi_w_r + bf + p.case_c_w_t;
    y = -p.pi_l_r + p.pi_audio_o - p.pi_usb_e_r;
    s = s.translate([x,y,0]);
    c = c.subtract(s);
// less slot for the hdmi port
    x = p.case_c_w_t;
    r = p.pi_hdmi_r + p.case_c_f + p.case_c_f;
    m = CAG.rectangle({center: [0,0], radius: [x, r]});
    z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.pi_hdmi_h + p.case_c_f;
    m = m.extrude({offset: [0,0,z]});
    x = p.pi_w_r + bf + p.case_c_w_t;
    y = -p.pi_l_r + p.pi_hdmi_o - p.pi_usb_e_r;
    c = c.subtract(m.translate([x,y,0]));
// less slot for the power port
    x = (p.case_c_w_t + p.case_c_f)/2;
    r = p.pi_pwr_r + p.case_c_f + p.case_c_f;
    m = CAG.rectangle({center: [0,0], radius: [x, r]});
    z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.pi_pwr_h + p.case_c_f;
    m = m.extrude({offset: [0,0,z]});
    x = p.pi_w_r + bf + x;
    y = -p.pi_l_r + p.pi_pwr_o - p.pi_usb_e_r;
    c = c.subtract(m.translate([x,y,0]));
// less hole for network port (optional)
    if (p.case_c_net === true) {
        y = (p.case_c_w_t + p.case_c_f)/2;
        x = p.pi_net_r - p.case_c_f; // slightly smaller
        m = CAG.rectangle({center: [0,0], radius: [x, y]});
        z = p.pi_net_h - (p.case_c_f*2); // slightly smaller
        m = m.extrude({offset: [0,0,z]});
        x = p.pi_w_r - p.pi_net_o;
        y = l - y;
        z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.case_c_f;
        c = c.subtract(m.translate([x,y,z]));
    }
// less holes for USB ports and supports (optional)
    s = CAG.rectangle({center: [0,0], radius: [1.0/2, (p.pi_usb_e_r*3)]});
    x = d - p.case_b_t - p.case_b_h - (p.pi_t_r*2) - p.case_c_f;
    y = l2 - (p.pi_usb_e_r*3);
    z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.case_c_f;
    s = s.extrude({offset: [0,0,x]}).translate([0,y,z]);
    y = (p.case_c_w_t + p.case_c_f)/2;
    x = p.pi_usb_r - p.case_c_f; // slightly smaller
    m = CAG.rectangle({center: [0,0], radius: [x, y]});
    z = (p.pi_usb_h_r*2) - (p.case_c_f*2); // slightly smaller
    m = m.extrude({offset: [0,0,z]});
    if (p.case_c_usb1 === true) {
        x = p.pi_w_r - p.pi_usb1_o;
        y = l - ((p.case_c_w_t + p.case_c_f)/2);
        z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.case_c_f;
        c = c.subtract(m.translate([x,y,z]));
        x = x + p.pi_usb_r + 1.0 + (1.0/2);
        c = c.union(s.translate([x,0,0]));
    }
    if (p.case_c_usb2 === true) {
        x = p.pi_w_r - p.pi_usb2_o;
        y = l - ((p.case_c_w_t + p.case_c_f)/2);
        z = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.case_c_f;
        c = c.subtract(m.translate([x,y,z]));
        x = x + p.pi_usb_r + 1.0 + (1.0/2);
        c = c.union(s.translate([x,0,0]));
    }
// plus clips and hold downs
    var cl = CSG.sphere({center: [0,0,0], radius: p.clip_r, resolution: p.resolution});
    z = (d - p.case_b_t - p.case_b_h - (p.pi_t_r*2) - p.case_c_f)/2;
    var zhd = p.case_b_t + p.case_b_h + (p.pi_t_r*2) + p.case_c_f + z;
    var xhd = p.pi_mh_ir;
    var hd = CSG.cube({center: [0,0,0], radius: [p.pi_mh_ir,p.pi_mh_ir,z]});
    x = -w2;
    y = -p.pi_l_r + p.pi_m_y - p.pi_usb_e_r + 58; // located at the mount
    z = p.clip_z;
    c = c.union(cl.translate([x,y,z]));
    var yhd = y;
    c = c.union(hd.translate([x+xhd,yhd,zhd]));
    y = -p.pi_l_r + p.pi_pwr_o - p.pi_usb_e_r;
    y = y + p.pi_pwr_r + ((p.pi_hdmi_o - p.pi_hdmi_r - p.pi_pwr_o - p.pi_pwr_r)/2);
    c = c.union(cl.translate([x,y,z]));
    yhd = -p.pi_l_r - p.pi_usb_e_r + p.pi_m_y; // located at the mount
    c = c.union(hd.translate([x+xhd,yhd,zhd]));
    x = w2;
    c = c.union(cl.translate([x,y,z]));
    c = c.union(hd.translate([x-xhd,yhd,zhd]));
    y = -p.pi_l_r + p.pi_m_y - p.pi_usb_e_r + 58; // located at the mount
    c = c.union(cl.translate([x,y,z]));
    yhd = y;
    c = c.union(hd.translate([x-xhd,yhd,zhd]));
    c = c.setColor(245/255,30/255,15/255,230/255); // 245/030/015/230
    return c;
}


function main( p ) {
// base dimensions
    p.case_b_w_t = 1.0;  // base wall thickness (best 1.0)
    p.case_b_t   = 1.5;  // base bottom thickness (min 1.5)
    p.case_b_h   = 3.0;  // base height, above the base thickness (min 3.0)
    p.case_b_f   = 0.25; // slack around the edges of the board
    
    p.case_b_v_h = 2.0;  // vent holes
    p.case_b_v_g = 4.0;  // gaps between vent holes
    p.case_b_v_n = 7;    // number of vent holes (middle row)
    p.case_b_v_r = 5;    // number of rows (1 + factor of 2)
    
// cover dimensions
    p.case_c_w_t = 2.0;   // cover wall thickness
    p.case_c_t   = 1.5;   // cover top thickness
    p.case_c_h   = 23.0;  // cover height, below the cover thickness (min 23)
    p.case_c_f   = 0.25;  // slack around the edges of the base
    p.case_c_l_r = 2.5/2; // hole in front of LEDs

    if (p.case_c_gap > 0) {
        p.case_c_gap_s = 1.5; // support
    } else {
        p.case_c_gap_s = 0;   // no support
    }

// clip dimensions
    p.clip_r = 2.5/2;          // radius of clips
    p.clip_z = p.clip_r + 1.0; // position of clips
    
// Raspberry PI 2 form factors
    p.pi_l_r = 85/2;
    p.pi_w_r = 56/2;
    p.pi_t_r = 1.35/2;
    p.pi_c_r = 2.5;      // corner radius, really 3.0 but board is different
    p.pi_mh_ir = 2.75/2; // M2.5 bolt holes
    p.pi_mh_or = 6.2/2;  // spacers around the holes
    p.pi_m_x = 3.5;      // inset of mount from corner
    p.pi_m_y = 3.5;      // inset of mount from corner
    p.pi_sd_w_r = 14/2;  // ssd card slot width
    p.pi_sd_d_r = 2/2;   // ssd card slot depth
    p.pi_usb_e_r = 2.0/2;  // extension of USB ports beyond the board
    p.pi_usb_h_r = 16.0/2; // height of USB ports above the board
    p.pi_usb1_o = 29.0;  // USB ports (bank 1) offset
    p.pi_usb2_o = 47.0;  // USB ports (bank 2) offset
    p.pi_usb_r = 15.0/2; // USB port width
    p.pi_audio_r = 6/2;  // audio jack size
    p.pi_audio_o = 53.5; // audio jack offset
    p.pi_hdmi_r = 15/2;  // hdmi port size
    p.pi_hdmi_o = 32.0;  // hdmi port offset
    p.pi_hdmi_h = 6.0;   // height of hdmi port above the board
    p.pi_pwr_r = 8/2;    // power port size
    p.pi_pwr_o = 10.6;   // power port offset
    p.pi_pwr_h = 3.0;    // height of power port above the board
    p.pi_net_o = 10.25;  // network port offset
    p.pi_net_h = 13.5;   // height of network port above the board
    p.pi_net_r = 16.0/2; // network port width

    var objs = [];
    if (p.board_v === true) {
        objs.push( createBoard(p).translate([0,-p.pi_usb_e_r,0]) );
    }
    if (p.case_b_v === true) {
        objs.push( createBase(p) ); 
    }
    if (p.case_c_v === true) {
        objs.push( createCover(p) );
    }
    if (objs.length === 0) {
        objs.push( CSG.cube() ); // return something
    }
    
    return union(objs);
}
