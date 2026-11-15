/* Figuras interactivas de Física I. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#0d6e5a';C.b=v('--warn')||'#b2482a';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.ok=C.c;}
const F = n=>Number.isInteger(n)?String(n):n.toFixed(2).replace('.',',');

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{
    st[s.k]=s.v;
    const lab=document.createElement('label');
    const sp=document.createElement('span'); sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input'); inp.type='range'; inp.min=s.min; inp.max=s.max; inp.step=s.step||0.01; inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value); sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`; spec.onchange&&spec.onchange(st);};
    lab.append(sp,inp); ctrls.append(lab);
  });
  (spec.selects||[]).forEach(s=>{
    st[s.k]=s.v;
    const lab=document.createElement('label'); const sp=document.createElement('span'); sp.textContent=s.l;
    const sel=document.createElement('select'); s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value; spec.onchange&&spec.onchange(st);}; lab.append(sp,sel); ctrls.append(lab);
  });
  if(spec.button){const b=document.createElement('button');b.textContent=spec.button.l;b.onclick=()=>spec.button.f(st);ctrls.append(b);}
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,t:0,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();
      const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    rect(x,y,w,h,col){g.fillStyle=col;g.fillRect(x,y,w,h);},
    html(h){out.innerHTML=h;}
  };
  let raf; function loop(ts){api.t=ts/1000; spec.draw(api); raf=requestAnimationFrame(loop);}
  if(spec.animate){raf=requestAnimationFrame(loop);} else {spec.draw(api); spec.onchange=()=>spec.draw(api);}
  if(spec.animate) spec.onchange=s=>{spec.reset&&spec.reset(api);};
  return api;
}

const SIMS={};

/* 1. Vectores: producto escalar y vectorial */
SIMS.vectores=el=>build(el,{sliders:[
  {k:'ax',l:'Ax',v:3,min:-5,max:5,step:0.1},{k:'ay',l:'Ay',v:1,min:-5,max:5,step:0.1},
  {k:'bx',l:'Bx',v:1,min:-5,max:5,step:0.1},{k:'by',l:'By',v:3,min:-5,max:5,step:0.1}],
  draw(a){a.clear();const s=a.st,cx=a.W/2,cy=a.H/2,u=28;
    for(let i=-6;i<=6;i++){a.line(cx+i*u,0,cx+i*u,a.H,C.grid);a.line(0,cy+i*u,a.W,cy+i*u,C.grid);}
    a.line(0,cy,a.W,cy,C.muted);a.line(cx,0,cx,a.H,C.muted);
    // paralelogramo
    a.g.fillStyle='rgba(44,138,82,0.22)';a.g.beginPath();a.g.moveTo(cx,cy);a.g.lineTo(cx+s.ax*u,cy-s.ay*u);a.g.lineTo(cx+(s.ax+s.bx)*u,cy-(s.ay+s.by)*u);a.g.lineTo(cx+s.bx*u,cy-s.by*u);a.g.closePath();a.g.fill();
    a.arrow(cx,cy,cx+s.ax*u,cy-s.ay*u,C.a);a.txt('A',cx+s.ax*u+6,cy-s.ay*u-6,C.a,15);
    a.arrow(cx,cy,cx+s.bx*u,cy-s.by*u,C.b);a.txt('B',cx+s.bx*u+6,cy-s.by*u-6,C.b,15);
    const dot=s.ax*s.bx+s.ay*s.by, cr=s.ax*s.by-s.ay*s.bx, ma=Math.hypot(s.ax,s.ay), mb=Math.hypot(s.bx,s.by);
    const th=(ma&&mb)?Math.acos(Math.max(-1,Math.min(1,dot/(ma*mb))))*180/Math.PI:0;
    a.txt('El área verde = |A×B|',12,20,C.c,13);
    a.html(`<b>A·B</b> = ${F(dot)} &nbsp; <b>|A×B|</b> = ${F(Math.abs(cr))} (componente z: ${F(cr)}) &nbsp; <b>θ</b> = ${F(th)}° &nbsp; |A| = ${F(ma)}, |B| = ${F(mb)}<br>
    <span class="hint">Pon A y B perpendiculares y verás A·B = 0; ponlos paralelos y el área (producto vectorial) se anula.</span>`);}});

