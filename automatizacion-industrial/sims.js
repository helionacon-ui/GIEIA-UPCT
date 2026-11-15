/* Figuras interactivas de Automatización Industrial. Vanilla JS + canvas. */
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

/* ---------- helpers Automatización Industrial ---------- */
const NR=(x,d)=>{if(!isFinite(x))return '—';const s=x.toFixed(d===undefined?2:d);return (Math.abs(parseFloat(s))<1e-12?(0).toFixed(d===undefined?2:d):s).replace('.',',');};
const N0=x=>NR(x,0),N1=x=>NR(x,1),N2=x=>NR(x,2),N3=x=>NR(x,3),N4=x=>NR(x,4);
function Rbox(a,x,y,w,h,col,r){const g=a.g;r=r||5;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.fillStyle=col;g.fill();}
function Rline(a,x,y,w,h,col,r,lw){const g=a.g;r=r||5;g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();g.strokeStyle=col;g.lineWidth=lw||1.5;g.stroke();}
function alpha(a,v,fn){a.g.save();a.g.globalAlpha=v;fn();a.g.restore();}
/* contacto NA */
function cNA(a,x,y,col,w){w=w||26;a.line(x,y,x+w*0.3,y,col,1.6);a.line(x+w*0.7,y,x+w,y,col,1.6);
 a.line(x+w*0.3,y-7,x+w*0.3,y+7,col,1.8);a.line(x+w*0.7,y-7,x+w*0.7,y+7,col,1.8);}
/* contacto NC */
function cNC(a,x,y,col,w){w=w||26;cNA(a,x,y,col,w);a.line(x+w*0.22,y+8,x+w*0.78,y-8,col,1.6);}
/* bobina */
function bob(a,x,y,col,w){w=w||26;a.line(x,y,x+w*0.25,y,col,1.6);a.line(x+w*0.75,y,x+w,y,col,1.6);
 const g=a.g;g.strokeStyle=col;g.lineWidth=1.8;g.beginPath();g.arc(x+w/2,y,w*0.25,0.6,2*Math.PI-0.6);g.stroke();}

/* 1 · Simbología neumática */
SIMS.valvula=el=>build(el,{w:680,h:316,
 selects:[{k:'tipo',l:'Válvula',v:'52',opts:[['32','3/2 — pulsador o final de carrera'],['52','5/2 — mando de cilindro de doble efecto'],['43','4/3 — con posición central cerrada']]},
  {k:'cil',l:'Actuador',v:'doble',opts:[['simple','Cilindro de simple efecto'],['doble','Cilindro de doble efecto']]}],
 sliders:[{k:'pos',l:'Posición accionada',v:0,min:0,max:1,step:1},
  {k:'D',l:'Diámetro del émbolo',v:40,min:16,max:100,step:2,u:'mm'},
  {k:'d',l:'Diámetro del vástago',v:12,min:6,max:40,step:2,u:'mm'},
  {k:'p',l:'Presión de trabajo',v:6,min:2,max:10,step:0.5,u:'bar'}],
 draw(a){a.clear();const s=a.st;
  const nv=s.tipo==='32'?3:(s.tipo==='52'?5:4), np=s.tipo==='43'?3:2;
  const act=Math.min(s.pos,np-1);
  /* símbolo de la válvula */
  const vx=56,vy=76,cw=56,ch=52;
  for(let i=0;i<np;i++){
    const x=vx+i*cw;
    if(i===act){alpha(a,0.16,()=>Rbox(a,x,vy,cw,ch,C.a,0));}
    Rline(a,x,vy,cw,ch,i===act?C.a:C.grid,0,i===act?2:1.2);
    /* flechas internas */
    const go=(i===0)!==(s.tipo==='43'&&i===1);
    if(s.tipo==='43'&&i===1){ a.txt('·',x+cw/2,vy+ch/2+5,C.muted,16,'center'); }
    else{
      a.arrow(x+10,vy+ch-14,x+cw-10,vy+14,i===act?C.a:C.muted,1.5);
      if(nv>=4) a.arrow(x+cw-10,vy+ch-14,x+10,vy+14,i===act?C.a:C.muted,1.5);
    }
  }
  /* conexiones */
  const W=np*cw;
  const sup = s.tipo==='32'? [['A',0.5]] : (s.tipo==='52'? [['B',0.3],['A',0.7]] : [['B',0.3],['A',0.7]]);
  sup.forEach(([n,f])=>{const x=vx+W*f;a.line(x,vy,x,vy-16,C.muted,1.6);a.txt(n,x,vy-22,C.muted,11,'center');});
  const inf = s.tipo==='32'? [['P',0.3],['R',0.7]] : (s.tipo==='52'? [['R',0.18],['P',0.5],['S',0.82]] : [['P',0.35],['T',0.65]]);
  inf.forEach(([n,f])=>{const x=vx+W*f;a.line(x,vy+ch,x,vy+ch+16,C.muted,1.6);a.txt(n,x,vy+ch+30,C.muted,11,'center');});
  /* accionamientos */
  a.txt(act===0?'reposo ►':'◄ accionada',vx+W/2,vy+ch+50,act===0?C.a:C.a,11,'center');
  a.txt(np===2?'muelle ►':'centrado',vx+W+8,vy+ch/2+4,C.muted,11);
  a.txt(s.tipo.charAt(0)+'/'+s.tipo.charAt(1)+'  ·  '+nv+' vías, '+np+' posiciones',vx,vy-44,C.a,14);
  /* cilindro */
  const bx=vx,by=206,bw=210,bh=44;
  Rline(a,bx,by,bw,bh,C.muted,3,1.4);
  const ext = act>0?0.62:0.12;
  alpha(a,0.5,()=>Rbox(a,bx+2,by+2,bw*ext,bh-4,C.a,2));
  Rbox(a,bx+bw*ext-6,by+3,8,bh-6,C.a,2);
  a.line(bx+bw*ext+2,by+bh/2,bx+bw+44,by+bh/2,C.a,3);
  if(s.cil==='simple'){(function(g){g.strokeStyle=C.muted;g.lineWidth=1.3;g.beginPath();
    for(let i=0;i<6;i++){g.moveTo(bx+6+i*7,by+8);g.lineTo(bx+10+i*7,by+bh-8);}g.stroke();})(a.g);}
  a.txt(s.cil==='simple'?'1A1 · simple efecto (retorno por muelle)':'1A1 · doble efecto',bx,by-12,C.muted,11.5);
  a.txt(act>0?'avance':'reposo',bx+bw+50,by+bh/2+4,C.a,12);
  /* cálculo */
  const px=406, py=72;
  const Aav=Math.PI*Math.pow(s.D/1000,2)/4, Aret=Math.PI*(Math.pow(s.D/1000,2)-Math.pow(s.d/1000,2))/4;
  const P=s.p*1e5;
  a.txt('Fuerzas del cilindro',px,py,C.a,13.5);
  a.txt('área de avance',px,py+26,C.muted,11.5);
  a.txt(N2(Aav*1e4)+' cm²',px+200,py+26,C.text,12.5,'right');
  a.txt('área de retroceso',px,py+48,C.muted,11.5);
  a.txt(N2(Aret*1e4)+' cm²',px+200,py+48,C.text,12.5,'right');
  a.txt('F avance',px,py+82,C.muted,11.5);
  a.txt(N0(P*Aav)+' N',px+200,py+82,C.a,17,'right');
  a.txt('F retroceso',px,py+112,C.muted,11.5);
  a.txt(N0(P*Aret)+' N',px+200,py+112,C.b,17,'right');
  a.txt('la diferencia es del '+N1(100*(1-Aret/Aav))+' %',px,py+136,C.muted,11);
  a.txt('con rendimiento 0,85:',px,py+166,C.muted,11.5);
  a.txt(N0(0.85*P*Aav)+' N  /  '+N0(0.85*P*Aret)+' N',px,py+186,C.text,12.5);
  a.txt(s.d>=s.D?'⚠ el vástago no puede ser mayor que el émbolo':'',px,py+212,C.d,11);
  a.html('Una válvula <b>'+s.tipo.charAt(0)+'/'+s.tipo.charAt(1)+'</b> tiene <b>'+nv+' vías</b> (las conexiones que salen del símbolo) y <b>'+np+' posiciones</b> (los cuadros). El primer número son los tubos, el segundo los cuadros: invertirlos es el error más repetido.<br>Mueve los diámetros: el retroceso siempre da menos fuerza porque el vástago resta área. Con D = 40 y d = 12 la pérdida es del 9 %.');
 }});

