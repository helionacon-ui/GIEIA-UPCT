/* Figuras interactivas de Informática para la Automatización Industrial. Vanilla JS + canvas. */
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
/* ---------- utilidades ---------- */
const NR=(x,d)=>{if(!isFinite(x))return '—';return x.toFixed(d===undefined?2:d).replace('.',',');};
function box(a,x,y,w,h,col,fill,r){const g=a.g;r=r||8;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
 if(fill){g.save();g.globalAlpha=0.16;g.fillStyle=col;g.fill();g.restore();}g.strokeStyle=col;g.lineWidth=2;g.stroke();}
const hex=b=>b.toString(16).toUpperCase().padStart(2,'0');

/* 1 · Pirámide: en qué nivel va cada elemento */
const PIR=[['Sensor de temperatura',1,'Mide una magnitud del proceso y la convierte en señal.'],['Variador de frecuencia',1,'Actuador: acciona un motor según la consigna.'],['PLC',2,'Ejecuta el programa de control en ciclos de ms.'],['Robot industrial',2,'Controlador de máquina en el nivel de control.'],['SCADA',3,'Supervisa y registra; permite cambiar consignas.'],['HMI',3,'Pantalla con la que el operador supervisa.'],['Historiador',3,'Guarda las series temporales del proceso.'],['MES',4,'Gestiona la producción en tiempo real: órdenes, calidad.'],['ERP',5,'Gestión integral de la empresa: finanzas, compras, ventas.']];
SIMS.piramide=el=>build(el,{w:640,h:300,selects:[{k:'e',l:'Elemento',v:'0',opts:PIR.map((p,i)=>[String(i),p[0]])}],
 draw(a){a.clear();const e=PIR[+a.st.e],N=['Campo / proceso','Control','Supervisión','Operación / planificación','Gestión'],T=['µs – ms','ms – s','s – min','min – h','h – días'],cols=[C.f,C.c,C.d,C.e,C.a];
  for(let i=0;i<5;i++){const y=250-i*46,w=520-i*90,x=320-w/2,on=e[1]===i+1;a.g.save();a.g.globalAlpha=on?0.85:0.18;a.g.fillStyle=cols[i];a.g.fillRect(x,y-38,w,40);a.g.restore();
   a.txt((i+1)+' · '+N[i],320,y-13,on?C.bg:C.text,on?15:13,'center');a.txt(T[i],x-8,y-13,C.muted,12,'right');}
  a.html('<b>'+e[0]+'</b> → nivel '+e[1]+' ('+N[e[1]-1]+', '+T[e[1]-1]+'). '+e[2]);}});

/* 2 · TCP frente a UDP con pérdidas */
SIMS.tcpudp=el=>build(el,{w:660,h:290,sliders:[{k:'p',l:'Paquetes perdidos',v:2,min:0,max:5,step:1},{k:'n',l:'Paquetes enviados',v:8,min:4,max:10,step:1}],
 draw(a){a.clear();const n=a.st.n,k=Math.min(a.st.p,n),lost=new Set();for(let i=0;i<k;i++)lost.add(Math.floor((i+0.5)*n/k));
  const rows=[['UDP',60],['TCP',170]];a.txt('Origen',30,30,C.muted,12);a.txt('Destino',610,30,C.muted,12,'right');
  rows.forEach(([nm,y])=>{a.txt(nm,30,y-12,C.text,14);for(let i=0;i<n;i++){const x=80+i*(520/n),lo=lost.has(i);
    box(a,x,y,520/n-8,30,lo?C.d:C.c,true,5);a.txt(String(i+1),x+(520/n-8)/2,y+20,C.text,13,'center');
    if(lo&&nm==='UDP')a.txt('✕',x+(520/n-8)/2,y+52,C.d,16,'center');if(lo&&nm==='TCP')a.txt('↻ reenvío',x+(520/n-8)/2,y+52,C.e,11,'center');}});
  const rtt=1,udpT=n,tcpT=n+k*2;
  a.html(`UDP: llegan <b>${n-k} de ${n}</b> paquetes (${NR(100*(n-k)/n,0)} %), en ${udpT} intervalos de envío, sin avisar de la pérdida. `+
   `TCP: llegan <b>${n} de ${n}</b>, completos y en orden, pero tarda unos ${tcpT} intervalos: cada pérdida cuesta esperar el aviso (timeout o ACK duplicados) y reenviar. `+
   (k?'<br>Para un vídeo, UDP: un paquete perdido es un píxel de menos. Para un fichero de receta, TCP: un byte perdido lo estropea.':''));}});

