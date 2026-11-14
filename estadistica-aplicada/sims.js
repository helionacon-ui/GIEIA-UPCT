/* Figuras interactivas de Estadística Aplicada. Vanilla JS + canvas. */
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

/* ---- Estadística Aplicada: figuras interactivas ---- */
/* --- utilidades estadísticas --- */
const erf=z=>{const t=1/(1+0.3275911*Math.abs(z));const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-z*z);return z>=0?y:-y;};
const pnorm=z=>0.5*(1+erf(z/Math.SQRT2));
const dnorm=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const qnorm=p=>{ // Acklam
  if(p<=0)return -8;if(p>=1)return 8;
  const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.3577518672690,-30.66479806614716,2.506628277459239];
  const b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572];
  const c=[-0.007784894002430293,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783];
  const d=[0.007784695709041462,0.3224671290700398,2.445134137142996,3.754408661907416];
  const pl=0.02425;let q,r;
  if(p<pl){q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  if(p>1-pl){q=Math.sqrt(-2*Math.log(1-p));return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  q=p-0.5;r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);};
const lgamma=x=>{const g=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  if(x<0.5)return Math.log(Math.PI/Math.sin(Math.PI*x))-lgamma(1-x);
  x-=1;let a=0.99999999999980993;const t=x+7.5;
  for(let i=0;i<8;i++)a+=g[i]/(x+i+1);
  return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a);};
const gammap=(a,x)=>{ // P(a,x) incompleta regularizada
  if(x<=0)return 0;
  if(x<a+1){let ap=a,sum=1/a,del=sum;for(let n=1;n<500;n++){ap++;del*=x/ap;sum+=del;if(Math.abs(del)<Math.abs(sum)*1e-12)break;}
    return sum*Math.exp(-x+a*Math.log(x)-lgamma(a));}
  let b=x+1-a,c=1e300,d=1/b,h=d;
  for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-12)break;}
  return 1-Math.exp(-x+a*Math.log(x)-lgamma(a))*h;};
const pchisq=(x,k)=>gammap(k/2,x/2);
const betacf=(a,b,x)=>{let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;
  if(Math.abs(d)<1e-300)d=1e-300;d=1/d;let h=d;
  for(let m=1;m<300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));
    d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));
    d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;
    if(Math.abs(del-1)<1e-12)break;}
  return h;};
const pbeta=(x,a,b)=>{if(x<=0)return 0;if(x>=1)return 1;
  const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x));
  return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b;};
const pt=(t,df)=>{const x=df/(df+t*t);const p=0.5*pbeta(x,df/2,0.5);return t>0?1-p:p;};
const pf=(f,d1,d2)=>f<=0?0:pbeta(d1*f/(d1*f+d2),d1/2,d2/2);
const inv=(cdf,p,lo,hi)=>{for(let i=0;i<200;i++){const m=(lo+hi)/2;cdf(m)<p?lo=m:hi=m;}return (lo+hi)/2;};
const qt=(p,df)=>inv(x=>pt(x,df),p,-100,100);
const qchisq=(p,k)=>inv(x=>pchisq(x,k),p,0,1000);
const qf=(p,d1,d2)=>inv(x=>pf(x,d1,d2),p,0,2000);
const lfact=n=>lgamma(n+1);
const dbinom=(k,n,p)=>Math.exp(lfact(n)-lfact(k)-lfact(n-k)+k*Math.log(p)+(n-k)*Math.log(1-p));
const dpois=(k,l)=>Math.exp(-l+k*Math.log(l)-lfact(k));
const N2=x=>x.toFixed(2).replace('.',',');
const N3=x=>x.toFixed(3).replace('.',',');
const N4=x=>x.toFixed(4).replace('.',',');
const Eje=(a,x0,y0,w,h,xlab,ylab)=>{a.line(x0,y0,x0+w,y0,C.muted,1.5);a.line(x0,y0,x0,y0-h,C.muted,1.5);
  if(xlab)a.txt(xlab,x0+w/2,y0+32,C.muted,12,'center');if(ylab)a.txt(ylab,x0-6,y0-h-10,C.muted,12);};
const Barra=(a,x,y,w,h,frac,col)=>{a.g.fillStyle=C.grid;a.g.fillRect(x,y,w,h);a.g.fillStyle=col;a.g.fillRect(x,y,w*Math.max(0,Math.min(1,frac)),h);};

/* T1 · Descriptiva: histograma, caja y bigotes */
SIMS.descriptiva=el=>build(el,{w:660,h:420,
 selects:[{k:'d',v:'coste',l:'conjunto de datos',opts:[['coste','coste de programas (€)'],['horas','horas semanales de uso'],['piezas','longitud de piezas (mm)']]}],
 sliders:[{k:'out',v:310,min:150,max:500,step:5,l:'valor del dato más grande',u:''}],
 draw(a){a.clear();
  const D={coste:[95,110,118,120,125,130,134,140,150,165],horas:[2,4,5,6,7,7,8,9,11,14],piezas:[48.5,49.2,49.6,49.8,50,50.1,50.3,50.6,51,51.4]};
  const base=D[a.st.d].slice();
  const extra=a.st.d==='coste'?a.st.out:(a.st.d==='horas'?a.st.out/20:a.st.out/6);
  const x=base.concat([extra]).sort((p,q)=>p-q);
  const n=x.length;
  const q=p=>{const h=(n-1)*p, lo=Math.floor(h);return x[lo]+(h-lo)*(x[Math.min(lo+1,n-1)]-x[lo]);};
  const Q1=q(0.25),Me=q(0.5),Q3=q(0.75),RI=Q3-Q1;
  const li=Q1-1.5*RI, ls=Q3+1.5*RI;
  const atip=x.filter(v=>v<li||v>ls);
  const dentro=x.filter(v=>v>=li&&v<=ls);
  const bi=Math.min(...dentro), bs=Math.max(...dentro);
  const m=x.reduce((s,v)=>s+v,0)/n;
  const tau2=x.reduce((s,v)=>s+(v-m)*(v-m),0)/n, S2=tau2*n/(n-1);
  const x0=60,y0=250,wv=560,hv=170;
  const lo=Math.min(...x)*0.92, hi=Math.max(...x)*1.06;
  const px=v=>x0+(v-lo)/(hi-lo)*wv;
  // histograma
  const nb=8, bw=(hi-lo)/nb;
  const cnt=new Array(nb).fill(0);
  x.forEach(v=>{cnt[Math.min(nb-1,Math.floor((v-lo)/bw))]++;});
  const cm=Math.max(...cnt);
  Eje(a,x0,y0,wv,hv,'','frecuencia');
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4;a.line(px(v),y0,px(v),y0+5,C.muted,1);a.txt(N2(v),px(v),y0+18,C.muted,10,'center');}
  for(let i=0;i<nb;i++){const h=cnt[i]/cm*hv*0.9;
    a.g.fillStyle=C.a;a.g.globalAlpha=0.55;a.g.fillRect(px(lo+i*bw)+1,y0-h,wv/nb-2,h);a.g.globalAlpha=1;
    if(cnt[i])a.txt(String(cnt[i]),px(lo+(i+0.5)*bw),y0-h-6,C.muted,11,'center');}
  // caja y bigotes
  const cy=330,ch=46;
  a.line(px(bi),cy,px(Q1),cy,C.text,1.6);a.line(px(Q3),cy,px(bs),cy,C.text,1.6);
  a.line(px(bi),cy-12,px(bi),cy+12,C.text,2);a.line(px(bs),cy-12,px(bs),cy+12,C.text,2);
  a.g.fillStyle=C.bg;a.g.fillRect(px(Q1),cy-ch/2,px(Q3)-px(Q1),ch);
  a.g.strokeStyle=C.a;a.g.lineWidth=2.2;a.g.strokeRect(px(Q1),cy-ch/2,px(Q3)-px(Q1),ch);
  a.line(px(Me),cy-ch/2,px(Me),cy+ch/2,C.a,3);
  atip.forEach(v=>{a.circ(px(v),cy,6,C.warn||C.b,false);a.circ(px(v),cy,2.5,C.b,true);});
  a.line(px(m),cy-ch/2-6,px(m),cy+ch/2+6,C.f,1.6,[4,3]);
  a.txt('media',px(m),cy+ch/2+22,C.f,11,'center');
  [[Q1,'Q₁',-8],[Me,'Me',-26],[Q3,'Q₃',-8]].forEach(d=>a.txt(d[1]+' = '+N2(d[0]),px(d[0]),cy-ch/2+d[2],C.a,11,'center'));
  a.txt(N2(bi),px(bi),cy+28,C.muted,11,'center');a.txt(N2(bs),px(bs),cy+28,C.muted,11,'center');
  // limites teoricos
  [[li,'Q₁−1,5·RI'],[ls,'Q₃+1,5·RI']].forEach(d=>{if(d[0]>lo&&d[0]<hi){a.line(px(d[0]),cy-40,px(d[0]),cy+40,C.c,1.2,[3,3]);a.txt(d[1],px(d[0]),cy+54,C.c,10,'center');}});
  a.html(`n = ${n} · <b>media = ${N2(m)}</b> · mediana = <b>${N2(Me)}</b> · Q₁ = ${N2(Q1)} · Q₃ = ${N2(Q3)} · <b>RI = ${N2(RI)}</b>.<br>
  Varianza muestral τ² = ${N2(tau2)} (σ = ${N2(Math.sqrt(tau2))}) · <b>cuasivarianza S² = ${N2(S2)}</b> (S = ${N2(Math.sqrt(S2))}, la que da R) · CV = ${N3(Math.sqrt(S2)/m)}.<br>
  Valores admisibles (no atípicos): <b>[${N2(li)} ; ${N2(ls)}]</b> ⇒ ${atip.length?'<b>'+atip.length+' dato(s) atípico(s)</b>: '+atip.map(N2).join(', '):'no hay atípicos'}. Los bigotes se dibujan en ${N2(bi)} y ${N2(bs)}, que son datos REALES.<br>
  <span class="hint">Los cuartiles están calculados por interpolación (el método que usa R con <code>quantile</code> y <code>boxplot</code>); si los calculas partiendo la muestra en dos mitades pueden salir ligeramente distintos, y ambas respuestas se dan por buenas.</span><br>
  <span class="hint">Sube el dato más grande y observa: la media se va detrás de él y la mediana casi no se mueve. Eso es la robustez de la mediana y el RI.</span>`);}});

