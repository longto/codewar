const MAX = 500;
const prime = [2,3,5];
const bit = 5;
const sieve = [...Array((MAX>>bit)+1).fill(0)];
const mark =    (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] |= mask;
const toggle =  (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] ^= mask;
const clear =   (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] &= ~mask;
const check =   (n, i=n>>bit, j=n-(i<<bit), tmp=sieve[i]) => (tmp>>j)&1;
const view = () => {
    console.log(prime.join(','));
}
const screening = ( max, sqrtMax=Math.sqrt(max) ) => {
    const lastPrime = prime.slice(-1)[0];
    for ( let k=0; k<prime.length; k++ ) {
        let x = prime[k];
        for ( let y=x+x; y<=max; y+=x ) mark(y);
    }
    for ( let x=lastPrime+1; x<=sqrtMax; x++ ) {
        if (!check(x)) {
            for ( let y=x+x; y<=max; y+=x ) mark(y);
        }
    }
    for( let x=lastPrime+1; x<=max; x++) {
        if (!check(x)) {
            prime.push(x);
        }
    }
    view();
}

const main = () => {
    let t1 = (new Date).getTime();
    screening(MAX);
    let t2 = (new Date).getTime();
    console.log(`time to run : ${(t2-t1)/1000} s`);
}

export {main};