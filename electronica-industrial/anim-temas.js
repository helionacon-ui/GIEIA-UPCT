/* Fundamentos de Electrónica Industrial: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 analógico frente a digital */
M.reg('fei-t6b',M.base({title:'De analógico a digital: muestrear y cuantificar',H:540,dur:18,caps:[[6,'Una señal analógica puede tomar cualquier valor en cualquier instante (curva continua).'],[12,'Para digitalizarla se <b>muestrea</b> cada cierto tiempo y cada muestra se redondea al nivel más cercano de los 2ⁿ disponibles (<b>cuantificación</b>).'],[99,'Con 3 bits solo hay 8 niveles: el error de cuantificación es visible. Con más bits la escalera se parece cada vez más a la señal original.']]},
 function(D,t){var bits=t<9?3:5,L=Math.pow(2,bits),A=U.axes(D,{xr:[0,10],yr:[-1.15,1.15],xt:[],yt:[-1,1],yd:0,xl:'t',yl:'v'},{x:80,y:96,w:480,h:300,grid:true}),f=function(x){return 0.9*Math.sin(x*0.9)+0.15*Math.sin(x*2.7);};
  U.plotf(D,A,f,C.f,2,0.8);var n=Math.floor(seg(t%9,1,7)*40),st=[];for(var i=0;i<=n;i++){var x=i*0.25,v=f(x),q=Math.round((v+1)/2*(L-1))/(L-1)*2-1;D.line(A.X(x),A.Y(0),A.X(x),A.Y(v),C.mut,1,[2,3]);D.dot(A.X(x),A.Y(q),4,C.m);st.push([A.X(x),A.Y(q)]);st.push([A.X(x+0.25),A.Y(q)]);}
  D.path(st,C.m,2.4);for(var k=0;k<L;k++){var y=k/(L-1)*2-1;D.line(A.X(0),A.Y(y),A.X(0.15),A.Y(y),C.hl,1.4);}
  D.text(bits+' bits = '+L+' niveles    resolución = 2/'+(L-1)+' = '+nf(2/(L-1),3)+' V',W/2,470,{s:20,a:'center',c:C.m,bold:true});}));

/* T2 rectificador de onda completa con filtro */
function rect(Cf){var out=[],v=0,dt=0.01,RC=Cf;for(var i=0;i<=2400;i++){var x=i*dt,vin=Math.abs(10*Math.sin(x))-1.4;if(vin>v)v=vin;else v=v*Math.exp(-dt/RC);out.push(v);}return out;}
M.reg('fei-t2',M.base({title:'Rectificador de onda completa con condensador',H:540,dur:18,caps:[[6,'El puente de diodos convierte la senoide en pulsos siempre positivos (onda completa). Cada pareja de diodos resta unos 1,4 V.'],[12,'Un condensador en paralelo con la carga se carga en los picos y se descarga despacio entre ellos: la tensión queda casi continua.'],[99,'Cuanto mayor es la constante RC, menor es el rizado: <i>V<sub>r</sub> ≈ V<sub>p</sub>/(2fRC)</i>. Es la base de cualquier fuente de alimentación.']]},
 function(D,t){var Cf=lerp(0.4,12,U.pp(t,18)),o=rect(Cf),A=U.axes(D,{xr:[0,24],yr:[-11,11],xt:[],yt:[-10,-5,5,10],yd:0,xl:'t',yl:'v (V)'},{x:80,y:96,w:480,h:300,grid:true});
  U.plotf(D,A,function(x){return 10*Math.sin(x);},C.mut,1.2,0.5);U.plotf(D,A,function(x){return Math.max(0,Math.abs(10*Math.sin(x))-1.4);},C.f,1.6,0.7);
  D.path(o.map(function(v,i){return [A.X(i*0.01),A.Y(v)];}),C.m,2.8);var mn=Math.min.apply(null,o.slice(800)),mx=Math.max.apply(null,o.slice(800));
  D.text('RC = '+nf(Cf,1)+'·(1/ω)     rizado = '+nf(mx-mn,2)+' V',W/2,470,{it:true,s:21,a:'center',c:C.m});}));