/* 3 · Arbitraje CAN bit a bit */
SIMS.can=el=>build(el,{w:680,h:280,sliders:[{k:'a',l:'ID nodo A',v:0x123,min:0,max:2047,step:1},{k:'b',l:'ID nodo B',v:0x12B,min:0,max:2047,step:1}],
 draw(a){a.clear();const A=a.st.a,B=a.st.b,bits=x=>Array.from({length:11},(_,i)=>(x>>(10-i))&1);const ba=bits(A),bb=bits(B);let lose=-1;
  for(let i=0;i<11;i++)if(ba[i]!==bb[i]){lose=i;break;}
  a.txt('número de bit del identificador (del 10, el más significativo, al 0) →',20,14,C.muted,12);for(let i=0;i<11;i++)a.txt(String(10-i),130+i*46,30,C.muted,11,'center');
  const row=(nm,arr,y,col,me)=>{a.txt(nm,20,y+20,col,14);for(let i=0;i<11;i++){const off=lose>=0&&i>lose&&me;
     box(a,112+i*46,y,36,30,off?C.grid:col,!off,5);a.txt(off?'—':String(arr[i]),130+i*46,y+20,off?C.muted:C.text,15,'center');}};
  const aLoses=lose>=0&&ba[lose]===1,bLoses=lose>=0&&bb[lose]===1;
  row('A',ba,50,C.f,aLoses);row('B',bb,100,C.e,bLoses);
  const bus=ba.map((x,i)=>x&bb[i]);a.txt('bus',20,170,C.text,14);
  for(let i=0;i<11;i++){const v=(lose<0||i<=lose)?bus[i]:(aLoses?bb[i]:ba[i]);a.txt(String(v),130+i*46,170,C.text,15,'center');}
  if(lose>=0){a.line(130+lose*46,40,130+lose*46,182,C.d,2,[4,3]);a.txt('aquí se decide',130+lose*46,206,C.d,12,'center');}
  const hx=x=>'0x'+x.toString(16).toUpperCase().padStart(3,'0');
  a.html(lose<0?`Los dos identificadores son iguales (${hx(A)}): en CAN eso no puede pasar, cada mensaje debe tener un ID único.`:
   `En el bit ${10-lose}, ${aLoses?'A':'B'} envía un <b>1 (recesivo)</b> y lee un <b>0 (dominante)</b> en el bus: se retira y lo reintentará después. `+
   `Gana <b>${aLoses?'B':'A'}</b> con el ID ${hx(aLoses?B:A)}, el más bajo (${aLoses?B:A} &lt; ${aLoses?A:B}), y su trama sigue intacta: arbitraje no destructivo.`);}});

/* 4 · Trama MODBUS RTU con CRC-16 */
function crc16(b){let c=0xFFFF;for(const x of b){c^=x;for(let i=0;i<8;i++)c=(c&1)?(c>>1)^0xA001:c>>1;}return c;}
SIMS.modbus=el=>build(el,{w:680,h:220,selects:[{k:'f',l:'Función',v:'3',opts:[['3','03 · leer registros (holding)'],['6','06 · escribir un registro'],['1','01 · leer bobinas']]}],
 sliders:[{k:'s',l:'Esclavo',v:1,min:1,max:247,step:1},{k:'r',l:'Registro inicial',v:0,min:0,max:200,step:1},{k:'q',l:'Cantidad / valor',v:10,min:1,max:125,step:1}],
 draw(a){a.clear();const f=+a.st.f,fr=[a.st.s,f,a.st.r>>8,a.st.r&255,a.st.q>>8,a.st.q&255],c=crc16(fr),all=fr.concat([c&255,c>>8]);
  const lab=['esclavo','función','dir. alta','dir. baja',f===6?'valor alto':'cant. alta',f===6?'valor bajo':'cant. baja','CRC bajo','CRC alto'];
  const cols=[C.f,C.c,C.e,C.e,C.a,C.a,C.d,C.d];
  all.forEach((b,i)=>{const x=24+i*80;box(a,x,50,70,48,cols[i],true,6);a.txt(hex(b),x+35,82,C.text,18,'center');a.txt(lab[i],x+35,120,C.muted,11,'center');});
  a.txt('trama RTU (hexadecimal)',24,32,C.muted,12);a.txt('El CRC va con el byte bajo primero',24,170,C.muted,12);
  a.html('Trama: <b>'+all.map(hex).join(' ')+'</b> · CRC-16/MODBUS = 0x'+c.toString(16).toUpperCase().padStart(4,'0')+
   '. Comprobación: con esclavo 1, función 03, registro 0 y cantidad 10 sale <b>01 03 00 00 00 0A C5 CD</b>, la trama de ejemplo clásica. En MODBUS TCP el CRC desaparece y se añade la cabecera MBAP.');}});

