/* Electrotecnia: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 arranque de un accionamiento: par motor, par de carga y aceleración */
function Tm1(w){return 100-0.7*w;}function Tl1(w){return 10+0.0035*w*w;}
var w1=(function(){var lo=0,hi=140;for(var i=0;i<60;i++){var m=(lo+hi)/2;if(Tm1(m)>Tl1(m))lo=m;else hi=m;}return (lo+hi)/2;})();
M.reg('et-t1',M.base({title:'Accionamiento: arranque hasta el punto de trabajo',H:560,dur:18,caps:[[6,'El motor da un par T<sub>m</sub>(ω) y la carga (un ventilador) pide T<sub>L</sub>(ω), que crece con la velocidad.'],[12,'La diferencia acelera el conjunto: <i>J·dω/dt = T<sub>m</sub> − T<sub>L</sub></i>. La franja sombreada es el par de aceleración disponible.'],[99,'Cuando los dos pares se igualan, la aceleración se anula: es el punto de trabajo estable, donde el sistema se queda girando.']]},
 function(D,t){var A=U.axes(D,{xr:[0,150],yr:[0,110],xt:[50,100,150],yt:[25,50,75,100],xd:0,yd:0,xl:'ω (rad/s)',yl:'T (N·m)'},{x:80,y:96,w:480,h:300,grid:true});
  var wn=w1*(1-Math.exp(-seg(t,1,16)*4.2)),pts=[];for(var i=0;i<=60;i++){var w=wn*i/60;pts.push([A.X(w),A.Y(Tm1(w))]);}for(var j=60;j>=0;j--){var w2=wn*j/60;pts.push([A.X(w2),A.Y(Tl1(w2))]);}D.path(pts,null,0,RG(C.hl,.25));
  U.plotf(D,A,Tm1,C.f,2.6);U.plotf(D,A,Tl1,C.g,2.6);D.text('T_{m}',A.X(20),A.Y(Tm1(20))-10,{it:true,s:18,c:C.f});D.text('T_{L}',A.X(140),A.Y(Tl1(140))-8,{it:true,s:18,c:C.g,a:'right'});
  D.line(A.X(wn),A.Y(Tl1(wn)),A.X(wn),A.Y(Tm1(wn)),C.hl,3);D.dot(A.X(wn),A.Y(0),6,C.m);D.dot(A.X(w1),A.Y(Tm1(w1)),5,C.m,0.6);
  U.readout(D,['ω = '+nf(wn,1)+' rad/s     T_{m} − T_{L} = '+nf(Tm1(wn)-Tl1(wn),1)+' N·m',wn>w1-0.5?'régimen permanente: T_{m} = T_{L}':'acelerando'],468);}));

/* T2 ciclo de histéresis */
M.reg('et-t2',M.tray({title:'Circuito magnético: ciclo de histéresis B–H',H:560,dur:16,lin:true,s:[0,4*Math.PI],ax:{xr:[-1.25,1.25],yr:[-1.25,1.25],xt:[-1,-0.5,0.5,1],yt:[-1,-0.5,0.5,1],xl:'H',yl:'B'},
 path:function(s){var H=Math.cos(s),dn=Math.sin(s)>0?1:-1;return [H,Math.tanh((H+dn*0.3)/0.25)];},
 extra:function(D,A){var r=Math.tanh(0.3/0.25);D.dot(A.X(0),A.Y(r),5,C.hl);D.text('B_{r}',A.X(0)-10,A.Y(r)+4,{it:true,s:16,c:C.hl,a:'right'});D.dot(A.X(-0.3),A.Y(0),5,C.g);D.text('−H_{c}',A.X(-0.3)-6,A.Y(0)-10,{it:true,s:15,c:C.g,a:'right'});},
 read:function(s){var H=Math.cos(s),dn=Math.sin(s)>0?1:-1;return ['H = '+nf(H,2)+'    B = '+nf(Math.tanh((H+dn*0.3)/0.25),2),dn>0?'H bajando: rama superior':'H subiendo: rama inferior'];},
 caps:[[5,'Al subir H el material se magnetiza hasta saturar: casi todos los dominios ya están orientados y B apenas crece.'],[10,'Al bajar H a cero queda una inducción remanente B<sub>r</sub>; para anularla hace falta un campo coercitivo −H<sub>c</sub>.'],[99,'El área encerrada es la energía perdida por ciclo y unidad de volumen: las pérdidas por histéresis del núcleo del transformador.']]}));

