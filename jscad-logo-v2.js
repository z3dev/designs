const { booleans, colors, geometries, measurements, primitives, extrusions, transforms } = require('@jscad/modeling')

// functions used below
const { subtract, union } = booleans
const { colorize } = colors
const { geom2, path2 } = geometries
const { measureBoundingBox } = measurements
const { circle } = primitives
const { extrudeLinear } = extrusions
const { rotateZ, translate } = transforms

const getParameterDefinitions = () => {
  return [
    { name: 'text', type: 'group', caption: 'Text' },
    { name: 't_t', type: 'float', initial: 3.0, caption: 'Thickness (mm)?', step: 0.1, min: 1.0, max: 10.0 },
    { name: 't_x', type: 'float', initial: 0.0, caption: 'X Offset (mm)?', step: 1.0, min: -100.0, max: 100.0 },
    { name: 't_y', type: 'float', initial: 0.0, caption: 'Y Offset (mm)?', step: 1.0, min: -100.0, max: 100.0 },
    { name: 't_c', type: 'color', initial: '#FFA000', caption: 'Color?' },
    { name: 'outer', type: 'group', caption: 'Outer Circle' },
    { name: 'o_o', type: 'float', initial: 10.0, caption: 'Offset from text (mm)?', step: 0.5, min: 1.0, max: 100.0 },
    { name: 'o_t', type: 'float', initial: 1.0, caption: 'Thickness (mm)?', step: 0.1, min: 1.0, max: 10.0 },
    { name: 'o_c', type: 'color', initial: '#01344E', caption: 'Color?' },
    { name: 'inner', type: 'group', caption: 'Inner Circle' },
    { name: 'i_i', type: 'float', initial: 20.0, caption: 'Inset from outer (mm)?', step: 0.5, min: 1.0, max: 100.0 },
    { name: 'i_t', type: 'float', initial: 1.0, caption: 'Thickness (mm)?', step: 0.1, min: 1.0, max: 10.0 },
    { name: 'i_x', type: 'float', initial: 11.0, caption: 'X Offset (mm)?', step: 1.0, min: -100.0, max: 100.0 },
    { name: 'i_y', type: 'float', initial: 0.0, caption: 'Y Offset (mm)?', step: 1.0, min: -100.0, max: 100.0 },
    { name: 'i_r', type: 'float', initial: 0.0, caption: 'Rotation?', step: 1.0, min: -180.0, max: 180.0 },
    { name: 'i_c', type: 'color', initial: '#FF534F', caption: 'Color?' },
    { name: 'others', type: 'group', caption: 'Others' },
    { name: 'segments', type: 'int', initial: 72, caption: 'Segments?' }
  ]
}

// Colors:
//   Lime F9FA65
//   Blue 01344E
//   Orange FFA000
//   Red FF534F
//   Purple F692FF

const main = (p) => {
  // calculate some values
  p.t_c = getColor(p.t_c)
  p.o_c = getColor(p.o_c)
  p.i_c = getColor(p.i_c)

  // create the JSCAD text
  let text = jscad(p)
  // and center
  const center = getCenter(text)
  const x = 0 - center.x
  const y = 0 - center.y
  text = translate([x, y, 0], text)
  // and apply offsets
  text = translate([p.t_x, p.t_y, 0], text)

  // create outer circle
  const textsize = getSize(text)
  p.o_r = textsize.w / 2
  let outer = getOuterCircle(p)

  // create innter cirlce
  let inner = getInnerCircle(p)
  // and apply offsets
  inner = translate([p.i_x, p.i_y, 0], inner)
  // and apply rotation
  inner = rotateZ(p.i_r, inner)

  // finally apply 3D attributes
  text = extrudeLinear({ height: p.t_t }, text)
  if ('t_c' in p) {
    text = colorize(p.t_c, text)
  }
  inner = extrudeLinear({ height: p.i_t }, inner)
  if ('i_c' in p) {
    inner = colorize(p.i_c, inner)
  }
  outer = extrudeLinear({ height: p.o_t }, outer)
  outer = subtract(outer, inner)
  if ('o_c' in p) {
    outer = colorize(p.o_c, outer)
  }
  return [text, outer, inner]
}