/* 2 · Diagrama espacio-fase */
SIMS.secuencia=el=>build(el,{w:680,h:256,
 selects:[{k:'sec',l:'Secuencia',v:'ab1',opts:[['ab1','A+ B+ A− B−  (sin solape)'],['ab2','A+ B+ B− A−  (sin solape)'],['ab3','A+ A− B+ B−  (con solape en A)']]}],
 sliders:[{k:'fase',l:'Fase actual',v:0,min:0,max:4,step:1}],
 draw(a){a.clear();const s=a.st;
  const SEQ={ab1:['A+','B+','A−','B−'],ab2:['A+','B+','B−','A−'],ab3:['A+','A−','B+','B−']}[s.sec];
  /* estados */
  const est=[[0,0]];
  SEQ.forEach(m=>{const p=est[est.length-1].slice();
    p[m[0]==='A'?0:1]=m[1]==='+'?1:0;est.push(p);});
  const ox=76,oy=64,W=440,fw=W/4,H=42,gap=76;
  ['A','B'].forEach((cil,k)=>{
    const y0=oy+k*gap+H;
    a.txt(cil,ox-18,y0-H/2+5,C.a,14,'right');
    a.txt('1',ox-8,oy+k*gap+5,C.muted,10,'right');
    a.txt('0',ox-8,y0+5,C.muted,10,'right');
    alpha(a,0.35,()=>{a.line(ox,oy+k*gap,ox+W,oy+k*gap,C.grid,1);a.line(ox,y0,ox+W,y0,C.grid,1);});
    /* línea de estado */
    for(let i=0;i<4;i++){
      const x0=ox+i*fw,x1=x0+fw;
      const a0=est[i][k],a1=est[i+1][k];
      const yA=a0?oy+k*gap:y0, yB=a1?oy+k*gap:y0;
      const col=i<s.fase?C.a:C.grid, lw=i<s.fase?2.4:1.6;
      if(a0===a1){a.line(x0,yA,x1,yA,col,lw);}
      else{a.line(x0,yA,x0+fw*0.25,yA,col,lw);a.line(x0+fw*0.25,yA,x1-fw*0.15,yB,col,lw);a.line(x1-fw*0.15,yB,x1,yB,col,lw);}
    }
  });
  /* fases */
  for(let i=0;i<=4;i++){const x=ox+i*fw;
    alpha(a,0.3,()=>a.line(x,oy-10,x,oy+gap+H+10,C.grid,1));
    if(i<4){a.txt(String(i+1),x+fw/2,oy+gap+H+28,i<s.fase?C.a:C.muted,12,'center');
      a.txt(SEQ[i],x+fw/2,oy-20,i<s.fase?C.a:C.muted,12.5,'center');}}
  a.txt('fase',ox-18,oy+gap+H+28,C.muted,11,'right');
  /* panel */
  const px=556,py=64;
  a.txt('Secuencia',px,py,C.a,13);
  a.txt(SEQ.join(' '),px,py+22,C.text,13);
  a.txt('Estado actual',px,py+54,C.muted,11.5);
  const e=est[s.fase];
  a.txt('A = '+(e[0]?'fuera':'dentro'),px,py+76,e[0]?C.a:C.muted,12.5);
  a.txt('B = '+(e[1]?'fuera':'dentro'),px,py+96,e[1]?C.a:C.muted,12.5);
  const solape = s.sec==='ab3';
  a.txt('Solape de señal',px,py+130,C.muted,11.5);
  a.txt(solape?'SÍ':'no',px,py+152,solape?C.d:C.c,16);
  if(solape){a.txt('A recibe órdenes',px,py+174,C.d,10.5);a.txt('contrarias: cascada',px,py+190,C.d,10.5);}
  else{a.txt('cada válvula recibe',px,py+174,C.muted,10.5);a.txt('una orden cada vez',px,py+190,C.muted,10.5);}
  a.html(solape
   ? 'En <b>A+ A−</b> consecutivos, la válvula de A recibe la señal de avance y la de retroceso casi a la vez: <b>se bloquea</b>. Es el solape de señal, y se resuelve con el <b>método cascada</b>, que alimenta cada tramo de la secuencia por separado.'
   : 'Cada fase es un movimiento y cada cambio lo provoca un final de carrera. Mueve el control de fase para recorrer el ciclo: así se lee un <b>diagrama espacio-fase</b>, con la posición (0 dentro, 1 fuera) frente a las fases, nunca frente al tiempo.');
 }});

/* 3 · Enclavamiento electroneumático */
SIMS.enclavamiento=el=>build(el,{w:680,h:324,
 selects:[{k:'encl',l:'Autoalimentación',v:'si',opts:[['si','Con enclavamiento (R1 en paralelo)'],['no','Sin enclavamiento']]},
  {k:'paro',l:'Contacto del paro',v:'nc',opts:[['nc','Paro NC (correcto)'],['na','Paro NA (incorrecto)']]}],
 sliders:[{k:'t',l:'Instante de la simulación',v:2,min:0,max:6,step:1},
  {k:'tem',l:'Temporizador T1',v:5,min:1,max:10,step:1,u:'s'}],
 draw(a){a.clear();const s=a.st,t=s.t;
  const pulsa = t===1;
  const R1 = s.encl==='si' ? (t>=1 && t<=4) : pulsa;
  const FC = (t>=4 && t<=5);
  const T1 = (t===5);
  const R1f = R1 && !T1;
  const E = R1f;
  const ox=56, top=76, bot=272, W=268;
  a.txt('24 V',ox-8,top-6,C.muted,11,'right');
  a.line(ox,top,ox+W+48,top,C.muted,1.8);
  a.txt('0 V',ox-8,bot+16,C.muted,11,'right');
  a.line(ox,bot,ox+W+48,bot,C.muted,1.8);
  const RY=[112,178,232];
  /* verticales del bus */
  a.line(ox,top,ox,RY[2],C.muted,1.3);
  a.line(ox+W+48,top,ox+W+48,bot,C.muted,1.3);
  const bajada=(y)=>{a.line(ox+W+48,y,ox+W+48,y,C.muted,1.3);};
  /* rama 1 · marcha enclavada */
  let y=RY[0];
  a.line(ox,y,ox+12,y,C.muted,1.3);
  cNA(a,ox+12,y,pulsa?C.a:C.muted); a.txt('P',ox+25,y-16,pulsa?C.a:C.muted,11,'center');
  a.line(ox+38,y,ox+70,y,C.muted,1.3);
  if(s.paro==='nc')cNC(a,ox+70,y,C.c); else cNA(a,ox+70,y,C.d);
  a.txt('Paro',ox+83,y-16,s.paro==='nc'?C.c:C.d,11,'center');
  a.line(ox+96,y,ox+128,y,C.muted,1.3);
  cNC(a,ox+128,y,T1?C.d:C.muted); a.txt('T1',ox+141,y-16,T1?C.d:C.muted,11,'center');
  a.line(ox+154,y,ox+222,y,C.muted,1.3);
  bob(a,ox+222,y,R1f?C.a:C.muted); a.txt('R1',ox+235,y-16,R1f?C.a:C.muted,12,'center');
  a.line(ox+248,y,ox+W+48,y,C.muted,1.3);
  /* contacto de autoalimentación, en una línea aparte debajo */
  if(s.encl==='si'){
    const ya=y+28;
    a.line(ox,y,ox,ya,C.muted,1.3);
    a.line(ox,ya,ox+12,ya,C.muted,1.3);
    cNA(a,ox+12,ya,R1f?C.a:C.muted);
    a.txt('R1',ox+62,ya+4,R1f?C.a:C.muted,10.5,'left');
    a.line(ox+38,ya,ox+52,ya,C.muted,1.3);
    a.line(ox+52,ya,ox+52,y,C.muted,1.3);
  }
  /* rama 2 · solenoide */
  y=RY[1];
  a.line(ox,y,ox+12,y,C.muted,1.3);
  cNA(a,ox+12,y,E?C.a:C.muted); a.txt('R1',ox+25,y-16,E?C.a:C.muted,11,'center');
  a.line(ox+38,y,ox+222,y,C.muted,1.3);
  bob(a,ox+222,y,E?C.a:C.muted); a.txt('E',ox+235,y-16,E?C.a:C.muted,12,'center');
  a.line(ox+248,y,ox+W+48,y,C.muted,1.3);
  /* rama 3 · piloto y temporizador */
  y=RY[2];
  a.line(ox,y,ox+12,y,C.muted,1.3);
  cNA(a,ox+12,y,FC?C.a:C.muted); a.txt('FC',ox+25,y-16,FC?C.a:C.muted,11,'center');
  a.line(ox+38,y,ox+128,y,C.muted,1.3);
  (function(g){g.strokeStyle=FC?C.b:C.muted;g.lineWidth=1.6;g.beginPath();g.arc(ox+140,y,11,0,7);g.stroke();
    g.beginPath();g.moveTo(ox+132,y-8);g.lineTo(ox+148,y+8);g.moveTo(ox+148,y-8);g.lineTo(ox+132,y+8);g.stroke();})(a.g);
  a.txt('L1',ox+140,y-22,FC?C.b:C.muted,11,'center');
  a.line(ox+151,y,ox+212,y,C.muted,1.3);
  Rline(a,ox+212,y-12,32,24,T1?C.d:C.muted,3,1.5);
  a.txt('T1',ox+228,y+4,T1?C.d:C.muted,11,'center');
  a.txt(N0(s.tem)+' s',ox+228,y-20,C.muted,10,'center');
  a.line(ox+244,y,ox+W+48,y,C.muted,1.3);
  a.line(ox,RY[2],ox,bot,C.muted,0.1);
  a.txt('circuito de mando (24 V)',ox,top-26,C.muted,11.5);
  /* panel de estado */
  const px=382,py=78;
  const PASOS=['reposo','se pulsa P','se suelta P','el cilindro avanza','llega a FC: L1 y T1','T1 cumple: corta R1','retrocede'];
  a.txt('Paso '+t+' de 6',px,py,C.a,13.5);
  a.txt(PASOS[t],px,py+24,C.text,13.5);
  const est=[['R1',R1f],['Solenoide E',E],['Piloto L1',FC],['T1 cumplido',T1]];
  est.forEach(function(e,i){const yy=py+62+i*30;
    if(e[1])Rbox(a,px,yy-13,20,18,C.a,3); else Rline(a,px,yy-13,20,18,C.grid,3,1.2);
    a.txt(e[1]?'1':'0',px+10,yy+1,e[1]?C.bg:C.muted,11,'center');
    a.txt(e[0],px+30,yy+1,e[1]?C.text:C.muted,12.5);});
  a.txt('Diagnóstico',px,py+196,C.muted,11.5);
  const mal = s.encl==='no'||s.paro==='na';
  const diag = s.paro==='na' ? ['Paro NA: un cable roto','deja el sistema sin poder parar'] :
    (s.encl==='no' ? ['Sin enclavamiento: el cilindro','sólo avanza mientras se pulse'] :
     ['Correcto: se enclava al pulsar','y T1 corta a los '+N0(s.tem)+' s']);
  a.txt(diag[0],px,py+220,mal?C.d:C.c,11.5);
  a.txt(diag[1],px,py+238,mal?C.d:C.c,11.5);
  a.html(s.encl==='no'
   ? 'Sin el contacto de R1 en paralelo con el pulsador, la bobina se desexcita en cuanto se suelta P. Avanza al paso 2 y míralo: <b>el cilindro sólo se mueve mientras se mantenga apretado el botón</b>.'
   : (s.paro==='na'
   ? 'Con el paro como contacto <b>NA</b> la rama sólo conduce mientras se aprieta el paro: el sistema queda sin posibilidad de pararse, y un cable roto no se detecta. El paro y la emergencia son <b>siempre NC y en serie</b>.'
   : 'Recorre los seis pasos: al pulsar P se excita R1, su propio contacto lo <b>enclava</b>, el solenoide avanza el cilindro, FC enciende L1 y lanza T1, y a los '+N0(s.tem)+' segundos el franqueador de T1 <b>corta la rama de R1</b> y todo cae.'));
 }});

