const getParameterDefinitions = () => [
  { name: 'resolution', type: 'int', initial: 72, caption: 'Resolution?' },
  { name: 'color', type: 'choice', initial: '255/180/050/255', caption: 'Color?', values: ['016/169/240/255', '019/040/177/255', '165/190/215/255', '242/243/242/255', '190/170/235/255', '243/110/202/255', '252/088/166/255', '248/060/033/255', '253/102/054/255', '255/180/050/255', '240/202/029/255', '252/230/037/255', '190/212/003/255', '166/246/029/255', '035/141/053/255', '032/163/145/255', '245/030/015/230', '255/160/000/220', '250/210/000/220', '060/145/040/230', '195/000/070/230', '236/228/212/255', '215/200/164/255', '183/180/140/255', '132/134/096/255', '042/041/038/255', '255/255/255/250', '184/185/189/255', '080/049/039/255', '190/133/085/255'], captions: ['Sky Blue', 'Ultra Marine Blue', 'Blue Grey', 'Bluish White', 'Lila', 'Magenta', 'Flourescent Pink', 'Traffic Red', 'Warm Red', 'Dutch Orange', 'Olympic Gold', 'Signal Yellow', 'Flourescent Green', 'Intense Green', 'Leaf Green', 'Mint Turquoise', 'Red Transparent', 'Orange Transparent', 'Yellow Transparent', 'Green Transparent', 'Violet Transparent', 'Naturel', 'Pale Gold', 'Greenish Beige', 'Olive Green', 'Standard Black', 'Standard White', 'Shining Silver', 'Chocolate Brown', 'Light Brown'] }
]

const use = (url) => {
  const xmlhttp = new XMLHttpRequest()
  let obj = null
  xmlhttp.onreadystatechange = (e) => {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        obj = JSON.parse(xmlhttp.responseText)
      }
    }
  }

  xmlhttp.open('GET', url, false)
  xmlhttp.send()
  if (obj === null) {
    throw new Error('use(' + url + ') failed: ' + xmlhttp.status + ' - ' + xmlhttp.statusText)
  }
  return obj
}

const getZ = (p) => {
  let cag111 = new CSG.Path2D([[90.25, -35.25]], false)
  cag111 = cag111.appendBezier([[26, -35.05], [8.89, -35.26], [8.48, -36.25]])
  cag111 = cag111.appendBezier([[8.19, -36.94], [8.08, -43.8], [8.23, -51.5]])
  cag111 = cag111.appendPoint([8.5, -65.5])
  cag111 = cag111.appendPoint([63.75, -65.75])
  cag111 = cag111.appendBezier([[94.14, -65.89], [119, -66.34], [118.99, -66.75]])
  cag111 = cag111.appendBezier([[118.99, -67.16], [92.88, -96.3], [60.98, -131.5]])
  cag111 = cag111.appendPoint([2.97, -195.5])
  cag111 = cag111.appendPoint([2.99, -210.75])
  cag111 = cag111.appendBezier([[3, -223.41], [3.25, -226.08], [4.5, -226.5]])
  cag111 = cag111.appendBezier([[5.33, -226.78], [43.24, -227.02], [88.75, -227.04]])
  cag111 = cag111.appendBezier([[155.21, -227.08], [171.74, -226.83], [172.74, -225.79]])
  cag111 = cag111.appendBezier([[173.62, -224.87], [173.91, -220.54], [173.74, -210.5]])
  cag111 = cag111.appendPoint([173.5, -196.5])
  cag111 = cag111.appendPoint([115, -196.23])
  cag111 = cag111.appendBezier([[82.83, -196.08], [56.15, -195.63], [55.72, -195.23]])
  cag111 = cag111.appendBezier([[55.29, -194.83], [62.29, -186.4], [71.28, -176.5]])
  cag111 = cag111.appendBezier([[80.27, -166.6], [106.63, -137.57], [129.87, -112]])
  cag111 = cag111.appendPoint([172.12, -65.5])
  cag111 = cag111.appendPoint([171.81, -50.5])
  cag111 = cag111.appendPoint([171.5, -35.5])
  cag111 = cag111.appendPoint([90.25, -35.25])
  cag111 = cag111.close()
  cag111 = cag111.innerToCAG()
  cag111 = cag111.scale([p.scale, p.scale])
  // and apply 3D operations
  let csg = cag111.extrude({ offset: [0, 0, p.z_z] })
  csg = csg.setColor(p.z_color)
  return csg
}