/* 5 · Ciclo de scan del PLC */
SIMS.scan=el=>build(el,{w:680,h:250,sliders:[{k:'c',l:'Tiempo de ciclo',v:20,min:5,max:50,step:1,u:'ms'},{k:'d',l:'Duración del pulso',v:12,min:2,max:60,step:1,u:'ms'},{k:'o',l:'Inicio del pulso',v:31,min:0,max:60,step:1,u:'ms'}],
 draw(a){a.clear();const c=a.st.c,d=a.st.d,o=a.st.o,T=120,X=t=>40+t*(600/T);
  a.line(X(0),180,X(T),180,C.muted,1.5);for(let t=0;t<=T;t+=20)a.txt(t+' ms',X(t),200,C.muted,11,'center');
  a.txt('entrada',36,96,C.text,12,'right');a.line(X(0),110,X(o),110,C.text,2);a.line(X(o),110,X(o),70,C.text,2);a.line(X(o),70,X(o+d),70,C.text,2);a.line(X(o+d),70,X(o+d),110,C.text,2);a.line(X(o+d),110,X(T),110,C.text,2);
  let seen=null;a.txt('lecturas',36,160,C.text,12,'right');
  for(let t=0;t<=T;t+=c){const hit=t>=o&&t<o+d;if(hit&&seen===null)seen=t;a.line(X(t),130,X(t),170,hit?C.c:C.f,2);a.circ(X(t),150,5,hit?C.c:C.f,true);}
  a.html(seen!==null?`El PLC lee la entrada cada ${c} ms y la ve a los <b>${seen} ms</b> (${seen-o} ms después de empezar el pulso). Las salidas cambiarán al final de ese ciclo, así que el tiempo de reacción puede llegar a casi <b>dos ciclos</b>.`:
   `<b>El PLC no ve el pulso</b>: dura ${d} ms y cae entero entre dos lecturas. Para no perderlo, el pulso debe durar más que el ciclo (${d} ms ${d>c?'&gt;':'≤'} ${c} ms) o hay que usar una entrada con interrupción o un contador rápido.`);}});

/* 6 · OPC UA: lectura cíclica frente a suscripción */
SIMS.opcua=el=>build(el,{w:680,h:230,sliders:[{k:'n',l:'Variables en pantalla',v:200,min:10,max:2000,step:10},{k:'p',l:'Periodo de lectura cíclica',v:500,min:100,max:2000,step:100,u:'ms'},{k:'ch',l:'Cambios por variable y minuto',v:2,min:0,max:60,step:1},{k:'s',l:'Intervalo de muestreo',v:250,min:50,max:2000,step:50,u:'ms'}],
 draw(a){a.clear();const s=a.st,poll=s.n*1000/s.p,sub=s.n*s.ch/60,mx=Math.max(poll,sub,1);
  const bar=(y,v,col,t)=>{a.txt(t,24,y+18,C.text,13);const w=440*Math.sqrt(v/mx);box(a,190,y,Math.max(w,2),28,col,true,4);a.txt(NR(v,v<10?1:0)+' valores/s',200+Math.max(w,2),y+19,C.text,13);};
  bar(40,poll,C.d,'Lectura cíclica');bar(100,sub,C.c,'Suscripción');a.txt('(escala de raíz cuadrada)',24,160,C.muted,11);
  a.html(`Lectura cíclica: ${s.n} variables cada ${s.p} ms = <b>${NR(poll,0)} valores/s</b>, cambien o no, y un cambio puede tardar hasta ${s.p} ms en verse. `+
   `Suscripción: solo viajan los cambios, <b>${NR(sub,1)} valores/s</b>, y se detectan en menos de ${s.s} ms. `+(sub>0?`Unas <b>${NR(poll/sub,0)} veces menos tráfico</b>.`:'Si nada cambia, no viaja nada.'));}});