/* T3 par sobre una espira en un campo */
M.reg('et-t3',M.base({title:'Conversión electromecánica: par sobre una espira',H:560,dur:18,caps:[[6,'Una espira con corriente I dentro de un campo B recibe fuerzas F = B·I·L en sus lados activos, en sentidos opuestos.'],[12,'Esas dos fuerzas forman un par que depende del ángulo: <i>T = B·I·A·sen θ</i>. Es máximo con la espira paralela al campo.'],[99,'Sin conmutar la corriente el par cambia de signo cada media vuelta. El colector de delgas (o la electrónica) invierte I para que el par sea siempre positivo.']]},
 function(D,t){var th=t*0.75,cx=170,cy=250,R=80;D.rect(cx-150,cy-95,32,190,C.bad,RG(C.bad,.25));D.rect(cx+118,cy-95,32,190,C.f,RG(C.f,.25));D.text('N',cx-134,cy+6,{s:20,a:'center',c:C.bad,bold:true});D.text('S',cx+134,cy+6,{s:20,a:'center',c:C.f,bold:true});
  for(var k=-2;k<=2;k++)D.arrow(cx-112,cy+k*36,cx+112,cy+k*36,C.mut,1,null);
  var x1=cx+R*Math.sin(th),y1=cy-R*Math.cos(th),x2=cx-R*Math.sin(th),y2=cy+R*Math.cos(th);D.line(x1,y1,x2,y2,C.m,4);D.dot(x1,y1,9,C.m);D.dot(x2,y2,9,C.m);
  var s=Math.cos(th)>0?1:-1,F=40*Math.abs(Math.sin(th))+8;D.arrow(x1,y1,x1,y1-s*F,C.hl,2.6);D.arrow(x2,y2,x2,y2+s*F,C.hl,2.6);D.text('F',x1+8,y1-s*F,{it:true,s:16,c:C.hl});
  var A=U.axes(D,{xr:[0,4*Math.PI],yr:[-1.3,1.3],xt:[],yt:[-1,1],yd:0,xl:'θ',yl:'T/T_{máx}'},{x:340,y:120,w:270,h:240,grid:true}),th2=th%(4*Math.PI);
  U.plotf(D,A,function(x){return Math.sin(x);},C.mut,1.4,0.5);var pts=[];for(var i=0;i<=200;i++){var x=th2*i/200;pts.push([A.X(x),A.Y(Math.sin(x))]);}D.path(pts,C.m,2.8);D.dot(A.X(th2),A.Y(Math.sin(th2)),6,C.m);
  U.readout(D,['θ = '+nf((th*180/Math.PI)%360,0)+'°     T = B·I·A·sen θ = '+nf(Math.sin(th),2)+'·T_{máx}'],440);}));

/* T4 máquina de continua: característica par-velocidad con la tensión */
var k4=1.2,R4=0.5;function w4(T,V){return (V-R4*T/k4)/k4;}
M.reg('et-t4',M.curva({title:'Motor de CC: control por tensión de inducido',H:560,dur:18,p:[60,240],ax:{xr:[0,60],yr:[0,220],xt:[20,40,60],yt:[50,100,150,200],xd:0,yd:0,xl:'T (N·m)',yl:'ω (rad/s)'},h:300,
 curvas:[{f:function(T,V){return w4(T,V);},c:'f'}],
 extra:function(D,A,V){var TL=30;D.line(A.X(TL),A.Y(0),A.X(TL),A.Y(220),C.g,2.2,[6,4]);D.text('T_{L}',A.X(TL)+6,A.Y(210),{it:true,s:16,c:C.g});var w=w4(TL,V);D.dot(A.X(TL),A.Y(w),7,C.hl);D.dot(A.X(0),A.Y(V/k4),5,C.f);},
 read:function(V){var w=w4(30,V);return ['V = '+nf(V,0)+' V     ω_{0} = V/k = '+nf(V/k4,1)+' rad/s','con T_{L} = 30 N·m:  I = T/k = '+nf(30/k4,1)+' A,   ω = '+nf(w,1)+' rad/s'];},
 caps:[[6,'En régimen, <i>V = E + R·I</i> con <i>E = k·ω</i> y <i>T = k·I</i>. Despejando: <i>ω = V/k − R·T/k²</i>, una recta.'],[12,'Al variar V la recta se desplaza paralela: cambia la velocidad en vacío pero no la pendiente (la caída por R).'],[99,'Con par de carga constante, la velocidad sigue a la tensión casi proporcionalmente: por eso el control por tensión de inducido es el más usado.']]}));

