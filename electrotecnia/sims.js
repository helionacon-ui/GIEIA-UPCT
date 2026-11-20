/* Figuras interactivas de Electrotecnia. Vanilla JS + canvas. */
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

/* ---- Electrotecnia (máquinas eléctricas): figuras interactivas ---- */
const NQ=x=>{const r=Math.round(x*1000)/1000;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(3).replace(/0+$/,'')).replace('.',',');};
const N0=x=>(Math.abs(x)<0.5?0:x).toFixed(0);
const N1=x=>(Math.abs(x)<5e-2?0:x).toFixed(1).replace('.',',');
const N2=x=>(Math.abs(x)<5e-3?0:x).toFixed(2).replace('.',',');
const N3=x=>(Math.abs(x)<5e-4?0:x).toFixed(3).replace('.',',');
const MU0=4*Math.PI*1e-7;
const ticks=(max,n)=>{const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),c=[1,2,2.5,5,10].find(k=>k*p>=raw)*p;const o=[];for(let v=c;v<=max*1.0001;v+=c)o.push(v);return o;};
const Rbox=(a,x,y,w,h,col,fill)=>{if(fill){a.g.fillStyle=col;a.g.globalAlpha=0.14;a.g.fillRect(x,y,w,h);a.g.globalAlpha=1;}
  a.g.strokeStyle=col;a.g.lineWidth=2;a.g.strokeRect(x,y,w,h);};
const curve=(a,pts,col,wd,dash)=>{a.g.strokeStyle=col;a.g.lineWidth=wd||2;a.g.setLineDash(dash||[]);a.g.beginPath();
  pts.forEach((p,i)=>i?a.g.lineTo(p[0],p[1]):a.g.moveTo(p[0],p[1]));a.g.stroke();a.g.setLineDash([]);};

/* T1 · Accionamiento eléctrico: perfil de velocidad y par requerido */
SIMS.accion=el=>build(el,{w:680,h:450,
 sliders:[{k:'J',v:0.05,min:0.005,max:0.3,step:0.005,l:'Inercia total J',u:'kg·m²'},
  {k:'wmax',v:150,min:20,max:300,step:5,l:'Velocidad de consigna',u:'rad/s'},
  {k:'tac',v:1,min:0.2,max:3,step:0.1,l:'Tiempo de aceleración',u:'s'},
  {k:'B',v:0.01,min:0,max:0.05,step:0.002,l:'Fricción viscosa B',u:'N·m·s'},
  {k:'TL',v:2,min:0,max:10,step:0.5,l:'Par de carga T_L',u:'N·m'}],
 selects:[{k:'tipo',v:'const',l:'Tipo de carga',opts:[['const','Par constante (cinta, grúa)'],['vent','Par ∝ ω² (ventilador, bomba)'],['pot','Potencia constante (bobinadora)']]}],
 draw(a){a.clear();const s=a.st;
  const ox=58,oy=180,W=600,H=120,T=s.tac*4;
  const X=t=>ox+t/T*W;
  const wt=t=>{const t1=s.tac,t2=T/2,t3=T/2+s.tac;
    if(t<t1)return s.wmax*t/t1; if(t<t2)return s.wmax; if(t<t3)return s.wmax*(1-(t-t2)/s.tac); return 0;};
  const Tcar=w=>{if(s.tipo==='const')return s.TL; if(s.tipo==='vent')return s.TL*Math.pow(w/s.wmax,2); return w>5?s.TL*s.wmax/w:s.TL*s.wmax/5;};
  const dw=t=>{const t1=s.tac,t2=T/2,t3=T/2+s.tac;
    if(t<t1)return s.wmax/t1; if(t<t2)return 0; if(t<t3)return -s.wmax/s.tac; return 0;};
  const Tem=t=>{const w=wt(t);return s.J*dw(t)+s.B*w+Tcar(w);};
  // eje de velocidad
  const Yw=w=>oy-w/s.wmax*H;
  a.line(ox,oy,ox+W,oy,C.muted,1.5);a.line(ox,oy-H-12,ox,oy+8,C.muted,1.5);
  ticks(s.wmax,4).forEach(v=>{a.line(ox,Yw(v),ox+W,Yw(v),C.grid,1);a.txt(N0(v),ox-6,Yw(v)+4,C.muted,11,'right');});
  const pw=[];for(let t=0;t<=T;t+=T/400)pw.push([X(t),Yw(wt(t))]);
  curve(a,pw,C.a,2.5);
  a.txt('ω (rad/s)',ox-4,oy-H-20,C.a,12);
  // eje de par
  let Tmx=0;for(let t=0;t<=T;t+=T/400)Tmx=Math.max(Tmx,Math.abs(Tem(t)));Tmx=Math.max(Tmx,1);
  const oy2=400,H2=120,Yt=v=>oy2-H2/2-v/Tmx*(H2/2);
  a.line(ox,oy2-H2/2,ox+W,oy2-H2/2,C.muted,1.5);a.line(ox,oy2-H2-10,ox,oy2+10,C.muted,1.5);
  ticks(Tmx,3).forEach(v=>{[1,-1].forEach(sg=>{a.line(ox,Yt(sg*v),ox+W,Yt(sg*v),C.grid,1);a.txt(N1(sg*v),ox-6,Yt(sg*v)+4,C.muted,11,'right');});});
  const pt=[];for(let t=0;t<=T;t+=T/800)pt.push([X(t),Yt(Tem(t))]);
  curve(a,pt,C.f,2.5);
  a.txt('T_em (N·m)',ox-4,oy2-H2-18,C.f,12);
  ticks(T,4).forEach(v=>{a.line(X(v),oy2-H2/2-3,X(v),oy2-H2/2+3,C.muted,1.5);a.txt(N1(v)+' s',X(v),oy2+22,C.muted,11,'center');});
  // valores clave
  const Tac=s.J*s.wmax/s.tac+s.B*s.wmax+Tcar(s.wmax), Tcr=s.B*s.wmax+Tcar(s.wmax), Tde=-s.J*s.wmax/s.tac+Tcr;
  a.circ(X(s.tac*0.5),Yt(Tac),4,C.b,true);a.txt('acelera '+N1(Tac),X(s.tac*0.5)+8,Yt(Tac)-6,C.b,11);
  a.circ(X(T/4+s.tac/2),Yt(Tcr),4,C.c,true);a.txt('crucero '+N1(Tcr),X(T/4+s.tac/2)+8,Yt(Tcr)-6,C.c,11);
  a.circ(X(T/2+s.tac*0.5),Yt(Tde),4,C.d,true);a.txt((Tde<0?'frena (regenera) ':'frena ')+N1(Tde),X(T/2+s.tac*0.5)+8,Yt(Tde)+(Tde<0?16:-6),C.d,11);
  const Pmax=Tac*s.wmax;
  a.html(`Perfil trapezoidal: acelera hasta <b>${N0(s.wmax)} rad/s</b> (${N0(s.wmax*30/Math.PI)} rpm) en ${NQ(s.tac)} s.<br>
  T<sub>em</sub> = J·dω/dt + B·ω + T<sub>carga</sub> ⇒ aceleración <b>${N2(Tac)} N·m</b>, crucero <b>${N2(Tcr)} N·m</b>, deceleración <b>${N2(Tde)} N·m</b>.<br>
  Potencia máxima P = T·ω = <b>${N0(Pmax)} W</b> y el motor debe dimensionarse por el <b>par de aceleración</b>, no por el de crucero.
  ${Tde<0?'El par de frenado es negativo: la máquina trabaja como generador y devuelve energía (<b>frenado regenerativo</b>), lo que exige una UPP bidireccional.':'Con esta fricción y esta carga, frenar no exige par negativo: la propia carga decelera el conjunto.'}
  <span class="hint">Sube la inercia o baja el tiempo de aceleración y el pico de par se dispara: ése es el criterio que fija el tamaño del accionamiento. Cambia el tipo de carga para ver la diferencia entre un ventilador (par ∝ ω²) y una grúa (par constante).</span>`);}});

/* T2 · Circuito magnético con entrehierro */
SIMS.magnetico=el=>build(el,{w:680,h:420,
 sliders:[{k:'N',v:200,min:50,max:600,step:10,l:'Espiras N',u:''},
  {k:'i',v:2,min:0.1,max:10,step:0.1,l:'Intensidad i',u:'A'},
  {k:'lg',v:1,min:0,max:5,step:0.1,l:'Entrehierro l_g',u:'mm'},
  {k:'mur',v:2000,min:200,max:6000,step:100,l:'Permeabilidad μ_r',u:''},
  {k:'a',v:4,min:2,max:8,step:0.5,l:'Lado a de la sección',u:'cm'}],
 draw(a){a.clear();const s=a.st;
  const A=Math.pow(s.a/100,2);            // sección a×a
  const lfe=(4*3-1)*(s.a/100)-s.lg/1000;  // camino medio aproximado ~11a
  const Rfe=lfe/(MU0*s.mur*A), Rg=(s.lg/1000)/(MU0*A), Rt=Rfe+Rg;
  const F=s.N*s.i, phi=F/Rt, B=phi/A, L=s.N*s.N/Rt, H=B/(MU0*s.mur), Hg=B/MU0;
  // dibujo del núcleo en C
  const x0=40,y0=40,w=260,h=250,t=34;
  a.g.fillStyle=C.grid;a.g.globalAlpha=.45;
  a.g.fillRect(x0,y0,w,t);a.g.fillRect(x0,y0+h-t,w,t);a.g.fillRect(x0,y0,t,h);
  const gap=Math.max(2,s.lg*4);
  a.g.fillRect(x0+w-t,y0,t,(h-gap)/2);a.g.fillRect(x0+w-t,y0+(h+gap)/2,t,(h-gap)/2);
  a.g.globalAlpha=1;
  a.g.strokeStyle=C.muted;a.g.lineWidth=1.2;
  a.g.strokeRect(x0,y0,w,t);a.g.strokeRect(x0,y0+h-t,w,t);a.g.strokeRect(x0,y0,t,h);
  a.g.strokeRect(x0+w-t,y0,t,(h-gap)/2);a.g.strokeRect(x0+w-t,y0+(h+gap)/2,t,(h-gap)/2);
  if(s.lg>0){a.line(x0+w-t-6,y0+(h-gap)/2,x0+w+6,y0+(h-gap)/2,C.b,2);a.line(x0+w-t-6,y0+(h+gap)/2,x0+w+6,y0+(h+gap)/2,C.b,2);
    a.txt('l_g',x0+w+10,y0+h/2+4,C.b,12);}
  // bobina
  for(let k=0;k<7;k++){const yy=y0+55+k*22;a.circ(x0+t/2,yy,9,C.a,false);}
  a.txt('N·i',x0-6,y0+48,C.a,12,'right');
  // flujo
  const fl=[[x0+t/2,y0+t/2],[x0+w-t/2,y0+t/2],[x0+w-t/2,y0+h/2-gap/2]];
  curve(a,fl,C.f,2,[5,4]);
  a.arrow(x0+w/2-12,y0+t/2,x0+w/2+12,y0+t/2,C.f,2);
  curve(a,[[x0+w-t/2,y0+h/2+gap/2],[x0+w-t/2,y0+h-t/2],[x0+t/2,y0+h-t/2],[x0+t/2,y0+t/2]],C.f,2,[5,4]);
  a.txt('φ',x0+w/2+18,y0+t/2-8,C.f,13);
  // circuito equivalente
  const bx=350,by=70;
  a.txt('Circuito magnético equivalente',bx,by-18,C.text,13);
  a.circ(bx+24,by+60,22,C.a,false);a.txt('F',bx+24,by+65,C.a,13,'center');
  a.txt('= N·i',bx+50,by+65,C.a,12);
  a.line(bx+24,by+38,bx+24,by+10,C.muted,1.5);a.line(bx+24,by+10,bx+180,by+10,C.muted,1.5);
  Rbox(a,bx+100,by+0,80,22,C.c,true);a.txt('ℜ_Fe',bx+140,by+15,C.c,12,'center');
  a.line(bx+180,by+10,bx+240,by+10,C.muted,1.5);a.line(bx+240,by+10,bx+240,by+110,C.muted,1.5);
  Rbox(a,bx+200,by+100,80,22,C.b,true);a.txt('ℜ_g',bx+240,by+115,C.b,12,'center');
  a.line(bx+200,by+111,bx+24,by+111,C.muted,1.5);a.line(bx+24,by+111,bx+24,by+82,C.muted,1.5);
  // barras de reluctancia
  const by2=250,bw=260,frac=Rfe/Rt;
  a.txt('Reparto de la reluctancia',bx,by2-8,C.text,13);
  Rbox(a,bx,by2+4,bw*frac,26,C.c,true);Rbox(a,bx+bw*frac,by2+4,bw*(1-frac),26,C.b,true);
  if(frac>0.24)a.txt('hierro '+N0(frac*100)+' %',bx+bw*frac/2,by2+22,C.c,11,'center');
  if(1-frac>0.24)a.txt('aire '+N0((1-frac)*100)+' %',bx+bw*(frac+1)/2,by2+22,C.b,11,'center');
  a.txt('hierro '+N0(frac*100)+' % · aire '+N0((1-frac)*100)+' %',bx,by2+50,C.muted,11);
  a.txt('ℜ_Fe = '+N0(Rfe/1000)+'k A·v/Wb',bx,by2+72,C.c,12);
  a.txt('ℜ_g = '+N0(Rg/1000)+'k A·v/Wb',bx,by2+92,C.b,12);
  a.txt('B = '+N3(B)+' T',bx,by2+116,B>1.8?C.b:C.f,13);
  a.html(`ℜ = l/(μA) en serie: <b>ℜ_Fe = ${N0(Rfe/1000)}k</b> y <b>ℜ_g = ${N0(Rg/1000)}k</b> A·v/Wb ⇒ ℜ_total = ${N0(Rt/1000)}k.<br>
  F = N·i = <b>${N0(F)} A·v</b> ⇒ φ = F/ℜ = <b>${N3(phi*1000)} mWb</b>, B = φ/A = <b>${N3(B)} T</b>, L = N²/ℜ = <b>${N1(L*1000)} mH</b>.<br>
  H en el hierro = ${N0(H)} A/m y en el aire = ${N0(Hg)} A/m: la misma B exige un campo <b>${N0(s.mur)} veces mayor</b> en el aire.
  ${B>1.8?'<b>Cuidado:</b> con B por encima de ≈1,8 T el hierro se satura y μ_r se desploma, así que este cálculo lineal ya no vale.':''}
  <span class="hint">Mueve el entrehierro desde 0: con sólo 1 mm de aire frente a ~${N1(lfe*100)} cm de hierro, el aire ya se lleva la mayor parte de la reluctancia. Por eso el entrehierro manda en el flujo y en la inductancia, y por eso μ_r importa poco cuando hay entrehierro.</span>`);}});

