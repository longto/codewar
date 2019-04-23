var clues = 
[ 3, 2, 2, 3, 2, 1,
1, 2, 3, 3, 2, 2,
5, 1, 2, 2, 4, 3,
3, 2, 1, 2, 2, 4];

var expected = [
[ 2, 1, 4, 3, 5, 6],
[ 1, 6, 3, 2, 4, 5],
[ 4, 3, 6, 5, 1, 2],
[ 6, 5, 2, 1, 3, 4],
[ 5, 4, 1, 6, 2, 3],
[ 3, 2, 5, 4, 6, 1]
];

const split = (arr, len) => arr.length<len ? arr : [arr.slice(0, len), ...split(arr.slice(len), len)];
const row = (num, arr, reverse, r=[...arr[num]]) => !reverse ? r : r.reverse();
const col = (num, arr, reverse, r=[...arr.map(r=>r[num])]) => !reverse ? r : r.reverse();
const unique = arr => [...new Set(arr)];
const duplicate = arr => unique(arr).length!=arr.length;
const duplicateCol = arr => {
  for(let i=0;i<6;i++) {
    if (duplicate(col(i, arr).filter(v=>v))) return true;
  }
  return false;
}
const calc = (arr, reverse, tmp=!reverse?[...arr]:[...arr].reverse()) => tmp.reduce((acc, val) => ({ 
  count: acc.count + (val>acc.max?1:0),
  max: Math.max(acc.max, val)
}), {count:0, max: 0}).count;
const checkCol = (arr, c1, c2) => {
  for(let i=0;i<6;i++) {
    if (calc(col(i, arr)) !== c1[i]) return false;
    if (calc(col(i, arr, true)) !== c2[i]) return false;
  }
  return true;
}
const checkColexceed = (arr, c1, c2) => {

}

const getClues = arr => {
  let [r1,r2,c1,c2] = [[],[],[],[]];
  for(let i=0;i<6;i++) {
    r1.push(calc(row(i, arr)));
    r2.push(calc(row(i, arr, true)));
    c1.push(calc(col(i, arr)));
    c2.push(calc(col(i, arr, true)));
  }
  return [...c1, ...r2, ...c2.reverse(), ...r1.reverse()];
}

const possible = {};
const generate = arr =>{
  if (arr.length>=6) {
    const num = calc(arr);
    possible[num] = [...(possible[num]||[]), arr];
    return;
  }
  for(let i=1; i<=6; i++) {
    if (!arr.includes(i)) 
      generate([...arr, i])
  }
}
generate([]);
//console.log(possible);

export function solvePuzzle(clues) {
  let [c1, r2, c2, r1] = split(clues, 6);
  r1 = r1.reverse();
  c2 = c2.reverse();
  let found = false;
  result = [...Array(6)].map(v=> [...Array(6)].fill(0));
  const canFillRow = (r, arr) => result[r].every((v,inx)=> !v || v===arr[inx]);
  const canFillCol = (c, arr) => result.map(row=>row[c]).every((v,inx)=> !v || v===arr[inx]);
  const fillRow = (r, arr) => {
    arr.map((v, c)=>result[r][c]=v);
    return arr;
  }
  const fillCol = (c, arr) => {
    arr.map((v, r)=>result[r][c]=v);
    return arr; 
  }
  for(let i=0;i<6;i++) {
    if(r1[i]===1) result[i][0] = 6;
    if(r2[i]===1) result[i][5] = 6;
    if(c1[i]===1) result[0][i] = 6;
    if(c2[i]===1) result[5][i] = 6;
    if(r1[i]===6) fillRow(i, [1,2,3,4,5,6]);
    if(r2[i]===6) fillRow(i, [6,5,4,3,2,1]);
    if(c1[i]===6) fillCol(i, [1,2,3,4,5,6]);
    if(c2[i]===6) fillCol(i, [6,5,4,3,2,1]);
  }
  //console.log(result);

  const rowPossible = {};
  let rowOrder = [];
  for(let i=0;i<6;i++) {
    const val=r1[i], rVal=r2[i], range=possible[val];
    rowPossible[i] = range.filter(arr=> canFillRow(i, arr) && calc(arr, true)===rVal)
    rowOrder.push({i, l: rowPossible[i].length})
  }

  //console.log(rowPossible);

  rowOrder = rowOrder.sort((a,b)=>a.l-b.l).map(o=>o.i);

  //console.log(rowOrder);

  const buildSolution = step => {
    if (step>=6 || found) {
      if (checkCol(result, c1,c2)) {
        found = true;
      }
      return;
    }
    const r = rowOrder[step];
    const range = rowPossible[r];
    let old = row(r, result);
    for(let i=0;i<range.length;i++) {
      fillRow(r, range[i]);
      if (found) return;
      if (!duplicateCol(result)) {
        buildSolution(step+1);  
      }
      fillRow(r, old);
    }
  }
  buildSolution(0);
  console.log(result);
  console.log(getClues(result));
  console.log(clues);
  return !found ? 0 : result;
}

solvePuzzle(clues);



//https://www.codewars.com/kata/5679d5a3f2272011d700000d/train/javascript