/* T3 regulador zener */
var Vz=5.1,k3=1000/1220;
M.reg('fei-t3',M.traza({title:'Regulador con diodo zener',H:540,dur:16,x0:0,x1:15,ax:{xr:[0,15.5],yr:[0,8],xt:[5,10,15],yt:[2,4,5.1,6,8],xd:0,yd:1,xl:'V_{in} (V)',yl:'V_{out} (V)'},h:300,f:function(v){return Math.min(v*k3,Vz);},
 extra:function(D,A){U.plotf(D,A,function(v){return v*k3;},C.mut,1,0.4);D.line(A.X(0),A.Y(Vz),A.X(15.5),A.Y(Vz),C.hl,1.2,[5,4]);D.text('V_{Z} = 5,1 V',A.X(12),A.Y(Vz)-8,{s:14,c:C.hl});},
 read:function(v){var vo=Math.min(v*k3,Vz),Is=(v-vo)/220*1000,IL=vo/1000*1000,Iz=Math.max(0,Is-IL);return ['V_{in} = '+nf(v,1)+' V    V_{out} = '+nf(vo,2)+' V','I_{s} = '+nf(Is,1)+' mA = I_{L} '+nf(IL,1)+' mA + I_{Z} '+nf(Iz,1)+' mA'];},
 caps:[[6,'Mientras V<sub>in</sub> es pequeña el zener no conduce: la salida es un simple divisor de tensión (R<sub>s</sub> = 220 Ω, R<sub>L</sub> = 1 kΩ).'],[11,'Cuando la salida llega a la tensión zener (5,1 V), el diodo entra en ruptura inversa y absorbe la corriente sobrante.'],[99,'A partir de ahí la salida se queda fija en 5,1 V aunque suba la entrada: todo el exceso cae en R<sub>s</sub> y lo disipa el zener.']]}));

/* T4 curvas del BJT y punto Q */
function Ic(vce,ib){return ib*0.1*(1-Math.exp(-vce/0.25))*(1+vce/80);}
M.reg('fei-t4',M.base({title:'Transistor BJT: curvas de salida y punto de trabajo',H:560,dur:18,caps:[[6,'Cada curva da I<sub>C</sub> frente a V<sub>CE</sub> para una corriente de base I<sub>B</sub>. En activa, <i>I<sub>C</sub> ≈ β·I<sub>B</sub></i> (aquí β = 100).'],[12,'La recta de carga sale de la malla de colector: <i>V<sub>CC</sub> = I<sub>C</sub>R<sub>C</sub> + V<sub>CE</sub></i>. El punto Q se mueve por ella al cambiar I<sub>B</sub>.'],[99,'Con I<sub>B</sub> = 0, corte (interruptor abierto). Con I<sub>B</sub> grande, saturación (V<sub>CE</sub> ≈ 0,2 V, interruptor cerrado). En medio, zona activa: amplificador.']]},
 function(D,t){var ib=lerp(0,100,U.pp(t,18)),A=U.axes(D,{xr:[0,12.5],yr:[0,12],xt:[2,4,6,8,10,12],yt:[2,4,6,8,10],xd:0,yd:0,xl:'V_{CE} (V)',yl:'I_{C} (mA)'},{x:80,y:96,w:480,h:300,grid:true});
  [20,40,60,80,100].forEach(function(b){U.plotf(D,A,function(v){return v>=0?Ic(v,b):NaN;},C.f,1.6,0.7);D.text(b+' µA',A.X(12.4),A.Y(Ic(12.4,b))-6,{s:12,c:C.f,a:'right'});});
  var Vcc=12,Rc=1.2;U.plotf(D,A,function(v){return (Vcc-v)/Rc;},C.g,2.4);
  var lo=0,hi=12;for(var i=0;i<50;i++){var m=(lo+hi)/2;if(Ic(m,ib)>(Vcc-m)/Rc)hi=m;else lo=m;}var vq=(lo+hi)/2,iq=(Vcc-vq)/Rc;D.dot(A.X(vq),A.Y(iq),7,C.hl);D.text('Q',A.X(vq)+10,A.Y(iq)-6,{s:17,c:C.hl,bold:true});
  var reg=ib<1?'corte':(vq<0.5?'saturación':'activa');D.text('I_{B} = '+nf(ib,0)+' µA   V_{CE} = '+nf(vq,2)+' V   I_{C} = '+nf(iq,2)+' mA   → '+reg,W/2,470,{it:true,s:19,a:'center',c:C.m});}));