/* T2 · Transformador: ensayos y funcionamiento en carga */
SIMS.trafo=el=>build(el,{w:680,h:390,
 sliders:[{k:'carga',v:100,min:0,max:150,step:5,l:'Carga',u:'% de S_n'},
  {k:'fdp',v:0.8,min:0.5,max:1,step:0.01,l:'f.d.p. de la carga',u:''},
  {k:'Req',v:0.5,min:0.1,max:2,step:0.05,l:'R_eq (lado AT)',u:'Ω'},
  {k:'Xeq',v:2.449,min:0.2,max:6,step:0.05,l:'X_eq (lado AT)',u:'Ω'},
  {k:'zoom',v:5,min:1,max:12,step:1,l:'Ampliación de la caída',u:'×'}],
 selects:[{k:'tipo',v:'ind',l:'Carácter de la carga',opts:[['ind','Inductiva (I atrasa)'],['cap','Capacitiva (I adelanta)']]}],
 draw(a){a.clear();const s=a.st;
  const Sn=100e3,V1n=2400,V2n=240,n=V1n/V2n;
  const I2n=Sn/V2n, I2=I2n*s.carga/100, I2p=I2/n;
  const fi=Math.acos(s.fdp)*(s.tipo==='ind'?-1:1);
  const V2r=V2n*n;
  const Ir={re:I2p*Math.cos(fi),im:I2p*Math.sin(fi)};
  const V1={re:V2r+Ir.re*s.Req-Ir.im*s.Xeq, im:Ir.re*s.Xeq+Ir.im*s.Req};
  const mV1=Math.hypot(V1.re,V1.im), reg=(mV1-V2r)/V2r*100;
  const Pcu=I2p*I2p*s.Req, P0=500, Pout=Sn*s.carga/100*s.fdp;
  const rend=Pout>0?Pout/(Pout+Pcu+P0)*100:0;
  // ---- circuito equivalente
  const ox=34,oy=46;
  a.txt('Circuito equivalente (referido a AT)',ox,oy-18,C.text,12);
  a.line(ox+16,oy,ox+280,oy,C.muted,1.5);
  a.circ(ox+16,oy+36,16,C.a,false);a.txt('V₁',ox+16,oy+41,C.a,11,'center');
  a.line(ox+16,oy+20,ox+16,oy,C.muted,1.5);a.line(ox+16,oy+52,ox+16,oy+86,C.muted,1.5);
  a.line(ox+16,oy+86,ox+280,oy+86,C.muted,1.5);
  Rbox(a,ox+56,oy-10,40,20,C.c,true);a.txt('R_eq',ox+76,oy+4,C.c,10,'center');
  Rbox(a,ox+116,oy-10,40,20,C.f,true);a.txt('X_eq',ox+136,oy+4,C.f,10,'center');
  a.line(ox+196,oy,ox+196,oy+30,C.muted,1.5);
  Rbox(a,ox+176,oy+30,40,22,C.b,true);a.txt('R_c//X_m',ox+196,oy+24,C.b,9,'center');
  a.line(ox+196,oy+52,ox+196,oy+86,C.muted,1.5);
  a.line(ox+280,oy,ox+280,oy+30,C.muted,1.5);
  Rbox(a,ox+260,oy+30,40,22,C.d,true);a.txt('carga',ox+280,oy+45,C.d,9,'center');
  a.line(ox+280,oy+52,ox+280,oy+86,C.muted,1.5);
  a.txt("V₂' = 2400 V",ox+248,oy-14,C.d,10);
  // ---- diagrama fasorial (caida ampliada)
  const cx=120,cy=280,u=170/Math.max(mV1,V2r), Z=s.zoom;
  a.txt('Diagrama fasorial (caída ampliada ×'+N0(Z)+')',cx-86,cy-72,C.text,12);
  const dR={re:Ir.re*s.Req*Z, im:Ir.im*s.Req*Z}, dX={re:-Ir.im*s.Xeq*Z, im:Ir.re*s.Xeq*Z};
  const P2=[cx+V2r*u,cy], PR=[P2[0]+dR.re*u,P2[1]-dR.im*u], PX=[PR[0]+dX.re*u,PR[1]-dX.im*u];
  a.arrow(cx,cy,P2[0],P2[1],C.d,2.5);a.txt("V₂'",cx+V2r*u*0.45,cy+18,C.d,12);
  a.arrow(P2[0],P2[1],PR[0],PR[1],C.c,2);
  a.arrow(PR[0],PR[1],PX[0],PX[1],C.f,2);
  a.arrow(cx,cy,PX[0],PX[1],C.b,2.5);
  a.txt('V₁',PX[0]-38,PX[1]-10,C.b,12);
  a.txt("R_eq·I'",PR[0]-6,PR[1]+18,C.c,10);a.txt("jX_eq·I'",PX[0]+6,PX[1]-6,C.f,10);
  const iu=110/Math.max(I2p,1);
  a.arrow(cx,cy,cx+Ir.re*iu,cy-Ir.im*iu,C.a,2);
  a.txt("I' = "+N1(I2p)+' A',cx+Ir.re*iu*0.5+6,cy-Ir.im*iu*0.5+(Ir.im<0?16:-8),C.a,11);
  a.line(cx-20,cy,cx+200,cy,C.grid,1);
  // ---- resultados
  const bx=400,by=228;
  a.txt('Con esta carga',bx,by-16,C.text,12);
  a.txt('I₂ = '+N1(I2)+' A   (I₂\' = '+N1(I2p)+' A)',bx,by+8,C.a,12);
  a.txt('V₁ = '+N1(mV1)+' V',bx,by+32,C.b,12);
  a.txt('caída = '+N1(reg)+' %',bx,by+56,reg>5?C.warn||C.b:C.c,12);
  a.txt('P_Cu = '+N0(Pcu)+' W   P_Fe = '+N0(P0)+' W',bx,by+80,C.muted,12);
  a.txt('η = '+N1(rend)+' %',bx,by+104,C.c,13);
  a.html(`Transformador de 100 kVA 2400/240 V al <b>${N0(s.carga)} %</b> de carga con f.d.p. ${N2(s.fdp)} ${s.tipo==='ind'?'inductivo':'capacitivo'}:
  I₂ = <b>${N1(I2)} A</b> (I₂' = ${N1(I2p)} A en el primario).<br>
  V₁ = V₂' + (R_eq + jX_eq)·I₂' = <b>${N1(mV1)} V</b> ⇒ <b>caída de tensión ${N1(reg)} %</b>.<br>
  Pérdidas: cobre R_eq·I₂'² = <b>${N0(Pcu)} W</b>, hierro ≈ ${N0(P0)} W (las del ensayo de vacío, constantes) ⇒ rendimiento <b>${N1(rend)} %</b>.
  ${s.tipo==='cap'?'Con carga capacitiva la caída se reduce y puede volverse <b>negativa</b>: la tensión de salida sube por encima de la nominal.':''}
  <span class="hint">La caída real es de sólo unas unidades por ciento, así que en el dibujo se amplía para que se vea el triángulo: el fasor V₁ de verdad casi se superpone a V₂'. Los parámetros salen de dos ensayos: el de <b>vacío</b> (tensión nominal ⇒ R_c y X_m, pérdidas del hierro) y el de <b>cortocircuito</b> (corriente nominal ⇒ R_eq y X_eq, pérdidas del cobre). El rendimiento es máximo cuando ambas pérdidas se igualan.</span>`);}});

/* T3 · Conversión electromecánica: B(θ) en el entrehierro y par */
SIMS.conversion=el=>build(el,{w:680,h:430,
 sliders:[{k:'Ns',v:100,min:20,max:300,step:10,l:'Espiras del estátor N_s',u:''},
  {k:'i',v:10,min:-20,max:20,step:0.5,l:'Intensidad i_s',u:'A'},
  {k:'lg',v:1,min:0.3,max:3,step:0.1,l:'Entrehierro l_g',u:'mm'},
  {k:'Nr',v:50,min:0,max:200,step:10,l:'Espiras del rotor N_r',u:''},
  {k:'ir',v:5,min:-20,max:20,step:0.5,l:'Intensidad i_r',u:'A'},
  {k:'tm',v:20,min:0,max:180,step:1,l:'Posición del rotor θ_m',u:'°'}],
 selects:[{k:'p',v:'2',l:'Número de polos',opts:[['2','2 polos'],['4','4 polos']]}],
 draw(a){a.clear();const s=a.st,p=parseInt(s.p);
  const r=0.06,l=0.24;
  const Bs=MU0*s.Ns*s.i/(p*s.lg/1000), Br=MU0*s.Nr*s.ir/(p*s.lg/1000);
  const th=s.tm*Math.PI/180*(p/2);
  const Tem=-Math.PI*r*l*(s.lg/1000)/MU0*Bs*Br*Math.sin(th);
  // seccion de la maquina
  const cx=140,cy=175,R=92;
  a.circ(cx,cy,R,C.muted,false);a.circ(cx,cy,R*0.72,C.muted,false);
  a.g.globalAlpha=.1;a.g.fillStyle=C.a;a.g.beginPath();a.g.arc(cx,cy,R*0.72,0,Math.PI*2);a.g.fill();a.g.globalAlpha=1;
  a.line(cx-R-16,cy,cx+R+16,cy,C.grid,1);a.line(cx,cy-R-16,cx,cy+R+16,C.grid,1);
  a.txt('eje fase a',cx+R-26,cy-R-6,C.muted,10);
  const ang=-s.tm*Math.PI/180;
  a.arrow(cx,cy,cx+R*0.95,cy,C.a,2.5);
  a.txt('B_s',cx+R*0.95+4,cy+14,C.a,12);
  a.arrow(cx,cy,cx+R*0.62*Math.cos(ang),cy+R*0.62*Math.sin(ang),C.f,2.5);
  a.txt('B_r',cx+R*0.62*Math.cos(ang)+4,cy+R*0.62*Math.sin(ang)-8,C.f,12);
  a.g.strokeStyle=C.b;a.g.lineWidth=1.5;a.g.beginPath();a.g.arc(cx,cy,30,ang,0,s.tm>0);a.g.stroke();
  a.txt('θ_m = '+N0(s.tm)+'°',cx-R,cy+R+22,C.b,11);
  if(Math.abs(Tem)>1e-6){const sg=Tem>0?1:-1;
    a.g.strokeStyle=C.c;a.g.lineWidth=2.5;a.g.beginPath();a.g.arc(cx,cy,R*1.12,sg>0?-1.0:1.0,sg>0?1.0:-1.0,sg<0);a.g.stroke();
    a.txt('T_em',cx+R*1.12+6,cy+4,C.c,11);}
  // distribucion B(theta)
  const ox=300,oy=170,W=350,H=70;
  a.line(ox,oy,ox+W,oy,C.muted,1.5);a.line(ox,oy-H-10,ox,oy+H+10,C.muted,1.5);
  const Bm=Math.max(Math.abs(Bs),Math.abs(Br),0.05);
  a.txt('B (T)',ox+2,oy-H-16,C.text,12);
  [1,-1].forEach(sg=>{a.line(ox,oy-sg*H,ox+W,oy-sg*H,C.grid,1);a.txt(N2(sg*Bm),ox-6,oy-sg*H+4,C.muted,10,'right');});
  const pb=[],pr=[],pt=[];
  for(let k=0;k<=360;k+=2){const t=k*Math.PI/180;
    const b1=Bs*Math.cos(t), b2=Br*Math.cos(t-th);
    pb.push([ox+k/360*W,oy-b1/Bm*H]);pr.push([ox+k/360*W,oy-b2/Bm*H]);pt.push([ox+k/360*W,oy-(b1+b2)/Bm*H]);}
  curve(a,pb,C.a,2);curve(a,pr,C.f,2);curve(a,pt,C.c,2.5,[6,4]);
  [0,90,180,270,360].forEach(k=>{a.line(ox+k/360*W,oy-3,ox+k/360*W,oy+3,C.muted,1.5);a.txt(k+'°',ox+k/360*W,oy+H+28,C.muted,10,'center');});
  a.txt('θ eléctrico',ox+W-40,oy+H+44,C.muted,11);
  a.txt('B_s',ox+W+4,oy-Bs/Bm*H+4,C.a,11);a.txt('B_r',ox+W+4,oy-Br*Math.cos(2*Math.PI-th)/Bm*H+4,C.f,11);
  a.txt('resultante (línea discontinua)',ox+60,oy-H-16,C.c,11);
  const Fs=s.Ns*s.i/p, Fr=s.Nr*s.ir/p;
  a.txt('F̂_s = N_s·i/p = '+N1(Fs)+' A·v',ox,oy+H+72,C.a,12);
  a.txt('F̂_r = N_r·i_r/p = '+N1(Fr)+' A·v',ox,oy+H+92,C.f,12);
  a.txt('T_em = '+N2(Math.abs(Tem))+' N·m',ox,oy+H+116,C.c,13);
  a.html(`Devanado distribuido senoidalmente, ${p} polos: H(θ) = N_s·i·cos θ/(p·l_g) ⇒ <b>B̂_s = ${N3(Bs)} T</b> y B̂_r = ${N3(Br)} T (r = 6 cm, l = 24 cm).<br>
  El par sale del producto vectorial de los dos campos: T_em = π·r·l·(l_g/μ₀)·B̂_s·B̂_r·sen δ = π·r·l·(μ₀/l_g)·F̂_s·F̂_r·sen δ ⇒ <b>${N2(Math.abs(Tem))} N·m</b> con δ = ${N0(th*180/Math.PI)}° eléctricos, en el sentido que <b>reduce</b> δ.<br>
  ${Math.abs(Math.sin(th))<0.05?'Con los dos campos <b>alineados</b> (δ = 0 o 180°) el par es nulo: es la posición de equilibrio, no de par máximo.':'El par es máximo cuando los campos están a <b>90° eléctricos</b>; alineados, el par se anula.'}
  <span class="hint">Las dos distribuciones son senoidales y de distinta amplitud, pero <b>idéntica forma de onda</b>: F, H y B sólo se diferencian en un factor. Fíjate en que al pasar a 4 polos el mismo θ_m mecánico vale el doble de grados eléctricos, y con ello cambia el par.</span>`);}});

/* T4 · Motor de corriente continua */
SIMS.mcc=el=>build(el,{w:680,h:420,
 sliders:[{k:'Va',v:120,min:-150,max:150,step:2,l:'Tensión de armadura V_a',u:'V'},
  {k:'Ra',v:0.25,min:0.05,max:2,step:0.05,l:'Resistencia R_a',u:'Ω'},
  {k:'k',v:0.5,min:0.1,max:1.5,step:0.05,l:'Constante k_T = k_E',u:'SI'},
  {k:'TL',v:3,min:-8,max:8,step:0.25,l:'Par de la carga T_L',u:'N·m'}],
 draw(a){a.clear();const s=a.st;
  const w0=s.Va/s.k, Tst=s.k*s.Va/s.Ra;
  const wop=(s.Va-s.Ra*s.TL/s.k)/s.k, ia=s.TL/s.k, ea=s.k*wop, Pm=s.TL*wop, Pe=s.Va*ia;
  const W=Math.max(Math.abs(w0)*1.2,40);
  // ---- panel izquierdo: caracteristica completa (4 cuadrantes)
  const cx=180,cy=210,TM=Math.max(Math.abs(Tst)*1.15,1),ux=140/TM,uy=150/W;
  a.txt('Característica completa',cx-120,36,C.text,12);
  a.line(cx-150,cy,cx+150,cy,C.muted,1.5);a.line(cx,cy-160,cx,cy+160,C.muted,1.5);
  a.txt('T (N·m)',cx+96,cy-8,C.muted,10);a.txt('ω',cx+6,cy-152,C.muted,10);
  [0.5,1].forEach(f=>{[1,-1].forEach(g=>{a.line(cx+g*f*TM*ux,cy-155,cx+g*f*TM*ux,cy+155,C.grid,1);
    a.txt(N0(g*f*TM),cx+g*f*TM*ux,cy+16,C.muted,9,'center');
    a.line(cx-145,cy-g*f*W*uy,cx+145,cy-g*f*W*uy,C.grid,1);a.txt(N0(g*f*W),cx-6,cy-g*f*W*uy+4,C.muted,9,'right');});});
  [0.45,0.7,1].forEach((f,k)=>{const V=s.Va*f;const p=[];
    for(let T=-TM;T<=TM;T+=TM/80){const w=(V-s.Ra*T/s.k)/s.k;if(Math.abs(w)<=W*1.02)p.push([cx+T*ux,cy-w*uy]);}
    if(p.length)curve(a,p,k===2?C.a:C.grid,k===2?2.5:1.5,k===2?[]:[5,4]);});
  a.txt('V_a = '+N0(s.Va)+' V',cx-146,56,C.a,10);
  a.circ(cx,cy-w0*uy,4,C.b,true);a.txt('ω₀ = '+N0(w0),cx+8,cy-w0*uy-8,C.b,10);
  a.circ(cx+Tst*ux,cy,4,C.d,true);a.txt('T arranque = '+N0(Tst),cx+Tst*ux-4,cy+32,C.d,10,'right');
  a.txt('II',cx-130,cy-140,C.muted,10);a.txt('I',cx+124,cy-140,C.muted,10);
  a.txt('III',cx-130,cy+146,C.muted,10);a.txt('IV',cx+120,cy+146,C.muted,10);
  // ---- panel derecho: zoom de la zona de trabajo
  const zx=490,zy=210,TZ=Math.max(Math.abs(s.TL)*1.8,2),wC=w0,dW=Math.max(s.Ra*TZ/(s.k*s.k)*1.4,1);
  const zux=130/TZ, zuy=140/dW;
  a.txt('Zoom de la zona de trabajo',zx-110,36,C.text,12);
  a.line(zx-140,zy,zx+140,zy,C.grid,1);a.line(zx,zy-150,zx,zy+150,C.muted,1.5);
  const Yz=w=>zy-(w-wC)*zuy;
  const pz=[];for(let T=-TZ;T<=TZ;T+=TZ/60)pz.push([zx+T*zux,Yz((s.Va-s.Ra*T/s.k)/s.k)]);
  curve(a,pz,C.a,2.5);
  [-1,-0.5,0.5,1].forEach(f=>{a.line(zx+f*TZ*zux,zy-150,zx+f*TZ*zux,zy+150,C.grid,1);a.txt(N1(f*TZ),zx+f*TZ*zux,zy+166,C.muted,9,'center');});
  [-1,-0.5,0.5,1].forEach(f=>{const w=wC+f*dW;a.line(zx-140,Yz(w),zx+140,Yz(w),C.grid,1);a.txt(N1(w),zx-144,Yz(w)+4,C.muted,9,'right');});
  a.txt('ω (rad/s)',zx-140,56,C.muted,10);a.txt('T (N·m)',zx-140,zy+166,C.muted,10);
  a.line(zx-140,zy,zx+140,zy,C.muted,1.2);
  a.line(zx+s.TL*zux,zy-150,zx+s.TL*zux,zy+150,C.d,1.5,[6,4]);
  a.txt('T_L',zx+s.TL*zux+6,zy-140,C.d,10);
  a.circ(zx+s.TL*zux,Yz(wop),6,C.c,true);
  a.txt('punto de trabajo',zx+s.TL*zux+(s.TL>0?-10:10),Yz(wop)-12,C.c,11,s.TL>0?'right':'left');
  a.txt('ω = '+N1(wop)+' rad/s',zx+s.TL*zux+(s.TL>0?-10:10),Yz(wop)+20,C.c,11,s.TL>0?'right':'left');
  const cuad=(s.TL>=0&&wop>=0)?'I · motor':(s.TL<0&&wop>=0)?'II · frenado regenerativo':(s.TL<0&&wop<0)?'III · motor en sentido inverso':'IV · frenado regenerativo';
  a.html(`Motor de CC de imanes permanentes: ω = (V_a − R_a·T/k_T)/k_E ⇒ con T_L = ${NQ(s.TL)} N·m gira a <b>${N1(wop)} rad/s</b> (${N0(wop*30/Math.PI)} rpm).<br>
  i_a = T/k_T = <b>${N1(ia)} A</b>, e_a = k_E·ω = <b>${N1(ea)} V</b>, V_a = e_a + R_a·i_a = ${N1(ea+s.Ra*ia)} V.<br>
  P mecánica = T·ω = <b>${N0(Pm)} W</b>, P eléctrica = V_a·i_a = ${N0(Pe)} W, pérdidas en el cobre R_a·i_a² = ${N0(s.Ra*ia*ia)} W. Cuadrante <b>${cuad}</b>.
  ${Pm<0?' La potencia mecánica es negativa: la máquina <b>frena y devuelve energía</b> a la fuente.':''}
  <span class="hint">A la izquierda, la característica entera: una <b>recta</b> que va de ω₀ = V_a/k_E (vacío) a T = k_T·V_a/R_a = ${N0(Tst)} N·m (arranque, valor sólo teórico: esa corriente destruiría la máquina). A la derecha, el mismo dibujo ampliado en la zona de pares útiles: la caída de velocidad es de sólo ${N2(s.Ra/(s.k*s.k))} rad/s por N·m, de ahí que la característica sea tan <b>rígida</b>. Baja V_a unos voltios por debajo de e_a y el punto salta al cuadrante de frenado regenerativo.</span>`);}});

