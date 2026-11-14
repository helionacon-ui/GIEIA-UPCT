/* Figuras interactivas de Física II. Vanilla JS + canvas. */
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

/* ---- Física II: cuerpos de las figuras ---- */

SIMS.gauss=el=>build(el,{w:640,h:380,
 selects:[{k:'d',v:'esf',l:'distribución',opts:[['esf','esfera uniforme (carga Q)'],['cond','esfera conductora / corteza'],['hilo','hilo infinito (λ)'],['plano','plano infinito (σ)'],['cortcil','corteza cilíndrica']]}],
 sliders:[{k:'R',v:1.0,min:0.4,max:1.6,step:0.05,l:'radio R',u:'m'}],
 draw(a){a.clear();const d=a.st.d,R=a.st.R;const x0=60,y0=a.H-60,w=a.W-280,h=a.H-110;
  a.line(x0,y0,x0+w,y0,C.text,1.5);a.line(x0,y0,x0,y0-h,C.text,1.5);a.txt('r',x0+w+8,y0+4,C.muted,12);a.txt('E(r)',x0-8,y0-h-8,C.muted,12,'right');
  const rmax=3.2,u=w/rmax;const xr=r=>x0+r*u;
  // dibujo de la distribución a la derecha
  const cx=a.W-120,cy=120;
  if(d==='esf'||d==='cond'){a.circ(cx,cy,46,C.a,false);if(d==='esf'){a.g.globalAlpha=0.15;a.circ(cx,cy,46,C.a,true);a.g.globalAlpha=1;a.txt('ρ uniforme',cx,cy+4,C.a,11,'center');}else{a.g.lineWidth=4;a.circ(cx,cy,46,C.a,false);a.txt('carga en la',cx,cy-2,C.muted,10,'center');a.txt('superficie',cx,cy+10,C.muted,10,'center');}}
  if(d==='hilo'){a.line(cx,60,cx,180,C.a,4);a.txt('λ',cx+10,120,C.a,13);}
  if(d==='plano'){a.g.globalAlpha=0.25;a.g.fillStyle=C.a;a.g.fillRect(cx-6,55,12,130);a.g.globalAlpha=1;a.txt('σ',cx+12,120,C.a,13);for(const s of[-1,1]){a.arrow(cx+s*10,120,cx+s*52,120,C.b,2);}}
  if(d==='cortcil'){a.circ(cx,cy,46,C.a,false);a.circ(cx,cy,38,C.a,false);a.txt('I ó λ en la corteza',cx,cy+70,C.muted,10,'center');}
  // curva E(r)
  let f,lab,detail;
  if(d==='esf'){f=r=>r<R?r/R:(R*R)/(r*r)* (1/R);lab='E∝r dentro, ∝1/r² fuera';detail=`Dentro: E = kQr/R³ (crece lineal). Fuera: E = kQ/r² como carga puntual. Continua en r = R.`;}
  else if(d==='cond'){f=r=>r<R?0:(R*R)/(r*r)*(1/R);lab='E=0 dentro';detail=`Conductor o corteza: E = 0 en el interior (Gauss no encierra carga); fuera E = kQ/r². Salto σ/ε₀ en la superficie.`;}
  else if(d==='hilo'){f=r=>r<0.08?0:0.45/r;lab='E=2kλ/r';detail=`Gaussiana cilíndrica: E·2πrL = λL/ε₀ ⇒ E = λ/2πε₀r = 2kλ/r.`;}
  else if(d==='plano'){f=r=>0.5;lab='E=σ/2ε₀ constante';detail=`El campo de un plano infinito no depende de la distancia: E = σ/2ε₀ a cada lado. Dos planos opuestos (condensador): σ/ε₀ entre ellos y 0 fuera.`;}
  else{f=r=>r<R?0:0.9*R/r;lab='B=0 dentro';detail=`Corteza cilíndrica (también con corriente, tema 5): dentro no se encierra nada ⇒ campo nulo; fuera como si todo estuviera en el eje (∝1/r).`;}
  const esc=(y0-40-(y0-h))/1.0;
  a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();let first=true;
  for(let px=0;px<=w;px+=2){const r=px/u;let v=f(Math.max(r,0.001));v=Math.min(v,1.15);const X=x0+px,Y=y0-v*(h-40);if(first){a.g.moveTo(X,Y);first=false;}else a.g.lineTo(X,Y);}
  a.g.stroke();
  if(d!=='hilo'&&d!=='plano'){a.line(xr(R),y0,xr(R),y0-h+30,C.muted,1,[5,4]);a.txt('R',xr(R),y0+16,C.muted,12,'center');}
  a.txt(lab,x0+12,y0-h+14,C.a,12.5);
  a.html(`<b>Ley de Gauss:</b> ∮E·dA = Q<sub>int</sub>/ε₀. ${detail}<br><span class="hint">Es exactamente el problema 1 del examen de marzo de 2024 (esfera conductora + corteza): E = 0 en los conductores y kQ/r² en los huecos; el potencial sale integrando esta curva desde el infinito.</span>`);}});

