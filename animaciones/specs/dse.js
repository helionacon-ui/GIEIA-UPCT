/* Diseño y Simulación Electrónica: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 flujo de diseño */
var FL=[['Especificación',90,130],['Esquemático',250,130],['Simulación',410,130],['Diseño PCB',550,250],['Prototipo',410,370],['Fabricación',250,370]],FS2=[0,1,2,1,2,3,4,5];
M.reg('dse-t1',M.base({title:'El flujo de diseño electrónico',H:560,dur:20,caps:[[6,'Se parte de una especificación (qué debe hacer, tensiones, corrientes, entorno) y se captura el esquemático.'],[12,'La simulación comprueba si el circuito cumple. Si no, se vuelve al esquemático: es más barato corregir aquí que en la placa.'],[99,'Con el esquema validado se diseña la PCB, se fabrica un prototipo, se mide y, si todo va bien, se pasa a la fabricación en serie.']]},
 function(D,t){var u=seg(t,0.5,19)*(FS2.length-1),k=Math.min(FS2.length-1,Math.floor(u)),cur=FS2[k];
  for(var i=0;i<FL.length-1;i++){var a=FL[i],b=FL[i+1];D.arrow(a[1]+(b[1]>a[1]?60:(b[1]<a[1]?-60:0)),a[2]+(b[2]>a[2]?26:0),b[1]-(b[1]>a[1]?60:(b[1]<a[1]?-60:0)),b[2]-(b[2]>a[2]?26:0),C.ax,1.6);}
  D.path([[410,100],[410,80],[250,80],[250,98]],C.bad,1.8,null,0.8);D.head(250,104,Math.PI/2,C.bad,9);D.text('no cumple',330,72,{s:14,a:'center',c:C.bad});
  FL.forEach(function(f,i){var on=i===cur;D.rect(f[1]-62,f[2]-26,124,52,on?C.m:C.f,on?RG(C.m,.22):RG(C.f,.06),on?3:1.6);D.text(f[0],f[1],f[2]+6,{s:15,a:'center',c:on?C.m:C.f,bold:on});});
  var msg=['¿qué tiene que hacer?','captura del circuito','primera simulación: no cumple','corregir el esquema','segunda simulación: cumple','colocación y ruteo','medir y validar','fabricación en serie'][k];U.readout(D,[msg],470);}));


/* T2 fuente lineal: rizado frente a C */
function rip(Cf,IL){var out=[],v=0,dt=0.05,f=50;for(var i=0;i<=1200;i++){var x=i*dt,vin=Math.abs(17*Math.sin(2*Math.PI*f*x/1000))-1.4;v=Math.max(vin,v-IL*dt/1000/(Cf*1e-6));out.push(v);}return out;}
M.reg('dse-t2',M.base({title:'Fuente lineal: rizado del condensador de filtro',H:560,dur:18,caps:[[6,'Tras el puente, el condensador se carga en cada pico y la carga lo descarga entre picos a corriente casi constante.'],[12,'El rizado pico a pico es <i>V<sub>r</sub> ≈ I<sub>L</sub>/(2·f·C)</i>: el doble de f porque hay dos picos por periodo de red.'],[99,'Con C pequeño el rizado es enorme; al aumentar C baja en proporción inversa, a costa de picos de corriente más altos en los diodos.']]},
 function(D,t){var Cf=lerp(470,4700,U.pp(t,18)),IL=1,o=rip(Cf,IL),A=U.axes(D,{xr:[0,60],yr:[0,18],xt:[10,20,30,40,50,60],yt:[5,10,15],xd:0,yd:0,xl:'t (ms)',yl:'v (V)'},{x:80,y:96,w:480,h:300,grid:true});
  U.plotf(D,A,function(x){return Math.max(0,Math.abs(17*Math.sin(2*Math.PI*50*x/1000))-1.4);},C.f,1.4,0.5);
  D.path(o.map(function(v,i){return [A.X(i*0.05),A.Y(v)];}),C.m,2.8);var tail=o.slice(400),mn=Math.min.apply(null,tail),mx=Math.max.apply(null,tail);
  D.line(A.X(0),A.Y(mn),A.X(60),A.Y(mn),C.hl,1,[4,4]);
  U.readout(D,['C = '+nf(Cf,0)+' µF    I_{L} = 1 A','V_{r} medido = '+nf(mx-mn,2)+' V    I_{L}/(2fC) = '+nf(IL/(100*Cf*1e-6),2)+' V'],468);}));

