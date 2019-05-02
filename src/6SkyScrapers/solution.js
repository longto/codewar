const MAX = 7;
const PRIMARY = [...Array(MAX).fill(0).map((_,i)=>i+1)];
const split = (arr, len) => arr.length<len ? arr : [arr.slice(0, len), ...split(arr.slice(len), len)];
const row = (num, arr, reverse, r=[...arr[num]]) => !reverse ? r : r.reverse();
const col = (num, arr, reverse, r=[...arr.map(r=>r[num])]) => !reverse ? r : r.reverse();
const unique = arr => [...new Set(arr)];
const equal = (a1,a2) => a1.every((v,i)=>a1[i]===a2[i]);
const equalIgnoreZero = (a1,a2) => a1.every((v,i)=>!(a1[i]*a2[i]) || a1[i]===a2[i]);
const duplicate = arr => unique(arr).length!=arr.length;
const duplicateCol = arr => {
  for(let i=0;i<MAX;i++) {
    if (duplicate(col(i, arr).filter(v=>v))) return true;
  }
  return false;
}
const calc = (arr, reverse, tmp=!reverse?[...arr]:[...arr].reverse()) => tmp.reduce((acc, val) => ({ 
  count: acc.count + (val>acc.max?1:0),
  max: Math.max(acc.max, val)
}), {count:0, max: 0}).count;

const getClues = arr => {
  let [r1,r2,c1,c2] = [[],[],[],[]];
  for(let i=0;i<MAX;i++) {
    r1.push(calc(row(i, arr)));
    r2.push(calc(row(i, arr, true)));
    c1.push(calc(col(i, arr)));
    c2.push(calc(col(i, arr, true)));
  }
  return [...c1, ...r2, ...c2.reverse(), ...r1.reverse()];
}

const generatePermutate = (arr, set, len, duplicate=false) => 
  set.reduce((acc, v, i, a, n, nArr=[...arr, v])=> 
    !duplicate && arr.includes(v) ? acc : nArr.length===len ? [...acc, nArr] : [...acc, ...generatePermutate(nArr, set, len, duplicate)]
  , []);

let possible = {};
if (Object.keys(possible).length===0) {
  possible = generatePermutate([], [...PRIMARY], MAX).reduce((acc, val, i, arr, num=calc(val))=>({
    ...acc,
    [num]: [...(acc[num]||[]), val],
    [0]: [...(acc[0]||[]), val],
  }),{})
}

function solvePuzzle(clues) {
  const result = [...Array(MAX)].map(v=> [...Array(MAX)].fill(0));
  const [c1, r2, c2, r1] = split(clues, MAX).map((a,i)=>i<2?a:a.reverse());
  const fillRow = (r, arr) => {
    arr.map((v, c)=>result[r][c]=v);
  }
  const fillCol = (c, arr) => {
    arr.map((v, r)=>result[r][c]=v);
  }
  const canFillCol = (index, arr) => {
    for(let i=0;i<MAX;i++) {
      if (i!==index && row(i, result).filter((v,i)=>i!=index).includes(arr[i])) 
        return false;
    }
    return true;
  }
  const canFillRow = (index, arr) => {
    for(let i=0;i<MAX;i++) {
      if (i!==index && col(i, result).filter((v,i)=>i!=index).includes(arr[i]))
        return false;
    }
    return true;
  }
  for(let i=0;i<MAX;i++) {
    if(r1[i]===1) result[i][0] = MAX;
    if(r2[i]===1) result[i][MAX-1] = MAX;
    if(c1[i]===1) result[0][i] = MAX;
    if(c2[i]===1) result[MAX-1][i] = MAX;
    if(r1[i]===MAX) fillRow(i, [...PRIMARY]);
    if(r2[i]===MAX) fillRow(i, [...PRIMARY].reverse());
    if(c1[i]===MAX) fillCol(i, [...PRIMARY]);
    if(c2[i]===MAX) fillCol(i, [...PRIMARY].reverse());
  }
  let order = [];
  for(let i=0;i<MAX;i++) {   
    order.push({
      index: i,
      type: 'row', 
      range: possible[r1[i]].filter(arr=> equalIgnoreZero(row(i, result), arr) && (r2[i]===0 || calc(arr, true)===r2[i]) )
    },{
      index: i,
      type: 'col', 
      range: possible[c1[i]].filter(arr=> equalIgnoreZero(col(i, result), arr) && (c2[i]===0 || calc(arr, true)===c2[i]) )
    });
  }
  order = order.sort((a,b)=>a.range.length-b.range.length);
  console.log(order);

  let found = false;
  const satisfy = (arr, v1, v2) => {
    if (unique(arr).length<MAX) return false;
    if (v1!=0 && calc(arr)!=v1) return false;
    if (v2!=0 && calc([...arr].reverse())!=v2) return false;
    return true;
  }

  const buildSolution = step => {
    if (step>=order.length || found) {
      if (equalIgnoreZero(getClues(result), clues)) {
        found = true;
      }
      return;
    }
    let {index, type, range} = order[step];
    const old = type==='row' ? row(index, result) : col(index, result);
    const [v1,v2] = type==='row' ? [r1[index], r2[index]] : [c1[index], c2[index]];
    if (!old.includes(0)) {
      if (satisfy(old, v1, v2)) {
        buildSolution(step+1);  
      }
      return;
    }
    const canFill = type==='row' ? canFillRow : canFillCol;
    const fill = type==='row' ? fillRow : fillCol;
    range = range.filter(arr=>equalIgnoreZero(arr, old) && canFill(index, arr));
    for(let i=0;i<range.length;i++) {
      fill(index, range[i]);
      buildSolution(step+1);
      if (found) return;
      fill(index, old);
    }
  }
  buildSolution(0);
  return !found ? 0 : result;
}