/* 4 · Mando y potencia */
SIMS.potencia=el=>build(el,{w:680,h:340,
 selects:[{k:'fallo',l:'Situación',v:'ok',opts:[['ok','Funcionamiento normal'],['fase','Se pierde una fase'],['sobre','Sobrecarga mecánica'],['corto','Cortocircuito']]}],
 sliders:[{k:'P',l:'Potencia del motor',v:7.5,min:1,max:30,step:0.5,u:'kW'},
  {k:'U',l:'Tensión de línea',v:400,min:230,max:690,step:10,u:'V'},
  {k:'cf',l:'Factor de potencia',v:0.85,min:0.6,max:0.95,step:0.01},
  {k:'eta',l:'Rendimiento',v:0.88,min:0.7,max:0.96,step:0.01}],
 draw(a){a.clear();const s=a.st;
  const In=s.P*1000/(Math.sqrt(3)*s.U*s.cf*s.eta);
  let I=In, estado='normal', col=C.c;
  if(s.fallo==='fase'){I=In*Math.sqrt(3);estado='sobreintensidad';col=C.d;}
  else if(s.fallo==='sobre'){I=In*1.4;estado='sobrecarga';col=C.b;}
  else if(s.fallo==='corto'){I=In*40;estado='cortocircuito';col=C.d;}
  const salta_term = I>In*1.2 && s.fallo!=='corto';
  const salta_magn = s.fallo==='corto';
  /* tres fases */
  const ox=52,oy=62,fh=26,W=236;
  ['R','S','T'].forEach((f,i)=>{
    const y=oy+i*fh;
    const viva = !(s.fallo==='fase'&&i===2);
    a.txt(f,ox-10,y+4,viva?C.text:C.d,12,'right');
    a.line(ox,y,ox+W,y,viva?C.a:C.d,viva?2:1);
    if(!viva){a.line(ox+108,y-8,ox+124,y+8,C.d,2.2);a.line(ox+124,y-8,ox+108,y+8,C.d,2.2);
      a.txt('fase perdida',ox+116,y-14,C.d,10,'center');}
  });
  /* elementos en la línea */
  const marca=(x,lab,on)=>{Rline(a,x-14,oy-14,28,2*fh+28,on?C.d:C.grid,3,on?2:1.2);
    a.txt(lab,x,oy+2*fh+34,on?C.d:C.muted,10.5,'center');};
  marca(ox+40,'Q1',salta_magn);
  marca(ox+96,'KM1',false);
  marca(ox+180,'FR',salta_term);
  /* motor */
  (function(g){g.strokeStyle=C.a;g.lineWidth=1.8;g.beginPath();g.arc(ox+W+28,oy+fh,20,0,7);g.stroke();})(a.g);
  a.txt('M',ox+W+28,oy+fh-2,C.a,13,'center');
  a.txt('3~',ox+W+28,oy+fh+13,C.muted,10,'center');
  a.txt('CIRCUITO DE POTENCIA',ox,oy-30,C.muted,11);
  /* circuito de mando */
  const my=222;
  a.txt('CIRCUITO DE MANDO',ox,my-34,C.muted,11);
  a.line(ox,my,ox+8,my,C.muted,1.3);
  cNC(a,ox+8,my,salta_term?C.d:C.c); a.txt('FR',ox+20,my-14,salta_term?C.d:C.c,10.5,'center');
  a.line(ox+34,my,ox+50,my,C.muted,1.3);
  cNC(a,ox+50,my,C.c); a.txt('Paro',ox+63,my-14,C.c,10.5,'center');
  a.line(ox+76,my,ox+92,my,C.muted,1.3);
  cNA(a,ox+92,my,C.muted); a.txt('M',ox+104,my-14,C.muted,10.5,'center');
  a.line(ox+118,my,ox+180,my,C.muted,1.3);
  bob(a,ox+180,my,salta_term?C.muted:C.a); a.txt('KM1',ox+193,my-16,salta_term?C.muted:C.a,11,'center');
  a.line(ox+206,my,ox+W+28,my,C.muted,1.3);
  /* autoalimentación */
  a.line(ox+92,my,ox+92,my+20,C.muted,1.3);a.line(ox+92,my+20,ox+92,my+20,C.muted,1.3);
  cNA(a,ox+92,my+20,salta_term?C.muted:C.a);a.txt('KM1',ox+104,my+34,salta_term?C.muted:C.a,10,'center');
  a.line(ox+118,my+20,ox+132,my+20,C.muted,1.3);a.line(ox+132,my+20,ox+132,my,C.muted,1.3);
  a.line(ox+92,my,ox+92,my,C.muted,1.3);
  a.txt('el contacto NC del térmico corta la bobina',ox,my+62,C.muted,10.5);
  /* panel */
  const px=410,py=62;
  a.txt('Corriente de línea',px,py,C.a,13);
  a.txt('nominal',px,py+24,C.muted,11.5);
  a.txt(N2(In)+' A',px+200,py+24,C.text,13,'right');
  a.txt('actual',px,py+48,C.muted,11.5);
  a.txt(N1(I)+' A',px+200,py+48,col,18,'right');
  a.txt('arranque directo (×7)',px,py+74,C.muted,11);
  a.txt(N0(7*In)+' A',px+200,py+74,C.muted,12,'right');
  a.txt('estrella-triángulo (/3)',px,py+96,C.muted,11);
  a.txt(N0(7*In/3)+' A',px+200,py+96,C.b,12,'right');
  /* barra */
  alpha(a,0.12,()=>Rbox(a,px,py+120,200,16,C.text,3));
  Rbox(a,px,py+120,200*Math.min(1,I/(In*3)),16,col,3);
  a.line(px+200/3,py+116,px+200/3,py+140,C.muted,1.3);
  a.txt('In',px+200/3,py+154,C.muted,10,'center');
  a.txt('Situación: '+estado,px,py+182,col,12.5);
  a.txt('Reglaje del térmico: '+N1(1.1*In)+' A',px,py+206,C.muted,11.5);
  const prot = salta_magn?'dispara el magnetotérmico (instantáneo)':(salta_term?'dispara el relé térmico':'ninguna protección actúa');
  a.txt(prot,px,py+228,salta_magn||salta_term?C.d:C.c,11.5);
  a.html(s.fallo==='fase'
   ? 'Al perder una fase el motor <b>sigue girando</b>, pero la misma potencia pasa por dos conductores: la corriente sube un <b>73 %</b>. El motor se quema salvo que el <b>relé térmico</b> dispare. Por eso el térmico es obligatorio aunque haya magnetotérmico.'
   : (s.fallo==='corto'
   ? 'Un cortocircuito da corrientes de decenas de veces la nominal. Lo corta el <b>magnetotérmico</b> (o el fusible) por disparo <b>magnético instantáneo</b>: el térmico tardaría demasiado y los cables arderían antes.'
   : (s.fallo==='sobre'
   ? 'Una sobrecarga moderada pero sostenida es exactamente lo que detecta el <b>relé térmico</b>: su bimetal se calienta con el tiempo. El magnetotérmico puede no llegar a saltar.'
   : 'Cambia la situación con el selector y mira qué protección actúa en cada caso. Fíjate en que el relé térmico está en <b>potencia</b> pero su contacto NC está en <b>mando</b>: es así como un fallo de potencia abre el contactor.')));
 }});

