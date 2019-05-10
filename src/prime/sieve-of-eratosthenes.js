const msp = [2, 15485863, 32452843, 49979687, 67867967, 86028121, 104395301, 122949823, 141650939, 160481183, 179424673, 198491317, 217645177, 236887691, 256203161, 275604541, 295075147, 314606869, 334214459, 353868013, 373587883, 393342739, 413158511, 433024223, 452930459, 472882027, 492876847, 512927357, 533000389, 553105243, 573259391, 593441843, 613651349, 633910099, 654188383, 674506081, 694847533, 715225739, 735632791, 756065159, 776531401, 797003413, 817504243, 838041641, 858599503, 879190747, 899809343, 920419813, 941083981, 961748927, 982451653];//Milion start point
const MAX = 500;
const prime = [2,3,5];
class Sieve {
    constructor(min, max) {
        this.bit = 5;
        this.min = min;
        this.max = max;
        this.filler = !(min&1) ? parseInt('01010101010101010101010101010101',2) : parseInt('10101010101010101010101010101010',2); //mark 2
        this.sieve = [...Array(((max-min+1)>>this.bit)+1).fill(this.filler)];
        this.primes = [];
    }
    mark (m, n=m-this.min, i=n>>this.bit, j=n-(i<<this.bit), mask=1<<j) {
        this.sieve[i] |= mask;
    } 
    toggle (m, n=m-this.min, i=n>>this.bit, j=n-(i<<this.bit), mask=1<<j){
        this.sieve[i] ^= mask;
    }
    clear (m, n=m-this.min, i=n>>this.bit, j=n-(i<<this.bit), mask=1<<j) {
        this.sieve[i] &= ~mask;
    }
    check (m, n=m-this.min, i=n>>this.bit, j=n-(i<<this.bit), tmp=this.sieve[i]) {
        return (tmp>>j)&1;    
    }
    getPrimes() {
        for(let i=this.min;i<=this.max;i++) {
            if (!this.check(i)) {
                this.primes.push(i);
            }
        }
        return this.primes;
    }
}

const segmentPrimes = (index, primaryPrimes) => {
    const min = msp[index], max = min + (msp[index+1]-msp[index])/100000, sqrtMax = Math.sqrt(max), sieve = new Sieve(min, max);
    const initPrimes = primaryPrimes.filter(x=>x<=sqrtMax);
    //skip 2
    for(let i=1; i<initPrimes.length;i++) {
        let x = initPrimes[i];
        for ( let y=Math.ceil(min/x)*x; y<=max; y+=x ) 
            sieve.mark(y);
    }
    return sieve.getPrimes();
}

const initPrimes = () => {
    const min = 2, max = 65536, sqrtMax = Math.sqrt(max), sieve = new Sieve(min, max);
    sieve.clear(2);
    for(let x=3;x<=sqrtMax;x+=2) {
        if (!sieve.check(x)) 
            for (let y=x*x, k=x<<1; y<=max; y+=k)
                sieve.mark(y);
    }
    return sieve.getPrimes();
}

const screening = () => {
    const primaryPrimes = initPrimes();
    console.log(primaryPrimes.join(', '));
    let k = 1000000;
    if ( k%1000000===0 ) {
        const primes0 = segmentPrimes(k/1000000, primaryPrimes);
        console.log(primes0.join(', '));
    }
    k = 5000000;
    if ( k%1000000===0 ) {
        const primes1 = segmentPrimes(k/1000000, primaryPrimes);
        console.log(primes1.join(', '));
    }
    k = 25000000;
    if ( k%1000000===0 ) {
        const primes2 = segmentPrimes(k/1000000, primaryPrimes);
        console.log(primes2.join(', '));
    }
}

const main = () => {
    let t1 = (new Date).getTime();
    screening();
    let t2 = (new Date).getTime();
    console.log(`time to run : ${(t2-t1)/1000} s`);
}

export {main};
