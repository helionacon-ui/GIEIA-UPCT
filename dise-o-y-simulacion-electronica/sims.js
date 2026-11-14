/* Figuras interactivas de Diseño y Simulación Electrónica. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- Diseño y Simulación Electrónica: figuras interactivas ---- */
const NQ=x=>{const r=Math.round(x*1000)/1000;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(3).replace(/0+$/,'')).replace('.',',');};
const N0=x=>(Math.abs(x)<0.5?0:x).toFixed(0);
const N1=x=>(Math.abs(x)<5e-2?0:x).toFixed(1).replace('.',',');
const N2=x=>(Math.abs(x)<5e-3?0:x).toFixed(2).replace('.',',');
const N3=x=>(Math.abs(x)<5e-4?0:x).toFixed(3).replace('.',',');
const ticks=(max,n)=>{const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),c=[1,2,2.5,5,10].find(k=>k*p>=raw)*p;const o=[];for(let v=c;v<=max*1.0001;v+=c)o.push(v);return o;};
const Rbox=(a,x,y,w,h,col,fill)=>{if(fill){a.g.fillStyle=col;a.g.globalAlpha=0.14;a.g.fillRect(x,y,w,h);a.g.globalAlpha=1;}
  a.g.strokeStyle=col;a.g.lineWidth=2;a.g.strokeRect(x,y,w,h);};
const curve=(a,pts,col,wd,dash)=>{a.g.strokeStyle=col;a.g.lineWidth=wd||2;a.g.setLineDash(dash||[]);a.g.beginPath();
  pts.forEach((p,i)=>i?a.g.lineTo(p[0],p[1]):a.g.moveTo(p[0],p[1]));a.g.stroke();a.g.setLineDash([]);};

/* T1 · Flujo de diseño */
SIMS.flujo=el=>build(el,{w:680,h:168,
 selects:[{k:'et',v:'1',l:'Etapa del flujo de diseño',opts:[['1','1 · Especificaciones'],['2','2 · Esquemático'],['3','3 · Simulación'],['4','4 · Huellas y componentes'],['5','5 · Colocación y ruteo'],['6','6 · Salida y fabricación'],['7','7 · Montaje y verificación']]}],
 draw(a){a.clear();const s=a.st,n=parseInt(s.et);
  const etapas=[
   ['Especificaciones','Qué tiene que hacer el circuito: tensiones, corrientes, rizado, ancho de banda, consumo, tamaño y coste. Sin esto no se puede elegir topología.','Error típico: empezar a dibujar antes de tener las especificaciones por escrito.'],
   ['Esquemático','Captura del circuito con componentes de librería. Cada componente necesita símbolo, huella y, si se va a simular, modelo.','Error típico: nudos que parecen unidos y no lo están. Comprueba siempre la netlist.'],
   ['Simulación','LTspice: .op, .tran, .ac, .dc, .noise, Monte Carlo. Se valida el funcionamiento antes de gastar en una placa.','Error típico: simular sin modelos reales (usar componentes ideales) y llevarse la sorpresa en el laboratorio.'],
   ['Huellas y componentes','A cada símbolo le corresponde un patrón (footprint) con sus pads, taladros y serigrafía, sacado de la hoja de características.','Error típico: huella con el pitch equivocado o con los pads demasiado pequeños para soldar a mano.'],
   ['Colocación y ruteo','Primero se colocan los componentes (conectores en el borde, desacoplos junto a los integrados) y después se rutea. La colocación decide el 80 % del resultado.','Error típico: rutear antes de colocar bien, o dejar el plano de masa troceado.'],
   ['Salida y fabricación','Gerber (una capa por fichero), taladro Excellon, fichero de posiciones y BOM. Se comprueba con un visor antes de enviar.','Error típico: enviar sin revisar el Gerber en un visor, o sin incluir el taladro.'],
   ['Montaje y verificación','Soldadura (manual o reflow), inspección y pruebas. Se compara lo medido con lo simulado.','Error típico: no dejar puntos de test ni acceso a las señales críticas.']];
  const W=86,H=72,y=40,x0=22;
  etapas.forEach((e,i)=>{const x=x0+i*(W+8), on=(i+1)===n;
    Rbox(a,x,y,W,H,on?C.a:C.grid,on);
    a.txt(String(i+1),x+8,y+18,on?C.a:C.muted,13);
    const pal=e[0].split(' ');
    pal.forEach((p,k)=>a.txt(p,x+W/2,y+34+k*13,on?C.a:C.muted,10,'center'));
    if(i<6)a.arrow(x+W,y+H/2,x+W+8,y+H/2,C.muted,1.4);});
  const e=etapas[n-1];
  a.txt('Etapa seleccionada: '+e[0],x0,y+H+26,C.a,14);
  a.html(`<b>Etapa ${n} · ${e[0]}.</b> ${e[1]}<br><b>Lo que más se falla aquí:</b> ${e[2]}
  <span class="hint">El flujo no es lineal del todo: de la simulación se vuelve al esquemático, y del DFM se vuelve al ruteo. Lo que no se puede es saltarse etapas: cada una produce los datos que necesita la siguiente.</span>`);}});