/* 5 · Estrella-triángulo */
SIMS.estrella=el=>build(el,{w:680,h:330,
 selects:[{k:'con',l:'Conexión',v:'Y',opts:[['Y','Estrella (arranque)'],['D','Triángulo (régimen)']]}],
 sliders:[{k:'U',l:'Tensión de red',v:400,min:230,max:690,step:10,u:'V'},
  {k:'In',l:'Corriente nominal',v:14.5,min:2,max:60,step:0.5,u:'A'},
  {k:'k',l:'Factor de arranque',v:7,min:4,max:8,step:0.5}],
 draw(a){a.clear();const s=a.st,Y=s.con==='Y';
  const Uf = Y? s.U/Math.sqrt(3) : s.U;
  const Ia = Y? s.k*s.In/3 : s.k*s.In;
  const M  = Y? 1/3 : 1;
  /* dibujo de la conexión */
  const cx=168,cy=166,R=62;
  const ang=[-90,30,150].map(d=>d*Math.PI/180);
  const pts=ang.map(t=>[cx+R*Math.cos(t),cy+R*Math.sin(t)]);
  if(Y){
    pts.forEach((p,i)=>{a.line(cx,cy,p[0],p[1],C.a,3);
      a.txt(['U','V','W'][i],p[0]+(i===0?0:(i===1?16:-16)),p[1]+(i===0?-10:8),C.text,12,'center');
      a.circ(p[0],p[1],5,C.a);});
    a.circ(cx,cy,6,C.b,true);
    a.txt('N',cx+14,cy-6,C.b,11);
    a.txt('los finales unidos entre sí',cx,cy+R+54,C.muted,11,'center');
  } else {
    for(let i=0;i<3;i++){const p=pts[i],q=pts[(i+1)%3];a.line(p[0],p[1],q[0],q[1],C.a,3);}
    pts.forEach((p,i)=>{a.circ(p[0],p[1],5,C.a);
      a.txt(['U','V','W'][i],p[0]+(i===0?0:(i===1?16:-16)),p[1]+(i===0?-10:8),C.text,12,'center');});
    a.txt('cada final con el principio siguiente',cx,cy+R+54,C.muted,11,'center');
  }
  a.txt(Y?'ESTRELLA':'TRIÁNGULO',cx,cy+R+30,C.a,14,'center');
  a.txt('tensión por devanado',cx,cy+R+76,C.muted,11,'center');
  a.txt(N0(Uf)+' V',cx,cy+R+98,C.b,17,'center');
  /* contactores */
  const bx=44,by=48;
  [['KM1','línea',true],['KME','estrella',Y],['KMT','triángulo',!Y]].forEach(([n,d,on],i)=>{
    const x=bx+i*86;
    if(on)Rbox(a,x,by,74,30,C.a,4); else Rline(a,x,by,74,30,C.grid,4,1.3);
    a.txt(n,x+37,by+14,on?C.bg:C.muted,12,'center');
    a.txt(d,x+37,by+26,on?C.bg:C.muted,9.5,'center');});
  /* panel */
  const px=392,py=62;
  a.txt('Arranque',px,py,C.a,13.5);
  a.txt('corriente de arranque',px,py+26,C.muted,11.5);
  a.txt(N1(Ia)+' A',px+210,py+26,Y?C.c:C.d,17,'right');
  a.txt('nominal: '+N1(s.In)+' A',px,py+50,C.muted,11);
  a.txt('relación respecto a la nominal',px,py+78,C.muted,11.5);
  a.txt('× '+N1(Ia/s.In),px+210,py+78,C.text,13,'right');
  a.txt('par de arranque relativo',px,py+108,C.muted,11.5);
  a.txt(Y?'1/3 = 33 %':'100 %',px+210,py+108,Y?C.d:C.c,13,'right');
  /* barras comparativas */
  const bw=210;
  [['directo',s.k*s.In,C.d],['estrella',s.k*s.In/3,C.c]].forEach(([n,v,c],i)=>{
    const yy=py+146+i*34;
    a.txt(n,px,yy,C.muted,11);
    alpha(a,0.12,()=>Rbox(a,px,yy+6,bw,14,C.text,3));
    Rbox(a,px,yy+6,bw*v/(s.k*s.In),14,c,3);
    a.txt(N0(v)+' A',px+bw-4,yy+17,i===0?C.bg:c,11,'right');});
  a.txt('Secuencia: KM1+KME → tiempo muerto → KM1+KMT',px,py+224,C.muted,10.5);
  a.txt(Y?'⚠ con carga plena el motor no arranca en estrella':'',px,py+244,C.d,11);
  a.html(Y
   ? 'En estrella cada devanado recibe <b>'+N0(s.U)+'/√3 = '+N0(Uf)+' V</b>. La corriente de arranque baja <b>a la tercera parte</b>... y el par también. Por eso el estrella-triángulo sólo vale para arrancar <b>en vacío o con poca carga</b>.'
   : 'En triángulo cada devanado ve la tensión de red completa, <b>'+N0(s.U)+' V</b>: plena potencia y pleno par. Entre abrir KME y cerrar KMT tiene que haber un <b>tiempo muerto</b>, porque si cerraran a la vez se cortocircuitarían dos fases.');
 }});