/* T5 campo giratorio con vectores espaciales */
M.reg('et-t5',M.base({title:'Tres corrientes alternas, un vector que gira',H:580,dur:18,caps:[[6,'Cada fase crea un campo que solo pulsa sobre su propio eje, separado 120° de los otros.'],[12,'Sumando las tres contribuciones resulta un vector de módulo constante (3/2 de cada amplitud) que gira a la velocidad de la red.'],[99,'Ese vector espacial es el campo giratorio en el que se basan todas las máquinas de alterna trifásicas.']]},
 function(D,t){var w=t*0.9,cx=170,cy=260,S=70,ph=[0,2*Math.PI/3,4*Math.PI/3],cols=[C.f,C.g,C.hl],x=cx,y=cy;D.ring(cx,cy,S*1.5,C.grid,1.2);
  ph.forEach(function(p,i){D.line(cx-S*1.2*Math.cos(p),cy+S*1.2*Math.sin(p),cx+S*1.2*Math.cos(p),cy-S*1.2*Math.sin(p),cols[i],1,[3,4]);});
  var show=seg(t,5,8);ph.forEach(function(p,i){var m=Math.cos(w-p),ex=x+S*m*Math.cos(p),ey=y-S*m*Math.sin(p);D.arrow(show>0?x:cx,show>0?y:cy,show>0?ex:cx+S*m*Math.cos(p),show>0?ey:cy-S*m*Math.sin(p),cols[i],2.6);if(show>0){x=ex;y=ey;}});
  if(show>0){D.arrow(cx,cy,x,y,C.m,3.6,null);D.text('i_{s}',x+8,y-8,{s:20,c:C.m,bold:true});}
  var A=U.axes(D,{xr:[0,4*Math.PI],yr:[-1.3,1.3],xt:[],yt:[-1,1],yd:0,xl:'t',yl:'i'},{x:330,y:140,w:280,h:230,grid:true}),tt=w%(4*Math.PI);
  ph.forEach(function(p,i){U.plotf(D,A,function(x){return Math.cos(x-p);},cols[i],2,0.85);});D.line(A.X(tt),A.Y(-1.3),A.X(tt),A.Y(1.3),C.m,1.6,[4,3]);
  U.readout(D,['i_{a} = '+nf(Math.cos(w),2)+'   i_{b} = '+nf(Math.cos(w-ph[1]),2)+'   i_{c} = '+nf(Math.cos(w-ph[2]),2),'|i_{s}| = 1,5   ángulo = '+nf((w*180/Math.PI)%360,0)+'°'],460);}));

/* T6 asíncrona: curva par-velocidad (Kloss) y resistencia rotórica */
function Tk(n,sm){var s=Math.max(1e-4,(1500-n)/1500);return 2*100/(s/sm+sm/s);}
M.reg('et-t6',M.curva({title:'Motor asíncrono: par frente a velocidad',H:560,dur:18,p:[0.12,0.9],ax:{xr:[0,1600],yr:[0,115],xt:[500,1000,1500],yt:[25,50,75,100],xd:0,yd:0,xl:'n (rpm)',yl:'T (N·m)'},h:300,
 curvas:[{f:function(n,sm){return n>1500?NaN:Tk(n,sm);},c:'f'}],
 extra:function(D,A,sm){U.plotf(D,A,function(n){return 30+n*0.012;},C.g,2,1);D.line(A.X(1500),A.Y(0),A.X(1500),A.Y(115),C.mut,1,[4,4]);D.text('n_{s}',A.X(1500)+4,A.Y(108),{it:true,s:15,c:C.mut});
  var nm=1500*(1-sm);D.dot(A.X(nm),A.Y(100),6,C.hl);var lo=nm,hi=1500;for(var i=0;i<50;i++){var m=(lo+hi)/2;if(Tk(m,sm)>30+m*0.012)lo=m;else hi=m;}D.dot(A.X(lo),A.Y(30+lo*0.012),7,C.m);},
 read:function(sm){var T0=Tk(0,sm);return ['s_{máx} = '+nf(sm,2)+'  (∝ R_{2}′)    T_{máx} = 100 N·m','par de arranque = '+nf(T0,0)+' N·m'];},
 caps:[[6,'El par máximo de una asíncrona no depende de la resistencia rotórica R<sub>2</sub>′, pero sí el deslizamiento al que aparece: <i>s<sub>máx</sub> ∝ R<sub>2</sub>′</i>.'],[12,'Al aumentar R<sub>2</sub>′ (rotor bobinado con reóstato) el máximo se desplaza hacia el arranque: más par al arrancar.'],[99,'El punto de trabajo (morado) es el corte con la curva de la carga, siempre en la zona estable, entre el par máximo y la velocidad de sincronismo.']]}));

