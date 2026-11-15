/* Figuras interactivas de Fundamentos de Electrónica Industrial. Vanilla JS + canvas. */
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

/* ---- Fundamentos de Electrónica Industrial: figuras interactivas ---- */
const N1=x=>(Math.abs(x)<1e-9?0:x).toFixed(1).replace('.',',');
const N2=x=>(Math.abs(x)<1e-9?0:x).toFixed(2).replace('.',',');
const N3=x=>(Math.abs(x)<1e-9?0:x).toFixed(3).replace('.',',');
const Eje=(a,x0,y0,w,h,xlab,ylab)=>{a.line(x0,y0,x0+w,y0,C.muted,1.5);a.line(x0,y0,x0,y0-h,C.muted,1.5);
  if(xlab)a.txt(xlab,x0+w/2,y0+30,C.muted,12,'center');if(ylab)a.txt(ylab,x0-6,y0-h-10,C.muted,12);};
const Rbox=(a,x,y,w,h,lab,col)=>{a.g.fillStyle=C.bg;a.g.fillRect(x,y,w,h);a.g.strokeStyle=col||C.text;a.g.lineWidth=2;a.g.strokeRect(x,y,w,h);
  if(lab)a.txt(lab,x+w/2,y+h/2+4,col||C.text,12,'center');};
const NQ=x=>{const r=Math.round(x*100)/100;return (Math.abs(r-Math.round(r))<1e-9?String(Math.round(r)):r.toFixed(2).replace(/0$/,'')).replace('.',',');};
const Ohm=r=>r>=1000?NQ(r/1000)+' kΩ':NQ(r)+' Ω';
const ticks=(max,n)=>{const raw=max/n,p=Math.pow(10,Math.floor(Math.log10(raw))),c=[1,2,2.5,5,10].find(k=>k*p>=raw)*p;const out=[];for(let v=c;v<=max*1.0001;v+=c)out.push(v);return out;};
const Diodo=(a,x,y,s,col,vert)=>{a.g.fillStyle=col;a.g.beginPath();
  if(!vert){a.g.moveTo(x-s,y-s);a.g.lineTo(x-s,y+s);a.g.lineTo(x+s*0.6,y);}
  else{a.g.moveTo(x-s,y-s);a.g.lineTo(x+s,y-s);a.g.lineTo(x,y+s*0.6);}
  a.g.closePath();a.g.fill();
  if(!vert)a.line(x+s*0.6,y-s,x+s*0.6,y+s,col,2.5);else a.line(x-s,y+s*0.6,x+s,y+s*0.6,col,2.5);};

/* T1 · Unión PN y curva del diodo */
SIMS.union=el=>build(el,{w:660,h:310,
 selects:[{k:'m',v:'v07',l:'modelo',opts:[['ideal','diodo ideal'],['v07','modelo de 0,7 V'],['rd','0,7 V con resistencia rd'],['real','curva real (Shockley)']]}],
 sliders:[{k:'v',v:0.75,min:-1.2,max:1.2,step:0.01,l:'tensión aplicada V',u:'V'},{k:'T',v:300,min:250,max:400,step:5,l:'temperatura',u:'K'}],
 draw(a){a.clear();
  const V=a.st.v, Tk=a.st.T, VT=8.617e-5*Tk, nn=2, IS=1.35e-8;
  const shock=v=>IS*(Math.exp(v/(nn*VT))-1)*1000; // mA
  let I=0,est='';
  if(a.st.m==='ideal'){I=V>0?30:0;est=V>0?'conduce (cortocircuito ideal)':'bloquea (circuito abierto)';}
  else if(a.st.m==='v07'){I=V>0.7?30:0;est=V>0.7?'conduce con 0,7 V fijos':'bloquea';}
  else if(a.st.m==='rd'){I=V>0.7?(V-0.7)/0.02:0;est=V>0.7?'conduce: V = 0,7 + rd·I':'bloquea';}
  else {I=Math.max(-0.02,shock(V));est=V>0.6?'zona de conducción exponencial':(V>0?'apenas conduce':'polarización inversa (sólo fuga)');}
  const x0=70,y0=250,wv=330,hv=190;
  const vlo=-1.2,vhi=1.2, Imax=30;
  const px=v=>x0+(v-vlo)/(vhi-vlo)*wv, py=i=>y0-Math.min(i,Imax)/Imax*hv;
  a.line(px(vlo),y0,px(vhi),y0,C.muted,1.4);a.line(px(0),y0-hv-12,px(0),y0+26,C.muted,1.4);
  a.txt('V (V)',px(vhi)+2,y0+34,C.muted,11,'right');a.txt('I (mA)',px(0)+6,y0-hv-16,C.muted,11);
  [-1,-0.5,0.5,1].forEach(v=>{a.line(px(v),y0-3,px(v),y0+3,C.muted,1);a.txt(NQ(v),px(v),y0+18,C.muted,10,'center');});
  [10,20,30].forEach(i=>{a.line(px(0)-3,py(i),px(0)+3,py(i),C.muted,1);a.txt(String(i),px(0)-8,py(i)+4,C.muted,10,'right');});
  a.line(px(0.7),y0,px(0.7),y0-hv,C.muted,1,[3,3]);
  a.txt('0,7 V',px(0.7)-5,y0-hv+2,C.muted,11,'right');
  a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
  for(let v=vlo;v<=vhi;v+=0.004){let i;
    if(a.st.m==='ideal')i=v>0?(v>0.02?Imax:v*1500):0;
    else if(a.st.m==='v07')i=v>0.7?Math.min(Imax,(v-0.7)*1500):0;
    else if(a.st.m==='rd')i=v>0.7?Math.min(Imax,(v-0.7)/0.02):0;
    else i=Math.min(Imax,Math.max(-0.5,shock(v)));
    v===vlo?a.g.moveTo(px(v),py(i)):a.g.lineTo(px(v),py(i));}
  a.g.stroke();
  if(V>=vlo&&V<=vhi){a.circ(px(V),py(I),6,C.f,true);
    a.line(px(V),y0,px(V),py(I),C.f,1.2,[3,3]);}
  // union PN
  const ux=450,uy=60,uw=160,uh=66;
  const w=V>0.6?6:(V<0?26:16);
  a.g.fillStyle=C.c;a.g.globalAlpha=0.22;a.g.fillRect(ux,uy,uw/2-w/2,uh);a.g.globalAlpha=1;
  a.g.fillStyle=C.e;a.g.globalAlpha=0.22;a.g.fillRect(ux+uw/2+w/2,uy,uw/2-w/2,uh);a.g.globalAlpha=1;
  a.g.fillStyle=C.grid;a.g.fillRect(ux+uw/2-w/2,uy,w,uh);
  a.g.strokeStyle=C.muted;a.g.lineWidth=1.4;a.g.strokeRect(ux,uy,uw,uh);
  a.txt('P',ux+uw/4,uy+uh/2+5,C.c,14,'center');a.txt('N',ux+3*uw/4,uy+uh/2+5,C.e,14,'center');
  a.txt('zona de deplexión',ux+uw/2,uy-10,C.muted,11,'center');
  a.txt(V>0.6?'estrecha ⇒ conduce':(V<0?'ancha ⇒ bloquea':'barrera sin vencer'),ux+uw/2,uy+uh+18,C.muted,11,'center');
  // simbolo
  const sy=uy+uh+62;
  a.line(ux+14,sy,ux+58,sy,C.text,2);
  Diodo(a,ux+68,sy,11,C.a);
  a.line(ux+80,sy,ux+132,sy,C.text,2);
  a.txt('A',ux+14,sy-10,C.muted,11);a.txt('K',ux+126,sy-10,C.muted,11);
  a.txt(V>0?'directa':'inversa',ux+uw/2,sy+26,C.muted,11,'center');
  const Itxt=a.st.m==='real'?(I>1000?NQ(I/1000)+' A':NQ(I)+' mA'):(I>=30?'la que deje el circuito exterior':NQ(I)+' mA');
  a.html(`Modelo <b>${{ideal:'ideal',v07:'de 0,7 V',rd:'0,7 V + rd',real:'real (Shockley)'}[a.st.m]}</b> · V = ${NQ(V)} V ⇒ I = <b>${Itxt}</b> · ${est}.<br>
  ${a.st.m==='real'?`Ecuación de Shockley: I = I<sub>S</sub>(e^(V/nV<sub>T</sub>) − 1) con V<sub>T</sub> = kT/q = <b>${NQ(VT*1000)} mV</b> a ${a.st.T} K. Sube la temperatura y verás que conduce antes: la caída baja ≈2 mV por cada grado.`:'En el examen se usan los modelos lineales: supón ON u OFF, resuelve el circuito y COMPRUEBA la hipótesis.'}<br>
  <span class="hint">Con el modelo de 0,7 V el diodo es una fuente de 0,7 V cuando conduce y un circuito abierto cuando no: la corriente la fija entonces el resto del circuito. Baja la tensión a valores negativos para ver la zona inversa.</span>`);}});

