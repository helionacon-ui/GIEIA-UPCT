/* ---- Análisis de Circuitos: figuras interactivas ---- */
const Rbox=(a,x,y,w,h,lab,col)=>{a.g.fillStyle=C.bg;a.g.fillRect(x,y,w,h);a.g.strokeStyle=col||C.text;a.g.lineWidth=2;a.g.strokeRect(x,y,w,h);
  a.txt(lab,x+w/2,y+h/2+4,col||C.text,12,'center');};
const Fte=(a,x,y,r,lab)=>{a.circ(x,y,r,C.d,false);a.line(x-r*0.5,y,x+r*0.5,y,C.d,2);a.line(x,y-r*0.5,x,y+r*0.5,C.d,2);a.txt(lab,x+r+8,y+5,C.d,12);};

SIMS.elementos=el=>build(el,{w:640,h:380,
 selects:[{k:'e',v:'R',l:'elemento',opts:[['R','resistencia R'],['L','bobina L'],['C','condensador C']]}],
 sliders:[{k:'f',v:50,min:10,max:200,step:5,l:'frecuencia',u:'Hz'},{k:'val',v:1,min:0.2,max:3,step:0.1,l:'valor (R·10Ω / L·0,1H / C·100µF)',u:''}],
 draw(a){a.clear();const e=a.st.e,f=a.st.f,k=a.st.val;const w=2*Math.PI*f;
  let X,fase,lab,det;
  if(e==='R'){X=10*k;fase=0;lab='v e i EN FASE';det=`Resistencia R = ${F(10*k)} Ω. v = R·i : la corriente sigue a la tensión sin retraso. Consume potencia real P = I²R y no tiene reactiva.`;}
  else if(e==='L'){X=w*0.1*k;fase=-90;lab='la corriente SE RETRASA 90°';det=`Bobina L = ${F(0.1*k)} H ⇒ X_L = ωL = ${F(X)} Ω. v = L·di/dt : la tensión va 90° por delante. No consume potencia activa, solo intercambia energía (Q > 0, inductiva).`;}
  else{X=1/(w*1e-4*k);fase=90;lab='la corriente SE ADELANTA 90°';det=`Condensador C = ${F(100*k)} µF ⇒ X_C = 1/ωC = ${F(X)} Ω. i = C·dv/dt : la corriente va 90° por delante. Q < 0 (entrega reactiva).`;}
  const x0=50,y0=140,wv=380,amp=70;
  a.line(x0,y0,x0+wv,y0,C.grid,1.5);
  a.g.lineWidth=3;a.g.strokeStyle=C.a;a.g.beginPath();
  for(let p=0;p<=wv;p+=2){const t=p/wv*4*Math.PI;const y=amp*Math.sin(t);p===0?a.g.moveTo(x0,y0-y):a.g.lineTo(x0+p,y0-y);}a.g.stroke();
  a.g.strokeStyle=C.f;a.g.beginPath();
  for(let p=0;p<=wv;p+=2){const t=p/wv*4*Math.PI;const y=amp*0.75*Math.sin(t+fase*Math.PI/180);p===0?a.g.moveTo(x0,y0-y):a.g.lineTo(x0+p,y0-y);}a.g.stroke();
  a.txt('v(t)',x0+wv+8,y0-amp+10,C.a,13);a.txt('i(t)',x0+wv+8,y0+amp,C.f,13);
  a.txt(lab,x0,40,C.text,14);
  const cx=520,cy=270,u=60;
  a.axes(cx,cy,u,-1.2,1.2,-1.2,1.2);
  a.arrow(cx,cy,cx+u,cy,C.a,3);a.txt('V',cx+u+6,cy-4,C.a,13);
  const ang=fase*Math.PI/180;
  a.arrow(cx,cy,cx+0.8*u*Math.cos(ang),cy-0.8*u*Math.sin(ang),C.f,3);a.txt('I',cx+0.8*u*Math.cos(ang)+8,cy-0.8*u*Math.sin(ang),C.f,13);
  a.html(`${det}<br><span class="hint">Mnemotecnia: <b>ELI the ICE man</b> — en la bobina (L) la tensión E va antes que la I; en el condensador (C) la I va antes que la E. En continua estacionaria la bobina es un cable y el condensador un circuito abierto.</span>`);}});

