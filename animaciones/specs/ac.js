/* Análisis de Circuitos: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 intensidad = carga por unidad de tiempo */
M.reg('ac-t1',M.base({title:'Intensidad: carga que atraviesa una sección',H:520,dur:16,caps:[[5,'La intensidad mide cuánta carga atraviesa una sección del conductor por segundo: <i>I = dq/dt</i>.'],[11,'Contamos las cargas que cruzan la sección marcada: si pasan 2 C cada segundo, la intensidad es 2 A.'],[99,'Con la tensión <i>V</i> entre los extremos, la potencia que recibe el elemento es <i>P = V·I</i> (W = J/s).']]},
 function(D,t){var y=220,x0=60,x1=580;D.rect(x0,y-40,x1-x0,80,C.w,RG(C.f,.08),2);var sx=320;D.line(sx,y-60,sx,y+60,C.hl,2.6,[6,4]);D.text('sección',sx,y-70,{s:15,a:'center',c:C.hl});
  var n=0;for(var k=0;k<24;k++){var x=x0+((t*60+k*40)%(x1-x0)),yy=y+((k*37)%60)-30;D.dot(x,yy,6,C.m);D.text('+',x,yy+4,{s:10,a:'center',c:C.bg});}
  var q=Math.max(0,t-0.5)*2;D.text('q = '+nf(q,1)+' C   en   t = '+nf(Math.max(0,t-0.5),1)+' s',W/2,330,{it:true,s:22,a:'center',c:C.m});D.text('I = q/t = 2 A',W/2,368,{it:true,s:24,a:'center',c:C.hl,bold:true});
  D.text('si V = 12 V:  P = V·I = 24 W',W/2,410,{it:true,s:20,a:'center'});}));

/* T2 reducción serie-paralelo */
function rbox(D,x,y,w,h,lab,c,al){al=al===undefined?1:al;if(al<=0.01)return;D.ctx.save();D.ctx.globalAlpha=al;D.rect(x,y,w,h,null,C.bg);D.rect(x,y,w,h,c,RG(c,.14),2.2);D.ctx.restore();D.text(lab,x+w/2,y+h/2+6,{s:16,a:'center',c:c,bold:true,al:al});}
M.reg('ac-t2',M.base({title:'Reducir una red paso a paso',H:540,dur:18,caps:[[6,'Red: R₁ = 4 Ω en serie con el paralelo de R₂ = 6 Ω y R₃ = 3 Ω. Se empieza por el grupo más interno.'],[12,'Dos resistencias en paralelo se sustituyen por <i>R₂R₃/(R₂ + R₃)</i> = 18/9 = 2 Ω.'],[99,'Quedan dos en serie, que se suman: R<sub>eq</sub> = 4 + 2 = 6 Ω. Con 12 V, la fuente entrega I = 12/6 = 2 A.']]},
 function(D,t){var a=ease(seg(t,5,8)),b=ease(seg(t,11,14)),y=230,c1=C.f,c2=C.hl,cm=C.m;
  D.line(60,y,60,y+150,C.ax,2.4);D.line(60,y+150,580,y+150,C.ax,2.4);D.line(580,y+150,580,y,C.ax,2.4);D.dot(60,y+75,16,RG(C.bad,.12));D.ring(60,y+75,16,C.bad,2);D.text('12 V',30,y+80,{s:14,c:C.bad,a:'right'});
  if(b<1){var xR1=lerp(130,250,b);D.line(60,y,xR1,y,C.ax,2.4);rbox(D,xR1,y-22,90,44,'R₁ = 4 Ω',c1,clamp(1-2*b,0,1));
   var xp=lerp(330,250,b);D.line(xR1+90,y,xp,y,C.ax,2.4);
   if(a<1){var sp=lerp(55,0,a);D.line(xp,y,xp,y-sp,C.ax,2.4);D.line(xp,y,xp,y+sp,C.ax,2.4);rbox(D,xp+20,y-sp-22,110,44,'R₂ = 6 Ω',c2,clamp(1-2*a,0,1));rbox(D,xp+20,y+sp-22,110,44,'R₃ = 3 Ω',c2,clamp(1-2*a,0,1));D.line(xp,y-sp,xp+20,y-sp,C.ax,2.4);D.line(xp,y+sp,xp+20,y+sp,C.ax,2.4);D.line(xp+130,y-sp,xp+150,y-sp,C.ax,2.4);D.line(xp+130,y+sp,xp+150,y+sp,C.ax,2.4);D.line(xp+150,y-sp,xp+150,y+sp,C.ax,2.4);}
   if(a>0)rbox(D,xp+20,y-22,110,44,'R₂∥R₃ = 2 Ω',cm,clamp(2*a-1,0,1)*clamp(1-2*b,0,1));D.line(xp+150,y,580,y,C.ax,2.4);}
  if(b>0){D.line(60,y,250,y,C.ax,2.4);rbox(D,250,y-26,140,52,'R_{eq} = 6 Ω',C.y,clamp(2*b-1,0,1));D.line(390,y,580,y,C.ax,2.4);}
  U.readout(D,[b>0.5?'R_{eq} = 4 + 2 = 6 Ω    I = 12/6 = 2 A':(a>0.5?'paralelo: 6·3/(6+3) = 2 Ω':'empezar por el paralelo')],470);}));