/* T2 · Rectificadores y filtro */
SIMS.rectificador=el=>build(el,{w:660,h:400,
 selects:[{k:'t',v:'puente',l:'circuito',opts:[['media','media onda'],['puente','puente de diodos (onda completa)'],['toma','toma media (2 diodos)']]}],
 sliders:[{k:'vef',v:12,min:3,max:30,step:0.5,l:'tensión eficaz del secundario',u:'V'},{k:'C',v:470,min:0,max:4700,step:10,l:'condensador',u:'µF'},{k:'R',v:220,min:50,max:2200,step:10,l:'carga',u:'Ω'}],
 draw(a){a.clear();
  const Vef=a.st.vef, Cf=a.st.C*1e-6, R=a.st.R, f=50;
  const Vp=Math.SQRT2*Vef;
  const caida=a.st.t==='puente'?1.4:0.7;
  const Vpico=Math.max(0,(a.st.t==='toma'?Vp/2:Vp)-caida);
  const fr=a.st.t==='media'?f:2*f;
  const N=1600, T=4/f;
  const vs=[],vo=[]; let v=Vpico;
  for(let i=0;i<N;i++){const t=T*i/N, s2=Vp*Math.sin(2*Math.PI*f*t);
    let rect;
    if(a.st.t==='media')rect=Math.max(0,s2-0.7);
    else if(a.st.t==='puente')rect=Math.max(0,Math.abs(s2)-1.4);
    else rect=Math.max(0,Math.abs(s2/2)-0.7);
    if(Cf>0)v=Math.max(rect, v-v/(R*Cf)*(T/N)); else v=rect;
    vs.push(s2);vo.push(v);}
  const est=vo.slice(Math.floor(N/2));
  const vmax=Math.max(...est), vmin=Math.min(...est);
  const vr=vmax-vmin, vdc=est.reduce((s2,x)=>s2+x,0)/est.length;
  // leyenda
  const ly=22;
  a.line(20,ly,48,ly,C.muted,1.6,[4,3]); a.txt('entrada del secundario',54,ly+4,C.muted,12);
  a.line(230,ly,258,ly,C.a,2.6); a.txt('salida rectificada y filtrada',264,ly+4,C.a,12);
  a.line(470,ly,498,ly,C.c,1.8,[5,4]); a.txt('valor medio',504,ly+4,C.c,12);
  const x0=58,zy=220,wv=580,up=170,dn=130;
  const M=Math.max(Vp*1.08,1);
  const px=i=>x0+i/N*wv, py=u=>zy-(u>=0?u/M*up:u/M*dn);
  a.line(x0,zy-up,x0,zy+dn,C.muted,1.4);
  a.line(x0,zy,x0+wv,zy,C.muted,1.2);
  ticks(M,4).forEach(u=>{if(u<=M){a.line(x0-4,py(u),x0,py(u),C.muted,1);a.txt(NQ(u),x0-7,py(u)+4,C.muted,10,'right');
    if(-u>=-M*dn/up){a.line(x0-4,py(-u),x0,py(-u),C.muted,1);a.txt('−'+NQ(u),x0-7,py(-u)+4,C.muted,10,'right');}}});
  a.txt('V',x0-7,zy-up-6,C.muted,11,'right');
  a.g.strokeStyle=C.muted;a.g.lineWidth=1.4;a.g.setLineDash([4,3]);a.g.beginPath();
  vs.forEach((u,i)=>{i===0?a.g.moveTo(px(i),py(u)):a.g.lineTo(px(i),py(u));});a.g.stroke();a.g.setLineDash([]);
  a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
  vo.forEach((u,i)=>{i===0?a.g.moveTo(px(i),py(u)):a.g.lineTo(px(i),py(u));});a.g.stroke();
  a.line(x0,py(vdc),x0+wv,py(vdc),C.c,1.6,[6,4]);
  a.txt(NQ(vdc)+' V',x0+wv,py(vdc)-7,C.c,12,'right');
  a.txt('t (4 ciclos de 50 Hz)',x0+wv,zy+dn+2,C.muted,11,'right');
  // cota del rizado
  if(Cf>0&&vr>0.05){const xr=x0+wv*0.56;
    a.line(xr,py(vmax),xr,py(vmin),C.b,1.6);
    a.line(xr-5,py(vmax),xr+5,py(vmax),C.b,1.6);a.line(xr-5,py(vmin),xr+5,py(vmin),C.b,1.6);
    a.txt('rizado '+NQ(vr)+' V',xr+8,py(vmin)+16,C.b,11);}
  const Idc=vdc/R, vrTeo=Cf>0?Idc/(fr*Cf):Vpico;
  a.html(`<b>${{media:'Media onda',puente:'Puente de diodos',toma:'Toma media'}[a.st.t]}</b> con secundario de ${NQ(Vef)} V eficaces (pico ${NQ(Vp)} V) ⇒ pico a la salida = ${NQ(a.st.t==='toma'?Vp/2:Vp)} − ${NQ(caida)} = <b>${NQ(Vpico)} V</b>.<br>
  Con C = ${a.st.C} µF y R = ${Ohm(R)}: rizado <b>${NQ(vr)} V</b> (teórico I/(f<sub>r</sub>C) = ${NQ(vrTeo)} V con f<sub>r</sub> = ${fr} Hz) · <b>valor medio ${NQ(vdc)} V</b> · I<sub>carga</sub> = ${NQ(Idc*1000)} mA.<br>
  PIV de los diodos ≈ <b>${NQ(a.st.t==='toma'?Vp:Vp)} V</b> ⇒ con 1N4001 (V<sub>RRM</sub> = 50 V) ${Vp<50?'✓ correcto':'✗ ¡insuficiente, hace falta otro diodo!'}. Corriente media por diodo ≈ ${NQ(Idc*1000/(a.st.t==='media'?1:2))} mA de 1 A máximos ✓.<br>
  <span class="hint">Pon C = 0 para ver la forma rectificada pura y compara media onda con onda completa: con el mismo condensador el rizado se reduce a la mitad, porque la frecuencia de rizado es el doble.</span>`);}});

