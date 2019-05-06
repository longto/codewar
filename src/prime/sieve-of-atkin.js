import {lzw_decode, lzw_encode} from './lzw';
const MAX = 25000000;
const prime = [];
const bitMax = 32;
const sieve = [...Array(Math.ceil(MAX/bitMax)).fill(0)];

const mark = (n, i=n/bitMax, j=n%bitMax, mask=1<<j) => sieve[i] |= mask;
const toggle = (n, i=n/bitMax, j=n%bitMax, mask=1<<j) => sieve[i] ^= mask;
const clear = (n, i=n/bitMax, j=n%bitMax, mask=1<<j) => sieve[i] &= ~mask;
const check = (n, i=n/bitMax, j=n%bitMax, tmp=sieve[i]) => (tmp>>j)&1;

const view = (n=MAX, result = [2,3]) => {
     for( let k=5; k<n; k++) {
        if (check(k)) {
            result.push(k);
        }
    }
    console.log(lzw_encode(result.join(',')));
}

const screening = ( max, sqrtMax=Math.sqrt(max), n) => {
    for ( let x=1; x<=sqrtMax; x++ ) {
        for ( let y=1; y<=sqrtMax; y++ ) {
            if ( (n=4*x*x + y*y) < max && ( n%12===1 || n%12===5) ) {
                mark(n);
            }
            if ( (n=3*x*x + y*y) < max && n%12===7 ) {
                mark(n);
            }
            if ( (n=3*x*x - y*y) < max && n%12===11 ) {
                mark(n);
            }
        }
    }
    for ( let x=5; x<=sqrtMax; x++ ) {
        if (check(x)) {
            for ( let y=x*x; y<max; y+=x*x) {
                clear(y);
            }
        }
    }
    view();
}

const main = () => {
    let t1 = (new Date).getTime();
    screening(MAX);
    let t2 = (new Date).getTime();
    console.log(`time to run : ${(t2-t1)/1000} s`)
}

export {main};