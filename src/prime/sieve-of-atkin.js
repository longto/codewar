const MAX =     25000000;
const prime =   [2,3];
const bit =     5;
const sieve =   [...Array((MAX>>bit)+1).fill(0)];
const mark =    (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] |= mask;
const toggle =  (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] ^= mask;
const clear =   (n, i=n>>bit, j=n-(i<<bit), mask=1<<j) => sieve[i] &= ~mask;
const check =   (n, i=n>>bit, j=n-(i<<bit), tmp=sieve[i]) => (tmp>>j)&1;
const mod12 =   a => a%12;
const view = () => {
    console.log(prime.join(','));
}
const screening = ( max=MAX, sqrtMax=Math.sqrt(max) ) => {
    for ( let x=1; x<=sqrtMax; x++ ) {
        let xx = x*x;
        for ( let y=1; y<=sqrtMax; y++ ) {
            let yy = y*y;
            let n = 4*xx + yy; 
            let m = n%12;
            if ( n <= max && (m==1||m==5) ) {
                toggle(n);
            }
            n = n - xx; 
            m = n%12;
            if ( n <= max && m==7 ) {
                toggle(n);
            }
            n = n - yy - yy; 
            m = n%12;
            if ( x > y && n <= max && m==11 ) {
                toggle(n);
            }
        }
    }
    for ( let x=5; x<=sqrtMax; x++ ) {
        if (check(x)) {
            let xx = x*x;
            for ( let y=xx; y<max; y+=xx) {
                clear(y);
            }
        }
    }
    for( let x=5; x<max; x++) {
        if (check(x)) {
            prime.push(x);
        }
    }
    //view();
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