/* T3 · Regulador zener */
SIMS.zener=el=>build(el,{w:660,h:400,
 sliders:[{k:'vin',v:15,min:0,max:30,step:0.5,l:'tensión de entrada',u:'V'},{k:'rs',v:220,min:50,max:2200,step:10,l:'Rs',u:'Ω'},
  {k:'rl',v:1000,min:100,max:10000,step:50,l:'carga RL',u:'Ω'},{k:'vz',v:10,min:3,max:15,step:0.1,l:'Vz del zener',u:'V'}],
 draw(a){a.clear();
  const Vin=a.st.vin, Rs=a.st.rs, RL=a.st.rl, Vz=a.st.vz;
  const IzM=0.105, Izmin=0.01, PD=1.3;
  const Vsin=Vin*RL/(Rs+RL), regula=Vsin>Vz, Vo=regula?Vz:Vsin;
  const Is=(Vin-Vo)/Rs, IL=Vo/RL, Iz=regula?Is-IL:0;
  const Pz=Vz*Iz, Ps=(Vin-Vo)*Is;
  const x0=70,y0=70;
  a.line(x0,y0,x0,y0+180,C.text,2);
  a.circ(x0,y0+60,16,C.d,false);a.line(x0-8,y0+60,x0+8,y0+60,C.d,2);a.line(x0,y0+52,x0,y0+68,C.d,2);
  a.txt(NQ(Vin)+' V',x0-22,y0+65,C.d,12,'right');
  a.line(x0,y0,x0+90,y0,C.text,2);
  Rbox(a,x0+90,y0-14,72,28,'Rs',C.a);a.txt(Ohm(Rs),x0+126,y0-22,C.a,11,'center');
  a.line(x0+162,y0,x0+330,y0,C.text,2);
  const zx=x0+230;
  a.line(zx,y0,zx,y0+62,C.text,2);
  a.g.fillStyle=regula?C.b:C.muted;a.g.beginPath();a.g.moveTo(zx-11,y0+92);a.g.lineTo(zx+11,y0+92);a.g.lineTo(zx,y0+74);a.g.closePath();a.g.fill();
  a.line(zx-11,y0+72,zx+11,y0+72,regula?C.b:C.muted,2.5);
  a.line(zx-11,y0+72,zx-16,y0+67,regula?C.b:C.muted,2);a.line(zx+11,y0+72,zx+16,y0+77,regula?C.b:C.muted,2);
  a.line(zx,y0+92,zx,y0+180,C.text,2);
  a.txt('Vz = '+NQ(Vz)+' V',zx-22,y0+120,regula?C.b:C.muted,12,'right');
  const lx=x0+330;
  a.line(lx,y0,lx,y0+58,C.text,2);
  Rbox(a,lx-15,y0+58,30,72,'',C.c);a.txt('RL',lx+24,y0+90,C.c,12);a.txt(Ohm(RL),lx+24,y0+108,C.c,11);
  a.line(lx,y0+130,lx,y0+180,C.text,2);
  a.line(x0,y0+180,lx,y0+180,C.text,2);
  a.txt('Vo = '+NQ(Vo)+' V',lx+24,y0+148,C.a,16);
  a.txt(regula?'el zener REGULA':'zener cortado (no regula)',lx+24,y0+170,regula?C.c:C.b,12);
  // corrientes
  const bx=70,by=300;
  [['Is = (Vin − Vo)/Rs',Is*1000,C.a],['IL = Vo/RL',IL*1000,C.c],['Iz = Is − IL',Iz*1000,regula?C.b:C.muted]].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*26,C.muted,12);a.txt(NQ(d[1])+' mA',bx+215,by+i*26,d[2],13,'right');});
  a.txt('Pz = Vz·Iz = '+NQ(Pz*1000)+' mW',bx+280,by,Pz>PD?C.b:C.text,13);
  a.txt('P en Rs = '+NQ(Ps*1000)+' mW',bx+280,by+26,C.text,13);
  const malo=regula&&(Iz>IzM||Pz>PD), poco=regula&&Iz<Izmin;
  a.txt(malo?'✗ se supera IzM o PD: el zener se destruye':(poco?'✗ Iz por debajo del mínimo: deja de regular':(regula?'✓ el zener trabaja dentro de sus límites':'')),bx+280,by+52,malo||poco?C.b:C.c,12);
  a.html(`Sin el zener el divisor daría <b>${NQ(Vsin)} V</b>: ${regula?'supera V<sub>z</sub>, así que el zener <b>entra en ruptura y regula</b> a '+NQ(Vz)+' V.':'<b>no llega a V<sub>z</sub></b>, así que el zener está cortado y la salida es la del divisor.'}<br>
  I<sub>s</sub> = ${NQ(Is*1000)} mA · I<sub>L</sub> = ${NQ(IL*1000)} mA · <b>I<sub>z</sub> = ${NQ(Iz*1000)} mA</b> (límites: 10–105 mA, P<sub>D</sub> = 1,3 W).<br>
  ${malo?'<b>Peligro</b>: sube Rs o baja la tensión de entrada. ':(poco?'<b>Atención</b>: con esta carga el zener se queda sin corriente; hay que bajar Rs. ':'')}R<sub>s</sub> debe cumplir las dos condiciones extremas: con V<sub>in</sub> mínima y carga máxima, I<sub>z</sub> ≥ I<sub>z mín</sub>; con V<sub>in</sub> máxima y sin carga, I<sub>z</sub> ≤ I<sub>zM</sub>.<br>
  <span class="hint">Quita la carga (RL grande) y sube Vin: toda la corriente se va al zener. Ese es el caso que fija el valor mínimo de Rs.</span>`);}});