const get3 = (p) => {
  let cag131 = new CSG.Path2D([[215.5, -115.19]], false)
  cag131 = cag131.appendBezier([[208.35, -115.28], [200.25, -115.51], [197.5, -115.69]])
  cag131 = cag131.appendBezier([[194.75, -115.87], [187.78, -116.74], [182, -117.61]])
  cag131 = cag131.appendBezier([[176.23, -118.49], [168.58, -120.28], [165, -121.6]])
  cag131 = cag131.appendBezier([[161.43, -122.92], [156.75, -125.23], [154.61, -126.75]])
  cag131 = cag131.appendBezier([[152.48, -128.26], [149.36, -131.53], [147.69, -134]])
  cag131 = cag131.appendBezier([[146.02, -136.48], [143.82, -140.98], [142.81, -144]])
  cag131 = cag131.appendBezier([[141.8, -147.03], [140.5, -153.1], [139.93, -157.5]])
  cag131 = cag131.appendBezier([[139.36, -161.9], [139.02, -168.43], [139.19, -172]])
  cag131 = cag131.appendPoint([139.5, -178.5])
  cag131 = cag131.appendPoint([158.47, -178.5])
  cag131 = cag131.appendPoint([177.44, -178.5])
  cag131 = cag131.appendPoint([178.58, -168])
  cag131 = cag131.appendBezier([[179.21, -162.23], [180.47, -156.04], [181.37, -154.25]])
  cag131 = cag131.appendBezier([[182.26, -152.46], [184.46, -150.11], [186.25, -149.03]])
  cag131 = cag131.appendBezier([[188.04, -147.95], [192.65, -146.54], [196.5, -145.91]])
  cag131 = cag131.appendBezier([[200.98, -145.17], [210.69, -144.94], [223.5, -145.26]])
  cag131 = cag131.appendBezier([[235.41, -145.56], [245.12, -146.28], [247.5, -147.03]])
  cag131 = cag131.appendBezier([[249.7, -147.73], [252.54, -149.47], [253.8, -150.9]])
  cag131 = cag131.appendBezier([[255.07, -152.33], [256.61, -155.3], [257.22, -157.5]])
  cag131 = cag131.appendBezier([[257.83, -159.7], [258.33, -166.23], [258.32, -172]])
  cag131 = cag131.appendBezier([[258.3, -179.54], [257.84, -183.56], [256.65, -186.25]])
  cag131 = cag131.appendBezier([[255.74, -188.31], [253.99, -190.68], [252.75, -191.51]])
  cag131 = cag131.appendBezier([[251.51, -192.34], [248.7, -193.49], [246.5, -194.07]])
  cag131 = cag131.appendBezier([[244.3, -194.65], [233.73, -195.44], [223, -195.82]])
  cag131 = cag131.appendPoint([203.5, -196.5])
  cag131 = cag131.appendPoint([203.22, -210])
  cag131 = cag131.appendPoint([202.94, -223.5])
  cag131 = cag131.appendPoint([222.22, -224.22])
  cag131 = cag131.appendBezier([[234.32, -224.68], [243.73, -225.54], [247.5, -226.53]])
  cag131 = cag131.appendBezier([[251.08, -227.47], [254.62, -229.19], [256.28, -230.8]])
  cag131 = cag131.appendBezier([[257.8, -232.29], [259.6, -235.08], [260.27, -237]])
  cag131 = cag131.appendBezier([[260.95, -238.97], [261.45, -245.09], [261.4, -251]])
  cag131 = cag131.appendBezier([[261.35, -256.77], [260.79, -263.41], [260.16, -265.75]])
  cag131 = cag131.appendBezier([[259.52, -268.09], [257.88, -271.35], [256.5, -273]])
  cag131 = cag131.appendBezier([[254.92, -274.9], [252.07, -276.59], [248.75, -277.6]])
  cag131 = cag131.appendBezier([[245.11, -278.72], [237.82, -279.37], [225, -279.73]])
  cag131 = cag131.appendBezier([[213.41, -280.06], [203.14, -279.81], [197.5, -279.07]])
  cag131 = cag131.appendBezier([[192.55, -278.42], [186.93, -277.13], [185, -276.19]])
  cag131 = cag131.appendBezier([[182.55, -275.01], [180.76, -273], [179.03, -269.5]])
  cag131 = cag131.appendBezier([[177.07, -265.53], [176.48, -262.55], [176.17, -255]])
  cag131 = cag131.appendBezier([[175.95, -249.78], [175.26, -244.92], [174.64, -244.21]])
  cag131 = cag131.appendBezier([[173.79, -243.24], [168.98, -242.91], [155.5, -242.91]])
  cag131 = cag131.appendBezier([[139.9, -242.91], [137.3, -243.14], [136, -244.59]])
  cag131 = cag131.appendBezier([[134.75, -245.99], [134.64, -248.05], [135.31, -256.89]])
  cag131 = cag131.appendBezier([[135.75, -262.72], [136.59, -269.75], [137.18, -272.5]])
  cag131 = cag131.appendBezier([[137.76, -275.25], [139.47, -280.2], [140.96, -283.5]])
  cag131 = cag131.appendBezier([[142.46, -286.8], [145.67, -291.51], [148.09, -293.96]])
  cag131 = cag131.appendBezier([[150.56, -296.45], [155.15, -299.58], [158.5, -301.06]])
  cag131 = cag131.appendBezier([[161.8, -302.52], [167.43, -304.42], [171, -305.3]])
  cag131 = cag131.appendBezier([[174.58, -306.18], [181.78, -307.47], [187, -308.16]])
  cag131 = cag131.appendBezier([[192.25, -308.86], [206.57, -309.42], [219, -309.42]])
  cag131 = cag131.appendBezier([[231.43, -309.42], [245.75, -308.86], [251, -308.16]])
  cag131 = cag131.appendBezier([[256.23, -307.47], [263.43, -306.18], [267, -305.29]])
  cag131 = cag131.appendBezier([[270.58, -304.41], [275.75, -302.72], [278.5, -301.53]])
  cag131 = cag131.appendBezier([[281.25, -300.35], [285.47, -297.6], [287.87, -295.44]])
  cag131 = cag131.appendBezier([[290.27, -293.27], [293.41, -289.48], [294.84, -287]])
  cag131 = cag131.appendBezier([[296.27, -284.52], [298.26, -279.58], [299.27, -276]])
  cag131 = cag131.appendBezier([[300.27, -272.43], [301.37, -264.77], [301.7, -259]])
  cag131 = cag131.appendBezier([[302.1, -252.17], [301.87, -246.23], [301.05, -242]])
  cag131 = cag131.appendBezier([[300.36, -238.43], [298.95, -233.7], [297.92, -231.5]])
  cag131 = cag131.appendBezier([[296.9, -229.3], [294.56, -225.7], [292.72, -223.5]])
  cag131 = cag131.appendBezier([[290.82, -221.22], [286.61, -218.1], [282.94, -216.24]])
  cag131 = cag131.appendBezier([[279.4, -214.45], [274.14, -212.53], [271.25, -211.99]])
  cag131 = cag131.appendBezier([[268.36, -211.44], [266.22, -210.55], [266.5, -210]])
  cag131 = cag131.appendBezier([[266.77, -209.45], [267.68, -209], [268.5, -209]])
  cag131 = cag131.appendBezier([[269.33, -209], [272.36, -208.13], [275.25, -207.06]])
  cag131 = cag131.appendBezier([[278.14, -206], [282.75, -203.14], [285.5, -200.71]])
  cag131 = cag131.appendBezier([[288.25, -198.27], [291.72, -194.08], [293.22, -191.39]])
  cag131 = cag131.appendBezier([[294.71, -188.7], [296.62, -183.35], [297.45, -179.5]])
  cag131 = cag131.appendBezier([[298.28, -175.65], [298.97, -169.58], [298.98, -166]])
  cag131 = cag131.appendBezier([[298.98, -162.43], [298.51, -156.57], [297.93, -153]])
  cag131 = cag131.appendBezier([[297.35, -149.43], [295.67, -143.85], [294.19, -140.62]])
  cag131 = cag131.appendBezier([[292.56, -137.05], [289.63, -133.01], [286.75, -130.37]])
  cag131 = cag131.appendBezier([[284.14, -127.96], [279.41, -124.8], [276.25, -123.34]])
  cag131 = cag131.appendBezier([[273.09, -121.88], [266.45, -119.88], [261.5, -118.89]])
  cag131 = cag131.appendBezier([[256.55, -117.9], [247.1, -116.63], [240.5, -116.06]])
  cag131 = cag131.appendBezier([[233.9, -115.49], [222.65, -115.1], [215.5, -115.19]])
  cag131 = cag131.close()
  cag131 = cag131.innerToCAG()
  cag131 = cag131.scale([p.scale, p.scale])
  // and apply 3D operations
  let csg = cag131.extrude({ offset: [0, 0, p.t_z] })
  csg = csg.setColor(p.t_color)
  return csg
}