/* T5 · Vectores espaciales y campo giratorio */
SIMS.vectesp=el=>build(el,{w:680,h:440,
 sliders:[{k:'wt',v:0,min:0,max:360,step:2,l:'ωt',u:'°'},
  {k:'Ip',v:10,min:1,max:20,step:0.5,l:'Valor de pico de i',u:'A'},
  {k:'fi',v:0,min:-180,max:180,step:5,l:'Fase inicial φ_a',u:'°'}],
 selects:[{k:'sec',v:'dir',l:'Secuencia',opts:[['dir','Directa a-b-c'],['inv','Inversa a-c-b'],['una','Sólo la fase a']]}],
 draw(a){a.clear();const s=a.st;
  const wt=s.wt*Math.PI/180, fi=s.fi*Math.PI/180;
  const d=s.sec==='inv'?-1:1;
  const ia=s.Ip*Math.cos(wt+fi);
  const ib=s.sec==='una'?0:s.Ip*Math.cos(wt+fi-d*2*Math.PI/3);
  const ic=s.sec==='una'?0:s.Ip*Math.cos(wt+fi-d*4*Math.PI/3);
  const re=ia+ib*Math.cos(2*Math.PI/3)+ic*Math.cos(4*Math.PI/3);
  const im=ib*Math.sin(2*Math.PI/3)+ic*Math.sin(4*Math.PI/3);
  const mod=Math.hypot(re,im), arg=Math.atan2(im,re);
  // plano complejo con los tres ejes
  const cx=160,cy=200,R=120,u=R/(1.6*s.Ip);
  [[0,'a',C.a],[120,'b',C.f],[240,'c',C.c]].forEach(([ag,nm,col])=>{
    const r=ag*Math.PI/180;a.line(cx,cy,cx+R*Math.cos(r),cy-R*Math.sin(r),C.grid,1.5);
    a.txt('eje '+nm,cx+(R+6)*Math.cos(r)-(ag===240?22:0),cy-(R+6)*Math.sin(r)+4,col,11);});
  a.circ(cx,cy,1.5*s.Ip*u,C.grid,false);
  // proyecciones de fase
  [[ia,0,C.a],[ib,120,C.f],[ic,240,C.c]].forEach(([v,ag,col])=>{const r=ag*Math.PI/180;
    a.arrow(cx,cy,cx+v*u*Math.cos(r),cy-v*u*Math.sin(r),col,1.8);});
  a.arrow(cx,cy,cx+re*u,cy-im*u,C.b,3);
  a.txt('i_s',cx+re*u*0.5,cy-im*u*0.5-10,C.b,13);
  a.txt('|i_s| = 1,5 · Î = '+N1(1.5*s.Ip)+' A',cx-R,cy+R+30,C.b,11);
  // ondas temporales
  const ox=330,oy=145,W=300,H=58;
  a.line(ox,oy,ox+W,oy,C.muted,1.5);a.line(ox,oy-H-8,ox,oy+H+8,C.muted,1.5);
  a.txt('i(t)',ox+2,oy-H-14,C.text,12);
  [[0,C.a],[120,C.f],[240,C.c]].forEach(([ag,col],k)=>{
    if(s.sec==='una'&&k>0)return;const p=[];
    for(let k2=0;k2<=360;k2+=2){const t=k2*Math.PI/180;
      p.push([ox+k2/360*W,oy-s.Ip*Math.cos(t+fi-d*ag*Math.PI/180)/s.Ip*H]);}
    curve(a,p,col,2);});
  [0,90,180,270,360].forEach(v=>{a.line(ox+v/360*W,oy-3,ox+v/360*W,oy+3,C.muted,1.2);a.txt(v+'°',ox+v/360*W,oy+H+22,C.muted,9,'center');});
  a.txt('ωt',ox+W+6,oy+H+22,C.muted,10);
  a.line(ox+s.wt/360*W,oy-H-6,ox+s.wt/360*W,oy+H+6,C.b,2,[4,3]);
  // trayectoria del vector
  const ox2=330,oy2=330,R2=80,cx2=490;
  a.circ(cx2,oy2,1.5*s.Ip*u*0.8,C.grid,false);
  const pp=[];for(let k=0;k<=360;k+=4){const t=k*Math.PI/180;
    const A=s.Ip*Math.cos(t+fi),Bb=s.sec==='una'?0:s.Ip*Math.cos(t+fi-d*2*Math.PI/3),Cc=s.sec==='una'?0:s.Ip*Math.cos(t+fi-d*4*Math.PI/3);
    const rr=A+Bb*Math.cos(2*Math.PI/3)+Cc*Math.cos(4*Math.PI/3), ii=Bb*Math.sin(2*Math.PI/3)+Cc*Math.sin(4*Math.PI/3);
    pp.push([cx2+rr*u*0.8,oy2-ii*u*0.8]);}
  curve(a,pp,C.d,2,[4,3]);
  a.arrow(cx2,oy2,cx2+re*u*0.8,oy2-im*u*0.8,C.b,2.5);
  a.txt('trayectoria del extremo del vector',cx2,oy2+R2+30,C.d,11,'center');
  a.html(`i_s = i_a + i_b·e^{j120°} + i_c·e^{j240°} ⇒ con ωt = ${N0(s.wt)}°: i_a = ${N1(ia)} A, i_b = ${N1(ib)} A, i_c = ${N1(ic)} A.<br>
  Vector espacial: <b>|i_s| = ${N1(mod)} A</b> con ángulo <b>${N0(arg*180/Math.PI)}°</b>. ${s.sec==='una'?'Con una sola fase el vector <b>oscila sobre el eje a</b>: campo pulsante, no giratorio.':'El módulo es constante e igual a <b>1,5·Î = '+N1(1.5*s.Ip)+' A</b> y gira a ω: <b>campo magnético giratorio</b>'+(s.sec==='inv'?' en sentido <b>horario</b> (secuencia inversa).':' en sentido antihorario.')}<br>
  Para volver a las fases: i_a = (2/3)·(proyección de i_s sobre el eje a) = ${N1(2/3*re)} A ✓.
  <span class="hint">Tres corrientes alternas desfasadas 120° en tres devanados desfasados 120° dan un campo de <b>amplitud constante que rota</b>: ésa es la idea que hace funcionar los motores de alterna. Permuta dos fases (secuencia inversa) y el campo gira al revés: así se invierte el giro de un motor trifásico.</span>`);}});

/* T6 · Motor asíncrono: curva par-deslizamiento */
SIMS.asinc=el=>build(el,{w:680,h:400,
 sliders:[{k:'V',v:230,min:100,max:260,step:5,l:'Tensión de fase',u:'V'},
  {k:'Rr',v:0.3,min:0.1,max:1.5,step:0.05,l:"R'_r",u:'Ω'},
  {k:'Rs',v:0.3,min:0,max:1,step:0.05,l:'R_s',u:'Ω'},
  {k:'Xt',v:1.2,min:0.4,max:3,step:0.1,l:"X_ls + X'_lr",u:'Ω'},
  {k:'s',v:0.03,min:0.001,max:1,step:0.001,l:'Deslizamiento s',u:''},
  {k:'f',v:50,min:10,max:60,step:1,l:'Frecuencia',u:'Hz'}],
 selects:[{k:'p',v:'2',l:'Polos',opts:[['2','2 polos'],['4','4 polos'],['6','6 polos']]}],
 draw(a){a.clear();const s=a.st,p=parseInt(s.p);
  const ws=2*Math.PI*s.f/(p/2), ns=ws*30/Math.PI;
  const Xt=s.Xt*s.f/50;
  const Tde=sl=>{const Z2=Math.pow(s.Rs+s.Rr/sl,2)+Xt*Xt;return 3*Math.pow(s.V,2)*(s.Rr/sl)/(ws*Z2);};
  const smax=s.Rr/Math.hypot(s.Rs,Xt), Tmax=Tde(smax);
  const T=Tde(s.s), w=ws*(1-s.s), n=w*30/Math.PI;
  const I=s.V/Math.hypot(s.Rs+s.Rr/s.s,Xt), Pag=3*I*I*s.Rr/s.s, Pcu=3*I*I*s.Rr, Pm=Pag*(1-s.s);
  const fp=(s.Rs+s.Rr/s.s)/Math.hypot(s.Rs+s.Rr/s.s,Xt);
  const ox=58,oy=300,W=350,H=230,Tm=Math.max(Tmax,Tde(1))*1.12;
  const X=sl=>ox+(1-sl)*W, Y=t=>oy-t/Tm*H;
  a.line(ox,oy,ox+W,oy,C.muted,1.5);a.line(ox,oy-H-10,ox,oy+8,C.muted,1.5);
  ticks(Tm,4).forEach(v=>{a.line(ox,Y(v),ox+W,Y(v),C.grid,1);a.txt(N1(v),ox-6,Y(v)+4,C.muted,10,'right');});
  [0,0.25,0.5,0.75,1].forEach(v=>{a.line(X(v),oy-3,X(v),oy+3,C.muted,1.5);
    a.txt('s='+NQ(v),X(v),oy+20,C.muted,10,'center');a.txt(N0(ns*(1-v)),X(v),oy+36,C.muted,10,'center');});
  a.txt('rpm',ox+W/2,oy+54,C.muted,10,'center');a.txt('T (N·m)',ox+2,oy-H-16,C.text,12);
  const pc=[];for(let sl=1;sl>=0.002;sl-=0.002)pc.push([X(sl),Y(Tde(sl))]);
  curve(a,pc,C.a,2.5);
  // zona estable
  const pe=[];for(let sl=smax;sl>=0.002;sl-=0.002)pe.push([X(sl),Y(Tde(sl))]);
  curve(a,pe,C.c,3.5);
  a.circ(X(smax),Y(Tmax),5,C.b,true);a.txt('T_máx = '+N1(Tmax)+' N·m (s = '+N3(smax)+')',X(smax)-6,Y(Tmax)-12,C.b,11,'right');
  a.circ(X(1),Y(Tde(1)),5,C.d,true);a.txt('arranque '+N1(Tde(1)),X(1)+8,Y(Tde(1))+16,C.d,11);
  a.circ(X(s.s),Y(T),6,C.f,true);a.line(X(s.s),Y(T),X(s.s),oy,C.f,1,[3,3]);
  a.txt('punto de trabajo',X(s.s)-10,Y(T)-10,C.f,11,'right');
  a.txt('zona estable',X(smax/2),Y(Tmax*0.45),C.c,11,'center');
  // circuito equivalente
  const bx=440,by=66;
  a.txt('Circuito equivalente por fase',bx,by-16,C.text,12);
  a.line(bx,by,bx+30,by,C.muted,1.5);Rbox(a,bx+30,by-10,30,20,C.c,true);a.txt('R_s',bx+45,by+4,C.c,10,'center');
  a.line(bx+60,by,bx+84,by,C.muted,1.5);Rbox(a,bx+84,by-10,30,20,C.f,true);a.txt('X_ls',bx+99,by+4,C.f,10,'center');
  a.line(bx+114,by,bx+134,by,C.muted,1.5);a.line(bx+134,by,bx+134,by+40,C.muted,1.5);
  Rbox(a,bx+119,by+40,30,20,C.b,true);a.txt('X_m',bx+134,by+54,C.b,10,'center');
  a.line(bx+134,by+60,bx+134,by+92,C.muted,1.5);a.line(bx,by+92,bx+134,by+92,C.muted,1.5);
  a.line(bx,by,bx,by+92,C.muted,1.5);
  a.line(bx+134,by,bx+156,by,C.muted,1.5);Rbox(a,bx+156,by-10,20,20,C.f,true);a.txt("X'_lr",bx+166,by+24,C.f,9,'center');
  a.line(bx+176,by,bx+176,by+30,C.muted,1.5);Rbox(a,bx+159,by+30,34,20,C.a,true);a.txt("R'_r/s",bx+176,by+44,C.a,10,'center');
  a.line(bx+176,by+50,bx+176,by+92,C.muted,1.5);a.line(bx+134,by+92,bx+176,by+92,C.muted,1.5);
  a.txt("R'_r/s = "+N1(s.Rr/s.s)+' Ω',bx,by+130,C.a,12);
  a.txt("I'_r = "+N1(I)+' A',bx,by+152,C.f,12);
  a.txt('f.d.p. = '+N3(fp),bx,by+174,C.muted,12);
  a.txt('P_ag = '+N0(Pag)+' W',bx,by+196,C.c,12);
  a.txt('P_mec = '+N0(Pm)+' W',bx,by+218,C.c,12);
  a.txt('T = '+N1(T)+' N·m',bx,by+240,C.b,13);
  a.html(`Síncrona n_s = 120·f/p = <b>${N0(ns)} rpm</b> (${N1(ws)} rad/s). Con s = ${NQ(s.s)}: n = <b>${N0(n)} rpm</b> y T = <b>${N1(T)} N·m</b>.<br>
  Reparto de potencia: P_entrehierro = 3·I'²·R'_r/s = <b>${N0(Pag)} W</b> ⇒ pérdidas en el rotor s·P_ag = ${N0(Pcu)} W y P_mec = (1−s)·P_ag = <b>${N0(Pm)} W</b>. Rendimiento del rotor = 1 − s = ${N1((1-s.s)*100)} %.<br>
  Par máximo T_máx = <b>${N1(Tmax)} N·m</b> en s_máx = R'_r/√(R_s² + X²) = ${N3(smax)}; T de arranque = ${N1(Tde(1))} N·m.<br>
  <span class="hint">Sube R'_r (rotor bobinado con resistencias de arranque) y verás que <b>T_máx no cambia</b>, pero se desplaza hacia s = 1: así se consigue par de arranque sin aumentar la corriente. Baja la tensión y el par cae con el <b>cuadrado</b> de V. Baja la frecuencia manteniendo V/f y el par se mantiene: es el control escalar de los variadores.</span>`);}});