/* T2 · Árbol de Bayes */
SIMS.bayes=el=>build(el,{w:660,h:400,
 sliders:[{k:'pa',v:25,min:1,max:99,step:1,l:'P(causa A)',u:'%'},{k:'pba',v:20,min:1,max:99,step:1,l:'P(B | A)',u:'%'},{k:'pbna',v:40,min:1,max:99,step:1,l:'P(B | no A)',u:'%'}],
 selects:[{k:'e',v:'empleo',l:'contexto',opts:[['empleo','cualificados / universitarios (examen 2016)'],['test','enfermedad / test positivo'],['maquina','máquina A / pieza defectuosa']]}],
 draw(a){a.clear();
  const L={empleo:['cualificado','universitario'],test:['enfermo','test positivo'],maquina:['máquina A','defectuosa']};
  const nomA=L[a.st.e][0],nomB=L[a.st.e][1];
  const pa=a.st.pa/100,pba=a.st.pba/100,pbna=a.st.pbna/100;
  const pb=pa*pba+(1-pa)*pbna;
  const post=pa*pba/pb, postn=1-post;
  const x0=70,y0=210;
  a.circ(x0,y0,7,C.text,true);a.txt('Ω',x0-18,y0+5,C.muted,12);
  const yA=110,yN=310;
  a.line(x0,y0,x0+150,yA,C.a,2.2);a.line(x0,y0,x0+150,yN,C.f,2.2);
  a.txt('P('+nomA+') = '+N3(pa),x0+14,(y0+yA)/2-6,C.a,12);
  a.txt('P(no '+nomA+') = '+N3(1-pa),x0+14,(y0+yN)/2+16,C.f,12);
  a.circ(x0+150,yA,6,C.a,true);a.circ(x0+150,yN,6,C.f,true);
  const bx=x0+150;
  [[yA,pba,C.a,'A'],[yN,pbna,C.f,'noA']].forEach(([yy,pp,col])=>{
    a.line(bx,yy,bx+180,yy-55,col,2);a.line(bx,yy,bx+180,yy+55,col,1.2);
    a.txt('P('+nomB+'|·) = '+N3(pp),bx+16,yy-34,col,11);
    a.txt(N3(1-pp),bx+16,yy+46,C.muted,11);
    a.circ(bx+180,yy-55,5,col,true);});
  // ramas numericas
  const r1=pa*pba, r2=(1-pa)*pbna;
  a.txt('= '+N4(r1),bx+190,yA-55+4,C.a,12);
  a.txt('= '+N4(r2),bx+190,yN-55+4,C.f,12);
  a.txt(nomB,bx+190,yA-80,C.muted,12);
  // barra posterior
  const px0=bx+150,py0=380;
  a.txt('Entre los «'+nomB+'»:',70,370,C.text,12);
  Barra(a,220,358,340,20,post,C.a);
  a.g.strokeStyle=C.muted;a.g.lineWidth=1;a.g.strokeRect(220,358,340,20);
  a.txt(N2(post*100)+' % '+nomA,224,373,C.bg,12);
  a.txt(N2(postn*100)+' % no',224+340*post+6,373,C.muted,11);
  a.html(`<b>Probabilidad total</b>: P(${nomB}) = P(A)·P(${nomB}|A) + P(noA)·P(${nomB}|noA) = ${N3(pa)}·${N3(pba)} + ${N3(1-pa)}·${N3(pbna)} = <b>${N4(pb)}</b> (${N2(pb*100)} %).<br>
  <b>Bayes</b>: P(${nomA} | ${nomB}) = ${N4(r1)} / ${N4(pb)} = <b>${N4(post)}</b> (${N2(post*100)} %) ⇒ entre los «${nomB}», el <b>${N2(postn*100)} %</b> NO es «${nomA}».<br>
  Antes de observar nada, P(${nomA}) = ${N2(pa*100)} %; después de saber que es «${nomB}», pasa a ${N2(post*100)} %: la observación ${post>pa?'<b>sube</b>':'<b>baja</b>'} la probabilidad de la causa.<br>
  <span class="hint">Baja P(causa) al 1 % y mira el efecto: aunque P(B|A) sea muy alta, la mayoría de los «${nomB}» vienen del grupo grande. Es la paradoja de los test con enfermedades raras.</span>`);}});