SIMS.potencial=el=>build(el,{w:640,h:380,
 sliders:[{k:'q2',v:1,min:-2,max:2,step:0.25,l:'carga q₂ (q₁ = +1)',u:'µC'},{k:'d',v:2,min:1,max:3.4,step:0.1,l:'separación',u:'m'}],
 draw(a){a.clear();const q1=1,q2=a.st.q2,d=a.st.d;const y0=a.H-120,x0=60,w=a.W-120;const u=w/5;const X=x=>x0+x*u;
  const p1=1.0,p2=1.0+d;
  // potencial a lo largo del eje
  a.line(x0,y0,x0+w,y0,C.text,1.5);a.txt('x (m)',x0+w+6,y0+4,C.muted,11);
  const V=x=>{const r1=Math.abs(x-p1),r2=Math.abs(x-p2);return 9*(q1/Math.max(r1,0.07)+q2/Math.max(r2,0.07));};
  a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.beginPath();let first=true;
  for(let px=0;px<=w;px+=2){const x=px/u;let v=V(x);v=Math.max(Math.min(v,160),-160);const Y=y0-v*0.55;if(first){a.g.moveTo(x0+px,Y);first=false;}else a.g.lineTo(x0+px,Y);}
  a.g.stroke();
  a.circ(X(p1),y0,9,C.d,true);a.txt('+1',X(p1),y0+24,C.d,12,'center');
  a.circ(X(p2),y0,9,q2>=0?C.d:C.f,true);a.txt((q2>=0?'+':'')+F(q2),X(p2),y0+24,q2>=0?C.d:C.f,12,'center');
  // punto donde V=0 si existe entre cargas
  let zero=null;
  if(q2<0){const r=q1/(-q2);zero=p1+d*r/(1+r);a.line(X(zero),y0-60,X(zero),y0+10,C.b,1.5,[4,3]);a.txt('V = 0',X(zero),y0-68,C.b,11,'center');}
  const mid=V(p1+d/2);
  a.txt('V(x) a lo largo del eje',x0+10,36,C.a,12.5);
  a.html(`V se suma como ESCALAR: V = kq₁/r₁ + kq₂/r₂. En el punto medio V = ${F(mid)} kV·µ. ${q2<0?`Con cargas opuestas hay un punto de V = 0 entre ellas (donde k q₁/r₁ = k|q₂|/r₂) — pero el CAMPO no se anula ahí.`:`Con cargas iguales el campo se anula en el centro, pero el potencial NO (se suma, vale 2kq/r).`}<br><span class="hint">Pregunta típica de test: distinguir dónde se anula V (suma escalar) y dónde E (suma vectorial). W = qΔV para mover cargas.</span>`);}});