/* 2. Cinemática: tiro parabólico */
SIMS.tiro=el=>build(el,{animate:true,sliders:[{k:'v',l:'v₀',v:20,min:5,max:40,step:0.5,u:'m/s'},{k:'th',l:'ángulo',v:45,min:5,max:85,step:1,u:'°'}],
  button:{l:'Lanzar',f(s){s._t0=performance.now()/1000;}},
  reset(a){a.st._t0=performance.now()/1000;},
  draw(a){a.clear();const s=a.st,g9=9.8,th=s.th*Math.PI/180,vx=s.v*Math.cos(th),vy=s.v*Math.sin(th);
    const T=2*vy/g9,R=vx*T,Hm=vy*vy/(2*g9);const sc=Math.min((a.W-60)/Math.max(R,10),(a.H-60)/Math.max(Hm,5));
    const ox=30,oy=a.H-30;a.line(ox,oy,a.W-10,oy,C.muted);a.line(ox,oy,ox,10,C.muted);
    a.g.strokeStyle=C.muted;a.g.setLineDash([4,4]);a.g.beginPath();for(let i=0;i<=60;i++){const t=T*i/60;const x=ox+vx*t*sc,y=oy-(vy*t-0.5*g9*t*t)*sc;i?a.g.lineTo(x,y):a.g.moveTo(x,y);}a.g.stroke();a.g.setLineDash([]);
    if(s._t0==null)s._t0=a.t;let t=Math.min(a.t-s._t0,T);if(t<0)t=0;
    const x=ox+vx*t*sc,y=oy-(vy*t-0.5*g9*t*t)*sc;a.circ(x,y,7,C.e,true);
    const k=4;a.arrow(x,y,x+vx*k,y,C.a);a.arrow(x,y,x,y-(vy-g9*t)*k,C.b);a.arrow(x,y,x+vx*k,y-(vy-g9*t)*k,C.c);
    a.txt('vx (constante)',x+vx*k+4,y+4,C.a,11);a.txt('vy',x+4,y-(vy-g9*t)*k-4,C.b,11);
    a.html(`Alcance <b>R = v₀² sin2θ / g = ${F(R)} m</b> · Altura máx. <b>${F(Hm)} m</b> · Tiempo de vuelo <b>${F(T)} s</b> · t = ${F(t)} s<br><span class="hint">La componente horizontal de la velocidad no cambia; la vertical disminuye 9,8 m/s cada segundo. Prueba 30° y 60°: mismo alcance.</span>`);}});

/* 3. Dinámica: plano inclinado */
SIMS.plano=el=>build(el,{sliders:[{k:'th',l:'inclinación',v:30,min:0,max:60,step:1,u:'°'},{k:'mu',l:'μ dinámico',v:0.2,min:0,max:1,step:0.01},{k:'m',l:'masa',v:5,min:1,max:20,step:0.5,u:'kg'}],
  draw(a){a.clear();const s=a.st,g9=9.8,th=s.th*Math.PI/180;
    const ox=60,oy=a.H-40,L=420;const tx=ox+L,ty=oy-L*Math.tan(th);
    a.g.fillStyle=C.grid;a.g.beginPath();a.g.moveTo(ox,oy);a.g.lineTo(tx,oy);a.g.lineTo(tx,ty);a.g.closePath();a.g.fill();
    // bloque en el punto medio
    const bx=(ox+tx)/2,by=(oy+ty)/2,bw=50,bh=30;a.g.save();a.g.translate(bx,by);a.g.rotate(-th);a.rect(-bw/2,-bh,bw,bh,C.a);a.g.restore();
    const cxp=bx+ (bh/2)*Math.sin(th), cyp=by-(bh/2)*Math.cos(th);
    const N=s.m*g9*Math.cos(th),P=s.m*g9,Fr=s.mu*N,k=6/s.m*1.2;
    a.arrow(cxp,cyp,cxp,cyp+P*k,C.e);a.txt('P = mg',cxp+6,cyp+P*k,C.e,12);
    a.arrow(cxp,cyp,cxp+N*k*Math.sin(th),cyp-N*k*Math.cos(th),C.c);a.txt('N',cxp+N*k*Math.sin(th)+6,cyp-N*k*Math.cos(th),C.c,12);
    a.arrow(cxp,cyp,cxp+Fr*k*Math.cos(th),cyp-Fr*k*Math.sin(th),C.d);if(Fr>0.1)a.txt('Fr',cxp+Fr*k*Math.cos(th)+6,cyp-Fr*k*Math.sin(th)-4,C.d,12);
    const acc=g9*(Math.sin(th)-s.mu*Math.cos(th));
    a.html(`N = mg cosθ = <b>${F(N)} N</b> · Fr = μN = <b>${F(Fr)} N</b> · a = g(sinθ − μcosθ) = <b>${acc>0?F(acc)+' m/s²':'0 (no desliza: mg sinθ ≤ μ mg cosθ)'}</b><br><span class="hint">Cambia la masa: la aceleración no varía. Cambia μ hasta que a = 0: ocurre cuando tanθ = μ.</span>`);}});