/* T7 · Máquina síncrona de imanes permanentes */
SIMS.pmac=el=>build(el,{w:680,h:420,
 sliders:[{k:'T',v:3,min:-8,max:8,step:0.25,l:'Par T_em',u:'N·m'},
  {k:'n',v:3000,min:200,max:6000,step:100,l:'Velocidad',u:'rpm'},
  {k:'k',v:0.5,min:0.1,max:1.2,step:0.05,l:'k_T = k_E',u:'SI'},
  {k:'Ls',v:15,min:2,max:40,step:1,l:'Inductancia síncrona L_s',u:'mH'},
  {k:'Rs',v:0,min:0,max:2,step:0.1,l:'R_s',u:'Ω'},
  {k:'Vmax',v:200,min:80,max:400,step:10,l:'Tensión máxima de la UPP',u:'V pico'}],
 selects:[{k:'p',v:'2',l:'Polos',opts:[['2','2 polos'],['4','4 polos'],['6','6 polos']]}],
 draw(a){a.clear();const s=a.st,p=parseInt(s.p);
  const wm=s.n*Math.PI/30, f=s.n/60*(p/2), w=2*Math.PI*f;
  const I=s.T/s.k, E=s.k*wm, Xs=w*s.Ls*1e-3;
  const Vre=E+I*s.Rs, Vim=I*Xs;
  const V=Math.hypot(Vre,Vim), delta=Math.atan2(Vim,Vre), Pmec=s.T*wm;
  // ---- diagrama fasorial
  const cx=70,cy=250,u=Math.min(230/Math.max(V,1),240/Math.max(Math.abs(I)*Xs,1));
  a.txt('Diagrama fasorial por fase',cx-30,44,C.text,12);
  a.line(cx-20,cy,cx+270,cy,C.grid,1);
  a.arrow(cx,cy,cx+E*u,cy,C.a,2.5);
  a.txt('Ê = '+N1(E)+' V',cx+E*u*0.4,cy+20,C.a,11);
  if(s.Rs>0)a.arrow(cx+E*u,cy,cx+Vre*u,cy,C.c,2);
  a.arrow(cx+Vre*u,cy,cx+Vre*u,cy-Vim*u,C.f,2.5);
  a.txt('jX_s·Î',cx+Vre*u+6,cy-Vim*u*0.5,C.f,11);
  a.arrow(cx,cy,cx+Vre*u,cy-Vim*u,C.b,3);
  a.txt('V̂ = '+N1(V)+' V',cx+Vre*u*0.3,cy-Vim*u*0.45-10,C.b,11);
  a.txt('δ = '+N1(delta*180/Math.PI)+'°',cx+Vre*u*0.62,cy-Vim*u*0.18-6,C.b,10);
  const iu=Math.min(150/Math.max(Math.abs(I),1),u*18);
  a.arrow(cx,cy,cx+I*iu,cy+34,C.d,2);
  a.txt('Î = '+N1(I)+' A (en fase con Ê)',cx+6,cy+56,C.d,11);
  a.txt('X_s = ω·L_s = '+N2(Xs)+' Ω   ·   f = '+N1(f)+' Hz',cx-30,cy+96,C.muted,11);
  a.txt(V>s.Vmax?'La UPP no puede dar esta tensión':'Dentro del límite de la UPP ('+N0(s.Vmax)+' V)',cx-30,cy+118,V>s.Vmax?C.b:C.c,11);
  // ---- curva de par disponible
  const zx=430,zy=330,ZW=220,ZH=250,nm=6000;
  const Tm=Math.max(Math.abs(s.T)*1.6,4);
  const Tlim=nn=>{const wmm=nn*Math.PI/30, ww=2*Math.PI*nn/60*(p/2), Ee=s.k*wmm, Xx=ww*s.Ls*1e-3;
    if(Xx<=0)return Tm; const v=s.Vmax*s.Vmax-Ee*Ee; return v<=0?0:Math.sqrt(v)/Xx*s.k;};
  a.txt('Par disponible según la velocidad',zx-10,44,C.text,12);
  a.line(zx,zy,zx+ZW,zy,C.muted,1.5);a.line(zx,zy-ZH,zx,zy+6,C.muted,1.5);
  ticks(Tm,4).forEach(v=>{a.line(zx,zy-v/Tm*ZH,zx+ZW,zy-v/Tm*ZH,C.grid,1);a.txt(N1(v),zx-6,zy-v/Tm*ZH+4,C.muted,9,'right');});
  [1500,3000,4500,6000].forEach(v=>{a.line(zx+v/nm*ZW,zy-ZH,zx+v/nm*ZW,zy+3,C.grid,1);a.txt(N0(v),zx+v/nm*ZW,zy+18,C.muted,9,'center');});
  a.txt('T (N·m)',zx+4,zy-ZH-10,C.muted,10);a.txt('n (rpm)',zx+ZW-34,zy+34,C.muted,10);
  const pl=[];for(let nn=50;nn<=nm;nn+=25)pl.push([zx+nn/nm*ZW,zy-Math.min(Tlim(nn),Tm)/Tm*ZH]);
  curve(a,pl,C.f,2.5);
  a.txt('límite de tensión',zx+ZW*0.30,zy-ZH*0.9,C.f,10);
  a.line(zx,zy-Math.min(Math.abs(s.T),Tm)/Tm*ZH,zx+ZW,zy-Math.min(Math.abs(s.T),Tm)/Tm*ZH,C.d,1.5,[4,3]);
  a.txt('par pedido',zx+4,zy-Math.min(Math.abs(s.T),Tm)/Tm*ZH-6,C.d,10);
  const okp=Math.abs(s.T)<=Tlim(s.n);
  a.circ(zx+s.n/nm*ZW,zy-Math.min(Math.abs(s.T),Tm)/Tm*ZH,6,okp?C.c:C.b,true);
  a.html(`Máquina síncrona de imanes permanentes de ${p} polos a ${N0(s.n)} rpm ⇒ ω_m = ${N1(wm)} rad/s y f = <b>${N1(f)} Hz</b>.<br>
  La corriente se controla <b>en fase con la fem</b>: Î = T/k_T = <b>${N1(I)} A</b>, Ê = k_E·ω_m = <b>${N1(E)} V</b>, X_s = ω·L_s = ${N2(Xs)} Ω.<br>
  V̂ = Ê + (R_s + jX_s)·Î = <b>${N1(V)} V</b> de pico por fase, con ángulo de carga δ = ${N1(delta*180/Math.PI)}°. P_mec = T·ω_m = <b>${N0(Pmec)} W</b>.<br>
  ${okp?'El punto de trabajo <b>cabe</b> dentro del límite de tensión de la UPP.':'<b>Fuera de límite:</b> a esa velocidad la UPP no puede dar la tensión que exige ese par. Habría que debilitar el campo o bajar el par.'}
  <span class="hint">El par es proporcional a la corriente, igual que en un motor de continua: por eso la PMAC sustituye a la de continua en servoaccionamientos. La tensión, en cambio, crece con la velocidad, y la curva de la derecha es el <b>límite que impone la UPP</b>: pasada la velocidad base el par disponible cae y hay que debilitar el campo. Sube los polos y verás que la frecuencia (y con ella X_s) se multiplica, estrechando el margen.</span>`);}});

/* T8 · Motor de reluctancia conmutada */
SIMS.srm=el=>build(el,{w:680,h:420,
 sliders:[{k:'th',v:15,min:0,max:90,step:1,l:'Posición θ',u:'°'},
  {k:'i',v:8,min:0,max:20,step:0.5,l:'Intensidad de fase',u:'A'},
  {k:'Lmax',v:60,min:20,max:120,step:5,l:'L alineada',u:'mH'},
  {k:'Lmin',v:10,min:2,max:40,step:1,l:'L no alineada',u:'mH'},
  {k:'bs',v:30,min:15,max:45,step:1,l:'Arco del polo β',u:'°'}],
 draw(a){a.clear();const s=a.st;
  const Lmax=s.Lmax/1000,Lmin=Math.min(s.Lmin,s.Lmax-5)/1000;
  const per=90;   // periodo de reluctancia (6/4: 90°)
  const Lf=t=>{let x=((t%per)+per)%per;const sub=per/2;
    if(x<=s.bs)return Lmin+(Lmax-Lmin)*x/s.bs;
    if(x<=sub)return Lmax;
    if(x<=sub+s.bs)return Lmax-(Lmax-Lmin)*(x-sub)/s.bs;
    return Lmin;};
  const dL=t=>{let x=((t%per)+per)%per;const sub=per/2;
    if(x<s.bs)return (Lmax-Lmin)/(s.bs*Math.PI/180);
    if(x<sub)return 0;
    if(x<sub+s.bs)return -(Lmax-Lmin)/(s.bs*Math.PI/180);
    return 0;};
  const T=0.5*s.i*s.i*dL(s.th);
  // seccion 6/4
  const cx=150,cy=190,R=100;
  a.circ(cx,cy,R,C.muted,false);
  for(let k=0;k<6;k++){const ag=k*60*Math.PI/180;
    a.g.save();a.g.translate(cx,cy);a.g.rotate(-ag);a.g.fillStyle=(k%3===0)?C.a:C.grid;a.g.globalAlpha=(k%3===0)?.3:.25;
    a.g.fillRect(R*0.52,-14,R*0.46,28);a.g.globalAlpha=1;a.g.strokeStyle=C.muted;a.g.lineWidth=1;a.g.strokeRect(R*0.52,-14,R*0.46,28);a.g.restore();}
  for(let k=0;k<4;k++){const ag=(k*90+s.th)*Math.PI/180;
    a.g.save();a.g.translate(cx,cy);a.g.rotate(-ag);a.g.fillStyle=C.f;a.g.globalAlpha=.3;
    a.g.fillRect(R*0.14,-13,R*0.36,26);a.g.globalAlpha=1;a.g.strokeStyle=C.f;a.g.lineWidth=1.3;a.g.strokeRect(R*0.14,-13,R*0.36,26);a.g.restore();}
  a.circ(cx,cy,R*0.14,C.muted,false);
  a.txt('fase A excitada',cx-40,cy+R+26,C.a,11);
  // L(theta) y par
  const ox=320,oy=140,W=330,H=80;
  a.line(ox,oy,ox+W,oy,C.muted,1.5);a.line(ox,oy-H-8,ox,oy+8,C.muted,1.5);
  a.txt('L(θ) (mH)',ox+2,oy-H-14,C.text,12);
  const pl=[];for(let t=0;t<=180;t+=1)pl.push([ox+t/180*W,oy-Lf(t)/Lmax*H]);
  curve(a,pl,C.a,2.5);
  a.txt(N0(s.Lmax),ox-6,oy-H+4,C.muted,10,'right');a.txt(N0(s.Lmin),ox-6,oy-Lmin/Lmax*H+4,C.muted,10,'right');
  a.line(ox+s.th/180*W,oy-H-6,ox+s.th/180*W,oy+6,C.b,2,[4,3]);
  a.circ(ox+s.th/180*W,oy-Lf(s.th)/Lmax*H,5,C.b,true);
  const oy2=320,H2=80;
  a.line(ox,oy2,ox+W,oy2,C.muted,1.5);a.line(ox,oy2-H2-8,ox,oy2+H2+8,C.muted,1.5);
  a.txt('T(θ) = ½i²·dL/dθ (N·m)',ox+2,oy2-H2-14,C.text,12);
  const Tmx=Math.max(0.5*s.i*s.i*(Lmax-Lmin)/(s.bs*Math.PI/180)*1.25,0.1);
  const pt=[];for(let t=0;t<=180;t+=0.5)pt.push([ox+t/180*W,oy2-0.5*s.i*s.i*dL(t)/Tmx*H2]);
  curve(a,pt,C.c,2.5);
  [0,45,90,135,180].forEach(v=>{a.line(ox+v/180*W,oy2-3,ox+v/180*W,oy2+3,C.muted,1.5);a.txt(v+'°',ox+v/180*W,oy2+H2+24,C.muted,10,'center');});
  [1,-1].forEach(g=>{a.line(ox,oy2-g*H2*0.8,ox+W,oy2-g*H2*0.8,C.grid,1);a.txt(N1(g*Tmx*0.8),ox-6,oy2-g*H2*0.8+4,C.muted,9,'right');});
  a.line(ox+s.th/180*W,oy2-H2-6,ox+s.th/180*W,oy2+H2+6,C.b,2,[4,3]);
  a.circ(ox+s.th/180*W,oy2-T/Tmx*H2,5,C.b,true);
  a.txt(T>0.001?'T = '+N2(T)+' N·m (motor)':(T<-0.001?'T = '+N2(T)+' N·m (frena)':'T = 0'),ox+s.th/180*W+8,oy2-T/Tmx*H2-10,T>0?C.c:C.b,11);
  a.html(`Motor de reluctancia conmutada 6/4: L varía con la posición entre <b>${N0(s.Lmin)} y ${N0(s.Lmax)} mH</b>; con θ = ${N0(s.th)}° y i = ${NQ(s.i)} A, L = <b>${N1(Lf(s.th)*1000)} mH</b>.<br>
  T = ½·i²·dL/dθ = <b>${N2(T)} N·m</b>. El par <b>no depende del signo de la corriente</b> (va con i²), sólo de la pendiente de L.<br>
  ${dL(s.th)>0?'Pendiente positiva: la fase excitada <b>atrae</b> el polo del rotor y produce par motor.':dL(s.th)<0?'Pendiente negativa: si se mantiene excitada aquí, la fase <b>frena</b>. Hay que apagarla al alcanzar la alineación.':'Zona de pendiente nula (polos alineados o totalmente desalineados): <b>par nulo</b>, por mucha corriente que se inyecte.'}
  <span class="hint">De aquí sale la regla de control: excitar cada fase <b>sólo mientras dL/dθ &gt; 0</b> y apagarla antes de la alineación. Es un motor sin imanes ni devanado en el rotor — barato y robusto —, pero con par pulsante y necesidad de sensor de posición.</span>`);}});

/* Extra · Ensayos del transformador */
SIMS.ensayos=el=>build(el,{w:660,h:360,
 sliders:[{k:'Voc',v:240,min:100,max:300,step:5,l:'Ensayo vacío: V_oc',u:'V'},
  {k:'Ioc',v:6,min:0.5,max:15,step:0.1,l:'I_oc',u:'A'},
  {k:'Poc',v:500,min:100,max:1500,step:10,l:'P_oc',u:'W'},
  {k:'Vsc',v:100,min:20,max:200,step:2,l:'Ensayo c.c.: V_sc',u:'V'},
  {k:'Isc',v:40,min:5,max:80,step:1,l:'I_sc',u:'A'},
  {k:'Psc',v:800,min:100,max:3000,step:20,l:'P_sc',u:'W'}],
 draw(a){a.clear();const s=a.st;
  const Rc=s.Voc*s.Voc/s.Poc, Soc=s.Voc*s.Ioc, Qoc=Math.sqrt(Math.max(Soc*Soc-s.Poc*s.Poc,0)), Xm=Qoc>0?s.Voc*s.Voc/Qoc:Infinity;
  const Z=s.Vsc/s.Isc, R=s.Psc/(s.Isc*s.Isc), Xx=Math.sqrt(Math.max(Z*Z-R*R,0));
  const fpo=s.Poc/Soc;
  // dos esquemas
  const dib=(x0,y0,tit,abierto)=>{
    a.txt(tit,x0,y0-16,C.text,13);
    a.circ(x0+18,y0+40,16,C.a,false);a.txt('V',x0+18,y0+45,C.a,12,'center');
    a.line(x0+18,y0+24,x0+18,y0+4,C.muted,1.5);a.line(x0+18,y0+4,x0+150,y0+4,C.muted,1.5);
    a.line(x0+18,y0+56,x0+18,y0+84,C.muted,1.5);a.line(x0+18,y0+84,x0+150,y0+84,C.muted,1.5);
    Rbox(a,x0+70,y0-6,20,20,C.c,true);
    a.line(x0+120,y0+4,x0+120,y0+84,C.f,2.5);a.line(x0+128,y0+4,x0+128,y0+84,C.f,2.5);
    a.line(x0+150,y0+4,x0+200,y0+4,C.muted,1.5);a.line(x0+150,y0+84,x0+200,y0+84,C.muted,1.5);
    if(abierto){a.circ(x0+200,y0+4,3,C.b,true);a.circ(x0+200,y0+84,3,C.b,true);a.txt('abierto',x0+206,y0+48,C.b,11);}
    else{a.line(x0+200,y0+4,x0+200,y0+84,C.b,2.5);a.txt('cortocircuito',x0+206,y0+48,C.b,11);}};
  dib(40,50,'Ensayo de vacío (tensión nominal)',true);
  dib(40,210,'Ensayo de cortocircuito (corriente nominal)',false);
  const bx=400;
  a.txt('Vacío ⇒ rama en paralelo',bx,66,C.a,12);
  a.txt('f.d.p. = P/(V·I) = '+N3(fpo),bx,88,C.muted,12);
  a.txt('R_c = V²/P = '+N0(Rc)+' Ω',bx,110,C.a,12);
  a.txt('X_m = V²/Q = '+N0(Xm)+' Ω',bx,132,C.f,12);
  a.txt('pérdidas en el hierro = '+N0(s.Poc)+' W',bx,154,C.muted,11);
  a.txt('Cortocircuito ⇒ rama serie',bx,226,C.a,12);
  a.txt('Z_eq = V/I = '+N3(Z)+' Ω',bx,248,C.muted,12);
  a.txt('R_eq = P/I² = '+N3(R)+' Ω',bx,270,C.c,12);
  a.txt('X_eq = √(Z²−R²) = '+N3(Xx)+' Ω',bx,292,C.f,12);
  a.txt('pérdidas en el cobre = '+N0(s.Psc)+' W',bx,314,C.muted,11);
  a.html(`<b>Vacío</b> (se alimenta a tensión nominal el lado que se mide, el otro abierto): la corriente es pequeña, así que las pérdidas medidas son prácticamente las del <b>hierro</b> ⇒ R_c = V²/P = <b>${N0(Rc)} Ω</b> y X_m = V²/Q = <b>${N0(Xm)} Ω</b>, con Q = √(S²−P²) = ${N0(Qoc)} var.<br>
  <b>Cortocircuito</b> (se alimenta con tensión reducida hasta la corriente nominal): el flujo es pequeño, así que las pérdidas son las del <b>cobre</b> ⇒ Z_eq = <b>${N3(Z)} Ω</b>, R_eq = P/I² = <b>${N3(R)} Ω</b> y X_eq = <b>${N3(Xx)} Ω</b>.<br>
  <span class="hint">Lo que decide todo es <b>en qué lado se hace cada ensayo</b>: los parámetros salen referidos a ese lado y pasarlos al otro exige multiplicar o dividir por a². Con 2400/240 (a = 10) una R de 0,5 Ω en alta son 5 mΩ en baja.</span>`);}});