/* 7 · Signal-slot: directa frente a en cola */
SIMS.eventos=el=>build(el,{w:680,h:270,selects:[{k:'t',l:'Tipo de conexión',v:'d',opts:[['d','Directa (mismo hilo)'],['q','En cola (otro hilo)']]}],sliders:[{k:'s',l:'Paso',v:5,min:1,max:5,step:1}],
 draw(a){a.clear();const q=a.st.t==='q',s=a.st.s;
  const ord=q?[['emisor','emit nivelCambiado(80)'],['emisor','la llamada se mete en la cola del receptor'],['emisor','continúa: «después de emit»'],['bucle','el bucle de eventos del receptor saca la llamada'],['receptor','slot setValue(80)']]
            :[['emisor','emit nivelCambiado(80)'],['receptor','slot setValue(80) se ejecuta ya'],['receptor','el slot termina'],['emisor','vuelve de emit'],['emisor','continúa: «después de emit»']];
  const cols={emisor:C.f,receptor:C.c,bucle:C.e};a.txt(q?'Hilo de trabajo  →  hilo de la GUI':'Todo en el mismo hilo',24,30,C.muted,12);
  ord.forEach((o,i)=>{const y=46+i*42,on=i<s;box(a,24,y,630,34,on?cols[o[0]]:C.grid,on,6);a.txt((i+1)+'. ['+o[0]+'] '+o[1],40,y+22,on?C.text:C.muted,13);});
  a.html(q?'En cola, <code>emit</code> vuelve <b>enseguida</b> y el slot se ejecuta <b>más tarde, en el hilo del receptor</b>. Es lo que permite que un hilo de trabajo actualice la interfaz sin peligro.':
   'En directa, el slot se ejecuta <b>dentro de la llamada a emit</b>, como una función normal: el emisor espera a que termine. Rápido, pero solo seguro dentro del mismo hilo.');}});

/* 8 · Condición de carrera */
SIMS.carrera=el=>build(el,{w:680,h:300,selects:[{k:'m',l:'Protección',v:'no',opts:[['no','Sin mutex'],['si','Con mutex']]}],sliders:[{k:'s',l:'Paso',v:7,min:0,max:7,step:1}],
 draw(a){a.clear();const mtx=a.st.m==='si',s=a.st.s;
  const seq=mtx?[['A','lock(m)'],['A','lee 5'],['A','suma → 6'],['A','escribe 6 · unlock'],['B','lock(m)'],['B','lee 6'],['B','suma → 7'],['B','escribe 7 · unlock']]
               :[['A','lee 5'],['B','lee 5'],['A','suma → 6'],['B','suma → 6'],['A','escribe 6'],['B','escribe 6']];
  let mem=5;const shown=seq.slice(0,Math.min(s,seq.length));shown.forEach(x=>{const m=x[1].match(/escribe (\d)/);if(m)mem=+m[1];});
  a.txt('Hilo A',110,30,C.f,14,'center');a.txt('Hilo B',330,30,C.e,14,'center');a.txt('contador',560,30,C.text,14,'center');
  seq.forEach((x,i)=>{const y=44+i*30,on=i<s,col=x[0]==='A'?C.f:C.e,cx=x[0]==='A'?30:250;box(a,cx,y,160,24,on?col:C.grid,on,5);a.txt(x[1],cx+80,y+17,on?C.text:C.muted,12,'center');});
  box(a,500,60,120,60,C.a,true,8);a.txt(String(mem),560,100,C.text,26,'center');
  const done=s>=seq.length;a.html(!done?'Avanza el paso para ver cómo se intercalan los dos hilos. Al principio el contador vale 5 y cada hilo hace contador++.':
   mtx?'Con mutex, B no puede entrar hasta que A sale: el contador acaba en <b>7</b>, correcto.':
   'Sin mutex, los dos leen 5 antes de que nadie escriba: el contador acaba en <b>6</b> y se ha <b>perdido un incremento</b>. No pasa siempre, solo con este intercalado: por eso es un error tan difícil de encontrar.');}});