/* 4. Energía: bola en una pista */
SIMS.energia=el=>build(el,{animate:true,sliders:[{k:'h',l:'altura inicial',v:4,min:1,max:6,step:0.1,u:'m'},{k:'mu',l:'rozamiento (pérdida/m)',v:0,min:0,max:0.3,step:0.01}],
  reset(a){a.st._x=0;a.st._dir=1;},
  draw(a){a.clear();const s=a.st,g9=9.8,m=1;if(s._x==null){s._x=0;s._dir=1;}
    const ox=40,W=a.W-80,base=a.H-110,sc=22;const y=x=>{const u=x/W;return s.h*Math.pow(2*u-1,2);};
    a.g.strokeStyle=C.muted;a.g.lineWidth=3;a.g.beginPath();for(let i=0;i<=100;i++){const px=ox+W*i/100,py=base-y(W*i/100)*sc;i?a.g.lineTo(px,py):a.g.moveTo(px,py);}a.g.stroke();
    const E0=m*g9*s.h;let Ep=m*g9*y(s._x),lost=(s._lost||0),Ec=Math.max(0,E0-Ep-lost);
    const v=Math.sqrt(2*Ec/m);const dx=Math.max(0.6,v)*s._dir*2.2;s._x+=dx;s._lost=lost+s.mu*Math.abs(dx)/sc*m*g9*0.5;
    if(s._x>W){s._x=W;s._dir=-1;}if(s._x<0){s._x=0;s._dir=1;}
    if(Ec<=0.05&&Math.abs(y(s._x)-s.h)<0.05){s._dir*=-1;} // retorno
    if(s._lost>=E0*0.999){s._lost=E0;}
    const px=ox+s._x,py=base-y(s._x)*sc;a.circ(px,py-9,9,C.e,true);
    // barras
    const bx=a.W-200,by=a.H-20,bh=80;const bar=(i,val,col,l)=>{const h=bh*val/E0;a.rect(bx+i*55,by-h,40,h,col);a.txt(l,bx+i*55+20,by+14,C.muted,11,'center');};
    bar(0,Ec,C.a,'Ec');bar(1,Ep,C.b,'Ep');bar(2,lost,C.d,'perdida');
    a.html(`E total = mgh₀ = <b>${F(E0)} J</b> · Ec = <b>${F(Ec)} J</b> · Ep = <b>${F(Ep)} J</b> · v = <b>${F(v)} m/s</b><br><span class="hint">Sin rozamiento la bola vuelve a la misma altura. Con rozamiento, la energía mecánica se pierde y cada vez sube menos.</span>`);}});

/* 5. MAS: muelle */
SIMS.mas=el=>build(el,{animate:true,sliders:[{k:'k',l:'k',v:50,min:5,max:200,step:1,u:'N/m'},{k:'m',l:'m',v:2,min:0.5,max:10,step:0.1,u:'kg'},{k:'A',l:'A',v:0.1,min:0.02,max:0.2,step:0.005,u:'m'}],
  draw(a){a.clear();const s=a.st,w=Math.sqrt(s.k/s.m),T=2*Math.PI/w,x=s.A*Math.cos(w*a.t);
    const sc=900,cx=160,cy=90;a.rect(20,cy-50,10,100,C.muted);
    const ex=cx+x*sc;a.g.strokeStyle=C.a;a.g.lineWidth=2;a.g.beginPath();a.g.moveTo(30,cy);const n=14;for(let i=1;i<n;i++){const px=30+(ex-30-20)*i/n;a.g.lineTo(px,cy+(i%2?-14:14));}a.g.lineTo(ex-20,cy);a.g.stroke();
    a.rect(ex-20,cy-20,40,40,C.b);a.line(cx,cy-40,cx,cy+40,C.muted,1,[4,4]);a.txt('x = 0',cx,cy-46,C.muted,11,'center');
    // gráfica x(t)
    const gx=20,gy=250,gw=a.W-40,gh=80;a.line(gx,gy,gx+gw,gy,C.muted);a.g.strokeStyle=C.e;a.g.lineWidth=2;a.g.beginPath();
    for(let i=0;i<=gw;i++){const t=a.t-(gw-i)/gw*3*T;const yy=gy-s.A*Math.cos(w*t)/0.2*gh*0.5;i?a.g.lineTo(gx+i,yy):a.g.moveTo(gx+i,yy);}a.g.stroke();
    a.txt('x(t), últimos 3 periodos',gx,gy-gh*0.5-6,C.e,11);
    const v=-s.A*w*Math.sin(w*a.t);
    a.html(`ω = √(k/m) = <b>${F(w)} rad/s</b> · T = <b>${F(T)} s</b> · v_max = Aω = <b>${F(s.A*w)} m/s</b> · E = ½kA² = <b>${F(0.5*s.k*s.A*s.A)} J</b> · x = ${F(x)} m, v = ${F(v)} m/s<br><span class="hint">Sube k y la oscilación se acelera; sube m y se frena. La amplitud no cambia el periodo.</span>`);}});