/* T2 · Rectificador con filtro: rizado */
SIMS.rectificador=el=>build(el,{w:680,h:270,
 sliders:[{k:'Vsec',v:12,min:6,max:30,step:0.5,l:'Secundario del trafo (eficaz)',u:'V'},
  {k:'C',v:470,min:47,max:4700,step:10,l:'Condensador',u:'µF'},
  {k:'IL',v:91,min:5,max:1000,step:5,l:'Corriente de carga',u:'mA'},
  {k:'f',v:50,min:50,max:60,step:10,l:'Frecuencia de red',u:'Hz'}],
 selects:[{k:'tipo',v:'onda',l:'Rectificador',opts:[['onda','Puente (onda completa)'],['media','Media onda']]}],
 draw(a){a.clear();const s=a.st;
  const caidas=s.tipo==='onda'?2*0.7:0.7;
  const Vpk=s.Vsec*Math.SQRT2-caidas;
  const T=1/s.f, td=s.tipo==='onda'?T/2:T;
  const I=s.IL/1000, C=s.C*1e-6;
  const Vr=I*td/C;
  const Vmin=Vpk-Vr, Vmed=Vpk-Vr/2;
  const ox=50,oy=236,W=352,H=168;
  const Vmax=Math.max(Vpk*1.15,1);
  const X=t=>ox+t/(3*T)*W, Y=v=>oy-v/Vmax*H;
  a.line(ox,oy,ox+W+10,oy,C.muted,1.5);a.line(ox,Y(Vmax),ox,oy+6,C.muted,1.5);
  ticks(Vmax,4).forEach(v=>{a.line(ox,Y(v),ox+W,Y(v),C.grid,1);a.txt(N0(v),ox-6,Y(v)+4,C.muted,10,'right');});
  a.txt('V',ox+2,Y(Vmax)-8,C.text,12);
  // senoidal rectificada
  const ps=[];for(let t=0;t<=3*T;t+=T/400){
    const v=s.Vsec*Math.SQRT2*Math.sin(2*Math.PI*s.f*t);
    const vr=s.tipo==='onda'?Math.abs(v)-caidas:Math.max(v-caidas,0);
    ps.push([X(t),Y(Math.max(vr,0))]);}
  curve(a,ps,C.grid,1.6);
  // tension con condensador (aproximacion lineal de descarga)
  const pc=[];
  for(let t=0;t<=3*T;t+=T/600){
    const ph=(t%td)/td;
    // carga rapida al principio del periodo
    const v= ph<0.2 ? Vmin+(Vpk-Vmin)*(ph/0.2) : Vpk-Vr*((ph-0.2)/0.8);
    pc.push([X(t),Y(v)]);}
  curve(a,pc,C.a,2.5);
  a.line(ox,Y(Vpk),ox+W,Y(Vpk),C.c,1.2,[4,3]);a.txt('V pico '+N1(Vpk)+' V',ox+W,Y(Vpk)-6,C.c,10,'right');
  a.line(ox,Y(Vmin),ox+W,Y(Vmin),C.b,1.2,[4,3]);a.txt('V mín '+N1(Vmin)+' V',ox+W,Y(Vmin)+13,C.b,10,'right');
  a.arrow(ox+W*0.22,Y(Vpk),ox+W*0.22,Y(Vmin),C.f,1.6);
  a.txt('V_r',ox+W*0.22+6,Y((Vpk+Vmin)/2)+4,C.f,11);
  // panel
  const bx=472,by=34;
  a.txt('V pico = √2·V_sec − '+NQ(caidas)+' V',bx,by,C.muted,12);
  a.txt('= '+N1(Vpk)+' V',bx,by+22,C.c,12);
  a.txt('t descarga = '+(s.tipo==='onda'?'T/2':'T')+' = '+N1(td*1000)+' ms',bx,by+50,C.muted,12);
  a.txt('V_r = I·t/C = '+N2(Vr)+' Vpp',bx,by+78,C.f,13);
  a.txt('V medio = '+N1(Vmed)+' V',bx,by+106,C.muted,12);
  a.txt('V mínimo = '+N1(Vmin)+' V',bx,by+128,C.b,12);
  const C78=I*td/2;
  a.txt('Para V_r = 2 V: C = '+N0(C78*1e6)+' µF',bx,by+160,C.a,12);
  a.html(`Rectificador <b>${s.tipo==='onda'?'en puente':'de media onda'}</b> con filtro de ${NQ(s.C)} µF y ${NQ(s.IL)} mA de carga:<br>
  V_pico = √2·${NQ(s.Vsec)} − ${NQ(caidas)} = <b>${N1(Vpk)} V</b> · rizado V_r = I·t/C = <b>${N2(Vr)} V pp</b> · V mínimo = <b>${N1(Vmin)} V</b>.<br>
  ${s.tipo==='onda'?'El puente descarga el condensador sólo <b>media</b> red (10 ms a 50 Hz), así que para el mismo rizado necesita <b>la mitad</b> de capacidad que el de media onda.':'En media onda el condensador se descarga durante <b>todo</b> el periodo (20 ms): hace falta el doble de capacidad y las dos caídas de diodo se reducen a una.'}
  <span class="hint">Regla práctica del examen: el rizado se calcula con la <b>descarga lineal</b> I·t/C, no con la exponencial; el error es pequeño y el cálculo entra en dos líneas. Lo que decide el condensador es que <b>V mínimo siga por encima de V_salida + V_dropout</b> del regulador.</span>`);}});

/* T3 · Comparador zener / 78XX / LDO */
SIMS.regulador=el=>build(el,{w:680,h:280,
 sliders:[{k:'Vin',v:16,min:5,max:40,step:0.5,l:'Tensión de entrada (pico)',u:'V'},
  {k:'Vr',v:2,min:0.1,max:6,step:0.1,l:'Rizado de entrada',u:'Vpp'},
  {k:'Vo',v:12,min:1.2,max:24,step:0.1,l:'Tensión de salida',u:'V'},
  {k:'IL',v:83,min:1,max:1000,step:1,l:'Corriente de carga',u:'mA'}],
 draw(a){a.clear();const s=a.st;
  const I=s.IL/1000;
  const Vmin=s.Vin-s.Vr;
  const opts=[
   {n:'Zener + R',drop:0,rr:0,ok:Vmin>s.Vo+2,
    pd:(function(){const R=(Vmin-s.Vo)/(I+0.01);return (s.Vin-s.Vo)/R*s.Vo;})(),
    rip:(function(){const R=(Vmin-s.Vo)/(I+0.01);return s.Vr*20/(R+20);})(),
    nota:'barato y sencillo, pero disipa siempre y el rizado sólo se divide por el cociente Zz/(R+Zz)'},
   {n:'78XX',drop:2,rr:65,ok:Vmin>=s.Vo+2,pd:(s.Vin-s.Vr/2-s.Vo)*(I+0.008),
    rip:s.Vr/Math.pow(10,65/20),nota:'el clásico: 65 dB de rechazo de rizado, pero necesita 2 V de margen'},
   {n:'LDO',drop:0.3,rr:60,ok:Vmin>=s.Vo+0.3,pd:(s.Vin-s.Vr/2-s.Vo)*(I+0.001),
    rip:s.Vr/Math.pow(10,60/20),nota:'sólo 0,3 V de caída: ideal cuando la entrada está justa, pero exige condensador de salida con ESR adecuada'}];
  const bw=190,bh=190,by=56;
  opts.forEach((o,i)=>{const bx=30+i*(bw+22);
    Rbox(a,bx,by,bw,bh,o.ok?C.c:C.b,true);
    a.txt(o.n,bx+12,by+26,o.ok?C.c:C.b,16);
    a.txt(o.ok?'✓ válido aquí':'✗ sin margen suficiente',bx+12,by+48,o.ok?C.c:C.b,12);
    a.txt('V dropout: '+(o.drop?NQ(o.drop)+' V':'—'),bx+12,by+76,C.muted,12);
    a.txt('rizado salida: '+(o.rip<1e-3?(o.rip*1e6).toFixed(0)+' µV':N2(o.rip*1000)+' mV'),bx+12,by+100,C.f,12);
    a.txt('disipa: '+N2(o.pd)+' W',bx+12,by+124,C.a,12);
    const rend=s.Vo*I/(s.Vo*I+o.pd)*100;
    a.txt('rendimiento: '+N0(rend)+' %',bx+12,by+148,C.muted,12);
    // barra de rendimiento
    a.g.fillStyle=C.c;a.g.globalAlpha=.3;a.g.fillRect(bx+12,by+162,(bw-24)*rend/100,10);a.g.globalAlpha=1;
    a.g.strokeStyle=C.muted;a.g.lineWidth=1;a.g.strokeRect(bx+12,by+162,bw-24,10);});
  a.txt('Entrada: '+NQ(s.Vin)+' V de pico con '+NQ(s.Vr)+' Vpp de rizado ⇒ V mínima = '+N1(Vmin)+' V',30,32,C.text,13);
  const best=opts.filter(o=>o.ok).sort((x,y)=>x.pd-y.pd)[0];
  a.html(`Con V mínima de entrada <b>${N1(Vmin)} V</b> para sacar ${NQ(s.Vo)} V a ${NQ(s.IL)} mA:<br>
  ${opts.map(o=>`<b>${o.n}</b>: ${o.ok?'válido':'<b>no válido</b> (no llega al margen de caída)'}, rizado de salida ${o.rip<1e-3?(o.rip*1e6).toFixed(0)+' µV':N2(o.rip*1000)+' mV'}, disipa ${N2(o.pd)} W`).join(' · ')}.<br>
  ${best?`Mejor opción por disipación entre las válidas: <b>${best.n}</b> — ${best.nota}.`:'<b>Ninguna opción es válida:</b> la tensión mínima de entrada no da margen ni para un LDO. Hay que subir el secundario del trafo o el condensador.'}
  <span class="hint">La decisión del examen se toma con dos números: <b>V mínima de entrada</b> (que debe superar V_salida + V_dropout <b>en el valle del rizado</b>, no en el pico) y el <b>rechazo de rizado</b> que haga falta. El zener sólo sale a cuenta con corrientes pequeñas y poca exigencia de rizado.</span>`);}});

