import assert from 'node:assert/strict';
import fs from 'node:fs';
import {extras} from './suken-first-bridge-extras.mjs';
const data=JSON.parse(fs.readFileSync('data/suken-first-bridge.json'));
let checked=0;
const q=(id,n)=>extras.find(l=>l.id===id).questions[n-1];
const norm=s=>String(s).replace(/−/g,'-').replace(/\s/g,'');
function number(s){s=norm(s).replace(/(桁|通り|個|°)$/,'').replace(/√(\d+)/g,'Math.sqrt($1)').replace(/π/g,'Math.PI').replace(/(\d|\))(?=Math)/g,'$1*');assert(/^[0-9+*/().a-zA-Z-]+$/.test(s),s);return Function('return '+s)();}
function numeric(id,n,value){assert(Math.abs(number(q(id,n).answer)-value)<1e-9,id+'/'+n);checked++;}
function text(id,n,value){assert.equal(norm(q(id,n).answer),norm(value),id+'/'+n);checked++;}
const sum=a=>a.reduce((n,x)=>n+x,0),fac=n=>n<2?1:n*fac(n-1),choose=(n,r)=>fac(n)/fac(r)/fac(n-r);
const mean=a=>sum(a)/a.length,variance=a=>mean(a.map(x=>(x-mean(a))**2));
numeric('absolute',1,Math.abs(-7));text('absolute',3,'−2<x<3');text('absolute',4,'x≤−4 または x≥2');text('absolute',5,'x<−2');
for(const x of [-10,-4,-2,-1,0,2,3,8]){assert.equal(Math.abs(2*x-1)<5,x>-2&&x<3);assert.equal(Math.abs(x+1)>=3,x<=-4||x>=2);assert.equal(-3*x+2>8,x<-2);}
const gcd=(a,b)=>b?gcd(b,a%b):a;
numeric('integers',1,gcd(18,12));numeric('integers',2,parseInt('101',2));numeric('integers',3,gcd(84,30));text('integers',4,'('+Number(13).toString(2)+')₂');
numeric('fractions-expression',1,-3);text('identity',1,3);text('identity',3,5-2);text('identity',4,'a=4、b=−4、c=1');
numeric('inequality-identity',1,0);numeric('inequality-identity',2,2*Math.sqrt(9));text('inequality-identity',4,'最小値'+2*Math.sqrt(9)+'、x='+Math.sqrt(9));text('inequality-identity',5,'最小値'+2*Math.sqrt(16)+'、x='+Math.sqrt(8/2));
text('higher',1,'x(x²−4)');text('higher',3,'x=0,3,−3');text('higher',4,'x=±1,±2');text('higher',5,'x=2,1,−1');
for(const x of [0,3,-3])assert.equal(x**3-9*x,0);
for(const x of [-2,-1,1,2])assert.equal(x**4-5*x*x+4,0);
for(const x of [-1,1,2])assert.equal(x**3-2*x*x-x+2,0);
const pair=(a,b,m,n,outside=false)=>a.map((x,i)=>outside?(m*b[i]-n*x)/(m-n):(n*x+m*b[i])/(m+n));
text('division',1,'('+pair([0,0],[8,4],1,1).join(',')+')');numeric('division',2,1+2);
text('division',3,'('+pair([1,2],[7,5],1,2).join(',')+')');text('division',4,'('+pair([1,2],[7,5],2,1,true).join(',')+')');text('division',5,'('+[mean([0,6,3]),mean([1,1,7])].join(',')+')');
text('translation-range',1,'(2,1)');text('translation-range',3,'y=(x+1)²−2');text('translation-range',4,'最大5（x=0）、最小1（x=2）');text('translation-range',5,'最大5（x=4）、最小2（x=3）');
const y=x=>x*x-4*x+5;assert.equal(Math.min(...Array.from({length:301},(_,n)=>y(n/100))),1);assert.equal(Math.max(...Array.from({length:301},(_,n)=>y(n/100))),5);assert.equal(y(3),2);assert.equal(y(4),5);
numeric('distance',2,Math.hypot(3,4));numeric('distance',3,Math.abs(-10)/Math.hypot(3,4));numeric('distance',4,Math.abs(1-4+3)/Math.hypot(1,2));numeric('distance',5,Math.abs(2+1-1)/Math.hypot(1,1));
numeric('circle-line',1,Math.sqrt(25));numeric('circle-line',2,25-9);text('circle-line',3,'(4,3),(−4,3)');text('circle-line',4,'3x+4y=25');numeric('circle-line',5,180-70);
assert.equal(4**2+3**2,25);assert.equal((-4)**2+3**2,25);assert.equal(3**2+4**2,25);
numeric('regions',2,Math.sqrt(9));text('regions',3,'(0,0),(4,0),(0,4)');text('regions',5,'領域内');
numeric('sine-law',1,Math.sin(Math.PI/6));numeric('sine-law',2,8/2);numeric('sine-law',3,6/(2*Math.sin(Math.PI/6)));numeric('sine-law',4,6*Math.sin(Math.PI/3)/Math.sin(Math.PI/6));numeric('sine-law',5,4/(2*Math.sin(Math.PI/4)));
text('trig-equations',3,'θ=π/6,5π/6');text('trig-equations',4,'θ=2π/3,4π/3');text('trig-equations',5,'θ=0,π/2,π,3π/2');
for(const theta of [Math.PI/6,5*Math.PI/6])assert(Math.abs(Math.sin(theta)-.5)<1e-10);
for(const theta of [2*Math.PI/3,4*Math.PI/3])assert(Math.abs(Math.cos(theta)+.5)<1e-10);
for(const theta of [0,Math.PI/2,Math.PI,3*Math.PI/2])assert(Math.abs(Math.sin(2*theta))<1e-10);
numeric('synthesis',1,Math.hypot(3,4));text('synthesis',3,'最大√2、最小−√2');text('synthesis',4,'最大5、最小−5');numeric('synthesis',5,Math.sin(2*Math.atan(3))+Math.cos(2*Math.atan(3)));
numeric('exponential',1,2**-3);text('exponential',3,'x='+Math.round((Math.log(27)/Math.log(3))-1));text('exponential',4,'x≤3');text('exponential',5,'x=0,2');for(const x of [0,2])assert.equal(2**(2*x)-5*2**x+4,0);
text('log-inequality-digits',1,'x>1');numeric('log-inequality-digits',2,Math.log10(1000));text('log-inequality-digits',3,'1<x<5');text('log-inequality-digits',4,'0<x≤1/4');numeric('log-inequality-digits',5,String(2**20).length);
numeric('integral-constant',2,3-1);text('integral-constant',3,'x³−2x+4');numeric('integral-constant',4,2*(2*2**3/3+2));numeric('integral-constant',5,2*(-1+2));
numeric('area-curve',3,2**2-2**3/3);const f=x=>x*x+3*x-x**3/3;numeric('area-curve',4,f(3)-f(-1));numeric('area-curve',5,2*(.5-.25));
numeric('difference',1,5-2);text('difference',2,'n−1個');numeric('difference',3,2+sum([3,5,7]));text('difference',4,'aₙ=n²+1');text('difference',5,'aₙ=1+3n(n−1)/2');
numeric('sigma-powers',1,sum([1,4,9]));numeric('sigma-powers',2,sum([1,1,1,1]));numeric('sigma-powers',3,sum([1,4,9,16,25]));numeric('sigma-powers',4,sum([1,2,3,4].map(k=>2*k*k-k)));text('sigma-powers',5,'aₙ=2n+1');
numeric('telescoping',1,1);numeric('telescoping',2,-1/4);numeric('telescoping',3,sum([1,2,3,4,5].map(k=>1/(k*(k+1)))));
for(let n=1;n<=30;n++){assert(Math.abs(sum(Array.from({length:n},(_,i)=>3/((i+1)*(i+2))))-3*n/(n+1))<1e-10);assert(Math.abs(sum(Array.from({length:n},(_,i)=>2/((i+1)*(i+3))))-(1.5-1/(n+1)-1/(n+2)))<1e-10);assert.equal(2+sum(Array.from({length:n-1},(_,i)=>2*(i+1)+1)),n*n+1);}
numeric('space',1,Math.hypot(1,2,2));numeric('space',2,1*2+2*(-1)+2*0);text('space',3,'(2,1,2)');text('space',4,Math.round(Math.acos(1/(Math.sqrt(2)*Math.sqrt(2)))*180/Math.PI)+'°');numeric('space',5,(4-2)/2);
numeric('special-count',1,fac(4));numeric('special-count',2,fac(3)/fac(2));numeric('special-count',3,fac(5)/(fac(2)*fac(2)));numeric('special-count',4,fac(4));numeric('special-count',5,3**4);
numeric('binomial',1,choose(4,2));numeric('binomial',2,4*.5);numeric('binomial',3,choose(4,2)*.5**4);text('binomial',4,'平均2、分散4/3');text('binomial',5,'平均4、標準偏差3');
const probs=Array.from({length:7},(_,r)=>choose(6,r)*(1/3)**r*(2/3)**(6-r));assert(Math.abs(sum(probs)-1)<1e-10);const e=sum(probs.map((p,i)=>p*i)),v=sum(probs.map((p,i)=>p*(i-e)**2));assert(Math.abs(e-2)<1e-10&&Math.abs(v-4/3)<1e-10);
numeric('distribution',1,1-.25-.5);numeric('distribution',2,.5+2*.25);numeric('distribution',3,.5+4*.25-1);numeric('distribution',4,(3-1)/4);numeric('distribution',5,1/(2**2/2));
numeric('normal',1,Math.sqrt(100));numeric('normal',2,(60-50)/10);numeric('normal',3,2*.3413);numeric('normal',4,.5-.3413);numeric('normal',5,(70-100)/15);
numeric('inference',1,12/Math.sqrt(36));numeric('inference',2,10/Math.sqrt(100));text('inference',3,'['+(50-1.96)+','+(50+1.96)+']');text('inference',4,'['+(80-1.96*2)+','+(80+1.96*2)+']');text('inference',5,'1/2倍');
numeric('test',1,10/Math.sqrt(100));numeric('test',2,(52-50)/1);text('test',3,'Z=3、棄却する');text('test',4,'Z=1、棄却しない');text('test',5,'Z=−2、棄却する');
numeric('data',1,3);text('data',2,'x̄=2、ȳ=4');text('data',3,'Q₁=2.5、Q₃=6.5、四分位範囲4');const x=[1,2,3],yy=[2,4,6],cov=mean(x.map((n,i)=>(n-mean(x))*(yy[i]-mean(yy))));numeric('data',4,cov);numeric('data',5,cov/Math.sqrt(variance(x)*variance(yy)));
text('logic',5,'必要十分条件');numeric('function-graphs',1,2**0);text('function-graphs',2,'x>0');text('function-graphs',3,'y>0');text('function-graphs',4,'(1,0)');
text('similarity',1,'4:9');text('similarity',2,'8:27');numeric('similarity',3,8*3/2);numeric('similarity',4,5*2**2);numeric('similarity',5,Math.PI*3**2*4/3);
// Check every emitted supplement, so a stale generated file cannot mask edits.
for(const l of extras){const emitted=data.groups.find(g=>g.id===l.topic).lessons.find(a=>a.id===l.id);assert.deepEqual(emitted.questions,l.questions);assert.deepEqual(emitted.steps,l.steps);}
console.log('PASS: '+checked+' supplementary answers; enumerated probabilities, sum identities, root and interval checks. Conceptual explanations also need editorial review.');
