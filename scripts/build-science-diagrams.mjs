import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const out=fileURLToPath(new URL('../assets/images/materials/',import.meta.url));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=20)=>`<text x="${x}" y="${y}" font-size="${size}" fill="#203b34" stroke="none">${esc(s)}</text>`;
const line=(x,y,a,b,extra='')=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" ${extra}/>`;
const rect=(x,y,w,h,fill='#e4f0e9')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const circle=(x,y,r,fill='white')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const ellipse=(x,y,rx,ry,fill='#e4f0e9')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const arrow=(x,y,a,b)=>line(x,y,a,b,'marker-end="url(#arrow)"');
const path=(d,fill='none')=>`<path d="${d}" fill="${fill}"/>`;
function save(name,title,body){fs.writeFileSync(out+`science-${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 320" role="img" aria-labelledby="title"><title id="title">${esc(title)}</title><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#406758"/></marker></defs><rect width="560" height="320" fill="#fff"/><g stroke="#406758" stroke-width="2" stroke-linejoin="round" font-family="sans-serif">${body}</g></svg>\n`);}
save('water-heating','水の加熱曲線',arrow(60,280,525,280)+arrow(60,280,60,20)+text(10,30,'℃')+text(405,312,'加熱時間')+line(55,220,65,220)+text(20,226,'0')+line(55,80,65,80)+text(8,86,'100')+path('M75 265L130 220L210 220L320 80L430 80L490 35')+text(92,260,'A')+text(165,208,'B')+text(267,153,'C')+text(370,65,'D')+text(463,35,'E'));
save('flower','花の断面',path('M260 230Q255 175 270 165L270 82Q250 75 267 63L293 63Q310 75 290 82L290 165Q310 175 300 230Z','#f5e9ba')+path('M260 210Q205 155 195 90Q230 105 260 180','#f5dae7')+path('M300 210Q365 150 365 90Q325 112 300 180','#f5dae7')+line(225,190,218,110)+ellipse(218,100,13,9,'#edd5a8')+line(335,190,337,110)+ellipse(337,100,13,9,'#edd5a8')+circle(280,200,6)+circle(281,218,6)+path('M270 233L222 218L240 245L310 245L337 216L293 234','#a9c7a5')+line(279,245,279,292)+line(275,68,140,45)+text(112,45,'A')+line(218,98,123,112)+text(92,118,'B')+line(300,185,428,156)+text(435,162,'C')+line(282,200,426,221)+text(435,227,'D')+line(236,237,125,255)+text(92,262,'E'));
let leaves=path('M145 275Q30 135 145 35Q255 135 145 275Z','#e4f0e9')+line(145,275,145,35)+text(132,307,'A');
for(let y=85;y<250;y+=35){leaves+=line(145,y+30,80,y)+line(145,y+30,210,y)+line(110,y+14,112,y-5)+line(176,y+14,178,y-5);}
leaves+=path('M400 275Q342 120 400 35Q458 120 400 275Z','#e4f0e9')+text(388,307,'B');
for(const x of [382,400,418])leaves+=path(`M400 270Q${x} 160 400 45`);
save('leaves','葉脈の比較',leaves);
let cell=rect(150,55,260,220,'#cbdac5')+rect(161,66,238,198,'#f6faf4')+ellipse(275,165,43,44,'#decdea')+circle(272,165,9,'#bc99d1')+ellipse(209,126,33,43,'#e1eff7');
for(const [x,y] of [[351,101],[350,215],[199,221],[323,245]])cell+=ellipse(x,y,14,7,'#84ad70');
cell+=line(278,152,442,35)+text(454,38,'A')+line(205,114,93,42)+text(66,42,'B')+line(350,215,476,214)+text(487,220,'C')+line(399,160,483,120)+text(494,125,'D')+line(282,275,282,303)+text(302,307,'E');
save('plant-cell','植物細胞',cell);
save('circulation','血液の循環',rect(245,36,80,40)+text(268,63,'肺')+rect(245,137,80,45,'#f3d7d4')+text(255,165,'心臓')+arrow(250,136,250,80)+arrow(320,80,320,136)+text(83,107,'肺動脈')+text(344,107,'肺静脈')+rect(80,230,110,40)+text(111,257,'小腸')+rect(80,140,110,40)+text(111,167,'肝臓')+rect(366,230,110,40)+text(397,257,'腎臓')+arrow(245,170,192,160)+arrow(190,147,240,147)+arrow(280,183,146,229)+arrow(108,229,108,182)+arrow(325,169,420,229)+arrow(462,229,327,149)+text(217,306,'矢印は血液の流れる向き',16));
save('urinary','尿の通り道',path('M180 65Q115 85 140 140Q158 170 183 135Q157 113 185 90Z','#e5d6cd')+path('M380 65Q445 85 420 140Q402 170 377 135Q403 113 375 90Z','#e5d6cd')+path('M181 127Q210 155 247 229')+path('M379 127Q350 155 313 229')+ellipse(280,245,48,35,'#e5d6cd')+line(280,280,280,309)+line(155,80,80,35)+text(58,36,'A')+line(326,245,440,260)+text(451,267,'B')+line(357,170,440,167)+text(451,174,'C'));
save('eye','目の断面',circle(290,158,115,'#f3f8f7')+path('M195 95Q150 160 195 221')+ellipse(218,158,17,40,'#c6e3ec')+line(190,113,190,140)+line(190,177,190,205)+path('M313 48Q407 64 400 161Q402 250 313 268','none')+line(405,160,454,160,'stroke-width="12"')+arrow(64,160,159,160)+text(28,145,'光')+line(219,135,230,45)+text(226,35,'A')+line(190,120,102,55)+text(81,52,'B')+line(396,112,484,63)+text(488,64,'C'));
save('food-pyramid','生態系の数量的な関係',path('M280 35L465 282L95 282Z','#e4f0e9')+line(218,118,342,118)+line(157,201,403,201)+text(267,103,'A')+text(267,178,'A')+text(267,258,'B')+text(355,104,'二次消費者',16)+text(410,178,'一次消費者',16)+text(460,260,'植物',16));
save('volcano','火山の形',line(35,270,260,270)+path('M45 270Q72 262 95 154Q112 90 149 146Q173 256 251 270','#e4f0e9')+text(129,50,'A')+line(300,270,540,270)+path('M300 270Q420 206 540 270','#e4f0e9')+text(416,50,'B'));
let rocks=rect(40,55,205,220)+rect(310,55,205,220)+text(130,35,'A')+text(401,35,'B');
for(let i=0;i<55;i++){const x=50+(i*37)%180,y=65+(i*61)%196;rocks+=circle(x,y,1.4,'#406758');}
for(const [x,y] of [[85,95],[170,180],[105,230],[204,110]])rocks+=path(`M${x} ${y}l25 -8l14 23l-24 12l-15 -27Z`,'#b4c8b2');
for(let row=0;row<4;row++)for(let col=0;col<4;col++){const x=310+col*51,y=55+row*55;rocks+=path(`M${x} ${y}h51v55h-51Z`,(row+col)%3===0?'#94ac99':(row+col)%3===1?'#d8e2d4':'#f4f6ee');}
save('rock-texture','火成岩の組織',rocks);
let strata=text(168,29,'上')+text(168,314,'下');const layers=['れき','火山灰','泥','砂','火山灰','砂','れき'];
layers.forEach((s,i)=>{const y=40+i*36;strata+=rect(150,y,140,36,s==='火山灰'?'#75887b':'#e4f0e9')+text(315,y+25,s);if(s==='泥')for(let n=0;n<5;n++)strata+=line(152,y+5+n*5,288,y+5+n*5);if(s==='れき')for(let n=0;n<9;n++)strata+=circle(165+n%5*25,y+8+Math.floor(n/5)*16,3);});
save('strata','柱状図',strata);
let deformation=text(133,30,'A')+text(411,30,'B');
for(let i=0;i<4;i++){deformation+=path(`M40 ${70+i*43}H166L150 ${113+i*43}H40Z`,i%2?'#c4d5c6':'#e7eee1')+path(`M166 ${93+i*43}H257V${136+i*43}H150Z`,i%2?'#c4d5c6':'#e7eee1');deformation+=path(`M305 ${70+i*43}Q360 ${20+i*43} 410 ${70+i*43}T530 ${70+i*43}L530 ${113+i*43}Q475 ${163+i*43} 410 ${113+i*43}T305 ${113+i*43}Z`,i%2?'#c4d5c6':'#e7eee1');}
deformation+=line(177,50,130,296);save('deformation','断層としゅう曲',deformation);
let weather='';for(let i=0;i<5;i++){const x=65+i*105;weather+=circle(x,90,23,i===3?'#203b34':'white')+text(x-7,45,'ABCDE'[i]);if(i===1)weather+=line(x,67,x,113);if(i===2)weather+=circle(x,90,14);if(i===4)for(let a=0;a<3;a++){const rad=a*Math.PI/3;weather+=line(x+23*Math.cos(rad),90+23*Math.sin(rad),x-23*Math.cos(rad),90-23*Math.sin(rad));}}
weather+=circle(280,242,23)+circle(280,242,14)+line(259,232,150,187)+text(271,290,'F')+arrow(439,260,439,186)+text(426,174,'北');
for(let n=0;n<3;n++){const x=154+n*22,y=189+n*9;weather+=line(x,y,x+2,y-25);}
save('weather-symbols','天気記号',weather);
save('block','直方体',path('M100 150L225 75L460 75L335 150Z','#e1ebdd')+path('M100 150H335V263H100Z','#f3f7ed')+path('M335 150L460 75V188L335 263Z','#c5d8ca')+text(263,122,'A')+text(205,212,'B')+text(387,189,'C')+text(179,295,'10 cm')+text(357,285,'20 cm')+text(30,214,'6 cm'));
save('fronts','前線の断面',text(115,30,'A')+text(401,30,'B')+line(20,270,270,270)+line(300,270,545,270)+path('M20 70Q150 80 185 270H20Z','#d5e6f1')+text(42,220,'寒気')+text(190,195,'暖気')+arrow(65,244,144,244)+arrow(186,180,171,101)+path('M300 230L545 160V270H300Z','#d5e6f1')+text(455,248,'寒気')+text(315,184,'暖気')+arrow(328,215,478,161)+text(28,307,'急な前線面',17)+text(325,307,'ゆるやかな前線面',17));
save('sun-path','太陽の経路',line(40,275,520,275)+path('M50 270Q280 -180 510 270')+path('M90 270Q280 -10 470 270')+path('M145 270Q280 115 415 270')+text(276,43,'A')+text(276,119,'B')+text(276,196,'C')+text(25,309,'東')+text(267,309,'南')+text(508,309,'西')+text(365,25,'南の空',16));
let seasons=ellipse(280,160,198,110,'none')+circle(280,160,28,'#f3d783')+text(259,168,'太陽',16);
for(const [x,y,label] of [[82,160,'A'],[280,50,'B'],[478,160,'C'],[280,270,'D']]){seasons+=circle(x,y,24,'#d8eaf1')+line(x-18,y+34,x+18,y-34)+text(x+15,y-32,'北',12)+text(x-44,y+7,label);}
seasons+=arrow(100,204,203,262)+arrow(356,260,460,205)+arrow(465,112,355,59)+arrow(203,58,99,115)+text(16,309,'地軸の傾く向きは一定（距離や大きさは模式的）',15);save('seasons','地球の公転',seasons);
save('venus','金星の軌道',circle(280,157,119,'none')+circle(280,157,75,'none')+circle(280,157,20,'#f3d783')+text(264,142,'太陽',15)+circle(280,276,9,'#a7cbd4')+text(300,298,'地球')+circle(222,204.27,7,'#c8bfa2')+text(193,228,'A')+circle(280,232,7,'#c8bfa2')+text(269,261,'B')+circle(338,204.27,7,'#c8bfa2')+text(355,228,'C')+arrow(241,222,260,230)+text(20,30,'金星の公転の向き：A→B→C',17));
let meniscus=path('M210 38V287H340V38')+path('M212 179Q275 201 338 179L338 285H212Z','#d6eaf2')+text(222,25,'単位 mL',17);
for(let v=80;v<=90;v++){const y=250-(v-80)*15;meniscus+=line(v%5===0?280:300,y,338,y);if(v%5===0)meniscus+=text(354,y+6,String(v),24);}
save('meniscus','メスシリンダーの液面',meniscus);
let wind=circle(240,229,25)+line(240,204,240,254)+line(258,211,401,68)+arrow(70,90,70,35)+text(58,25,'北');
for(let n=0;n<4;n++){const x=391-n*25,y=78+n*25;wind+=line(x,y,x-35,y-2);}
save('wind-four','風向と風力',wind);
console.log('Generated 20 reusable science SVG diagrams.');