/* T4 · Disipador */
SIMS.disipador=el=>build(el,{w:680,h:250,
 sliders:[{k:'Pd',v:3,min:0.1,max:25,step:0.1,l:'Potencia disipada',u:'W'},
  {k:'Ta',v:40,min:0,max:70,step:1,l:'Temperatura ambiente',u:'°C'},
  {k:'Tj',v:125,min:85,max:175,step:5,l:'T de unión máxima',u:'°C'},
  {k:'Rjc',v:5,min:0.5,max:15,step:0.5,l:'Rth unión-cápsula',u:'°C/W'},
  {k:'Rcs',v:1,min:0,max:3,step:0.1,l:'Rth cápsula-disipador',u:'°C/W'},
  {k:'Rsa',v:5,min:0.5,max:70,step:0.5,l:'Rth disipador-ambiente',u:'°C/W'}],
 draw(a){a.clear();const s=a.st;
  const Rtot=s.Rjc+s.Rcs+s.Rsa;
  const Tjreal=s.Ta+s.Pd*Rtot;
  const Rmax=(s.Tj-s.Ta)/s.Pd;
  const Rsa_nec=Rmax-s.Rjc-s.Rcs;
  const ok=Tjreal<=s.Tj;
  // cadena termica
  const ox=50,oy=48,W=120;
  const nodos=[['unión',s.Ta+s.Pd*Rtot],['cápsula',s.Ta+s.Pd*(s.Rcs+s.Rsa)],['disipador',s.Ta+s.Pd*s.Rsa],['ambiente',s.Ta]];
  const res=[['R_jc',s.Rjc],['R_cs',s.Rcs],['R_sa',s.Rsa]];
  nodos.forEach((nd,i)=>{const x=ox+i*W;
    a.circ(x,oy,8,i===0?(ok?C.c:C.b):C.muted,true);
    a.txt(nd[0],x,oy-18,C.text,12,'center');
    a.txt(N1(nd[1])+' °C',x,oy+28,i===0?(ok?C.c:C.b):C.muted,12,'center');});
  res.forEach((r,i)=>{const x=ox+i*W;
    a.line(x+10,oy,x+W-10,oy,C.muted,2);
    Rbox(a,x+W/2-24,oy-11,48,22,C.f,true);
    a.txt(r[0],x+W/2,oy-16,C.f,10,'center');
    a.txt(NQ(r[1]),x+W/2,oy+4,C.f,11,'center');});
  // barras de salto termico
  const by=118,BW=430;
  a.txt('Reparto del salto térmico (ΔT = '+N1(s.Pd*Rtot)+' °C sobre el ambiente)',ox,by-8,C.text,12);
  let xx=ox;
  [[s.Rjc,'unión-cápsula',C.a],[s.Rcs,'cápsula-disip.',C.b],[s.Rsa,'disipador-amb.',C.c]].forEach(([r,nm,col])=>{
    const w=BW*r/Rtot;
    a.g.fillStyle=col;a.g.globalAlpha=.3;a.g.fillRect(xx,by,w,26);a.g.globalAlpha=1;
    a.g.strokeStyle=col;a.g.lineWidth=1.5;a.g.strokeRect(xx,by,w,26);
    if(w>70)a.txt(N1(s.Pd*r)+' °C',xx+w/2,by+17,col,11,'center');
    xx+=w;});
  a.txt('T unión = '+N1(Tjreal)+' °C'+(ok?' ✓':' ✗ supera el límite'),ox,by+58,ok?C.c:C.b,15);
  a.txt('R_sa necesaria ≤ '+(Rsa_nec>0?N1(Rsa_nec)+' °C/W':'imposible: no basta ni con R_sa = 0'),ox,by+84,C.a,13);
  a.html(`Cadena térmica: T_j = T_a + P·(R_jc + R_cs + R_sa) = ${NQ(s.Ta)} + ${NQ(s.Pd)}·${N1(Rtot)} = <b>${N1(Tjreal)} °C</b>, frente al límite de ${NQ(s.Tj)} °C ⇒ <b>${ok?'cumple':'NO cumple'}</b>.<br>
  Resistencia térmica total admisible = (T_j − T_a)/P = <b>${N1(Rmax)} °C/W</b> ⇒ el disipador debe tener <b>R_sa ≤ ${Rsa_nec>0?N1(Rsa_nec)+' °C/W':'— (imposible)'}</b>.<br>
  ${Rsa_nec>40?'Con esa exigencia tan floja, el encapsulado <b>al aire</b> (TO-220 ≈ 65 °C/W) podría bastar: comprueba si R_ja sin disipador ya cumple.':Rsa_nec>0?'Hay que montar disipador: busca uno de catálogo con R_sa menor que ese valor, y no olvides la <b>pasta térmica</b> o el aislante, que es lo que fija R_cs.':'Ni con R_sa = 0 se cumple: hay que reducir la potencia disipada (otra topología, un conmutado) o bajar la temperatura ambiente.'}
  <span class="hint">Las tres resistencias se suman como en serie. La que puedes elegir es <b>R_sa</b>; R_jc la fija el fabricante del chip y R_cs el método de montaje (0,1 °C/W con pasta, hasta 2 °C/W con aislante de mica). Sube la potencia y verás cómo el disipador pasa de ser opcional a imposible: ése es el momento de pasar a una fuente conmutada.</span>`);}});