SIMS.condensador=el=>build(el,{w:640,h:360,
 sliders:[{k:'er',v:1,min:1,max:8,step:0.5,l:'constante dieléctrica εr',u:''},{k:'x',v:100,min:0,max:100,step:5,l:'inserción del dieléctrico',u:'%'}],
 selects:[{k:'m',v:'q',l:'batería',opts:[['q','desconectada (Q constante)'],['v','conectada (V constante)']]}],
 draw(a){a.clear();const er=a.st.er,fx=a.st.x/100,m=a.st.m;
  const C0=1;const Cx=C0*(1+(er-1)*fx); // paralelo de dos zonas
  let Q,V,E,U;const Q0=1,V0=1,U0=0.5;
  if(m==='q'){Q=Q0;V=Q0/Cx;E=V;U=0.5*Q*Q/Cx;}else{V=V0;Q=Cx*V0;E=V0;U=0.5*Cx*V0*V0;}
  // dibujo
  const px=90,py=70,pw=300,ph=140;
  a.g.fillStyle=C.text;a.g.fillRect(px,py-8,pw,8);a.g.fillRect(px,py+ph,pw,8);
  a.txt('+Q',px-24,py,C.d,13);a.txt('−Q',px-24,py+ph+6,C.f,13);
  const wd=pw*fx;
  if(wd>2){a.g.globalAlpha=0.3;a.g.fillStyle=C.c;a.g.fillRect(px,py,wd,ph);a.g.globalAlpha=1;a.txt('εr = '+F(er),px+wd/2,py+ph/2+4,C.c,13,'center');}
  for(let i=0;i<5;i++){const xx=px+30+i*55;a.arrow(xx,py+14,xx,py+ph-14,xx<px+wd?C.c:C.b,2);}
  // barras comparativas
  const bars=[['C',Cx/C0],['Q',Q/Q0],['V',V/V0],['U',U/U0]];const bx=470;
  bars.forEach((b,i)=>{const y=60+i*62;const val=b[1];a.txt(b[0],bx-18,y+26,C.text,14);
   a.g.fillStyle=C.grid;a.g.fillRect(bx,y+10,130,20);a.g.fillStyle=val>=1?C.a:C.f;a.g.fillRect(bx,y+10,Math.min(130,130*val/ (val>2? val:2)*(val>2?2:1) ),20);
   a.txt('×'+F(val),bx+136,y+26,C.muted,12);});
  a.html(`C = ε₀b[(εr−1)x+a]/d = <b>×${F(Cx)}</b> (dos condensadores en paralelo: zona con y sin dieléctrico — problema 3 de la hoja). ${m==='q'?`<b>Q constante</b>: V y E bajan (×${F(1/Cx)}), energía U = Q²/2C baja ×${F(U/U0/1)} → el dieléctrico es ATRAÍDO; sacarlo cuesta trabajo (problema 6).`:`<b>V constante</b>: Q sube ×${F(Q)}, la energía sube ×${F(U/U0)} (la aporta la batería).`}<br><span class="hint">La pareja de preguntas «conectada/desconectada» decide todos los problemas de dieléctricos del parcial.</span>`);}});

