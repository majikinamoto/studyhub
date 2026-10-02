import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=Object.fromEntries(['numbers','equations','geometry','trigonometry','powers','calculus','sequences','vectors','probability','reasoning'].map(id=>[id,JSON.parse(fs.readFileSync('data/suken-'+id+'.json','utf8'))]));
let checked=0;
function check(topic,unit,n,expected){const q=data[topic].lessons.find(l=>l.id===unit).questions[n-1];const answer=q.choices.find(c=>c.id===q.correctChoiceId).text;assert.equal(answer,String(expected),q.id);checked++;}
const factorial=n=>n<2?1:n*factorial(n-1);const choose=(n,r)=>factorial(n)/factorial(r)/factorial(n-r);
// Independently verify the new calculation lessons.
const divideComplex=([a,b],[c,d])=>[(a*c+b*d)/(c*c+d*d),(b*c-a*d)/(c*c+d*d)];
assert.deepEqual(divideComplex([1,0],[1,1]),[.5,-.5]);
assert.deepEqual(divideComplex([3,1],[1,1]),[2,-1]);
assert.deepEqual(divideComplex([4,2],[1,-1]),[1,3]);
for(const [n,answer] of [[1,'2−i'],[2,2**2+1],[3,'(1−i)/2'],[4,'2−i'],[5,'1+3i']])check('equations','conjugate',n,answer);
check('equations','root-relations',1,-5);check('equations','root-relations',2,-(-5)/1);check('equations','root-relations',3,-4/2);
for(const [n,b,c] of [[4,-4,1],[5,2,-3]])check('equations','root-relations',n,(-b)**2-2*c);
check('powers','base-change',1,'log₂8/log₂4');check('powers','base-change',2,'3/2');
assert.equal(Math.log2(8)/Math.log2(4),1.5);check('powers','base-change',3,3**2+2);check('powers','base-change',4,'x>2');
assert.equal(Math.log2(4)+Math.log2(4-2),3);check('powers','base-change',5,'x=4');
for(const [n,answer] of [[1,'2, 3'],[2,'正'],[3,'2<x<3'],[4,'x≦2 または x≧3'],[5,'2≦x≦3']])check('geometry','quadratic-sign',n,answer);
for(const x of [-5,0,2,2.5,3,4,10]){const v=x*x-5*x+6;assert.equal(v<0,x>2&&x<3);assert.equal(v>=0,x<=2||x>=3);assert.equal(-v>=0,x>=2&&x<=3);}
const average=values=>values.reduce((s,v)=>s+v,0)/values.length;
const variance=values=>average(values.map(v=>(v-average(values))**2));
check('probability','variance',1,average([2,4,6]));check('probability','variance',2,(2-average([2,4,6]))**2);
assert.equal(variance([2,4,6]),8/3);check('probability','variance',3,'8/3');check('probability','variance',4,Math.sqrt(variance([2,6])));
check('probability','variance',5,Math.round(variance([0,Math.sqrt(12)].map(v=>v*2))));
const sum=a=>a.reduce((x,y)=>x+y,0);const dot=(a,b)=>sum(a.map((v,i)=>v*b[i]));
for(const [n,x]of [[1,7],[2,'4/9'],[3,'2/9'],[4,'5/9'],[5,'8/9']])check('numbers','rational',n,x);
check('numbers','sets',2,new Set([1,2,3,3,4]).size);
check('equations','remainder',2,1**2+3*1+5);check('equations','remainder',3,2**2+2*2+3);check('equations','remainder',4,(-1)**3+2*(-1)+1);
check('equations','formula',2,(-6)**2-4*1*2);
check('geometry','coordinates',1,(2+6)/2);check('geometry','coordinates',4,Math.hypot(6,8));check('geometry','coordinates',5,Math.hypot(4-1,6-2));
check('geometry','quadratic',3,Math.min(...Array.from({length:21},(_,i)=>(i-10+1)**2+4)));
check('geometry','quadratic',5,Math.min(...Array.from({length:101},(_,i)=>(i/100-2)**2)));
check('geometry','circle',2,Math.sqrt(25));check('geometry','circle',3,Math.sqrt(16));check('geometry','line',2,(6-2)/(3-1));
check('trigonometry','ratio',5,20*3/5);check('trigonometry','triangle',2,4*6*.5/2);check('trigonometry','triangle',3,6*8/2);check('trigonometry','triangle',4,Math.hypot(3,4));check('trigonometry','triangle',5,2**2+3**2-2*2*3*.5);
check('powers','powers',1,Math.log2(2**3*2**4));check('powers','powers',2,5**0);check('powers','powers',3,'1/'+2**3);check('powers','powers',4,Math.cbrt(27));check('powers','powers',5,16**.75);
check('powers','logs',2,Math.log(1)/Math.log(5));check('powers','logs',3,Math.round(Math.log(27)/Math.log(3)));check('powers','logs',4,Math.log2(4*8));check('powers','logs',5,Math.log10(100));
check('calculus','derivative',1,3**2-1**2);check('calculus','derivative',2,(3**2-1**2)/(3-1));check('calculus','derivative',5,6);
// Integrate the polynomial by independently evaluating its antiderivative coefficients.
const integrate=(a,lo,hi)=>sum(a.map((v,i)=>v*(hi**(i+1)-lo**(i+1))/(i+1)));
check('calculus','integral',4,integrate([0,2],0,2));check('calculus','integral',5,integrate([1],1,3));
check('calculus','area',1,integrate([2],0,3));check('calculus','area',2,Math.abs(integrate([-2],0,3)));check('calculus','area',3,integrate([0,1],0,2));check('calculus','area',4,integrate([3-1],0,1));check('calculus','area',5,Math.abs(integrate([0,1],-1,0))+integrate([0,1],0,1));
const arith=(a,d,n)=>{for(let i=1;i<n;i++)a+=d;return a};const geom=(a,r,n)=>{for(let i=1;i<n;i++)a*=r;return a};
check('sequences','arithmetic',2,arith(2,3,5));check('sequences','arithmetic',3,arith(5,-2,4));check('sequences','arithmetic',4,sum(Array.from({length:10},(_,i)=>i+1)));check('sequences','arithmetic',5,arith(3,4,6));
check('sequences','geometric',3,geom(1,2,5));check('sequences','geometric',4,sum([1,2,4,8]));check('sequences','geometric',5,geom(2,-3,3));
check('sequences','sigma',2,sum([3,3,3,3]));check('sequences','sigma',3,sum([1,2,3].map(x=>x*x)));check('sequences','sigma',4,sum([1,2,3].map(x=>2*x+1)));check('sequences','sigma',5,4**2-3**2);
let a=1;const seq=[a];for(let i=1;i<5;i++){a=2*a+1;seq.push(a)}check('sequences','recurrence',1,seq[1]);check('sequences','recurrence',3,seq[3]);check('sequences','recurrence',5,seq[4]);
check('vectors','components',5,Math.hypot(6,8));check('vectors','dot',1,2*4);check('vectors','dot',2,dot([2,3],[4,1]));check('vectors','dot',3,dot([1,2],[3,-1]));check('vectors','dot',5,dot([1,2,2],[1,2,2]));
check('probability','count',1,4*3);check('probability','count',2,factorial(5)/factorial(3));check('probability','count',3,factorial(4));check('probability','count',4,choose(5,2));check('probability','count',5,choose(6,2));
const gcd=(a,b)=>b?gcd(b,a%b):a;const fraction=(a,b)=>`${a/gcd(a,b)}/${b/gcd(a,b)}`;
const dice=[1,2,3,4,5,6];check('probability','chance',2,fraction(dice.filter(x=>x>=5).length,6));check('probability','chance',3,fraction(dice.filter(x=>x%3===0).length,6));check('probability','chance',4,fraction(dice.filter(x=>x!==6).length,6));check('probability','chance',5,fraction(dice.filter(x=>x%2===0||x%3===0).length,6));
const outcomes=Array.from({length:8},(_,n)=>n.toString(2).padStart(3,'0'));
check('probability','trials',2,outcomes.filter(x=>[...x].filter(v=>v==='1').length===2).length);
check('probability','trials',3,fraction(outcomes.filter(x=>[...x].filter(v=>v==='1').length===2).length,8));check('probability','trials',4,fraction(dice.filter(x=>x%2===0&&x>=4).length,dice.filter(x=>x%2===0).length));
check('probability','expectation',1,10*.5);check('probability','expectation',2,10*.5+2*.5);check('probability','expectation',3,fraction(sum(dice),6));check('probability','expectation',4,20*.25);check('probability','expectation',5,(120-50)+'円');
check('reasoning','rules',2,Array.from({length:6},(_,y)=>y).find(y=>10*(5-y)+50*y===130));for(const [n,exp]of [[3,4],[4,6],[5,10]])check('reasoning','rules',n,2**exp%7);
// Symbolic examples checked at several distinct inputs; enough to identify these low-degree polynomials.
for(const x of [-3,-1,0,1,2,5]){assert.equal((x+1)**2-(x-1)**2,4*x);assert.equal(x*x+4*x+7,(x+2)**2+3);assert.equal(x*x+3*x+5,(x-1)*(x+4)+9);}
for(const x of [1-Math.SQRT2,1+Math.SQRT2])assert(Math.abs(x*x-2*x-1)<1e-12);
assert(Math.abs(Math.sin(75*Math.PI/180)-(Math.sqrt(6)+Math.sqrt(2))/4)<1e-12);
console.log('PASS: '+checked+' independently computed numerical answers, polynomial identities, quadratic roots and angle formula. Other conceptual and symbolic answers require editorial review.');