/* T3 · Modelos de probabilidad */
SIMS.distribuciones=el=>build(el,{w:660,h:420,
 selects:[{k:'m',v:'normal',l:'modelo',opts:[['binomial','Binomial B(n,p)'],['poisson','Poisson P(λ)'],['geom','Geométrica'],['normal','Normal N(μ,σ)'],['exp','Exponencial Exp(λ)'],['unif','Uniforme U(a,b)']]}],
 sliders:[{k:'p1',v:0,min:-30,max:60,step:0.5,l:'parámetro 1 (n · λ · μ · a)',u:''},{k:'p2',v:10,min:0.05,max:30,step:0.05,l:'parámetro 2 (p · σ · b)',u:''},{k:'c',v:12,min:-30,max:80,step:0.5,l:'punto de corte x',u:''}],
 draw(a){a.clear();const m=a.st.m;
  let disc=true,k=[],pm=[],mu=0,sg=0,nom='',sop='';
  const p1=a.st.p1,p2=a.st.p2,c=a.st.c;
  if(m==='binomial'){const n=Math.max(1,Math.round(Math.abs(p1)||20)),p=Math.min(0.99,Math.max(0.01,p2/30));
    mu=n*p;sg=Math.sqrt(n*p*(1-p));nom=`B(n = ${n}; p = ${N3(p)})`;
    for(let i=0;i<=n;i++){k.push(i);pm.push(dbinom(i,n,p));}
    sop=`E[X] = np = ${N2(mu)} · Var = npq = ${N2(sg*sg)}`;}
  else if(m==='poisson'){const l=Math.max(0.1,Math.abs(p1)||4);mu=l;sg=Math.sqrt(l);nom=`P(λ = ${N2(l)})`;
    for(let i=0;i<=Math.ceil(l+5*sg)+3;i++){k.push(i);pm.push(dpois(i,l));}
    sop=`E[X] = Var = λ = ${N2(l)}`;}
  else if(m==='geom'){const p=Math.min(0.95,Math.max(0.02,p2/30));mu=(1-p)/p;sg=Math.sqrt(1-p)/p;nom=`Geométrica (p = ${N3(p)})`;
    for(let i=0;i<=Math.min(60,Math.ceil(mu+4*sg));i++){k.push(i);pm.push(p*Math.pow(1-p,i));}
    sop=`E[X] = q/p = ${N2(mu)} (fracasos antes del 1.er éxito)`;}
  else {disc=false;
    if(m==='normal'){mu=p1||0;sg=Math.max(0.2,p2);nom=`N(μ = ${N2(mu)}; σ = ${N2(sg)})`;sop=`E[X] = μ · Var = σ² = ${N2(sg*sg)}`;}
    else if(m==='exp'){const l=Math.max(0.02,p2/10);mu=1/l;sg=1/l;nom=`Exp(λ = ${N3(l)}), media ${N2(mu)}`;sop=`E[X] = 1/λ = ${N2(mu)} · sin memoria`;}
    else {const A=Math.min(p1,p2),B=Math.max(p1,p2)+ (p1===p2?1:0);mu=(A+B)/2;sg=(B-A)/Math.sqrt(12);nom=`U(${N2(A)}; ${N2(B)})`;sop=`E[X] = (a+b)/2 = ${N2(mu)} · Var = (b−a)²/12`;}}
  const x0=60,y0=300,wv=540,hv=230;
  let lo,hi,dens,F;
  if(disc){lo=-0.5;hi=k.length-0.5;}
  else if(m==='normal'){lo=mu-4*sg;hi=mu+4*sg;dens=x=>dnorm((x-mu)/sg)/sg;F=x=>pnorm((x-mu)/sg);}
  else if(m==='exp'){const l=1/mu;lo=0;hi=mu*5;dens=x=>x<0?0:l*Math.exp(-l*x);F=x=>x<0?0:1-Math.exp(-l*x);}
  else {const A=Math.min(p1,p2),B=Math.max(p1,p2)+(p1===p2?1:0);lo=A-(B-A)*0.3;hi=B+(B-A)*0.3;dens=x=>(x>=A&&x<=B)?1/(B-A):0;F=x=>x<A?0:(x>B?1:(x-A)/(B-A));}
  const px=v=>x0+(v-lo)/(hi-lo)*wv;
  Eje(a,x0,y0,wv,hv,'x',disc?'P(X = k)':'f(x)');
  let Fc, pIg=0;
  if(disc){const mx=Math.max(...pm);
    const bw=wv/k.length;
    k.forEach((kk,i)=>{const h=pm[i]/mx*hv*0.92;
      const sel=kk<=c;
      a.g.fillStyle=sel?C.a:C.grid;a.g.fillRect(px(kk-0.5)+1,y0-h,bw-2,h);
      if(k.length<=25)a.txt(String(kk),px(kk),y0+16,C.muted,10,'center');});
    Fc=pm.filter((_,i)=>k[i]<=c).reduce((s,v)=>s+v,0);
    pIg=k.includes(Math.round(c))?pm[Math.round(c)]:0;
    if(k.length>25)[0,Math.round(k.length/2),k.length-1].forEach(i=>a.txt(String(k[i]),px(k[i]),y0+16,C.muted,10,'center'));}
  else {const mx=Math.max(...Array.from({length:200},(_,i)=>dens(lo+(hi-lo)*i/199)));
    a.g.fillStyle=C.a;a.g.globalAlpha=0.30;a.g.beginPath();a.g.moveTo(px(lo),y0);
    for(let i=0;i<=200;i++){const v=lo+(hi-lo)*i/200;if(v<=c)a.g.lineTo(px(v),y0-dens(v)/mx*hv*0.92);}
    a.g.lineTo(px(Math.min(c,hi)),y0);a.g.closePath();a.g.fill();a.g.globalAlpha=1;
    a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
    for(let i=0;i<=300;i++){const v=lo+(hi-lo)*i/300;i===0?a.g.moveTo(px(v),y0-dens(v)/mx*hv*0.92):a.g.lineTo(px(v),y0-dens(v)/mx*hv*0.92);}
    a.g.stroke();
    [lo,(lo+hi)/2,hi].forEach(v=>a.txt(N2(v),px(v),y0+16,C.muted,10,'center'));
    Fc=F(c);}
  if(c>=lo&&c<=hi){a.line(px(c),y0+4,px(c),y0-hv,C.f,1.8,[5,4]);a.txt('x = '+N2(c),px(c)+6,y0-hv+14,C.f,12);}
  a.line(px(mu),y0,px(mu),y0-hv*0.3,C.c,1.5);a.txt('μ',px(mu),y0-hv*0.3-6,C.c,12,'center');
  // aproximacion normal
  let aprox='';
  if(m==='binomial'){const n=Math.max(1,Math.round(Math.abs(p1)||20)),p=Math.min(0.99,Math.max(0.01,p2/30));
    if(n*p>5&&n*(1-p)>5){const z=(c+0.5-mu)/sg;aprox=`<b>DeMoivre-Laplace</b> (np = ${N2(n*p)} > 5 y nq = ${N2(n*(1-p))} > 5): P(X ≤ ${N2(c)}) ≈ Φ((${N2(c)}+0,5−${N2(mu)})/${N2(sg)}) = Φ(${N2(z)}) = <b>${N4(pnorm(z))}</b> frente al valor exacto ${N4(Fc)} ✓`;}
    else aprox=`No se puede aproximar por la normal: np = ${N2(n*p)} y nq = ${N2(n*(1-p))} (hacen falta ambos > 5).`;}
  a.html(`<b>${nom}</b> · ${sop} · σ = ${N2(sg)}.<br>
  <b>P(X ≤ ${N2(c)}) = ${N4(Fc)}</b> · P(X > ${N2(c)}) = ${N4(1-Fc)}${disc?` · P(X = ${Math.round(c)}) = ${N4(pIg)}`:' · P(X = x) = 0 (continua)'}.<br>
  ${!disc&&m==='normal'?`Tipificando: z = (${N2(c)} − ${N2(mu)})/${N2(sg)} = <b>${N2((c-mu)/sg)}</b> ⇒ se busca en la tabla de la N(0,1).<br>`:''}
  ${aprox?aprox+'<br>':''}
  <span class="hint">${m==='exp'?'La exponencial no tiene memoria: P(X > s+t | X > s) = P(X > t). Compruébalo moviendo el corte.':'Mueve el punto de corte: el área sombreada es exactamente lo que da la tabla o R con pnorm/pbinom.'}</span>`);}});

/* T4 · Tabla conjunta bidimensional */
SIMS.bidim=el=>build(el,{w:660,h:400,
 sliders:[{k:'d',v:50,min:0,max:100,step:1,l:'grado de dependencia',u:'%'}],
 selects:[{k:'v',v:'cond',l:'qué resaltar',opts:[['marg','distribuciones marginales'],['cond','condicionada Y | X = x'],['ind','comparación con la independencia']]},
  {k:'f',v:'1',l:'fila condicionante X =',opts:[['0','0'],['1','1'],['2','2']]}],
 draw(a){a.clear();
  const px_=[0.3,0.45,0.25], py_=[0.25,0.5,0.25];
  const d=a.st.d/100;
  // conjunta: mezcla entre independencia y una dependencia fuerte (diagonal)
  const dep=[[0.22,0.07,0.01],[0.06,0.33,0.06],[0.01,0.07,0.17]];
  const P=[],fx=[0,0,0],fy=[0,0,0];
  for(let i=0;i<3;i++){P.push([]);for(let j=0;j<3;j++){const v=(1-d)*px_[i]*py_[j]+d*dep[i][j];P[i].push(v);}}
  const tot=P.flat().reduce((s,v)=>s+v,0);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)P[i][j]/=tot;
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){fx[i]+=P[i][j];fy[j]+=P[i][j];}
  const EX=fx.reduce((s,v,i)=>s+i*v,0), EY=fy.reduce((s,v,j)=>s+j*v,0);
  let EXY=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++)EXY+=i*j*P[i][j];
  const cov=EXY-EX*EY;
  const vx=fx.reduce((s,v,i)=>s+i*i*v,0)-EX*EX, vy=fy.reduce((s,v,j)=>s+j*j*v,0)-EY*EY;
  const rho=cov/Math.sqrt(vx*vy);
  const fi=parseInt(a.st.f);
  const x0=90,y0=70,cw=110,chh=58;
  a.txt('Y →',x0+cw*1.5,y0-24,C.muted,12,'center');a.txt('X ↓',x0-44,y0+chh*1.5,C.muted,12);
  for(let j=0;j<3;j++)a.txt(String(j),x0+cw*j+cw/2,y0-6,C.text,13,'center');
  for(let i=0;i<3;i++)a.txt(String(i),x0-16,y0+chh*i+chh/2+5,C.text,13,'center');
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){
    const X=x0+cw*j, Y=y0+chh*i;
    const resalta=(a.st.v==='cond'&&i===fi);
    a.g.fillStyle=resalta?C.a:C.grid;a.g.globalAlpha=resalta?0.22:0.5*P[i][j]/0.33;a.g.fillRect(X,Y,cw-4,chh-4);a.g.globalAlpha=1;
    a.g.strokeStyle=C.muted;a.g.lineWidth=1;a.g.strokeRect(X,Y,cw-4,chh-4);
    a.txt(N3(P[i][j]),X+cw/2-2,Y+chh/2-2,C.text,13,'center');
    if(a.st.v==='cond'&&i===fi)a.txt('→ '+N3(P[i][j]/fx[i]),X+cw/2-2,Y+chh/2+16,C.a,11,'center');
    if(a.st.v==='ind')a.txt('('+N3(fx[i]*fy[j])+')',X+cw/2-2,Y+chh/2+16,C.f,11,'center');}
  // marginales
  for(let i=0;i<3;i++){const X=x0+cw*3,Y=y0+chh*i;
    a.g.fillStyle=C.a;a.g.globalAlpha=0.18;a.g.fillRect(X,Y,cw-4,chh-4);a.g.globalAlpha=1;
    a.txt(N3(fx[i]),X+cw/2-2,Y+chh/2+4,C.a,13,'center');}
  for(let j=0;j<3;j++){const X=x0+cw*j,Y=y0+chh*3;
    a.g.fillStyle=C.f;a.g.globalAlpha=0.18;a.g.fillRect(X,Y,cw-4,chh-4);a.g.globalAlpha=1;
    a.txt(N3(fy[j]),X+cw/2-2,Y+chh/2+4,C.f,13,'center');}
  a.txt('p(x)',x0+cw*3+cw/2-2,y0-6,C.a,12,'center');
  a.txt('p(y)',x0-16,y0+chh*3+chh/2+5,C.f,12,'center');
  a.txt('1',x0+cw*3+cw/2-2,y0+chh*3+chh/2+4,C.muted,12,'center');
  let msg='';
  if(a.st.v==='cond'){const fila=P[fi].map(v=>v/fx[fi]);
    msg=`<b>Condicionada</b> p(y | X = ${fi}) = p(${fi},y)/p<sub>X</sub>(${fi}): ${fila.map((v,j)=>'p('+j+'|'+fi+') = '+N3(v)).join(' · ')} (suman ${N2(fila.reduce((s,v)=>s+v,0))} ✓). Es la fila dividida por su total.`;}
  else if(a.st.v==='ind'){let maxdif=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++)maxdif=Math.max(maxdif,Math.abs(P[i][j]-fx[i]*fy[j]));
    msg=`Entre paréntesis, el producto de marginales p<sub>X</sub>·p<sub>Y</sub>. Diferencia máxima con la conjunta: <b>${N3(maxdif)}</b> ⇒ ${maxdif<0.004?'<b>son independientes</b> (coinciden en TODAS las casillas)':'<b>son dependientes</b>: basta que falle una casilla'}.`;}
  else msg=`<b>Marginales</b>: se obtienen sumando cada fila (p<sub>X</sub>) y cada columna (p<sub>Y</sub>). Por eso están «al margen» de la tabla.`;
  a.html(`${msg}<br>
  E[X] = ${N3(EX)} · E[Y] = ${N3(EY)} · E[XY] = ${N3(EXY)} ⇒ <b>Cov(X,Y) = ${N4(cov)}</b> y <b>ρ = ${N3(rho)}</b>.<br>
  <span class="hint">Pon la dependencia a 0: la conjunta es exactamente el producto de marginales, Cov = 0 y ρ = 0. Súbela y verás que ρ crece. Pero ojo: ρ = 0 no garantiza independencia, sólo ausencia de relación lineal.</span>`);}});