/* T3 máxima transferencia de potencia */
M.reg('ac-t3',M.traza({title:'Thévenin y máxima transferencia de potencia',H:540,dur:16,x0:0.2,x1:20,ax:{xr:[0,20],yr:[0,10.5],xt:[4,8,12,16,20],yt:[3,6,9],xd:0,yd:0,xl:'R_{L} (Ω)',yl:'P_{L} (W)'},h:300,f:function(r){return 144*r/Math.pow(4+r,2);},
 extra:function(D,A){D.line(A.X(4),A.Y(0),A.X(4),A.Y(9),C.hl,1.4,[5,4]);D.dot(A.X(4),A.Y(9),5,C.hl);D.text('máx: R_{L} = R_{th} = 4 Ω, 9 W',A.X(4)+10,A.Y(9)-8,{s:15,c:C.hl});},
 read:function(r){var I=12/(4+r);return ['R_{L} = '+nf(r,1)+' Ω    I = '+nf(I,2)+' A    P_{L} = I²R_{L} = '+nf(I*I*r,2)+' W','equivalente Thévenin: V_{th} = 12 V,  R_{th} = 4 Ω'];},
 caps:[[6,'Cualquier red lineal vista desde dos terminales equivale a una fuente <i>V<sub>th</sub></i> con una resistencia <i>R<sub>th</sub></i> en serie.'],[11,'Si la carga es muy pequeña circula mucha corriente pero cae poca tensión; si es muy grande, al revés. La potencia pasa por un máximo.'],[99,'La potencia en la carga es máxima cuando <i>R<sub>L</sub> = R<sub>th</sub></i>, y vale <i>V<sub>th</sub>²/(4R<sub>th</sub>)</i>. En ese punto el rendimiento es del 50 %.']]}));

/* T4 fasor y valor eficaz */
M.reg('ac-t4',M.fasor({title:'Señal senoidal y su fasor',H:540,dur:16,w:1.3,S:90,cy:230,
 vec:function(t){return [{m:1,a:1.3*t+0.5,l:'V',c:'m'}];},
 extra:function(D,t,g){var ef=1/Math.SQRT2;D.line(300,g.cy-g.S*ef,620,g.cy-g.S*ef,C.hl,1.4,[6,4]);D.text('V_{ef} = V_{m}/√2',540,g.cy-g.S*ef-8,{s:15,c:C.hl});D.text('V_{m}',300,g.cy-g.S-6,{s:15,c:C.m});},
 read:function(t){var a=(1.3*t+0.5)%(2*Math.PI);return ['v(t) = V_{m}·sen(ωt + φ)    ωt + φ = '+nf(a*180/Math.PI,0)+'°','fasor V = V_{ef}∠φ : un número complejo que guarda amplitud y fase'];},
 caps:[[6,'Una tensión senoidal es la proyección de un vector que gira a velocidad ω. Ese vector «congelado» en t = 0 es el <b>fasor</b>.'],[11,'Todas las magnitudes de un circuito en alterna giran a la misma ω, así que basta trabajar con los fasores: módulo y ángulo.'],[99,'El valor eficaz <i>V<sub>ef</sub> = V<sub>m</sub>/√2</i> es el que produce el mismo calor que una continua. Los 230 V de la red son eficaces (325 V de pico).']]}));

