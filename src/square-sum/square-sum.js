const cache = {};

const generateGraph = (n, m=Math.sqrt(n+n-1)|0) => {
    const square = [...Array(m-1).fill(0).map((_, i, arr, j=i+2)=>j*j)];
    const nodes = [...Array(n).fill(0).map((_,i)=>i+1)];
    const graph = nodes.reduce(( acc, head, inx, arr) => ({
        ...acc,
        [head]: arr.filter(tail=>tail!==head && square.includes(tail+head))
    }),{});
    const order = nodes.sort((a,b)=>graph[b].length-graph[a].length);
    for(let i in graph) graph[i] = order.filter(n=>graph[i].includes(n));
    graph[0]=order;    
    return {graph, order};
}

function square_sums_row(n) {
    console.log(n);
    const {graph, order} = generateGraph(n);
    const isolation = order.filter(n=>graph[n].length===0);
    const singleLink = order.filter(n=>graph[n].length===1);
    if ( isolation.length>0 || singleLink.length > 2 ) return false;
    const nextNodes = (path, lastNode=path.slice(-1)[0]||0) => graph[lastNode].filter(n=>!path.includes(n));
    const q = [[]];
    while(q.length) {
        let path = q.pop();
        for(let i=0, next = nextNodes(path); i<next.length; i++) {
            let newPath = [...path, next[i]];
            if (newPath.length===n) {
                //console.log(newPath);
                //continue;
                return newPath;
            }
            q.push(newPath);
        }
    }
    return false;
}

import {time} from '../utils';
const main = () => {
    time(()=>{
        for(let i=15;i<=30;i++) {
            console.log(`n = ${i}`);
            time(()=>console.log(square_sums_row(i)));
        }
    })
}

export {main};