/* T3 regulador lineal frente a LDO */
M.reg('dse-t3',M.base({title:'Regulador lineal y LDO: tensión de caída',H:560,dur:16,caps:[[5,'Un regulador lineal solo regula si la entrada supera a la salida en su tensión de caída (dropout).'],[10,'Un regulador clásico necesita unos 2 V de margen; un LDO se conforma con unos 0,3 V.'],[99,'Por debajo del dropout la salida sigue a la entrada y deja de estar regulada. La potencia disipada es <i>(V<sub>in</sub> − V<sub>out</sub>)·I</i>.']]},
 function(D,t){var vin=lerp(0,8,ease(seg(t,1,14))),A=U.axes(D,{xr:[0,8.4],yr:[0,4.4],xt:[2,4,6,8],yt:[1,2,3,3.3,4],xd:0,yd:1,xl:'V_{in} (V)',yl:'V_{out} (V)'},{x:80,y:96,w:480,h:300,grid:true});
  var fa=function(v){return clamp(v-2,0,3.3);},fb=function(v){return clamp(v-0.3,0,3.3);};U.plotf(D,A,function(v){return v;},C.mut,1,0.4);
  U.plotf(D,A,fa,C.f,1.4,0.4);U.plotf(D,A,fb,C.g,1.4,0.4);
  [[fa,C.f,'clásico'],[fb,C.g,'LDO']].forEach(function(q,k){var p=[];for(var i=0;i<=200;i++){var v=vin*i/200;p.push([A.X(v),A.Y(q[0](v))]);}D.path(p,q[1],3);D.dot(A.X(vin),A.Y(q[0](vin)),6,q[1]);D.text(q[2],A.X(k?3.7:5.4),A.Y(3.3)-10-k*0,{s:16,c:q[1],a:'center'});});
  U.readout(D,['V_{in} = '+nf(vin,2)+' V','clásico: '+nf(fa(vin),2)+' V'+(vin>=5.3?' (regula)':' (sin regular)')+'    LDO: '+nf(fb(vin),2)+' V'+(vin>=3.6?' (regula)':' (sin regular)')],468);}));

/* T4 cálculo térmico */
M.reg('dse-t4',M.base({title:'Cálculo térmico: de la unión al ambiente',H:580,dur:18,caps:[[6,'El calor atraviesa resistencias térmicas en serie: unión-cápsula, cápsula-disipador y disipador-ambiente.'],[12,'Cada una produce un salto de temperatura <i>ΔT = P·R<sub>θ</sub></i>, igual que la ley de Ohm: P hace de corriente y T de tensión.'],[99,'La temperatura de la unión <i>T<sub>j</sub> = T<sub>a</sub> + P·(R<sub>jc</sub> + R<sub>cs</sub> + R<sub>sa</sub>)</i> no debe superar la máxima del componente (aquí 150 °C).']]},
 function(D,t){var P=lerp(2,16,U.pp(t,18)),Ta=40,R=[['R_{jc}',1.5,C.f],['R_{cs}',0.5,C.g],['R_{sa}',5,C.m]],x0=120,y0=440,k=1.9,T=Ta;
  D.line(80,y0-(150-Ta)*k,560,y0-(150-Ta)*k,C.bad,1.6,[6,4]);D.text('T_{j,máx} = 150 °C',560,y0-(150-Ta)*k-8,{s:15,c:C.bad,a:'right'});
  D.line(80,y0,560,y0,C.ax,1.4);D.text('T_{a} = 40 °C',560,y0-8,{s:15,c:C.mut,a:'right'});
  var x=x0;R.slice().reverse().forEach(function(r){var d=P*r[1];D.rect(x,y0-(T-Ta+d)*k,110,d*k,r[2],RG(r[2],.25),1.6);D.text(r[0]+' = '+nf(r[1],1)+' K/W',x+55,y0+22,{s:14,a:'center',c:r[2]});D.text('ΔT = '+nf(d,1),x+55,y0-(T-Ta+d)*k-8,{s:14,a:'center',c:r[2]});T+=d;x+=140;});
  U.readout(D,['P = '+nf(P,1)+' W     T_{j} = '+nf(T,1)+' °C',T>150?'¡supera T_{j,máx}! hace falta un disipador mejor':'dentro de margen'],510);}));