/* T5 impedancia RL al variar la frecuencia */
M.reg('ac-t5',M.base({title:'Impedancia de un circuito RL',H:540,dur:18,caps:[[6,'En serie, <i>Z = R + jωL</i>. La resistencia no depende de la frecuencia; la reactancia inductiva <i>X<sub>L</sub> = ωL</i> crece con ella.'],[12,'El triángulo de impedancias se estira hacia arriba: el módulo <i>|Z|</i> crece y el ángulo φ se acerca a 90°.'],[99,'A baja frecuencia el circuito es casi resistivo; a alta, casi inductivo (la bobina «frena» la corriente).']]},
 function(D,t){var w=lerp(10,400,U.pp(t,18)),R=100,L=0.5,X=w*L,Z=Math.hypot(R,X),ph=Math.atan2(X,R),s=1.1,x0=90,y0=430;
  D.arrow(x0,y0,x0+R*s,y0,C.f,3);D.text('R = 100 Ω',x0+R*s/2,y0+24,{s:16,a:'center',c:C.f});var yX=y0-Math.min(X,300)*s;D.arrow(x0+R*s,y0,x0+R*s,yX,C.g,3);D.text('X_{L} = ωL',x0+R*s+10,(y0+yX)/2,{s:16,c:C.g});
  D.arrow(x0,y0,x0+R*s,yX,C.m,3.4);D.text('|Z|',x0+R*s/2-26,(y0+yX)/2,{s:17,c:C.m});
  var A=U.axes(D,{xr:[0,420],yr:[0,240],xt:[100,200,300,400],yt:[100,200],xd:0,yd:0,xl:'ω',yl:'|Z|'},{x:330,y:120,w:260,h:240,grid:true});U.plotf(D,A,function(x){return Math.hypot(100,x*0.5);},C.m,2.4);D.dot(A.X(w),A.Y(Z),6,C.m);
  D.text('ω = '+nf(w,0)+' rad/s    |Z| = '+nf(Z,1)+' Ω    φ = '+nf(ph*180/Math.PI,1)+'°',W/2,500,{it:true,s:20,a:'center',c:C.m});}));

/* T6 potencia instantánea y media */
M.reg('ac-t6',M.curva({title:'Potencia en alterna: el factor de potencia',H:560,dur:20,p:[0,90],ax:{xr:[0,4*Math.PI],yr:[-1.2,1.3],xt:[],yt:[-1,1],yd:0,xl:'ωt',yl:''},h:300,ghost:false,
 curvas:[{f:function(x){return Math.sin(x);},c:'f',w:1.8,fija:true},{f:function(x,p){return Math.sin(x-p*Math.PI/180);},c:'g',w:1.8},{f:function(x,p){return Math.sin(x)*Math.sin(x-p*Math.PI/180);},c:'m',w:3}],
 extra:function(D,A,p){var Pm=0.5*Math.cos(p*Math.PI/180);D.line(A.X(0),A.Y(Pm),A.X(4*Math.PI),A.Y(Pm),C.hl,2,[6,4]);D.text('P media',A.X(4*Math.PI)-4,A.Y(Pm)-8,{s:14,c:C.hl,a:'right'});D.text('v',A.X(0.3),A.Y(1.1),{it:true,s:16,c:C.f});D.text('i',A.X(1.0),A.Y(1.1),{it:true,s:16,c:C.g});D.text('p = v·i',A.X(2.2),A.Y(1.2),{it:true,s:16,c:C.m});},
 read:function(p){return ['desfase φ = '+nf(p,0)+'°    cos φ = '+nf(Math.cos(p*Math.PI/180),2),'P = V_{ef}·I_{ef}·cos φ   (aquí '+nf(0.5*Math.cos(p*Math.PI/180),2)+' en unidades de V_{m}I_{m})'];},
 caps:[[7,'La potencia instantánea es <i>p = v·i</i>. Si tensión e intensidad están en fase, p es siempre positiva: la carga solo consume.'],[14,'Con desfase, hay intervalos con <i>p &lt; 0</i>: la energía vuelve a la red. La media baja con <i>cos φ</i>.'],[99,'Con φ = 90° (bobina o condensador ideal) la potencia media es cero: solo hay potencia <b>reactiva</b>, que va y viene sin consumirse.']]}));

