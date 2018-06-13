const fse = require('fs-extra');
const bitCount = 32
const subBitCount = bitCount-1
const bitCountSquare = Math.pow(bitCount, 2)
const shiftCountsCandidate = []
for (let x=1; x<bitCount; x++) {
  for (let y=1; y<bitCount; y++) {
    for (let z=1; z<bitCount; z++) {
      shiftCountsCandidate.push([x,y,z])
    }
  }
}
//
// fse.writeFile('shiftCountsCandidate.json', JSON.stringify(shiftCountsCandidate), function (err) {
//   console.log(err);
// })


// const goal = Math.pow(2, bitCount*2) - 1
// const searchTarget = [3, 5, 17, 257]
// let factor = 258
// let tmpGoal = 844437815230467
// while (factor <= tmpGoal) {
//   if (tmpGoal % factor == 0) {
//     let valid = true
//     for (let already of searchTarget)
//       if (factor % already == 0) {
//         valid = false
//         tmpGoal *= already
//       }
//     tmpGoal /= factor
//     if (valid)
//       searchTarget.push(factor)
//   }
//   factor++
// }
// console.log(searchTarget);
// const searchTarget = [1, 3, 5, 17, 257, 641, 65537, 6700417]
//       1  : 18446744073709551615 : 1111111111111111111111111111111111111111111111111111111111111111
//       3  :  6148914691236517205 :  101010101010101010101010101010101010101010101010101010101010101
//       5  :  3689348814741910323 :   11001100110011001100110011001100110011001100110011001100110011
//      17  :  1085102592571150095 :     111100001111000011110000111100001111000011110000111100001111
//     257  :    71777214294589695 :         11111111000000001111111100000000111111110000000011111111
//     641  :    28778071877862015 :          1100110001111011000000011111111100110011100001001111111
//   65537  :      281470681808895 :                 111111111111111100000000000000001111111111111111
// 6700417  :        2753074036095 :                       101000000011111111111111111111110101111111
// const searchTarget = [
//   "1111111111111111111111111111111111111111111111111111111111111111"
//   "101010101010101010101010101010101010101010101010101010101010101",
//   "11001100110011001100110011001100110011001100110011001100110011",
//   "111100001111000011110000111100001111000011110000111100001111",
//   "11111111000000001111111100000000111111110000000011111111",
//   "1100110001111011000000011111111100110011100001001111111",
//   "111111111111111100000000000000001111111111111111",
//   "101000000011111111111111111111110101111111",
// ]
// for (let n in searchTarget) {
//   const target = Array.from(searchTarget[n])
//   searchTarget[n] = []
//   let bitPosition = 0
//   while(target.length) {
//     if (target.pop() === '1')
//       searchTarget[n].push(bitPosition)
//     bitPosition++
//   }
// }
// console.log(JSON.stringify(searchTarget));

const searchTarget = JSON.parse('[[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63],[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62],[0,1,4,5,8,9,12,13,16,17,20,21,24,25,28,29,32,33,36,37,40,41,44,45,48,49,52,53,56,57,60,61],[0,1,2,3,8,9,10,11,16,17,18,19,24,25,26,27,32,33,34,35,40,41,42,43,48,49,50,51,56,57,58,59],[0,1,2,3,4,5,6,7,16,17,18,19,20,21,22,23,32,33,34,35,36,37,38,39,48,49,50,51,52,53,54,55],[0,1,2,3,4,5,6,9,14,15,16,19,20,23,24,25,26,27,28,29,30,31,39,40,42,43,44,45,49,50,53,54],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],[0,1,2,3,4,5,6,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,39,41]]')



function printBitMatrix(a) {
  for (let b of a)
    console.log((b<0?'1':'0')+('00000000000000000000000000000000'+(b & ~(1<<31)).toString(2)).slice(-31))
  console.log('\n')
}

const container = []
container.length = bitCount
function printBit3AxisMatrix(t) {
  container.fill('')
  for (let a of t) for (let i in a)
    container[i] += " " + (a[i]<0?'1':'0')+('00000000000000000000000000000000'+(a[i] & ~(1<<31)).toString(2)).slice(-31)
  console.log(container.join('\n'))
  console.log('\n')
}



function flip (out, a) {
  let aisRow = a.isRow
  if (Array.isArray(out) && Array.isArray(a) && (a = Array.from(a)) && a.length == bitCount) {
    out.length = bitCount
    out.fill(0)
    out.isRow = !aisRow
    let n, m
    for (n=0; n<bitCount; n++) for (m=0; m<bitCount; m++)
      out[n] |= (a[m] & (1 << (subBitCount - n)) ? 1 : 0) << (subBitCount - m)
    return out
  }
}


function create() {
  const item = []
  item.length = bitCount
  item.fill(0)
  item.isRow = true
  return item
}


function integrate(a) {
  if (isNaN(a))
    return 0
  else {
    let out = 1 & a
    while (a)
      out ^= 1 & (a = a >>> 1)
    return out
  }
}


function mul (out, a, b) {
  let aisRow = a.isRow
  let bisRow = b.isRow
  if (
    Array.isArray(out) &&
    Array.isArray(a) && (a = Array.from(a)) && a.length == bitCount &&
    Array.isArray(b) && (b = Array.from(b)) && b.length == bitCount
  ) {
    if (!(a.isRow = aisRow)) flip(a,a)
    if ( (b.isRow = bisRow)) flip(b,b)
    out.length = bitCount
    out.fill(0)
    out.isRow = true
    let n, m
    for (n=0; n<bitCount; n++) for (m=0; m<bitCount; m++)
      out[n] |= integrate(a[n] & b[m]) << (subBitCount - m)
    return out
  }
}