const getD = (p) => {
  let cag101 = new CSG.Path2D([[357.17, -32.08]], false)
  cag101 = cag101.appendBezier([[320.68, -31.76], [290.63, -31.73], [290.39, -32]])
  cag101 = cag101.appendBezier([[290.14, -32.28], [289.96, -52.41], [289.97, -76.75]])
  cag101 = cag101.appendPoint([290, -121])
  cag101 = cag101.appendPoint([291.75, -121.44])
  cag101 = cag101.appendBezier([[292.71, -121.69], [295.27, -123.82], [297.44, -126.19]])
  cag101 = cag101.appendBezier([[299.61, -128.56], [302.62, -133.2], [304.13, -136.5]])
  cag101 = cag101.appendBezier([[305.64, -139.8], [307.58, -145.99], [308.44, -150.25]])
  cag101 = cag101.appendBezier([[309.3, -154.51], [309.99, -161.26], [309.98, -165.25]])
  cag101 = cag101.appendBezier([[309.97, -169.24], [309.29, -175.65], [308.46, -179.5]])
  cag101 = cag101.appendBezier([[307.64, -183.35], [305.94, -188.75], [304.68, -191.5]])
  cag101 = cag101.appendBezier([[303.43, -194.25], [301.2, -198.08], [299.73, -200]])
  cag101 = cag101.appendBezier([[298.26, -201.93], [297.04, -203.84], [297.03, -204.25]])
  cag101 = cag101.appendBezier([[297.01, -204.66], [323.21, -204.99], [355.25, -204.98]])
  cag101 = cag101.appendBezier([[399.6, -204.97], [416.01, -204.62], [424, -203.55]])
  cag101 = cag101.appendBezier([[429.78, -202.78], [438.1, -201], [442.5, -199.61]])
  cag101 = cag101.appendBezier([[446.9, -198.21], [452.53, -195.78], [455, -194.21]])
  cag101 = cag101.appendBezier([[457.48, -192.64], [461.04, -189.58], [462.93, -187.43]])
  cag101 = cag101.appendBezier([[464.81, -185.27], [467.39, -181.25], [468.66, -178.5]])
  cag101 = cag101.appendBezier([[469.92, -175.75], [472.07, -168.55], [473.43, -162.5]])
  cag101 = cag101.appendBezier([[474.79, -156.45], [476.42, -145.88], [477.06, -139]])
  cag101 = cag101.appendBezier([[477.69, -132.13], [478.24, -117.95], [478.27, -107.5]])
  cag101 = cag101.appendBezier([[478.31, -91.67], [477.96, -86.83], [476.16, -78.5]])
  cag101 = cag101.appendBezier([[474.98, -73], [472.66, -65.69], [471.01, -62.25]])
  cag101 = cag101.appendBezier([[469.35, -58.81], [465.64, -53.5], [462.75, -50.45]])
  cag101 = cag101.appendBezier([[459.64, -47.17], [454.85, -43.55], [451, -41.57]])
  cag101 = cag101.appendBezier([[447.43, -39.74], [442.93, -37.74], [441, -37.12]])
  cag101 = cag101.appendBezier([[439.08, -36.51], [434.35, -35.25], [430.5, -34.33]])
  cag101 = cag101.appendBezier([[424.47, -32.89], [414.31, -32.58], [357.17, -32.08]])
  cag101 = cag101.close()
  cag101 = cag101.innerToCAG()
  let cag121 = new CSG.Path2D([[371.75, -60.29]], false)
  cag121 = cag121.appendPoint([411.5, -60.57])
  cag121 = cag121.appendPoint([416.9, -62.54])
  cag121 = cag121.appendBezier([[419.87, -63.62], [424.03, -65.96], [426.15, -67.75]])
  cag121 = cag121.appendBezier([[429.05, -70.2], [430.49, -72.54], [431.98, -77.25]])
  cag121 = cag121.appendBezier([[433.07, -80.69], [434.48, -88], [435.11, -93.5]])
  cag121 = cag121.appendBezier([[435.81, -99.62], [436.06, -111.65], [435.75, -124.5]])
  cag121 = cag121.appendBezier([[435.33, -141.69], [434.85, -146.95], [433.09, -153.5]])
  cag121 = cag121.appendBezier([[431.91, -157.9], [429.83, -163.19], [428.47, -165.25]])
  cag121 = cag121.appendBezier([[426.75, -167.86], [424.1, -169.9], [419.75, -171.96]])
  cag121 = cag121.appendBezier([[415.94, -173.76], [410.37, -175.34], [405.5, -176]])
  cag121 = cag121.appendBezier([[400.65, -176.66], [384.51, -176.98], [364.5, -176.8]])
  cag121 = cag121.appendPoint([331.5, -176.5])
  cag121 = cag121.appendPoint([331.24, -119.5])
  cag121 = cag121.appendBezier([[331.1, -88.15], [331.21, -61.94], [331.49, -61.25]])
  cag121 = cag121.appendBezier([[331.89, -60.27], [340.67, -60.06], [371.75, -60.29]])
  cag121 = cag121.close()
  cag121 = cag121.innerToCAG()
  cag101 = cag101.subtract(cag121) // D internal
  // cross the D in order to support the inside
  cag101 = cag101.subtract(CAG.rectangle({ center: [336.1, -110], radius: [5, 100] }))
  cag101 = cag101.scale([p.scale, p.scale])
  // and apply 3D operations
  let csg = cag101.extrude({ offset: [0, 0, p.d_z] })
  csg = csg.setColor(p.d_color)
  return csg
}