/* T7 resonancia serie */
M.reg('ac-t5b',M.curva({title:'Resonancia en un circuito RLC serie',H:540,dur:18,p:[5,60],ax:{xr:[0.2,2],yr:[0,1.1],xt:[0.5,1,1.5,2],yt:[0.5,1],xd:1,yd:1,xl:'ω/ω₀',yl:'I/I_{máx}'},h:300,
 f:function(x,R){var Q=100/R,y=Q*(x-1/x);return 1/Math.sqrt(1+y*y);},
 read:function(R){var Q=100/R;return ['R = '+nf(R,0)+' Ω     Q = ω₀L/R = '+nf(Q,1),'ancho de banda Δω = ω₀/Q = '+nf(1/Q,2)+'·ω₀'];},
 caps:[[6,'En resonancia, <i>ω₀ = 1/√(LC)</i>, las reactancias de L y C se anulan: la impedancia es solo R y la corriente es máxima.'],[12,'Con poca resistencia la curva es muy estrecha: el circuito es <b>selectivo</b> (factor de calidad Q alto).'],[99,'Al aumentar R la curva se ensancha y Q baja. Es el principio de los sintonizadores de radio y los filtros pasabanda.']]}));

/* T8 carga de un condensador */
M.reg('ac-t8',M.traza({title:'Transitorio RC: carga del condensador',H:540,dur:16,ax:{xr:[0,5],yr:[0,1.1],xt:[1,2,3,4,5],yt:[0.632,0.865,1],xd:0,yd:3,xl:'t/τ',yl:'v_{C}/V'},h:300,f:function(x){return 1-Math.exp(-x);},
 extra:function(D,A,x){for(var k=1;k<=3;k++){if(x<k)break;var v=1-Math.exp(-k);D.line(A.X(k),A.Y(0),A.X(k),A.Y(v),C.hl,1.2,[4,4]);D.text(nf(v*100,1)+' %',A.X(k)+4,A.Y(v)+16,{s:14,c:C.hl});}
   var p=[];for(var s=0;s<=x;s+=0.02)p.push([A.X(s),A.Y(Math.exp(-s))]);D.path(p,C.g,2,null,0.8);D.text('i(t)/I₀',A.X(0.3),A.Y(0.9),{s:14,c:C.g});},
 read:function(x){return ['v_{C}(t) = V·(1 − e^{−t/τ}) = '+nf(100*(1-Math.exp(-x)),1)+' % de V','τ = R·C ;  a los 5τ se considera cargado (99,3 %)'];},
 caps:[[6,'Al cerrar el interruptor el condensador empieza a cargarse a través de R. Al principio se comporta como un cortocircuito: la corriente es máxima.'],[11,'La tensión sube exponencialmente: en una constante de tiempo <i>τ = RC</i> alcanza el 63,2 % del valor final.'],[99,'La corriente (verde) cae a la vez: <i>i = (V/R)e<sup>−t/τ</sup></i>. En régimen permanente el condensador es un circuito abierto.']]}));