/* T4 · BJT: recta de carga y punto Q */
SIMS.bjt=el=>build(el,{w:660,h:430,
 selects:[{k:'c',v:'div',l:'polarización',opts:[['div','divisor de tensión con RE'],['base','resistencia de base fija'],['conm','conmutación (entrada de 5 V)']]}],
 sliders:[{k:'vcc',v:12,min:3,max:20,step:0.5,l:'Vcc',u:'V'},{k:'rc',v:1000,min:100,max:10000,step:50,l:'RC',u:'Ω'},
  {k:'re',v:220,min:0,max:2200,step:10,l:'RE',u:'Ω'},{k:'r1',v:47000,min:1000,max:200000,step:1000,l:'R1 (o RB)',u:'Ω'},
  {k:'beta',v:150,min:50,max:400,step:5,l:'β',u:''}],
 draw(a){a.clear();
  const Vcc=a.st.vcc, RC=a.st.rc, RE=a.st.re, R1=a.st.r1, B=a.st.beta;
  const R2=10000, VBE=0.7, VCEsat=0.2;
  let Vth,Rth;
  if(a.st.c==='div'){Vth=Vcc*R2/(R1+R2);Rth=R1*R2/(R1+R2);}
  else if(a.st.c==='base'){Vth=Vcc;Rth=R1;}
  else {Vth=5;Rth=R1;}
  let IB=Math.max(0,(Vth-VBE)/(Rth+(B+1)*RE));
  let IC=B*IB, zona='activa';
  let VCE=Vcc-IC*(RC+RE);
  const ICsat=(Vcc-VCEsat)/(RC+RE);
  if(IB<=0){zona='corte';IC=0;VCE=Vcc;}
  else if(IC>ICsat){zona='saturación';IC=ICsat;VCE=VCEsat;}
  const x0=66,y0=300,wv=320,hv=230;
  const ICmax=ICsat*1.25, Vmax=Vcc*1.12;
  const px=v=>x0+v/Vmax*wv, py=i=>y0-i/ICmax*hv;
  a.line(x0,y0,x0+wv+10,y0,C.muted,1.5);a.line(x0,y0,x0,y0-hv-14,C.muted,1.5);
  a.txt('V_CE (V)',x0+wv+10,y0+30,C.muted,11,'right');a.txt('I_C (mA)',x0-4,y0-hv-20,C.muted,11);
  ticks(Vmax,4).forEach(v=>{a.line(px(v),y0,px(v),y0+4,C.muted,1);a.txt(NQ(v),px(v),y0+17,C.muted,10,'center');});
  ticks(ICmax*1000,4).forEach(i=>{const ic=i/1000;if(ic<=ICmax){a.line(x0-4,py(ic),x0,py(ic),C.muted,1);a.txt(NQ(i),x0-7,py(ic)+4,C.muted,10,'right');}});
  for(let k=1;k<=6;k++){const ib=IB*k/3;
    a.g.strokeStyle=C.grid;a.g.lineWidth=1.4;a.g.beginPath();
    for(let v=0;v<=Vmax;v+=0.05){
      const ic=v<0.3?B*ib*(v/0.3):B*ib*(1+0.012*(v-0.3));
      if(ic>ICmax)break;
      v===0?a.g.moveTo(px(v),py(ic)):a.g.lineTo(px(v),py(ic));}
    a.g.stroke();}
  a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
  a.g.moveTo(px(0),py(ICsat));a.g.lineTo(px(Vcc),py(0));a.g.stroke();
  a.txt('recta de carga',px(Vcc*0.52),py(ICsat*0.60),C.a,12);
  a.circ(px(VCE),py(IC),7,C.f,true);
  a.line(px(VCE),y0,px(VCE),py(IC),C.f,1.2,[3,3]);
  a.line(x0,py(IC),px(VCE),py(IC),C.f,1.2,[3,3]);
  a.txt('Q',px(VCE)+11,py(IC)-9,C.f,15);
  const colz=zona==='activa'?C.c:(zona==='saturación'?C.b:C.muted);
  a.g.fillStyle=colz;a.g.globalAlpha=0.14;a.g.fillRect(x0,y0+40,wv,32);a.g.globalAlpha=1;
  a.g.strokeStyle=colz;a.g.lineWidth=2;a.g.strokeRect(x0,y0+40,wv,32);
  a.txt('ZONA: '+zona.toUpperCase(),x0+wv/2,y0+61,colz,14,'center');
  // esquema
  const sx=470,sy=30;
  a.line(sx+50,sy,sx+50,sy+18,C.text,2);
  a.txt(NQ(Vcc)+' V',sx+56,sy+8,C.d,12);
  Rbox(a,sx+36,sy+18,28,44,'',C.a);a.txt('RC',sx+70,sy+44,C.a,11);
  a.line(sx+50,sy+62,sx+50,sy+86,C.text,2);
  a.line(sx+20,sy+102,sx+40,sy+102,C.text,2);
  a.line(sx+40,sy+84,sx+40,sy+120,C.text,2.5);
  a.line(sx+40,sy+95,sx+50,sy+86,C.text,2);
  a.line(sx+40,sy+110,sx+50,sy+120,C.text,2);
  a.arrow(sx+44,sy+114,sx+50,sy+120,C.text,2);
  a.txt('B',sx+16,sy+106,C.muted,11,'right');a.txt('C',sx+56,sy+82,C.muted,11);a.txt('E',sx+56,sy+128,C.muted,11);
  a.line(sx+50,sy+120,sx+50,sy+138,C.text,2);
  if(RE>0){Rbox(a,sx+36,sy+138,28,40,'',C.c);a.txt('RE',sx+70,sy+160,C.c,11);a.line(sx+50,sy+178,sx+50,sy+196,C.text,2);}
  else a.line(sx+50,sy+138,sx+50,sy+196,C.text,2);
  a.line(sx+16,sy+196,sx+84,sy+196,C.text,2);
  Rbox(a,sx-58,sy+89,76,26,a.st.c==='div'?'R1‖R2':'RB',C.b);
  a.line(sx+18,sy+102,sx+20,sy+102,C.text,2);
  const bx=444,by=282;
  [['Vth',NQ(Vth)+' V'],['Rth',Ohm(Rth)],['IB',NQ(IB*1e6)+' µA'],['IC',NQ(IC*1000)+' mA'],['VCE',NQ(VCE)+' V']].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*24,C.muted,12);a.txt(d[1],bx+180,by+i*24,C.text,12,'right');});
  a.html(`${a.st.c==='div'?`Divisor: V<sub>th</sub> = ${NQ(Vth)} V, R<sub>th</sub> = ${Ohm(Rth)} (con R2 = 10 kΩ fija).`:(a.st.c==='conm'?'Entrada de 5 V (salida de un microcontrolador) atacando la base a través de R<sub>B</sub>.':'Polarización fija: R<sub>B</sub> desde Vcc a la base.')}<br>
  I<sub>B</sub> = (V<sub>th</sub> − 0,7)/(R<sub>th</sub> + (β+1)R<sub>E</sub>) = <b>${NQ(IB*1e6)} µA</b> ⇒ si estuviera en activa, I<sub>C</sub> = βI<sub>B</sub> = ${NQ(B*IB*1000)} mA, frente a I<sub>C sat</sub> = <b>${NQ(ICsat*1000)} mA</b>.<br>
  ${zona==='saturación'?'Como βI<sub>B</sub> &gt; I<sub>C sat</sub>, el transistor está <b>SATURADO</b>: la corriente la fija el circuito exterior y V<sub>CE</sub> = 0,2 V. Funciona como un interruptor cerrado.':(zona==='corte'?'No hay corriente de base: transistor en <b>CORTE</b>, V<sub>CE</sub> = Vcc (interruptor abierto).':`Está en <b>zona ACTIVA</b>: I<sub>C</sub> = βI<sub>B</sub> = ${NQ(IC*1000)} mA y V<sub>CE</sub> = ${NQ(VCE)} V. Potencia disipada P = V<sub>CE</sub>I<sub>C</sub> = ${NQ(VCE*IC*1000)} mW.`)}<br>
  <span class="hint">Sube β y observa: con divisor y R<sub>E</sub> el punto Q apenas se mueve (ésa es su ventaja); con R<sub>B</sub> fija se desplaza muchísimo, y por eso no se usa.</span>`);}});

