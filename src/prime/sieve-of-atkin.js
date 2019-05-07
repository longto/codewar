const MAX = 25000000;
const prime = [2,3,5];
const bit = 5;
const sieve = [...Array((MAX>>bit)+1).fill(0)];
const mark =    (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] |= mask;
const toggle =  (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] ^= mask;
const clear =   (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] &= ~mask;
const check =   (n, i=n>>bit, j=n-(i<<bit), tmp=sieve[i]) => (tmp>>j)&1;
const mod60 =   a => a%60;

const view = () => {
    console.log(prime.join(','));
}
const mod1 = [1, 13, 17, 29, 37, 41, 49, 53];
const mod2 = [7, 19, 31, 43];
const mod3 = [11, 23, 47, 59];
const screening = ( max, sqrtMax=Math.sqrt(max), n, m) => {
    for ( let x=1; x<=sqrtMax; x++ ) {
        for ( let y=1; y<=sqrtMax; y++ ) {
            n = 4*x*x + y*y; 
            m = mod60(n)
            ;
            if ( n < max && mod1.includes(m) ) {
                toggle(n);
            }
            n = 3*x*x + y*y; 
            m = mod60(n);
            if ( n < max && mod2.includes(m) ) {
                toggle(n);
            }
            n = 3*x*x - y*y; 
            m = mod60(n);
            if ( n < max && mod3.includes(m) ) {
                toggle(n);
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
    for( let k=5; k<n; k++) {
        if (check(k)) {
            prime.push(k);
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

// const mod3 = a => {
//     a = (a >> 16) + (a & 0xFFFF); 
//     a = (a >>  8) + (a & 0xFF);
//     a = (a >>  4) + (a & 0xF);
//     a = (a >>  2) + (a & 0x3);
//     a = (a >>  2) + (a & 0x3);
//     a = (a >>  2) + (a & 0x3);
//     return a > 2 ? a - 3 : a;
// }
// const mod4 = a => a&3;
// const mod12Table = [[0,4,8],[9,1,5],[6,10,2],[3,7,11]];
//const mod12 = a => mod12Table[mod4(a)][mod3(a)];