/* T9 sistema trifásico equilibrado */
M.reg('ac-t9',M.fasor({title:'Sistema trifásico equilibrado',H:540,dur:18,w:1.2,S:80,cy:230,
 vec:function(t){var a=1.2*t;return [{m:1,a:a,l:'V_{a}',c:'m'},{m:1,a:a-2*Math.PI/3,l:'V_{b}',c:'f'},{m:1,a:a+2*Math.PI/3,l:'V_{c}',c:'g'}];},
 extra:function(D,t,g){var a=1.2*t,x=g.cx,y=g.cy;[0,-2*Math.PI/3,2*Math.PI/3].forEach(function(o,i){var ex=x+g.S*0.5*Math.cos(a+o),ey=y-g.S*0.5*Math.sin(a+o);D.line(x,y,ex,ey,C.mut,0.8,[2,3]);});},
 read:function(){return ['tres tensiones iguales desfasadas 120°','V_{a} + V_{b} + V_{c} = 0   en todo instante'];},
 caps:[[6,'Un sistema trifásico tiene tres tensiones de igual amplitud y frecuencia desfasadas 120° (secuencia directa a-b-c).'],[12,'Si se suman los tres fasores el resultado es cero: en cualquier instante una onda compensa a las otras dos.'],[99,'Por eso, con cargas equilibradas en estrella, por el neutro no circula corriente. Tensión de línea = √3 × tensión de fase.']]}));

/* T10 potencia trifásica constante */
M.reg('ac-t10',M.base({title:'Potencia trifásica: constante en el tiempo',H:540,dur:18,caps:[[6,'Cada fase entrega una potencia que pulsa al doble de frecuencia, como en monofásica.'],[12,'Pero sumando las tres fases las pulsaciones se cancelan: la potencia total es <b>constante</b>.'],[99,'<i>P = √3·V<sub>L</sub>·I<sub>L</sub>·cos φ</i>. Una potencia constante significa par constante en los motores: giran sin vibrar. Es una de las grandes ventajas del trifásico.']]},
 function(D,t){var A=U.axes(D,{xr:[0,4*Math.PI],yr:[0,1.7],xt:[],yt:[0.5,1,1.5],yd:1,xl:'ωt',yl:'p'},{x:80,y:96,w:480,h:300,grid:true}),sh=t*1.1,xm=Math.min(4*Math.PI,lerp(0,4*Math.PI,seg(t,1,10)));
  var ph=0.3,pf=function(o){return function(x){return x<=xm?Math.sin(x+o)*Math.sin(x+o-ph)+0.0*sh:NaN;};};
  [[0,C.m],[-2*Math.PI/3,C.f],[2*Math.PI/3,C.g]].forEach(function(q){U.plotf(D,A,pf(q[0]),q[1],1.8,0.85);});
  U.plotf(D,A,function(x){return x<=xm?1.5*Math.cos(ph):NaN;},C.hl,3.4);D.text('p_{a} + p_{b} + p_{c} = 3·V_{ef}·I_{ef}·cos φ',A.X(4*Math.PI)-4,A.Y(1.5*Math.cos(ph))-10,{s:15,c:C.hl,a:'right'});
  D.text('cada fase: p = V_{m}I_{m}·sen(ωt)·sen(ωt − φ)',W/2,470,{it:true,s:19,a:'center'});}));

/* T11 parámetros Z de un cuadripolo */
function tnet(D,x,y,Z,act){var c=C.ax;D.rect(x,y,300,170,C.mut,null,1.2);D.line(x-40,y+30,x+20,y+30,c,2.2);rz(D,x+20,y+30,'Z_{a}',Z[0]);D.line(x+100,y+30,x+130,y+30,c,2.2);rz(D,x+200,y+30,'Z_{b}',Z[1],true);D.line(x+130,y+30,x+200,y+30,c,2.2);D.line(x+280,y+30,x+340,y+30,c,2.2);
 D.line(x+150,y+30,x+150,y+55,c,2.2);D.rect(x+130,y+55,40,70,C.f,RG(C.f,.12),2);D.text('Z_{c}',x+150,y+96,{s:15,a:'center',c:C.f});D.line(x+150,y+125,x+150,y+150,c,2.2);D.line(x-40,y+150,x+340,y+150,c,2.2);
 function rz(D,x0,y0,l){D.rect(x0,y0-18,80,36,C.f,RG(C.f,.12),2);D.text(l,x0+40,y0+6,{s:15,a:'center',c:C.f});}}