/* 9 · Rate Monotonic: cota de Liu y Layland */
SIMS.rm=el=>build(el,{w:680,h:240,sliders:[{k:'c1',l:'C1',v:1,min:0.5,max:10,step:0.5,u:'ms'},{k:'t1',l:'T1',v:5,min:2,max:50,step:1,u:'ms'},{k:'c2',l:'C2',v:2,min:0.5,max:10,step:0.5,u:'ms'},{k:'t2',l:'T2',v:10,min:2,max:50,step:1,u:'ms'},{k:'c3',l:'C3',v:4,min:0.5,max:20,step:0.5,u:'ms'},{k:'t3',l:'T3',v:20,min:2,max:100,step:1,u:'ms'}],
 draw(a){a.clear();const s=a.st,T=[[s.c1,s.t1],[s.c2,s.t2],[s.c3,s.t3]],U=T.reduce((x,t)=>x+t[0]/t[1],0),L=3*(Math.pow(2,1/3)-1);
  const tasks=T.map((t,i)=>({c:t[0],t:t[1],i})).sort((x,y)=>x.t-y.t);let ok=true;const R=[];
  tasks.forEach((tk,k)=>{let r=tk.c,prev=0,it=0;while(r!==prev&&r<=tk.t&&it<200){prev=r;r=tk.c+tasks.slice(0,k).reduce((x,h)=>x+Math.ceil(prev/h.t)*h.c,0);it++;}R[tk.i]=r;if(r>tk.t)ok=false;});
  const X=u=>60+u*520;a.line(X(0),110,X(1.2),110,C.muted,1.5);[0,0.5,1].forEach(u=>a.txt(NR(u,1),X(u),130,C.muted,11,'center'));
  box(a,X(0),70,Math.min(U,1.2)*520,30,U<=L?C.c:(U<=1?C.e:C.d),true,4);a.line(X(L),56,X(L),114,C.c,2,[5,4]);a.txt('cota 0,780',X(L),50,C.c,12,'center');a.line(X(1),56,X(1),114,C.d,2,[5,4]);a.txt('U = 1',X(1)+4,50,C.d,12);
  a.txt('U = '+NR(U,3),X(Math.min(U,1.2))+6,90,C.text,14);
  T.forEach((t,i)=>a.txt(`T${i+1}: C/T = ${NR(t[0],1)}/${t[1]} = ${NR(t[0]/t[1],3)} · respuesta peor caso ${R[i]>t[1]?'&gt; plazo':NR(R[i],1)+' ms'}`.replace('&gt;','>'),60,165+i*22,R[i]>t[1]?C.d:C.text,13));
  a.html(`Utilización U = <b>${NR(U,3)}</b>. `+(U<=L?'Está por debajo de la cota de Liu y Layland para 3 tareas (0,780): <b>planificable seguro</b>.':U<=1?'Supera la cota (0,780) pero no 1: la prueba no lo garantiza y hay que mirar los tiempos de respuesta. '+(ok?'Aquí todos cumplen: <b>planificable</b>.':'Alguna tarea incumple su plazo: <b>no planificable</b>.'):'U &gt; 1: la CPU no da abasto. <b>No planificable</b> con ningún algoritmo.')+' Prioridad Rate Monotonic: a menor periodo, más prioridad.');}});