/* T5 amplificador inversor */
M.reg('fei-t5',M.curva({title:'Amplificador inversor con AO',H:540,dur:18,p:[1,8],ax:{xr:[0,4*Math.PI],yr:[-14,14],xt:[],yt:[-12,-6,6,12],yd:0,xl:'t',yl:'v (V)'},h:300,ghost:false,
 curvas:[{f:function(x){return 2*Math.sin(x);},c:'f',w:2,fija:true},{f:function(x,g){return clamp(-g*2*Math.sin(x),-12,12);},c:'m',w:3}],
 extra:function(D,A){D.line(A.X(0),A.Y(12),A.X(4*Math.PI),A.Y(12),C.bad,1,[4,4]);D.line(A.X(0),A.Y(-12),A.X(4*Math.PI),A.Y(-12),C.bad,1,[4,4]);D.text('+V_{sat}',A.X(4*Math.PI)-4,A.Y(12)-6,{s:13,c:C.bad,a:'right'});},
 read:function(g){return ['G = −R₂/R₁ = −'+nf(g,1)+'    v_{in} = 2 V de pico','v_{out} = '+(g*2>12?'saturada a ±12 V (recortada)':'−'+nf(g*2,1)+' V de pico, invertida')];},
 caps:[[6,'Montaje inversor: <i>v<sub>out</sub> = −(R₂/R₁)·v<sub>in</sub></i>. La salida (morada) es la entrada (azul) amplificada y en contrafase.'],[12,'La ganancia solo depende de las resistencias gracias a la realimentación negativa: el AO ajusta su salida para que <i>v<sub>+</sub> = v<sub>−</sub></i>.'],[99,'Si la ganancia es tan alta que la salida pediría más de la alimentación (±12 V), el AO <b>satura</b> y la onda sale recortada.']]}));

/* T6 cronograma de puertas lógicas */
M.reg('fei-t6',M.base({title:'Puertas lógicas: cronograma',H:560,dur:16,caps:[[5,'A y B son señales digitales (0 o 1). Las puertas combinan sus valores en cada instante.'],[11,'AND vale 1 solo si A y B valen 1. OR vale 1 si alguna vale 1. XOR vale 1 si son distintas.'],[99,'Leyendo el cronograma por columnas se obtiene la tabla de verdad de cada puerta.']]},
 function(D,t){var A=[0,1,1,0,1,0,0,1,1,0],B=[0,0,1,1,1,0,1,1,0,0],x0=110,w=46,u=seg(t,1,14)*10,rows=[['A',A,C.f],['B',B,C.f],['A·B (AND)',A.map(function(a,i){return a&B[i];}),C.m],['A+B (OR)',A.map(function(a,i){return a|B[i];}),C.g],['A⊕B (XOR)',A.map(function(a,i){return a^B[i];}),C.hl]];
  rows.forEach(function(r,k){var y=110+k*76;D.text(r[0],x0-12,y-6,{s:14,a:'right',c:r[2]});var p=[];for(var i=0;i<10;i++){if(i>u)break;var v=r[1][i],e=Math.min(i+1,u),yy=y-v*34;if(p.length)p.push([x0+i*w,yy]);else p.push([x0,yy]);p.push([x0+e*w,yy]);}if(p.length>1)D.path(p,r[2],2.6);D.line(x0,y,x0+10*w,y,C.grid,1);});
  var i=Math.min(9,Math.floor(u));D.rect(x0+i*w,80,w,380,null,RG(C.y,.08));D.text('A = '+A[i]+'  B = '+B[i]+'  →  AND '+(A[i]&B[i])+'  OR '+(A[i]|B[i])+'  XOR '+(A[i]^B[i]),W/2,500,{s:19,a:'center',c:C.m,mono:true});}));