SIMS.reduccion=el=>build(el,{w:640,h:380,
 sliders:[{k:'E',v:60,min:10,max:120,step:5,l:'fuente E',u:'V'},{k:'R1',v:10,min:2,max:40,step:1,l:'R₁ (serie)',u:'Ω'},{k:'R2',v:40,min:5,max:100,step:5,l:'R₂ (paralelo)',u:'Ω'},{k:'R3',v:60,min:5,max:100,step:5,l:'R₃ (paralelo)',u:'Ω'},{k:'R4',v:6,min:0,max:40,step:1,l:'R₄ (serie)',u:'Ω'}],
 draw(a){a.clear();const E=a.st.E,R1=a.st.R1,R2=a.st.R2,R3=a.st.R3,R4=a.st.R4;
  const Rp=R2*R3/(R2+R3),Req=R1+Rp+R4,IT=E/Req,Vp=IT*Rp,I2=Vp/R2,I3=Vp/R3,P=E*IT;
  const xL=70,xR=570,yT=90,yB=300;
  const yM=(yT+yB)/2;
  // lado izquierdo: fuente
  a.line(xL,yT,xL,yM-22,C.text,2);a.line(xL,yM+22,xL,yB,C.text,2);
  Fte(a,xL,yM,22,F(E)+' V');
  // rama superior: R1 -> nodo A -> (paralelo) -> nodo B -> R4
  const xA=250,xB=430;
  a.line(xL,yT,160,yT,C.text,2);Rbox(a,160,yT-10,56,20,'R₁');a.line(216,yT,xA,yT,C.text,2);
  // paralelo entre xA y xB: dos ramas horizontales a distinta altura
  const y2=yT-52,y3=yT+52;
  a.line(xA,yT,xA,y2,C.text,2);a.line(xA,yT,xA,y3,C.text,2);
  a.line(xA,y2,xA+30,y2,C.text,2);Rbox(a,xA+30,y2-10,56,20,'R₂',C.f);a.line(xA+86,y2,xB,y2,C.text,2);
  a.line(xA,y3,xA+30,y3,C.text,2);Rbox(a,xA+30,y3-10,56,20,'R₃',C.c);a.line(xA+86,y3,xB,y3,C.text,2);
  a.line(xB,y2,xB,y3,C.text,2);
  a.circ(xA,yT,4,C.text,true);a.circ(xB,yT,4,C.text,true);
  a.line(xB,yT,470,yT,C.text,2);Rbox(a,470,yT-10,56,20,'R₄');a.line(526,yT,xR,yT,C.text,2);
  a.line(xR,yT,xR,yB,C.text,2);a.line(xL,yB,xR,yB,C.text,2);
  // etiquetas de corriente
  a.arrow(150,yB-18,220,yB-18,C.a,2.5);a.txt('I_T = '+F(IT)+' A',228,yB-13,C.a,13);
  a.txt(F(I2)+' A',xA+96,y2-14,C.f,12);a.txt(F(I3)+' A',xA+96,y3+22,C.c,12);
  a.txt('R₂∥R₃ = '+F(Rp)+' Ω',xA+10,y3+46,C.muted,12);
  a.html(`R₂∥R₃ = R₂R₃/(R₂+R₃) = <b>${F(Rp)} Ω</b> ⇒ R_eq = R₁ + R₂∥R₃ + R₄ = <b>${F(Req)} Ω</b> ⇒ I_T = E/R_eq = <b>${F(IT)} A</b>.<br>
  Divisor de corriente: I₂ = I_T·R₃/(R₂+R₃) = <b>${F(I2)} A</b>, I₃ = <b>${F(I3)} A</b> (la mayor corriente va por la menor resistencia). Tensión del paralelo: ${F(Vp)} V. P_gen = E·I_T = <b>${F(P)} W</b>.<br>
  <span class="hint">Balance de potencias: I_T²(R₁+R₄) + I₂²R₂ + I₃²R₃ = ${F(IT*IT*(R1+R4)+I2*I2*R2+I3*I3*R3)} W ✓. Es el problema 1 del boletín del tema 2: reduce, calcula I_T y deshaz el camino con los divisores.</span>`);}});

SIMS.thevenin=el=>build(el,{w:640,h:400,
 sliders:[{k:'E1',v:20,min:5,max:50,step:1,l:'E₁',u:'V'},{k:'R1',v:5,min:1,max:30,step:1,l:'R₁',u:'Ω'},{k:'E2',v:10,min:0,max:50,step:1,l:'E₂',u:'V'},{k:'R2',v:10,min:1,max:30,step:1,l:'R₂',u:'Ω'},{k:'RL',v:3.5,min:0.5,max:20,step:0.25,l:'carga R_L',u:'Ω'}],
 draw(a){a.clear();const E1=a.st.E1,R1=a.st.R1,E2=a.st.E2,R2=a.st.R2,RL=a.st.RL;
  const Vth=(E1/R1+E2/R2)/(1/R1+1/R2),Rth=R1*R2/(R1+R2);
  const I=Vth/(Rth+RL),P=I*I*RL,Pmax=Vth*Vth/(4*Rth);
  const x0=60,yT=70,yB=170;
  a.line(x0,yT,x0,yT+28,C.text,2);a.line(x0,yB-28,x0,yB,C.text,2);Fte(a,x0,(yT+yB)/2,22,F(Vth)+' V');
  a.line(x0,yT,x0+60,yT,C.text,2);Rbox(a,x0+60,yT-10,56,20,'R_th');a.line(x0+116,yT,x0+190,yT,C.text,2);
  Rbox(a,x0+190,yT-10,56,20,'R_L',C.a);
  a.line(x0+246,yT,x0+300,yT,C.text,2);a.line(x0+300,yT,x0+300,yB,C.text,2);a.line(x0,yB,x0+300,yB,C.text,2);
  a.circ(x0+180,yT,4,C.a,true);a.txt('a',x0+176,yT-14,C.muted,11);
  a.circ(x0+300,yB,4,C.a,true);a.txt('b',x0+306,yB+14,C.muted,11);
  a.txt('V_th = '+F(Vth)+' V · R_th = '+F(Rth)+' Ω · I_N = '+F(Vth/Rth)+' A',x0,40,C.d,13);
  const bx=70,by=375,bw=500,bh=170;
  a.line(bx,by,bx+bw,by,C.text,1.5);a.line(bx,by,bx,by-bh,C.text,1.5);
  a.txt('R_L (Ω)',bx+bw-44,by+17,C.muted,11);a.txt('P (W)',bx+4,by-bh+2,C.muted,11);
  const rmax=20,u=bw/rmax;
  a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
  for(let p=2;p<=bw;p+=2){const r=p/u;const ii=Vth/(Rth+r);const pp=ii*ii*r;const Y=by-pp/Pmax*(bh-16);p===2?a.g.moveTo(bx+p,Y):a.g.lineTo(bx+p,Y);}
  a.g.stroke();
  a.line(bx+Rth*u,by,bx+Rth*u,by-bh+10,C.c,1.5,[4,3]);a.txt('R_L = R_th (MTP)',bx+Rth*u+6,by-bh+22,C.c,11);
  a.circ(bx+RL*u,by-P/Pmax*(bh-16),5,C.b,true);
  for(let i=5;i<=20;i+=5){a.txt(i,bx+i*u,by+16,C.muted,10,'center');}
  a.html(`Millman: V_th = (E₁/R₁ + E₂/R₂)/(1/R₁ + 1/R₂) = <b>${F(Vth)} V</b> · R_th = R₁∥R₂ = <b>${F(Rth)} Ω</b> · Norton: I_N = V_th/R_th = ${F(Vth/Rth)} A.<br>
  Con R_L = ${F(RL)} Ω: I = ${F(I)} A y <b>P = ${F(P)} W</b>; el máximo posible es ${F(Pmax)} W y se da en R_L = R_th.<br>
  <span class="hint">La curva es plana en el máximo: por eso en la práctica 5 basta ajustar el potenciómetro cerca de R_th. En MTP el rendimiento es solo del 50 % (se disipa lo mismo dentro que en la carga). En alterna, la carga debe ser la CONJUGADA.</span>`);}});