SIMS.circuitorc=el=>build(el,{w:640,h:370,
 sliders:[{k:'R',v:100,min:20,max:300,step:10,l:'R',u:'Ω'},{k:'C',v:12,min:2,max:30,step:1,l:'C',u:'µF'},{k:'V',v:12,min:5,max:24,step:1,l:'V fuente',u:'V'}],
 selects:[{k:'m',v:'c',l:'proceso',opts:[['c','carga (cierra a)'],['d','descarga (cierra b)']]}],
 draw(a){a.clear();const R=a.st.R,Cc=a.st.C*1e-6,V=a.st.V,m=a.st.m;const tau=R*Cc*1000; // ms
  const x0=70,y0=a.H-60,w=a.W-130,h=a.H-120;
  a.line(x0,y0,x0+w,y0,C.text,1.5);a.line(x0,y0,x0,y0-h,C.text,1.5);
  a.txt('t (ms)',x0+w-10,y0+18,C.muted,11);a.txt(m==='c'?'q/Qf':'I/I₀',x0-10,y0-h-6,C.muted,11,'right');
  const T=5*tau,u=w/T;
  for(let i=1;i<=5;i++){a.line(x0+i*tau*u,y0,x0+i*tau*u,y0-h+10,C.grid,1,[3,4]);a.txt(i+'τ',x0+i*tau*u,y0+14,C.muted,10,'center');}
  a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
  for(let px=0;px<=w;px+=2){const t=px/u;const y=m==='c'?1-Math.exp(-t/tau):Math.exp(-t/tau);const Y=y0-y*(h-20);px===0?a.g.moveTo(x0,Y):a.g.lineTo(x0+px,Y);}
  a.g.stroke();
  const t90=tau*Math.log(10),t50=tau*Math.log(2);
  if(m==='c'){a.line(x0,y0-0.9*(h-20),x0+t90*u,y0-0.9*(h-20),C.b,1.5,[4,3]);a.line(x0+t90*u,y0-0.9*(h-20),x0+t90*u,y0,C.b,1.5,[4,3]);a.txt('90 %',x0+6,y0-0.9*(h-20)-6,C.b,11);}
  else{a.line(x0,y0-0.5*(h-20),x0+t50*u,y0-0.5*(h-20),C.b,1.5,[4,3]);a.line(x0+t50*u,y0-0.5*(h-20),x0+t50*u,y0,C.b,1.5,[4,3]);a.txt('50 %',x0+6,y0-0.5*(h-20)-6,C.b,11);}
  a.html(`τ = RC = ${F(tau)} ms · I₀ = V/R = ${F(V/R*1000)} mA · Q<sub>f</sub> = CV = ${F(Cc*V*1e6)} µC.<br>${m==='c'?`Carga: q = Q<sub>f</sub>(1−e<sup>−t/τ</sup>). Al 90 %: t = τ·ln 10 = <b>${F(t90)} ms</b> (apartado a del examen 2024).`:`Descarga: I = I₀e<sup>−t/τ</sup>. A la mitad: t = τ·ln 2 = <b>${F(t50)} ms</b> (apartado d del examen 2024).`}<br><span class="hint">En t = 0 el condensador descargado es un cable (I máxima); en t → ∞ es un circuito abierto. Energía disipada en R = diferencia de energías del condensador.</span>`);}});

SIMS.ciclotron=el=>build(el,{w:640,h:380,
 sliders:[{k:'v',v:2,min:0.5,max:4,step:0.1,l:'velocidad v',u:'×10⁶ m/s'},{k:'B',v:1,min:0.3,max:2,step:0.1,l:'campo B',u:'T'},{k:'q',v:1,min:-1,max:1,step:2,l:'signo de la carga',u:''}],
 draw(a){a.clear();const v=a.st.v,B=a.st.B,s=a.st.q>=0?1:-1;
  const m=1.67e-27,qe=1.6e-19;const r=m*v*1e6/(qe*B);const T=2*Math.PI*m/(qe*B);
  const cx=240,cy=190;const rp=Math.min(140,r*1e2*45);
  // región de campo
  for(let i=0;i<9;i++)for(let j=0;j<6;j++){const x=70+i*48,y=60+j*52;a.circ(x,y,2.2,C.muted,true);a.circ(x,y,6,C.muted,false);}
  a.txt('B saliente ⊙',540,50,C.muted,12,'center');
  a.circ(cx,cy,rp,C.a,false);
  const th=performance&&0||0;
  const px=cx+rp,py=cy;
  a.circ(px,py,8,s>0?C.d:C.f,true);
  a.arrow(px,py,px,py-s*46,C.c,2.5);a.txt('v',px+10,py-s*30,C.c,13);
  a.arrow(px,py,px-46,py,C.b,2.5);a.txt('F=qv×B',px-120,py-6,C.b,12);
  a.txt(s>0?'+q':'−q (gira al revés)',px+14,py+5,s>0?C.d:C.f,12);
  a.html(`r = mv/qB = <b>${(r*100).toFixed(1)} cm</b> (protón) · T = 2πm/qB = <b>${(T*1e8).toFixed(2)}×10⁻⁸ s</b> · f = ${(1/T/1e6).toFixed(2)} MHz.<br><span class="hint">El período NO depende de v (principio del ciclotrón). F = qv×B es perpendicular a v: no hace trabajo, solo curva. Selector de velocidades: con E y B cruzados pasan sin desviarse las cargas con v = E/B.</span>`);}});