const getDot = (p) => {
  let cag181 = new CSG.Path2D([[452, -213]], false)
  cag181 = cag181.appendBezier([[448.89, -213], [447.33, -213.67], [445, -216]])
  cag181 = cag181.appendBezier([[442.56, -218.44], [442, -219.83], [442, -223.5]])
  cag181 = cag181.appendBezier([[442, -227.06], [442.61, -228.68], [444.92, -231.25]])
  cag181 = cag181.appendBezier([[447.42, -234.04], [448.5, -234.5], [452.5, -234.5]])
  cag181 = cag181.appendBezier([[456.5, -234.5], [457.58, -234.04], [460.08, -231.25]])
  cag181 = cag181.appendBezier([[462.13, -228.97], [463, -226.96], [463, -224.5]])
  cag181 = cag181.appendBezier([[463, -222.58], [462.33, -219.65], [461.5, -218]])
  cag181 = cag181.appendBezier([[460.68, -216.35], [459.1, -214.55], [458, -214]])
  cag181 = cag181.appendBezier([[456.9, -213.45], [454.2, -213], [452, -213]])
  cag181 = cag181.close()
  cag181 = cag181.innerToCAG()
  cag181 = cag181.scale([p.scale, p.scale])
  // and apply 3D operations
  let csg = cag181.extrude({ offset: [0, 0, p.dot_z] })
  csg = csg.setColor(p.dot_color)
  return csg
}