SIMS.fasor=el=>build(el,{w:640,h:390,
 sliders:[{k:'A1',v:100,min:20,max:150,step:5,l:'V₁ (eficaz)',u:'V'},{k:'f1',v:0,min:-180,max:180,step:15,l:'fase de V₁',u:'°'},{k:'A2',v:80,min:0,max:150,step:5,l:'V₂ (eficaz)',u:'V'},{k:'f2',v:90,min:-180,max:180,step:15,l:'fase de V₂',u:'°'}],
 draw(a){a.clear();const A1=a.st.A1,f1=a.st.f1*Math.PI/180,A2=a.st.A2,f2=a.st.f2*Math.PI/180;
  const x=A1*Math.cos(f1)+A2*Math.cos(f2),y=A1*Math.sin(f1)+A2*Math.sin(f2);
  const M=Math.hypot(x,y),ang=Math.atan2(y,x)*180/Math.PI;
  const cx=170,cy=190,u=0.62;
  a.line(cx-150,cy,cx+150,cy,C.grid,1);a.line(cx,cy-150,cx,cy+150,C.grid,1);
  a.arrow(cx,cy,cx+A1*u*Math.cos(f1),cy-A1*u*Math.sin(f1),C.a,3);a.txt('V₁',cx+A1*u*Math.cos(f1)*1.1+4,cy-A1*u*Math.sin(f1)*1.1,C.a,13);
  a.arrow(cx+A1*u*Math.cos(f1),cy-A1*u*Math.sin(f1),cx+x*u,cy-y*u,C.f,2,[5,4]);
  a.arrow(cx,cy,cx+A2*u*Math.cos(f2),cy-A2*u*Math.sin(f2),C.f,3);a.txt('V₂',cx+A2*u*Math.cos(f2)*1.12+4,cy-A2*u*Math.sin(f2)*1.12,C.f,13);
  a.arrow(cx,cy,cx+x*u,cy-y*u,C.c,3.5);a.txt('V₁+V₂',cx+x*u+6,cy-y*u-6,C.c,13);
  const x0=360,y0=190,wv=240,amp=70;
  a.line(x0,y0,x0+wv,y0,C.grid,1.5);
  const pl=(A,ph,col,wd)=>{a.g.strokeStyle=col;a.g.lineWidth=wd;a.g.beginPath();
   for(let p=0;p<=wv;p+=2){const t=p/wv*4*Math.PI;const yy=A/150*amp*Math.sin(t+ph);p===0?a.g.moveTo(x0,y0-yy):a.g.lineTo(x0+p,y0-yy);}a.g.stroke();};
  pl(A1,f1,C.a,2.5);pl(A2,f2,C.f,2.5);pl(M,Math.atan2(y,x),C.c,3.5);
  a.txt('la suma en el tiempo = la suma fasorial',x0,60,C.muted,12);
  a.html(`V₁ = ${F(A1)}∠${a.st.f1}° y V₂ = ${F(A2)}∠${a.st.f2}° ⇒ en binómica ${F(x)} ${y>=0?'+':'−'} j${F(Math.abs(y))} = <b>${F(M)}∠${F(ang)}°</b> V.<br>
  <span class="hint">Los módulos NO se suman salvo que las fases coincidan: 100∠0° + 100∠90° = 141,4∠45°, no 200. Suma y resta en binómica (a+jb); multiplicación y división en polar (módulos ×÷, ángulos +−).</span>`);}});

