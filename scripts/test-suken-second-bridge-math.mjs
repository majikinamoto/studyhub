import assert from 'node:assert/strict';
import {secondUnits} from './suken-second-bridge-content.mjs';
const get=id=>secondUnits.find(l=>l.id===id);
const near=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const answer=(id,n,expected)=>assert.equal(get(id).questions[n].answer,expected);
// Independent numeric/coordinate calculations, plus identities over a grid.
for(let x=-12;x<=12;x++)for(let y=-12;y<=12;y++){
 assert.equal(x*x+y*y-2*x*y,(x-y)**2);
 assert.equal(2*(x*x+y*y)-(x+y)**2,(x-y)**2);
 if(x>0&&y>0){assert(x/y+y/x>=2-1e-12);near(x/y+y/x-2,(x-y)**2/(x*y));}
}
for(let n=-100;n<=100;n++){assert.equal(Math.abs((n*(n+1))%2),0);assert.equal(Math.abs((n**3-n)%6),0);}
assert.equal(4**2+4+1,21);
answer('integer-proof',4,'例えばn=4：21=3×7');
for(let a=-3;a<=4;a+=.25){
 const x=Math.max(0,Math.min(2,a)),minimum=x*x-2*a*x+1;
 const expected=a<0?1:a<=2?1-a*a:5-4*a;near(minimum,expected);
 for(let t=0;t<=2;t+=.125)assert(t*t-2*a*t+1>=minimum-1e-12);
}
for(const x of [0,2])assert.equal(4**x-5*2**x+4,0);
near(Math.log2(3-1)+Math.log2(3+1),3);
for(const t of [0,Math.PI/2])near(Math.sin(t)+Math.cos(t),1);
answer('quadratic-parameter',4,'a<0：1、0≤a≤2：1−a²、a>2：5−4a');
for(let y=-10;y<=10;y++){const x=(5-y)/2;near(Math.hypot(x,y),Math.hypot(x-4,y-2));}
for(let t=0;t<Math.PI*2;t+=.1){const x=4+2*Math.cos(t),y=2*Math.sin(t);near(Math.hypot(x,y),2*Math.hypot(x-3,y));}
answer('locus-conditions',3,'(x−4)²+y²=4');
near(Math.hypot(3-1,2)+Math.hypot(5-3,2),4*Math.SQRT2);
near(Math.hypot(2+1,3-2)+Math.hypot(2-1,3-6),2*Math.sqrt(10));
assert.equal(2*2-1,3);assert.equal(-3*2+9,3);
for(let x=-20;x<=20;x+=.2){assert(Math.hypot(x-1,2)+Math.hypot(x-5,2)>=4*Math.SQRT2-1e-10);}
answer('reflection-distance',4,'最小値2√10、Q(2,3)');
const f=x=>x**3-3*x;assert.equal(f(-1),2);assert.equal(f(1),-2);assert.equal(f(3),18);assert.equal(f(2),9*2-16);
answer('derivative-reasoning',4,'最大値18（x=3）、最小値−2（x=1）');
// Numerical integration of geometric areas independently of the worked antiderivatives.
const integrate=(fn,a,b)=>{const N=10000,h=(b-a)/N;let sum=0;for(let i=0;i<N;i++)sum+=fn(a+(i+.5)*h)*h;return sum;};
assert(Math.abs(integrate(x=>2*x-x*x,0,2)-4/3)<1e-7);
assert(Math.abs(integrate(x=>Math.abs(x*x-1),-2,2)-4)<1e-7);
assert(Math.abs(integrate(x=>x*x-2*x+1,0,2)-2/3)<1e-7);
answer('area-integral',2,'4/3');answer('area-integral',3,'4');answer('area-integral',4,'2/3');
let a=2,total=0,b=1;
for(let n=1;n<=15;n++){assert.equal(a,3**n-1);assert.equal(b,2**(n+1)-3);total+=a;assert.equal(total,3*(3**n-1)/2-n);a=3*a+2;b=2*b+3;}
for(let n=1;n<=100;n++){
 assert.equal(Array.from({length:n},(_,i)=>2*i+1).reduce((s,a)=>s+a,0),n*n);
 near(Array.from({length:n},(_,i)=>1/((i+1)*(i+2))).reduce((s,a)=>s+a,0),n/(n+1));assert(2**n>=n+1);
}
answer('recurrence-transform',3,'aₙ=2ⁿ⁺¹−3');answer('induction-sums',3,'n/(n+1)');
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];near(cross([2,2],[3,3]),0);near(cross([-4,2],[-6,3]),0);
// A=(0,0), B=(5,0), C=(0,5): intersection must be (1,2).
near(cross([1,2],[5/3,10/3]),0);near(cross([-4,2],[-5,2.5]),0);
answer('affine-intersection',3,'p=(b+2c)/5');answer('affine-intersection',4,'G(1,2,2)');
assert.equal(1*3+2*(-1),1);near(1/(1*2),Math.cos(Math.PI/3));assert.equal(2*2-4,0);near(Math.abs(cross([2,1],[1,3]))/2,2.5);
answer('inner-product-geometry',4,'5/2');
let condition=0,favorable=0;
for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(i+j===5){condition++;if(i===1)favorable++;}near(favorable/condition,1/4);
const balls=['r','r','r','w','w'];condition=0;favorable=0;
for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)if(balls[i]==='r'||balls[j]==='r'){condition++;if(balls[i]===balls[j])favorable++;}near(favorable/condition,1/3);
condition=0;favorable=0;for(let bits=1;bits<8;bits++){condition++;if(bits.toString(2).replaceAll('0','').length===2)favorable++;}near(favorable/condition,3/7);
answer('conditional-count',2,'1/4');answer('conditional-count',3,'1/3');answer('conditional-count',4,'3/7');
const p=[1/2,1/6,1/3],mean=p.reduce((s,p,x)=>s+x*p,0),variance=p.reduce((s,p,x)=>s+(x-mean)**2*p,0);near(mean,5/6);near(variance,29/36);
let ey=0,ey2=0;for(let bits=0;bits<1024;bits++){const heads=bits.toString(2).replaceAll('0','').length,Y=15*heads-50;ey+=Y/1024;ey2+=Y*Y/1024;}near(ey,25);near(Math.sqrt(ey2-ey*ey),15*Math.sqrt(10)/2);
answer('expectation-interpretation',2,'分散29/36、標準偏差√29/6');answer('expectation-interpretation',3,'期待値25、標準偏差15√10/2');
assert.equal(600/6-120,-20);
assert.equal(secondUnits.length,14);assert.equal(secondUnits.reduce((n,l)=>n+l.questions.length,0),70);
console.log('PASS: independent identities, parameter minima, roots, loci, shortest paths, numerical areas, recurrences, vector intersections, exhaustive probability and variance calculations. Proof wording requires editorial review.');