const getJ = (p) => {
  let cag141 = new CSG.Path2D([[500.5, -128.05]], false)
  cag141 = cag141.appendBezier([[499.95, -128.09], [498.6, -128.5], [497.5, -128.95]])
  cag141 = cag141.appendBezier([[496.4, -129.4], [494.78, -130.6], [493.89, -131.63]])
  cag141 = cag141.appendBezier([[493.01, -132.66], [492.02, -134.63], [491.7, -136]])
  cag141 = cag141.appendBezier([[491.38, -137.38], [491.68, -139.85], [492.38, -141.5]])
  cag141 = cag141.appendBezier([[493.07, -143.15], [494.96, -145.1], [496.57, -145.84]])
  cag141 = cag141.appendBezier([[498.25, -146.61], [500.99, -146.95], [503, -146.63]])
  cag141 = cag141.appendBezier([[504.93, -146.32], [507.27, -145.27], [508.21, -144.28]])
  cag141 = cag141.appendBezier([[509.15, -143.3], [510.21, -141.15], [510.57, -139.5]])
  cag141 = cag141.appendBezier([[510.99, -137.57], [510.65, -135.34], [509.61, -133.25]])
  cag141 = cag141.appendBezier([[508.56, -131.13], [506.87, -129.65], [504.75, -128.98]])
  cag141 = cag141.appendBezier([[502.96, -128.42], [501.05, -128], [500.5, -128.05]])
  cag141 = cag141.close()
  cag141 = cag141.innerToCAG()
  let cag161 = new CSG.Path2D([[501.75, -156.25]], false)
  cag161 = cag161.appendBezier([[496.26, -156.07], [493.87, -156.36], [493.56, -157.25]])
  cag161 = cag161.appendBezier([[493.32, -157.94], [492.92, -173.58], [492.67, -192]])
  cag161 = cag161.appendBezier([[492.4, -211.33], [491.76, -226.98], [491.14, -229]])
  cag161 = cag161.appendBezier([[490.56, -230.93], [489.05, -233.51], [487.79, -234.75]])
  cag161 = cag161.appendBezier([[486.53, -235.98], [483.48, -237.61], [481, -238.35]])
  cag161 = cag161.appendPoint([476.5, -239.71])
  cag161 = cag161.appendPoint([476.18, -243.1])
  cag161 = cag161.appendBezier([[476, -244.97], [476.11, -247.96], [476.43, -249.75]])
  cag161 = cag161.appendPoint([477, -253])
  cag161 = cag161.appendPoint([480.5, -253])
  cag161 = cag161.appendBezier([[482.43, -253], [486.59, -252.19], [489.75, -251.21]])
  cag161 = cag161.appendBezier([[492.91, -250.22], [497.23, -248.08], [499.34, -246.46]])
  cag161 = cag161.appendBezier([[501.47, -244.82], [504.24, -241.27], [505.56, -238.5]])
  cag161 = cag161.appendBezier([[506.87, -235.75], [508.42, -230.35], [509, -226.5]])
  cag161 = cag161.appendBezier([[509.62, -222.38], [509.94, -206.54], [509.78, -188]])
  cag161 = cag161.appendPoint([509.5, -156.5])
  cag161 = cag161.appendPoint([501.75, -156.25])
  cag161 = cag161.close()
  cag161 = cag161.innerToCAG()
  cag141 = cag141.union(cag161)
  cag141 = cag141.scale([p.scale, p.scale])
  // and apply 3D operations
  let csg = cag141.extrude({ offset: [0, 0, p.j_z] })
  csg = csg.setColor(p.j_color)
  return csg
}