/* 6. Colisiones 1D */
SIMS.choque=el=>build(el,{animate:true,sliders:[{k:'m1',l:'m₁',v:2,min:0.5,max:10,step:0.5,u:'kg'},{k:'v1',l:'v₁',v:6,min:-5,max:10,step:0.5,u:'m/s'},{k:'m2',l:'m₂',v:4,min:0.5,max:10,step:0.5,u:'kg'},{k:'v2',l:'v₂',v:0,min:-5,max:10,step:0.5,u:'m/s'},{k:'e',l:'e (restitución)',v:0,min:0,max:1,step:0.05}],
  button:{l:'Reiniciar',f(s){s._x1=120;s._x2=420;s._u1=s.v1;s._u2=s.v2;s._hit=false;}},
  reset(a){const s=a.st;s._x1=120;s._x2=420;s._u1=s.v1;s._u2=s.v2;s._hit=false;},
  draw(a){a.clear();const s=a.st;if(s._x1==null){s._x1=120;s._x2=420;s._u1=s.v1;s._u2=s.v2;s._hit=false;}
    const r1=12+s.m1*3,r2=12+s.m2*3,dt=1/60*6;
    s._x1+=s._u1*dt*4;s._x2+=s._u2*dt*4;
    if(!s._hit&&s._x2-s._x1<=r1+r2){s._hit=true;const M=s.m1+s.m2;const u1=s._u1,u2=s._u2;
      s._u1=(s.m1*u1+s.m2*u2-s.m2*s.e*(u1-u2))/M;s._u2=(s.m1*u1+s.m2*u2+s.m1*s.e*(u1-u2))/M;}
    if(s._x1<-60||s._x1>a.W+60||s._x2<-60||s._x2>a.W+60){s._x1=120;s._x2=420;s._u1=s.v1;s._u2=s.v2;s._hit=false;}
    const cy=140;a.line(0,cy+r2,a.W,cy+r2,C.muted);a.circ(s._x1,cy,r1,C.a,true);a.circ(s._x2,cy,r2,C.b,true);
    a.txt('m₁',s._x1,cy+4,'#fff',13,'center');a.txt('m₂',s._x2,cy+4,'#fff',13,'center');
    const M=s.m1+s.m2,p0=s.m1*s.v1+s.m2*s.v2,E0=0.5*s.m1*s.v1**2+0.5*s.m2*s.v2**2;
    const w1=(s.m1*s.v1+s.m2*s.v2-s.m2*s.e*(s.v1-s.v2))/M,w2=(s.m1*s.v1+s.m2*s.v2+s.m1*s.e*(s.v1-s.v2))/M;
    const E1=0.5*s.m1*w1**2+0.5*s.m2*w2**2;
    a.html(`p antes = <b>${F(p0)}</b> = p después = <b>${F(s.m1*w1+s.m2*w2)} kg·m/s</b> · v₁' = <b>${F(w1)}</b>, v₂' = <b>${F(w2)} m/s</b> · Ec: ${F(E0)} → ${F(E1)} J (${F(100*(E0-E1)/Math.max(E0,1e-9))}% perdida)<br><span class="hint">e = 1: choque elástico, se conserva la energía. e = 0: quedan pegados y la pérdida es máxima.</span>`);}});