/* ----------------------------------------------------- */
var clues1 = 
[ 3, 2, 2, 3, 2, 1,
1, 2, 3, 3, 2, 2,
5, 1, 2, 2, 4, 3,
3, 2, 1, 2, 2, 4];

var expected1 = [
[ 2, 1, 4, 3, 5, 6],
[ 1, 6, 3, 2, 4, 5],
[ 4, 3, 6, 5, 1, 2],
[ 6, 5, 2, 1, 3, 4],
[ 5, 4, 1, 6, 2, 3],
[ 3, 2, 5, 4, 6, 1]
];

var clues2 = [
  7,0,0,0,2,2,3, 
  0,0,3,0,0,0,0,
  3,0,3,0,0,5,0,
  0,0,0,0,5,0,4
];

var expected2 = [
  [1,5,6,7,4,3,2],
  [2,7,4,5,3,1,6],
  [3,4,5,6,7,2,1],
  [4,6,3,1,2,7,5],
  [5,3,1,2,6,4,7],
  [6,2,7,3,1,5,4],
  [7,1,2,4,5,6,3]
];

var clues3 = [
  0,2,3,0,2,0,0,
  5,0,4,5,0,4,0, 
  0,4,2,0,0,0,6, 
  5,2,2,2,2,4,1
];

var expected3 = [
  [7,6,2,1,5,4,3],
  [1,3,5,4,2,7,6],
  [6,5,4,7,3,2,1],
  [5,1,7,6,4,3,2],
  [4,2,1,3,7,6,5],
  [3,7,6,2,1,5,4],
  [2,4,3,5,6,1,7]
];

var clues4= [ 7, 0, 0, 0, 2, 2, 3, 0, 0, 3, 0, 0, 0, 0, 3, 0, 3, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4 ];
var clues5= [ 6, 4, 0, 2, 0, 0, 3, 0, 3, 3, 3, 0, 0, 4, 0, 5, 0, 5, 0, 2, 0, 0, 0, 0, 4, 0, 0, 3 ];

const draw = (arr, clues=getClues(arr), s1='color:#bd5', s2='color:#fff') => {
  const [c1, r2, c2, r1] = split(clues, MAX).map((a,i)=>i<2?a:a.reverse());
  console.log(
    [`   ${c1.join(', ')}   `,
    ...arr.map((r,i)=> `${r1[i]} %c[${r.join(', ')}]%c ${r2[i]}`),
    `   ${c2.join(', ')}   `].join('\n'),
    ...[...Array(2*MAX).fill(0).map((v,i)=>i&1?s2:s1)]
  );
}

export function main() {
  //draw(expected3, clues3);
  let t1,t2, actual;
  t1 = (new Date).getTime();
  actual = solvePuzzle(clues4);
  t2 = (new Date).getTime();
  console.log(`time to run : ${(t2-t1)/1000} s`);
  draw(actual, clues4);
  draw(actual);

  t1 = (new Date).getTime();
  actual = solvePuzzle(clues5);
  t2 = (new Date).getTime();
  console.log(`time to run : ${(t2-t1)/1000} s`);
  draw(actual, clues5);
  draw(actual);
}


//https://www.codewars.com/kata/5679d5a3f2272011d700000d/train/javascript