const getColor = (p) => {
  let color = null
  // use the color chooser to determine the color of the sphere
  if (p.length === 7) {
    const r = parseInt('0x' + p.slice(1, 3)) / 255
    const g = parseInt('0x' + p.slice(3, 5)) / 255
    const b = parseInt('0x' + p.slice(5, 7)) / 255
    color = [r, g, b]
  }
  return color
}

const getOuterCircle = (p) => {
  const radius = p.o_r + p.o_o
  const shape = circle({ center: [0, 0], radius: radius, segments: p.segments })
  return shape
}

const getInnerCircle = (p) => {
  const radius = (p.o_r + p.o_o) - p.i_i
  const shape = circle({ center: [0, 0], radius: radius, segments: p.segments })
  return shape
}

const getCenter = (cag) => {
  const bounds = measureBoundingBox(cag)
  const x = bounds[0][0] + ((bounds[1][0] - bounds[0][0]) / 2)
  const y = bounds[0][1] + ((bounds[1][1] - bounds[0][1]) / 2)

  return { x: x, y: y }
}

const getSize = (cag) => {
  const bounds = measureBoundingBox(cag)
  const w = bounds[1][0] - bounds[0][0]
  const d = bounds[1][1] - bounds[0][1]

  return { w: w, d: d }
}