/* 7. Rodadura: carrera de sólidos */
SIMS.rodadura=el=>build(el,{animate:true,sliders:[{k:'th',l:'inclinación',v:20,min:5,max:45,step:1,u:'°'}],
  button:{l:'Soltar',f(s){s._t0=performance.now()/1000;}},reset(a){a.st._t0=performance.now()/1000;},
  draw(a){a.clear();const s=a.st,g9=9.8,th=s.th*Math.PI/180;if(s._t0==null)s._t0=a.t;const t=Math.max(0,a.t-s._t0);
    const bodies=[['Aro',1,C.d],['Disco',0.5,C.a],['Esfera',0.4,C.c],['Bloque sin rozamiento',0,C.e]];const L=5;
    bodies.forEach((b,i)=>{const acc=g9*Math.sin(th)/(1+b[1]);let d=0.5*acc*t*t;if(d>L)d=L;
      const y0=50+i*75,x0=40,x1=a.W-40;a.line(x0,y0+20,x1,y0+20+ (x1-x0)*Math.tan(th)*0.25,C.muted);
      const u=d/L,px=x0+(x1-x0)*u,py=y0+20+(x1-x0)*Math.tan(th)*0.25*u-14;
      if(b[1]===0)a.rect(px-12,py-10,24,24,b[2]);else{a.circ(px,py,14,b[2],true);const ang=d/0.3;a.line(px,py,px+13*Math.cos(ang),py+13*Math.sin(ang),'#fff',2);}
      a.txt(`${b[0]} (I = ${b[1]} MR²): a = ${F(acc)} m/s²`,x0,y0,b[2],12);});
    a.html(`a = g sinθ / (1 + I/(MR²)). <span class="hint">Cuanto mayor es el momento de inercia, más energía se va a la rotación y más lento baja. El resultado no depende de la masa ni del radio.</span>`);}});

/* 8. Estática: viga con carga */
SIMS.viga=el=>build(el,{sliders:[{k:'L',l:'longitud',v:4,min:2,max:8,step:0.5,u:'m'},{k:'P',l:'peso viga',v:200,min:0,max:500,step:10,u:'N'},{k:'Fc',l:'carga',v:100,min:0,max:500,step:10,u:'N'},{k:'xc',l:'posición carga (fracción)',v:0.25,min:0,max:1,step:0.01}],
  draw(a){a.clear();const s=a.st,x0=70,x1=a.W-70,y=180;a.rect(x0,y-8,x1-x0,16,C.muted);
    a.g.fillStyle=C.c;a.g.beginPath();a.g.moveTo(x0,y+8);a.g.lineTo(x0-14,y+34);a.g.lineTo(x0+14,y+34);a.g.closePath();a.g.fill();a.txt('A (pasador)',x0,y+50,C.c,12,'center');
    a.circ(x1,y+20,12,C.c,true);a.txt('B (rodillo)',x1,y+50,C.c,12,'center');
    const xc=x0+(x1-x0)*s.xc,xm=(x0+x1)/2;
    const RB=(s.P*s.L/2+s.Fc*s.xc*s.L)/s.L,RA=s.P+s.Fc-RB;const k=0.2;
    a.arrow(xc,y-100*0.01*s.Fc*0.8-12,xc,y-12,C.b);a.txt(`F = ${s.Fc} N`,xc,y-100*0.01*s.Fc*0.8-18,C.b,12,'center');
    a.arrow(xm,y,xm,y+s.P*k,C.e);a.txt(`P = ${s.P} N`,xm+6,y+s.P*k+4,C.e,12);
    a.arrow(x0,y+RA*k+40,x0,y+40,C.a);a.txt(`R_A = ${F(RA)} N`,x0+8,y+RA*k+40,C.a,12);
    a.arrow(x1,y+RB*k+40,x1,y+40,C.a);a.txt(`R_B = ${F(RB)} N`,x1-8,y+RB*k+40,C.a,12,'right');
    a.html(`ΣM_A = 0: R_B·L = P·L/2 + F·x → <b>R_B = ${F(RB)} N</b> · ΣF_y = 0: <b>R_A = ${F(RA)} N</b><br><span class="hint">Acerca la carga a B: R_B crece y R_A baja. Con la carga en el centro, ambas reacciones se reparten por igual.</span>`);}});