SIMS.impedancia=el=>build(el,{w:640,h:400,
 sliders:[{k:'R',v:30,min:1,max:100,step:1,l:'R',u:'Ω'},{k:'L',v:100,min:0,max:400,step:10,l:'L',u:'mH'},{k:'C',v:50,min:5,max:300,step:5,l:'C',u:'µF'},{k:'f',v:50,min:10,max:300,step:1,l:'frecuencia',u:'Hz'},{k:'V',v:230,min:50,max:400,step:10,l:'V (eficaz)',u:'V'}],
 draw(a){a.clear();const R=a.st.R,L=a.st.L/1000,Cc=a.st.C*1e-6,f=a.st.f,V=a.st.V;
  const w=2*Math.PI*f,XL=w*L,XC=1/(w*Cc),X=XL-XC,Z=Math.hypot(R,X),ph=Math.atan2(X,R);
  const I=V/Z,VR=I*R,VL=I*XL,VC=I*XC,f0=1/(2*Math.PI*Math.sqrt(Math.max(L,1e-9)*Cc));
  const cx=110,cy=215,u=Math.min(140/Math.max(R,Math.abs(X),1),3.2);
  a.line(cx-20,cy,cx+190,cy,C.grid,1);a.line(cx,cy-150,cx,cy+110,C.grid,1);
  a.arrow(cx,cy,cx+R*u,cy,C.a,3);a.txt('R = '+F(R),cx+R*u/2-20,cy+20,C.a,12);
  a.arrow(cx+R*u,cy,cx+R*u,cy-X*u,C.f,3);a.txt('X = '+F(X),cx+R*u+8,cy-X*u/2,C.f,12);
  a.arrow(cx,cy,cx+R*u,cy-X*u,C.c,3.5);a.txt('Z',cx+R*u/2-16,cy-X*u/2-8,C.c,14);
  a.txt('φ = '+F(ph*180/Math.PI)+'°',cx+8,cy-12,C.text,12);
  a.txt('triángulo de impedancias',cx-20,cy+50,C.muted,11);
  const bx=330,by=350,bw=270,bh=250;
  a.line(bx,by,bx+bw,by,C.text,1.5);a.line(bx,by,bx,by-bh,C.text,1.5);
  a.txt('f (Hz)',bx+bw-34,by+16,C.muted,11);a.txt('I',bx+4,by-bh+6,C.muted,12);
  const fmax=300,uf=bw/fmax,Imax=V/R;
  a.g.strokeStyle=C.a;a.g.lineWidth=2.5;a.g.beginPath();
  for(let p=2;p<=bw;p+=2){const ff=p/uf,ww=2*Math.PI*ff;const ZZ=Math.hypot(R,ww*L-1/(ww*Cc));const yy=(V/ZZ)/Imax;p===2?a.g.moveTo(bx+p,by-yy*(bh-20)):a.g.lineTo(bx+p,by-yy*(bh-20));}
  a.g.stroke();
  if(f0<fmax&&L>0){a.line(bx+f0*uf,by,bx+f0*uf,by-bh+14,C.c,1.5,[4,3]);a.txt('f₀ = '+F(f0)+' Hz',bx+f0*uf+4,by-bh+24,C.c,11);}
  a.line(bx+f*uf,by,bx+f*uf,by-bh+14,C.b,1.5);
  a.html(`X_L = ωL = ${F(XL)} Ω · X_C = 1/ωC = ${F(XC)} Ω ⇒ <b>Z = ${F(R)} ${X>=0?'+':'−'} j${F(Math.abs(X))} = ${F(Z)}∠${F(ph*180/Math.PI)}° Ω</b> (${Math.abs(X)<0.5?'RESONANTE':X>0?'inductivo: la corriente se retrasa':'capacitivo: la corriente se adelanta'}).<br>
  I = V/Z = <b>${F(I)} A</b> · V_R = ${F(VR)} V · V_L = ${F(VL)} V · V_C = ${F(VC)} V · comprobación √(V_R² + (V_L−V_C)²) = ${F(Math.hypot(VR,VL-VC))} V ✓<br>
  <span class="hint">Resonancia en f₀ = 1/(2π√(LC)) = ${F(f0)} Hz: ahí Z = R, la corriente es máxima y V_L = V_C pueden superar a la fuente (factor de calidad Q = ${F(Math.sqrt(L/Cc)/R)}).</span>`);}});