/* T4b · MOSFET */
SIMS.mosfet=el=>build(el,{w:660,h:370,
 sliders:[{k:'vgs',v:6,min:0,max:10,step:0.1,l:'V_GS',u:'V'},{k:'vdd',v:12,min:3,max:20,step:0.5,l:'V_DD',u:'V'},
  {k:'rd',v:2000,min:100,max:10000,step:100,l:'R_D',u:'Ω'},{k:'K',v:0.48,min:0.05,max:2,step:0.01,l:'K',u:'mA/V²'},
  {k:'vt',v:3,min:0.5,max:5,step:0.1,l:'V_T',u:'V'}],
 draw(a){a.clear();
  const VGS=a.st.vgs, VDD=a.st.vdd, RD=a.st.rd, K=a.st.K/1000, VT=a.st.vt;
  const ov=VGS-VT;
  let ID=0, zona='corte', VDS=VDD;
  if(ov>0){const IDsat=K/2*ov*ov, VDSsat=VDD-IDsat*RD;
    if(VDSsat>=ov){ID=IDsat;VDS=VDSsat;zona='saturación (activa)';}
    else {let v=0.01;
      for(let i=0;i<300;i++){const f=K*(ov*v-v*v/2)*RD+v-VDD, df=K*(ov-v)*RD+1;v-=f/df;if(v<0.001)v=0.001;}
      VDS=v;ID=K*(ov*VDS-VDS*VDS/2);zona='óhmica';}}
  const x0=66,y0=300,wv=330,hv=230;
  const IDmax=Math.max(VDD/RD*1.12,K/2*Math.pow(10-VT,2)*1.05), Vmax=VDD*1.12;
  const px=v=>x0+v/Vmax*wv, py=i=>y0-i/IDmax*hv;
  a.line(x0,y0,x0+wv+10,y0,C.muted,1.5);a.line(x0,y0,x0,y0-hv-14,C.muted,1.5);
  a.txt('V_DS (V)',x0+wv+10,y0+30,C.muted,11,'right');a.txt('I_D (mA)',x0-4,y0-hv-20,C.muted,11);
  ticks(Vmax,4).forEach(v=>{a.line(px(v),y0,px(v),y0+4,C.muted,1);a.txt(NQ(v),px(v),y0+17,C.muted,10,'center');});
  ticks(IDmax*1000,4).forEach(i=>{const d=i/1000;if(d<=IDmax){a.line(x0-4,py(d),x0,py(d),C.muted,1);a.txt(NQ(i),x0-7,py(d)+4,C.muted,10,'right');}});
  for(let g=1;g<=5;g++){const vg=VT+g*(10-VT)/5, o=vg-VT, act=Math.abs(vg-VGS)<(10-VT)/10;
    a.g.strokeStyle=act?C.a:C.grid;a.g.lineWidth=act?2.6:1.3;a.g.beginPath();
    for(let v=0;v<=Vmax;v+=0.05){const i=v<o?K*(o*v-v*v/2):K/2*o*o;
      if(i>IDmax)break;
      v===0?a.g.moveTo(px(v),py(i)):a.g.lineTo(px(v),py(i));}
    a.g.stroke();}
  a.txt('V_GS crece ↑',x0+wv-6,y0-hv+4,C.muted,11,'right');
  a.g.strokeStyle=C.e;a.g.lineWidth=1.6;a.g.setLineDash([5,4]);a.g.beginPath();
  for(let v=0;v<=Vmax;v+=0.05){const i=K/2*v*v;if(i>IDmax)break;a.g.lineTo(px(v),py(i));}
  a.g.stroke();a.g.setLineDash([]);
  const vf=Math.min(Vmax,Math.sqrt(2*IDmax/K)*0.85);
  a.txt('V_DS = V_GS − V_T',px(vf)+6,py(K/2*vf*vf),C.e,10);
  a.g.strokeStyle=C.f;a.g.lineWidth=2.6;a.g.beginPath();
  a.g.moveTo(px(0),py(VDD/RD));a.g.lineTo(px(VDD),py(0));a.g.stroke();
  a.txt('recta de carga',px(VDD*0.10),py(VDD/RD*0.86)-6,C.f,11);
  a.circ(px(VDS),py(ID),7,C.f,true);a.txt('Q',px(VDS)+11,py(ID)+20,C.f,15);
  const bx=444,by=76;
  a.txt('MOSFET NMOS de enriquecimiento',bx,by-30,C.text,12);
  [['V_GS',NQ(VGS)+' V'],['V_GS − V_T',NQ(ov)+' V'],['I_D',NQ(ID*1000)+' mA'],['V_DS',NQ(VDS)+' V'],['zona',zona]].forEach((d,i)=>{
    a.txt(d[0],bx,by+i*26,C.muted,12);a.txt(d[1],bx+180,by+i*26,i===4?(zona==='corte'?C.muted:(zona==='óhmica'?C.b:C.c)):C.text,12,'right');});
  a.txt('I_D = (K/2)(V_GS − V_T)²',bx,by+152,C.a,12);
  a.txt('válida sólo en saturación',bx,by+172,C.muted,11);
  a.txt('V_DS = V_DD − I_D·R_D',bx,by+198,C.f,12);
  a.html(`V<sub>GS</sub> = ${NQ(VGS)} V con V<sub>T</sub> = ${NQ(VT)} V ⇒ ${ov>0?`V<sub>GS</sub> − V<sub>T</sub> = <b>${NQ(ov)} V</b>`:'<b>por debajo del umbral ⇒ CORTE</b>'}.<br>
  ${ov>0?`I<sub>D</sub> = (K/2)(V<sub>GS</sub>−V<sub>T</sub>)² = (${NQ(a.st.K)}/2)·${NQ(ov)}² = <b>${NQ(ID*1000)} mA</b> · V<sub>DS</sub> = V<sub>DD</sub> − I<sub>D</sub>R<sub>D</sub> = <b>${NQ(VDS)} V</b>.<br>
  Comprobación: V<sub>DS</sub> ${VDS>=ov?'≥':'&lt;'} V<sub>GS</sub> − V<sub>T</sub> ⇒ <b>zona ${zona}</b>.`:'Con V<sub>GS</sub> por debajo del umbral no hay canal: I<sub>D</sub> = 0 y V<sub>DS</sub> = V<sub>DD</sub>.'}<br>
  <span class="hint">Por la puerta NO circula corriente: V<sub>GS</sub> es directamente la tensión del divisor de puerta, sin caída en R<sub>G</sub>. Ésa es la gran diferencia con el BJT, y la trampa del problema 3 del examen.</span>`);}});