/* T1 ley de Ohm y divisor de tensión */
M.reg('fei-t1',M.base({title:'Ley de Ohm y divisor de tensión',H:580,dur:18,caps:[[6,'Dos resistencias en serie llevan la misma corriente: <i>I = V/(R₁ + R₂)</i>. La resistencia equivalente es la suma.'],[12,'Cada una se queda con una parte de la tensión proporcional a su valor: <i>V<sub>2</sub> = V·R₂/(R₁ + R₂)</i>. Es el divisor de tensión.'],[99,'Al subir R₂ baja la corriente y sube V₂. Mueve «Prueba tú» para fijar R₂ y comprobarlo con la ley de Ohm, <i>V = I·R</i>, en cada resistencia.']]},
 function(D,t){var V=12,R1=4.7,R2=lerp(1,10,U.pp(t,18)),I=V/(R1+R2),V2=I*R2,x0=110,x1=430,y0=130,y1=380;
  D.line(x0,y0,x1,y0,C.ax,2.4);D.line(x1,y0,x1,y1,C.ax,2.4);D.line(x1,y1,x0,y1,C.ax,2.4);D.line(x0,y1,x0,y0,C.ax,2.4);
  D.dot(x0,(y0+y1)/2,22,C.bg);D.ring(x0,(y0+y1)/2,22,C.bad,2.4);D.text('12 V',x0-30,(y0+y1)/2+6,{s:16,c:C.bad,a:'right'});D.text('+',x0,(y0+y1)/2-6,{s:14,a:'center',c:C.bad});
  var per=2*(x1-x0)+2*(y1-y0),sp=t*60*I;for(var k=0;k<16;k++){var s=(k/16*per+sp)%per,px,py;if(s<x1-x0){px=x0+s;py=y0;}else if(s<x1-x0+y1-y0){px=x1;py=y0+s-(x1-x0);}else if(s<2*(x1-x0)+y1-y0){px=x1-(s-(x1-x0)-(y1-y0));py=y1;}else{px=x0;py=y1-(s-2*(x1-x0)-(y1-y0));}D.dot(px,py,3.6,C.m,0.85);}
  D.rect(230,y0-18,110,36,C.f,C.bg,2.4);D.text('R₁ = 4,7 kΩ',285,y0+6,{s:15,a:'center',c:C.f,bold:true});
  D.rect(x1-18,200,36,110,C.hl,C.bg,2.4);D.text('R₂',x1+28,250,{s:16,c:C.hl,bold:true});D.text(nf(R2,1)+' kΩ',x1+28,272,{s:15,c:C.hl});
  var bx=530,by=y0,bh=y1-y0;D.rect(bx,by,40,bh,C.grid,null,1.2);D.rect(bx,by+bh*(1-V2/V),40,bh*V2/V,null,RG(C.hl,.55));D.rect(bx,by,40,bh*(1-V2/V),null,RG(C.f,.35));
  D.text('V₁',bx+48,by+bh*(1-V2/V)/2+5,{s:15,c:C.f});D.text('V₂',bx+48,by+bh*(1-V2/V/2)+5,{s:15,c:C.hl});
  U.readout(D,['I = 12/(4,7 + '+nf(R2,1)+') = '+nf(I,2)+' mA','V₁ = I·R₁ = '+nf(I*R1,2)+' V     V₂ = I·R₂ = '+nf(V2,2)+' V'],460);}));
M.reg('fei-t4b',M.traza({title:'MOSFET: corriente de drenador frente a V_{GS}',H:560,dur:16,x0:0,x1:5,ax:{xr:[0,5.2],yr:[0,40],xt:[1,2,3,4,5],yt:[10,20,30,40],xd:0,yd:0,xl:'V_{GS} (V)',yl:'I_{D} (mA)'},h:300,f:function(v){return v<2?0:5*Math.pow(v-2,2);},
 extra:function(D,A){D.line(A.X(2),A.Y(0),A.X(2),A.Y(40),C.hl,1.2,[4,4]);D.text('V_{th} = 2 V',A.X(2)+6,A.Y(37),{s:14,c:C.hl});},
 read:function(v){return ['V_{GS} = '+nf(v,2)+' V    '+(v<2?'corte: I_{D} = 0':'saturación: I_{D} = k(V_{GS} − V_{th})²'),'I_{D} = '+nf(v<2?0:5*Math.pow(v-2,2),1)+' mA    (k = 5 mA/V²)'];},
 caps:[[5,'El MOSFET de enriquecimiento no conduce hasta que la tensión puerta-fuente supera el umbral V<sub>th</sub>: forma el canal.'],[10,'En saturación la corriente crece con el cuadrado del exceso sobre el umbral: <i>I<sub>D</sub> = k(V<sub>GS</sub> − V<sub>th</sub>)²</i>.'],[99,'La puerta está aislada: no consume corriente en continua. Por eso el MOSFET se controla por tensión y es ideal como interruptor.']]}));
})();