SIMS.potencia=el=>build(el,{w:640,h:400,
 sliders:[{k:'P',v:6300,min:500,max:15000,step:100,l:'potencia activa P',u:'W'},{k:'fp',v:0.85,min:0.4,max:1,step:0.01,l:'cos φ actual',u:''},{k:'fp2',v:0.95,min:0.5,max:1,step:0.01,l:'cos φ deseado',u:''},{k:'V',v:230,min:120,max:400,step:10,l:'tensión',u:'V'}],
 draw(a){a.clear();const P=a.st.P,fp=a.st.fp,fp2=Math.max(a.st.fp2,a.st.fp),V=a.st.V,w=2*Math.PI*50;
  const ph=Math.acos(fp),Q=P*Math.tan(ph),S=P/fp,I=S/V;
  const ph2=Math.acos(fp2),Q2=P*Math.tan(ph2),S2=P/fp2,I2=S2/V;
  const Qc=Q-Q2,Cf=Qc/(w*V*V);
  const cx=90,cy=300,u=Math.min(330/S,0.06);
  a.arrow(cx,cy,cx+P*u,cy,C.a,3.5);a.txt('P = '+F(P/1000)+' kW',cx+P*u/2-44,cy+22,C.a,13);
  a.arrow(cx+P*u,cy,cx+P*u,cy-Q*u,C.f,3);a.txt('Q = '+F(Q/1000)+' kvar',cx+P*u+8,cy-Q*u/2,C.f,12);
  a.arrow(cx,cy,cx+P*u,cy-Q*u,C.c,3.5);a.txt('S = '+F(S/1000)+' kVA',cx+P*u/2-76,cy-Q*u/2-10,C.c,13);
  if(Qc>0.5){a.arrow(cx+P*u,cy-Q*u,cx+P*u,cy-Q2*u,C.d,3);a.txt('Q_C',cx+P*u+8,cy-(Q+Q2)/2*u,C.d,12);
   a.g.setLineDash([5,4]);a.g.strokeStyle=C.muted;a.g.lineWidth=2;a.g.beginPath();a.g.moveTo(cx,cy);a.g.lineTo(cx+P*u,cy-Q2*u);a.g.stroke();a.g.setLineDash([]);
   a.txt("S' = "+F(S2/1000)+' kVA',cx+P*u/2-26,cy-Q2*u/2+18,C.muted,12);}
  a.txt('φ = '+F(ph*180/Math.PI)+'°',cx+14,cy-12,C.text,12);
  const bx=470,by=330,sc=Math.min(240/Math.max(I,1),4);
  a.g.fillStyle=C.a;a.g.fillRect(bx,by-I*sc,46,I*sc);a.txt(F(I)+' A',bx+2,by+16,C.a,12);
  a.g.fillStyle=C.c;a.g.fillRect(bx+70,by-I2*sc,46,I2*sc);a.txt(F(I2)+' A',bx+70,by+16,C.c,12);
  a.txt('corriente antes / después',bx-6,by+36,C.muted,11);
  a.html(`Triángulo de potencias: P = ${F(P)} W, Q = P·tan φ = ${F(Q)} var, S = P/cos φ = ${F(S)} VA ⇒ I = S/V = <b>${F(I)} A</b>.<br>
  Corrección a cos φ = ${F(fp2)}: Q_C = P(tan φ₁ − tan φ₂) = ${F(Qc)} var ⇒ <b>C = ${F(Cf*1e6)} µF</b> (monofásico, 50 Hz) y la corriente baja a <b>${F(I2)} A</b> (−${F((1-I2/I)*100)} %).<br>
  <span class="hint">La potencia activa NO cambia: el condensador solo devuelve reactiva. Con varias cargas usa Boucherot: suma P y Q por separado y después S = √(P²+Q²).</span>`);}});

SIMS.mallas=el=>build(el,{w:640,h:390,
 sliders:[{k:'E1',v:20,min:0,max:60,step:1,l:'E₁ (malla 1)',u:'V'},{k:'E2',v:10,min:-60,max:60,step:1,l:'E₂ (malla 2)',u:'V'},{k:'Ra',v:5,min:1,max:40,step:1,l:'R_a (propia 1)',u:'Ω'},{k:'Rb',v:10,min:1,max:40,step:1,l:'R_b (propia 2)',u:'Ω'},{k:'Rc',v:20,min:1,max:60,step:1,l:'R_c (compartida)',u:'Ω'}],
 draw(a){a.clear();const E1=a.st.E1,E2=a.st.E2,Ra=a.st.Ra,Rb=a.st.Rb,Rc=a.st.Rc;
  const A=Ra+Rc,B=-Rc,D=Rb+Rc,det=A*D-B*B;
  const I1=(E1*D-B*(-E2))/det,I2=(A*(-E2)-B*E1)/det,I3=I1-I2;
  const x0=100,y0=90,wq=180,hq=140;
  a.line(x0,y0,x0+2*wq,y0,C.text,2);a.line(x0,y0+hq,x0+2*wq,y0+hq,C.text,2);
  a.line(x0,y0,x0,y0+hq/2-22,C.text,2);a.line(x0,y0+hq/2+22,x0,y0+hq,C.text,2);
  a.line(x0+2*wq,y0,x0+2*wq,y0+hq/2-22,C.text,2);a.line(x0+2*wq,y0+hq/2+22,x0+2*wq,y0+hq,C.text,2);
  a.line(x0+wq,y0,x0+wq,y0+hq/2-28,C.text,2);a.line(x0+wq,y0+hq/2+28,x0+wq,y0+hq,C.text,2);
  Fte(a,x0,y0+hq/2,22,'');Fte(a,x0+2*wq,y0+hq/2,22,'');
  a.txt('E₁ = '+F(E1)+' V',x0-30,y0+hq/2+42,C.d,12);a.txt('E₂ = '+F(E2)+' V',x0+2*wq-30,y0+hq/2+42,C.d,12);
  Rbox(a,x0+wq/2-28,y0-10,56,20,'R_a');Rbox(a,x0+1.5*wq-28,y0-10,56,20,'R_b');
  Rbox(a,x0+wq-11,y0+hq/2-28,22,56,'',C.f);a.txt('R_c',x0+wq+18,y0+hq/2+4,C.f,12);
  const arc=(cx,cy,r,col,lab)=>{a.g.strokeStyle=col;a.g.lineWidth=2.5;a.g.beginPath();a.g.arc(cx,cy,r,0.35,5.5);a.g.stroke();
   a.arrow(cx+r*Math.cos(5.5),cy+r*Math.sin(5.5),cx+r*Math.cos(5.95),cy+r*Math.sin(5.95),col,2.5);a.txt(lab,cx-8,cy+5,col,14);};
  arc(x0+wq/2,y0+hq/2,40,C.a,'I₁');arc(x0+1.5*wq,y0+hq/2,40,C.c,'I₂');
  a.txt('I₃ = I₁ − I₂ = '+F(I3)+' A',x0+wq+34,y0+hq-12,C.f,12);
  a.html(`Sistema [R][I] = [E] con matriz <b>simétrica</b>:<br>
  (R_a+R_c)·I₁ − R_c·I₂ = E₁ → ${F(A)}·I₁ − ${F(Rc)}·I₂ = ${F(E1)}<br>
  −R_c·I₁ + (R_b+R_c)·I₂ = −E₂ → −${F(Rc)}·I₁ + ${F(D)}·I₂ = ${F(-E2)}<br>
  Δ = ${F(det)} ⇒ <b>I₁ = ${F(I1)} A</b>, <b>I₂ = ${F(I2)} A</b>; la rama compartida lleva I₃ = I₁ − I₂ = <b>${F(I3)} A</b>.<br>
  Potencias: P_a = ${F(I1*I1*Ra)} W, P_b = ${F(I2*I2*Rb)} W, P_c = ${F(I3*I3*Rc)} W (total ${F(I1*I1*Ra+I2*I2*Rb+I3*I3*Rc)} W).<br>
  <span class="hint">Si la matriz no sale simétrica hay un error de signo: es el mejor autocontrol. En alterna (tema 7) es idéntico cambiando R por Z compleja.</span>`);}});