/* 9. Fluidos: flotación y presión */
SIMS.fluidos=el=>build(el,{sliders:[{k:'rc',l:'densidad cuerpo',v:500,min:100,max:1500,step:10,u:'kg/m³'},{k:'rf',l:'densidad fluido',v:1000,min:600,max:1400,step:10,u:'kg/m³'},{k:'h',l:'profundidad sonda',v:5,min:0,max:10,step:0.1,u:'m'}],
  draw(a){a.clear();const s=a.st,top=80,bot=a.H-20,x0=40,x1=a.W/2-20;
    a.rect(x0,top,x1-x0,bot-top,'rgba(70,82,196,0.22)');
    const frac=Math.min(1,s.rc/s.rf),bw=90,bh=80,bx=(x0+x1)/2-bw/2;const by=frac>=1?top+20:top-bh*(1-frac);
    a.rect(bx,by,bw,bh,C.b);a.line(x0,top,x1,top,C.a,2);
    a.txt(frac>=1?'Se hunde':`Sumergido: ${F(frac*100)} %`,(x0+x1)/2,bot-10,C.text,13,'center');
    // presión vs profundidad
    const gx=a.W/2+40,gy=top,gw=a.W-gx-30,gh=bot-top;a.line(gx,gy,gx,gy+gh,C.muted);a.line(gx,gy+gh,gx+gw,gy+gh,C.muted);
    const pmax=101325+s.rf*9.8*10;a.g.strokeStyle=C.e;a.g.lineWidth=2;a.g.beginPath();a.g.moveTo(gx+gw*101325/pmax,gy);a.g.lineTo(gx+gw,gy+gh);a.g.stroke();
    const p=101325+s.rf*9.8*s.h;const yy=gy+gh*s.h/10;a.circ(gx+gw*p/pmax,yy,5,C.d,true);a.line(gx,yy,gx+gw*p/pmax,yy,C.d,1,[3,3]);
    a.txt('p',gx+gw,gy+gh+14,C.muted,11,'right');a.txt('profundidad',gx-4,gy+gh/2,C.muted,11,'right');
    a.html(`Empuje = ρ_f V g; flota si ρ_c &lt; ρ_f con fracción sumergida ρ_c/ρ_f = <b>${F(frac)}</b> · p(${F(s.h)} m) = p₀ + ρgh = <b>${F(p/1000)} kPa</b><br><span class="hint">La presión crece linealmente con la profundidad. Baja la densidad del fluido y el cuerpo se hunde más.</span>`);}});

/* 10. Gas ideal en un pistón */
SIMS.gas=el=>build(el,{animate:true,sliders:[{k:'T',l:'temperatura',v:300,min:100,max:900,step:10,u:'K'},{k:'V',l:'volumen',v:20,min:8,max:40,step:0.5,u:'L'},{k:'n',l:'moles',v:1,min:0.2,max:3,step:0.1}],
  draw(a){a.clear();const s=a.st;if(!s._p){s._p=[];for(let i=0;i<40;i++)s._p.push({x:Math.random(),y:Math.random(),a:Math.random()*6.28});}
    const x0=40,y0=40,Hb=a.H-80,Wb=Hb*s.V/40*1.6;a.rect(x0,y0,Wb,Hb,C.grid);a.rect(x0+Wb,y0,14,Hb,C.muted);
    const sp=Math.sqrt(s.T)/16;const N=Math.round(s.n*13);
    for(let i=0;i<N;i++){const p=s._p[i];p.x+=Math.cos(p.a)*sp/Wb*8;p.y+=Math.sin(p.a)*sp/Hb*8;if(p.x<0||p.x>1){p.a=Math.PI-p.a;p.x=Math.min(1,Math.max(0,p.x));}if(p.y<0||p.y>1){p.a=-p.a;p.y=Math.min(1,Math.max(0,p.y));}
      a.circ(x0+p.x*Wb,y0+p.y*Hb,4,C.a,true);}
    const P=s.n*8.314*s.T/(s.V/1000);
    const gx=a.W-150,gy=60;a.txt('Manómetro',gx+50,gy-10,C.muted,11,'center');a.circ(gx+50,gy+60,50,C.muted);const ang=Math.PI*0.75+Math.min(1,P/1.2e6)*Math.PI*1.5;a.line(gx+50,gy+60,gx+50+42*Math.cos(ang),gy+60+42*Math.sin(ang),C.d,3);
    a.html(`pV = nRT → <b>p = ${F(P/1000)} kPa</b> (${F(P/101325)} atm) · Energía cinética media por molécula = 3/2 k_B T = <b>${(1.5*1.381e-23*s.T).toExponential(2)} J</b><br><span class="hint">Más temperatura: moléculas más rápidas y más presión. Menos volumen a T fija: más presión (Boyle).</span>`);}});

