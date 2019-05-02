const generatePermutate = (arr, set, len, duplicate=false) => 
  set.reduce((acc, v, i, a, n, nArr=[...arr, v])=> 
    !duplicate && arr.includes(v) ? acc : nArr.length===len ? [...acc, nArr] : [...acc, ...generatePermutate(nArr, set, len, duplicate)]
  , []);

const split = (arr, len) => arr.length<=len ? [arr] : [arr.slice(0, len), ...split(arr.slice(len), len)];

const row = (num, arr, reverse, r=[...arr[num]]) => !reverse ? r : r.reverse();

const col = (num, arr, reverse, r=[...arr.map(r=>r[num])]) => !reverse ? r : r.reverse();

const unique = arr => [...new Set(arr)];

const duplicate = arr => unique(arr).length!=arr.length;