/* 6 · GRAFCET lineal */
SIMS.grafcet=el=>build(el,{w:680,h:340,
 selects:[{k:'accion',l:'Tipo de acción del imán',v:'mem',opts:[['mem','Memorizada (S en E3, R en E7)'],['cont','Continua (sólo en E3)']]}],
 sliders:[{k:'et',l:'Etapa activa',v:3,min:0,max:7,step:1}],
 draw(a){a.clear();const s=a.st,act=s.et;
  const ET=[['0','—','estado inicial'],['1','—','espera de pieza'],['2','K2','bajar el imán'],
   ['3','K5','encender el imán'],['4','K1','subir'],['5','K3','carro a la derecha'],
   ['6','K2','bajar'],['7','K5 R','soltar la pieza']];
  const TR=['S1','S7','S14','t/X3/2s','S13','S15','S14'];
  const ox=68,oy=56,dy=34;
  ET.forEach((e,i)=>{
    const y=oy+i*dy, on=i===act, hecho=i<act;
    if(i===0){Rline(a,ox-4,y-13,36,26,on?C.a:C.grid,3,on?2.4:1.3);}
    if(on)Rbox(a,ox,y-11,28,22,C.a,3); else Rline(a,ox,y-11,28,22,hecho?C.c:C.grid,3,1.3);
    a.txt(e[0],ox+14,y+4,on?C.bg:(hecho?C.c:C.muted),12.5,'center');
    if(e[1]!=='—'){Rline(a,ox+52,y-11,54,22,on?C.b:C.grid,3,on?1.8:1.2);
      a.txt(e[1],ox+79,y+4,on?C.b:C.muted,11.5,'center');
      a.line(ox+28,y,ox+52,y,on?C.b:C.grid,1.3);}
    a.txt(e[2],ox+120,y+4,on?C.text:C.muted,11.5);
    if(i<7){a.line(ox+14,y+11,ox+14,y+dy-11,i<act?C.c:C.grid,1.6);
      a.line(ox+6,y+dy/2,ox+22,y+dy/2,i<act?C.c:C.grid,1.8);
      a.txt(TR[i],ox+34,y+dy/2+4,i<act?C.c:C.muted,10.5);}
  });
  a.line(ox+14,oy+7*dy+11,ox+14,oy+7*dy+24,C.grid,1.5);
  a.line(ox+14,oy+7*dy+24,ox-16,oy+7*dy+24,C.grid,1.5);
  a.line(ox-16,oy+7*dy+24,ox-16,oy+dy,C.grid,1.5);
  a.arrow(ox-16,oy+dy,ox-2,oy+dy,C.grid,1.5);
  /* salidas */
  const px=392,py=58;
  a.txt('Salidas activas',px,py,C.a,13.5);
  const sal=[['K1','subir',act===4],['K2','bajar',act===2||act===6],['K3','derecha',act===5],
   ['K4','izquierda',false],['K5','imán',s.accion==='mem'?(act>=3&&act<7):(act===3)]];
  sal.forEach(([n,d,on],i)=>{const y=py+30+i*30;
    if(on)Rbox(a,px,y-12,22,18,C.a,3); else Rline(a,px,y-12,22,18,C.grid,3,1.2);
    a.txt(on?'1':'0',px+11,y+1,on?C.bg:C.muted,11,'center');
    a.txt(n,px+32,y+1,on?C.text:C.muted,12);
    a.txt(d,px+66,y+1,C.muted,11);});
  /* aviso */
  const peligro = s.accion==='cont' && act>=4 && act<7;
  a.txt('Estado de la pieza',px,py+194,C.muted,11.5);
  a.txt(peligro?'SE HA CAÍDO':'sujeta por el imán',px,py+218,peligro?C.d:C.c,15);
  if(peligro){a.txt('el imán se apagó al salir de E3',px,py+240,C.d,11);}
  else if(s.accion==='mem'&&act>=3&&act<7){a.txt('acción memorizada: S en E3',px,py+240,C.c,11);}
  a.html(s.accion==='cont'
   ? 'Con una acción <b>continua</b>, K5 sólo está activa mientras lo esté la etapa 3. Avanza a la etapa 4 y verás el problema: el imán se apaga y la pieza se cae. Por eso el enunciado exige una <b>acción memorizada</b>.'
   : 'Recorre las etapas. Observa que la <b>regla 3</b> se cumple literalmente: al franquear una transición se desactiva la etapa anterior y se activa la siguiente, nunca dos a la vez en una secuencia lineal. El imán, con <b>S</b> en E3 y <b>R</b> en E7, se mantiene durante todo el transporte.');
 }});

/* 7 · Estructuras del GRAFCET */
SIMS.estructura=el=>build(el,{w:680,h:330,
 selects:[{k:'tipo',l:'Estructura',v:'o',opts:[['o','Divergencia en O (alternativa)'],['y','Divergencia en Y (paralela)'],['bucle','Bucle con contador']]},
  {k:'cond',l:'Condición activa',v:'a',opts:[['a','Se cumple a'],['b','Se cumple b'],['ab','Se cumplen a y b a la vez']]}],
 sliders:[{k:'paso',l:'Paso',v:1,min:0,max:3,step:1},
  {k:'cnt',l:'Valor del contador',v:3,min:0,max:6,step:1}],
 draw(a){a.clear();const s=a.st,p=s.paso;
  const ox=120,oy=56;
  const caja=(x,y,n,on,w)=>{w=w||30;
    if(on)Rbox(a,x-w/2,y-12,w,24,C.a,3); else Rline(a,x-w/2,y-12,w,24,C.grid,3,1.3);
    a.txt(n,x,y+4,on?C.bg:C.muted,12,'center');};
  if(s.tipo!=='bucle'){
    const doble = s.tipo==='y';
    caja(ox+110,oy,'1',p===0);
    a.line(ox+110,oy+12,ox+110,oy+34,p>0?C.c:C.grid,1.6);
    /* línea de divergencia */
    const y1=oy+34, L=ox+40, R=ox+180;
    a.line(L,y1,R,y1,doble?C.b:C.grid,doble?2.4:1.6);
    if(doble)a.line(L,y1+5,R,y1+5,C.b,2.4);
    /* transiciones */
    const ramaA = s.tipo==='y'? p>=1 : (p>=1 && (s.cond==='a'||s.cond==='ab'));
    const ramaB = s.tipo==='y'? p>=1 : (p>=1 && (s.cond==='b'||(s.cond==='ab')));
    if(doble){
      a.line(ox+102,y1-18,ox+118,y1-18,p>0?C.c:C.grid,1.8);
      a.txt('a',ox+124,y1-14,p>0?C.c:C.muted,11);
    } else {
      [[L+20,'a',s.cond==='a'||s.cond==='ab'],[R-20,'b',s.cond==='b'||s.cond==='ab']].forEach(([x,n,ok])=>{
        a.line(x,y1,x,y1+16,C.grid,1.5);
        a.line(x-8,y1+16,x+8,y1+16,ok&&p>0?C.c:C.grid,1.8);
        a.txt(n,x+14,y1+20,ok&&p>0?C.c:C.muted,11);});
    }
    caja(L+20,y1+(doble?44:42),'11',ramaA&&p>=1);
    caja(R-20,y1+(doble?44:42),'21',ramaB&&p>=1);
    a.txt(doble?'tarea 1':'camino 1',L+34,y1+(doble?74:72),C.muted,10.5,'left');
    a.txt(doble?'tarea 2':'camino 2',R-34,y1+(doble?74:72),C.muted,10.5,'right');
    /* convergencia */
    const y2=y1+108;
    a.line(L,y2,R,y2,doble?C.b:C.grid,doble?2.4:1.6);
    if(doble)a.line(L,y2+5,R,y2+5,C.b,2.4);
    a.line(L+20,y1+(doble?56:54),L+20,y2,ramaA&&p>=1?C.c:C.grid,1.6);
    a.line(R-20,y1+(doble?56:54),R-20,y2,ramaB&&p>=1?C.c:C.grid,1.6);
    caja(ox+110,y2+(doble?46:44),'30',p>=3);
    a.line(ox+110,y2+(doble?5:0),ox+110,y2+(doble?34:32),p>=3?C.c:C.grid,1.6);
    a.txt(doble?'DOBLE LÍNEA = Y':'LÍNEA SIMPLE = O',ox+110,oy-26,doble?C.b:C.a,13,'center');
  } else {
    /* bucle con contador */
    caja(ox+70,oy,'1',p===0);
    a.line(ox+70,oy+12,ox+70,oy+34,p>0?C.c:C.grid,1.6);
    a.line(ox+62,oy+34,ox+78,oy+34,p>0?C.c:C.grid,1.8);
    a.txt('inicio',ox+84,oy+38,C.muted,10.5);
    caja(ox+70,oy+58,'11',p===1);
    Rline(a,ox+102,oy+46,76,24,p===1?C.b:C.grid,3,1.2);
    a.txt('C1=C1+1',ox+140,oy+62,p===1?C.b:C.muted,10.5,'center');
    a.line(ox+70,oy+70,ox+70,oy+92,p>1?C.c:C.grid,1.6);
    const L=ox+10,R=ox+150, y1=oy+92;
    a.line(L,y1,R,y1,C.grid,1.6);
    a.line(L+10,y1,L+10,y1+16,C.grid,1.5);a.line(L+2,y1+16,L+18,y1+16,s.cnt<6?C.c:C.grid,1.8);
    a.txt('C1 < 6',L+24,y1+20,s.cnt<6?C.c:C.muted,10.5);
    a.line(R-10,y1,R-10,y1+16,C.grid,1.5);a.line(R-18,y1+16,R-2,y1+16,s.cnt>=6?C.c:C.grid,1.8);
    a.txt('C1 = 6',R-74,y1+20,s.cnt>=6?C.c:C.muted,10.5);
    a.line(L+10,y1+16,L+10,y1+46,s.cnt<6?C.c:C.grid,1.6);
    a.line(L+10,y1+46,ox+70,y1+46,s.cnt<6?C.c:C.grid,1.6);
    a.arrow(ox+70,y1+46,ox+70,oy+70,s.cnt<6?C.c:C.grid,1.6);
    a.txt('repite',L+16,y1+42,C.muted,10);
    caja(R-10,y1+58,'20',s.cnt>=6&&p>=2);
    Rline(a,R+16,y1+46,62,24,s.cnt>=6?C.b:C.grid,3,1.2);
    a.txt('C1 = 0',R+47,y1+62,s.cnt>=6?C.b:C.muted,10.5,'center');
    a.txt('BUCLE CON CONTADOR',ox+80,oy-26,C.a,13,'center');
  }
  /* panel */
  const px=400,py=60;
  if(s.tipo==='o'){
    const ambiguo = s.cond==='ab';
    a.txt('Alternativa (O)',px,py,C.a,13.5);
    a.txt('Ramas activas',px,py+30,C.muted,11.5);
    const n = p===0?0:(s.cond==='ab'?2:1);
    a.txt(String(n),px+200,py+30,ambiguo&&p>0?C.d:C.text,17,'right');
    a.txt('Receptividades',px,py+66,C.muted,11.5);
    a.txt('rama 1: a',px,py+88,(s.cond==='a'||ambiguo)?C.c:C.muted,12);
    a.txt('rama 2: b',px,py+108,(s.cond==='b'||ambiguo)?C.c:C.muted,12);
    a.txt(ambiguo?'⚠ NO son excluyentes':'excluyentes ✓',px,py+140,ambiguo?C.d:C.c,13);
    if(ambiguo){a.txt('se activan DOS ramas',px,py+162,C.d,11.5);
      a.txt('solución: escribir b·ā',px,py+182,C.d,11.5);}
    a.txt('En una alternativa sólo',px,py+216,C.muted,11);
    a.txt('debe evolucionar una rama',px,py+234,C.muted,11);
  } else if(s.tipo==='y'){
    a.txt('Paralelo (Y)',px,py,C.b,13.5);
    a.txt('Etapas activas',px,py+30,C.muted,11.5);
    a.txt(p===0?'1':(p>=3?'1':'2'),px+200,py+30,C.text,17,'right');
    a.txt('Una sola transición activa',px,py+66,C.muted,11.5);
    a.txt('las dos ramas a la vez',px,py+86,C.muted,11.5);
    a.txt('La convergencia espera',px,py+120,C.muted,11.5);
    a.txt('a que terminen TODAS',px,py+140,C.muted,11.5);
    a.txt('Es la única situación',px,py+176,C.c,11.5);
    a.txt('con varias etapas activas',px,py+196,C.c,11.5);
    a.txt('Conviene poner una etapa',px,py+226,C.muted,11);
    a.txt('de espera al final de cada rama',px,py+244,C.muted,11);
  } else {
    a.txt('Contador',px,py,C.a,13.5);
    a.txt('valor actual',px,py+30,C.muted,11.5);
    a.txt(String(s.cnt),px+200,py+30,s.cnt>=6?C.c:C.b,20,'right');
    a.txt('vueltas restantes',px,py+62,C.muted,11.5);
    a.txt(String(Math.max(0,6-s.cnt)),px+200,py+62,C.text,13,'right');
    alpha(a,0.12,()=>Rbox(a,px,py+84,200,16,C.text,3));
    Rbox(a,px,py+84,200*Math.min(1,s.cnt/6),16,s.cnt>=6?C.c:C.b,3);
    a.txt(s.cnt>=6?'sale del bucle y pone C1 = 0':'vuelve a la etapa 11',px,py+124,s.cnt>=6?C.c:C.b,12);
    a.txt('Si se olvida el C1 = 0,',px,py+164,C.d,11.5);
    a.txt('el ciclo siguiente no repite',px,py+184,C.d,11.5);
    a.txt('ninguna vez: el contador',px,py+204,C.d,11.5);
    a.txt('ya estaría en 6.',px,py+224,C.d,11.5);
  }
  a.html(s.tipo==='o'
   ? 'La <b>línea simple</b> es la alternativa: el proceso toma <b>un solo</b> camino. Pon «se cumplen a y b a la vez» y verás el problema: si las receptividades no son excluyentes, se activan dos ramas. La solución es escribir <code>a</code> en una y <code>b·ā</code> en la otra.'
   : (s.tipo==='y'
   ? 'La <b>doble línea</b> es el paralelo: una sola transición lanza todas las ramas y la convergencia espera a que acaben todas. Aquí sí hay <b>varias etapas activas a la vez</b>, y es la única estructura en la que eso es correcto.'
   : 'Para repetir N veces se monta un bucle con una alternativa: una rama con <code>C1 &lt; N</code> que vuelve atrás y otra con <code>C1 = N</code> que sale <b>y pone el contador a cero</b>. Ese reinicio es lo que más se olvida.'));
 }});