/* T5 · Teorema central del límite y gráfico de control */
SIMS.tcl=el=>build(el,{w:660,h:420,
 selects:[{k:'p',v:'exp',l:'población',opts:[['exp','exponencial (muy asimétrica)'],['unif','uniforme'],['bim','bimodal'],['norm','normal']]},
  {k:'v',v:'tcl',l:'figura',opts:[['tcl','distribución de la media muestral'],['ctrl','gráfico de control X̄ (3σ)']]}],
 sliders:[{k:'n',v:5,min:1,max:60,step:1,l:'tamaño de muestra n',u:''}],
 draw(a){a.clear();const n=Math.round(a.st.n);
  let gen,mu,sg;
  let seed=12345;const R=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
  if(a.st.p==='exp'){gen=()=>-Math.log(1-R())*10;mu=10;sg=10;}
  else if(a.st.p==='unif'){gen=()=>R()*20;mu=10;sg=20/Math.sqrt(12);}
  else if(a.st.p==='bim'){gen=()=>R()<0.5?2+R()*4:14+R()*4;mu=10;sg=Math.sqrt(36+4/3);}
  else {gen=()=>{let s=0;for(let i=0;i<12;i++)s+=R();return 10+(s-6)*4;};mu=10;sg=4;}
  const se=sg/Math.sqrt(n);
  if(a.st.v==='tcl'){
    const M=2000,med=[];
    for(let i=0;i<M;i++){let s=0;for(let j=0;j<n;j++)s+=gen();med.push(s/n);}
    const x0=60,y0=330,wv=540,hv=250;
    const lo=mu-4.0*se, hi=mu+5.0*se;
    const px=v=>x0+(v-lo)/(hi-lo)*wv;
    const nb=46,bw=(hi-lo)/nb,cnt=new Array(nb).fill(0);
    med.forEach(v=>{const i=Math.floor((v-lo)/bw);if(i>=0&&i<nb)cnt[i]++;});
    const cm=Math.max(...cnt);
    Eje(a,x0,y0,wv,hv,'valor de la media muestral','frecuencia');
    for(let i=0;i<nb;i++){const h=cnt[i]/cm*hv*0.85;
      a.g.fillStyle=C.a;a.g.globalAlpha=0.5;a.g.fillRect(px(lo+i*bw)+0.5,y0-h,wv/nb-1,h);a.g.globalAlpha=1;}
    // normal teorica
    const mx=dnorm(0)/se;
    a.g.strokeStyle=C.f;a.g.lineWidth=2.8;a.g.beginPath();
    for(let i=0;i<=300;i++){const v=lo+(hi-lo)*i/300;const y=dnorm((v-mu)/se)/se/mx*hv*0.85;
      i===0?a.g.moveTo(px(v),y0-y):a.g.lineTo(px(v),y0-y);}
    a.g.stroke();
    a.txt('N(μ, σ/√n) teórica',x0+wv-6,y0-hv+16,C.f,12,'right');
    a.line(px(mu),y0,px(mu),y0-hv,C.c,1.5,[4,3]);a.txt('μ = 10',px(mu)+6,y0-hv+34,C.c,12);
    [lo,mu-2*se,mu,mu+2*se,hi].forEach(v=>a.txt(N2(v),px(v),y0+16,C.muted,10,'center'));
    const m2=med.reduce((s,v)=>s+v,0)/M;
    const s2=Math.sqrt(med.reduce((s,v)=>s+(v-m2)*(v-m2),0)/M);
    a.html(`Población ${a.st.p==='exp'?'exponencial':(a.st.p==='unif'?'uniforme':(a.st.p==='bim'?'bimodal':'normal'))} con μ = ${N2(mu)} y σ = ${N2(sg)}. Muestras de <b>n = ${n}</b> (2000 simulaciones).<br>
    Teoría: E[X̄] = μ = ${N2(mu)} y <b>error típico σ/√n = ${N3(se)}</b>. Simulación: media ${N2(m2)} y desviación <b>${N3(s2)}</b> ✓.<br>
    ${n>=30?'<b>Con n ≥ 30 el TCL ya se cumple</b>: el histograma se pega a la campana aunque la población sea muy asimétrica.':(n===1?'Con n = 1 el histograma ES la población: aquí se ve su forma real.':'Con n = '+n+' todavía se nota la forma de la población; sube n y observa cómo se vuelve simétrica.')}<br>
    <span class="hint">Para dividir el error típico entre 2 hay que multiplicar n por 4: de n = ${n} a n = ${n*4}, el error pasa de ${N3(se)} a ${N3(se/2)}.</span>`);}
  else {
    const K=25, med=[];
    for(let i=0;i<K;i++){let s=0;for(let j=0;j<n;j++)s+=gen();med.push(s/n + (i>=18?sg*0.9:0));}
    const x0=70,y0=330,wv=520,hv=250;
    const lo=mu-4*se-sg*0.2, hi=mu+4*se+sg*1.0;
    const py=v=>y0-(v-lo)/(hi-lo)*hv;
    Eje(a,x0,y0,wv,hv,'número de muestra','X̄');
    const LCS=mu+3*se, LCI=mu-3*se;
    a.line(x0,py(mu),x0+wv,py(mu),C.c,2);a.txt('LC = '+N2(mu),x0+wv+2,py(mu)+4,C.c,11);
    [[LCS,'LCS'],[LCI,'LCI']].forEach(d=>{a.line(x0,py(d[0]),x0+wv,py(d[0]),C.a,1.8,[6,4]);a.txt(d[1]+' = '+N2(d[0]),x0+4,py(d[0])-6,C.a,11);});
    a.g.strokeStyle=C.f;a.g.lineWidth=1.8;a.g.beginPath();
    med.forEach((v,i)=>{const X=x0+(i+0.5)/K*wv,Y=py(v);i===0?a.g.moveTo(X,Y):a.g.lineTo(X,Y);});a.g.stroke();
    let fuera=0;
    med.forEach((v,i)=>{const X=x0+(i+0.5)/K*wv,Y=py(v);const mal=v>LCS||v<LCI;if(mal)fuera++;
      a.circ(X,Y,mal?6:4,mal?C.b:C.f,true);});
    a.txt('a partir de la muestra 19 el proceso se descentra',x0+wv*0.45,y0-hv+16,C.muted,11);
    a.html(`Gráfico de control X̄ con muestras de <b>n = ${n}</b>: línea central μ = ${N2(mu)} y límites μ ± 3σ/√n = <b>${N2(LCI)}</b> y <b>${N2(LCS)}</b>.<br>
    Puntos fuera de control: <b>${fuera}</b>. Además de los puntos fuera, son señales de alarma: 7-8 puntos seguidos al mismo lado de la línea central, tendencias sostenidas y patrones periódicos.<br>
    <span class="hint">Sube n: los límites se estrechan (3σ/√n) y el descentrado se detecta antes. Un gráfico con n grande es más sensible, pero cuesta más muestrear.</span>`);}}});

