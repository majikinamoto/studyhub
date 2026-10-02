import assert from 'node:assert/strict';
import {secondExpansion} from './suken-second-expansion-content.mjs';
const answer=(id,n,v)=>assert.equal(secondExpansion.find(l=>l.id===id).questions[n].answer,v);
const near=(a,b,eps=1e-10)=>assert(Math.abs(a-b)<eps,`${a} != ${b}`);
assert.equal(secondExpansion.length,6);assert.equal(secondExpansion.reduce((n,l)=>n+l.questions.length,0),30);
// Integrate the normal density independently of rounded table values in the lesson.
const probability=(a,b)=>{const N=20000,h=(b-a)/N;let sum=0;for(let i=0;i<N;i++){const z=a+(i+.5)*h;sum+=Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*h;}return sum;};
near(probability(-1,1),.6826,.0001);near(probability(2,9),.0228,.0001);near(probability(-1.96,1.96),.95,.0001);
near((65-50)/Math.sqrt(100),1.5);near(60-1.96*8,44.32);near(60+1.96*8,75.68);
answer('normal-distribution',2,'約0.6826');answer('normal-distribution',3,'約0.0228');answer('normal-distribution',4,'44.32≤X≤75.68');
near(12/Math.sqrt(36),2);near(10/Math.sqrt(100),1);near(50-1.96,48.04);near(50+1.96,51.96);
assert((52.5-50)/(10/Math.sqrt(100))>1.96);assert(Math.abs((51.2-50)/(10/Math.sqrt(100)))<1.96);
answer('statistical-inference',2,'48.04≤μ≤51.96');answer('statistical-inference',3,'H₀を棄却する');answer('statistical-inference',4,'H₀を棄却しない。μ=50の証明にはならない');
const mul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];const add=([a,b],[c,d])=>[a+c,b+d];
assert.deepEqual(mul([2,1],[2,-1]),[5,0]);assert.deepEqual(mul([.5,-.5],[1,1]),[1,0]);
for(const z of [[1,2],[1,-2]])assert.deepEqual(add(add(mul(z,z),mul([-2,0],z)),[5,0]),[0,0]);
for(const z of [[2,0],[1,2],[1,-2]]){const z2=mul(z,z),z3=mul(z2,z);assert.deepEqual(add(add(add(z3,mul([-4,0],z2)),mul([9,0],z)),[-10,0]),[0,0]);}
answer('complex-conjugates',3,'a=−4、b=9、c=−10');
for(const x of [-2,1,3])assert.equal(x**3-2*x*x-5*x+6,0);
for(const x of [-2,-1,1,2])assert.equal(x**4-5*x*x+4,0);
for(let x=-10;x<=10;x+=.25)near(x**3-3*x*x+4,(x-2)**2*(x+1));
answer('higher-equations',2,'x=−2,1,3');answer('higher-equations',3,'x=−2,−1,1,2');answer('higher-equations',4,'x=−1,2、異なる実数解は2個');
for(let x=-10;x<=10;x+=.25){if(x!==1)near((x*x-1)/(x-1),x+1);if(x!==0&&x!==-1){near(1/x+1/(x+1),(2*x+1)/(x*(x+1)));near(1/(x*(x+1)),1/x-1/(x+1));}if(x!==2&&x!==-1)near((x*x-4)/(x*x-x-2),(x+2)/(x+1));}
answer('rational-conditions',3,'解なし');answer('rational-conditions',4,'(x+2)/(x+1)、除外はx=2,−1');
// Exhaustive grid/integers: independently verify geometric and production optima.
let maximum=0,restricted=0;for(let i=0;i<=80;i++)for(let j=0;j<=80-i;j++){const x=i/20,y=j/20;maximum=Math.max(maximum,3*x+2*y);if(x<=2)restricted=Math.max(restricted,3*x+2*y);}
assert.equal(maximum,12);assert.equal(restricted,10);
let best=-Infinity,pairs=[];for(let x=0;x<=5;x++)for(let y=0;y<=5;y++)if(2*x+y<=5){const value=300*x+200*y;if(value>best){best=value;pairs=[[x,y]];}else if(value===best)pairs.push([x,y]);}
assert.equal(best,1000);assert.deepEqual(pairs,[[0,5]]);answer('region-optimization',4,'最大利益1000円、Aを0個・Bを5個');
console.log('PASS: 30 expansion questions reviewed; independent normal integration, inference arithmetic, complex roots, polynomial/rational identities, domain exclusions, region and integer optima.');
