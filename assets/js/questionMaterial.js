const svgNS = 'http://www.w3.org/2000/svg';
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function svgElement(tag, attributes, text) {
  const node = document.createElementNS(svgNS, tag);
  Object.entries(attributes).forEach(([key,value])=>node.setAttribute(key,String(value)));
  if (text !== undefined) node.textContent = text;
  return node;
}
function appendTable(container, headers, rows) {
  const wrapper=element('div',undefined,'material-table-wrap');
  const table=element('table',undefined,'material-table');
  const thead=element('thead');
  const head=element('tr');
  headers.forEach(label=>{const th=element('th',label);th.scope='col';head.append(th);});
  thead.append(head);
  const tbody=element('tbody');
  rows.forEach(values=>{const tr=element('tr');values.forEach((value,i)=>{
    const cell=element(i===0?'th':'td',String(value));
    if(i===0)cell.scope='row';
    tr.append(cell);
  });tbody.append(tr);});
  table.append(thead,tbody);wrapper.append(table);container.append(wrapper);
}
export function renderQuestionMaterial(container, material) {
  if (!container) return;
  container.replaceChildren();
  container.hidden = !material;
  if (!material) return;
  container.append(element('figcaption',material.title,'material-title'));
  if(material.type==='symbol') {
    const img=element('img');img.src=new URL(`../images/materials/${material.symbol}.svg`,import.meta.url).href;
    img.alt='設問で名称を問う地図記号';img.className='material-symbol';container.append(img);
  } else if(material.type==='image') {
    const img=element('img');img.src=new URL(`../images/materials/${material.image}.svg`,import.meta.url).href;
    img.alt=material.alt;img.className='material-image';container.append(img);
  } else if(material.type==='flow') {
    const list=element('ol',undefined,'material-flow');
    material.steps.forEach(step=>list.append(element('li',step)));
    container.append(list);
  } else if(material.type==='bar' || material.type==='line') {
    const w=560,h=300,left=66,top=20,bottom=55,right=18;
    const pw=w-left-right,ph=h-top-bottom;
    const svg=svgElement('svg',{viewBox:`0 0 ${w} ${h}`,role:'img','aria-label':material.description});
    svg.classList.add('material-chart');
    const max=material.max || Math.max(...material.values)*1.1;
    for(let i=0;i<=4;i++) {
      const y=top+ph*(1-i/4);
      svg.append(svgElement('line',{x1:left,y1:y,x2:w-right,y2:y,stroke:'#c7d8d2','stroke-width':1}));
      svg.append(svgElement('text',{x:left-8,y:y+5,'text-anchor':'end','font-size':14},String(Math.round(max*i/4*10)/10)));
    }
    svg.append(svgElement('text',{x:left,y:h-7,'font-size':14},material.unit || ''));
    const slot=pw/material.labels.length;
    const points=[];
    material.values.forEach((value,i)=>{
      const x=left+slot*(i+.5),y=top+ph*(1-value/max);
      points.push(`${x},${y}`);
      if(material.type==='bar') svg.append(svgElement('rect',{x:x-slot*.3,y,width:slot*.6,height:top+ph-y,fill:'#508a77'}));
      else svg.append(svgElement('circle',{cx:x,cy:y,r:4,fill:'#508a77'}));
      svg.append(svgElement('text',{x,y:h-32,'text-anchor':'middle','font-size':14},material.labels[i]));
    });
    if(material.type==='line')svg.append(svgElement('polyline',{points:points.join(' '),fill:'none',stroke:'#508a77','stroke-width':3}));
    container.append(svg);
    appendTable(container,[material.labelHeader || '項目',material.unit || '値'],material.labels.map((label,i)=>[label,material.values[i]]));
  }
  if(material.headers)appendTable(container,material.headers,material.rows);
  if(material.note)container.append(element('p',material.note,'material-note'));
}
