const cache = {1:1};
const findNearest = n => {
  const min = Math.min(...Object.keys(cache).map(v=>Math.abs(v-n)));
  return Object.keys(cache).filter(v=>Math.abs(v-n)===min)[0]
}
function userNumber(n){
  const not49 = x => /^[^49]+$/g.test(x);
  const m = 10000;
  let i = findNearest(n), num=cache[i];
  if (i<n) {
    while(i<n) 
      if (not49(++num)) {
        i++;
        if (i%m===0) cache[i]=num;
      }
  }
  if (i>n) {
    while(i>n) 
      if (not49(--num)) {
        i--;
        if (i%m===0) cache[i]=num;
      }
  }
  cache[i]=num;
  //console.log(JSON.stringify(cache).replace(/"/g,''));
  return ''+num;
}

userNumber(10000000);
/*
https://www.codewars.com/kata/5768b217b8ed4a77c0000c46/solutions/javascript
sao no doi sang co so 8 lam j ?
function userNumber(n){
  return n.toString(8).replace(/[4567]/g, c => +c + 1);
}
*/