/* T5 · Respuesta en frecuencia (Bode) de un RC */
SIMS.bode=el=>build(el,{w:680,h:272,
 sliders:[{k:'R',v:1.59,min:0.1,max:100,step:0.01,l:'R',u:'kΩ'},
  {k:'C',v:100,min:1,max:1000,step:1,l:'C',u:'nF'},
  {k:'fm',v:1000,min:10,max:100000,step:10,l:'Frecuencia del cursor',u:'Hz'}],
 selects:[{k:'tipo',v:'bajo',l:'Tipo de filtro',opts:[['bajo','Paso bajo RC'],['alto','Paso alto RC']]}],
 draw(a){a.clear();const s=a.st;
  const R=s.R*1000, C=s.C*1e-9, fc=1/(2*Math.PI*R*C);
  const H=f=>{const x=f/fc;return s.tipo==='bajo'?1/Math.sqrt(1+x*x):x/Math.sqrt(1+x*x);};
  const PH=f=>{const x=f/fc;return s.tipo==='bajo'?-Math.atan(x)*180/Math.PI:(90-Math.atan(x)*180/Math.PI);};
  const ox=60,oy=210,W=388,H1=160;
  const f1=1,f2=1e6, L=f=>Math.log10(f);
  const X=f=>ox+(L(f)-L(f1))/(L(f2)-L(f1))*W;
  const Y=db=>oy-(db+60)/60*H1;
  a.line(ox,Y(0),ox+W,Y(0),C.muted,1.2);
  a.line(ox,oy-H1,ox,oy+8,C.muted,1.5);
  for(let d=0;d<=6;d++){const f=Math.pow(10,d);a.line(X(f),oy-H1,X(f),oy+4,C.grid,1);
    a.txt(f>=1000?(f/1000)+'k':String(f),X(f),oy+20,C.muted,10,'center');}
  a.txt('Hz',ox+W+2,oy+34,C.muted,10,'center');
  [0,-20,-40,-60].forEach(db=>{a.line(ox,Y(db),ox+W,Y(db),C.grid,1);a.txt(db+' dB',ox-6,Y(db)+4,C.muted,10,'right');});
  const p=[];for(let k=0;k<=400;k++){const f=Math.pow(10,L(f1)+(L(f2)-L(f1))*k/400);
    p.push([X(f),Y(20*Math.log10(Math.max(H(f),1e-6)))]);}
  curve(a,p,C.a,2.5);
  // asintotas
  if(s.tipo==='bajo'){a.line(X(f1),Y(0),X(fc),Y(0),C.grid,1.5,[5,4]);
    a.line(X(fc),Y(0),X(f2),Y(-20*Math.log10(f2/fc)),C.grid,1.5,[5,4]);}
  else{a.line(X(fc),Y(0),X(f2),Y(0),C.grid,1.5,[5,4]);
    a.line(X(f1),Y(-20*Math.log10(fc/f1)),X(fc),Y(0),C.grid,1.5,[5,4]);}
  a.line(X(fc),oy-H1,X(fc),oy,C.c,1.5,[4,3]);
  a.txt('f_c = '+(fc>=1000?N2(fc/1000)+' kHz':N1(fc)+' Hz'),X(fc),oy+36,C.c,11,'center');
  a.circ(X(fc),Y(-3.01),5,C.c,true);a.txt('−3 dB',X(fc)-8,Y(-3.01)-8,C.c,10,'right');
  const g=20*Math.log10(H(s.fm));
  a.circ(X(s.fm),Y(g),6,C.b,true);
  a.line(X(s.fm),oy-H1,X(s.fm),oy,C.b,1.2,[3,3]);
  if(Math.abs(X(s.fm)-X(fc))>48) a.txt(N1(g)+' dB',X(s.fm)+8,Y(g)+16,C.b,11);
  // panel
  const bx=478,by=34;
  a.txt('f_c = 1/(2πRC)',bx,by,C.muted,12);
  a.txt('= '+(fc>=1000?N2(fc/1000)+' kHz':N1(fc)+' Hz'),bx,by+22,C.c,13);
  a.txt('En el cursor ('+(s.fm>=1000?NQ(s.fm/1000)+' kHz':NQ(s.fm)+' Hz')+'):',bx,by+54,C.text,12);
  a.txt('|H| = '+N3(H(s.fm))+'  ('+N1(g)+' dB)',bx,by+76,C.b,12);
  a.txt('fase = '+N1(PH(s.fm))+'°',bx,by+98,C.b,12);
  a.txt('τ = RC = '+(R*C>=1e-3?N2(R*C*1000)+' ms':N1(R*C*1e6)+' µs'),bx,by+130,C.muted,12);
  a.txt('pendiente: −20 dB/década',bx,by+156,C.a,12);
  a.html(`Filtro <b>${s.tipo==='bajo'?'paso bajo':'paso alto'}</b> RC con R = ${NQ(s.R)} kΩ y C = ${NQ(s.C)} nF ⇒ <b>f_c = ${fc>=1000?N2(fc/1000)+' kHz':N1(fc)+' Hz'}</b> y τ = RC = ${R*C>=1e-3?N2(R*C*1000)+' ms':N1(R*C*1e6)+' µs'}.<br>
  En la frecuencia del cursor: |H| = ${N3(H(s.fm))} = <b>${N1(g)} dB</b> con un desfase de <b>${N1(PH(s.fm))}°</b>.<br>
  En f_c la ganancia es exactamente <b>−3,01 dB</b> (0,707) y la fase ${s.tipo==='bajo'?'−45°':'+45°'}; a partir de ahí la pendiente es de <b>−20 dB/década</b> (un polo).
  <span class="hint">Esto es lo que devuelve un análisis <b>.ac</b> en LTspice. Para leerlo en el examen basta con las asíntotas (las líneas discontinuas): plana hasta f_c y luego −20 dB por década. Un filtro de segundo orden caería a −40 dB/década.</span>`);}});