/* T6 · Intervalos de confianza */
SIMS.intervalo=el=>build(el,{w:660,h:400,
 selects:[{k:'t',v:'mu_t',l:'parámetro',opts:[['mu_z','media μ (σ conocida → Z)'],['mu_t','media μ (σ desconocida → t)'],['prop','proporción p'],['var','varianza σ² (χ²)']]}],
 sliders:[{k:'n',v:10,min:3,max:200,step:1,l:'tamaño muestral n',u:''},{k:'conf',v:95,min:80,max:99.5,step:0.5,l:'confianza',u:'%'},{k:'s',v:0.82,min:0.1,max:3,step:0.01,l:'S (o p̂ · 0,1·este valor)',u:''}],
 draw(a){a.clear();
  const n=Math.round(a.st.n), conf=a.st.conf/100, al=1-conf, S=a.st.s;
  const xb=1.9, ph=Math.min(0.95,Math.max(0.01,S/3));
  let lo,hi,cent,txt,crit,nom;
  if(a.st.t==='mu_z'){const z=qnorm(1-al/2);const e=z*S/Math.sqrt(n);cent=xb;lo=xb-e;hi=xb+e;crit='z<sub>1−α/2</sub> = '+N3(z);nom='μ con σ conocida';
    txt=`x̄ ± z·σ/√n = ${N2(xb)} ± ${N3(z)}·${N2(S)}/√${n} = ${N2(xb)} ± <b>${N3(e)}</b>`;}
  else if(a.st.t==='mu_t'){const t=qt(1-al/2,n-1);const e=t*S/Math.sqrt(n);cent=xb;lo=xb-e;hi=xb+e;crit='t<sub>1−α/2; '+(n-1)+'</sub> = '+N3(t);nom='μ con σ desconocida';
    txt=`x̄ ± t<sub>n−1</sub>·S/√n = ${N2(xb)} ± ${N3(t)}·${N2(S)}/√${n} = ${N2(xb)} ± <b>${N3(e)}</b>`;}
  else if(a.st.t==='prop'){const z=qnorm(1-al/2);const e=z*Math.sqrt(ph*(1-ph)/n);cent=ph;lo=Math.max(0,ph-e);hi=Math.min(1,ph+e);crit='z<sub>1−α/2</sub> = '+N3(z);nom='proporción p';
    txt=`p̂ ± z·√(p̂q̂/n) = ${N3(ph)} ± ${N3(z)}·${N4(Math.sqrt(ph*(1-ph)/n))} = ${N3(ph)} ± <b>${N4(e)}</b>`;}
  else {const tau2=S*S*(n-1)/n;const c1=qchisq(1-al/2,n-1), c2=qchisq(al/2,n-1);
    lo=n*tau2/c1;hi=n*tau2/c2;cent=S*S;crit='χ²<sub>1−α/2</sub> = '+N2(c1)+' y χ²<sub>α/2</sub> = '+N2(c2);nom='varianza σ²';
    txt=`( nτ²/χ²<sub>1−α/2</sub> ; nτ²/χ²<sub>α/2</sub> ) = ( ${N3(lo)} ; ${N3(hi)} ) — <b>no es simétrico</b> respecto de S² = ${N3(S*S)}`;}
  // dibujo
  const x0=70,y0=150,wv=520;
  const span=Math.max(hi-lo,1e-6)*1.6;
  const c0=(lo+hi)/2;
  const px=v=>x0+(v-(c0-span/2))/span*wv;
  a.line(x0,y0,x0+wv,y0,C.muted,1.5);
  a.g.fillStyle=C.a;a.g.globalAlpha=0.18;a.g.fillRect(px(lo),y0-40,px(hi)-px(lo),80);a.g.globalAlpha=1;
  a.line(px(lo),y0-40,px(lo),y0+40,C.a,2.5);a.line(px(hi),y0-40,px(hi),y0+40,C.a,2.5);
  a.line(px(lo),y0,px(hi),y0,C.a,3);
  a.circ(px(cent),y0,7,C.f,true);
  a.txt(N3(lo),px(lo),y0+58,C.a,12,'center');a.txt(N3(hi),px(hi),y0+58,C.a,12,'center');
  a.txt(a.st.t==='var'?'S² = '+N3(cent):'estimación = '+N3(cent),px(cent),y0-52,C.f,12,'center');
  a.txt('amplitud = '+N3(hi-lo),px((lo+hi)/2),y0-20,C.text,12,'center');
  // efecto de n y de la confianza
  const bx=70,by=250,bw=520,bh=120;
  a.txt('Amplitud del intervalo al variar n (misma confianza)',bx,by-10,C.muted,12);
  Eje(a,bx,by+bh,bw,bh,'n','amplitud');
  const amp=nn=>{if(a.st.t==='mu_z')return 2*qnorm(1-al/2)*S/Math.sqrt(nn);
    if(a.st.t==='mu_t')return 2*qt(1-al/2,Math.max(2,nn-1))*S/Math.sqrt(nn);
    if(a.st.t==='prop')return 2*qnorm(1-al/2)*Math.sqrt(ph*(1-ph)/nn);
    const tt=S*S;return nn*tt/qchisq(al/2,nn-1)-nn*tt/qchisq(1-al/2,nn-1);};
  const A0=amp(3);
  a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.beginPath();
  for(let nn=3;nn<=200;nn++){const X=bx+(nn-3)/197*bw, Y=by+bh-amp(nn)/A0*bh*0.92;
    nn===3?a.g.moveTo(X,Y):a.g.lineTo(X,Y);}a.g.stroke();
  const Xn=bx+(n-3)/197*bw;
  a.circ(Xn,by+bh-amp(n)/A0*bh*0.92,6,C.f,true);
  a.line(Xn,by+bh,Xn,by+bh-amp(n)/A0*bh*0.92,C.f,1.2,[3,3]);
  [3,50,100,150,200].forEach(v=>a.txt(String(v),bx+(v-3)/197*bw,by+bh+16,C.muted,10,'center'));
  // tamano muestral
  let tam='';
  if(a.st.t==='mu_z'||a.st.t==='mu_t'){const z=qnorm(1-al/2);const E=0.1;
    tam=`Para un margen de error E = 0,1 con esta confianza harían falta n ≥ (z·σ/E)² = (${N3(z)}·${N2(S)}/0,1)² ⇒ <b>n = ${Math.ceil(Math.pow(z*S/E,2))}</b>.`;}
  else if(a.st.t==='prop'){const z=qnorm(1-al/2);const E=0.03;
    tam=`Para E = 0,03: n ≥ z²p̂q̂/E² = <b>${Math.ceil(z*z*ph*(1-ph)/(E*E))}</b>; en el peor caso (p̂ = 0,5), n ≥ z²/(4E²) = <b>${Math.ceil(z*z/(4*E*E))}</b>.`;}
  a.html(`<b>IC al ${N2(conf*100)} % para ${nom}</b> (α = ${N3(al)}, ${crit}, n = ${n}).<br>
  ${txt} ⇒ <b>( ${N3(lo)} ; ${N3(hi)} )</b>.<br>
  ${tam}<br>
  <span class="hint">Sube la confianza y el intervalo se ensancha; sube n y se estrecha con √n. Con n pequeño, la t es claramente más ancha que la Z: ese es el precio de no conocer σ.</span>`);}});