SIMS.transitorio=el=>build(el,{w:640,h:400,
 selects:[{k:'t',v:'rc',l:'circuito',opts:[['rc','RC de primer orden (carga)'],['rl','RL de primer orden'],['rlc','RLC de segundo orden']]}],
 sliders:[{k:'R',v:100,min:5,max:400,step:5,l:'R',u:'Ω'},{k:'L',v:500,min:50,max:1000,step:50,l:'L',u:'mH'},{k:'C',v:100,min:10,max:500,step:10,l:'C',u:'µF'},{k:'E',v:100,min:10,max:200,step:10,l:'E',u:'V'}],
 draw(a){a.clear();const tp=a.st.t,R=a.st.R,L=a.st.L/1000,Cc=a.st.C*1e-6,E=a.st.E;
  const x0=70,y0=300,wq=520,hq=230;
  a.line(x0,y0,x0+wq,y0,C.text,1.5);a.line(x0,y0,x0,y0-hq,C.text,1.5);
  a.txt('t',x0+wq-4,y0+18,C.muted,12);
  let det='';
  if(tp==='rc'||tp==='rl'){const tau=tp==='rc'?R*Cc:L/R;const T=5*tau,u=wq/T;
   for(let i=1;i<=5;i++){a.line(x0+i*tau*u,y0,x0+i*tau*u,y0-hq+8,C.grid,1,[3,4]);a.txt(i+'τ',x0+i*tau*u,y0+15,C.muted,10,'center');}
   a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
   for(let p=0;p<=wq;p+=2){const t=p/u;const y=1-Math.exp(-t/tau);p===0?a.g.moveTo(x0,y0-y*(hq-20)):a.g.lineTo(x0+p,y0-y*(hq-20));}a.g.stroke();
   a.g.strokeStyle=C.f;a.g.beginPath();
   for(let p=0;p<=wq;p+=2){const t=p/u;const y=Math.exp(-t/tau);p===0?a.g.moveTo(x0,y0-y*(hq-20)):a.g.lineTo(x0+p,y0-y*(hq-20));}a.g.stroke();
   a.line(x0,y0-0.632*(hq-20),x0+tau*u,y0-0.632*(hq-20),C.b,1.5,[4,3]);a.txt('63,2 %',x0+6,y0-0.632*(hq-20)-6,C.b,11);
   a.txt(tp==='rc'?'v_C(t)':'i_L(t)',x0+wq-74,y0-hq+32,C.a,13);a.txt(tp==='rc'?'i(t)':'v_L(t)',x0+wq-74,y0-18,C.f,13);
   det=tp==='rc'?`RC: τ = RC = <b>${F(tau*1000)} ms</b> · v_C = E(1 − e^(−t/τ)) y i = (E/R)·e^(−t/τ) (pico I₀ = ${F(E/R*1000)} mA). A 2τ: v_C = ${F(E*(1-Math.exp(-2)))} V.`
    :`RL: τ = L/R = <b>${F(tau*1000)} ms</b> · i = (E/R)(1 − e^(−t/τ)) (final ${F(E/R)} A) y v_L = E·e^(−t/τ). A 3τ ya está al 95 %.`;
   det+=` Transitorio prácticamente terminado en 5τ = ${F(5*tau*1000)} ms.`;}
  else{const al=R/(2*L),w0=1/Math.sqrt(L*Cc);const T=Math.min(8/Math.max(al,20),0.4),u=wq/T;
   let fn,tipo;
   if(al>w0*1.0001){const s=Math.sqrt(al*al-w0*w0),s1=-al+s,s2=-al-s;fn=t=>(Math.exp(s1*t)-Math.exp(s2*t));tipo='SOBREAMORTIGUADO (α > ω₀): dos exponenciales, sin oscilación';}
   else if(Math.abs(al-w0)<=w0*0.0001){fn=t=>t*Math.exp(-al*t);tipo='CRÍTICO (α = ω₀): el más rápido sin oscilar';}
   else{const wd=Math.sqrt(w0*w0-al*al);fn=t=>Math.exp(-al*t)*Math.sin(wd*t);tipo='SUBAMORTIGUADO (α < ω₀): oscila a ω_d = '+F(Math.sqrt(w0*w0-al*al))+' rad/s bajo la envolvente e^(−αt)';}
   let mx=1e-9;for(let p=0;p<=wq;p+=2){mx=Math.max(mx,Math.abs(fn(p/u)));}
   a.line(x0,y0-hq/2,x0+wq,y0-hq/2,C.grid,1);
   a.g.strokeStyle=C.a;a.g.lineWidth=3;a.g.beginPath();
   for(let p=0;p<=wq;p+=2){const t=p/u;const y=fn(t)/mx;p===0?a.g.moveTo(x0,y0-hq/2-y*(hq/2-12)):a.g.lineTo(x0+p,y0-hq/2-y*(hq/2-12));}a.g.stroke();
   if(al<w0){a.g.strokeStyle=C.muted;a.g.lineWidth=1.5;a.g.setLineDash([4,4]);
    for(const sg of[1,-1]){a.g.beginPath();for(let p=0;p<=wq;p+=2){const t=p/u;const y=sg*Math.exp(-al*t)/mx;p===0?a.g.moveTo(x0,y0-hq/2-y*(hq/2-12)):a.g.lineTo(x0+p,y0-hq/2-y*(hq/2-12));}a.g.stroke();}a.g.setLineDash([]);}
   a.txt(tipo,x0,42,C.a,13);
   det=`α = R/2L = ${F(al)} s⁻¹ · ω₀ = 1/√(LC) = ${F(w0)} rad/s · R crítica = 2√(L/C) = ${F(2*Math.sqrt(L/Cc))} Ω. ${tipo}.`;}
  a.html(`${det}<br><span class="hint">Lo primero SIEMPRE: v_C e i_L no pueden saltar. Dibuja el circuito en t = 0⁺ y en t → ∞, calcula τ (o α y ω₀) con la resistencia que VE el elemento reactivo y monta x(t) = x_∞ + [x₀ − x_∞]·e^(−t/τ).</span>`);}});

