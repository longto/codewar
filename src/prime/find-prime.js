const cache = [2,3,5];
let w = 2;
const isPrime = num => {
  const sqrt = Math.sqrt(num);
  for (let i=0; i<cache.length && cache[i]<=sqrt; i++) 
    if (num%cache[i]===0) return false;
  return true;
}
for (let p=cache.slice(-1)[0];;) {
  p+=w;
  w=6-w;
  if(isPrime(p)) {
    cache.push(p);
    if (p>65536) {
      console.log(JSON.stringify(cache));
      break;
    }
  }
}