/* T7 · Contrastes: región crítica, p-valor, errores y potencia */
SIMS.contraste=el=>build(el,{w:660,h:420,
 selects:[{k:'tipo',v:'der',l:'tipo de contraste',opts:[['der','unilateral derecha (H₁: μ > μ₀)'],['izq','unilateral izquierda (H₁: μ < μ₀)'],['bil','bilateral (H₁: μ ≠ μ₀)']]}],
 sliders:[{k:'xb',v:2.4,min:-1,max:5,step:0.05,l:'media observada x̄',u:''},{k:'mu0',v:2,min:-1,max:5,step:0.1,l:'μ₀ de H₀',u:''},
  {k:'n',v:16,min:2,max:120,step:1,l:'n',u:''},{k:'alfa',v:5,min:0.5,max:20,step:0.5,l:'nivel α',u:'%'}],
 draw(a){a.clear();
  const n=Math.round(a.st.n), al=a.st.alfa/100, sg=1, se=sg/Math.sqrt(n);
  const z=(a.st.xb-a.st.mu0)/se;
  let crit,pv,reg;
  if(a.st.tipo==='der'){crit=qnorm(1-al);pv=1-pnorm(z);reg='z > '+N3(crit);}
  else if(a.st.tipo==='izq'){crit=qnorm(al);pv=pnorm(z);reg='z < '+N3(crit);}
  else {crit=qnorm(1-al/2);pv=2*(1-pnorm(Math.abs(z)));reg='|z| > '+N3(crit);}
  const rech=pv<al;
  const x0=60,y0=300,wv=540,hv=230;
  const lo=-4.5,hi=4.5;
  const px=v=>x0+(v-lo)/(hi-lo)*wv;
  const mx=dnorm(0);
  Eje(a,x0,y0,wv,hv,'z (estadístico de contraste)','');
  // region critica
  const pinta=(d,e,col,alpha)=>{a.g.fillStyle=col;a.g.globalAlpha=alpha;a.g.beginPath();a.g.moveTo(px(d),y0);
    for(let v=d;v<=e;v+=0.02)a.g.lineTo(px(v),y0-dnorm(v)/mx*hv*0.9);
    a.g.lineTo(px(e),y0);a.g.closePath();a.g.fill();a.g.globalAlpha=1;};
  if(a.st.tipo==='der')pinta(crit,hi,C.a,0.35);
  else if(a.st.tipo==='izq')pinta(lo,crit,C.a,0.35);
  else {pinta(crit,hi,C.a,0.35);pinta(lo,-crit,C.a,0.35);}
  // p-valor
  if(a.st.tipo==='der')pinta(z,hi,C.f,0.30);
  else if(a.st.tipo==='izq')pinta(lo,z,C.f,0.30);
  else {pinta(Math.abs(z),hi,C.f,0.30);pinta(lo,-Math.abs(z),C.f,0.30);}
  a.g.strokeStyle=C.text;a.g.lineWidth=2.5;a.g.beginPath();
  for(let v=lo;v<=hi;v+=0.02){const Y=y0-dnorm(v)/mx*hv*0.9;v===lo?a.g.moveTo(px(v),Y):a.g.lineTo(px(v),Y);}a.g.stroke();
  [-3,-2,-1,0,1,2,3].forEach(v=>{a.line(px(v),y0,px(v),y0+5,C.muted,1);a.txt(String(v),px(v),y0+18,C.muted,10,'center');});
  a.line(px(z),y0+6,px(z),y0-hv*0.95,C.f,2.2);
  a.txt('z = '+N3(z),px(z)+(z>0?6:-6),y0-hv*0.95+14,C.f,13,z>0?'left':'right');
  if(a.st.tipo!=='izq'){a.line(px(crit),y0,px(crit),y0-hv*0.6,C.a,1.8,[5,4]);a.txt('crítico',px(crit)+5,y0-hv*0.6-6,C.a,11);}
  if(a.st.tipo!=='der'){const cc=a.st.tipo==='bil'?-crit:crit;a.line(px(cc),y0,px(cc),y0-hv*0.6,C.a,1.8,[5,4]);a.txt('crítico',px(cc)-5,y0-hv*0.6-6,C.a,11,'right');}
  a.txt('sombreado violeta: región crítica (α)  ·  sombreado azul: p-valor',x0+4,y0-hv-4,C.muted,11);
  // veredicto
  a.g.fillStyle=rech?C.a:C.c;a.g.globalAlpha=0.13;a.g.fillRect(x0,y0+34,wv,54);a.g.globalAlpha=1;
  a.g.strokeStyle=rech?C.a:C.c;a.g.lineWidth=2;a.g.strokeRect(x0,y0+34,wv,54);
  a.txt(rech?'p-valor < α  ⇒  SE RECHAZA H₀':'p-valor ≥ α  ⇒  NO se rechaza H₀',x0+wv/2,y0+58,rech?C.a:C.c,15,'center');
  a.txt(rech?'hay evidencia a favor de H₁':'no hay evidencia suficiente contra H₀',x0+wv/2,y0+78,C.muted,12,'center');
  const H1={der:'μ > ',izq:'μ < ',bil:'μ ≠ '}[a.st.tipo];
  // potencia frente a la verdadera media
  const dz=(a.st.xb-a.st.mu0)/se;
  const pot=a.st.tipo==='der'?1-pnorm(crit-dz):(a.st.tipo==='izq'?pnorm(crit-dz):1-pnorm(crit-dz)+pnorm(-crit-dz));
  a.html(`H₀: μ = ${N2(a.st.mu0)} frente a H₁: ${H1}${N2(a.st.mu0)} · n = ${n}, σ = 1 ⇒ error típico σ/√n = ${N3(se)}.<br>
  Estadístico: z = (x̄ − μ₀)/(σ/√n) = (${N2(a.st.xb)} − ${N2(a.st.mu0)})/${N3(se)} = <b>${N3(z)}</b> · región crítica: ${reg}.<br>
  <b>p-valor = ${N4(pv)}</b> frente a α = ${N3(al)} ⇒ <b>${rech?'se rechaza H₀':'no se rechaza H₀'}</b>.<br>
  Si la media real fuese justo la observada, la <b>potencia</b> del contraste sería ${N3(pot)} (β = ${N3(1-pot)}): ${pot<0.5?'con esta n, el contraste detecta mal esa diferencia':'el contraste detecta bien esa diferencia'}.<br>
  <span class="hint">Baja α y la región roja se encoge: cuesta más rechazar (menos error tipo I, más tipo II). Sube n y la misma diferencia se vuelve significativa: por eso con muestras enormes casi todo sale significativo.</span>`);}});