/* 10 · MQTT: niveles de QoS */
SIMS.mqtt=el=>build(el,{w:680,h:280,selects:[{k:'q',l:'QoS',v:'1',opts:[['0','QoS 0 · como mucho una vez'],['1','QoS 1 · al menos una vez'],['2','QoS 2 · exactamente una vez']]},{k:'l',l:'Qué se pierde',v:'ack',opts:[['no','Nada'],['pub','El mensaje (PUBLISH)'],['ack','La confirmación']]}],
 draw(a){a.clear();const q=+a.st.q,l=a.st.l;let steps=[],rec=0;
  if(q===0){steps=[['→','PUBLISH',l==='pub']];rec=l==='pub'?0:1;}
  if(q===1){if(l==='pub')steps=[['→','PUBLISH',true],['…','espera, no llega PUBACK',false],['→','PUBLISH (DUP)',false],['←','PUBACK',false]],rec=1;
   else if(l==='ack')steps=[['→','PUBLISH',false],['←','PUBACK',true],['→','PUBLISH (DUP)',false],['←','PUBACK',false]],rec=2;
   else steps=[['→','PUBLISH',false],['←','PUBACK',false]],rec=1;}
  if(q===2){if(l==='no')steps=[['→','PUBLISH',false],['←','PUBREC',false],['→','PUBREL',false],['←','PUBCOMP',false]];
   else if(l==='pub')steps=[['→','PUBLISH',true],['→','PUBLISH (DUP)',false],['←','PUBREC',false],['→','PUBREL',false],['←','PUBCOMP',false]];
   else steps=[['→','PUBLISH',false],['←','PUBREC',true],['→','PUBLISH (DUP)',false],['←','PUBREC',false],['→','PUBREL',false],['←','PUBCOMP',false]];rec=1;}
  a.txt('Cliente',90,26,C.text,14,'center');a.txt('Broker',590,26,C.text,14,'center');a.line(90,34,90,260,C.muted,1.5);a.line(590,34,590,260,C.muted,1.5);
  steps.forEach((s,i)=>{const y=54+i*36;if(s[0]==='…'){a.txt(s[1],340,y+4,C.muted,12,'center');return;}
   const x1=s[0]==='→'?90:590,x2=s[0]==='→'?590:90,xm=s[2]?(x1+x2)/2:x2;a.arrow(x1,y,xm,y,s[2]?C.d:C.c,2);if(s[2])a.txt('✕',xm,y+5,C.d,18,'center');a.txt(s[1],340,y-6,C.text,12,'center');});
  const pk=steps.filter(s=>s[0]!=='…').length;
  a.html(`Paquetes enviados: <b>${pk}</b>. El suscriptor recibe el mensaje <b>${rec}</b> ${rec===1?'vez':'veces'}. `+
   (q===0?'QoS 0 no confirma: si se pierde, se pierde. Bueno para lecturas frecuentes de sensores.':q===1?'QoS 1 reenvía hasta recibir PUBACK: no se pierde, pero si se perdió la confirmación llega <b>duplicado</b>. La aplicación debe tolerarlo.':'QoS 2 usa cuatro mensajes y el identificador del paquete para descartar duplicados: llega <b>exactamente una vez</b>, a cambio de más tráfico y retraso.'));}});

/* 11 · ROS2: topics, servicios y acciones */
SIMS.ros2=el=>build(el,{w:680,h:270,selects:[{k:'t',l:'Comunicación',v:'topic',opts:[['topic','Topic (publicación / suscripción)'],['srv','Servicio (petición / respuesta)'],['act','Acción (objetivo con realimentación)']]}],
 draw(a){a.clear();const t=a.st.t;
  if(t==='topic'){box(a,30,100,150,50,C.f,true);a.txt('/driver_laser',105,130,C.text,13,'center');box(a,260,105,160,40,C.e,true,20);a.txt('/scan',340,130,C.text,14,'center');
   [['/navegacion',40],['/mapa',110],['/visualizacion',180]].forEach(([n,y])=>{box(a,500,y,160,44,C.c,true);a.txt(n,580,y+27,C.text,13,'center');a.arrow(420,125,500,y+22,C.muted,2);});a.arrow(180,125,260,125,C.muted,2);
   a.html('Un nodo <b>publica</b> en el topic y todos los <b>suscritos</b> reciben cada mensaje. El publicador no sabe quién escucha: muchos a muchos, asíncrono y continuo. Tipo de mensaje <code>sensor_msgs/LaserScan</code>.');}
  if(t==='srv'){box(a,40,100,170,50,C.f,true);a.txt('cliente /hmi',125,130,C.text,13,'center');box(a,470,100,170,50,C.c,true);a.txt('servidor /plc_bridge',555,130,C.text,13,'center');
   a.arrow(210,112,470,112,C.e,2);a.txt('petición: ¿nivel del tanque 1?',340,100,C.text,12,'center');a.arrow(470,140,210,140,C.c,2);a.txt('respuesta: 72,4 %',340,164,C.text,12,'center');
   a.html('El cliente <b>pide</b> y <b>espera</b> una única respuesta. Uno a uno. Sirve para consultas y órdenes rápidas. Se define en un fichero <code>.srv</code> con la petición y la respuesta separadas por <code>---</code>.');}
  if(t==='act'){box(a,40,110,170,50,C.f,true);a.txt('cliente',125,140,C.text,13,'center');box(a,470,110,170,50,C.c,true);a.txt('servidor /mover_brazo',555,140,C.text,13,'center');
   const m=[['→','objetivo: ir a la posición P3',C.e],['←','aceptado',C.c],['←','feedback: 30 %',C.muted],['←','feedback: 75 %',C.muted],['←','resultado: llegado',C.c]];
   m.forEach((x,i)=>{const y=34+i*50,y2=y;const l=x[0]==='→';a.arrow(l?210:470,y2+(i>0?0:0)+ (i>=1?0:0),l?470:210,y2,x[2],2);a.txt(x[1],340,y2-6,C.text,12,'center');});
   a.html('Para tareas <b>largas</b>: el cliente envía un <b>objetivo</b>, recibe <b>realimentación</b> periódica del progreso y al final un <b>resultado</b>. Se puede <b>cancelar</b> a mitad. Por debajo son dos servicios y un topic.');}}});