/* 11. Primer principio: diagrama p-V */
SIMS.pv=el=>build(el,{selects:[{k:'proc',l:'Proceso',v:'isobara',opts:[['isobara','Isobara (p cte)'],['isocora','Isócora (V cte)'],['isoterma','Isoterma (T cte)'],['adiabatica','Adiabática (Q = 0)']]}],
  sliders:[{k:'V2',l:'V final / V inicial',v:2,min:0.5,max:3,step:0.05},{k:'T2',l:'T final (solo isócora)',v:600,min:150,max:900,step:10,u:'K'},{k:'gam',l:'γ',v:1.667,min:1.2,max:1.667,step:0.001}],
  draw(a){a.clear();const s=a.st,n=1,R=8.314,T1=300,V1=0.02,p1=n*R*T1/V1,Cv=R/(s.gam-1);
    let W=0,dU=0,pts=[],T2=T1,V2=V1*s.V2,p2=p1;
    if(s.proc==='isobara'){T2=T1*s.V2;W=p1*(V2-V1);dU=n*Cv*(T2-T1);pts=[[V1,p1],[V2,p1]];}
    else if(s.proc==='isocora'){T2=s.T2;V2=V1;p2=n*R*T2/V1;W=0;dU=n*Cv*(T2-T1);pts=[[V1,p1],[V1,p2]];}
    else if(s.proc==='isoterma'){W=n*R*T1*Math.log(s.V2);dU=0;p2=p1/s.V2;for(let i=0;i<=40;i++){const v=V1+(V2-V1)*i/40;pts.push([v,n*R*T1/v]);}}
    else{p2=p1*Math.pow(V1/V2,s.gam);T2=p2*V2/(n*R);dU=n*Cv*(T2-T1);W=-dU;for(let i=0;i<=40;i++){const v=V1+(V2-V1)*i/40;pts.push([v,p1*Math.pow(V1/v,s.gam)]);}}
    const Q=dU+W;
    const gx=60,gy=30,gw=a.W-100,gh=a.H-90,Vmax=0.065,pmax=p1*3.2;const X=v=>gx+gw*v/Vmax,Y=p=>gy+gh*(1-p/pmax);
    a.line(gx,gy,gx,gy+gh,C.muted);a.line(gx,gy+gh,gx+gw,gy+gh,C.muted);a.txt('V',gx+gw,gy+gh+16,C.muted,12,'right');a.txt('p',gx-14,gy+8,C.muted,12);
    // área = trabajo
    if(s.proc!=='isocora'){a.g.fillStyle='rgba(184,115,12,0.25)';a.g.beginPath();a.g.moveTo(X(pts[0][0]),Y(0));pts.forEach(p=>a.g.lineTo(X(p[0]),Y(p[1])));a.g.lineTo(X(pts[pts.length-1][0]),Y(0));a.g.closePath();a.g.fill();}
    a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();pts.forEach((p,i)=>i?a.g.lineTo(X(p[0]),Y(p[1])):a.g.moveTo(X(p[0]),Y(p[1])));a.g.stroke();
    a.circ(X(V1),Y(p1),5,C.c,true);a.txt('1',X(V1)-14,Y(p1),C.c,13);a.circ(X(V2),Y(p2),5,C.d,true);a.txt('2',X(V2)+8,Y(p2),C.d,13);
    a.txt('Área bajo la curva = W',gx+10,gy+gh-10,C.e,12);
    a.html(`1 mol, T₁ = 300 K, V₁ = 20 L. <b>W = ${F(W)} J</b> · <b>ΔU = nC_vΔT = ${F(dU)} J</b> · <b>Q = ΔU + W = ${F(Q)} J</b> · T₂ = ${F(T2)} K<br><span class="hint">Convención: W es el trabajo que hace el gas (positivo al expandirse). En la isoterma ΔU = 0, así que todo el calor se convierte en trabajo; en la adiabática Q = 0 y el gas se enfría al expandirse.</span>`);}});

/* laboratorio: péndulo */
SIMS.pendulo=el=>build(el,{animate:true,sliders:[{k:'L',l:'longitud',v:1,min:0.2,max:2,step:0.05,u:'m'},{k:'g',l:'g',v:9.8,min:1.6,max:25,step:0.1,u:'m/s²'},{k:'A',l:'amplitud',v:15,min:2,max:40,step:1,u:'°'}],
  draw(a){a.clear();const s=a.st,w=Math.sqrt(s.g/s.L),T=2*Math.PI/w,th=s.A*Math.PI/180*Math.cos(w*a.t);
    const px=a.W/2,py=40,len=s.L*120;const bx=px+len*Math.sin(th),by=py+len*Math.cos(th);
    a.line(px-40,py,px+40,py,C.muted,4);a.line(px,py,px,py+len+30,C.muted,1,[4,4]);a.line(px,py,bx,by,C.text,2);a.circ(bx,by,12,C.b,true);
    a.html(`T = 2π√(L/g) = <b>${F(T)} s</b> · f = ${F(1/T)} Hz<br><span class="hint">En el laboratorio mides T y L y despejas g = 4π²L/T². Duplicar L no duplica T: lo multiplica por √2. La amplitud (pequeña) no cambia el periodo.</span>`);}});