/* T7 PMSM: diagrama dq y debilitamiento de campo */
var psi=1,Lq=0.5,Ld=0.5,Vm=1.6,iq7=1;
M.reg('et-t7',M.base({title:'Motor síncrono de imanes: diagrama dq',H:580,dur:18,caps:[[6,'En ejes dq, la fuerza electromotriz del imán <i>ω·ψ</i> está sobre el eje q y crece con la velocidad. La caída <i>ω·L<sub>q</sub>·i<sub>q</sub></i> va en −d.'],[12,'Por encima de la velocidad base la tensión necesaria se sale del círculo que permite el convertidor (V<sub>máx</sub>).'],[99,'Inyectando corriente i<sub>d</sub> negativa se reduce el flujo efectivo <i>ψ + L<sub>d</sub>·i<sub>d</sub></i>: es el debilitamiento de campo, que permite girar más rápido.']]},
 function(D,t){var w=lerp(0.4,2.6,U.pp(t,18)),cx=330,cy=420,S=95;D.line(cx-250,cy,cx+150,cy,C.ax,1.4);D.line(cx,cy+30,cx,cy-330,C.ax,1.4);D.text('d',cx+150,cy-8,{it:true,s:18,c:C.w});D.text('q',cx+8,cy-325,{it:true,s:18,c:C.w});
  D.ctx.save();D.ctx.beginPath();D.ctx.arc(cx,cy,Vm*S,Math.PI,2*Math.PI);D.ctx.strokeStyle=C.bad;D.ctx.setLineDash([6,4]);D.ctx.lineWidth=1.6;D.ctx.stroke();D.ctx.restore();D.text('V_{máx}',cx+Vm*S*0.72,cy-Vm*S*0.72-8,{it:true,s:15,c:C.bad});
  var id=0,vd=-w*Lq*iq7,vq=w*psi;if(Math.hypot(vd,vq)>Vm){var r=Math.sqrt(Math.max(0,Vm*Vm-vd*vd))/w;id=(r-psi)/Ld;vq=w*(psi+Ld*id);}
  D.arrow(cx,cy,cx,cy-w*psi*S,C.mut,2,null);D.text('ωψ',cx+8,cy-w*psi*S+6,{it:true,s:15,c:C.mut});
  if(id<0){D.arrow(cx,cy-w*psi*S,cx,cy-vq*S,C.g,2.6);D.text('ωL_{d}i_{d}',cx+8,cy-vq*S+18,{it:true,s:15,c:C.g});}
  D.arrow(cx,cy-vq*S,cx+vd*S,cy-vq*S,C.f,2.6);D.text('ωL_{q}i_{q}',cx+vd*S/2,cy-vq*S-10,{it:true,s:15,c:C.f,a:'center'});
  D.arrow(cx,cy,cx+vd*S,cy-vq*S,C.m,3.4);D.text('V',cx+vd*S-14,cy-vq*S+4,{it:true,s:20,c:C.m,bold:true});
  D.arrow(cx,cy,cx+id*S*0.5,cy-iq7*S*0.5,C.hl,2.6);D.text('i',cx+id*S*0.5+8,cy-iq7*S*0.5+14,{it:true,s:18,c:C.hl});
  U.readout(D,['ω = '+nf(w,2)+'   |V| = '+nf(Math.hypot(vd,vq),2)+'   i_{d} = '+nf(id,2)+'   i_{q} = '+nf(iq7,2),id<0?'debilitamiento de campo':'zona de par constante (i_{d} = 0)'],480);}));