/* 8 · Ciclo de scan */
SIMS.scan=el=>build(el,{w:680,h:316,
 sliders:[{k:'ni',l:'Instrucciones',v:5000,min:200,max:20000,step:200},
  {k:'ti',l:'Por instrucción',v:0.1,min:0.02,max:1,step:0.02,u:'µs'},
  {k:'te',l:'Retardo de entrada',v:0.5,min:0.1,max:5,step:0.1,u:'ms'},
  {k:'ts',l:'Retardo de salida',v:10,min:0.1,max:20,step:0.1,u:'ms'}],
 selects:[{k:'fase',l:'Fase del ciclo',v:'1',opts:[['0','1 · Lectura de entradas'],['1','2 · Ejecución del programa'],['2','3 · Escritura de salidas'],['3','4 · Tareas del sistema']]}],
 draw(a){a.clear();const s=a.st,f=parseInt(s.fase);
  const Tp=s.ni*s.ti/1000, Tsys=0.2, Tio=0.15;
  const Tc=Tp+Tsys+2*Tio;
  const Tr=2*Tc+s.te+s.ts;
  const fmax=1/(2*Tc*1e-3);
  /* ciclo circular */
  const cx=160,cy=168,R=78;
  const FASES=[['Lectura','entradas → PII',Tio],['Programa','sobre la imagen',Tp],['Escritura','PIQ → salidas',Tio],['Sistema','diagnóstico',Tsys]];
  FASES.forEach((fa,i)=>{
    const a0=-Math.PI/2+i*Math.PI/2, a1=a0+Math.PI/2-0.08;
    (function(g){g.strokeStyle=i===f?C.a:C.grid;g.lineWidth=i===f?15:9;g.lineCap='butt';
      g.beginPath();g.arc(cx,cy,R,a0+0.04,a1);g.stroke();})(a.g);
    const am=(a0+a1)/2;
    const lx=cx+(R+34)*Math.cos(am), ly=cy+(R+34)*Math.sin(am);
    a.txt(String(i+1)+'. '+fa[0],lx,ly,i===f?C.a:C.muted,11.5,Math.cos(am)<-0.3?'right':(Math.cos(am)>0.3?'left':'center'));
    a.txt(N2(fa[2])+' ms',lx,ly+15,i===f?C.b:C.muted,10,Math.cos(am)<-0.3?'right':(Math.cos(am)>0.3?'left':'center'));
  });
  a.txt('T ciclo',cx,cy-6,C.muted,11.5,'center');
  a.txt(N2(Tc)+' ms',cx,cy+16,C.a,18,'center');
  a.txt(FASES[f][1],cx,cy+R+56,C.muted,11,'center');
  /* panel */
  const px=376,py=58;
  a.txt('Tiempos',px,py,C.a,13.5);
  const fil=[['ejecución del programa',N2(Tp)+' ms',C.text],
   ['tiempo de ciclo',N2(Tc)+' ms',C.a],
   ['retardo de entrada',N1(s.te)+' ms',C.muted],
   ['retardo de salida',N1(s.ts)+' ms',s.ts>5?C.d:C.muted]];
  fil.forEach(([n,v,c],i)=>{const y=py+28+i*26;
    a.txt(n,px,y,C.muted,11.5); a.txt(v,px+228,y,c,12.5,'right');});
  a.txt('Respuesta en el peor caso',px,py+150,C.muted,11.5);
  a.txt('2·T + entrada + salida',px,py+170,C.muted,10.5);
  a.txt(N2(Tr)+' ms',px+228,py+168,C.b,19,'right');
  a.txt('Frecuencia máxima segura',px,py+206,C.muted,11.5);
  a.txt(N0(fmax)+' Hz',px+228,py+206,C.c,15,'right');
  a.txt('un pulso más corto que un ciclo puede perderse',px,py+228,C.muted,10.5);
  const dom = s.ts>Tc*2? 'el módulo de salida domina: usa salidas a transistor' : 'el programa domina: el ciclo manda en la respuesta';
  a.txt(dom,px,py+252,s.ts>Tc*2?C.d:C.c,11);
  a.html('El PLC repite estos cuatro pasos para siempre. Durante la ejecución trabaja con la <b>imagen de proceso</b>, no con las patillas: por eso el estado de las entradas es coherente durante todo el ciclo y por eso una salida escrita dos veces sólo conserva el último valor.<br>Sube el retardo del módulo de salida: con relés de 10 ms, acortar el programa <b>no mejora nada</b>. La respuesta la fija el eslabón más lento.');
 }});