/* T6 · Huella: pads, pitch y taladro */
SIMS.huella=el=>build(el,{w:680,h:260,
 sliders:[{k:'pitch',v:2.54,min:0.5,max:5,step:0.01,l:'Paso entre pines (pitch)',u:'mm'},
  {k:'np',v:8,min:2,max:20,step:1,l:'Número de pines',u:''},
  {k:'dpin',v:0.6,min:0.2,max:1.5,step:0.05,l:'Diámetro del terminal',u:'mm'},
  {k:'pad',v:1.8,min:0.8,max:4,step:0.1,l:'Diámetro del pad',u:'mm'}],
 selects:[{k:'tipo',v:'th',l:'Montaje',opts:[['th','Through-hole (DIP)'],['smd','SMD (SOIC)']]}],
 draw(a){a.clear();const s=a.st;
  const taladro=s.dpin+0.2;
  const anillo=(s.pad-taladro)/2;
  const fila=Math.ceil(s.np/2);
  const esc=Math.min(22, 420/(fila*s.pitch));
  const cx=230,cy=128;
  const W=(fila-1)*s.pitch*esc, Hh=(s.tipo==='th'?7.62:5.0)*esc;
  // cuerpo
  Rbox(a,cx-W/2-6*esc*0.2,cy-Hh/2,W+2.4*esc,Hh,C.muted,true);
  for(let i=0;i<fila;i++){
    const x=cx-W/2+i*s.pitch*esc;
    [[-1],[1]].forEach(([sg])=>{
      const y=cy+sg*Hh/2;
      if(s.tipo==='th'){
        a.circ(x,y,s.pad*esc/2,C.a,true);
        a.g.fillStyle=C.bg;a.g.beginPath();a.g.arc(x,y,taladro*esc/2,0,Math.PI*2);a.g.fill();
        a.g.strokeStyle=C.a;a.g.lineWidth=1;a.g.stroke();
      } else {
        a.g.fillStyle=C.a;a.g.globalAlpha=.8;a.g.fillRect(x-0.3*esc,y-0.9*esc,0.6*esc,1.8*esc);a.g.globalAlpha=1;}
    });}
  // cotas
  const x0=cx-W/2, x1=x0+s.pitch*esc;
  a.arrow(x0,cy-Hh/2-26,x1,cy-Hh/2-26,C.f,1.6);
  a.txt('pitch '+NQ(s.pitch)+' mm',x0+2,cy-Hh/2-32,C.f,11);
  a.txt('pin 1',x0-10,cy+Hh/2+30,C.b,11);
  a.circ(x0,cy+Hh/2,s.pad*esc/2+3,C.b,false);
  // panel
  const bx=440,by=58;
  a.txt(s.tipo==='th'?'Through-hole':'SMD',bx,by-18,C.text,13);
  if(s.tipo==='th'){
    a.txt('taladro = d_pin + 0,2 = '+NQ(taladro)+' mm',bx,by,C.muted,12);
    a.txt('anillo (annular ring)',bx,by+26,C.f,12);
    a.txt('= (pad − taladro)/2 = '+N2(anillo)+' mm',bx,by+48,anillo>=0.25?C.c:C.b,12);
    a.txt(anillo>=0.25?'✓ supera el mínimo típico (0,25 mm)':'✗ anillo estrecho: riesgo de rotura',bx,by+74,anillo>=0.25?C.c:C.b,12);
  } else {
    a.txt('pads de 0,6 × 1,8 mm',bx,by,C.muted,12);
    a.txt('separación entre pads = '+N2(s.pitch-0.6)+' mm',bx,by+26,s.pitch-0.6>=0.2?C.c:C.b,12);
    a.txt(s.pitch-0.6>=0.2?'✓ fabricable sin problemas':'✗ demasiado juntos para el proceso',bx,by+52,s.pitch-0.6>=0.2?C.c:C.b,12);}
  a.txt('huella total ≈ '+N1((fila-1)*s.pitch+s.pad+1)+' × '+NQ(s.tipo==='th'?7.62+s.pad:5+1.8)+' mm',bx,by+110,C.a,12);
  a.txt('pines: '+NQ(s.np)+' ('+fila+' por fila)',bx,by+136,C.muted,12);
  a.html(`Huella de ${NQ(s.np)} pines con paso <b>${NQ(s.pitch)} mm</b> ${s.tipo==='th'?'en through-hole':'en SMD'}.<br>
  ${s.tipo==='th'?`Taladro = diámetro del terminal + 0,2 mm = <b>${NQ(taladro)} mm</b>; con un pad de ${NQ(s.pad)} mm queda un <b>anillo de ${N2(anillo)} mm</b> ${anillo>=0.25?'(suficiente)':'<b>(insuficiente: mínimo típico 0,25 mm)</b>'}.`:`Los pads SMD miden algo más que el terminal para formar el menisco de soldadura; con paso ${NQ(s.pitch)} mm quedan <b>${N2(s.pitch-0.6)} mm</b> entre pads ${s.pitch-0.6>=0.2?'(fabricable)':'<b>(por debajo del mínimo habitual de 0,2 mm)</b>'}.`}<br>
  El paso estándar del DIP es <b>2,54 mm</b> (100 mil) y el del SOIC, <b>1,27 mm</b>.
  <span class="hint">Dos reglas que evitan la mayoría de los desastres: el <b>taladro</b> se hace 0,2 mm mayor que el terminal (para que entre tras la metalización) y el <b>anillo</b> nunca baja de 0,25 mm (si no, se levanta el pad al soldar). Y el <b>pin 1</b> siempre marcado en la serigrafía: es lo primero que mira quien monta la placa.</span>`);}});