const jscad = (p) => {
  const segments = p.segments
  // S
  let cag101 = path2.fromPoints({}, [[33.7255529, -1.14299991]])
  cag101 = path2.appendBezier({ controlPoints: [[32.94944185, -1.1571110199999999], [31.735886389999997, -1.3179776739999998], [31.03033089, -1.501422104]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[30.32477539, -1.6848665339999997], [29.277731027999994, -2.1843998279999997], [28.70199774, -2.61055535]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[28.129086673999996, -3.0367108719999996], [27.307820072, -3.917244136], [26.881664549999996, -4.566355195999999]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[26.226909046, -5.562599562], [26.091442389999997, -6.098821741999999], [26.018064617999997, -8.023577146]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[25.941864623999997, -9.982199213999998], [26.026531283999997, -10.49866584], [26.624842347999998, -11.7122213]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[27.005842317999996, -12.488332349999999], [27.807353365999997, -13.524087823999999], [28.405664429999998, -14.009510008]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[29.003975493999995, -14.497754413999997], [31.208130875999995, -15.736709871999997], [33.302219599999994, -16.763998679999997]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[35.399130545999995, -17.788465266], [37.611752594, -19.041531833999997], [38.21853032399999, -19.54388735]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[38.828130275999996, -20.049065088], [39.49699688999999, -20.873153911999996], [39.70019687399999, -21.378331649999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[39.90621908, -21.883509388], [40.07555239999999, -22.741464876], [40.07555239999999, -23.2833315]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[40.07555239999999, -23.828020346], [39.90621908, -24.683153611999995], [39.70019687399999, -25.18833135]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[39.491352446, -25.693509088], [38.921263601999996, -26.455509027999994], [38.43019697399999, -26.881664549999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[37.939130346, -27.307820072], [36.996508197999994, -27.798886699999997], [36.336108249999995, -27.971042241999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[35.670063858, -28.146020005999997], [34.256130635999995, -28.216575556], [33.1611085, -28.129086673999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[31.651219729999998, -28.01055335], [30.886397567999996, -27.787597811999994], [29.915553199999998, -27.172353415999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[29.218464365999996, -26.729264561999994], [28.202464446, -25.778175748], [27.657775599999997, -25.058509137999998]], segments }, cag101)
  cag101 = path2.appendPoints([[26.6699979, -23.74899813]], cag101)
  cag101 = path2.appendPoints([[25.32944245, -24.434798075999996]], cag101)
  cag101 = path2.appendBezier({ controlPoints: [[24.592842507999997, -24.810153601999996], [23.988887, -25.182686905999997], [23.988887, -25.258886899999997]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[23.988887, -25.337909116], [24.288042532, -25.876953517999997], [24.652109169999996, -26.458331249999997]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[25.016175807999996, -27.039708981999997], [25.778175748, -27.928708911999994], [26.345442369999997, -28.433886649999998]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[26.912708991999995, -28.939064388], [27.979508907999996, -29.655908775999997], [28.716108849999998, -30.028442079999998]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[29.452708791999996, -30.400975383999995], [30.883575345999997, -30.858175347999996], [31.891108599999995, -31.044441999999997]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[32.96919740399999, -31.241997539999996], [34.422641733999995, -31.301264201999995], [35.418886099999995, -31.185553099999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[36.35021936, -31.081130885999997], [37.74721924999999, -30.753753133999997], [38.5233303, -30.460242045999998]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[39.299441349999995, -30.166730958], [40.37753015399999, -29.559953227999994], [40.922219, -29.114042151999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[41.466907846, -28.665308853999996], [42.22890778599999, -27.677531153999997], [42.615552199999996, -26.921175657999996]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[43.202574376, -25.775353525999996], [43.318285478, -25.157286907999996], [43.304174368, -23.2833315]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[43.287241036, -21.437598311999995], [43.15177438, -20.765909475999997], [42.561929981999995, -19.614442899999997]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[42.16399668, -18.83833185], [41.283463416, -17.700976383999997], [40.603307914, -17.088554209999998]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[39.900574635999995, -16.450732037999998], [37.854463685999995, -15.251287687999998], [35.8422194, -14.294554429999998]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[33.90335288599999, -13.371687836], [31.775397497999997, -12.254087923999998], [31.11499755, -11.81099907]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[30.282442059999997, -11.252199113999998], [29.777264321999997, -10.639776939999999], [29.46399768, -9.807221449999998]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[29.190242146, -9.084732617999999], [29.074531043999997, -8.215488242], [29.170486591999996, -7.619999399999999]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[29.257975474, -7.078132775999999], [29.588175447999998, -6.282266172], [29.904264311999995, -5.85611065]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[30.220353175999996, -5.429955127999999], [30.860997569999995, -4.890910725999999], [31.326664199999996, -4.6566662999999995]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[31.792330829999997, -4.425244095999999], [32.873241856, -4.233332999999999], [33.7255529, -4.233332999999999]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[34.67381949199999, -4.233332999999999], [35.68981941199999, -4.439355205999999], [36.336108249999995, -4.761088514]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[36.917485981999995, -5.048955158], [37.77544147, -5.751688435999999], [38.2411081, -6.321777279999999]], segments }, cag101)
  cag101 = path2.appendPoints([[39.0877747, -7.360354975999999]], cag101)
  cag101 = path2.appendPoints([[40.428330149999994, -6.502399487999999]], cag101)
  cag101 = path2.appendPoints([[41.7688856, -5.644443999999999]], cag101)
  cag101 = path2.appendPoints([[40.85166345, -4.467577425999999]], cag101)
  cag101 = path2.appendBezier({ controlPoints: [[40.346485711999996, -3.8184663659999996], [39.491352446, -2.9943775419999996], [38.946663599999994, -2.6331331259999997]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[38.401974753999994, -2.27188871], [37.32388595, -1.7836443039999998], [36.54777489999999, -1.549399878]], segments }, cag101)
  cag101 = path2.appendBezier({ controlPoints: [[35.771663849999996, -1.315155452], [34.501663949999994, -1.1317110219999997], [33.7255529, -1.14299991]], segments }, cag101)
  cag101 = path2.close(cag101)
  cag101 = geom2.fromPoints(path2.toPoints(cag101))
  // C
  let cag111 = path2.fromPoints({}, [[61.524439599999994, -1.2474221239999999]])
  cag111 = path2.appendBezier({ controlPoints: [[59.40777309999999, -1.148644354], [58.39741762399999, -1.2445999019999998], [56.72666219999999, -1.701799866]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[55.56390673599999, -2.020710952], [53.97499574999999, -2.62466646], [53.198884699999994, -3.0423553159999996]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[52.422773649999996, -3.4600441719999995], [50.88466266, -4.690532964], [49.78117385799999, -5.779910655999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[48.677685055999994, -6.8692883479999995], [47.45284070799999, -8.396110449999998], [47.060551849999996, -9.1722215]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[46.668262992, -9.948332549999998], [46.140507477999996, -11.283243555999999], [45.88932971999999, -12.135554599999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[45.621218629999994, -13.044310083999997], [45.434951978, -14.684021065999998], [45.43777419999999, -16.086665399999998]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[45.44059642199999, -17.407465295999998], [45.615574185999996, -19.12055405], [45.821596392, -19.896665099999996]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[46.030440819999995, -20.672776149999997], [46.600529664, -22.100820482], [47.08877406999999, -23.071664849999998]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[47.644751803999995, -24.17233143], [48.694618387999995, -25.538286877999997], [49.88277384999999, -26.701042341999997]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[51.00601820599999, -27.801708922], [52.482040311999995, -28.902375501999995], [53.48110689999999, -29.387797685999995]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[54.412440159999996, -29.839353206], [55.87435115599999, -30.395330939999997], [56.72666219999999, -30.623930922]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[57.581795465999996, -30.852530903999995], [59.421884209999995, -31.038797556], [60.81888409999999, -31.038797556]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[62.21588398999999, -31.038797556], [64.05879495599999, -30.852530903999995], [64.91110599999999, -30.623930922]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[65.766239266, -30.395330939999997], [67.22532804, -29.833708761999993], [68.1566613, -29.376508797999996]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[69.08799456, -28.916486611999996], [70.61199443999999, -27.838397807999996], [71.54332769999999, -26.974797875999997]], segments }, cag111)
  cag111 = path2.appendPoints([[73.23666089999999, -25.405642443999998]], cag111)
  cag111 = path2.appendPoints([[72.10777209999999, -24.417864743999996]], cag111)
  cag111 = path2.appendBezier({ controlPoints: [[71.48688326, -23.875998119999995], [70.85188330999999, -23.435731488], [70.69666109999999, -23.438553709999997]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[70.54143889, -23.441375932], [69.844350056, -23.988887], [69.14443899999999, -24.657753613999997]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[68.44735016599999, -25.323798005999997], [67.33539469799999, -26.145064608], [66.67499475, -26.480909025999996]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[66.01459480199999, -26.819575666], [64.74459490199999, -27.285242296], [63.85277274999999, -27.519486722]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[62.960950598, -27.750908925999997], [61.594995149999995, -27.942820022], [60.81888409999999, -27.942820022]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[60.042773049999994, -27.942820022], [58.67681760199999, -27.750908925999997], [57.78499545, -27.519486722]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[56.893173297999994, -27.285242296], [55.62317339799999, -26.819575666], [54.96277344999999, -26.483731247999998]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[54.302373501999995, -26.147886829999997], [53.085995819999994, -25.227842457999998], [52.259084773999994, -24.437620298]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[51.432173727999995, -23.647398138], [50.441573805999994, -22.428198233999996], [50.057751614, -21.731109399999998]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[49.671107199999994, -21.034020566], [49.157462796, -19.764020665999997], [48.911929482, -18.908887399999998]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[48.593018396, -17.802576375999998], [48.51399618, -16.74988757], [48.629707282, -15.239998799999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[48.762351716, -13.543843377999998], [49.00788503, -12.708465665999999], [49.86866273999999, -11.032065798]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[50.55728490799999, -9.691510348], [51.44628483799999, -8.486421554], [52.352218099999995, -7.673621617999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[53.12832914999999, -6.976532783999999], [54.52532903999999, -6.042377301999999], [55.45666229999999, -5.599288447999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[56.38799556, -5.156199593999999], [58.03899542999999, -4.648199633999999], [59.12555089999999, -4.470399648]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[60.65237300199999, -4.219221889999999], [61.51879515599999, -4.224866334], [62.93555059999999, -4.492977423999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[63.945906076, -4.68488852], [65.40499485, -5.142088483999999], [66.18110589999999, -5.506155122]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[66.95721694999999, -5.873043981999999], [68.196172408, -6.688666139999999], [68.93277235, -7.318021645999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[69.66937229199999, -7.950199373999999], [70.369283348, -8.461021555999999], [70.48499444999999, -8.455377111999999]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[70.600705552, -8.449732668], [71.173616618, -8.003821592], [71.75499434999999, -7.467599411999999]], segments }, cag111)
  cag111 = path2.appendPoints([[72.8133276, -6.491110599999999]], cag111)
  cag111 = path2.appendPoints([[71.33166105, -5.125155152]], cag111)
  cag111 = path2.appendBezier({ controlPoints: [[70.516038892, -4.3744441], [69.279905656, -3.4656886159999996], [68.57999459999999, -3.1100886439999997]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[67.882905766, -2.7516664499999997], [66.61290586599999, -2.2126220479999996], [65.7577726, -1.913466516]], segments }, cag111)
  cag111 = path2.appendBezier({ controlPoints: [[64.81797267399999, -1.5860887639999999], [63.14721724999999, -1.3207998959999998], [61.524439599999994, -1.2474221239999999]], segments }, cag111)
  cag111 = path2.close(cag111)
  cag111 = geom2.fromPoints(path2.toPoints(cag111))
  // J
  let cag121 = path2.fromPoints({}, [[20.1788873, -1.9755553999999997]])
  cag121 = path2.appendPoints([[18.626665199999998, -1.9755553999999997]], cag121)
  cag121 = path2.appendPoints([[18.55610965, -11.92388795]], cag121)
  cag121 = path2.appendPoints([[18.485554099999998, -21.872220499999997]], cag121)
  cag121 = path2.appendPoints([[17.748954157999997, -23.2833315]], cag121)
  cag121 = path2.appendBezier({ controlPoints: [[17.345376411999997, -24.059442549999996], [16.456376482, -25.174220239999997], [15.773398757999999, -25.758420193999996]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[15.093243255999997, -26.342620147999998], [13.964354455999997, -27.011486761999997], [13.2644434, -27.242908965999998]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[12.567354565999999, -27.474331169999996], [11.548532424, -27.663420043999995], [11.006665799999999, -27.660597822]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[10.464799175999998, -27.657775599999997], [9.572977024, -27.530775609999996], [9.0311104, -27.381197843999995]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[8.489243775999999, -27.231620077999995], [7.439377191999999, -26.723620117999996], [6.70277725, -26.255131265999996]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[5.966177308, -25.783820191999997], [5.10822182, -24.956909146], [4.797777399999999, -24.412220299999998]], segments }, cag121)
  cag121 = path2.appendPoints([[4.233332999999999, -23.4244426]], cag121)
  cag121 = path2.appendPoints([[2.8222219999999996, -24.129998099999998]], cag121)
  cag121 = path2.appendBezier({ controlPoints: [[2.0461109499999997, -24.519464735999996], [1.408288778, -24.931509148], [1.4026443339999999, -25.04722025]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[1.3998221119999998, -25.162931351999998], [1.7554220839999997, -25.766886859999996], [2.1985109379999996, -26.3877757]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[2.6415997919999996, -27.008664539999998], [3.4374663959999996, -27.886375582], [3.9708663539999995, -28.337931101999995]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[4.5042663119999995, -28.789486622], [5.6387995559999995, -29.489397677999996], [6.491110599999999, -29.890153201999997]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[7.837310493999999, -30.525153151999994], [8.415866004, -30.621108699999997], [10.865554699999999, -30.621108699999997]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[13.447887829999997, -30.621108699999997], [13.842998909999999, -30.544908705999998], [15.522220999999998, -29.737753213999998]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[16.532576476, -29.255153251999996], [17.90699859, -28.301242216], [18.575865203999996, -27.621086713999997]], segments }, cag121)
  cag121 = path2.appendBezier({ controlPoints: [[19.247554039999997, -26.943753433999998], [20.201465075999998, -25.566509097999997], [20.692531703999997, -24.558975843999995]], segments }, cag121)
  cag121 = path2.appendPoints([[21.589998299999998, -22.732998209999998]], cag121)
  cag121 = path2.appendPoints([[21.66055385, -12.352865694]], cag121)
  cag121 = path2.appendPoints([[21.731109399999998, -1.9755553999999997]], cag121)
  cag121 = path2.appendPoints([[20.1788873, -1.9755553999999997]], cag121)
  cag121 = path2.close(cag121)
  cag121 = geom2.fromPoints(path2.toPoints(cag121))
  // A
  let cag131 = path2.fromPoints({}, [[87.84165974999999, -1.972733178]])
  cag131 = path2.appendBezier({ controlPoints: [[87.64692643199999, -1.9755553999999997], [86.50392652199999, -2.9097108819999997], [85.30165994999999, -4.049888569999999]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[84.09939337799999, -5.190066258], [82.45968239599999, -7.0640216659999995], [81.66099357, -8.21266602]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[80.86230474399999, -9.361310374], [79.617704842, -11.509021315999998], [78.89803823199999, -12.982221199999998]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[78.17837162199999, -14.458243305999998], [77.28090502599999, -16.67933202], [76.90837172199998, -17.9211097]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[76.53301619599999, -19.16288738], [76.036305124, -21.321887209999996], [75.80488292, -22.718887099999996]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[75.57346071599999, -24.11588699], [75.28277184999999, -26.441397917999996], [75.15577186, -27.889197803999995]], segments }, cag131)
  cag131 = path2.appendPoints([[74.92999409999999, -30.516686485999994]], cag131)
  cag131 = path2.appendPoints([[76.62332729999999, -30.429197603999995]], cag131)
  cag131 = path2.appendPoints([[78.3166605, -30.338886499999997]], cag131)
  cag131 = path2.appendPoints([[78.38721604999999, -28.645553299999996]], cag131)
  cag131 = path2.appendBezier({ controlPoints: [[78.42672715799999, -27.714220039999997], [78.519860484, -26.413175698], [78.59888269999999, -25.752775749999998]], segments }, cag131)
  cag131 = path2.appendPoints([[78.7399938, -24.553331399999998]], cag131)
  cag131 = path2.appendPoints([[87.91221529999999, -24.553331399999998]], cag131)
  cag131 = path2.appendPoints([[97.08443679999999, -24.553331399999998]], cag131)
  cag131 = path2.appendPoints([[97.22272567799999, -25.18833135]], cag131)
  cag131 = path2.appendBezier({ controlPoints: [[97.29610344999999, -25.538286877999997], [97.361014556, -26.269242375999998], [97.361014556, -26.811109]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[97.361014556, -27.355797845999998], [97.45979232599998, -28.402842207999996], [97.57550342799999, -29.145086593999995]], segments }, cag131)
  cag131 = path2.appendPoints([[97.7899923, -30.488464265999998]], cag131)
  cag131 = path2.appendPoints([[99.34221439999999, -30.485642043999995]], cag131)
  cag131 = path2.appendPoints([[100.89443649999998, -30.485642043999995]], cag131)
  cag131 = path2.appendPoints([[100.67712540599999, -27.731153371999998]], cag131)
  cag131 = path2.appendBezier({ controlPoints: [[100.55859208199999, -26.215620157999997], [100.163481002, -23.517575925999996], [99.80223658599999, -21.731109399999998]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[99.44099217, -19.947465096], [98.60843667999998, -17.153465316], [97.95085895399998, -15.522220999999998]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[97.29610344999999, -13.890976683999998], [96.274459086, -11.734799075999998], [95.684614688, -10.724443599999999]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[95.09477028999999, -9.714088124], [93.86145927599999, -7.938910485999999], [92.93859268199999, -6.7733327999999995]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[92.01854831, -5.6105773359999995], [90.573570646, -4.052710791999999], [89.729726268, -3.3132886279999996]], segments }, cag131)
  cag131 = path2.appendBezier({ controlPoints: [[88.88588189, -2.576688686], [88.036393068, -1.972733178], [87.84165974999999, -1.972733178]], segments }, cag131)
  cag131 = path2.close(cag131)
  cag131 = geom2.fromPoints(path2.toPoints(cag131))
  // D
  let cag141 = path2.fromPoints({}, [[110.13721354999998, -1.9755553999999997]])
  cag141 = path2.appendPoints([[103.01110299999999, -1.9755553999999997]], cag141)
  cag141 = path2.appendPoints([[103.01110299999999, -16.227776499999997]], cag141)
  cag141 = path2.appendPoints([[103.01110299999999, -30.479997599999997]], cag141)
  cag141 = path2.appendPoints([[109.71388024999999, -30.474353156]], cag141)
  cag141 = path2.appendBezier({ controlPoints: [[114.52576875999999, -30.471530933999997], [116.972635234, -30.352997609999996], [118.39221289999999, -30.053842077999995]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[119.47876837, -29.825242096], [121.12976823999999, -29.26644214], [122.06110149999999, -28.814886619999996]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[122.99243476, -28.366153322], [124.454345756, -27.367086733999997], [125.30665679999998, -26.599442349999997]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[126.16461228799999, -25.828975743999997], [127.26245664599999, -24.457375851999995], [127.75916771799999, -23.53733148]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[128.25587879, -22.622931551999997], [128.837256522, -21.11022056], [129.05456761599999, -20.1788873]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[129.27187870999998, -19.247554039999997], [129.480723138, -17.596554169999997], [129.514589802, -16.509998699999997]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[129.551278688, -15.423443229999998], [129.373478702, -13.645443369999999], [129.119478722, -12.558887899999998]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[128.86830096399999, -11.472332429999998], [128.25587879, -9.838265891999999], [127.75916771799999, -8.923865963999999]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[127.26527886799998, -8.012288258], [126.22387894999999, -6.671732808], [125.44776789999999, -5.943599531999999]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[124.67165684999999, -5.215466255999999], [123.46656805599999, -4.286955217999999], [122.76665699999998, -3.8805552499999996]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[122.06956816599998, -3.474155282], [120.54556828599999, -2.8786664399999995], [119.37999059999999, -2.5569331319999997]], segments }, cag141)
  cag141 = path2.appendBezier({ controlPoints: [[117.50039074799999, -2.0376442839999998], [116.47027971799999, -1.972733178], [110.13721354999998, -1.9755553999999997]], segments }, cag141)
  cag141 = path2.close(cag141)
  cag141 = geom2.fromPoints(path2.toPoints(cag141))
  // D inner
  let cag151 = path2.fromPoints({}, [[111.12499125, -5.082821822]])
  cag151 = path2.appendBezier({ controlPoints: [[114.56245764599998, -5.0856440439999995], [116.68759081199998, -5.2211107], [117.89832404999999, -5.506155122]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[118.86916841799999, -5.7375773259999985], [120.17021275999998, -6.180666179999999], [120.79110159999999, -6.491110599999999]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[121.41199043999998, -6.8015550199999995], [122.50136813199998, -7.594599401999999], [123.21256807599998, -8.254999349999999]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[123.92376802, -8.915399297999999], [124.807123506, -10.08944365], [125.17683458799999, -10.865554699999999]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[125.54936789199999, -11.64166575], [125.989634524, -13.165665629999998], [126.15614562199998, -14.252221099999998]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[126.37910115999999, -15.683087653999998], [126.376278938, -16.772465345999997], [126.15050117799998, -18.2033319]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[125.96141230399998, -19.40277625], [125.48445678599998, -20.833642803999997], [124.93694571799999, -21.846820501999996]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[124.44305686799999, -22.761220429999998], [123.52865693999999, -23.943731447999998], [122.90776809999998, -24.468664739999998]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[122.28687925999999, -24.993598031999998], [121.27087933999998, -25.670931311999997], [120.64999049999999, -25.972909065999996]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[120.02910166, -26.274886819999995], [118.63210176999999, -26.709509007999998], [117.54554629999998, -26.943753433999998]], segments }, cag151)
  cag151 = path2.appendBezier({ controlPoints: [[116.24450195799999, -27.22033119], [113.95567991599998, -27.367086733999997], [110.84276904999999, -27.369908956]], segments }, cag151)
  cag151 = path2.appendPoints([[106.1155472, -27.375553399999998]], cag151)
  cag151 = path2.appendPoints([[106.1155472, -16.227776499999997]], cag151)
  cag151 = path2.appendPoints([[106.1155472, -5.0799996]], cag151)
  cag151 = path2.appendPoints([[111.12499125, -5.082821822]], cag151)
  cag151 = path2.close(cag151)
  cag151 = path2.reverse(cag151)
  cag151 = geom2.fromPoints(path2.toPoints(cag151))
  // A inner
  let cag161 = path2.fromPoints({}, [[87.84165974999999, -6.208888399999999]])
  cag161 = path2.appendBezier({ controlPoints: [[88.036393068, -6.208888399999999], [88.71372634799998, -6.812843908], [89.34590407599998, -7.549443849999999]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[89.97808180399998, -8.286043792], [90.94892617199999, -9.524999249999999], [91.502081684, -10.3011103]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[92.052414974, -11.077221349999999], [93.045837118, -12.793132325999998], [93.70623706599999, -14.111109999999998]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[94.36663701399999, -15.431909895999999], [95.20765917, -17.398998629999998], [95.57454802999999, -18.485554099999998]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[95.94425911199998, -19.572109569999995], [96.24341464399998, -20.684065038], [96.24059242199999, -20.954998349999997]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[96.23777019999999, -21.415020535999997], [95.650748024, -21.448887199999998], [87.91221529999999, -21.448887199999998]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[83.33174899399998, -21.448887199999998], [79.533038182, -21.352931651999995], [79.47094929799998, -21.237220549999996]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[79.406038192, -21.121509447999998], [79.702371502, -19.947465096], [80.128527024, -18.626665199999998]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[80.55750476799999, -17.308687525999996], [81.38723803599999, -15.276687685999999], [81.977082434, -14.111109999999998]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[82.566926832, -12.948354536], [83.52648231199998, -11.297354665999999], [84.10786004399999, -10.4422214]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[84.68923777599998, -9.589910355999999], [85.68830436399999, -8.286043792], [86.32612653599999, -7.549443849999999]], segments }, cag161)
  cag161 = path2.appendBezier({ controlPoints: [[86.96677092999998, -6.812843908], [87.64692643199999, -6.208888399999999], [87.84165974999999, -6.208888399999999]], segments }, cag161)
  cag161 = path2.close(cag161)
  cag161 = path2.reverse(cag161)
  cag161 = geom2.fromPoints(path2.toPoints(cag161))

  let cag0 = union(cag101, cag111, cag121, cag131, cag141)
  cag0 = subtract(cag0, cag151, cag161)
  return cag0
}

module.exports = { main, getParameterDefinitions }