/* ---- Ensayos de vacío y cortocircuito: el circuito equivalente paso a paso ---- */
const boxE=(a,x,y,w,h,lab,col,on)=>{a.g.fillStyle=C.bg;a.g.fillRect(x,y,w,h);a.g.strokeStyle=col;a.g.lineWidth=on?4:2;a.g.strokeRect(x,y,w,h);a.txt(lab,x+w/2,y+h/2+4,col,12,'center');};

SIMS.ensayosPaso=el=>build(el,{w:660,h:400,
 sliders:[{k:'paso',v:0,min:0,max:7,step:1,l:'paso del método (0 = datos)',u:''}],
 draw(a){a.clear();const p=a.st.paso;
  const K={V:'#d62828',Rc:'#2c8a52',Xm:'#3a63c4',Req:'#2c8a52',Xeq:'#3a63c4'};
  const onV=p>=1&&p<=3, onC=p>=4;
  const cV=c=>(p>0&&!onV)?C.grid:c;
  const cC=c=>(p>0&&!onC)?C.grid:c;
  const W=(x1,y1,x2,y2)=>a.line(x1,y1,x2,y2,C.muted,2);
  // ensayo de vacío
  a.txt('Ensayo de vacío (V₀ nominal, secundario abierto)',70,30,onV||p===0?C.text:C.grid,13);
  W(70,50,300,50); W(70,150,300,150); W(70,50,70,104); W(70,136,70,150);
  a.circ(70,120,16,cV(K.V),false); a.txt('V₀',50,125,cV(K.V),12,'right');
  W(200,50,200,100); W(200,136,200,150); W(270,50,270,100); W(270,136,270,150);
  boxE(a,178,100,44,36,'Rc',cV(K.Rc),p>=3);
  boxE(a,248,100,44,36,'Xm',cV(K.Xm),p>=3);
  // ensayo de cortocircuito
  a.txt('Ensayo de cortocircuito (I_cc nominal)',70,222,onC||p===0?C.text:C.grid,13);
  W(70,250,130,250); W(174,250,200,250); W(244,250,300,250); W(300,250,300,350); W(70,350,300,350); W(70,250,70,284); W(70,316,70,350);
  a.circ(70,300,16,cC(K.V),false); a.txt('V_cc',50,305,cC(K.V),12,'right');
  boxE(a,130,236,44,28,'Req',cC(K.Req),p>=5);
  boxE(a,200,236,44,28,'Xeq',cC(K.Xeq),p>=6);
  // panel de resultados
  const items=[[70,1,'S₀ = V₀·I₀ = 1440 VA',K.V],[96,2,'Q₀ = √(S₀² − P₀²) ≈ 1350 var',C.text],[122,3,'R_c = V₀²/P₀ = 115,2 Ω',K.Rc],[148,3,'X_m = V₀²/Q₀ ≈ 42,65 Ω',K.Xm],
    [270,4,'Z_cc = V_cc/I_cc = 2,5 Ω',C.text],[296,5,'R_eq = P_cc/I_cc² = 0,5 Ω',K.Req],[322,6,'X_eq = √(Z² − R²) ≈ 2,45 Ω',K.Xeq]];
  items.forEach(([y,k,s,c])=>{if(p>=k)a.txt(s,340,y,c,13);});
  const T=[
   'Datos de los dos ensayos (los del simulador): vacío V₀ = 240 V, I₀ = 6 A, P₀ = 500 W; cortocircuito V_cc = 100 V, I_cc = 40 A, P_cc = 800 W. Sube el paso para sacar los parámetros.',
   'Vacío: con el secundario abierto y tensión nominal, S₀ = V₀·I₀ = 240 · 6 = 1440 VA. Como I₀ es pequeña, P₀ es casi toda pérdida en el hierro.',
   'Potencia reactiva de vacío: Q₀ = √(S₀² − P₀²) = √(1440² − 500²) ≈ 1350 var.',
   'Rama en paralelo: R_c = V₀²/P₀ = 240²/500 = 115,2 Ω (pérdidas en el hierro) y X_m = V₀²/Q₀ ≈ 42,65 Ω (magnetización).',
   'Cortocircuito: con I_cc nominal, Z_cc = V_cc/I_cc = 100/40 = 2,5 Ω. Aquí P_cc es casi todo pérdida en el cobre.',
   'Resistencia serie: R_eq = P_cc/I_cc² = 800/40² = 0,5 Ω.',
   'Reactancia serie: X_eq = √(Z_cc² − R_eq²) = √(2,5² − 0,5²) = √6 ≈ 2,45 Ω.',
   'Comprobación: R_c ≫ R_eq, como debe ser. Todos los valores salen referidos al lado donde se hizo cada ensayo; para pasarlos al otro lado hay que dividir o multiplicar por a².'
  ];
  a.html(`<div>${T[p]}</div>`);
 }});







/* ---- paso2 asincronoPaso ---- */
SIMS.asincronoPaso=el=>SIMS.__paso(el,{"w":620,"h":310,"q":"Un motor asíncrono de 4 polos a 50 Hz gira a 1440 rpm con 10 kW en el entrehierro. ¿Cuál es su deslizamiento y cómo se reparte la potencia? Sube el paso.","base":[["t","4 polos · 50 Hz · n = 1440 rpm · P_entrehierro = 10 kW",30,26,13,"left"]],"steps":[{"text":"Un motor asíncrono de <b>4 polos</b> (2 pares) alimentado a <b>50 Hz</b> gira a <b>1440 rpm</b> y recibe en el entrehierro <b>10 kW</b>. ¿Qué deslizamiento tiene y cómo se reparte la potencia?","add":[]},{"text":"Velocidad de sincronismo: <b>n<sub>s</sub> = 60f/p = 60·50/2 = 1500 rpm</b>. El rotor nunca llega a ella: si lo hiciera no habría flujo cortado y no habría par.","add":[["t","n_s = 60f/p = 1500 rpm",40,70,15,"left"]]},{"text":"Deslizamiento: <b>s = (n<sub>s</sub> − n)/n<sub>s</sub> = (1500 − 1440)/1500 = 0,04</b> (4 %).","add":[["t","s = 60/1500 = 0,04",40,104,15,"left"]]},{"text":"Frecuencia en el rotor: <b>f₂ = s·f = 0,04·50 = 2 Hz</b>. Por eso las pérdidas en el hierro del rotor son despreciables.","add":[["t","f₂ = s f = 2 Hz",40,138,15,"left"]]},{"text":"Pérdidas en el cobre del rotor: <b>P<sub>cu2</sub> = s·P<sub>ag</sub> = 0,04·10000 = 400 W</b>.","add":[["t","P_cu2 = s P_ag = 400 W",40,172,15,"left"],["r",330,250,10.4,24,1],["t","P_cu2 = 400 W",322,267,13,"right"]]},{"text":"Potencia mecánica interna: <b>P<sub>m</sub> = (1 − s)P<sub>ag</sub> = 0,96·10000 = 9600 W</b>. La potencia del entrehierro se reparte siempre en proporción 1 − s : s.","add":[["t","P_m = (1−s) P_ag = 9600 W",40,206,15,"left"],["r",330,280,249.6,24,1],["t","P_m = 9600 W",322,297,13,"right"]]},{"text":"Par electromagnético: <b>T = P<sub>ag</sub>/ω<sub>s</sub> = 10000/157,08 = 63,7 N·m</b> (con la velocidad de sincronismo ω<sub>s</sub> = 2π·1500/60 = 157,08 rad/s); equivale a P<sub>m</sub>/ω.","add":[["t","T = P_ag/ω_s = 63,7 N·m",40,240,15,"left"]]}]});
/* ---- fin paso2 asincronoPaso ---- */





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

/* ---- paso3 mccPaso ---- */
SIMS.mccPaso=el=>SIMS.__paso(el,{"w":660,"h":260,"q":"¿A qué velocidad gira el motor de CC al pasar de 25 A a 50 A de inducido? Sube el paso.","base":[["t","Motor de excitación independiente: V = 230 V , Ra = 0,4 Ω , Φ constante",30,26,14,"left"]],"steps":[{"text":"Un motor de CC con excitación constante trabaja a 230 V, R<sub>a</sub> = 0,4 Ω. Con I<sub>a</sub> = 25 A gira a 1500 rpm. ¿A qué velocidad gira con I<sub>a</sub> = 50 A?","add":[["t","V = E + Ra·Ia",30,62,15,"left"]]},{"text":"<b>Paso 1:</b> el circuito del inducido da V = E + R<sub>a</sub>I<sub>a</sub>. Con 25 A: E₁ = 230 − 0,4·25 = <b>220 V</b>.","add":[["t","E1 = 230 − 0,4·25 = 220 V",30,96,15,"left"]]},{"text":"<b>Paso 2:</b> la fuerza contraelectromotriz es E = kΦ·n. Con flujo constante, <b>E es proporcional a la velocidad</b>.","add":[["t","E = kΦ·n   ⇒   n ∝ E",30,130,15,"left"]]},{"text":"<b>Paso 3:</b> con 50 A: E₂ = 230 − 0,4·50 = <b>210 V</b>. Ha caído porque la resistencia del inducido consume más tensión.","add":[["t","E2 = 230 − 0,4·50 = 210 V",30,164,15,"left"]]},{"text":"<b>Paso 4:</b> n₂ = n₁·E₂/E₁ = 1500·210/220 = <b>1431,8 rpm</b>. Al cargar el motor, la velocidad baja ligeramente.","add":[["t","n2 = 1500 · 210/220 = 1431,8 rpm",30,198,15,"left"]]},{"text":"<b>Paso 5:</b> potencia electromagnética con 25 A: P = E·I<sub>a</sub> = 220·25 = <b>5500 W</b>. Con 50 A sería 210·50 = 10500 W: el par se ha duplicado (T ∝ I<sub>a</sub>) pero la velocidad apenas cambia.","add":[["t","P1 = 5500 W ,  P2 = 10500 W  (par ×2)",30,232,15,"left"]]}]});
/* ---- fin paso3 mccPaso ---- */
/* ---- nuevos sims ---- */
const U0 = 4e-7 * Math.PI;
const nf = (x, d) => (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d === undefined ? 2 : d).replace('.', ',');
const ing = x => {                       // 2,5e5 -> "2,50·10⁵"
  if (!isFinite(x) || x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  const sup = String(e).replace(/-/g, '⁻').replace(/[0-9]/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]);
  return nf(x / Math.pow(10, e)) + '·10' + sup;
};

/* rejilla + ejes; devuelve los conversores de coordenadas */
function nxPlot(a, L) {
  const X = v => L.x + (v - L.xmin) / (L.xmax - L.xmin) * L.w;
  const Y = v => L.y + L.h - (v - L.ymin) / (L.ymax - L.ymin) * L.h;
  const nx = L.nx || 5, ny = L.ny || 4;
  for (let i = 0; i <= nx; i++) { const v = L.xmin + (L.xmax - L.xmin) * i / nx; a.line(X(v), L.y, X(v), L.y + L.h, C.grid, 1); }
  for (let j = 0; j <= ny; j++) { const v = L.ymin + (L.ymax - L.ymin) * j / ny; a.line(L.x, Y(v), L.x + L.w, Y(v), C.grid, 1); }
  const yz = (L.ymin < 0 && L.ymax > 0) ? Y(0) : L.y + L.h;
  const xz = (L.xmin < 0 && L.xmax > 0) ? X(0) : L.x;
  a.line(L.x, yz, L.x + L.w, yz, C.muted, 1.6);
  a.line(xz, L.y, xz, L.y + L.h, C.muted, 1.6);
  if (L.xlab) a.txt(L.xlab, L.x + L.w, L.y + L.h + (yz < L.y + L.h ? 17 : 31), C.muted, 12, 'right');
  if (L.ylab) a.txt(L.ylab, L.x - 2, L.y - 9, C.muted, 12, 'right');
  (L.xt || []).forEach(v => a.txt(nf(v, 0) + (L.xsuf || ''), X(v), yz + 16, C.muted, 11, 'center'));
  (L.yt || []).forEach(v => a.txt(nf(v, L.yd === undefined ? 0 : L.yd), L.x - 6, Y(v) + 4, C.muted, 11, 'right'));
  return { X, Y, L };
}
function nxCurva(a, P, pts, col, wd, dash) {
  const L = P.L, g = a.g;
  g.save(); g.beginPath(); g.rect(L.x - 1, L.y - 1, L.w + 2, L.h + 2); g.clip();
  g.strokeStyle = col; g.lineWidth = wd || 2.2; g.setLineDash(dash || []);
  g.beginPath();
  pts.forEach((p, i) => { const x = P.X(p[0]), y = P.Y(p[1]); i ? g.lineTo(x, y) : g.moveTo(x, y); });
  g.stroke(); g.setLineDash([]); g.restore();
}
function nxLeyenda(a, x, y, items) {           // [[color, texto], ...]
  items.forEach((it, i) => {
    const yy = y + i * 18;
    a.line(x, yy - 4, x + 20, yy - 4, it[0], 3);
    a.txt(it[1], x + 26, yy, C.text, 12);
  });
}
/* Colores de serie fijos: nunca el acento del tema, que cambia de un tema a
   otro y puede coincidir con ellos y dejar dos curvas del mismo color. */
function nxPal(a) {
  const cs = getComputedStyle(a.cv.parentNode), v = n => cs.getPropertyValue(n).trim();
  return { azul: v('--c5') || '#2a5f9e', naranja: v('--c4') || '#a8601a',
           rojo: v('--warn') || '#b03a1e', verde: v('--c2') || '#1f7a5a',
           teja: v('--c6') || '#0f6f74', morado: v('--c3') || '#8a4a9e' };
}

/* =============================================================== T1
   Los cuatro cuadrantes del plano par-velocidad                     */
SIMS.cuadrantes = el => build(el, {
  w: 680, h: 430,
  sliders: [{ k: 'n', v: 1200, min: -2000, max: 2000, step: 50, l: 'Velocidad n', u: 'rpm' },
            { k: 'T', v: 6, min: -12, max: 12, step: 0.5, l: 'Par de la máquina T', u: 'N·m' }],
  selects: [{ k: 'app', v: 'grua', l: 'Qué está moviendo', opts: [['grua', 'Una grúa (n > 0 = subir)'], ['coche', 'Un coche eléctrico'], ['nada', 'Sólo el plano']] }],
  draw(a) {
    a.clear();
    const st = a.st, S = nxPal(a), w = 2 * Math.PI * st.n / 60, P = st.T * w;
    const L = { x: 56, y: 28, w: 340, h: 344, xmin: -2300, xmax: 2300, ymin: -13.5, ymax: 13.5,
                xlab: 'n (rpm)', ylab: 'T (N·m)', nx: 4, ny: 4, xt: [-2000, -1000, 1000, 2000], yt: [-10, -5, 5, 10] };
    const Q = nxPlot(a, L);
    const x0 = Q.X(0), y0 = Q.Y(0);
    a.g.save(); a.g.globalAlpha = .12;
    a.g.fillStyle = S.verde; a.g.fillRect(x0, L.y, L.x + L.w - x0, y0 - L.y);          // Q1
    a.g.fillRect(L.x, y0, x0 - L.x, L.y + L.h - y0);                                   // Q3
    a.g.fillStyle = S.naranja; a.g.fillRect(L.x, L.y, x0 - L.x, y0 - L.y);             // Q2
    a.g.fillRect(x0, y0, L.x + L.w - x0, L.y + L.h - y0);                              // Q4
    a.g.restore();
    const textos = {
      grua: [['SUBE la carga', 'el motor tira'], ['BAJA frenando', 'devuelve energía'],
             ['BAJA tirando', 'el gancho pesa poco'], ['SUBE frenando', 'al final del trayecto']],
      coche: [['ACELERA adelante', 'gasta batería'], ['FRENA yendo atrás', 'carga batería'],
              ['ACELERA marcha atrás', 'gasta batería'], ['FRENA yendo adelante', 'carga batería']],
      nada: [['potencia positiva', ''], ['potencia negativa', ''],
             ['potencia positiva', ''], ['potencia negativa', '']]
    }[st.app];
    // los rótulos van pegados a las esquinas de fuera, lejos del punto de trabajo
    const m = 12;
    const esq = [[L.x + L.w - m, L.y + m + 12, 'I · MOTOR', S.verde, 'right'],
                 [L.x + m, L.y + m + 12, 'II · FRENO', S.naranja, 'left'],
                 [L.x + m, L.y + L.h - m, 'III · MOTOR', S.verde, 'left'],
                 [L.x + L.w - m, L.y + L.h - m, 'IV · FRENO', S.naranja, 'right']];
    esq.forEach(q => a.txt(q[2], q[0], q[1], q[3], 13, q[4]));
    // punto de trabajo
    const px = Q.X(st.n), py = Q.Y(st.T);
    a.line(px, y0, px, py, C.muted, 1, [4, 3]);
    a.line(x0, py, px, py, C.muted, 1, [4, 3]);
    a.circ(px, py, 6.5, C.text, true);
    a.circ(px, py, 11, C.text, false);
    const q = st.n >= 0 ? (st.T >= 0 ? 1 : 4) : (st.T >= 0 ? 2 : 3);
    // panel derecho: qué pasa en el cuadrante activo + potencia
    const bx = 436, by = 160, bh = 200, col = (q === 1 || q === 3) ? S.verde : S.naranja;
    a.txt('Cuadrante ' + ['I', 'II', 'III', 'IV'][q - 1], bx, 48, col, 15);
    a.txt((q === 1 || q === 3) ? 'MOTOR' : 'FRENO / GENERADOR', bx, 68, col, 12.5);
    a.txt(textos[q - 1][0], bx, 94, C.text, 12.5);
    a.txt(textos[q - 1][1], bx, 112, C.muted, 11.5);
    a.txt(P >= 0 ? 'La red entrega energía.' : 'La red recibe energía.', bx, 136, C.muted, 11.5);
    a.txt('P = T · ω', bx, by + 22, C.muted, 12);
    a.line(bx, by + bh / 2, bx + 150, by + bh / 2, C.muted, 1.4);
    const Pmax = 12 * 2 * Math.PI * 2000 / 60, hb = Math.max(2, Math.abs(P) / Pmax * (bh / 2 - 14));
    a.g.fillStyle = col;
    a.g.fillRect(bx + 34, P >= 0 ? by + bh / 2 - hb : by + bh / 2, 78, hb);
    a.txt(nf(Math.abs(P), 0) + ' W', bx + 73, P >= 0 ? by + bh / 2 - hb - 8 : by + bh / 2 + hb + 16, C.text, 13, 'center');
    a.html('<b>Cuadrante ' + ['I', 'II', 'III', 'IV'][q - 1] + '</b> · '
      + 'ω = 2π·n/60 = <b>' + nf(w) + ' rad/s</b> · '
      + 'P = T·ω = <b>' + nf(P, 0) + ' W</b> · '
      + (P >= 0 ? 'par y velocidad tienen el mismo signo: la máquina <b>da par motor</b> y consume de la red.'
                : 'par y velocidad tienen signos contrarios: la máquina <b>frena</b> y, si el convertidor lo permite, devuelve energía.')
      + '<br>El signo de P es lo único que separa motor de freno. El accionamiento tiene que poder trabajar en los cuatro cuadrantes si la carga se lo pide.');
  }
});