const getP = (p) => {
  let cag151 = new CSG.Path2D([[566, -155.07]], false)
  cag151 = cag151.appendBezier([[562.42, -155.12], [557.7, -155.79], [555.5, -156.56]])
  cag151 = cag151.appendBezier([[553.3, -157.33], [549.7, -159.56], [547.5, -161.52]])
  cag151 = cag151.appendBezier([[545.3, -163.48], [543.39, -165.06], [543.25, -165.04]])
  cag151 = cag151.appendBezier([[543.11, -165.02], [543.01, -163.76], [543.02, -162.25]])
  cag151 = cag151.appendBezier([[543.03, -160.74], [542.46, -158.69], [541.77, -157.71]])
  cag151 = cag151.appendBezier([[540.73, -156.23], [539.33, -155.96], [534, -156.21]])
  cag151 = cag151.appendPoint([527.5, -156.5])
  cag151 = cag151.appendPoint([527.53, -162.5])
  cag151 = cag151.appendBezier([[527.55, -165.8], [527.66, -187.06], [527.78, -209.75]])
  cag151 = cag151.appendPoint([528, -251])
  cag151 = cag151.appendPoint([536.25, -250.75])
  cag151 = cag151.appendPoint([544.5, -250.5])
  cag151 = cag151.appendPoint([544.75, -234.25])
  cag151 = cag151.appendBezier([[544.89, -225.31], [545.34, -217.99], [545.75, -217.97]])
  cag151 = cag151.appendBezier([[546.16, -217.95], [547.4, -218.87], [548.5, -220.01]])
  cag151 = cag151.appendBezier([[549.6, -221.15], [552.3, -222.78], [554.5, -223.63]])
  cag151 = cag151.appendBezier([[557.17, -224.66], [560.82, -225.06], [565.5, -224.82]])
  cag151 = cag151.appendBezier([[570.32, -224.57], [573.9, -223.74], [577, -222.14]])
  cag151 = cag151.appendBezier([[579.48, -220.87], [582.78, -218.62], [584.34, -217.16]])
  cag151 = cag151.appendBezier([[585.9, -215.7], [588.24, -212.7], [589.54, -210.5]])
  cag151 = cag151.appendBezier([[590.84, -208.3], [592.65, -203.35], [593.55, -199.5]])
  cag151 = cag151.appendBezier([[594.69, -194.67], [595.01, -190.41], [594.6, -185.75]])
  cag151 = cag151.appendBezier([[594.27, -182.04], [593.12, -176.64], [592.04, -173.75]])
  cag151 = cag151.appendBezier([[590.96, -170.86], [588.56, -166.7], [586.72, -164.5]])
  cag151 = cag151.appendBezier([[584.88, -162.3], [580.92, -159.26], [577.93, -157.74]])
  cag151 = cag151.appendBezier([[573.56, -155.51], [571.24, -154.99], [566, -155.07]])
  cag151 = cag151.close()
  cag151 = cag151.innerToCAG()
  let cag171 = new CSG.Path2D([[562.5, -168.7]], false)
  cag171 = cag171.appendBezier([[564.15, -169], [566.74, -169.86], [568.25, -170.62]])
  cag171 = cag171.appendBezier([[569.76, -171.38], [571.85, -173.24], [572.89, -174.75]])
  cag171 = cag171.appendBezier([[573.92, -176.26], [575.27, -179.3], [575.88, -181.5]])
  cag171 = cag171.appendBezier([[576.49, -183.7], [576.99, -187.41], [576.99, -189.75]])
  cag171 = cag171.appendBezier([[577, -192.09], [576.54, -195.91], [575.97, -198.25]])
  cag171 = cag171.appendBezier([[575.41, -200.59], [573.61, -204.19], [571.97, -206.25]])
  cag171 = cag171.appendBezier([[570.15, -208.55], [567.55, -210.43], [565.25, -211.12]])
  cag171 = cag171.appendBezier([[563.19, -211.74], [559.81, -211.96], [557.75, -211.62]])
  cag171 = cag171.appendBezier([[555.69, -211.28], [552.59, -209.76], [550.87, -208.25]])
  cag171 = cag171.appendBezier([[549.14, -206.74], [547.12, -204.26], [546.37, -202.75]])
  cag171 = cag171.appendBezier([[545.5, -201.01], [545.01, -196.59], [545.01, -190.75]])
  cag171 = cag171.appendBezier([[545.03, -183.74], [545.49, -180.53], [546.94, -177.5]])
  cag171 = cag171.appendBezier([[547.98, -175.3], [550.12, -172.64], [551.67, -171.58]])
  cag171 = cag171.appendBezier([[553.23, -170.53], [555.63, -169.32], [557, -168.91]])
  cag171 = cag171.appendBezier([[558.38, -168.49], [560.85, -168.4], [562.5, -168.7]])
  cag171 = cag171.close()
  cag171 = cag171.innerToCAG()
  cag151 = cag151.subtract(cag171)
  // cross the P in order to support the inside
  cag151 = cag151.subtract(CAG.rectangle({ center: [545.5, -190], radius: [3, 100] }))
  cag151 = cag151.scale([p.scale, p.scale])
  // and apply 3D operations
  let csg = cag151.extrude({ offset: [0, 0, p.p_z] })
  csg = csg.setColor(p.p_color)
  return csg
}