/* T7 · Componentes SMD */
SIMS.smd=el=>build(el,{w:680,h:270,
 selects:[{k:'cod',v:'0805',l:'Tamaño del chip',opts:[['0402','0402 (1,0 × 0,5 mm)'],['0603','0603 (1,6 × 0,8 mm)'],['0805','0805 (2,0 × 1,25 mm)'],['1206','1206 (3,2 × 1,6 mm)'],['1210','1210 (3,2 × 2,5 mm)'],['2512','2512 (6,3 × 3,2 mm)']]}],
 sliders:[{k:'d1',v:4,min:0,max:9,step:1,l:'1.ª cifra del código',u:''},
  {k:'d2',v:7,min:0,max:9,step:1,l:'2.ª cifra',u:''},
  {k:'mult',v:3,min:0,max:6,step:1,l:'Multiplicador (nº de ceros)',u:''}],
 draw(a){a.clear();const s=a.st;
  const tab={'0402':[1.0,0.5,0.0625,'manual muy difícil'],'0603':[1.6,0.8,0.1,'manual con práctica'],
   '0805':[2.0,1.25,0.125,'manual cómodo'],'1206':[3.2,1.6,0.25,'manual fácil'],
   '1210':[3.2,2.5,0.5,'manual fácil'],'2512':[6.3,3.2,1.0,'manual fácil']};
  const [L,W,P,sold]=tab[s.cod];
  const R=(s.d1*10+s.d2)*Math.pow(10,s.mult);
  const fmt=v=>v>=1e6?(v/1e6)+' MΩ':v>=1e3?(v/1e3)+' kΩ':v+' Ω';
  // dibujo a escala, alineados por la base
  const esc=26, base=118;
  let xx=44;
  ['0402','0603','0805','1206','1210','2512'].forEach(k=>{
    const [l,w]=tab[k], on=k===s.cod;
    const bw=l*esc, bh=w*esc, x=xx, y=base-bh;
    a.g.fillStyle=on?C.a:C.grid;a.g.globalAlpha=on?.35:.25;a.g.fillRect(x,y,bw,bh);a.g.globalAlpha=1;
    a.g.strokeStyle=on?C.a:C.muted;a.g.lineWidth=on?2:1;a.g.strokeRect(x,y,bw,bh);
    a.g.fillStyle=on?C.a:C.muted;a.g.globalAlpha=.6;
    a.g.fillRect(x,y,bw*0.22,bh);a.g.fillRect(x+bw-bw*0.22,y,bw*0.22,bh);a.g.globalAlpha=1;
    a.txt(k,x+bw/2,base+16,on?C.a:C.muted,11,'center');
    a.txt(tab[k][2]+' W',x+bw/2,base+30,C.muted,9,'center');
    xx += bw + 34;});
  a.line(40,base,xx-24,base,C.grid,1);
  a.txt('Tamaños a escala (el código son las dimensiones en centésimas de pulgada)',40,30,C.text,12);
  // codigo
  const by=180;
  a.txt('Código de 3 cifras: '+s.d1+s.d2+s.mult+'  ⇒  '+fmt(R),40,by,C.a,16);
  a.txt('= '+s.d1+s.d2+' × 10^'+s.mult+' Ω',40,by+26,C.muted,12);
  a.txt('Tamaño '+s.cod+': '+NQ(L)+' × '+NQ(W)+' mm · '+P+' W · soldadura '+sold,40,by+54,C.f,12);
  a.txt('Equivalente E24 más próximo: '+fmt(R),40,by+78,C.muted,11);
  a.html(`<b>${s.cod}</b>: ${NQ(L)} × ${NQ(W)} mm, potencia nominal <b>${P} W</b>, soldadura ${sold}. El código del tamaño son las dimensiones en <b>centésimas de pulgada</b> (0805 = 0,08 × 0,05 ").<br>
  Código de resistencia <b>${s.d1}${s.d2}${s.mult}</b> = ${s.d1}${s.d2} × 10<sup>${s.mult}</sup> = <b>${fmt(R)}</b>. Con cuatro cifras (serie E96) las tres primeras son significativas.<br>
  ${P<0.15?'Con esta potencia hay que vigilar la disipación: a 0,125 W una resistencia de 100 Ω sólo admite 35 mA.':'Potencia holgada para señal; para potencia se usan 1206, 1210 o 2512.'}
  <span class="hint">El SMD no es sólo «más pequeño»: reduce la inductancia parásita de los terminales (clave en alta frecuencia y en los condensadores de desacoplo) y permite el montaje automático. A cambio, por debajo de 0603 la soldadura manual se complica y hay que pensar en plantilla de pasta y horno de reflujo.</span>`);}});

/* T8 · Filtro activo Sallen-Key */
SIMS.activo=el=>build(el,{w:680,h:290,
 sliders:[{k:'R',v:10,min:1,max:100,step:0.5,l:'R1 = R2',u:'kΩ'},
  {k:'C',v:10,min:0.1,max:100,step:0.1,l:'C1 = C2',u:'nF'},
  {k:'Q',v:0.707,min:0.5,max:5,step:0.01,l:'Factor Q',u:''},
  {k:'n',v:2,min:1,max:8,step:1,l:'Orden del filtro',u:''}],
 draw(a){a.clear();const s=a.st;
  const R=s.R*1000,C=s.C*1e-9;
  const f0=1/(2*Math.PI*R*C);
  const K=3-1/s.Q;
  const H=f=>{const x=f/f0;
    const m2=1/Math.sqrt(Math.pow(1-x*x,2)+Math.pow(x/s.Q,2));
    return Math.pow(m2,Math.floor(s.n/2))*(s.n%2?1/Math.sqrt(1+x*x):1);};
  const ox=60,oy=230,W=378,H1=186;
  const f1=1,f2=1e6,L=f=>Math.log10(f);
  const X=f=>ox+(L(f)-L(f1))/(L(f2)-L(f1))*W, Y=db=>oy-(db+80)/100*H1;
  a.line(ox,Y(0),ox+W,Y(0),C.muted,1.2);a.line(ox,oy-H1,ox,oy+8,C.muted,1.5);
  for(let d=0;d<=6;d++){const f=Math.pow(10,d);a.line(X(f),oy-H1,X(f),oy+4,C.grid,1);
    a.txt(f>=1000?(f/1000)+'k':String(f),X(f),oy+20,C.muted,10,'center');}
  [20,0,-20,-40,-60,-80].forEach(db=>{a.line(ox,Y(db),ox+W,Y(db),C.grid,1);a.txt(db,ox-6,Y(db)+4,C.muted,10,'right');});
  a.txt('dB',ox-6,oy-H1-4,C.muted,10,'right');a.txt('Hz',ox+W+2,oy+34,C.muted,10,'center');
  const p=[];for(let k=0;k<=400;k++){const f=Math.pow(10,L(f1)+(L(f2)-L(f1))*k/400);
    const db=20*Math.log10(Math.max(H(f),1e-8));
    if(db<-80)break;
    p.push([X(f),Y(Math.min(db,20))]);}
  curve(a,p,C.a,2.5);
  a.line(X(f0),oy-H1,X(f0),oy,C.c,1.5,[4,3]);
  a.txt('f_0 = '+(f0>=1000?N2(f0/1000)+' kHz':N1(f0)+' Hz'),X(f0)+6,oy-H1+14,C.c,11);
  const pico=20*Math.log10(H(f0));
  a.circ(X(f0),Y(pico),5,C.b,true);a.txt(N1(pico)+' dB',X(f0)-8,Y(pico)+16,C.b,11,'right');
  const bx=478,by=40;
  a.txt('f_0 = 1/(2πRC)',bx,by,C.muted,12);
  a.txt('= '+(f0>=1000?N2(f0/1000)+' kHz':N1(f0)+' Hz'),bx,by+22,C.c,13);
  a.txt('Q = '+NQ(s.Q),bx,by+50,C.b,12);
  a.txt('K = 3 − 1/Q = '+N3(K),bx,by+72,C.f,12);
  a.txt('(ganancia del AO: R_b/R_a = '+N3(K-1)+')',bx,by+92,C.muted,11);
  a.txt('orden '+NQ(s.n)+' ⇒ '+N0(-20*s.n)+' dB/década',bx,by+122,C.a,12);
  a.txt('en f_0: '+N1(pico)+' dB',bx,by+148,C.b,12);
  const tipo=Math.abs(s.Q-0.707)<0.02?'Butterworth (máximamente plano)':s.Q<0.707?'sobreamortiguado (tipo Bessel)':'con pico de resonancia (tipo Chebyshev)';
  a.txt(tipo.split(' ')[0],bx,by+176,C.c,12);
  a.html(`Sallen-Key paso bajo con R = ${NQ(s.R)} kΩ y C = ${NQ(s.C)} nF ⇒ <b>f_0 = ${f0>=1000?N2(f0/1000)+' kHz':N1(f0)+' Hz'}</b>; con Q = ${NQ(s.Q)} la ganancia del amplificador debe ser <b>K = 3 − 1/Q = ${N3(K)}</b>, es decir, R_b/R_a = ${N3(K-1)}.<br>
  Respuesta <b>${tipo}</b>: en f_0 la ganancia vale ${N1(pico)} dB y la caída asintótica es de <b>${N0(-20*s.n)} dB/década</b> (orden ${NQ(s.n)}).<br>
  ${s.Q>1.2?'Con Q alto aparece un <b>pico</b> antes del corte: corta más rápido, pero suena «resonante» y da sobreoscilación en el transitorio.':Math.abs(s.Q-0.707)<0.02?'Q = 0,707 es el caso <b>Butterworth</b>: la respuesta más plana posible en la banda de paso. Es el valor por defecto.':'Con Q bajo la transición es suave y el transitorio limpio, a costa de una selectividad peor.'}
  <span class="hint">Frente al RC pasivo, el activo aporta tres cosas: <b>no carga</b> la etapa anterior, permite <b>ganancia</b> y permite elegir <b>Q</b>. El precio es alimentación, ruido del operacional y un ancho de banda limitado por el GBW. En LTspice, el análisis <b>.ac dec 100 1 1Meg</b> dibuja exactamente esta curva.</span>`);}});

