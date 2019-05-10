const msp = [2, 15485863, 32452843, 49979687, 67867967, 86028121, 104395301, 122949823, 141650939, 160481183, 179424673, 198491317, 217645177, 236887691, 256203161, 275604541, 295075147, 314606869, 334214459, 353868013, 373587883, 393342739, 413158511, 433024223, 452930459, 472882027, 472882049, 492876847, 512927357, 533000389, 553105243, 573259391, 593441843, 613651349, 633910099, 654188383, 674506081, 694847533, 715225739, 735632791, 756065159, 776531401, 797003413, 817504243, 838041641, 858599503, 879190747, 899809343, 920419813, 941083981, 961748927, 982451653];//Milion start point
const MAX = 500;
const prime = [2,3,5];
class Sieve {
    constructor(min, max) {
        this.min = min;
        this.max = max;
        this.bit = 5;
        this.sieve = [...Array(((max-min+1)>>this.bit)+1).fill(0)];
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

const screening = () => {
    const sieve = new Sieve(2, 65536);
    let min =2, max = 65536;
    for(let x=min;x<=max;x++) {
        if (!sieve.check(x)) {
            for ( let y=x+x; y<=max; y+=x ) sieve.mark(y);
        }
    }
    const primaryPrimes = sieve.getPrimes();
    console.log(primaryPrimes.join(', '));
}

const main = () => {
    let t1 = (new Date).getTime();
    screening();
    let t2 = (new Date).getTime();
    console.log(`time to run : ${(t2-t1)/1000} s`);
}

export {main};

/**
 viet ham tim so nguyen to theo khoang
 tim tat ca cac so nguyen to thu 1M, 2M, 3M, ... 26M
 test dau la 1m-2M, test2 la 5M-6M, test3 la 25M-26M
 */