/* T5 simulación transitoria: paso de integración */
M.reg('dse-t5',M.base({title:'Simulación transitoria: el paso de cálculo importa',H:560,dur:18,caps:[[6,'Un simulador como LTspice no resuelve el circuito de forma continua: avanza a pasos de tiempo h y calcula la tensión en cada uno.'],[12,'Con un paso grande (aquí h = 0,6·τ) la curva calculada se separa de la solución exacta del circuito RC.'],[99,'Con un paso pequeño (h = 0,1·τ) los puntos caen sobre la curva real. Por eso conviene limitar el paso máximo cuando hay flancos rápidos.']]},
 function(D,t){var h=t<9?0.6:0.1,A=U.axes(D,{xr:[0,5],yr:[0,1.15],xt:[1,2,3,4,5],yt:[0.5,1],xd:0,yd:1,xl:'t/τ',yl:'v/V'},{x:80,y:96,w:480,h:300,grid:true});
  U.plotf(D,A,function(x){return 1-Math.exp(-x);},C.f,2.4);var n=Math.floor(seg(t%9,0.5,7.5)*5/h),v=0,p=[[A.X(0),A.Y(0)]];
  for(var i=1;i<=n;i++){v=v+h*(1-v);p.push([A.X(i*h),A.Y(v)]);}D.path(p,C.m,1.6,null,0.7);p.forEach(function(q){D.dot(q[0],q[1],h>0.3?6:3.5,C.m);});
  var err=n?Math.abs(v-(1-Math.exp(-n*h))):0;U.readout(D,['h = '+nf(h,1)+'·τ     '+n+' pasos','error en el último punto = '+nf(err*100,1)+' %'],468);}));

/* T6 símbolo y huella */
M.reg('dse-t6',M.base({title:'Crear un componente: símbolo, huella y pines',H:560,dur:16,caps:[[5,'Un componente de la librería tiene dos caras: el <b>símbolo</b> del esquemático y la <b>huella</b> (footprint) de la PCB.'],[10,'Lo que las une es la tabla de pines: el pin 2 del símbolo (entrada −) debe corresponder al pad 2 de la huella.'],[99,'Un error en esa correspondencia no lo detecta la simulación: la placa sale fabricada con el componente mal conectado. Siempre se comprueba con la hoja de datos.']]},
 function(D,t){var cx=170,cy=260;D.path([[cx-60,cy-80],[cx-60,cy+80],[cx+70,cy],[cx-60,cy-80]],C.f,2.6,RG(C.f,.1));D.text('−',cx-48,cy-34,{s:20,c:C.f});D.text('+',cx-48,cy+44,{s:20,c:C.f});
  var sp=[[2,cx-60,cy-40,'IN−'],[3,cx-60,cy+40,'IN+'],[6,cx+70,cy,'OUT'],[7,cx,cy-40,'V+'],[4,cx,cy+40,'V−']];
  sp.forEach(function(q){var ex=q[1]===cx-60?q[1]-40:(q[1]===cx+70?q[1]+40:q[1]),ey=q[1]===cx?(q[2]<cy?cy-100:cy+100):q[2];D.line(q[1],q[2],ex,ey,C.f,2);D.text(q[0]+'',ex+(ex<q[1]?-4:6),ey-6,{s:14,c:C.f,a:ex<q[1]?'right':'left'});q.push(ex,ey);});
  var fx=470,fy=170;D.rect(fx-30,fy-20,60,240,C.mut,null,1.2);D.dot(fx-18,fy-8,3,C.mut);var pads={};for(var i=0;i<4;i++){[[i+1,fx-62,fy+i*60],[8-i,fx+38,fy+i*60]].forEach(function(q){D.rect(q[1],q[2],24,34,C.hl,RG(C.hl,.3),1.6);D.text(q[0]+'',q[1]+12,q[2]+23,{s:14,a:'center',c:C.hl,bold:true});pads[q[0]]=[q[1]+12,q[2]+17];});}
  sp.forEach(function(q,k){var a=ease(seg(t,3+k*2,4.5+k*2));if(a<=0)return;var P=pads[q[0]],ex=q[4],ey=q[5],xx=lerp(ex,P[0],a),yy=lerp(ey,P[1],a);D.line(ex,ey,xx,yy,C.m,1.4,[4,3],0.8);if(a>=1)D.text(q[3],(ex+P[0])/2,(ey+P[1])/2-6,{s:13,c:C.m,a:'center'});});
  D.text('símbolo',cx,cy+140,{s:16,a:'center',c:C.f});D.text('huella SOIC-8',fx,fy+268,{s:16,a:'center',c:C.hl});}));