SIMS.trifasico=el=>build(el,{w:640,h:400,
 selects:[{k:'con',v:'Y',l:'conexión de la carga',opts:[['Y','estrella (Y)'],['D','triángulo (Δ)']]}],
 sliders:[{k:'VL',v:400,min:120,max:690,step:10,l:'tensión de línea',u:'V'},{k:'R',v:12,min:1,max:40,step:1,l:'R por fase',u:'Ω'},{k:'X',v:9,min:-30,max:30,step:1,l:'X por fase (+L, −C)',u:'Ω'}],
 draw(a){a.clear();const con=a.st.con,VL=a.st.VL,R=a.st.R,X=a.st.X;
  const Zm=Math.hypot(R,X),ph=Math.atan2(X,R);
  const VF=con==='Y'?VL/Math.sqrt(3):VL;
  const IF=VF/Zm,IL=con==='Y'?IF:IF*Math.sqrt(3);
  const P=Math.sqrt(3)*VL*IL*Math.cos(ph),Q=Math.sqrt(3)*VL*IL*Math.sin(ph),S=Math.sqrt(3)*VL*IL;
  const cx=160,cy=210,uu=92;
  const ang=[0,-120,120];const col=[C.a,C.f,C.c];
  a.line(cx-130,cy,cx+130,cy,C.grid,1);a.line(cx,cy-130,cx,cy+130,C.grid,1);
  ang.forEach((g,i)=>{const r=g*Math.PI/180;
   a.arrow(cx,cy,cx+uu*Math.cos(r),cy-uu*Math.sin(r),col[i],3);
   a.txt(['V_an','V_bn','V_cn'][i],cx+uu*1.15*Math.cos(r)-12,cy-uu*1.15*Math.sin(r),col[i],12);
   const ri=(g-ph*180/Math.PI)*Math.PI/180;
   a.arrow(cx,cy,cx+uu*0.6*Math.cos(ri),cy-uu*0.6*Math.sin(ri),col[i],2,[4,3]);});
  a.circ(cx,cy,4,C.text,true);a.txt('N',cx+6,cy+16,C.muted,11);
  a.txt('tensiones (continuo) y corrientes (discontinuo)',cx-120,cy+150,C.muted,11);
  const bx=430,by=140;
  if(con==='Y'){for(let i=0;i<3;i++){const r=(90-120*i)*Math.PI/180;const x2=bx+72*Math.cos(r),y2=by+72*Math.sin(r);
    a.line(bx,by,x2,y2,C.text,2.5);Rbox(a,x2-18,y2-9,36,18,'Z',col[i]);a.txt(['a','b','c'][i],x2+(i===0?0:(i===1?-30:30)),y2+(i===0?-18:16),C.muted,11);}
   a.circ(bx,by,5,C.text,true);a.txt('neutro',bx+10,by+16,C.muted,10);
   a.txt('ESTRELLA: V_L = √3·V_F , I_L = I_F',bx-120,by+120,C.text,12);}
  else{const pts=[];for(let i=0;i<3;i++){const r=(90-120*i)*Math.PI/180;pts.push([bx+72*Math.cos(r),by+72*Math.sin(r)]);}
   for(let i=0;i<3;i++){const p1=pts[i],p2=pts[(i+1)%3];a.line(p1[0],p1[1],p2[0],p2[1],C.text,2.5);
    Rbox(a,(p1[0]+p2[0])/2-16,(p1[1]+p2[1])/2-9,32,18,'Z',col[i]);a.circ(p1[0],p1[1],5,col[i],true);}
   a.txt('TRIÁNGULO: V_L = V_F , I_L = √3·I_F',bx-125,by+120,C.text,12);}
  a.html(`Carga ${con==='Y'?'en estrella':'en triángulo'} de Z = ${F(R)} ${X>=0?'+':'−'} j${F(Math.abs(X))} = ${F(Zm)}∠${F(ph*180/Math.PI)}° Ω por fase, a V_L = ${F(VL)} V.<br>
  V_F = ${F(VF)} V ⇒ I_F = ${F(IF)} A ⇒ <b>I_L = ${F(IL)} A</b>${con==='D'?' (√3 veces la de fase, retrasada 30°)':' (igual que la de fase)'}.<br>
  P = √3·V_L·I_L·cos φ = <b>${F(P/1000)} kW</b> · Q = <b>${F(Q/1000)} kvar</b> · S = ${F(S/1000)} kVA · cos φ = ${F(Math.cos(ph))} ${X>0?'inductivo':X<0?'capacitivo':'unidad'}.<br>
  <span class="hint">Comprobación: 3·I_F²·R = ${F(3*IF*IF*R/1000)} kW ✓. Pasa siempre el triángulo a estrella (Z_Y = Z_Δ/3) y resuelve UNA fase: el circuito monofásico equivalente.</span>`);}});