/* T7b · Bondad de ajuste ji-cuadrado */
SIMS.bondad=el=>build(el,{w:660,h:400,
 selects:[{k:'c',v:'binom',l:'modelo contrastado',opts:[['binom','B(10; p) — defectos por muestra'],['pois','Poisson(λ) — sucesos por día'],['unif','dado equilibrado (uniforme)']]}],
 sliders:[{k:'p',v:5,min:1,max:20,step:0.5,l:'parámetro (p·100 o λ)',u:''},{k:'alfa',v:5,min:1,max:20,step:1,l:'nivel α',u:'%'}],
 draw(a){a.clear();
  let O,E,etiq,k,r;
  if(a.st.c==='binom'){O=[117,59,20,4];const p=a.st.p/100;const N=200;
    E=[0,1,2].map(i=>N*dbinom(i,10,p));E.push(N*(1-E.reduce((s,v)=>s+v,0)/N));
    etiq=['0','1','2','≥3'];r=0;}
  else if(a.st.c==='pois'){O=[41,62,45,32,20];const l=a.st.p/2;const N=200;
    E=[0,1,2,3].map(i=>N*dpois(i,l));E.push(N*(1-E.reduce((s,v)=>s+v,0)/N));
    etiq=['0','1','2','3','≥4'];r=1;}
  else {O=[22,17,20,26,15,20];const N=120;E=new Array(6).fill(N/6);etiq=['1','2','3','4','5','6'];r=0;}
  // agrupar clases con E<5
  const Og=[],Eg=[],Lg=[];
  for(let i=0;i<O.length;i++){
    if(E[i]<5&&Og.length){Og[Og.length-1]+=O[i];Eg[Eg.length-1]+=E[i];Lg[Lg.length-1]+='∪'+etiq[i];}
    else {Og.push(O[i]);Eg.push(E[i]);Lg.push(etiq[i]);}}
  k=Og.length;
  const gl=k-1-r;
  let X2=0;const ap=[];
  for(let i=0;i<k;i++){const t=(Og[i]-Eg[i])*(Og[i]-Eg[i])/Eg[i];X2+=t;ap.push(t);}
  const al=a.st.alfa/100;
  const crit=qchisq(1-al,Math.max(1,gl));
  const pv=1-pchisq(X2,Math.max(1,gl));
  const x0=70,y0=250,wv=330,hv=180;
  const mx=Math.max(...Og,...Eg)*1.1;
  Eje(a,x0,y0,wv,hv,'clase','frecuencia');
  const bw=wv/k;
  for(let i=0;i<k;i++){
    const hO=Og[i]/mx*hv, hE=Eg[i]/mx*hv;
    a.g.fillStyle=C.a;a.g.globalAlpha=0.65;a.g.fillRect(x0+i*bw+4,y0-hO,bw/2-5,hO);a.g.globalAlpha=1;
    a.g.fillStyle=C.f;a.g.globalAlpha=0.65;a.g.fillRect(x0+i*bw+bw/2,y0-hE,bw/2-5,hE);a.g.globalAlpha=1;
    a.txt(Lg[i],x0+i*bw+bw/2-2,y0+16,C.muted,11,'center');
    a.txt(String(Og[i]),x0+i*bw+bw/4,y0-hO-5,C.a,10,'center');
    a.txt(N2(Eg[i]),x0+i*bw+bw*0.75,y0-hE-5,C.f,10,'center');}
  a.txt('■ observadas O',x0,y0-hv-24,C.a,12);a.txt('■ esperadas E (modelo)',x0+140,y0-hv-24,C.f,12);
  // distribucion chi2
  const cx=440,cy=250,cw=180,chh=180;
  Eje(a,cx,cy,cw,chh,'χ² con '+gl+' gl','');
  const hiX=Math.max(crit*1.8,X2*1.3,8);
  const pxc=v=>cx+v/hiX*cw;
  const dch=v=>Math.exp((gl/2-1)*Math.log(Math.max(v,1e-6))-v/2-lgamma(gl/2)-(gl/2)*Math.LN2);
  const mxc=Math.max(...Array.from({length:200},(_,i)=>dch(0.05+hiX*i/199)));
  a.g.fillStyle=C.a;a.g.globalAlpha=0.3;a.g.beginPath();a.g.moveTo(pxc(crit),cy);
  for(let v=crit;v<=hiX;v+=hiX/200)a.g.lineTo(pxc(v),cy-dch(v)/mxc*chh*0.9);
  a.g.lineTo(pxc(hiX),cy);a.g.closePath();a.g.fill();a.g.globalAlpha=1;
  a.g.strokeStyle=C.text;a.g.lineWidth=2;a.g.beginPath();
  for(let i=0;i<=200;i++){const v=0.02+hiX*i/200;const Y=cy-dch(v)/mxc*chh*0.9;i===0?a.g.moveTo(pxc(v),Y):a.g.lineTo(pxc(v),Y);}a.g.stroke();
  a.line(pxc(X2),cy+4,pxc(X2),cy-chh*0.8,C.f,2.2);a.txt('χ²obs',pxc(X2)+4,cy-chh*0.8+12,C.f,11);
  a.line(pxc(crit),cy,pxc(crit),cy-chh*0.5,C.a,1.6,[4,3]);a.txt('crítico',pxc(crit)+4,cy-chh*0.5-4,C.a,10);
  a.html(`χ² = Σ(O−E)²/E = ${ap.map(v=>N3(v)).join(' + ')} = <b>${N3(X2)}</b> con <b>${gl} grados de libertad</b> (k = ${k} clases ${r?'menos '+r+' parámetro estimado ':''}− 1).<br>
  Valor crítico χ²<sub>${N2(1-al)};${gl}</sub> = <b>${N2(crit)}</b> · <b>p-valor = ${N4(pv)}</b> ⇒ ${pv<al?'<b>se rechaza</b>: los datos NO se ajustan al modelo':'<b>no se rechaza</b>: los datos son compatibles con el modelo'}.<br>
  ${O.length!==k?'<b>Se han agrupado clases</b> porque alguna tenía E < 5 (condición de validez del test).':'Todas las clases tienen E ≥ 5 ✓.'}<br>
  <span class="hint">Mueve el parámetro: cuando el modelo teórico se aleja de los datos, las barras se separan y χ² se dispara. Si el parámetro se estima con la muestra, hay que restar un grado de libertad más.</span>`);}});

/* T8 · Regresión lineal simple */
SIMS.regresion=el=>build(el,{w:660,h:430,
 sliders:[{k:'b1',v:1.5,min:-2,max:3,step:0.05,l:'pendiente real β₁',u:''},{k:'ru',v:3,min:0.2,max:12,step:0.2,l:'ruido σ',u:''},
  {k:'n',v:26,min:5,max:120,step:1,l:'n',u:''},{k:'x0',v:30,min:0,max:40,step:1,l:'predecir en x₀',u:''}],
 selects:[{k:'v',v:'rec',l:'figura',opts:[['rec','nube, recta e intervalos'],['res','residuos frente a ajustados']]},
  {k:'f',v:'lin',l:'forma real',opts:[['lin','lineal'],['exp','exponencial (hay que transformar)'],['het','heterocedástica (embudo)']]}],
 draw(a){a.clear();
  const n=Math.round(a.st.n);
  let seed=777;const R=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
  const G=()=>{let s=0;for(let i=0;i<12;i++)s+=R();return s-6;};
  const X=[],Y=[];
  for(let i=0;i<n;i++){const x=2+18*i/(n-1)+R()*0.6;
    let y;
    if(a.st.f==='lin')y=2+a.st.b1*x+G()*a.st.ru;
    else if(a.st.f==='exp')y=2+Math.exp(0.22*x)*0.5+G()*a.st.ru;
    else y=2+a.st.b1*x+G()*a.st.ru*x/8;
    X.push(x);Y.push(y);}
  const mx=X.reduce((s,v)=>s+v,0)/n, my=Y.reduce((s,v)=>s+v,0)/n;
  let Sxx=0,Syy=0,Sxy=0;
  for(let i=0;i<n;i++){Sxx+=(X[i]-mx)**2;Syy+=(Y[i]-my)**2;Sxy+=(X[i]-mx)*(Y[i]-my);}
  const b1=Sxy/Sxx, b0=my-b1*mx;
  const res=X.map((x,i)=>Y[i]-(b0+b1*x));
  const SCE=res.reduce((s,v)=>s+v*v,0), R2=1-SCE/Syy;
  const s2=SCE/(n-2), se=Math.sqrt(s2);
  const seb1=se/Math.sqrt(Sxx), tb1=b1/seb1, pb1=2*(1-pt(Math.abs(tb1),n-2));
  const t=qt(0.975,n-2);
  const x0v=a.st.x0, y0p=b0+b1*x0v;
  const emed=t*se*Math.sqrt(1/n+(x0v-mx)**2/Sxx);
  const epre=t*se*Math.sqrt(1+1/n+(x0v-mx)**2/Sxx);
  const gx=70,gy=320,gw=540,gh=250;
  if(a.st.v==='rec'){
    const xlo=0,xhi=42;
    const ylo=Math.min(...Y,y0p-epre)-2, yhi=Math.max(...Y,y0p+epre)+2;
    const px=v=>gx+(v-xlo)/(xhi-xlo)*gw, py=v=>gy-(v-ylo)/(yhi-ylo)*gh;
    Eje(a,gx,gy,gw,gh,'x','y');
    // bandas
    const band=(mult,col,alpha)=>{a.g.fillStyle=col;a.g.globalAlpha=alpha;a.g.beginPath();
      for(let v=xlo;v<=xhi;v+=0.4){const e=t*se*Math.sqrt(mult+1/n+(v-mx)**2/Sxx);a.g.lineTo(px(v),py(b0+b1*v+e));}
      for(let v=xhi;v>=xlo;v-=0.4){const e=t*se*Math.sqrt(mult+1/n+(v-mx)**2/Sxx);a.g.lineTo(px(v),py(b0+b1*v-e));}
      a.g.closePath();a.g.fill();a.g.globalAlpha=1;};
    band(1,C.f,0.12);band(0,C.a,0.22);
    a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();a.g.moveTo(px(xlo),py(b0+b1*xlo));a.g.lineTo(px(xhi),py(b0+b1*xhi));a.g.stroke();
    X.forEach((x,i)=>a.circ(px(x),py(Y[i]),4,C.text,true));
    a.circ(px(mx),py(my),7,C.c,false);a.txt('(x̄, ȳ)',px(mx)+9,py(my)-6,C.c,11);
    const rango=Math.max(...X);
    a.g.fillStyle=C.muted;a.g.globalAlpha=0.10;a.g.fillRect(px(rango),gy-gh,px(xhi)-px(rango),gh);a.g.globalAlpha=1;
    a.txt('zona de extrapolación',px(rango)+6,gy-gh+16,C.muted,11);
    a.line(px(x0v),gy,px(x0v),py(y0p),C.f,1.4,[4,3]);
    a.circ(px(x0v),py(y0p),6,C.f,true);
    a.line(px(x0v)-8,py(y0p-epre),px(x0v)+8,py(y0p-epre),C.f,2);
    a.line(px(x0v)-8,py(y0p+epre),px(x0v)+8,py(y0p+epre),C.f,2);
    a.line(px(x0v),py(y0p-epre),px(x0v),py(y0p+epre),C.f,1.5);
    [xlo,10,20,30,40].forEach(v=>a.txt(String(v),px(v),gy+16,C.muted,10,'center'));}
  else {
    const fit=X.map(x=>b0+b1*x);
    const flo=Math.min(...fit)-1, fhi=Math.max(...fit)+1;
    const rl=Math.max(...res.map(Math.abs))*1.2;
    const px=v=>gx+(v-flo)/(fhi-flo)*gw, py=v=>gy-gh/2-v/rl*gh/2;
    Eje(a,gx,gy,gw,gh,'valores ajustados ŷ','');
    a.line(gx,gy-gh/2,gx+gw,gy-gh/2,C.a,2);
    a.txt('0',gx-10,gy-gh/2+4,C.muted,11,'right');
    X.forEach((x,i)=>a.circ(px(fit[i]),py(res[i]),4,C.text,true));
    a.txt('residuo',gx-6,gy-gh-8,C.muted,12);
    const patron=a.st.f==='het'?'se abre en EMBUDO ⇒ falla la homocedasticidad':(a.st.f==='exp'?'dibuja una CURVA ⇒ falla la linealidad: hay que transformar':'no se ve patrón ⇒ hipótesis razonables ✓');
    a.txt(patron,gx+gw/2,gy-gh-8,a.st.f==='lin'?C.c:C.b,12,'center');}
  const fiable=x0v<=Math.max(...X);
  a.html(`Recta ajustada: <b>ŷ = ${N3(b0)} + ${N3(b1)}·x</b> · <b>R² = ${N3(R2)}</b> (el modelo explica el ${N2(R2*100)} % de la variabilidad) · σ̂ = ${N3(se)} (con n−2 = ${n-2} gl).<br>
  Contraste H₀: β₁ = 0 ⇒ t = ${N3(b1)}/${N3(seb1)} = <b>${N3(tb1)}</b> con ${n-2} gl ⇒ p-valor = <b>${pb1<0.0001?'< 0,0001':N4(pb1)}</b> ⇒ ${pb1<0.05?'la pendiente <b>es significativa</b>':'la pendiente <b>no es significativa</b>: x no explica y'}.<br>
  Predicción en x₀ = ${x0v}: ŷ = <b>${N2(y0p)}</b> · IC 95 % para la <b>media</b>: (${N2(y0p-emed)} ; ${N2(y0p+emed)}) · intervalo de <b>predicción</b>: (${N2(y0p-epre)} ; ${N2(y0p+epre)}) — más ancho, porque incluye la variabilidad individual.<br>
  ${fiable?'x₀ está dentro del rango observado ✓':'<b>x₀ está fuera del rango observado</b>: es una extrapolación y la estimación no es fiable.'}<br>
  <span class="hint">Cambia la forma real a exponencial o heterocedástica y mira los residuos: el R² puede seguir siendo alto mientras el modelo es inválido. Por eso la diagnosis no es opcional.</span>`);}});