/* T7 tamaños de encapsulados SMD */
M.reg('dse-t7',M.base({title:'Encapsulados SMD de chip: el código es el tamaño',H:540,dur:16,caps:[[5,'En resistencias y condensadores de chip el código indica largo y ancho en centésimas de pulgada: 0603 = 0,06″ × 0,03″.'],[10,'En milímetros: 0402 ≈ 1,0 × 0,5; 0603 ≈ 1,6 × 0,8; 0805 ≈ 2,0 × 1,25; 1206 ≈ 3,2 × 1,6.'],[99,'Más pequeño ahorra área pero es más difícil de soldar a mano y disipa menos potencia. 0603 y 0805 son el término medio habitual.']]},
 function(D,t){var P=[['0402',1.0,0.5,'1/16 W'],['0603',1.6,0.8,'1/10 W'],['0805',2.0,1.25,'1/8 W'],['1206',3.2,1.6,'1/4 W']],k=42,x=60,base=330;
  P.forEach(function(q,i){var a=ease(seg(t,1+i*2.5,2.5+i*2.5));if(a<=0){x+=q[1]*k+40;return;}var w=q[1]*k*a,h=q[2]*k*a,yy=base-h;
   D.rect(x,yy,w,h,C.mut,RG(C.w,.12),1.2);D.rect(x,yy,w*0.18,h,null,RG(C.hl,.6));D.rect(x+w*0.82,yy,w*0.18,h,null,RG(C.hl,.6));
   D.text(q[0],x+w/2,base+28,{s:18,a:'center',c:C.m,bold:true,al:a});D.text(nf(q[1],1)+' × '+nf(q[2],2)+' mm',x+w/2,base+50,{s:13,a:'center',c:C.mut,al:a});D.text(q[3],x+w/2,base+70,{s:13,a:'center',c:C.f,al:a});x+=q[1]*k+40;});
  D.line(60,base+100,60+5*k,base+100,C.ax,1.6);D.line(60,base+94,60,base+106,C.ax,1.6);D.line(60+5*k,base+94,60+5*k,base+106,C.ax,1.6);D.text('5 mm',60+2.5*k,base+122,{s:14,a:'center',c:C.mut});
  var i=Math.min(3,Math.floor(seg(t,1,11)*4));D.text(P[i][0]+':  0,'+P[i][0].slice(0,2)+'″ × 0,'+P[i][0].slice(2)+'″',W/2,500,{s:20,a:'center',c:C.m});}));