const iphone4 = (p) => {
  const iphone = {}
  iphone.w = 58.6
  iphone.h = 115.2
  iphone.d = 9.3
  iphone.e = 0.7 // edge around phone
  iphone.rw = iphone.w / 2
  iphone.rh = iphone.h / 2
  iphone.rd = 6.5 / 2
  iphone.rr = 7.75 // radius of corners

  iphone.rw2 = iphone.rw - iphone.e
  iphone.rh2 = iphone.rh - iphone.e
  iphone.rd2 = iphone.d / 2
  iphone.rr2 = iphone.rr - iphone.e
  // back sensor and back camera
  iphone.bs_rr = 2.5 / 2
  iphone.bs_xoff = 14.0
  iphone.bs_yoff = -8.5
  iphone.bc_rr = 7.0 / 2
  iphone.bc_xoff = iphone.bs_xoff + 6.5
  iphone.bc_yoff = iphone.bs_yoff
  // front home button
  iphone.hb_rr = 11.0 / 2
  iphone.hb_xoff = 0.0
  iphone.hb_yoff = 10.0 // from bottom
  // front display
  iphone.ds_rw = 51.5 / 2
  iphone.ds_rh = 76.0 / 2
  iphone.ds_rr = 1.0
  iphone.ds_xoff = 0.0
  iphone.ds_yoff = -19.0 // from top edge
  // front sensor
  iphone.fs_rr = 3.0 / 2
  iphone.fs_xoff = -10.0 // from center
  iphone.fs_yoff = -10.5 // from top
  // front mic
  iphone.fm_rw = 10.0 / 2
  iphone.fm_rh = 1.7 / 2
  iphone.fm_xoff = 0.0
  iphone.fm_yoff = -10.5
  // power button
  iphone.pb_rw = 10.0 / 2
  iphone.pb_rh = 3.0 / 2
  iphone.pb_rd = 0.5
  iphone.pb_xoff = 15.0 // from center
  iphone.pb_yoff = 0.0 // from center
  // earphone jack
  iphone.ej_rr = 4.7 / 2
  iphone.ej_xoff = -17.25
  iphone.ej_yoff = 0.0
  // power jack
  iphone.pj_rw = 22.0 / 2
  iphone.pj_rh = 2.8 / 2
  iphone.pj_xoff = 0.0
  iphone.pj_yoff = 0.0
  // bottom speaker(s)
  iphone.sp_rw = 6.5 / 2
  iphone.sp_rh = 2.0 / 2
  iphone.sp_xoff = iphone.pj_rw + 4.50 + iphone.sp_rw // from center
  iphone.sp_yoff = 0.0
  // silence switch
  iphone.ss_rw = 5.0 / 2
  iphone.ss_rh = 2.5 / 2
  iphone.ss_rd = 0.5 / 2
  iphone.ss_xoff = iphone.rh - 13.0
  iphone.ss_yoff = 0.0
  // volume buttons
  iphone.vb_rr = 4.5 / 2
  iphone.vb_rd = 0.5 / 2
  iphone.vb_xoff1 = iphone.ss_xoff - 11.5
  iphone.vb_xoff2 = iphone.vb_xoff1 - 10.5
  iphone.vb_yoff = 0.0
  // sim slot
  iphone.sm_rw = 18.0 / 2
  iphone.sm_rh = 2.0 / 2
  iphone.sm_xoff = iphone.rh - 61.0
  iphone.sm_yoff = 0.0

  p.iphone4 = iphone
}

