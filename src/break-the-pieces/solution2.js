const SPACE = ' ';
const go = (i,j) => [[i-1,j-1], [i-1,j],[i-1,j+1], [i,j-1], [i,j+1], [i+1,j-1], [i+1,j], [i+1,j+1]];
const bound = (points) => points.reduce(([iMin, jMin, iMax, jMax], [i,j])=>[ Math.min(iMin, i), Math.min(jMin, j), Math.max(iMax, i), Math.max(jMax, j)], [Infinity, Infinity, -Infinity, -Infinity]);
const contain = (screen, opt, ...arr) => arr.every(([i,j])=>opt.includes(screen[i][j]));
const shapeIncludes = (s1,s2) => {
    const [iMin1, jMin1, iMax1, jMax1] = bound(s1);
    const [iMin2, jMin2, iMax2, jMax2] = bound(s2);
    return iMin1<iMin2 && jMin1<jMin2 && iMax1>iMax2 && jMax1>jMax2;
}
const expand = (render, n=render.length, m=Math.max(...render.map(r=>r.length)) ) => {
    const reRender = [...Array(2*n)].map(r=>Array(2*m).fill(SPACE));
    for(let i=0;i<render.length;i++)
        for(let j=0;j<render[i].length;j++) {
            reRender[2*i][2*j]=render[i][j];
            if ( 0<=i-1 && contain(render, '+|', [i,j],[i-1,j]) ) reRender[2*i-1][2*j]='|';
            if ( 0<=j-1 && contain(render, '+-', [i,j],[i,j-1]) ) reRender[2*i][2*j-1]='-';
        }
    return reRender;
}
const collapse = (render, n=Math.ceil(render.length/2), m=Math.ceil(Math.max(...render.map(r=>r.length))/2) ) => {
    const reRender = [...Array(n)].map(r=>Array(m).fill(SPACE));
    for(let i=0;i<reRender.length;i++)
        for(let j=0;j<reRender[i].length;j++)
            reRender[i][j]=render[2*i][2*j];
    return reRender;
}
const extract = (points, render) => {
    const [iMin, jMin, iMax, jMax] = bound(points);
    const screen = [...Array(iMax+1)].map(x=>Array(jMax+1).fill(SPACE));
    points.map(([i,j])=>{
        screen[i][j] = render[i][j];
        if (screen[i][j]==='+') {
            if ( 0<=i-1 && i+1<screen.length && contain(screen,'+|',[i-1,j],[i+1,j]) ) screen[i][j]='|';
            if ( 0<=j-1 && j+1<screen[i].length && contain(screen,'+-',[i,j-1],[i,j+1]) ) screen[i][j]='-';
        }
    })
    return screen.filter((r,inx)=>inx>=iMin).map(r=>r.slice(jMin));
}
const draw = screen => screen.map(r=>r.join('').trimRight()).join('\n');
const getEmpty = render => {
    for(let i=0;i<render.length;i++)
        for(let j=0;j<render[i].length;j++) 
            if (render[i][j]===SPACE) return [i,j];
    return null;
}
function breakPieces (shape) {
    const render = expand(shape.split('\n').map(v=>v.split('')));//kiem tra sau khi expand co bi thua cot, thua dong ko ?
    const mark = ([i,j],g) => render[i][j] = g;
    let g=0, groups=[], borders={}, empty;
    while((empty=getEmpty(render))!=null) {
        mark(empty,++g);
        let q=[empty], closeGroup=true, b=[];
        while(q.length) {
            const [i,j] = q.shift();
            if(i===0||i===render.length-1||j===0||j===render[i].length-1) closeGroup=false;
            go(i,j).map(([ii,jj])=>{
                if (0>ii||ii>=render.length||0>jj||jj>=render[ii].length) return ;
                if (render[ii][jj]===SPACE) {
                    mark([ii,jj],g);
                    q.push([ii,jj]);
                } else if ('+-|'.includes(render[ii][jj])) b.push([ii,jj]); // bi trung gia tri nhieu lan, check lai va su dung set
            });
        }
        if (closeGroup) {
            groups.push(g);
            borders[g] = b;
        }
    }
    
    Object.entries(borders).map(([k1, s1], inx, arr)=>{
        const children=arr.filter(([k2,s2])=>shapeIncludes(s1,s2)).map(([k2,s2])=>s2.map(p=>p.join(',')).join(' '));
        borders[k1] = s1.filter(p=> !` ${children} `.includes(` ${p.join(',')} `) );
    })
    const result = Object.values(borders).map(points=>draw(collapse(extract(points, render))));

    console.log(shape);
    console.log(groups);
    console.log(borders);
    result.map(s=>{
        console.log(s);
    });
    
    return result;
}

export {breakPieces};