SIMS.induccion=el=>build(el,{w:640,h:380,
 sliders:[{k:'B',v:0.8,min:0.2,max:1.5,step:0.05,l:'B',u:'T'},{k:'v',v:10,min:2,max:20,step:1,l:'v',u:'m/s'},{k:'L',v:0.2,min:0.1,max:0.5,step:0.05,l:'L (separación raíles)',u:'m'},{k:'R',v:2,min:0.5,max:10,step:0.5,l:'R',u:'Ω'}],
 draw(a){a.clear();const B=a.st.B,v=a.st.v,L=a.st.L,R=a.st.R;
  const fem=B*L*v,I=fem/R,Fm=B*I*L,P=Fm*v;
  // raíles
  const y1=90,y2=230,x1=70,x2=560,xb=300;
  for(let i=0;i<10;i++)for(let j=0;j<4;j++){const x=90+i*48,y=100+j*40;a.g.fillStyle=C.muted;a.g.font='13px system-ui';a.g.textAlign='center';a.g.fillText('×',x,y);}
  a.txt('B entrante ×',540,70,C.muted,12,'center');
  a.line(x1,y1,x2,y1,C.text,3);a.line(x1,y2,x2,y2,C.text,3);
  a.g.fillStyle=C.grid;a.g.fillRect(x1-18,y1,16,y2-y1);a.txt('R',x1-28,(y1+y2)/2+4,C.text,13);
  a.g.fillStyle=C.a;a.g.fillRect(xb-5,y1-4,10,y2-y1+8);
  a.arrow(xb+14,(y1+y2)/2,xb+70,(y1+y2)/2,C.c,3);a.txt('v',xb+76,(y1+y2)/2+4,C.c,13);
  a.arrow(xb-14,(y1+y2)/2,xb-70,(y1+y2)/2,C.b,3);a.txt('F=BIL',xb-130,(y1+y2)/2-8,C.b,12);
  // sentido corriente (Lenz): flujo entrante aumenta -> I antihoraria
  a.arrow(xb-40,y1-14,x1+60,y1-14,C.d,2);a.arrow(x1+60,y2+14,xb-40,y2+14,C.d,2);a.txt('I (Lenz)',x1+100,y1-22,C.d,12);
  a.html(`ε = BLv = <b>${F2(fem)} V</b> · I = ε/R = <b>${F2(I)} A</b> · F = BIL = <b>${F2(Fm)} N</b> · P = Fv = <b>${F2(P)} W</b> = I²R = ${F2(I*I*R)} W ✓<br><span class="hint">Problema 3 de la hoja del tema 6 con sus valores por defecto (1,6 V; 0,8 A; 0,128 N; 1,28 W). Lenz: el flujo entrante crece, la corriente inducida gira para crear flujo saliente y la fuerza magnética FRENA la barra: hay que empujar con P = Fv, que acaba disipada en R.</span>`);
  function F2(x){return x<0.01?x.toExponential(2).replace('.',','):F(x);}}});