/* T5 · Amplificador operacional */
SIMS.ao=el=>build(el,{w:660,h:370,
 selects:[{k:'c',v:'noinv',l:'configuración',opts:[['noinv','no inversor'],['inv','inversor'],['seg','seguidor'],['sum','sumador inversor'],['comp','comparador'],['acond','acondicionamiento de sensor']]}],
 sliders:[{k:'vi',v:0.3,min:-5,max:5,step:0.05,l:'V entrada',u:'V'},{k:'r1',v:10,min:1,max:100,step:1,l:'R1',u:'kΩ'},
  {k:'rf',v:100,min:1,max:200,step:1,l:'Rf',u:'kΩ'},{k:'vcc',v:15,min:5,max:18,step:0.5,l:'±Vcc',u:'V'},{k:'vref',v:2.5,min:-5,max:5,step:0.1,l:'V referencia',u:'V'}],
 draw(a){a.clear();
  const Vi=a.st.vi, R1=a.st.r1, Rf=a.st.rf, Vcc=a.st.vcc, Vref=a.st.vref;
  const Vsat=Vcc-2, m0=5/0.45;
  let Vo=0, G=0, exp='';
  if(a.st.c==='noinv'){G=1+Rf/R1;Vo=G*Vi;exp=`V<sub>o</sub> = V<sub>i</sub>(1 + R<sub>f</sub>/R<sub>1</sub>) = ${NQ(G)}·V<sub>i</sub>`;}
  else if(a.st.c==='inv'){G=-Rf/R1;Vo=G*Vi;exp=`V<sub>o</sub> = −(R<sub>f</sub>/R<sub>1</sub>)V<sub>i</sub> = ${NQ(G)}·V<sub>i</sub>`;}
  else if(a.st.c==='seg'){G=1;Vo=Vi;exp='V<sub>o</sub> = V<sub>i</sub>: ganancia 1, entrada de impedancia altísima';}
  else if(a.st.c==='sum'){G=-Rf/R1;Vo=G*(Vi+Vref);exp=`V<sub>o</sub> = −R<sub>f</sub>(V<sub>i</sub> + V<sub>ref</sub>)/R<sub>1</sub> = ${NQ(G)}(V<sub>i</sub> + ${NQ(Vref)})`;}
  else if(a.st.c==='comp'){Vo=Vi>Vref?Vsat:-Vsat;exp=`salida en ${Vi>Vref?'+':'−'}V<sub>sat</sub> porque V<sub>i</sub> ${Vi>Vref?'>':'<'} V<sub>ref</sub> = ${NQ(Vref)} V`;}
  else {G=m0;Vo=m0*Vi;exp=`sensor de 10 mV/°C a un ADC de 0–5 V: m = 5/0,45 = ${NQ(m0)} y n = 0`;}
  const sat=Math.abs(Vo)>Vsat, Vreal=sat?Math.sign(Vo)*Vsat:Vo;
  // esquema
  const ax=172,ay=120;
  const noInv=(a.st.c==='noinv'||a.st.c==='acond'||a.st.c==='seg');
  a.g.fillStyle=C.bg;a.g.beginPath();a.g.moveTo(ax,ay-42);a.g.lineTo(ax,ay+42);a.g.lineTo(ax+72,ay);a.g.closePath();a.g.fill();
  a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.stroke();
  a.txt(noInv?'+':'−',ax+10,ay-15,C.text,15);a.txt(noInv?'−':'+',ax+10,ay+23,C.text,15);
  a.line(ax+72,ay,ax+140,ay,C.text,2);
  a.txt('Vo',ax+146,ay+5,C.a,13);
  if(noInv){
    // entrada a la patilla + (arriba)
    a.line(ax-130,ay-22,ax,ay-22,C.text,2);a.txt('Vi',ax-130,ay-30,C.f,13);
    // nudo inversor abajo, realimentación por debajo
    a.line(ax,ay+22,ax-34,ay+22,C.text,2);
    a.line(ax+108,ay,ax+108,ay+86,C.text,2);
    a.line(ax+108,ay+86,ax-34,ay+86,C.text,2);
    a.line(ax-34,ay+86,ax-34,ay+22,C.text,2);
    if(a.st.c!=='seg'){Rbox(a,ax+8,ay+72,62,28,'Rf',C.c);a.txt(NQ(Rf)+' kΩ',ax+39,ay+114,C.c,11,'center');
      a.line(ax-34,ay+22,ax-48,ay+22,C.text,2);
      Rbox(a,ax-110,ay+8,62,28,'R1',C.f);a.txt(NQ(R1)+' kΩ',ax-79,ay+2,C.f,11,'center');
      a.line(ax-110,ay+22,ax-128,ay+22,C.text,2);a.line(ax-128,ay+22,ax-128,ay+54,C.text,2);
      a.txt('⏚',ax-132,ay+70,C.muted,15);}
    else a.txt('realimentación total',ax+39,ay+114,C.muted,11,'center');
  } else if(a.st.c==='comp'){
    a.line(ax-130,ay-22,ax,ay-22,C.text,2);a.txt('Vref = '+NQ(Vref)+' V',ax-130,ay-30,C.d,12);
    a.line(ax-130,ay+22,ax,ay+22,C.text,2);a.txt('Vi',ax-130,ay+14,C.f,13);
    a.txt('sin realimentación',ax+39,ay+70,C.muted,11,'center');
  } else { // inversor y sumador
    a.line(ax+108,ay,ax+108,ay-78,C.text,2);a.line(ax+108,ay-78,ax-34,ay-78,C.text,2);
    a.line(ax-34,ay-78,ax-34,ay-22,C.text,2);a.line(ax-34,ay-22,ax,ay-22,C.text,2);
    Rbox(a,ax+8,ay-92,62,28,'Rf',C.c);a.txt(NQ(Rf)+' kΩ',ax+39,ay-100,C.c,11,'center');
    a.line(ax-34,ay-22,ax-48,ay-22,C.text,2);
    Rbox(a,ax-110,ay-36,62,28,'R1',C.f);a.txt(NQ(R1)+' kΩ',ax-79,ay-44,C.f,11,'center');
    a.line(ax-110,ay-22,ax-140,ay-22,C.text,2);a.txt('Vi',ax-140,ay-48,C.f,13);
    if(a.st.c!=='sum'){a.line(ax,ay+22,ax-40,ay+22,C.text,2);a.line(ax-40,ay+22,ax-40,ay+50,C.text,2);a.txt('⏚',ax-44,ay+66,C.muted,15);}
    else {a.line(ax,ay+22,ax-22,ay+22,C.text,2);a.line(ax-22,ay+22,ax-22,ay+60,C.text,2);a.txt('⏚',ax-26,ay+76,C.muted,15);}
    if(a.st.c==='sum'){Rbox(a,ax-110,ay+8,62,26,'R1',C.d);
      a.line(ax-48,ay+21,ax-34,ay+21,C.text,2);a.line(ax-34,ay+21,ax-34,ay-22,C.text,2);
      a.line(ax-110,ay+21,ax-140,ay+21,C.text,2);a.txt('Vref = '+NQ(Vref)+' V',ax-140,ay+48,C.d,12);}
  }
  a.txt('Vi = '+NQ(Vi)+' V',20,ay+170,C.f,13);
  a.txt('±Vsat = ±'+NQ(Vsat)+' V',20,ay+192,C.muted,12);
  a.txt('Vo = '+NQ(Vreal)+' V'+(sat?'  (SATURA)':''),20,ay+216,sat?C.b:C.a,15);
  // transferencia
  const x0=400,y0=320,wv=240,hv=250;
  const M=Vcc, cx=x0+wv/2, cy=y0-hv/2;
  const px=v=>cx+v/5.5*wv/2, py=v=>cy-v/M*hv/2;
  a.line(x0,cy,x0+wv,cy,C.muted,1.4);a.line(cx,y0,cx,y0-hv,C.muted,1.4);
  a.txt('Vi',x0+wv,cy+18,C.muted,11,'right');a.txt('Vo',cx+8,y0-hv+2,C.muted,11);
  a.line(x0,py(Vsat),x0+wv,py(Vsat),C.b,1.3,[5,4]);
  a.line(x0,py(-Vsat),x0+wv,py(-Vsat),C.b,1.3,[5,4]);
  a.txt('+Vsat',x0+2,py(Vsat)-6,C.b,10);a.txt('−Vsat',x0+2,py(-Vsat)+14,C.b,10);
  a.g.strokeStyle=C.a;a.g.lineWidth=2.8;a.g.beginPath();
  for(let v=-5.5;v<=5.5;v+=0.02){let o;
    if(a.st.c==='comp')o=v>Vref?Vsat:-Vsat;
    else if(a.st.c==='sum')o=-Rf/R1*(v+Vref);
    else if(a.st.c==='acond')o=m0*v;
    else o=G*v;
    o=Math.max(-Vsat,Math.min(Vsat,o));
    v===-5.5?a.g.moveTo(px(v),py(o)):a.g.lineTo(px(v),py(o));}
  a.g.stroke();
  a.circ(px(Vi),py(Vreal),7,C.f,true);
  a.txt('curva de transferencia',x0,y0-hv-6,C.muted,11);
  a.html(`<b>${{noinv:'Amplificador no inversor',inv:'Amplificador inversor',seg:'Seguidor de tensión',sum:'Sumador inversor',comp:'Comparador',acond:'Acondicionamiento de sensor'}[a.st.c]}</b> · ${exp}.<br>
  Con V<sub>i</sub> = ${NQ(Vi)} V ⇒ V<sub>o</sub> ideal = ${NQ(Vo)} V ${sat?`⇒ <b>SATURA</b> en ${NQ(Vreal)} V (±V<sub>sat</sub> = ±(Vcc − 2) = ±${NQ(Vsat)} V)`:`= <b>${NQ(Vreal)} V</b> ✓ dentro del margen lineal`}.<br>
  ${a.st.c==='comp'?'Sin realimentación negativa NO hay cortocircuito virtual: la salida sólo puede estar en +Vsat o −Vsat.':'Reglas: V<sub>+</sub> = V<sub>−</sub> (cortocircuito virtual) y no entra corriente por las entradas.'}${a.st.c==='acond'?' Es el problema 2 del examen de enero de 2023: 10 mV/°C y 0–45 °C hacia un ADC de 0–5 V.':''}<br>
  <span class="hint">Sube la ganancia hasta que la salida choque con ±Vsat: eso es lo que limita en la práctica un diseño, junto con los 40 mA de corriente máxima de salida del TL084.</span>`);}});