/* =============================================================== T2
   Circuito magnético con entrehierro                                */
function nxB(Ni, lfe, lg, A, mur0, Bs) {   // resuelve N·i = H_fe·l_fe + (B/µ0)·l_g
  const f = B => B * lfe * (1 + Math.pow(B / Bs, 6)) / (U0 * mur0) + B * lg / U0 - Ni;
  let lo = 0, hi = 6;
  for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
SIMS.saturacion = el => build(el, {
  w: 680, h: 420,
  sliders: [{ k: 'N', v: 300, min: 50, max: 600, step: 10, l: 'Espiras N', u: '' },
            { k: 'i', v: 2, min: 0, max: 6, step: 0.1, l: 'Intensidad i', u: 'A' },
            { k: 'lfe', v: 50, min: 15, max: 90, step: 1, l: 'Longitud media del hierro', u: 'cm' },
            { k: 'A', v: 16, min: 4, max: 40, step: 1, l: 'Sección A', u: 'cm²' },
            { k: 'lg', v: 1, min: 0, max: 3, step: 0.05, l: 'Entrehierro l_g', u: 'mm' },
            { k: 'mur', v: 3000, min: 500, max: 6000, step: 100, l: 'μ_r del hierro (sin saturar)', u: '' }],
  draw(a) {
    const st = a.st, S = nxPal(a), A = st.A / 1e4, lfe = st.lfe / 100, lg = st.lg / 1000, Bs = 1.6;
    const B = nxB(st.N * st.i, lfe, lg, A, st.mur, Bs);
    const murEf = st.mur / (1 + Math.pow(B / Bs, 6));
    const Rfe = lfe / (U0 * murEf * A), Rg = lg / (U0 * A), Rt = Rfe + Rg;
    const phi = B * A, Lh = st.N * st.N / Rt;
    a.clear();
    // --- el núcleo ---
    const X = 40, Y = 40, W = 250, H = 190, e = 26;
    a.g.strokeStyle = C.muted; a.g.lineWidth = 2;
    a.g.strokeRect(X, Y, W, H); a.g.strokeRect(X + e, Y + e, W - 2 * e, H - 2 * e);
    const gw = Math.max(2, st.lg * 9);
    a.g.fillStyle = C.bg; a.g.fillRect(X + W / 2 - gw / 2, Y + H - e - 1, gw, e + 2);
    a.g.strokeStyle = S.azul; a.g.lineWidth = 2;
    a.g.beginPath(); a.g.moveTo(X + W / 2 - gw / 2, Y + H - e); a.g.lineTo(X + W / 2 - gw / 2, Y + H);
    a.g.moveTo(X + W / 2 + gw / 2, Y + H - e); a.g.lineTo(X + W / 2 + gw / 2, Y + H); a.g.stroke();
    a.txt('entrehierro', X + W / 2, Y + H + 20, S.azul, 12, 'center');
    for (let k = 0; k < 6; k++) {
      const yy = Y + 26 + k * 24;
      a.line(X - 12, yy + 8, X + e + 10, yy - 4, S.morado, 2.4);
    }
    a.txt('N = ' + st.N, X - 14, Y + 18, S.morado, 12.5);
    a.txt('i = ' + nf(st.i, 1) + ' A', X - 14, Y + H + 20, S.morado, 12.5);
    a.txt('Φ', X + W / 2, Y + e + 22, C.text, 14, 'center');
    a.arrow(X + W / 2 - 26, Y + e / 2, X + W / 2 + 26, Y + e / 2, S.teja, 2.2);
    // --- reparto de la fuerza magnetomotriz ---
    const bx = 330, by = 56, bw = 310;
    a.txt('¿Dónde se gasta la fuerza magnetomotriz N·i?', bx, by - 16, C.text, 13);
    const fg = Rg / Rt;
    a.g.fillStyle = S.naranja; a.g.fillRect(bx, by, bw * (1 - fg), 26);
    a.g.fillStyle = S.azul; a.g.fillRect(bx + bw * (1 - fg), by, bw * fg, 26);
    if (fg < .7) a.txt('hierro ' + nf(100 * (1 - fg), 0) + '%', bx + 6, by + 18, C.bg, 12);
    else a.txt('hierro ' + nf(100 * (1 - fg), 0) + '%', bx, by + 44, S.naranja, 12);
    if (fg > .18) a.txt('entrehierro ' + nf(100 * fg, 0) + '%', bx + bw - 6, by + 18, C.bg, 12, 'right');
    else a.txt('entrehierro ' + nf(100 * fg, 0) + '%', bx + bw, by + 44, S.azul, 12, 'right');
    // --- induccion frente a la saturacion ---
    const gy = 158, gh = 148;
    const Pg = nxPlot(a, { x: bx, y: gy, w: bw, h: gh, xmin: 0, xmax: 3, ymin: 0, ymax: 2,
                           xlab: 'l_g (mm)', ylab: 'B (T)', nx: 6, ny: 4, xt: [1, 2, 3], yt: [0.5, 1, 1.5, 2], yd: 1 });
    const cur = [];
    for (let k = 0; k <= 120; k++) { const g2 = k / 120 * 3 / 1000; cur.push([k / 120 * 3, nxB(st.N * st.i, lfe, g2, A, st.mur, Bs)]); }
    nxCurva(a, Pg, cur, S.teja, 2.6);
    nxCurva(a, Pg, [[0, Bs], [3, Bs]], S.rojo, 1.6, [6, 4]);
    a.txt('B de saturación', Pg.X(3) - 4, Pg.Y(Bs) - 7, S.rojo, 11, 'right');
    a.circ(Pg.X(st.lg), Pg.Y(B), 6, C.text, true);
    a.circ(Pg.X(st.lg), Pg.Y(B), 9.5, C.text, false);
    a.html('ℜ<sub>hierro</sub> = l<sub>fe</sub>/(μ₀μ<sub>r</sub>A) = <b>' + ing(Rfe) + ' A·v/Wb</b> · '
      + 'ℜ<sub>entrehierro</sub> = l<sub>g</sub>/(μ₀A) = <b>' + ing(Rg) + ' A·v/Wb</b><br>'
      + 'Φ = N·i/ℜ = <b>' + nf(phi * 1000) + ' mWb</b> · B = Φ/A = <b>' + nf(B) + ' T</b> · '
      + 'L = N²/ℜ = <b>' + nf(Lh * 1000, 1) + ' mH</b> · μ_r efectiva = <b>' + nf(murEf, 0) + '</b><br>'
      + (st.lg === 0
        ? 'Sin entrehierro manda el hierro. Si B se acerca a 1,6 T el hierro satura, μ_r se desploma y ℜ sube de golpe.'
        : 'Un entrehierro de sólo ' + nf(st.lg, 2) + ' mm se lleva el <b>' + nf(100 * fg, 0)
          + ' %</b> de la fuerza magnetomotriz, porque el aire tiene μ_r = 1 frente a los miles del hierro. '
          + 'Por eso el entrehierro es el que decide B, L y la energía que cabe en el circuito.'));
  }
});

/* =============================================================== T2
   Tensión, flujo y saturación del núcleo                            */
SIMS.flujo = el => build(el, {
  w: 680, h: 430,
  sliders: [{ k: 'V', v: 230, min: 60, max: 400, step: 5, l: 'Tensión aplicada V₁ (eficaz)', u: 'V' },
            { k: 'f', v: 50, min: 10, max: 60, step: 1, l: 'Frecuencia f', u: 'Hz' },
            { k: 'N', v: 200, min: 50, max: 600, step: 10, l: 'Espiras N₁', u: '' },
            { k: 'A', v: 37, min: 5, max: 70, step: 1, l: 'Sección del núcleo A', u: 'cm²' },
            { k: 'Bs', v: 1.6, min: 1, max: 2, step: 0.05, l: 'B de saturación', u: 'T' }],
  draw(a) {
    const st = a.st, S = nxPal(a), A = st.A / 1e4;
    const phim = st.V / (4.4429 * st.f * st.N), B = phim / A, sat = B > st.Bs;
    a.clear();
    // --- v(t) y phi(t) ---
    const P = nxPlot(a, { x: 56, y: 24, w: 382, h: 146, xmin: 0, xmax: 2, ymin: -1.25, ymax: 1.25,
                          xlab: 'ciclos', nx: 8, ny: 4 });
    const v = [], ph = [];
    for (let k = 0; k <= 240; k++) {
      const t = k / 240 * 2;
      ph.push([t, Math.sin(2 * Math.PI * t)]);
      v.push([t, Math.cos(2 * Math.PI * t)]);
    }
    nxCurva(a, P, ph, S.morado, 2.6);
    nxCurva(a, P, v, S.rojo, 2.6);
    nxLeyenda(a, 456, 40, [[S.rojo, 'v₁ = N·dΦ/dt'], [S.morado, 'Φ, 90° por detrás']]);
    a.txt('La tensión manda:', 456, 92, C.text, 12.5);
    a.txt('el flujo es su integral,', 456, 110, C.muted, 12);
    a.txt('y por eso va retrasado.', 456, 128, C.muted, 12);
    // --- barra de induccion ---
    const bx = 56, by = 244, bw = 290, bh = 30;
    a.txt('Inducción de pico B̂ en el núcleo', bx, by - 16, C.text, 13);
    a.g.strokeStyle = C.grid; a.g.lineWidth = 1; a.g.strokeRect(bx, by, bw, bh);
    const esc = bw / 3;
    a.g.fillStyle = sat ? S.rojo : S.verde; a.g.fillRect(bx, by, Math.min(bw, B * esc), bh);
    a.line(bx + st.Bs * esc, by - 6, bx + st.Bs * esc, by + bh + 26, S.rojo, 2, [5, 3]);
    a.txt('B_sat', bx + st.Bs * esc + 5, by + bh + 38, S.rojo, 11.5);
    a.txt(nf(B) + ' T', bx + 8, by + 20, C.bg, 13.5);
    [0, 1, 2, 3].forEach(t => a.txt(nf(t, 0), bx + t * esc, by + bh + 18, C.muted, 11, 'center'));
    a.txt('T', bx + bw + 16, by + bh + 18, C.muted, 11, 'center');
    // --- corriente de vacio ---
    a.txt('Corriente de vacío i_m', 408, by - 16, C.text, 13);
    const Pi = nxPlot(a, { x: 408, y: by - 4, w: 238, h: 104, xmin: 0, xmax: 2, ymin: -1.2, ymax: 1.2, nx: 8, ny: 4 });
    const H = x => x * (1 + Math.pow(Math.abs(x) / st.Bs, 12));
    const im = []; let pico = 0;
    for (let k = 0; k <= 240; k++) { const t = k / 240 * 2, y = H(B * Math.sin(2 * Math.PI * t)); im.push([t, y]); pico = Math.max(pico, Math.abs(y)); }
    nxCurva(a, Pi, im.map(p => [p[0], p[1] / pico]), sat ? S.rojo : S.verde, 2.4);
    const veces = pico / B;
    a.txt(sat ? 'se dispara: pico ×' + nf(veces, 1) : 'senoidal: el núcleo no satura',
          408, by + 122, sat ? S.rojo : C.muted, 11.5);
    a.html('Φ̂ = V₁/(4,44·f·N₁) = <b>' + nf(phim * 1000) + ' mWb</b> · '
      + 'B̂ = Φ̂/A = <b>' + nf(B) + ' T</b>  (límite ' + nf(st.Bs) + ' T)<br>'
      + 'Al revés es la fórmula de diseño: <b>V₁ = 4,44·f·N₁·A·B̂</b>. '
      + 'B̂ no depende de la carga: sólo de la tensión, la frecuencia, las espiras y la sección.<br>'
      + (sat
        ? '<b>El núcleo satura.</b> Pasado el codo hace falta muchísima más fuerza magnetomotriz para el mismo flujo, '
          + 'así que la corriente de vacío deja de ser senoidal y se dispara (aquí, ×' + nf(veces, 1) + ' el pico). '
          + 'Baja la tensión, sube la frecuencia o pon más espiras.'
        : 'Fíjate en que f está dividiendo: <b>si bajas la frecuencia a la mitad sin bajar la tensión, B̂ se duplica</b>. '
          + 'Por eso un transformador de 50 Hz se quema a 25 Hz a tensión nominal.'));
  }
});

/* =============================================================== T4
   Curva n-T de la máquina de continua según la excitación           */
SIMS.excitacion = el => build(el, {
  w: 680, h: 420,
  sliders: [{ k: 'V', v: 230, min: 100, max: 400, step: 5, l: 'Tensión V', u: 'V' },
            { k: 'Ra', v: 0.4, min: 0.05, max: 2, step: 0.05, l: 'Resistencia del inducido R_a', u: 'Ω' },
            { k: 'kf', v: 1.2, min: 0.4, max: 2.5, step: 0.05, l: 'kΦ de la excitación fija', u: 'V·s/rad' },
            { k: 'ks', v: 0.02, min: 0.005, max: 0.05, step: 0.001, l: 'Constante de la serie', u: '' },
            { k: 'T', v: 10, min: 0.5, max: 40, step: 0.5, l: 'Par resistente de la carga', u: 'N·m' }],
  draw(a) {
    const st = a.st, S = nxPal(a), R = st.Ra;
    const rpm = w => w * 60 / (2 * Math.PI);
    const indep = T => (st.V - R * T / st.kf) / st.kf;
    const serie = T => { const Ia = Math.sqrt(T / st.ks); return (st.V - (R + 0.2) * Ia) / (st.ks * Ia); };
    const comp = T => { const c = st.ks * 1.5, Ia = (-st.kf + Math.sqrt(st.kf * st.kf + 4 * c * T)) / (2 * c);
                        return (st.V - R * Ia) / (st.kf + c * Ia); };
    a.clear();
    const P = nxPlot(a, { x: 66, y: 26, w: 420, h: 320, xmin: 0, xmax: 40, ymin: 0, ymax: 6000,
                          xlab: 'T (N·m)', ylab: 'n (rpm)', nx: 8, ny: 4,
                          xt: [10, 20, 30, 40], yt: [1500, 3000, 4500, 6000] });
    const curva = f => { const o = []; for (let k = 1; k <= 200; k++) { const T = k / 200 * 40; o.push([T, rpm(f(T))]); } return o; };
    nxCurva(a, P, curva(indep), S.azul, 2.6);
    nxCurva(a, P, curva(comp), S.naranja, 2.6);
    nxCurva(a, P, curva(serie), S.rojo, 2.6);
    nxLeyenda(a, 506, 54, [[S.azul, 'Indep. / derivación'], [S.naranja, 'Compuesta'], [S.rojo, 'Serie']]);
    [indep, comp, serie].forEach(fn => {
      const y = rpm(fn(st.T));
      if (y > 0 && y < 6000) { a.circ(P.X(st.T), P.Y(y), 5.5, C.text, true); a.circ(P.X(st.T), P.Y(y), 9, C.text, false); }
    });
    a.line(P.X(st.T), P.L.y, P.X(st.T), P.L.y + P.L.h, C.muted, 1, [4, 3]);
    a.txt('carga', P.X(st.T), P.L.y - 8, C.muted, 11.5, 'center');
    const ni = rpm(indep(st.T)), ns = rpm(serie(st.T)), nc = rpm(comp(st.T));
    const Iai = st.T / st.kf, Ias = Math.sqrt(st.T / st.ks);
    a.html('Con ' + nf(st.T, 1) + ' N·m: independiente <b>' + nf(ni, 0) + ' rpm</b> (I_a = ' + nf(Iai, 1) + ' A) · '
      + 'compuesta <b>' + nf(nc, 0) + ' rpm</b> · serie <b>' + nf(ns, 0) + ' rpm</b> (I_a = ' + nf(Ias, 1) + ' A)<br>'
      + '<b>Independiente:</b> Φ fijo, n = (V − R_a·T/kΦ)/kΦ, casi una recta plana: la velocidad apenas cae al cargar. '
      + '<b>Serie:</b> Φ crece con I_a, el par va con I_a² y n con 1/√T, así que da un par de arranque enorme '
      + 'pero <b>en vacío se embala</b>. <b>Compuesta:</b> cae más que la independiente al cargar, pero tiene velocidad de vacío definida y no se embala.<br>'
      + 'Sube el par de la carga y mira cómo se separan: por eso un motor serie mueve una locomotora y uno de '
      + 'excitación independiente mueve una máquina herramienta.');
  }
});

/* =============================================================== T5
   Clarke y Park                                                     */
SIMS.clarkepark = el => build(el, {
  w: 680, h: 440,
  sliders: [{ k: 'wt', v: 60, min: 0, max: 360, step: 2, l: 'ωt', u: '°' },
            { k: 'Ip', v: 10, min: 1, max: 20, step: 0.5, l: 'Pico de la corriente Î', u: 'A' },
            { k: 'des', v: 0, min: -90, max: 90, step: 5, l: 'Desalineación del marco d-q', u: '°' }],
  selects: [{ k: 'modo', v: 'gira', l: 'Marco d-q', opts: [['gira', 'Gira con el campo (Park)'], ['fijo', 'Quieto (sólo Clarke)']] }],
  draw(a) {
    const st = a.st, S = nxPal(a), r = Math.PI / 180, wt = st.wt * r;
    const th = (st.modo === 'gira' ? wt : 0) + st.des * r;
    const fase = k => st.Ip * Math.cos(wt - k * 2 * Math.PI / 3);
    const abc = t => [0, 1, 2].map(k => st.Ip * Math.cos(t - k * 2 * Math.PI / 3));
    const clarke = i => [(2 / 3) * (i[0] - i[1] / 2 - i[2] / 2), (2 / 3) * (Math.sqrt(3) / 2) * (i[1] - i[2])];
    const i3 = abc(wt), [al, be] = clarke(i3);
    const id = al * Math.cos(th) + be * Math.sin(th), iq = -al * Math.sin(th) + be * Math.cos(th);
    a.clear();
    // --- ondas abc ---
    const FASE = [S.azul, S.naranja, S.rojo];
    const P = nxPlot(a, { x: 48, y: 24, w: 330, h: 142, xmin: 0, xmax: 360, ymin: -21, ymax: 21, nx: 6, ny: 4,
                          xt: [90, 180, 270], xsuf: '°' });
    FASE.forEach((col, k) => {
      const o = []; for (let j = 0; j <= 180; j++) { const t = j / 180 * 360; o.push([t, st.Ip * Math.cos(t * r - k * 2 * Math.PI / 3)]); }
      nxCurva(a, P, o, col, 2.2);
      a.circ(P.X(st.wt), P.Y(fase(k)), 4.5, col, true);
    });
    a.line(P.X(st.wt), P.L.y, P.X(st.wt), P.L.y + P.L.h, C.muted, 1.2, [4, 3]);
    nxLeyenda(a, 398, 36, [[FASE[0], 'i_a'], [FASE[1], 'i_b'], [FASE[2], 'i_c']]);
    a.txt('Suman cero en todo', 398, 112, C.muted, 11.5);
    a.txt('instante: sólo dos', 398, 128, C.muted, 11.5);
    a.txt('son independientes.', 398, 144, C.muted, 11.5);
    // --- plano alfa-beta ---
    const cx = 150, cy = 310, u = 4.6;
    a.line(cx - 104, cy, cx + 104, cy, C.muted, 1.3);
    a.line(cx, cy - 104, cx, cy + 104, C.muted, 1.3);
    a.txt('α', cx + 110, cy + 5, C.muted, 12);
    a.txt('β', cx + 6, cy - 108, C.muted, 12);
    a.circ(cx, cy, st.Ip * u, C.grid, false);
    FASE.forEach((col, k) => {
      const ang = k * 2 * Math.PI / 3 + (k ? 0 : 0);
      const R1 = 78;
      a.line(cx, cy, cx + R1 * Math.cos(ang), cy - R1 * Math.sin(ang), col, 1, [3, 3]);
      a.txt('eje ' + 'abc'[k], cx + (R1 + 16) * Math.cos(ang) - 10, cy - (R1 + 16) * Math.sin(ang) + (k ? 4 : 18), col, 11);
    });
    a.line(cx, cy, cx + 96 * Math.cos(th), cy - 96 * Math.sin(th), S.teja, 1.8, [6, 4]);
    a.txt('d', cx + 106 * Math.cos(th) - 4, cy - 106 * Math.sin(th) + 4, S.teja, 12.5);
    a.line(cx, cy, cx - 72 * Math.sin(th), cy - 72 * Math.cos(th), S.morado, 1.6, [4, 4]);
    a.txt('q', cx - 82 * Math.sin(th) - 4, cy - 82 * Math.cos(th) + 4, S.morado, 12.5);
    a.arrow(cx, cy, cx + al * u, cy - be * u, C.text, 3);
    a.txt('i_s', cx + al * u + 8, cy - be * u - 6, C.text, 13);
    a.txt('plano α-β', cx, cy + 122, C.text, 12.5, 'center');
    // --- barras d-q ---
    const bx = 330, by = 248, bw = 230;
    a.txt('En el marco d-q', bx, by - 22, C.text, 13);
    [['i_d', id, S.teja], ['i_q', iq, S.morado]].forEach(([nm, val, col], k) => {
      const yy = by + k * 44, zx = bx + 220;
      a.txt(nm + ' = ' + nf(val) + ' A', bx, yy + 16, C.text, 12.5);
      a.line(zx, yy - 4, zx, yy + 28, C.muted, 1.2);
      a.g.fillStyle = col;
      const L2 = val / 21 * 100;
      a.g.fillRect(zx + Math.min(0, L2), yy + 1, Math.abs(L2), 22);
    });
    a.txt(st.modo === 'gira' && st.des === 0
      ? 'Mueve ωt: no se mueven.'
      : (st.modo === 'gira' ? 'El marco va desalineado ' + nf(st.des, 0) + '°.' : 'Marco quieto: vuelven a oscilar.'),
      bx, by + 106, C.muted, 11.5);
    a.html('i_a = <b>' + nf(i3[0]) + '</b> · i_b = <b>' + nf(i3[1]) + '</b> · i_c = <b>' + nf(i3[2]) + '</b> A  →  '
      + 'i_α = <b>' + nf(al) + '</b> · i_β = <b>' + nf(be) + '</b> A  →  i_d = <b>' + nf(id) + '</b> · i_q = <b>' + nf(iq) + '</b> A<br>'
      + '<b>Clarke</b> cambia tres magnitudes ligadas (suman cero) por dos independientes: i_α = ⅔(i_a − i_b/2 − i_c/2), '
      + 'i_β = (1/√3)(i_b − i_c). El vector espacial tiene módulo Î = ' + nf(Math.hypot(al, be)) + ' A y gira a velocidad constante.<br>'
      + '<b>Park</b> se sube a ese vector que gira: mueve ωt y verás que i_d e i_q <b>no cambian</b>. Tres senoides se han '
      + 'convertido en dos valores continuos, y por eso se puede regular la máquina con reguladores PI como en continua.');
  }
});

/* =============================================================== T6
   Control V/f de la máquina asíncrona                               */
SIMS.vhz = el => build(el, {
  w: 680, h: 430,
  sliders: [{ k: 'f', v: 50, min: 5, max: 80, step: 1, l: 'Frecuencia de salida f', u: 'Hz' },
            { k: 'Vn', v: 230, min: 100, max: 400, step: 5, l: 'Tensión nominal (por fase)', u: 'V' },
            { k: 'boost', v: 0, min: 0, max: 40, step: 1, l: 'Refuerzo a baja frecuencia', u: 'V' },
            { k: 'Rs', v: 0.3, min: 0, max: 1, step: 0.05, l: 'R_s', u: 'Ω' },
            { k: 'Rr', v: 0.3, min: 0.1, max: 1, step: 0.05, l: "R'_r", u: 'Ω' },
            { k: 'X50', v: 1.2, min: 0.4, max: 3, step: 0.1, l: 'X de dispersión a 50 Hz', u: 'Ω' }],
  selects: [{ k: 'p', v: '2', l: 'Pares de polos', opts: [['1', '1 par (2 polos)'], ['2', '2 pares (4 polos)'], ['3', '3 pares (6 polos)']] }],
  draw(a) {
    const st = a.st, S = nxPal(a), p = +st.p, fn = 50;
    const Vde = f => Math.min(st.Vn, st.boost + (st.Vn / fn) * f);
    const par = (f, s) => { if (s <= 0) return 0;
      const X = st.X50 * f / fn, ws = 2 * Math.PI * f / p, V = Vde(f);
      return (3 / ws) * V * V * (st.Rr / s) / (Math.pow(st.Rs + st.Rr / s, 2) + X * X); };
    const ns = f => 60 * f / p;
    a.clear();
    const nmax = 60 * 80 / p;
    const Tcresta = f => { const X = st.X50 * f / fn, ws = 2 * Math.PI * f / p, V = Vde(f);
      return (3 / (2 * ws)) * V * V / (st.Rs + Math.sqrt(st.Rs * st.Rs + X * X)); };
    let Tm = 0; [10, 20, 30, 40, 50, 60, 70, 80].forEach(f => { if (f <= 80) Tm = Math.max(Tm, Tcresta(f)); });
    Tm = Math.max(Tm, Tcresta(st.f)) * 1.15;
    const paso = Tm > 400 ? 200 : (Tm > 200 ? 100 : (Tm > 80 ? 50 : 20)), yts = [];
    for (let v = paso; v < Tm; v += paso) yts.push(v);
    const P = nxPlot(a, { x: 66, y: 26, w: 420, h: 350, xmin: 0, xmax: nmax, ymin: 0, ymax: Tm,
                          xlab: 'n (rpm)', ylab: 'T (N·m)', nx: 6, ny: 4,
                          xt: [1, 2, 3, 4, 5].map(k => Math.round(nmax * k / 6)), yt: yts });
    const curva = f => { const o = []; for (let k = 1; k <= 240; k++) { const s = Math.pow(k / 240, 1.6); o.push([ns(f) * (1 - s), par(f, s)]); } return o; };
    [10, 20, 30, 40, 50, 60, 70].forEach(f => { if (Math.abs(f - st.f) > 2) nxCurva(a, P, curva(f), C.grid, 1.6); });
    nxCurva(a, P, curva(st.f), S.rojo, 2.8);
    const smax = st.Rr / Math.sqrt(st.Rs * st.Rs + Math.pow(st.X50 * st.f / fn, 2));
    const Tmax = Tcresta(st.f);
    a.circ(P.X(ns(st.f) * (1 - smax)), P.Y(Tmax), 5.5, C.text, true);
    a.circ(P.X(ns(st.f) * (1 - smax)), P.Y(Tmax), 9, C.text, false);
    a.txt('T_max', P.X(ns(st.f) * (1 - smax)) - 12, P.Y(Tmax) - 14, C.text, 11.5, 'right');
    a.line(P.X(ns(st.f)), P.L.y, P.X(ns(st.f)), P.L.y + P.L.h, S.azul, 1.4, [5, 3]);
    a.txt('n_s = ' + nf(ns(st.f), 0), P.X(ns(st.f)) + 5, P.L.y + 14, S.azul, 11.5);
    // tension aplicada
    const bx = 508, by = 60;
    a.txt('Tensión que aplica', bx, by - 14, C.text, 12.5);
    const Pv = nxPlot(a, { x: bx, y: by, w: 140, h: 110, xmin: 0, xmax: 80, ymin: 0, ymax: st.Vn * 1.15,
                           nx: 4, ny: 3, xlab: 'f (Hz)' });
    const cv = []; for (let k = 0; k <= 80; k++) cv.push([k, Vde(k)]);
    nxCurva(a, Pv, cv, S.verde, 2.4);
    a.circ(Pv.X(st.f), Pv.Y(Vde(st.f)), 5, C.text, true);
    a.txt('V/f constante', bx, by + 142, C.muted, 11);
    a.txt('luego, tensión tope', bx, by + 158, C.muted, 11);
    a.html('f = ' + nf(st.f, 0) + ' Hz · V = <b>' + nf(Vde(st.f), 1) + ' V</b> · V/f = <b>' + nf(Vde(st.f) / st.f) + ' V/Hz</b> · '
      + 'n_s = <b>' + nf(ns(st.f), 0) + ' rpm</b> · s_max = <b>' + nf(smax, 3) + '</b> · T_max = <b>' + nf(Tmax, 1) + ' N·m</b><br>'
      + (st.f <= fn
        ? 'Por debajo de ' + fn + ' Hz se mantiene V/f para que el <b>flujo no cambie</b>, así que la curva de par se '
          + 'traslada casi igual y el par máximo se conserva. '
          + (st.f < 20 && st.boost < 5
            ? 'Pero mira T_max a esta frecuencia: a tensión baja la caída en R_s se come una parte grande de V y el par se hunde. '
              + 'Sube el refuerzo y lo recuperas.'
            : 'El refuerzo compensa la caída en R_s, que a baja frecuencia pesa mucho.')
        : 'Por encima de ' + fn + ' Hz la tensión ya está al tope, así que V/f baja: el flujo se debilita y <b>T_max cae con 1/f²</b>. '
          + 'Es la zona de potencia constante.')
      + '<br>Las curvas grises son las demás frecuencias: el motor asíncrono con variador es una familia de curvas que se desplaza.');
  }
});
/* =============================================================== T2
   Relación de transformación y balance de amperivueltas             */
SIMS.vueltas = el => build(el, {
  w: 680, h: 400,
  sliders: [{ k: 'N1', v: 400, min: 50, max: 800, step: 10, l: 'Espiras del primario N₁', u: '' },
            { k: 'N2', v: 200, min: 50, max: 800, step: 10, l: 'Espiras del secundario N₂', u: '' },
            { k: 'V1', v: 230, min: 50, max: 400, step: 5, l: 'Tensión del primario V₁', u: 'V' },
            { k: 'R', v: 23, min: 2, max: 200, step: 1, l: 'Carga R', u: 'Ω' }],
  draw(a) {
    const st = a.st, S = nxPal(a), g = a.g, rt = st.N1 / st.N2;
    const V2 = st.V1 / rt, I2 = V2 / st.R, I1 = I2 / rt, P = V2 * I2;
    a.clear();
    // núcleo y devanados
    const X = 150, Y = 40, W = 220, H = 170, e = 28;
    g.strokeStyle = C.muted; g.lineWidth = 2; g.strokeRect(X, Y, W, H); g.strokeRect(X + e, Y + e, W - 2 * e, H - 2 * e);
    const bob = (x, n, col) => { const k = Math.max(3, Math.round(n / 50)), paso = (H - 2 * e - 8) / k;
      for (let j = 0; j < k; j++) { const yy = Y + e + 6 + j * paso; a.line(x - 8, yy + 5, x + e + 8, yy - 3, col, 2.4); } };
    bob(X, st.N1, S.rojo); bob(X + W - e, st.N2, S.azul);
    a.txt('N₁ = ' + st.N1, X - 12, Y - 8, S.rojo, 12.5, 'right'); a.txt('N₂ = ' + st.N2, X + W + 12, Y - 8, S.azul, 12.5);
    a.arrow(X + W / 2 - 24, Y + e / 2, X + W / 2 + 24, Y + e / 2, S.morado, 2.2);
    a.txt('mismo flujo Φ', X + W / 2, Y + e + 22, S.morado, 12, 'center');
    a.txt('V₁ = ' + nf(st.V1, 0) + ' V', X - 16, Y + 80, S.rojo, 13, 'right'); a.txt('I₁ = ' + nf(I1) + ' A', X - 16, Y + 100, S.rojo, 13, 'right');
    a.txt('V₂ = ' + nf(V2, 1) + ' V', X + W + 16, Y + 80, S.azul, 13); a.txt('I₂ = ' + nf(I2) + ' A', X + W + 16, Y + 100, S.azul, 13);
    a.txt('R = ' + nf(st.R, 0) + ' Ω', X + W + 16, Y + 124, C.muted, 12);
    // barras comparadas
    const fila = (y, tit, v1, v2, u, d) => { const m = Math.max(v1, v2), w = 210;
      a.txt(tit, 40, y + 16, C.text, 12.5);
      g.fillStyle = S.rojo; g.fillRect(190, y, v1 / m * w, 11); g.fillStyle = S.azul; g.fillRect(190, y + 13, v2 / m * w, 11);
      a.txt(nf(v1, d) + ' ' + u, 196 + v1 / m * w, y + 10, S.rojo, 11.5); a.txt(nf(v2, d) + ' ' + u, 196 + v2 / m * w, y + 23, S.azul, 11.5); };
    fila(250, 'Tensión', st.V1, V2, 'V', 1);
    fila(290, 'Intensidad', I1, I2, 'A', 2);
    fila(330, 'Amperivueltas N·I', st.N1 * I1, st.N2 * I2, 'A·v', 0);
    a.txt('Potencia:  V₁·I₁ = V₂·I₂ = ' + nf(P, 0) + ' W', 40, 384, C.text, 12.5);
    a.html('Relación de transformación r_t = N₁/N₂ = <b>' + nf(rt) + '</b> · V₂ = V₁/r_t = <b>' + nf(V2, 1) + ' V</b> · '
      + 'I₂ = V₂/R = <b>' + nf(I2) + ' A</b> · I₁ = I₂/r_t = <b>' + nf(I1) + ' A</b><br>'
      + 'El mismo flujo abraza las dos bobinas, así que cada espira lleva los mismos voltios: la tensión va <b>con</b> las espiras. '
      + 'La intensidad va <b>al revés</b>, porque los amperivueltas de los dos lados se equilibran: N₁I₁ = N₂I₂ = ' + nf(st.N1 * I1, 0) + ' A·v.<br>'
      + 'Por eso la potencia que entra es la que sale (transformador ideal), y desde el primario la carga se ve como R·r_t² = <b>'
      + nf(st.R * rt * rt, 1) + ' Ω</b>.');
  }
});

/* =============================================================== T3
   Coenergía y par                                                   */
SIMS.coenergia = el => build(el, {
  w: 680, h: 420,
  sliders: [{ k: 'i', v: 8, min: 1, max: 20, step: 0.5, l: 'Intensidad i', u: 'A' },
            { k: 'x', v: 0.5, min: 0, max: 1, step: 0.02, l: 'Posición (0 desalineado · 1 alineado)', u: '' },
            { k: 'ls', v: 0.6, min: 0.3, max: 3, step: 0.05, l: 'Flujo de saturación λ_sat', u: 'Wb' }],
  draw(a) {
    const st = a.st, S = nxPal(a), g = a.g, Lmin = 0.01, Lmax = 0.08, dth = Math.PI / 6;
    const lam = (L, i) => st.ls * Math.tanh(L * i / st.ls);
    const Wc = (L, i) => st.ls * st.ls / L * Math.log(Math.cosh(L * i / st.ls));
    const L = Lmin + (Lmax - Lmin) * st.x, K = (Lmax - Lmin) / dth, u = L * st.i / st.ls;
    const T = (-(st.ls * st.ls / (L * L)) * Math.log(Math.cosh(u)) + (st.ls * st.i / L) * Math.tanh(u)) * K;
    const Tlin = 0.5 * st.i * st.i * K, lm = lam(L, st.i), wc = Wc(L, st.i), wf = lm * st.i - wc;
    a.clear();
    const ytop = Math.max(0.2, Math.min(st.ls, Lmax * 20) * 1.12);
    const P = nxPlot(a, { x: 66, y: 28, w: 400, h: 320, xmin: 0, xmax: 20, ymin: 0, ymax: ytop,
                          xlab: 'i (A)', ylab: 'λ (Wb)', nx: 4, ny: 4, xt: [5, 10, 15, 20] });
    const cur = Lx => { const o = []; for (let k = 0; k <= 100; k++) { const i = k / 5; o.push([i, lam(Lx, i)]); } return o; };
    // áreas: coenergía (bajo la curva) y energía (entre la curva y λ)
    g.save(); g.beginPath(); g.rect(P.L.x, P.L.y, P.L.w, P.L.h); g.clip();
    g.globalAlpha = .28; g.fillStyle = S.azul; g.beginPath(); g.moveTo(P.X(0), P.Y(0));
    for (let k = 0; k <= 60; k++) { const i = st.i * k / 60; g.lineTo(P.X(i), P.Y(lam(L, i))); }
    g.lineTo(P.X(st.i), P.Y(0)); g.closePath(); g.fill();
    g.fillStyle = S.naranja; g.beginPath(); g.moveTo(P.X(0), P.Y(0));
    for (let k = 0; k <= 60; k++) { const i = st.i * k / 60; g.lineTo(P.X(i), P.Y(lam(L, i))); }
    g.lineTo(P.X(0), P.Y(lm)); g.closePath(); g.fill(); g.restore();
    nxCurva(a, P, cur(Lmin), C.muted, 1.5, [5, 4]); nxCurva(a, P, cur(Lmax), C.muted, 1.5, [5, 4]);
    nxCurva(a, P, cur(L), C.text, 2.8);
    a.txt('alineado', P.X(20) - 4, P.Y(lam(Lmax, 20)) - 8, C.muted, 11, 'right');
    a.txt('desalineado', P.X(20) - 4, P.Y(lam(Lmin, 20)) - 8, C.muted, 11, 'right');
    a.circ(P.X(st.i), P.Y(lm), 6, C.text, true);
    nxLeyenda(a, 486, 60, [[S.azul, "coenergía W'"], [S.naranja, 'energía W_f']]);
    a.txt("W' = " + nf(wc) + ' J', 486, 116, S.azul, 12.5); a.txt('W_f = ' + nf(wf) + ' J', 486, 136, S.naranja, 12.5);
    a.txt('Par = ∂W′/∂θ', 486, 180, C.text, 12.5);
    const w = 150, m = Math.max(Tlin, 0.01);
    g.fillStyle = C.grid; g.fillRect(486, 192, w, 14); g.fillStyle = S.rojo; g.fillRect(486, 192, T / m * w, 14);
    a.txt(nf(T) + ' N·m', 486, 226, S.rojo, 13);
    a.txt('sin saturar: ' + nf(Tlin) + ' N·m', 486, 246, C.muted, 11.5);
    a.html('λ = <b>' + nf(lm, 3) + ' Wb</b> · coenergía W′ = ∫λ·di = <b>' + nf(wc) + ' J</b> · energía W_f = ∫i·dλ = <b>' + nf(wf) + ' J</b> · '
      + 'par T = ∂W′/∂θ = <b>' + nf(T) + ' N·m</b><br>'
      + 'Mueve la posición: la curva sube del tramo desalineado al alineado y <b>el par es lo que crece el área azul por cada radián</b>, a corriente constante. '
      + 'Con el circuito lineal las dos áreas son iguales y T = ½·i²·dL/dθ = ' + nf(Tlin) + ' N·m.<br>'
      + (T < 0.9 * Tlin ? 'Aquí el hierro satura: la curva se tumba, la coenergía supera a la energía y el par real se queda en el <b>'
          + nf(100 * T / Tlin, 0) + ' %</b> del lineal. Con saturación hay que usar la coenergía, no ½Li².'
        : 'Sube la intensidad o baja λ_sat y verás que con saturación las dos áreas dejan de coincidir.'));
  }
});

/* =============================================================== T7
   Plano i_d - i_q: límites de corriente y de tensión                */
SIMS.idiq = el => build(el, {
  w: 680, h: 430,
  sliders: [{ k: 'id', v: 0, min: -60, max: 20, step: 1, l: 'i_d', u: 'A' },
            { k: 'iq', v: 40, min: 0, max: 60, step: 1, l: 'i_q', u: 'A' },
            { k: 'n', v: 2000, min: 200, max: 6000, step: 50, l: 'Velocidad n', u: 'rpm' },
            { k: 'r', v: 1, min: 1, max: 3, step: 0.1, l: 'Saliencia L_q / L_d', u: '' }],
  draw(a) {
    const st = a.st, S = nxPal(a), g = a.g, p = 4, psi = 0.1, Ld = 1e-3, Lq = Ld * st.r, Imax = 50, Vmax = 100;
    const we = p * 2 * Math.PI * st.n / 60, T = 1.5 * p * (psi * st.iq + (Ld - Lq) * st.id * st.iq);
    const I = Math.hypot(st.id, st.iq), V = we * Math.hypot(psi + Ld * st.id, Lq * st.iq);
    const okI = I <= Imax + 1e-9, okV = V <= Vmax + 1e-9;
    a.clear();
    const P = nxPlot(a, { x: 60, y: 26, w: 400, h: 330, xmin: -120, xmax: 40, ymin: -6, ymax: 126,
                          xlab: 'i_d (A)', ylab: 'i_q (A)', nx: 8, ny: 6, xt: [-100, -50], yt: [50, 100] });
    const elip = (rx, ry, cx0, col, wd, dash) => { const o = []; for (let k = 0; k <= 180; k++) { const t = k / 180 * 2 * Math.PI; o.push([cx0 + rx * Math.cos(t), ry * Math.sin(t)]); } nxCurva(a, P, o, col, wd, dash); };
    elip(Imax, Imax, 0, S.azul, 2.4);
    const lim = Vmax / we;                                      // flujo máximo que deja la tensión
    elip(lim / Ld, lim / Lq, -psi / Ld, S.rojo, 2.4);
    [0.5, 2].forEach(f => elip(lim / f / Ld, lim / f / Lq, -psi / Ld, S.rojo, 1, [4, 4]));
    // MTPA
    const mt = []; for (let k = 0; k <= 60; k++) { const iq = k; const dL = Lq - Ld;
      mt.push([dL > 1e-9 ? (psi - Math.sqrt(psi * psi + 4 * dL * dL * iq * iq)) / (2 * dL) : 0, iq]); }
    nxCurva(a, P, mt, S.verde, 2, [7, 4]);
    a.circ(P.X(-psi / Ld), P.Y(0), 4, S.rojo, true); a.txt('centro −ψ_m/L_d', P.X(-psi / Ld), P.Y(0) - 10, S.rojo, 11, 'center');
    a.circ(P.X(st.id), P.Y(st.iq), 6.5, C.text, true); a.circ(P.X(st.id), P.Y(st.iq), 10.5, (okI && okV) ? S.verde : S.rojo, false);
    nxLeyenda(a, 480, 50, [[S.azul, 'límite de corriente'], [S.rojo, 'límite de tensión'], [S.verde, 'máximo par por amperio']]);
    a.txt('a ' + nf(st.n, 0) + ' rpm', 506, 104, C.muted, 11);
    a.txt('T = ' + nf(T, 1) + ' N·m', 480, 150, C.text, 14);
    a.txt('|I| = ' + nf(I, 1) + ' / ' + Imax + ' A', 480, 176, okI ? C.text : S.rojo, 12.5);
    a.txt('|V| = ' + nf(V, 1) + ' / ' + Vmax + ' V', 480, 196, okV ? C.text : S.rojo, 12.5);
    a.txt((okI && okV) ? 'Punto alcanzable' : 'Punto NO alcanzable', 480, 226, (okI && okV) ? S.verde : S.rojo, 13);
    a.html('T = (3/2)·p·[ψ_m·i_q + (L_d − L_q)·i_d·i_q] = <b>' + nf(T, 1) + ' N·m</b> · |I| = <b>' + nf(I, 1) + ' A</b> · '
      + '|V| = ω_e·√((ψ_m + L_d·i_d)² + (L_q·i_q)²) = <b>' + nf(V, 1) + ' V</b><br>'
      + 'El punto tiene que caer <b>dentro del círculo azul</b> (el inversor no da más corriente) y <b>dentro de la elipse roja</b> (no da más tensión). '
      + 'Sube la velocidad: la elipse se encoge hacia su centro y acaba dejando fuera el eje i_d = 0. '
      + 'Para seguir hay que meter <b>i_d negativa</b>, que resta flujo al imán: eso es el debilitamiento de campo.<br>'
      + (st.r > 1.05 ? 'Con saliencia (L_q > L_d) una i_d negativa además da par de reluctancia, y por eso la curva verde se tuerce a la izquierda.'
                     : 'Sin saliencia el par sólo depende de i_q, así que lo óptimo a baja velocidad es i_d = 0 (la recta verde).'));
  }
});

/* =============================================================== T8
   Reluctancia conmutada: reparto de fases y rizado de par           */
SIMS.conmutacion = el => build(el, {
  w: 680, h: 440,
  sliders: [{ k: 'on', v: 0, min: 0, max: 30, step: 1, l: 'Ángulo de encendido θ_on', u: '°' },
            { k: 'dur', v: 30, min: 5, max: 60, step: 1, l: 'Duración de la conducción', u: '°' },
            { k: 'i', v: 10, min: 2, max: 20, step: 0.5, l: 'Corriente de fase', u: 'A' }],
  selects: [{ k: 'm', v: '3', l: 'Máquina', opts: [['3', '6/4 · tres fases'], ['4', '8/6 · cuatro fases']] }],
  draw(a) {
    const st = a.st, S = nxPal(a), g = a.g, m = +st.m, per = m === 3 ? 90 : 60, sub = m === 3 ? 30 : 20;
    const Lmin = 0.01, Lmax = 0.08, K = (Lmax - Lmin) / (sub * Math.PI / 180), COL = [S.azul, S.naranja, S.verde, S.morado];
    const top = sub + per / 9, baj = top + sub;                 // sube, meseta, baja, valle
    const loc = (th, k) => (((th - k * per / m) % per) + per) % per;
    const Lde = t => t < sub ? Lmin + (Lmax - Lmin) * t / sub : t < top ? Lmax : t < baj ? Lmax - (Lmax - Lmin) * (t - top) / sub : Lmin;
    const pend = t => t < sub ? K : t < top ? 0 : t < baj ? -K : 0;
    const cond = t => t >= st.on && t < st.on + st.dur;
    const Tk = (th, k) => { const t = loc(th, k); return cond(t) ? 0.5 * st.i * st.i * pend(t) : 0; };
    const Tt = th => { let s = 0; for (let k = 0; k < m; k++) s += Tk(th, k); return s; };
    let med = 0, mn = 1e9, mx = -1e9; const N = 900;
    for (let j = 0; j < N; j++) { const v = Tt(j / N * per); med += v / N; mn = Math.min(mn, v); mx = Math.max(mx, v); }
    a.clear();
    const X0 = 60, WW = 580;
    const P1 = nxPlot(a, { x: X0, y: 26, w: WW, h: 96, xmin: 0, xmax: per, ymin: 0, ymax: 0.095, nx: 6, ny: 2 });
    a.txt('Inductancia de cada fase L(θ)', X0, 18, C.text, 12.5);
    for (let k = 0; k < m; k++) { const o = []; for (let j = 0; j <= 360; j++) { const th = j / 360 * per; o.push([th, Lde(loc(th, k))]); } nxCurva(a, P1, o, COL[k], 2.2); }
    // ventanas de conducción
    a.txt('Qué fase conduce', X0, 150, C.text, 12.5);
    for (let k = 0; k < m; k++) { const y = 158 + k * 13;
      for (let j = 0; j < 360; j++) { const th = j / 360 * per; if (cond(loc(th, k))) { g.fillStyle = COL[k]; g.fillRect(X0 + j / 360 * WW, y, WW / 360 + .6, 9); } } }
    const Tm = 0.5 * st.i * st.i * K * 2.3, y3 = 158 + m * 13 + 34;
    const P3 = nxPlot(a, { x: X0, y: y3, w: WW, h: 150, xmin: 0, xmax: per, ymin: -Tm * 0.5, ymax: Tm, nx: 6, ny: 3,
                           xt: [per / 3, 2 * per / 3], xsuf: '°' });
    a.txt('Par de cada fase y par total', X0, y3 - 10, C.text, 12.5);
    for (let k = 0; k < m; k++) { const o = []; for (let j = 0; j <= 720; j++) { const th = j / 720 * per; o.push([th, Tk(th, k)]); } nxCurva(a, P3, o, COL[k], 1.4); }
    const tot = []; for (let j = 0; j <= 720; j++) { const th = j / 720 * per; tot.push([th, Tt(th)]); }
    nxCurva(a, P3, tot, C.text, 2.8);
    nxCurva(a, P3, [[0, med], [per, med]], S.rojo, 1.4, [6, 4]);
    a.txt('media ' + nf(med) + ' N·m', X0 + WW - 4, P3.Y(med) - 6, S.rojo, 11.5, 'right');
    const riz = med > 1e-6 ? 100 * (mx - mn) / med : 0;
    a.html('Par de una fase: T = ½·i²·dL/dθ · par medio = <b>' + nf(med) + ' N·m</b> · rizado (máx − mín)/media = <b>' + nf(riz, 0) + ' %</b><br>'
      + 'El par no depende del signo de la corriente, sólo de <b>si L sube o baja</b> mientras la fase conduce: con L subiendo empuja, con L bajando frena. '
      + (mn < -1e-6 ? '<b>Ahora mismo una fase sigue conduciendo cuando su inductancia ya baja</b> y da par negativo: apágala antes.'
        : riz < 5 ? 'Con este reparto cada fase releva a la anterior justo a tiempo y el par sale liso.'
        : 'Los huecos y los solapes entre fases son los que hacen el rizado: es el punto débil de esta máquina y por eso el control cuida tanto los ángulos.')
      + '<br>Aquí cada fase tiene ' + sub + '° de subida de inductancia y las fases van desplazadas ' + nf(per / m, 0) + '°.');
  }
});
/* ---- fin nuevos sims ---- */
document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