SIMS.histeresis=el=>build(el,{w:640,h:370,
 selects:[{k:'m',v:'duro',l:'material',opts:[['duro','ferromagnético duro (imán)'],['blando','ferromagnético blando (transformador)'],['para','paramagnético'],['dia','diamagnético']]}],
 draw(a){a.clear();const m=a.st.m;const cx=240,cy=185,u=150;
  a.axes(cx,cy,u,-1.05,1.05,-1.05,1.05);a.txt('H',cx+u+12,cy+4,C.muted,12);a.txt('B',cx-6,cy-u-8,C.muted,12,'right');
  a.g.lineWidth=3;
  if(m==='para'||m==='dia'){const k=m==='para'?0.25:-0.18;a.g.strokeStyle=m==='para'?C.c:C.f;a.g.beginPath();a.g.moveTo(cx-u,cy+k*u);a.g.lineTo(cx+u,cy-k*u);a.g.stroke();
   a.html(m==='para'?`Paramagnético: M = χH con χ &gt; 0 pequeño (~10⁻⁵-10⁻³): lineal, sin histéresis, depende de la temperatura (Curie). B apenas aumenta.`:`Diamagnético: χ &lt; 0 diminuto (el líquido del problema 1: χ = −4×10⁻⁵): se opone débilmente al campo. Todos los materiales lo son de fondo.`);return;}
  const anc=m==='duro'?0.55:0.15, sat=0.9;
  const f=(h,dir)=>sat*Math.tanh(2.2*(h+dir*anc));
  a.g.strokeStyle=C.a;a.g.beginPath();
  for(let i=-100;i<=100;i++){const h=i/100;const y=f(h,1);i===-100?a.g.moveTo(cx+h*u,cy-y*u):a.g.lineTo(cx+h*u,cy-y*u);}a.g.stroke();
  a.g.beginPath();
  for(let i=100;i>=-100;i--){const h=i/100;const y=f(h,-1);i===100?a.g.moveTo(cx+h*u,cy-y*u):a.g.lineTo(cx+h*u,cy-y*u);}a.g.stroke();
  const Br=f(0,1),Hc=anc;
  a.circ(cx,cy-Br*u,4,C.b,true);a.txt('B remanente',cx+8,cy-Br*u-6,C.b,11);
  a.circ(cx-Hc*u,cy,4,C.d,true);a.txt('H coercitivo',cx-Hc*u-6,cy+18,C.d,11,'right');
  a.html(`${m==='duro'?'<b>Duro</b>: ciclo ANCHO — mucha remanencia y coercitividad: imanes permanentes; gran pérdida por ciclo (área).':'<b>Blando</b>: ciclo ESTRECHO — se magnetiza y desmagnetiza con poco H: núcleos de transformador y electroimanes, pocas pérdidas.'}<br><span class="hint">B = μ₀(H + M). El área del ciclo es la energía disipada por ciclo y unidad de volumen (práctica de histéresis). Pregunta segura del segundo parcial: dibujar el ciclo y señalar remanencia y coercitividad.</span>`);}});