/* T9 · Ancho de pista y reglas de PCB */
SIMS.pista=el=>build(el,{w:680,h:260,
 sliders:[{k:'I',v:1,min:0.1,max:10,step:0.1,l:'Corriente',u:'A'},
  {k:'dT',v:10,min:5,max:40,step:1,l:'Calentamiento admisible',u:'°C'},
  {k:'cu',v:35,min:17.5,max:105,step:17.5,l:'Espesor de cobre',u:'µm'},
  {k:'L',v:100,min:5,max:500,step:5,l:'Longitud de la pista',u:'mm'},
  {k:'V',v:12,min:3.3,max:400,step:0.1,l:'Tensión entre pistas',u:'V'}],
 selects:[{k:'capa',v:'ext',l:'Capa',opts:[['ext','Externa'],['int','Interna']]}],
 draw(a){a.clear();const s=a.st;
  const k=s.capa==='ext'?0.048:0.024;
  const A=Math.pow(s.I/(k*Math.pow(s.dT,0.44)),1/0.725); // mils^2
  const oz=s.cu/35;
  const w_mils=A/(1.378*oz), w=w_mils*0.0254;
  const rho=1.72e-8;
  const Rp=rho*(s.L/1000)/(w/1000*s.cu*1e-6);
  const dV=Rp*s.I, Pd=dV*s.I;
  // separacion minima segun IPC-2221 (B1, sin recubrimiento, interna de placa)
  const sep = s.V<=15?0.1 : s.V<=30?0.1 : s.V<=50?0.6 : s.V<=100?0.6 : s.V<=150?0.6 : s.V<=170?1.25 : s.V<=250?1.25 : 2.5;
  // dibujo de la pista
  const ox=50,cy=102;
  const esc=Math.min(60, 300/Math.max(w,0.2));
  a.g.fillStyle=C.grid;a.g.globalAlpha=.25;a.g.fillRect(ox,cy-70,380,140);a.g.globalAlpha=1;
  a.g.fillStyle=C.a;a.g.globalAlpha=.6;a.g.fillRect(ox+30,cy-w*esc/2,320,Math.max(w*esc,2));a.g.globalAlpha=1;
  a.arrow(ox+20,cy-w*esc/2-16,ox+20,cy+w*esc/2+16,C.f,1.5);
  a.txt('ancho = '+N2(w)+' mm',ox+26,cy-w*esc/2-22,C.f,12);
  a.txt(N1(w_mils)+' mils',ox+26,cy+w*esc/2+32,C.f,11);
  a.arrow(ox+40,cy+70+20,ox+330,cy+70+20,C.muted,1.4);
  a.txt(NQ(s.L)+' mm',ox+170,cy+70+14,C.muted,11,'center');
  // panel
  const bx=460,by=40;
  a.txt('IPC-2221 ('+(s.capa==='ext'?'externa':'interna')+')',bx,by-18,C.text,12);
  a.txt('A = (I/(k·ΔT^0,44))^(1/0,725)',bx,by,C.muted,11);
  a.txt('= '+N1(A)+' mils²',bx,by+20,C.muted,12);
  a.txt('cobre '+NQ(s.cu)+' µm = '+NQ(oz)+' oz',bx,by+44,C.muted,12);
  a.txt('ancho = '+N2(w)+' mm',bx,by+70,C.a,14);
  a.txt('R pista = '+(Rp<1?N1(Rp*1000)+' mΩ':N2(Rp)+' Ω'),bx,by+100,C.f,12);
  a.txt('caída = '+(dV<1?N0(dV*1000)+' mV':N2(dV)+' V'),bx,by+122,dV>0.1?C.b:C.c,12);
  a.txt('disipa '+(Pd<1?N0(Pd*1000)+' mW':N2(Pd)+' W'),bx,by+144,C.muted,12);
  a.txt('separación mínima',bx,by+176,C.c,12);
  a.txt('para '+NQ(s.V)+' V: '+NQ(sep)+' mm',bx,by+198,C.c,12);
  a.html(`Para <b>${NQ(s.I)} A</b> con ${NQ(s.dT)} °C de calentamiento en capa <b>${s.capa==='ext'?'externa':'interna'}</b> y cobre de ${NQ(s.cu)} µm (${NQ(oz)} oz), la norma IPC-2221 pide un ancho de <b>${N2(w)} mm</b> (${N1(w_mils)} mils).<br>
  Esa pista de ${NQ(s.L)} mm tiene una resistencia de <b>${Rp<1?N1(Rp*1000)+' mΩ':N2(Rp)+' Ω'}</b> ⇒ caída de <b>${dV<1?N0(dV*1000)+' mV':N2(dV)+' V'}</b> y ${Pd<1?N0(Pd*1000)+' mW':N2(Pd)+' W'} disipados.<br>
  Separación mínima entre conductores para ${NQ(s.V)} V: <b>${NQ(sep)} mm</b> (IPC-2221, conductores sin recubrir).<br>
  ${s.capa==='int'?'Las pistas <b>internas</b> evacuan peor el calor: para la misma corriente necesitan casi el doble de ancho.':'En capa externa el cobre refrigera mejor, así que la pista puede ser más estrecha que la equivalente interna.'}
  <span class="hint">Tres números que conviene llevar memorizados: con 35 µm (1 oz) en capa externa, <b>1 A ≈ 0,3 mm</b>, <b>2 A ≈ 0,8 mm</b> y <b>3 A ≈ 1,4 mm</b>. Y para la caída de tensión en pistas de alimentación, el criterio habitual es no pasar del <b>3 %</b> de la tensión.</span>`);}});