/* T8 filtro paso bajo de 2.º orden: efecto de Q */
function mag(x,Q){var w=Math.pow(10,x);return 20*Math.log10(1/Math.sqrt(Math.pow(1-w*w,2)+Math.pow(w/Q,2)));}
M.reg('dse-t8',M.curva({title:'Filtro paso bajo de 2.º orden: el factor Q',H:560,dur:18,p:[0.5,3],ax:{xr:[-1.5,1.5],yr:[-50,12],xt:[-1,0,1],yt:[-40,-20,-3,10],xf:function(v){return ['0,1','1','10'][v+1]+'·f_{c}';},yd:0,xl:'f',yl:'|H| (dB)'},h:300,
 curvas:[{f:function(x){return -10*Math.log10(1+Math.pow(10,2*x));},c:'g',w:1.6,fija:true},{f:function(x,Q){return mag(x,Q);},c:'f'}],
 extra:function(D,A){D.line(A.X(-1.5),A.Y(-3),A.X(1.5),A.Y(-3),C.mut,1,[4,4]);D.text('1.er orden: −20 dB/déc',A.X(1.45),A.Y(-28),{s:14,c:C.g,a:'right'});},
 read:function(Q){return ['Q = '+nf(Q,2)+'    pico en f_{c}: '+nf(20*Math.log10(Q),1)+' dB','2.º orden: −40 dB/década'+(Math.abs(Q-0.707)<0.08?'  (Butterworth, máximamente plano)':'')];},
 caps:[[6,'Un filtro de 2.º orden (por ejemplo, Sallen-Key) cae a −40 dB/década, el doble que uno RC de 1.er orden (verde).'],[12,'El factor Q fija la forma cerca de f<sub>c</sub>: con Q = 0,707 la respuesta es máximamente plana (Butterworth).'],[99,'Con Q mayor aparece un pico de resonancia de 20·log Q dB; con Q menor la caída empieza antes y es más suave.']]}));

/* T9 anchura de pista frente a corriente (IPC-2221) */
function wmm(I){var A=Math.pow(I/(0.048*Math.pow(10,0.44)),1/0.725);return A/1.378*0.0254;}
M.reg('dse-t9',M.traza({title:'Ruteo de la PCB: anchura de pista y corriente',H:560,dur:16,x0:0.1,x1:6,ax:{xr:[0,6.3],yr:[0,3.8],xt:[1,2,3,4,5,6],yt:[1,2,3],xd:0,yd:0,xl:'I (A)',yl:'ancho (mm)'},h:300,f:wmm,
 extra:function(D,A,I){var w=wmm(I);D.text('pista a escala ×10',110,124,{s:13,c:C.mut});D.rect(110,134,170,Math.max(2,w*10),null,RG(C.hl,.85));},
 read:function(I){return ['I = '+nf(I,1)+' A  →  ancho mínimo ≈ '+nf(wmm(I),2)+' mm','cobre de 35 µm (1 oz), capa exterior, ΔT = 10 °C'];},
 caps:[[6,'Una pista es una resistencia: con más corriente se calienta más. La norma IPC-2221 da la sección necesaria para un calentamiento dado.'],[11,'La relación no es lineal: <i>I = k·ΔT<sup>0,44</sup>·A<sup>0,725</sup></i>. Duplicar la corriente exige bastante más del doble de anchura.'],[99,'Las pistas de señal pueden ser finas (0,2 mm), pero las de potencia y masa se ensanchan o se convierten en planos de cobre.']]}));

/* T10 coste unitario frente a cantidad */
M.reg('dse-t10',M.traza({title:'Salida a fábrica: coste por placa y cantidad',H:560,dur:16,x0:0,x1:4,ax:{xr:[0,4.2],yr:[0,2.8],xt:[0,1,2,3,4],yt:[1,2],xf:function(v){return ['1','10','100','1000','10⁴'][v];},yf:function(v){return ['','10 €','100 €'][v];},xl:'unidades',yl:'€/placa'},h:300,
 f:function(x){return Math.log10(400/Math.pow(10,x)+3);},
 read:function(x){var n=Math.pow(10,x),c=400/n+3;return [nf(n,0)+' placas:  coste unitario ≈ '+nf(c,c<10?2:0)+' €','= utillaje y preparación (400 €)/n + material y montaje (3 €)'];},
 caps:[[5,'Fabricar una PCB tiene un coste fijo (preparación, plantillas, programación de la máquina) y un coste por unidad.'],[10,'Repartido entre pocas placas, el coste fijo domina; con miles, el precio tiende al coste de material y montaje.'],[99,'Diseñar para fabricación (DFM: tolerancias estándar, pocas caras de montaje, componentes comunes) reduce los dos términos.']]}));
})();