SIMS.rlc=el=>build(el,{w:640,h:400,
 sliders:[{k:'R',v:8,min:1,max:40,step:1,l:'R',u:'Ω'},{k:'L',v:50,min:5,max:200,step:5,l:'L',u:'mH'},{k:'Cc',v:20,min:2,max:100,step:2,l:'C',u:'µF'},{k:'f',v:159,min:20,max:600,step:1,l:'frecuencia f',u:'Hz'}],
 draw(a){a.clear();const R=a.st.R,L=a.st.L/1000,Cc=a.st.Cc*1e-6,f=a.st.f;const w=2*Math.PI*f;
  const XL=w*L,XC=1/(w*Cc),X=XL-XC,Z=Math.hypot(R,X),phi=Math.atan2(X,R);
  const f0=1/(2*Math.PI*Math.sqrt(L*Cc));
  // fasores
  const cx=150,cy=180,esc=Math.min(110/Math.max(Z,R,Math.abs(X))*1,110/Z*0.9+0);
  const e2=110/Math.max(Z,R+5,Math.abs(X)+5);
  a.axes(cx,cy,1,0,0,0,0);
  a.arrow(cx,cy,cx+R*e2,cy,C.a,3);a.txt('R',cx+R*e2/2,cy+18,C.a,12,'center');
  a.arrow(cx+R*e2,cy,cx+R*e2,cy-X*e2,C.f,3);a.txt(X>=0?'XL−XC':'XC−XL',cx+R*e2+10,cy-X*e2/2,C.f,11);
  a.arrow(cx,cy,cx+R*e2,cy-X*e2,C.b,3.5);a.txt('Z',cx+R*e2/2-14,cy-X*e2/2-8,C.b,13);
  a.txt('φ = '+(phi*180/Math.PI).toFixed(1)+'°',cx+14,cy-14,C.text,12);
  // curva de resonancia I(f)
  const x0=320,y0=330,wq=280,hq=250;
  a.line(x0,y0,x0+wq,y0,C.text,1.5);a.line(x0,y0,x0,y0-hq,C.text,1.5);
  a.txt('f (Hz)',x0+wq-16,y0+16,C.muted,11);a.txt('I',x0-10,y0-hq+8,C.muted,12,'right');
  const fmax=600,uf=wq/fmax;const Imax=1/R;
  a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.beginPath();
  for(let px=2;px<=wq;px+=2){const ff=px/uf;const ww=2*Math.PI*ff;const ZZ=Math.hypot(R,ww*L-1/(ww*Cc));const y=(1/ZZ)/Imax;px===2?a.g.moveTo(x0+px,y0-y*(hq-20)):a.g.lineTo(x0+px,y0-y*(hq-20));}
  a.g.stroke();
  a.line(x0+f0*uf,y0,x0+f0*uf,y0-hq+16,C.c,1.5,[4,3]);a.txt('f₀='+f0.toFixed(0)+' Hz',x0+f0*uf,y0-hq+10,C.c,11,'center');
  a.line(x0+f*uf,y0,x0+f*uf,y0-hq+16,C.b,1.5);
  const Q=Math.sqrt(L/Cc)/R;
  a.html(`X_L = ωL = ${F(XL)} Ω · X_C = 1/ωC = ${F(XC)} Ω · <b>Z = ${F(Z)} Ω</b>, φ = ${(phi*180/Math.PI).toFixed(1)}° (${Math.abs(X)<0.5?'RESONANCIA':X>0?'inductivo: V adelanta a I':'capacitivo: I adelanta a V'}).<br>f₀ = 1/2π√(LC) = <b>${f0.toFixed(0)} Hz</b> · Q = ω₀L/R = ${F(Q)} · cos φ = ${F(Math.cos(phi))}.<br><span class="hint">En resonancia Z = R (corriente máxima) y V_L = V_C pueden superar la tensión de la fuente (problema 6: V_R = 100 V con V_L = V_C = 100 V desfasadas ±90°). Potencia: P = V_e·I_e·cos φ = I_e²R.</span>`);}});