/* T10 · Capas y ficheros de salida */
SIMS.gerber=el=>build(el,{w:680,h:245,
 selects:[{k:'f',v:'top',l:'Fichero / capa',opts:[['top','Cobre superior (.GTL)'],['bot','Cobre inferior (.GBL)'],['sts','Máscara superior (.GTS)'],['sto','Serigrafía superior (.GTO)'],['stp','Pasta de soldadura (.GTP)'],['gko','Contorno de placa (.GKO)'],['drl','Taladros (.TXT Excellon)'],['bom','BOM y posiciones (.CSV)']]}],
 draw(a){a.clear();const s=a.st;
  const info={
   top:['Cobre superior','Las pistas, pads y planos de la cara de componentes. Es la capa que define la conectividad superior.','Comprueba que los planos no quedan troceados por las pistas y que ningún pad se ha quedado sin conectar.',0],
   bot:['Cobre inferior','Pistas y planos de la cara de soldadura. En placas de dos capas suele llevar el plano de masa.','Si hay plano de masa, evita cortarlo: cada corte obliga a la corriente de retorno a dar un rodeo y genera ruido.',5],
   sts:['Máscara de soldadura','El barniz verde (u otro color). Es una capa <b>negativa</b>: donde hay dibujo, NO hay máscara, es decir, el cobre queda expuesto.','Confundir positivo y negativo: el resultado sería una placa con todo el cobre cubierto o todo al aire.',1],
   sto:['Serigrafía','Las letras y símbolos blancos: referencias, polaridad, marca del pin 1 y datos del proyecto.','La serigrafía no debe caer sobre los pads: al imprimirse encima impide soldar.',2],
   stp:['Pasta de soldadura','Define las aberturas de la plantilla (stencil) por donde se deposita la pasta para el montaje SMD automático.','Sólo hace falta si hay montaje SMD con reflujo. Las aberturas se hacen algo menores que el pad.',3],
   gko:['Contorno de placa','El perfil exterior y los recortes interiores. Es lo que corta la fresadora.','Si falta, el fabricante no sabe por dónde cortar: es el fichero que más veces se olvida.',4],
   drl:['Taladros','Fichero Excellon con la posición y el diámetro de cada agujero, separando metalizados (PTH) y sin metalizar (NPTH).','Indica siempre si las medidas son del taladro <b>acabado</b> o antes de metalizar: la diferencia son 0,1 mm.',6],
   bom:['BOM y posiciones','La lista de materiales (referencia, valor, encapsulado, fabricante) y el fichero de posiciones X-Y con la rotación de cada componente.','El BOM sin número de fabricante obliga al ensamblador a interpretar, y ahí empiezan los errores.',7]};
  const [tit,desc,trampa,capa]=info[s.f];
  // pila de capas
  const ox=40,oy=30,W=300;
  const capas=[['serigrafía sup.',C.muted],['máscara sup.',C.c],['pasta sup.',C.f],['cobre sup.',C.a],['dieléctrico FR-4',C.grid],['cobre inf.',C.a],['máscara inf.',C.c],['serigrafía inf.',C.muted]];
  const orden={sto:0,sts:1,stp:2,top:3,gko:-1,bot:5,drl:-1,bom:-1};
  capas.forEach((cp,i)=>{const y=oy+i*26, on=(i===orden[s.f]);
    a.g.fillStyle=cp[1];a.g.globalAlpha=on?.45:.16;a.g.fillRect(ox,y,W,22);a.g.globalAlpha=1;
    a.g.strokeStyle=on?C.a:C.line||C.muted;a.g.lineWidth=on?2:1;a.g.strokeRect(ox,y,W,22);
    a.txt(cp[0],ox+8,y+16,on?C.a:C.muted,12);});
  if(s.f==='drl'){for(let i=0;i<4;i++){const x=ox+60+i*60;
    a.g.strokeStyle=C.b;a.g.lineWidth=2;a.g.beginPath();a.g.moveTo(x,oy+26*3);a.g.lineTo(x,oy+26*6+22);a.g.stroke();
    a.circ(x,oy+26*3,4,C.b,false);}
    a.txt('taladros pasantes',ox+W+10,oy+26*4,C.b,11);}
  if(s.f==='gko'){a.g.strokeStyle=C.b;a.g.lineWidth=3;a.g.setLineDash([6,4]);a.g.strokeRect(ox-6,oy-6,W+12,26*8+12);a.g.setLineDash([]);
    a.txt('contorno',ox+W+10,oy+100,C.b,11);}
  // texto
  const bx=370,by=40;
  a.txt(tit,bx,by,C.a,16);
  const wrap=(txt,x,yy,max,col,sz)=>{const ws=txt.replace(/<[^>]+>/g,'').split(' ');let ln='',k=0;
    ws.forEach(w=>{if((ln+w).length>max){a.txt(ln,x,yy+k*19,col,sz);ln=w+' ';k++;}else ln+=w+' ';});
    a.txt(ln,x,yy+k*19,col,sz);return k+1;};
  const k=wrap(desc,bx,by+28,40,C.text,13);
  a.txt('Lo que se falla:',bx,by+44+k*19,C.b,12);
  wrap(trampa,bx,by+64+k*19,40,C.muted,12.5);
  a.html(`<b>${tit}</b>. ${desc}<br><b>Lo que más se falla:</b> ${trampa}<br>
  <span class="hint">Un envío completo a fábrica lleva: los <b>Gerber de cobre</b> de todas las capas, <b>máscara</b> y <b>serigrafía</b> de ambas caras, el <b>contorno</b>, el <b>taladro Excellon</b> y, si hay montaje, la <b>pasta</b>, el <b>BOM</b> y el fichero de <b>posiciones</b>. Antes de enviarlo, ábrelo en un visor de Gerber independiente: es la única forma de ver lo que verá el fabricante.</span>`);}});

document.querySelectorAll("[data-sim]").forEach(function(el){var k=el.getAttribute("data-sim");if(SIMS[k]){try{SIMS[k](el);}catch(e){console.error("sim "+k,e);}}else console.warn("sim no encontrada: "+k);});
})();