SIMS.aaron=el=>build(el,{w:640,h:380,
 sliders:[{k:'VL',v:400,min:120,max:690,step:10,l:'tensión de línea',u:'V'},{k:'IL',v:15.4,min:1,max:60,step:0.2,l:'corriente de línea',u:'A'},{k:'fp',v:0.8,min:0.2,max:1,step:0.01,l:'cos φ (inductivo)',u:''},{k:'fp2',v:0.95,min:0.5,max:1,step:0.01,l:'cos φ deseado',u:''}],
 draw(a){a.clear();const VL=a.st.VL,IL=a.st.IL,fp=a.st.fp,fp2=Math.max(a.st.fp2,a.st.fp),w=2*Math.PI*50;
  const ph=Math.acos(fp);const P=Math.sqrt(3)*VL*IL*fp,Q=Math.sqrt(3)*VL*IL*Math.sin(ph);
  const W1=VL*IL*Math.cos(Math.PI/6-ph),W2=VL*IL*Math.cos(Math.PI/6+ph);
  const Qc=P*(Math.tan(ph)-Math.tan(Math.acos(fp2)));
  const Cy=Qc/(w*VL*VL),Cd=Qc/(3*w*VL*VL);
  const IL2=P/(Math.sqrt(3)*VL*fp2);
  const bx=80,by=100;
  for(let i=0;i<3;i++){a.line(bx,by+i*60,bx+450,by+i*60,C.text,2);a.txt('L'+(i+1),bx-28,by+i*60+5,C.muted,12);}
  const wm=(x,y,lab,val)=>{const col=val>=0?C.a:C.b;a.g.fillStyle=C.bg;a.circ(x,y,26,col,true);a.g.fillStyle=C.bg;a.circ(x,y,23,C.bg,true);a.circ(x,y,26,col,false);
   a.txt('W',x,y+6,col,15,'center');a.txt(lab+' = '+F(val/1000)+' kW',x-40,y-36,col,12);};
  wm(bx+150,by,'W₁',W1);wm(bx+150,by+120,'W₂',W2);
  a.line(bx+150,by+26,bx+150,by+60,C.muted,1.5,[4,3]);a.line(bx+150,by+94,bx+150,by+60,C.muted,1.5,[4,3]);
  a.txt('las bobinas de tensión se refieren a L2',bx+186,by+156,C.muted,11);
  Rbox(a,bx+390,by-16,66,152,'carga');
  a.txt('P = W₁ + W₂ = '+F((W1+W2)/1000)+' kW',bx,by+190,C.a,14);
  a.txt('Q = √3(W₁ − W₂) = '+F(Math.sqrt(3)*(W1-W2)/1000)+' kvar',bx+260,by+190,C.f,14);
  a.html(`P = √3·V_L·I_L·cos φ = ${F(P/1000)} kW · Q = ${F(Q/1000)} kvar · φ = ${F(ph*180/Math.PI)}°.<br>
  <b>Aarón</b>: W₁ = V_L·I_L·cos(30° − φ) = ${F(W1/1000)} kW y W₂ = V_L·I_L·cos(30° + φ) = ${F(W2/1000)} kW ⇒ su suma da P ✓ y √3(W₁ − W₂) da Q ✓.<br>
  ${fp<0.5?'<b>Atención</b>: con cos φ < 0,5 el vatímetro W₂ marca NEGATIVO; hay que invertir su conexión y restar su lectura.':(fp<0.52?'Con cos φ = 0,5 el vatímetro W₂ marca exactamente cero.':'')}
  Corrección a cos φ = ${F(fp2)}: Q_C = ${F(Qc/1000)} kvar ⇒ <b>${F(Cd*1e6)} µF por fase en triángulo</b> (o ${F(Cy*1e6)} µF en estrella) y la corriente de línea baja de ${F(IL)} a <b>${F(IL2)} A</b>.<br>
  <span class="hint">tan φ = √3(W₁ − W₂)/(W₁ + W₂) permite sacar el factor de potencia solo con las dos lecturas, sin medir nada más.</span>`);}});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