M.reg('ac-t11',M.base({title:'Cuadripolo: medir los parámetros Z',H:580,dur:20,caps:[[7,'Con la salida en abierto (I₂ = 0) se inyecta I₁: la corriente solo recorre Z<sub>a</sub> y Z<sub>c</sub>. Así <i>Z₁₁ = V₁/I₁ = Z<sub>a</sub> + Z<sub>c</sub></i> y <i>Z₂₁ = V₂/I₁ = Z<sub>c</sub></i>.'],[14,'Con la entrada en abierto (I₁ = 0) se inyecta I₂ por la salida: <i>Z₂₂ = Z<sub>b</sub> + Z<sub>c</sub></i> y <i>Z₁₂ = Z<sub>c</sub></i>.'],[99,'Z₁₂ = Z₂₁: las redes pasivas son recíprocas. Red en T con Z<sub>a</sub> = 2, Z<sub>b</sub> = 3 y Z<sub>c</sub> = 5 Ω.']]},
 function(D,t){var x=170,y=120,ph=t<10?1:2,u=(t%10)/10;tnet(D,x,y,[2,3,5]);
  D.text('puerta 1',x-60,y+100,{s:14,c:C.mut,a:'center'});D.text('puerta 2',x+360,y+100,{s:14,c:C.mut,a:'center'});
  var I=1,k=ease(seg(u,0.1,0.5));if(ph===1){D.arrow(x-40,y+30,x-40+60*k,y+30,C.bad,3);D.text('I₁ = 1 A',x-40,y+18,{s:15,c:C.bad});D.text('abierto',x+345,y+128,{s:14,c:C.mut});
   if(k>=1){D.path([[x+20,y+40],[x+140,y+40],[x+140,y+140],[x-30,y+140]],C.bad,2,null,0.6);D.text('V₁ = 7 V',x-50,y+75,{s:16,c:C.m,a:'right',bold:true});D.text('V₂ = 5 V',x+350,y+75,{s:16,c:C.m,bold:true});}}
  else{D.arrow(x+340,y+30,x+340-60*k,y+30,C.bad,3);D.text('I₂ = 1 A',x+290,y+18,{s:15,c:C.bad});D.text('abierto',x-75,y+128,{s:14,c:C.mut});
   if(k>=1){D.path([[x+280,y+40],[x+160,y+40],[x+160,y+140],[x+330,y+140]],C.bad,2,null,0.6);D.text('V₁ = 5 V',x-50,y+75,{s:16,c:C.m,a:'right',bold:true});D.text('V₂ = 8 V',x+350,y+75,{s:16,c:C.m,bold:true});}}
  U.readout(D,[ph===1?'Z₁₁ = 7 Ω    Z₂₁ = 5 Ω':'Z₂₂ = 8 Ω    Z₁₂ = 5 Ω  (= Z₂₁: recíproca)'],420);}));