/* 12 · Detección de anomalías con puntuación z */
SIMS.anomalia=el=>build(el,{w:680,h:260,sliders:[{k:'k',l:'Umbral k',v:3,min:1,max:5,step:0.1}],
 draw(a){a.clear();const k=a.st.k,N=200;let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const gauss=()=>{let u=0;for(let i=0;i<6;i++)u+=rnd();return (u-3)*1.414;};const x=[],fault=new Set([60,61,130,131,132,175]);
  for(let i=0;i<N;i++)x.push(50+2*gauss()+(fault.has(i)?(i===175?6:9):0));
  const base=x.filter((_,i)=>!fault.has(i)),mu=base.reduce((s,v)=>s+v,0)/base.length,sd=Math.sqrt(base.reduce((s,v)=>s+(v-mu)**2,0)/base.length);
  const X=i=>40+i*3,Y=v=>220-(v-35)*6;a.line(X(0),Y(mu),X(N),Y(mu),C.muted,1,[4,4]);a.line(X(0),Y(mu+k*sd),X(N),Y(mu+k*sd),C.d,1.5,[6,4]);a.line(X(0),Y(mu-k*sd),X(N),Y(mu-k*sd),C.d,1.5,[6,4]);
  let tp=0,fp=0,fn=0;for(let i=1;i<N;i++)a.line(X(i-1),Y(x[i-1]),X(i),Y(x[i]),C.f,1.4);
  for(let i=0;i<N;i++){const an=Math.abs(x[i]-mu)/sd>k;if(an&&fault.has(i))tp++;else if(an)fp++;else if(fault.has(i))fn++;if(an)a.circ(X(i),Y(x[i]),4,fault.has(i)?C.c:C.d,true);if(fault.has(i)&&!an)a.circ(X(i),Y(x[i]),5,C.e,false);}
  a.txt('μ ± k·σ',X(N)+4,Y(mu+k*sd)+4,C.d,11);
  a.html(`Media μ = ${NR(mu,1)}, desviación σ = ${NR(sd,2)}. Con k = ${NR(k,1)}: <b>${tp}</b> de ${fault.size} fallos detectados, <b>${fp}</b> falsas alarmas y <b>${fn}</b> fallos sin detectar (círculo hueco). `+(k<2?'Umbral bajo: muchas falsas alarmas, el operador acabará ignorándolas.':k>4?'Umbral alto: casi sin falsas alarmas, pero se escapan fallos.':'Zona de compromiso: k ≈ 3 es el valor de partida habitual.'));}});

document.querySelectorAll('[data-sim]').forEach(function(el){var k=el.getAttribute('data-sim'); if(SIMS[k]){ try{ SIMS[k](el); }catch(e){ console.error('sim '+k, e); } }});
})();