/* Extra · Calculadora de tablas (N, t, chi², F) */
SIMS.tablas=el=>build(el,{w:660,h:380,
 selects:[{k:'d',v:'z',l:'distribución',opts:[['z','Normal N(0,1)'],['t','t de Student'],['chi','Ji-cuadrado'],['f','F de Snedecor']]},
  {k:'m',v:'p',l:'qué calcular',opts:[['p','probabilidad a partir del valor'],['q','valor crítico a partir de la probabilidad']]}],
 sliders:[{k:'x',v:1.96,min:-5,max:30,step:0.01,l:'valor x (modo probabilidad)',u:''},{k:'pr',v:95,min:0.5,max:99.9,step:0.1,l:'probabilidad acumulada',u:'%'},
  {k:'g1',v:10,min:1,max:60,step:1,l:'grados de libertad (o n₁)',u:''},{k:'g2',v:10,min:1,max:60,step:1,l:'gl del denominador (F)',u:''}],
 draw(a){a.clear();const d=a.st.d,g1=Math.round(a.st.g1),g2=Math.round(a.st.g2),p=a.st.pr/100;
  let cdf,dens,lo,hi,nom;
  if(d==='z'){cdf=pnorm;dens=dnorm;lo=-4;hi=4;nom='N(0,1)';}
  else if(d==='t'){cdf=x=>pt(x,g1);dens=x=>Math.exp(lgamma((g1+1)/2)-lgamma(g1/2))/Math.sqrt(g1*Math.PI)*Math.pow(1+x*x/g1,-(g1+1)/2);lo=-5;hi=5;nom='t con '+g1+' gl';}
  else if(d==='chi'){cdf=x=>pchisq(x,g1);dens=x=>x<=0?0:Math.exp((g1/2-1)*Math.log(x)-x/2-lgamma(g1/2)-(g1/2)*Math.LN2);lo=0;hi=Math.max(10,g1*3);nom='χ² con '+g1+' gl';}
  else {cdf=x=>pf(x,g1,g2);dens=x=>{if(x<=0)return 0;const l=0.5*(g1*Math.log(g1)+g2*Math.log(g2))+(g1/2-1)*Math.log(x)-((g1+g2)/2)*Math.log(g2+g1*x)+lgamma((g1+g2)/2)-lgamma(g1/2)-lgamma(g2/2);return Math.exp(l);};lo=0;hi=6;nom='F('+g1+', '+g2+')';}
  const xv=a.st.m==='p'?a.st.x:(d==='z'?qnorm(p):(d==='t'?qt(p,g1):(d==='chi'?qchisq(p,g1):qf(p,g1,g2))));
  const F=cdf(xv);
  const x0=70,y0=270,wv=540,hv=200;
  const px=v=>x0+(v-lo)/(hi-lo)*wv;
  const mx=Math.max(...Array.from({length:300},(_,i)=>dens(lo+(hi-lo)*(i+0.5)/300)));
  Eje(a,x0,y0,wv,hv,nom,'');
  a.g.fillStyle=C.a;a.g.globalAlpha=0.32;a.g.beginPath();a.g.moveTo(px(lo),y0);
  for(let v=lo;v<=Math.min(xv,hi);v+=(hi-lo)/400)a.g.lineTo(px(v),y0-dens(v)/mx*hv*0.9);
  a.g.lineTo(px(Math.min(xv,hi)),y0);a.g.closePath();a.g.fill();a.g.globalAlpha=1;
  a.g.strokeStyle=C.text;a.g.lineWidth=2.5;a.g.beginPath();
  for(let i=0;i<=400;i++){const v=lo+(hi-lo)*i/400;const Y=y0-dens(v)/mx*hv*0.9;i===0?a.g.moveTo(px(v),Y):a.g.lineTo(px(v),Y);}a.g.stroke();
  if(xv>=lo&&xv<=hi){a.line(px(xv),y0+5,px(xv),y0-hv*0.95,C.f,2.2);a.txt(N3(xv),px(xv)+6,y0-hv*0.95+14,C.f,13);}
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4;a.txt(N2(v),px(v),y0+18,C.muted,10,'center');}
  a.txt('área sombreada = '+N4(F),x0+10,y0-hv+16,C.a,13);
  // cuantiles habituales
  const qs=[0.90,0.95,0.975,0.99,0.995];
  a.txt('Cuantiles más usados:',x0,y0+60,C.text,12);
  qs.forEach((q,i)=>{const v=d==='z'?qnorm(q):(d==='t'?qt(q,g1):(d==='chi'?qchisq(q,g1):qf(q,g1,g2)));
    a.txt(N3(q)+' → '+N3(v),x0+i*110,y0+82,C.muted,12);});
  a.html(`<b>${nom}</b>: P(X ≤ ${N3(xv)}) = <b>${N4(F)}</b> · P(X > ${N3(xv)}) = <b>${N4(1-F)}</b>${d==='z'||d==='t'?` · bilateral 2·P(X > |x|) = ${N4(2*(1-cdf(Math.abs(xv))))}`:''}.<br>
  ${a.st.m==='q'?`Valor crítico para una acumulada de ${N3(p)}: <b>${N3(xv)}</b>.`:'Cambia a «valor crítico» para hacer la lectura inversa de la tabla.'}<br>
  Para un intervalo bilateral al 95 % se usa el cuantil ${d==='chi'||d==='f'?'0,975 y 0,025 (dos colas distintas)':'0,975: '+N3(d==='z'?qnorm(0.975):qt(0.975,g1))}.<br>
  <span class="hint">Esta figura sustituye a las tablas del examen: en R serían pnorm, pt, pchisq, pf y sus q correspondientes (qnorm, qt…).</span>`);}});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