SIMS.ondas=el=>build(el,{w:640,h:390,
 selects:[{k:'m',v:'viaj',l:'modo',opts:[['viaj','onda viajera'],['est','onda estacionaria'],['dop','efecto Doppler'],['db','decibelios']]}],
 sliders:[{k:'lam',v:2,min:1,max:4,step:0.1,l:'longitud de onda λ',u:'m'},{k:'vf',v:30,min:-60,max:60,step:5,l:'v fuente (Doppler)',u:'m/s'}],
 draw(a){a.clear();const m=a.st.m,lam=a.st.lam;
  if(m==='db'){const x0=80,y0=300,w=480,h=220;
   a.line(x0,y0,x0+w,y0,C.text,1.5);a.line(x0,y0,x0,y0-h,C.text,1.5);
   const dat=[['susurro',20],['conversación',60],['1 persona gritando',50],['100 personas',70],['concierto',110],['umbral de dolor',120]];
   dat.forEach((d,i)=>{const x=x0+30+i*76;const hh=d[1]/130*(h-20);a.g.fillStyle=i===2||i===3?C.b:C.a;a.g.fillRect(x,y0-hh,40,hh);a.txt(d[1]+' dB',x+20,y0-hh-6,C.text,11,'center');
    a.g.save();a.g.translate(x+20,y0+10);a.g.rotate(0.5);a.txt(d[0],0,0,C.muted,10);a.g.restore();});
   a.html(`β = 10·log(I/I₀), I₀ = 10⁻¹² W/m². Sumar fuentes incoherentes = sumar INTENSIDADES: 100 personas a 50 dB → I×100 → +20 dB → 70 dB (problema 3). Duplicar I son +3 dB; ÷10 en distancia son +20 dB (I ∝ 1/r²).`);return;}
  if(m==='dop'){const v=340,vf=a.st.vf;const cx=320,cy=160;
   for(let i=1;i<=5;i++){const r=i*28;const off=vf*i*0.45;a.circ(cx-off,cy,r,C.a,false);}
   a.circ(cx,cy,7,C.d,true);a.arrow(cx,cy,cx+Math.sign(vf)*44,cy,C.c,2.5);
   a.txt('observador →',560,cy+40,C.muted,11,'center');a.circ(560,cy+20,6,C.f,true);
   const fper=700*v/(v-vf);
   a.html(`Fuente a ${Math.abs(vf)} m/s ${vf>0?'ACERCÁNDOSE':'alejándose'}: los frentes se ${vf>0?'comprimen':'estiran'} delante. f′ = f·v/(v∓v_f): un silbato de 700 Hz se oye a <b>${fper.toFixed(0)} Hz</b>.<br><span class="hint">Observador móvil: f′ = f(v±v_o)/v. Problema 4 de la hoja: combina Doppler (642→704 Hz) con +20 dB de acercamiento (distancia ÷10).</span>`);return;}
  const x0=60,y0=170,w=520;const u=w/8;
  a.line(x0,y0,x0+w,y0,C.grid,1.5);
  const k=2*Math.PI/lam;
  if(m==='viaj'){a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
   for(let px=0;px<=w;px+=2){const x=px/u;const y=60*Math.sin(k*x);px===0?a.g.moveTo(x0,y0-y):a.g.lineTo(x0+px,y0-y);}a.g.stroke();
   a.arrow(x0+w-80,y0-90,x0+w-20,y0-90,C.c,2.5);a.txt('v = λf',x0+w-50,y0-100,C.c,12,'center');
   // marcar lambda
   a.line(x0,y0+60,x0+lam*u,y0+60,C.b,2);a.txt('λ = '+F(lam)+' m',x0+lam*u/2,y0+78,C.b,12,'center');
   a.html(`y = A·sen(kx − ωt) con k = 2π/λ = ${F(k)} rad/m. Si v = 340 m/s: f = v/λ = ${F(340/lam)} Hz, ω = ${F(2*Math.PI*340/lam)} rad/s, T = ${F(lam/340*1000)} ms.<br><span class="hint">Doble periodicidad: en x (λ) y en t (T). La potencia de una onda en una cuerda: P = ½μω²A²v.</span>`);}
  else{const n=Math.max(1,Math.round(8/lam));const L=8;
   a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
   for(let px=0;px<=w;px+=2){const x=px/u;const y=60*Math.sin(n*Math.PI*x/L);px===0?a.g.moveTo(x0,y0-y):a.g.lineTo(x0+px,y0-y);}a.g.stroke();
   a.g.strokeStyle=C.grid;a.g.lineWidth=2;a.g.beginPath();
   for(let px=0;px<=w;px+=2){const x=px/u;const y=-60*Math.sin(n*Math.PI*x/L);px===0?a.g.moveTo(x0,y0-y):a.g.lineTo(x0+px,y0-y);}a.g.stroke();
   for(let i=0;i<=n;i++){a.circ(x0+i*L/n*u,y0,4,C.d,true);}
   a.txt('nodos',x0+L/n*u,y0+22,C.d,11,'center');
   a.html(`Cuerda fija-fija de L = 8 m: solo caben λ_n = 2L/n. Ahora n = <b>${n}</b> (λ = ${F(2*L/n)} m): f_n = n·v/2L = armónico n. Dos extremos iguales: f_n = nv/2L; tubo cerrado por un extremo: f_n = nv/4L con n impar.<br><span class="hint">Problema 1: 300 y 425 Hz comparten fundamental mcd = 25 Hz (armónicos 12 y 17). Práctica de la cuerda: v = √(T/μ).</span>`);}}});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