/* 9 · Traducción a KOP */
SIMS.kop=el=>build(el,{w:680,h:340,
 selects:[{k:'patron',l:'Cómo se escribe la etapa',v:'sr',opts:[['sr','Con set y reset (correcto)'],['bob','Con bobina normal']]}],
 sliders:[{k:'ciclo',l:'Ciclo de scan',v:2,min:0,max:5,step:1},
  {k:'cond',l:'La receptividad S7 vale',v:1,min:0,max:1,step:1}],
 draw(a){a.clear();const s=a.st,c=s.ciclo,R=s.cond===1;
  /* simulación de etapas */
  let E1=1,E2=0;
  for(let i=1;i<=c;i++){
    if(s.patron==='sr'){ if(E1&&R){E2=1;E1=0;} }
    else { E2 = (E1&&R)?1:0; if(E1&&R&&i>=2) E1=1; }
  }
  if(s.patron==='bob'){ E1=1; E2=R?1:0; }
  /* segmento dibujado */
  const ox=52,oy=76;
  a.txt('Segmento: transición E1 → E2',ox,oy-30,C.a,13.5);
  const y=oy+10;
  a.line(ox,y,ox+8,y,C.muted,1.4);
  cNA(a,ox+8,y,E1?C.a:C.muted); a.txt('%M0.1',ox+21,y-16,E1?C.a:C.muted,10,'center'); a.txt('E1',ox+21,y+22,E1?C.a:C.muted,10.5,'center');
  a.line(ox+34,y,ox+72,y,C.muted,1.4);
  cNA(a,ox+72,y,R?C.a:C.muted); a.txt('%I0.5',ox+85,y-16,R?C.a:C.muted,10,'center'); a.txt('S7',ox+85,y+22,R?C.a:C.muted,10.5,'center');
  a.line(ox+98,y,ox+206,y,C.muted,1.4);
  const fire = E1&&R;
  bob(a,ox+206,y,fire?C.b:C.muted);
  a.txt(s.patron==='sr'?'( S )':'(   )',ox+219,y+22,fire?C.b:C.muted,10.5,'center');
  a.txt('%M0.2  E2',ox+219,y-18,fire?C.b:C.muted,10,'center');
  if(s.patron==='sr'){
    a.line(ox+219,y+10,ox+219,y+58,C.muted,1.3);
    bob(a,ox+206,y+70,fire?C.d:C.muted);
    a.txt('( R )',ox+219,y+92,fire?C.d:C.muted,10.5,'center');
    a.txt('%M0.1  E1',ox+219,y+52,fire?C.d:C.muted,10,'center');
    a.line(ox+232,y+70,ox+266,y+70,C.muted,1.3);
    a.line(ox+266,y+70,ox+266,y,C.muted,1.3);
  }
  a.line(ox+232,y,ox+280,y,C.muted,1.4);
  a.txt(s.patron==='sr'
   ? 'si E1 y S7 → activa E2 y desactiva E1'
   : 'si E1 y S7 → E2 vale 1 mientras se cumpla',ox,y+(s.patron==='sr'?124:96),C.muted,11.5);
  /* cronograma de marcas */
  const cy=262;
  a.txt('Marcas a lo largo de los ciclos',ox,cy-18,C.muted,11.5);
  [['E1',1],['E2',0]].forEach(([n,ini],k)=>{
    const yy=cy+k*30;
    a.txt(n,ox-6,yy+4,C.muted,11,'right');
    for(let i=0;i<=5;i++){
      let v;
      if(s.patron==='sr'){ v = n==='E1' ? (i<1||!R?1:0) : (i>=1&&R?1:0); }
      else { v = n==='E1' ? 1 : (R?1:0); }
      const x=ox+10+i*42;
      if(v)Rbox(a,x,yy-8,36,18,i<=c?C.a:C.grid,3); else Rline(a,x,yy-8,36,18,C.grid,3,1.1);
      a.txt(v?'1':'0',x+18,yy+5,v&&i<=c?C.bg:C.muted,10.5,'center');
      if(k===1)a.txt(String(i),x+18,yy+26,i===c?C.a:C.muted,9.5,'center');}
  });
  a.txt('ciclo',ox+10+6*42+6,cy+56,C.muted,9.5);
  /* panel */
  const px=400,py=70;
  a.txt('Estado',px,py,C.a,13);
  [['E1 (%M0.1)',E1],['E2 (%M0.2)',E2],['S7 (%I0.5)',R?1:0]].forEach(([n,v],i)=>{
    const yy=py+30+i*28;
    if(v)Rbox(a,px,yy-12,20,18,C.a,3); else Rline(a,px,yy-12,20,18,C.grid,3,1.2);
    a.txt(v?'1':'0',px+10,yy+1,v?C.bg:C.muted,11,'center');
    a.txt(n,px+30,yy+1,v?C.text:C.muted,12);});
  const malo = s.patron==='bob';
  a.txt('Diagnóstico',px,py+128,C.muted,11.5);
  if(malo){
    a.txt('La secuencia NO avanza',px,py+152,C.d,13.5);
    a.txt('E1 nunca se desactiva y E2',px,py+176,C.d,11.5);
    a.txt('cae en cuanto S7 vuelve a 0.',px,py+194,C.d,11.5);
    a.txt('Con bobina normal la etapa',px,py+222,C.muted,11);
    a.txt('no es una memoria.',px,py+240,C.muted,11);
  } else {
    a.txt('Avance correcto',px,py+152,C.c,13.5);
    a.txt('El set memoriza E2 y el reset',px,py+176,C.c,11.5);
    a.txt('libera E1: la regla 3 del',px,py+194,C.c,11.5);
    a.txt('GRAFCET, literalmente.',px,py+212,C.c,11.5);
    a.txt('Orden: primero S, después R.',px,py+242,C.muted,11);
  }
  a.html(malo
   ? 'Con una <b>bobina normal</b>, E2 vale 1 sólo mientras S7 esté a 1, y E1 no se desactiva nunca. Baja S7 a 0 y mira el cronograma: la secuencia se deshace. Una etapa es una <b>memoria</b>, y por eso se escribe con set y reset.'
   : 'Éste es el patrón que se repite en <b>todas</b> las transiciones: etapa anterior en serie con la receptividad, <b>( S )</b> de la siguiente y <b>( R )</b> de la anterior. Siempre en ese orden. Traducir un GRAFCET es repetirlo tantas veces como transiciones haya.');
 }});

