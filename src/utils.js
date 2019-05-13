export const generatePermutate = (arr, set, len, duplicate=false) => 
  set.reduce((acc, v, i, a, n, nArr=[...arr, v])=> 
    !duplicate && arr.includes(v) ? acc : nArr.length===len ? [...acc, nArr] : [...acc, ...generatePermutate(nArr, set, len, duplicate)]
  , []);

export const split = (arr, len) => arr.length<=len ? [arr] : [arr.slice(0, len), ...split(arr.slice(len), len)];

export const row = (num, arr, reverse, r=[...arr[num]]) => !reverse ? r : r.reverse();

export const col = (num, arr, reverse, r=[...arr.map(r=>r[num])]) => !reverse ? r : r.reverse();

export const unique = arr => [...new Set(arr)];

export const duplicate = arr => unique(arr).length!=arr.length;

export const equal = (a1,a2) => a1.every((v,i)=>a1[i]===a2[i]);

export const equalIgnoreZero = (a1,a2) => a1.every((v,i)=>!(a1[i]*a2[i]) || a1[i]===a2[i]);

export const interSection = (a1,a2) => a1.filter(v=>a2.includes(v));

export const setDifferent = (a1,a2) => a1.filter(v=>!a2.includes(v));

export const time = fn => {
  let t1=(new Date).getTime();
  fn();
  let t2=(new Date).getTime();
  console.log(`time to run : ${(t2-t1)/1000} s`);
}