/* T12 diodo y recta de carga */
function Id(v){return 1e-12*(Math.exp(v/0.0259/1.0)-1)*1000;}
M.reg('ac-t12',M.base({title:'Diodo: punto de trabajo con la recta de carga',H:560,dur:18,caps:[[6,'La curva del diodo (morada) es exponencial: casi no conduce hasta unos 0,6–0,7 V.'],[12,'La recta de carga (azul) sale de la ley de Kirchhoff: <i>V<sub>s</sub> = I·R + V<sub>D</sub></i>. Corta al eje V en V<sub>s</sub> y al eje I en V<sub>s</sub>/R.'],[99,'El <b>punto de trabajo</b> Q es la intersección. Al subir V<sub>s</sub> la recta se desplaza paralela y la corriente crece mucho, pero V<sub>D</sub> casi no cambia.']]},
 function(D,t){var Vs=lerp(1,5,U.pp(t,18)),R=200,A=U.axes(D,{xr:[0,5.2],yr:[0,26],xt:[0.7,1,2,3,4,5],yt:[5,10,15,20,25],xd:1,yd:0,xl:'V_{D} (V)',yl:'I (mA)'},{x:80,y:96,w:480,h:300,grid:true});
  U.plotf(D,A,function(v){return Id(v);},C.m,3);U.plotf(D,A,function(v){return (Vs-v)/R*1000;},C.f,2.4);
  var lo=0,hi=Vs;for(var i=0;i<60;i++){var m=(lo+hi)/2;if(Id(m)>(Vs-m)/R*1000)hi=m;else lo=m;}var VD=(lo+hi)/2,I=(Vs-VD)/R*1000;
  D.dot(A.X(VD),A.Y(I),7,C.hl);D.text('Q',A.X(VD)+10,A.Y(I)-6,{s:17,c:C.hl,bold:true});
  D.text('V_{s} = '+nf(Vs,2)+' V,  R = 200 Ω   →   V_{D} = '+nf(VD,3)+' V,  I = '+nf(I,1)+' mA',W/2,470,{it:true,s:20,a:'center',c:C.m});}));
/* T7 máxima transferencia de potencia en alterna */
M.reg('ac-t7',M.traza({title:'Teoremas en alterna: máxima transferencia de potencia',H:560,dur:16,x0:-8,x1:2,ax:{xr:[-8.5,2.5],yr:[0,7],xt:[-8,-6,-4,-3,-2,0,2],yt:[2,4,6.25],xd:0,yd:2,xl:'X_{L} (Ω)',yl:'P (W)'},h:300,
 f:function(X){return 100*4/(64+Math.pow(3+X,2))/1;},
 extra:function(D,A){D.line(A.X(-3),A.Y(0),A.X(-3),A.Y(6.25),C.hl,1.2,[4,4]);D.text('X_{L} = −X_{th}',A.X(-3)+6,A.Y(6.6),{s:14,c:C.hl});},
 read:function(X){return ['Thévenin: V_{th} = 10 V,  Z_{th} = 4 + j3 Ω    carga: Z_{L} = 4 '+(X<0?'− j':'+ j')+nf(Math.abs(X),2)+' Ω','P = |V_{th}|²R_{L}/|Z_{th} + Z_{L}|² = '+nf(100*4/(64+Math.pow(3+X,2)),2)+' W'];},
 caps:[[5,'En alterna los teoremas de Thévenin y Norton son los mismos, pero con impedancias complejas y fasores.'],[10,'La potencia activa en la carga depende de su parte reactiva: la reactancia de la carga puede compensar la de la fuente.'],[99,'El máximo se da con la carga conjugada, <i>Z<sub>L</sub> = Z<sub>th</sub>*</i>: aquí 4 − j3 Ω, con <i>P<sub>máx</sub> = |V<sub>th</sub>|²/(4R<sub>th</sub>) = 6,25 W</i>.']]}));
M.reg('ac-t6b',M.base({title:'Corrección del factor de potencia',H:580,dur:18,caps:[[6,'Un motor consume P = 10 kW con cos φ = 0,7: además pide potencia reactiva inductiva Q<sub>L</sub> que no hace trabajo pero sobrecarga la línea.'],[12,'Un condensador en paralelo aporta reactiva de signo contrario: la Q total baja y con ella la potencia aparente S y la corriente.'],[99,'P no cambia. Mueve «Prueba tú» para elegir la batería: <i>Q<sub>C</sub> = P(tg φ₁ − tg φ₂)</i>.']]},
 function(D,t){var P=10,QL=P*Math.tan(Math.acos(0.7)),QC=lerp(0,QL*0.9,U.pp(t,18)),Q=QL-QC,S=Math.hypot(P,Q),k=30,x0=110,y0=430;
  D.arrow(x0,y0,x0+P*k,y0,C.f,3);D.text('P = 10 kW',x0+P*k/2,y0+26,{s:16,a:'center',c:C.f});D.arrow(x0+P*k,y0,x0+P*k,y0-QL*k,C.mut,1.6);D.arrow(x0+P*k,y0-QL*k,x0+P*k,y0-Q*k,C.g,3);D.text('Q_{C}',x0+P*k+10,y0-(QL+Q)/2*k,{s:16,c:C.g});
  D.arrow(x0,y0,x0+P*k,y0-Q*k,C.m,3);D.text('S = '+nf(S,1)+' kVA',x0+P*k/2-60,y0-Q*k/2-16,{s:16,c:C.m});D.line(x0,y0,x0+P*k,y0-QL*k,C.mut,1,[4,4]);
  U.readout(D,['Q_{L} = '+nf(QL,2)+' kvar    Q_{C} = '+nf(QC,2)+' kvar','cos φ = '+nf(P/S,3)+'    I/I_{inicial} = '+nf(S/Math.hypot(P,QL),2)],520);}));