/* 10 · Modos de marcha */
SIMS.modos=el=>build(el,{w:680,h:324,
 selects:[{k:'ma',l:'Selector M/A',v:'auto',opts:[['auto','Automático'],['man','Manual']]},
  {k:'fallo',l:'Condición de fallo',v:'no',opts:[['no','Sin fallo'],['si','Lleno y vacío a la vez']]}],
 sliders:[{k:'et',l:'Etapa activa',v:1,min:0,max:3,step:1},
  {k:'bv1',l:'Pulsador manual BV1',v:0,min:0,max:1,step:1}],
 draw(a){a.clear();const s=a.st,auto=s.ma==='auto',F=s.fallo==='si';
  const et = F?9:s.et;
  /* grafcet de dos ramas */
  const ox=60,oy=58;
  const caja=(x,y,n,on,w)=>{w=w||30;
    if(on)Rbox(a,x-w/2,y-12,w,24,C.a,3); else Rline(a,x-w/2,y-12,w,24,C.grid,3,1.3);
    a.txt(n,x,y+4,on?C.bg:C.muted,11.5,'center');};
  Rline(a,ox+100-19,oy-14,38,28,et===0?C.a:C.grid,3,et===0?2.2:1.2);
  caja(ox+100,oy,'0',et===0&&!F);
  a.line(ox+100,oy+12,ox+100,oy+30,C.grid,1.5);
  a.line(ox+40,oy+30,ox+160,oy+30,C.grid,1.6);
  /* rama manual */
  a.line(ox+40,oy+30,ox+40,oy+44,C.grid,1.4);
  a.line(ox+32,oy+44,ox+48,oy+44,!auto?C.c:C.grid,1.8);
  a.txt('M/A',ox+2,oy+48,!auto?C.c:C.muted,10,'right');
  caja(ox+40,oy+66,'11',!auto&&et>=1&&!F);
  a.line(ox+40,oy+78,ox+40,oy+96,C.grid,1.4);
  a.line(ox+32,oy+96,ox+48,oy+96,(!auto&&s.bv1)?C.c:C.grid,1.8);
  a.txt('BV1',ox+2,oy+100,(!auto&&s.bv1)?C.c:C.muted,10,'right');
  caja(ox+40,oy+118,'12',!auto&&s.bv1===1&&et>=2&&!F);
  Rline(a,ox+66,oy+106,34,24,(!auto&&s.bv1)?C.b:C.grid,3,1.2);
  a.txt('V1',ox+83,oy+122,(!auto&&s.bv1)?C.b:C.muted,10.5,'center');
  /* rama automática */
  a.line(ox+160,oy+30,ox+160,oy+44,C.grid,1.4);
  a.line(ox+152,oy+44,ox+168,oy+44,auto?C.c:C.grid,1.8);
  a.txt('M̄/A',ox+176,oy+48,auto?C.c:C.muted,10);
  caja(ox+160,oy+66,'21',auto&&et>=1&&!F);
  a.line(ox+160,oy+78,ox+160,oy+96,C.grid,1.4);
  a.line(ox+152,oy+96,ox+168,oy+96,(auto&&!F)?C.c:C.grid,1.8);
  a.txt('MinTP·F̄',ox+176,oy+100,(auto&&!F)?C.c:C.muted,10);
  caja(ox+160,oy+118,'22',auto&&et>=2&&!F);
  Rline(a,ox+186,oy+106,34,24,(auto&&et>=2&&!F)?C.b:C.grid,3,1.2);
  a.txt('V1',ox+203,oy+122,(auto&&et>=2&&!F)?C.b:C.muted,10.5,'center');
  a.line(ox+160,oy+130,ox+160,oy+148,C.grid,1.4);
  a.line(ox+152,oy+148,ox+168,oy+148,C.grid,1.8);
  a.txt('MaxTP',ox+176,oy+152,C.muted,10);
  caja(ox+160,oy+170,'23',auto&&et>=3&&!F);
  Rline(a,ox+186,oy+158,34,24,(auto&&et>=3&&!F)?C.b:C.grid,3,1.2);
  a.txt('V2',ox+203,oy+174,(auto&&et>=3&&!F)?C.b:C.muted,10.5,'center');
  /* rama de fallo */
  if(F){
    a.line(ox+100,oy+200,ox+100,oy+216,C.d,1.6);
    caja(ox+100,oy+238,'40',true,34);
    Rline(a,ox+128,oy+226,34,24,C.d,3,1.4);
    a.txt('H4',ox+145,oy+242,C.d,10.5,'center');
    a.txt('fallo activo: bloquea todo',ox+30,oy+268,C.d,11);
  }
  a.txt('MANUAL',ox+40,oy+(F?200:200),C.muted,10.5,'center');
  a.txt('AUTOMÁTICO',ox+160,oy+200,C.muted,10.5,'center');
  /* panel */
  const px=380,py=58;
  a.txt('Parte combinacional',C.a?px:px,py,C.a,13.5);
  const LMAN=!auto&&!F, LAUTO=auto&&!F;
  const V1 = !F && ((!auto&&s.bv1===1&&et>=2)||(auto&&et===2));
  const V2 = !F && (auto&&et>=3);
  const sal=[['LMAN','E11+E12+E13',LMAN],['LAUTO','E21+E22+E23',LAUTO],
   ['V1','E12 + E22',V1],['V2','E13 + E23',V2],['H4','E40  (fallo)',F]];
  sal.forEach(([n,e,on],i)=>{const y=py+30+i*34;
    if(on)Rbox(a,px,y-12,20,18,n==='H4'?C.d:C.a,3); else Rline(a,px,y-12,20,18,C.grid,3,1.2);
    a.txt(on?'1':'0',px+10,y+1,on?C.bg:C.muted,11,'center');
    a.txt(n,px+30,y+1,on?C.text:C.muted,12.5);
    a.txt(e,px+88,y+1,C.muted,10.5);});
  a.txt('El piloto de un modo es la O',px,py+212,C.muted,11);
  a.txt('de todas las etapas de su rama.',px,py+230,C.muted,11);
  a.txt(F?'Con fallo activo no se llena ningún tanque':'',px,py+256,C.d,11.5);
  a.html(F
   ? 'La condición de fallo se <b>memoriza</b>, se <b>señaliza</b> con H4 y, negada, se añade a todas las receptividades de llenado. Sólo se borra con una acción expresa del operador: un fallo que desaparece solo es un fallo que nadie ve.'
   : (auto
   ? 'En <b>automático</b> el ciclo evoluciona solo con los sensores de nivel. Fíjate en que los pilotos no son etapas: se calculan en la <b>parte combinacional</b> como la unión en O de todas las etapas de la rama.'
   : 'En <b>manual</b> cada válvula se abre mientras se pulse su botón: la etapa 12 sólo está activa con BV1 pulsado. El cambio de modo pasa siempre por la <b>etapa inicial</b>, para que ninguna válvula quede abierta.'));
 }});
  


/* ---- paso a paso declarativo ---- */
SIMS.__paso=(el,D)=>build(el,{w:D.w||660,h:D.h||340,
 sliders:[{k:'paso',v:0,min:0,max:D.steps.length,step:1,l:'paso de la resolución (0 = enunciado)',u:''}],
 draw(a){a.clear();const g=a.g,p=a.st.paso;
  const it=(x,col)=>{const k=x[0];
   if(k==='t')a.txt(x[1],x[2],x[3],col,x[4]||13,x[5]||'left');
   else if(k==='l')a.line(x[1],x[2],x[3],x[4],col,x[5]||1.5,x[6]);
   else if(k==='a')a.arrow(x[1],x[2],x[3],x[4],col,x[5]);
   else if(k==='c')a.circ(x[1],x[2],x[3],col,!!x[4]);
   else if(k==='r'){g.strokeStyle=col;g.lineWidth=1.8;if(x[5]){g.fillStyle=col;g.globalAlpha=.18;g.fillRect(x[1],x[2],x[3],x[4]);g.globalAlpha=1;}g.strokeRect(x[1],x[2],x[3],x[4]);}
   else if(k==='p'){g.strokeStyle=col;g.lineWidth=x[2]||2;g.beginPath();x[1].forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();}};
  (D.base||[]).forEach(x=>it(x,C.muted));
  D.steps.forEach((s,i)=>{if(i+1>p)return;const cur=(i+1===p);(s.add||[]).forEach(x=>it(x,cur?C.d:C.text));if(cur)(s.now||[]).forEach(x=>it(x,C.d));});
  a.html('<div>'+(p===0?D.q:D.steps[p-1].text)+'</div>');}});
/* ---- fin paso a paso declarativo ---- */

/* ---- paso2 grafcetPaso ---- */
SIMS.grafcetPaso=el=>SIMS.__paso(el,{"w":560,"h":290,"q":"Un cilindro neumático debe salir y volver al pulsar Marcha. Sube el paso para ver cómo se mueve la <b>marca de etapa activa</b> y qué receptividad permite cada transición.","base":[["t","Ciclo de un cilindro: marcha → sale → vuelve",30,24,13,"left"],["r",140,60,140,44,0],["t","0 · reposo",210.0,87,14,"center"],["r",140,140,140,44,0],["t","1 · A+ (sale)",210.0,167,14,"center"],["r",140,220,140,44,0],["t","2 · A− (vuelve)",210.0,247,14,"center"],["l",210.0,104,210.0,140,1.5],["l",210.0,184,210.0,220,1.5],["l",280,242,340,242,1.5],["l",340,242,340,82,1.5],["l",340,82,280,82,1.5]],"steps":[{"text":"La etapa <b>0</b> está activa (marca inicial): el cilindro está retraído y no se ejecuta ninguna acción. Mientras la transición siguiente no se cumpla, el sistema espera.","now":[["r",140,60,140,44,1],["t","●",128,87,16,"right"]]},{"text":"Se pulsa <b>Marcha</b> (receptividad de la transición 0→1) y el cilindro está en <b>a0</b> (retraído). Con las dos condiciones a la vez, la transición está <b>validada y franqueable</b>.","add":[["t","Marcha · a0",218.0,125,13,"left"]],"now":[["r",140,60,140,44,1],["t","●",128,87,16,"right"]]},{"text":"Se franquea: la etapa 0 se <b>desactiva</b> y la etapa <b>1</b> se activa a la vez. Su acción asociada, <b>A+</b>, empieza a ejecutarse mientras la etapa esté activa.","now":[["r",140,140,140,44,1],["t","●",128,167,16,"right"]]},{"text":"La transición 1→2 espera la receptividad <b>a1</b> (el cilindro llegó al final de carrera). Hasta entonces la etapa 1 sigue activa y A+ se mantiene.","add":[["t","a1",218.0,205,13,"left"]],"now":[["r",140,140,140,44,1],["t","●",128,167,16,"right"]]},{"text":"Con a1 activo se franquea: se activa la etapa <b>2</b> (acción A−, el cilindro vuelve) y se desactiva la 1. Siempre hay <b>una etapa activa</b> en una secuencia lineal.","now":[["r",140,220,140,44,1],["t","●",128,247,16,"right"]]},{"text":"La última transición, con receptividad <b>a0</b>, devuelve el ciclo a la etapa <b>0</b>: la secuencia es cíclica y queda lista para otra pulsación de Marcha.","add":[["t","a0",346,167,13,"left"]],"now":[["r",140,220,140,44,1],["t","●",128,247,16,"right"]]}]});
/* ---- fin paso2 grafcetPaso ---- */
document.querySelectorAll('[data-sim]').forEach(function(el){var k=el.getAttribute('data-sim'); if(SIMS[k]){ try{ SIMS[k](el); }catch(e){ console.error('sim '+k, e); } }});
})();
