const zero = {r:0, c:0};
const same = (p1,p2, x=p1.c-p2.c, y=p1.r-p2.r) => p1.c===p2.c  && p1.r===p2.r;
const sameCol = (...points) => points.every((p, inx, arr) => p.c===arr[0].c);
const sameRow = (...points) => points.every((p, inx, arr) => p.r===arr[0].r);
const vector = (p1, p2) => ({r: p2.r-p1.r, c:p2.c-p1.c});
const vectorSum = (v1, v2) => ({r: v1.r+v2.r, c: v1.c+v2.c});
const vectorMultiple = (v1, v2) => ({r: v1.r*v2.r, c:v1.c*v2.c});

export function breakPieces (shape){
  console.log(shape);
  const rendering = shape.split('\n');
  
  const hasConnect = (p1, p2) => {
    if (!sameCol(p1, p2) && !sameRow(p1, p2) || same(p1, p2)) return false;
    let between;
    if (p1.r === p2.r) {
      between = rendering[p1.r].split('')
      .filter((v, inx)=> inx>=Math.min(p1.c, p2.c) && inx <=Math.max(p1.c, p2.c))
    } else if (p1.c === p2.c) {
      between = rendering.map(r=>r[p1.c])
      .filter((v, inx)=> inx>=Math.min(p1.r, p2.r) && inx <=Math.max(p1.r, p2.r))
    }
    return between.every(v=>['+','|','-'].includes(v));
  }

  const listPoints = rendering.reduce((acc, layer, r) => [
     ...acc,
     ...layer.split('')
        .map((val, c) => val === '+' ? c : '')
        .filter(String)
        .map(c=>({r, c}))
    ],[])
  .map((p, index)=>({...p, index}));

  const connectMap = listPoints.map((p, index)=> ({...p, index}) )
    .reduce((acc, p, index, arr)=> ({...acc,
          [p.index]: arr.filter(p1=>hasConnect(p,p1)).map(p=>p.index)
      }), {});

  const recUsed = {};
  console.log(rendering);
  console.log(listPoints);
  console.log(connectMap);
  
  const recVector = (indexes) => indexes
    .map(i=>listPoints[i])
    .reduce((acc, p1, inx, arr, p2=arr[inx+1===arr.length?0:inx+1]) => ({
        r: acc.r+p2.r-p1.r,
        c: acc.c+p2.c-p1.c
    }), {...zero});
  const recConnect = (indexes) => indexes
    .every((i, inx, arr, j=arr[inx+1===arr.length?0:inx+1]) => connectMap[i].includes(j));
  const recDiffDirection = (indexes) => {
    return indexes.length<3 ? false : indexes
      .map(i=>listPoints[i])
      .map((p1, inx, arr, p2=arr[inx+1===arr.length?0:inx+1]) => vector(p1, p2))
      .map((v1, inx, arr, v2=arr[inx+1===arr.length?0:inx+1]) => vectorMultiple(v1,v2))
      .every(v => same(v, zero));
  }
  const recNewDirection = (indexes) => {
    if (indexes.length<3) return true;
    const [p1,p2,p3] = indexes.map(i=>listPoints[i]).slice(-3);
    return same(vectorMultiple(vector(p1,p2), vector(p2,p3)), zero);
  }
  const recClose = (indexes) => recConnect(indexes) && recDiffDirection(indexes) && same(recVector(indexes), zero);
  const recVarians = (indexes, rIndexes=[...indexes].reverse(), min=Math.min(...indexes), inx=indexes.indexOf(min), rInx=rIndexes.indexOf(min) ) => {
    let m1 = [...indexes.slice(inx), ...indexes.slice(0,inx)].join(',');
    let m2 = [...rIndexes.slice(rInx), ...rIndexes.slice(0,rInx)].join(',');
    return [m1, m2]
  }
  const recCheck = (indexes, [m1,m2]=recVarians(indexes)) => recUsed[m1] || recUsed[m2];
  const recMark = (indexes, [m1,m2]=recVarians(indexes)) => recUsed[m1] = true;
  const recBound = (indexes) => indexes.map(i=>listPoints[i]).reduce((acc, p)=>({
    rMin: Math.min(acc.rMin, p.r),
    rMax: Math.max(acc.rMax, p.r),
    cMin: Math.min(acc.cMin, p.c),
    cMax: Math.max(acc.cMax, p.c),
  }), {rMin:Infinity, cMin:Infinity, rMax:-Infinity, cMax:-Infinity});
  const includes = (indexes1, indexes2, b1=recBound(indexes1), b2=recBound(indexes2)) => b1.rMin<=b2.rMin && b1.rMax>=b2.rMax && b1.cMin<=b2.cMin && b1.cMax>=b2.cMax;
  const recDraw = (indexes) => {
    const {rMin, cMin, rMax, cMax} = recBound(indexes);
    const screen = [...Array(rMax+1)].map(x=>Array(cMax+1).fill(' '))
    const drawLine = (p1,p2) => {
      if (p1.c===p2.c) {
        for(let r=Math.min(p1.r,p2.r)+1;r<Math.max(p1.r,p2.r);r++) 
          screen[r][p1.c] = '|';
      }
      if (p1.r===p2.r) {
        for(let c=Math.min(p1.c,p2.c)+1;c<Math.max(p1.c,p2.c);c++) 
          screen[p1.r][c] = '-';
      }
      screen[p1.r][p1.c] = '+';
      screen[p2.r][p2.c] = '+';
    }
    for(let i=0, points = indexes.map(i=>listPoints[i]); i<points.length;i++) {
      drawLine(points[i], points[i+1>=points.length? 0 : i+1]);
    }
    const result = screen.filter((r,inx)=>inx>=rMin).map(r=>r.slice(cMin).join('').replace(/\s+$/g,'')).join('\n');
    //console.log(result);
    return result;
  }
  // console.log(recVector([0,1,4,2]), recClose([0,1,4,2]));
  // console.log(recVector([0,1,4,7]), recClose([0,1,4,7]));
  // console.log(recCheck([0,1,7,5]));
  // console.log(recBound([3,4,7,6]));
  // console.log(recDiffDirection([2,3,4,2]));
  // console.log(recDiffDirection([0,1,4,2]));
  // recDraw([3,4,7,6]);
  const buildRec = points => {
    if (points.length>=4 && points.length%2===0) {
      if (recClose(points) && !recCheck(points)) {
        recMark(points);
        return;
      }
    }
    const cp = connectMap[points.slice(-1)];
    for(let i=0; i<cp.length; i++) {
      if (!points.includes(cp[i]) && recNewDirection([...points, cp[i]])) {
        buildRec([...points, cp[i]])
      }
    }
  }
  for(let i=0; i<listPoints.length;i++) {
    buildRec([i]);
  }
  //console.log(recUsed);
  let allRecs = Object.keys(recUsed).map(val=>val.split(','));
  for(let i=0;i<allRecs.length;i++) {
    console.log(allRecs[i])
    console.log(recDraw(allRecs[i]));
  }
  // console.log(allRecs);
  // console.log(allRecs.map(val=>recDraw(val)));
  const recBan = [];
  for (let i=0;i<allRecs.length;i++)
    for(let j=0;j<allRecs.length;j++)
      if (i!=j && includes(allRecs[i], allRecs[j]))
        recBan.push(i);
  allRecs = allRecs.filter((rec, inx)=>!recBan.includes(inx));
  console.log('>>>>>>>>>>>>>>>');
  console.log(allRecs);
  console.log(allRecs.map(val=>recDraw(val)));
  const recRedraw = allRecs.map(val=>recDraw(val));
  console.log(recRedraw);
  return recRedraw;
}