/* T8 motor de reluctancia conmutada: L(θ), pulso de corriente y par */
function L8(th){var x=((th%90)+90)%90;return x<15?1:x<45?1+(x-15)/30*4:x<55?5:x<85?5-(x-55)/30*4:1;}
function i8(th){var x=((th%90)+90)%90;return (x>=12&&x<44)?1:0;}
M.reg('et-t8',M.base({title:'Motor de reluctancia conmutada: par y conmutación',H:560,dur:18,caps:[[6,'La inductancia de cada fase cambia con la posición del rotor: mínima con los polos desalineados y máxima con los polos alineados.'],[12,'El par es <i>T = ½·i²·dL/dθ</i>: solo hay par motor si se alimenta la fase mientras L sube.'],[99,'Por eso cada fase se enciende justo antes de la zona de L creciente y se apaga antes del alineamiento. Si conduce cuando L baja, el par es de frenado.']]},
 function(D,t){var th=seg(t,1,17)*180,A=U.axes(D,{xr:[0,180],yr:[-0.4,6],xt:[45,90,135,180],yt:[1,5],xd:0,yd:0,xl:'θ (°)',yl:''},{x:80,y:96,w:480,h:300,grid:true});
  for(var x=0;x<180;x+=1){if(i8(x)&&L8(x+1)>L8(x))D.rect(A.X(x),A.Y(1.5),A.X(x+1)-A.X(x)+0.5,A.Y(0)-A.Y(1.5),null,RG(C.ok,.3));}
  U.plotf(D,A,L8,C.f,2.6);U.plotf(D,A,function(x){return i8(x)*1.5;},C.hl,2.2);D.text('L(θ)',A.X(30),A.Y(L8(30))-10,{it:true,s:17,c:C.f});D.text('i',A.X(14),A.Y(1.5)-8,{it:true,s:17,c:C.hl});
  D.line(A.X(th),A.Y(-0.4),A.X(th),A.Y(6),C.m,1.8,[4,3]);D.dot(A.X(th),A.Y(L8(th)),6,C.m);
  var dL=(L8(th+0.5)-L8(th-0.5)),T=0.5*i8(th)*dL;U.readout(D,['θ = '+nf(th,0)+'°   L = '+nf(L8(th),2)+'   i = '+i8(th)+'   dL/dθ '+(dL>0.01?'> 0':dL<-0.01?'< 0':'= 0'),T>0.001?'par motor':'sin par'],468);}));
M.reg('et-t2b',M.base({title:'Transformador ideal: relación de transformación',H:560,dur:18,caps:[[6,'El flujo alterno del núcleo atraviesa las dos bobinas. Cada espira ve la misma fem, así que <i>V₁/V₂ = N₁/N₂ = m</i>.'],[12,'La potencia se conserva (transformador ideal): <i>V₁I₁ = V₂I₂</i>, de modo que las corrientes van al revés, <i>I₁/I₂ = 1/m</i>.'],[99,'Una impedancia en el secundario se ve desde el primario multiplicada por m²: así se adaptan impedancias.']]},
 function(D,t){var N2=Math.round(lerp(50,400,U.pp(t,18))),N1=200,V1=230,V2=V1*N2/N1,R=50,I2=V2/R,I1=I2*N2/N1,cx=320,cy=230;
  D.rect(cx-130,cy-110,260,220,C.ax,null,14);var ph=t*4;D.ctx.save();D.ctx.globalAlpha=0.5+0.5*Math.sin(ph);D.rect(cx-130,cy-110,260,220,C.hl,null,4);D.ctx.restore();
  for(var k=0;k<8;k++)D.line(cx-145,cy-80+k*20,cx-115,cy-70+k*20,C.f,3);var n2=Math.max(2,Math.round(N2/25));for(var k2=0;k2<n2;k2++)D.line(cx+115,cy-80+k2*160/n2,cx+145,cy-70+k2*160/n2,C.m,3);
  D.text('N₁ = '+N1,cx-170,cy-120,{s:15,c:C.f,a:'center'});D.text('N₂ = '+N2,cx+170,cy-120,{s:15,c:C.m,a:'center'});D.text('V₁ = 230 V',cx-170,cy+140,{s:15,c:C.f,a:'center'});D.text('V₂ = '+nf(V2,0)+' V',cx+170,cy+140,{s:15,c:C.m,a:'center'});
  U.readout(D,['m = N₁/N₂ = '+nf(N1/N2,2)+'    carga R = 50 Ω','I₂ = '+nf(I2,2)+' A    I₁ = I₂/m = '+nf(I1,2)+' A    P = '+nf(V2*I2/1000,2)+' kW'],440);}));
})();