M.reg('ac-t3b',M.base({title:'Teorema de superposición',H:560,dur:18,caps:[[6,'En un circuito lineal con varias fuentes, la respuesta es la suma de las respuestas a cada fuente actuando sola.'],[12,'Para dejar una fuente sola, las demás se anulan: las de tensión se cortocircuitan y las de corriente se abren.'],[99,'Aquí: I<sub>R</sub> = 1,2 A por la fuente de 12 V más 0,8 A por la de 2 A = 2 A. Ojo: las potencias no se suman.']]},
 function(D,t){var ph=t<6?0:(t<12?1:2),bars=[[1.2,C.f,'solo 12 V'],[0.8,C.hl,'solo 2 A'],[2,C.m,'las dos']];
  D.text(['1. Fuente de corriente abierta','2. Fuente de tensión en corto','3. Suma'][ph],W/2,90,{s:18,a:'center',c:C.w,bold:true});
  var x0=80,y=150;D.rect(x0,y,200,140,C.ax,null,2);D.dot(x0,y+70,18,C.bg);D.ring(x0,y+70,18,ph===1?C.grid:C.f,2.4);D.text('12 V',x0-24,y+76,{s:14,c:ph===1?C.mut:C.f,a:'right'});
  D.dot(x0+200,y+70,18,C.bg);D.ring(x0+200,y+70,18,ph===0?C.grid:C.hl,2.4);D.text('2 A',x0+226,y+76,{s:14,c:ph===0?C.mut:C.hl});D.rect(x0+80,y+120,40,40,C.m,C.bg,2);D.text('R',x0+100,y+146,{s:15,a:'center',c:C.m});
  var A=U.axes(D,{xr:[0,3.4],yr:[0,2.4],xt:[],yt:[1,2],yd:0,xl:'',yl:'I_{R} (A)'},{x:380,y:150,w:220,h:180,grid:true});
  bars.forEach(function(b,i){if(i>ph&&!(ph===2))return;if(ph<2&&i!==ph)return;var x=A.X(0.4+i*1.1),h=A.Y(0)-A.Y(b[0]);if(i===2){D.rect(x,A.Y(1.2),60,A.Y(0)-A.Y(1.2),b[1],RG(C.f,.4),1.6);D.rect(x,A.Y(2),60,A.Y(1.2)-A.Y(2),b[1],RG(C.hl,.4),1.6);}else D.rect(x,A.Y(b[0]),60,h,b[1],RG(b[1],.4),1.6);D.text(b[2],x+30,A.Y(0)+20,{s:12,a:'center',c:b[1]});D.text(nf(b[0],1),x+30,A.Y(b[0])-6,{s:14,a:'center',c:b[1]});});
  if(ph===2){[0,1].forEach(function(i){var b=bars[i],x=A.X(0.4+i*1.1);D.rect(x,A.Y(b[0]),60,A.Y(0)-A.Y(b[0]),b[1],RG(b[1],.4),1.6);D.text(b[2],x+30,A.Y(0)+20,{s:12,a:'center',c:b[1]});});}
  U.readout(D,['I_{R} = I′ + I″ = 1,2 + 0,8 = 2,0 A'],470);}));
})();