// Z3D.jp Logo for 3D Design Websites
// By Z3 Development
// 2016.07.01

const main = (p) => {
  const s = use('http://www.z3d.jp/lab/data/lab-000000059/iphone4-case.json')
  let icase = CSG.cube()
  icase = icase.fromJSON(s)// .setColor([0,0,0]);
  icase = icase.rotateY(180)

  iphone4(p)

  // controls for 3D rendering
  p.scale = 0.17
  p.z_z = 2.0
  p.z_color = [0.137, 0.094, 0.082, 1]
  p.t_z = 2.0
  p.t_color = [0.537, 0.537, 0.537, 1]
  p.d_z = 2.0
  p.d_color = [0.137, 0.094, 0.082, 1]
  p.dot_z = 2.0
  p.dot_color = [0.137, 0.094, 0.082, 1]
  p.j_z = 2.0
  p.j_color = [0.137, 0.094, 0.082, 1]
  p.p_z = 2.0
  p.p_color = [0.137, 0.094, 0.082, 1]
  p.l_scale = 0.25
  p.l_color = [0.9294, 0.4274, 0.1215, 1] // 237,109,31
  p.l_offset = [-18, -15, 0]

  let neg = getZ(p).union(getD(p)).union(getDot(p)).union(getJ(p)).union(getP(p))
  neg = neg.rotateZ(90)
  neg = neg.translate([-28, -50, p.iphone4.rd2])

  let pos = get3(p)
  pos = pos.rotateZ(90)
  pos = pos.translate([-28, -50, p.iphone4.rd2])

  return icase.subtract(neg).subtract(pos)

  // return [icase,neg,pos];
}