/* ---- Mini-test: región de trabajo de BJT / MOSFET ---- */
SIMS.regionquiz=el=>{
  el.classList.add('qz');
  const R=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
  const f=(x,d)=>(Math.abs(x)<1e-9?0:x).toFixed(d==null?2:d).replace('.',',');
  function bjt(){
    const Vcc=pick([9,12,15]),Rc=pick([1,2.2,4.7]),beta=pick([50,100,150]),Rb=pick([10,47,100,220]);
    const Vi=pick([0.3,0.5,2,3,5,9]);
    const IB=Vi>0.7?(Vi-0.7)/Rb:0, Icsat=(Vcc-0.2)/Rc;
    let reg,why;
    if(Vi<0.7){reg='c';why=`V<sub>BE</sub> ≤ V<sub>i</sub> = ${f(Vi,1)} V &lt; 0,7 V ⇒ el diodo base-emisor no conduce: I<sub>B</sub> = 0 ⇒ <b>corte</b>.`;}
    else if(beta*IB>Icsat){reg='s';why=`I<sub>B</sub> = (${f(Vi,1)} − 0,7)/${Rb} k = ${f(IB*1000,1)} µA ⇒ βI<sub>B</sub> = ${f(beta*IB,1)} mA &gt; I<sub>C,sat</sub> = (${Vcc} − 0,2)/${f(Rc,1)} k = ${f(Icsat,1)} mA ⇒ <b>saturación</b> (I<sub>C</sub> la fija el circuito exterior).`;}
    else{reg='a';why=`I<sub>B</sub> = ${f(IB*1000,1)} µA ⇒ βI<sub>B</sub> = ${f(beta*IB,2)} mA &lt; I<sub>C,sat</sub> = ${f(Icsat,1)} mA ⇒ V<sub>CE</sub> = ${f(Vcc-beta*IB*Rc,1)} V &gt; 0,2 V ⇒ <b>zona activa</b>.`;}
    return {q:`BJT NPN, V<sub>CC</sub> = ${Vcc} V, R<sub>C</sub> = ${f(Rc,1)} kΩ, β = ${beta}. Base a través de R<sub>B</sub> = ${Rb} kΩ desde V<sub>i</sub> = ${f(Vi,1)} V, emisor a masa, V<sub>BE</sub> = 0,7 V.`,opts:[['c','Corte'],['a','Activa'],['s','Saturación']],ok:reg,why};
  }
  function mos(){
    const VDD=pick([9,12]),RD=pick([1,2.2,4.7]),K=pick([1,2,4]),VT=pick([1.5,2,3]),VGS=pick([1,2.5,4,6]);
    let reg,why;
    if(VGS<=VT){reg='c';why=`V<sub>GS</sub> = ${f(VGS,1)} V ≤ V<sub>T</sub> = ${f(VT,1)} V ⇒ no hay canal ⇒ <b>corte</b>.`;}
    else{const ID=K/2*(VGS-VT)**2,VDS=VDD-ID*RD;
      if(VDS>=VGS-VT){reg='s';why=`Supuesta saturación: I<sub>D</sub> = (${K}/2)(${f(VGS-VT,1)})² = ${f(ID,2)} mA ⇒ V<sub>DS</sub> = ${VDD} − ${f(ID*RD,2)} = ${f(VDS,2)} V ≥ V<sub>GS</sub>−V<sub>T</sub> = ${f(VGS-VT,1)} V ✓ ⇒ <b>saturación</b>.`;}
      else{reg='o';why=`Supuesta saturación: V<sub>DS</sub> = ${VDD} − ${f(ID*RD,2)} = ${f(VDS,2)} V &lt; V<sub>GS</sub>−V<sub>T</sub> = ${f(VGS-VT,1)} V ✗ ⇒ el MOSFET está en <b>zona óhmica</b> (hay que resolver con la ecuación cuadrática).`;}}
    return {q:`MOSFET de canal N, V<sub>DD</sub> = ${VDD} V, R<sub>D</sub> = ${f(RD,1)} kΩ, K = ${K} mA/V², V<sub>T</sub> = ${f(VT,1)} V, fuente a masa y V<sub>GS</sub> = ${f(VGS,1)} V (I<sub>G</sub> = 0).`,opts:[['c','Corte'],['o','Óhmica'],['s','Saturación']],ok:reg,why};
  }
  const box=document.createElement('div');el.append(box);
  let score=0,done=0,qs=[];
  function gen(){qs=[bjt(),bjt(),mos()];score=0;done=0;render();}
  function render(){
    box.innerHTML='';
    qs.forEach((q,n)=>{
      const d=document.createElement('div');d.style.margin='0 0 14px';
      d.innerHTML=`<p><b>${n+1}.</b> ${q.q}</p>`;
      const o=document.createElement('div');o.className='qopts';
      const fb=document.createElement('div');fb.className='readout';fb.style.display='none';
      q.opts.forEach(([k,t])=>{const b=document.createElement('button');b.className='qo';b.textContent=t;
        b.onclick=()=>{if(q.done)return;q.done=true;done++;
          [...o.children].forEach(x=>{x.disabled=true;});
          const good=k===q.ok;if(good)score++;
          b.classList.add(good?'ok':'bad');
          if(!good)[...o.children].forEach((x,j)=>{if(q.opts[j][0]===q.ok)x.classList.add('ok');});
          fb.style.display='block';fb.innerHTML=(good?'✔ Correcto. ':'✘ No. ')+q.why;
          sc.textContent=`Aciertos: ${score}/${done}`;};
        o.append(b);});
      d.append(o,fb);box.append(d);});
    const nb=document.createElement('button');nb.textContent='Nuevas preguntas';nb.onclick=gen;
    const sc=document.createElement('span');sc.style.marginLeft='12px';sc.style.fontSize='13px';sc.textContent='Aciertos: 0/0';
    box.append(nb,sc);
  }
  gen();
};

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