/* ---- Plano inclinado con rozamiento: energía paso a paso (m = 2 kg, 30°, h = 5 m, μ = 0,2) ---- */
SIMS.energiaPaso=el=>build(el,{w:640,h:360,
 sliders:[{k:'paso',v:0,min:0,max:7,step:1,l:'paso del método (0 = datos)',u:''}],
 draw(a){a.clear();const p=a.st.paso;
  const K={Ep:'#2c8a52',Wf:'#c43d63',Ec:'#3a63c4',F:'#b8730c'};
  const T={x:150,y:110}, B={x:462,y:290};
  const ct=Math.cos(Math.PI/6), st=0.5;
  // rampa, suelo y ángulo
  a.line(T.x,T.y,B.x,B.y,C.text,3);
  a.line(T.x,T.y,T.x,B.y,C.muted,1.5,[4,4]);
  a.line(T.x,B.y,B.x,B.y,C.muted,1.5);
  a.txt('θ = 30°',T.x+26,T.y+58,C.muted,13);
  a.txt('h = 5 m',T.x-12,(T.y+B.y)/2,C.muted,13,'right');
  // trayectoria y bloque
  if(p>=0) a.line(T.x+20*ct,T.y+20*st,B.x-30*ct,B.y-30*st,K.Ep,1.5,[6,5]);
  const s0=36, bx=T.x+s0*ct, by=T.y+s0*st;
  a.g.save();a.g.translate(bx,by);a.g.rotate(Math.PI/6);
  a.g.fillStyle=C.bg;a.g.strokeStyle=C.text;a.g.lineWidth=2;a.g.fillRect(-16,-16,32,32);a.g.strokeRect(-16,-16,32,32);
  a.txt('m',0,5,C.text,13,'center');a.g.restore();
  a.txt('d = 10 m',(T.x+B.x)/2+10,(T.y+B.y)/2-14,K.Ep,13,'center');
  // fuerzas en el paso 2 y siguientes
  if(p>=2){
    a.arrow(bx,by,bx-40*ct,by-40*st,K.Wf,2.5);
    a.txt('rozamiento',bx-46*ct-30,by-46*st-6,K.Wf,12);
  }
  // paneles de resultados
  const items=[[60,1,'E_p = m·g·h = 2 · 9,8 · 5 = 98 J',K.Ep],[86,2,'W_roz = −μ·m·g·cosθ·d = −33,9 J',K.Wf],[112,3,'E_c = 98 − 33,9 = 64,1 J',K.Ec],
    [138,4,'v = √(2E_c/m) ≈ 8,0 m/s',C.text],[164,5,'a = g(sinθ − μ·cosθ) ≈ 3,2 m/s²',K.F],[190,6,'v² = 2·a·d ≈ 64 ⇒ v ≈ 8,0 m/s ✓',C.text]];
  a.txt('Balance de energía',340,36,C.text,14);
  items.forEach(([y,k,s,c])=>{if(p>=k)a.txt(s,340,y+40,c,13);});
  // barras de energía (proporcionales a los julios)
  const bars=[['E_p',98,K.Ep,1],['W_roz',33.9,K.Wf,2],['E_c',64.1,K.Ec,3]];
  bars.forEach(([lab,val,col,k],i)=>{
    if(p<k) return;
    const hgt=val*0.9, x=350+i*90, y=350-hgt;
    a.g.fillStyle=col;a.g.globalAlpha=0.7;a.g.fillRect(x,y,50,hgt);a.g.globalAlpha=1;
    a.txt(lab,x+25,y-6,col,12,'center');
  });
  const T2=[
   'Bloque de m = 2 kg que desliza desde el reposo por un plano de 30° con altura h = 5 m (d = h/sen 30° = 10 m) y μ = 0,2. Pregunta: su velocidad al pie.',
   'Energía inicial: solo potencial, E_p = m·g·h = 2 · 9,8 · 5 = 98 J. Parte del reposo, así que E_c = 0.',
   'El rozamiento disipa energía: su fuerza vale μ·m·g·cosθ ≈ 3,39 N y actúa a lo largo de 10 m, así que W_roz = −33,9 J.',
   'Balance de energía: E_c final = E_p inicial + W_roz = 98 − 33,9 = 64,1 J.',
   'Velocidad al pie: v = √(2·E_c/m) = √64,1 ≈ 8,0 m/s.',
   'Comprobación con dinámica: a = g(sinθ − μ·cosθ) = 9,8 · (0,5 − 0,173) ≈ 3,2 m/s².',
   'Y con cinemática: v² = 2·a·d = 2 · 3,2 · 10 ≈ 64, es decir, v ≈ 8,0 m/s. Coincide con el balance de energía.',
   'Método: energía inicial, trabajo de las fuerzas no conservativas, energía final, velocidad; y se comprueba con la segunda ley de Newton.'
  ];
  a.html(`<div>${T2[p]}</div>`);
 }});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