function add(out, a, b) {
  let aisRow = a.isRow
  let bisRow = b.isRow
  if (
    Array.isArray(out) &&
    Array.isArray(a) && (a = Array.from(a)) &&
    Array.isArray(b) && (b = Array.from(b)) && a.length == b.length
  ) {
    if (!(a.isRow = aisRow)) flip(a,a)
    if (!(b.isRow = bisRow)) flip(b,b)
    out.length = bitCount
    out.fill(0)
    out.isRow = true
    for (let n=0; n<a.length; n++)
      out[n] = a[n] ^ b[n]
    return out
  }
}


function initialize(a) {
  a.length = bitCount
  a.isRow = true
  for (let n=0; n<bitCount; n++)
    a[n] = 1 << (subBitCount - n)
  return a
}


function createShift(shift = 0) {
  shift = Math.min(Math.max(shift, -subBitCount), subBitCount)
  const item = []
  item.length = bitCount
  item.isRow = true
  for (let n=0; n<bitCount; n++)
    item[n] = 1 << (subBitCount - n)
  if (shift > 0)
    for (let n=0; n<bitCount; n++)
      item[n] = item[n] >>> shift
  else
    for (let n=0; n<bitCount; n++)
      item[n] = item[n] << -shift
  return item
}

function getIsRow3AxisMatrixItems(a) {
  const isRow = []
  if (Array.isArray(a) && a.length == 4)
    for (const item of a)
      isRow.push(item.isRow)
  return isRow
}

const multiplyOrder = []
for (let n=0; n<2; n++) for (let m=0; m<2; m++) {
  multiplyOrder.push([2*n,   m, 2*n+1,   m+2])
  console.log((2*n+m) + ':' + JSON.stringify(multiplyOrder[2*n + m]))
}
const MO = multiplyOrder
const tmp1 = create()
const tmp2 = create()
function mul3AxisMatrix(out, a, b) {
  const aisRow = getIsRow3AxisMatrixItems(a)
  const bisRow = getIsRow3AxisMatrixItems(b)
  if (
    Array.isArray(out) &&
    Array.isArray(a) && (a = JSON.parse(JSON.stringify(a))) && a.length == 4 &&
    Array.isArray(b) && (b = JSON.parse(JSON.stringify(b))) && b.length == 4
  ) {
    for (let i in a)
      a[i].isRow = aisRow[i]
    for (let i in b)
      b[i].isRow = bisRow[i]
    for (let i=0; i<4; i++)
      add(out[i], mul(tmp1, a[MO[i][0]], b[MO[i][1]]), mul(tmp2, a[MO[i][2]], b[MO[i][3]]) )
    return out
  }
}

function squaring3AxisMatrix(out, a) {
  return mul3AxisMatrix(out, a, a)
}


const I = initialize(create())
const Zero = create()
const I3Axis = [
  Array.from(I), Zero,
  Zero         , Array.from(I),
]
const I3AxisStr = JSON.stringify(I3Axis)
const X = create()
const Y = create()
const Z = create()
const YX = create()

function randomTest(xyz) {
  if (Array.isArray(xyz) && !isNaN(xyz[0]) && !isNaN(xyz[1]) && !isNaN(xyz[2])) {
    const x = xyz[0]
    const y = xyz[1]
    const z = xyz[2]
    add(X, createShift( x), I)
    add(Y, createShift(-y), I)
    add(Z, createShift(-z), I)
    mul(YX, Y, X)
    const T = [
      Array.from(Zero), Array.from(I),
      YX              , Z
    ]
    const T2N = [T]
    for (let n=1; n<64; n++)
      T2N[n] = squaring3AxisMatrix(JSON.parse(I3AxisStr), T2N[n-1])
    for (const target of searchTarget) {
      target.result = JSON.parse(I3AxisStr)
      for (let i of target)
        mul3AxisMatrix(target.result, T2N[i], target.result)
      target.isI = (JSON.stringify(target.result) === I3AxisStr)
    }
  }
  return searchTarget
}

// const output = []
// const randomTestResult = require('./randomTestResult.json');
// for (const XYZ of randomTestResult) {
//   const result = []
//   const testResult = randomTest(XYZ)
//   for (const target of testResult) {
//     result.push(target.isI)
//   }
//   console.log(result);
//   output.push(XYZ)
// }

// const output = []
// for (const XYZ of shiftCountsCandidate) {
//   const testResult = randomTest(XYZ)
//   if (testResult[0].isI) {
//     const result = []
//     let valid = true
//     for (let i=1; i<testResult.length; i++)
//       if (testResult[i].isI) {
//         valid = false
//         break
//       }
//     if (valid) {
//       output.push( JSON.stringify(XYZ) )
//       console.log( JSON.stringify(XYZ) )
//     }
//   }
// }


// fse.writeFile('randomTestResult.json', JSON.stringify(output), function (err) {
//   console.log(err);
// })

// add(X, createShift(8), I)
// add(Y, createShift(-9), I)
// add(Z, createShift(-23), I)
//
// mul(YX, Y, X)
// mul(YX, X, Y)
// printBit3AxisMatrix([Y,X,YX,Zero])
// printBitMatrix(add(create(),YX,X))
// printBitMatrix(X)
// printBitMatrix(Y)
// printBitMatrix(Z)
// printBitMatrix(YX)
// printBitMatrix(flip(YX,YX))
