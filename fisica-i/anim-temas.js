/* Física I: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 suma y producto vectorial */
M.reg('fis1-t1',M.base({title:'Suma de vectores y producto vectorial',H:560,dur:18,caps:[[6,'La suma <i>a + b</i> es la diagonal del paralelogramo que forman los dos vectores (regla del paralelogramo).'],[12,'El módulo del producto vectorial, <i>|a × b| = |a|·|b|·sen θ</i>, es el <b>área</b> de ese paralelogramo.'],[99,'Si los vectores son paralelos (θ = 0 o 180°) el área es nula: <i>a × b = 0</i>. Es máximo cuando son perpendiculares.']]},
 function(D,t){var cx=170,cy=330,s=60,a=[2.4,0],th=0.15+t*0.36,b=[1.8*Math.cos(th),1.8*Math.sin(th)],S=[a[0]+b[0],a[1]+b[1]],cr=a[0]*b[1]-a[1]*b[0];
  for(var i=-2;i<=7;i++){D.line(cx+s*i,90,cx+s*i,470,C.grid,1);}for(var j=-2;j<=4;j++){D.line(40,cy-s*j,600,cy-s*j,C.grid,1);}
  var P=[[0,0],a,S,b].map(function(q){return [cx+s*q[0],cy-s*q[1]];});D.path(P,null,0,RG(cr>=0?C.m:C.g,.22));
  D.line(P[1][0],P[1][1],P[2][0],P[2][1],C.mut,1.2,[4,4]);D.line(P[3][0],P[3][1],P[2][0],P[2][1],C.mut,1.2,[4,4]);
  D.arrow(cx,cy,P[1][0],P[1][1],C.f,3);D.arrow(cx,cy,P[3][0],P[3][1],C.g,3);D.arrow(cx,cy,P[2][0],P[2][1],C.m,3.4);
  D.text('a',P[1][0]+6,P[1][1]+20,{it:true,s:20,c:C.f});D.text('b',P[3][0]-16,P[3][1]-4,{it:true,s:20,c:C.g});D.text('a + b',P[2][0]+8,P[2][1]-6,{it:true,s:20,c:C.m});
  var deg=((th*180/Math.PI)%360);D.text('θ = '+nf(deg,0)+'°      |a + b| = '+nf(Math.hypot(S[0],S[1]),2),W/2,505,{it:true,s:22,a:'center'});
  D.text('|a × b| = |a||b| sen θ = '+nf(Math.abs(cr),2)+(cr<0?'   (apunta hacia dentro)':'   (apunta hacia fuera)'),W/2,540,{it:true,s:20,a:'center',c:C.m});}));

/* T2 tiro parabólico */
var v0=10,th0=55*Math.PI/180,g=9.8,T2=2*v0*Math.sin(th0)/g;
M.reg('fis1-t2',M.tray({title:'Tiro parabólico: la velocidad y la aceleración',H:560,dur:14,lin:true,ax:{xr:[-0.3,10.5],yr:[-0.3,4.4],xt:[2,4,6,8,10],yt:[1,2,3,4],xd:0,yd:0,xl:'x (m)',yl:'y (m)'},h:320,s:[0,T2],
 path:function(t){return [v0*Math.cos(th0)*t,v0*Math.sin(th0)*t-g*t*t/2];},vel:function(t){return [v0*Math.cos(th0),v0*Math.sin(th0)-g*t];},kv:0.12,acc:function(){return [0,-g];},ka:0.09,la:'g',
 extra:function(D,A,t){var P=[v0*Math.cos(th0)*t,v0*Math.sin(th0)*t-g*t*t/2],v=[v0*Math.cos(th0),v0*Math.sin(th0)-g*t];D.line(A.X(P[0]),A.Y(P[1]),A.X(P[0]+v[0]*0.12),A.Y(P[1]),C.f,1.2,[3,3],0.6);D.line(A.X(P[0]+v[0]*0.12),A.Y(P[1]),A.X(P[0]+v[0]*0.12),A.Y(P[1]+v[1]*0.12),C.f,1.2,[3,3],0.6);},
 read:function(t){var vy=v0*Math.sin(th0)-g*t;return ['t = '+nf(t,2)+' s    vₓ = '+nf(v0*Math.cos(th0),2)+' m/s    v_{y} = '+nf(vy,2)+' m/s','v₀ = 10 m/s, 55°:  alcance = v₀² sen 2θ / g = 9,59 m,  altura máx. = 3,42 m'];},
 caps:[[5,'La aceleración es siempre <i>g</i>, vertical y hacia abajo. Por eso la componente horizontal de la velocidad no cambia.'],[10,'La componente vertical disminuye a ritmo constante, se anula en el punto más alto y luego crece hacia abajo.'],[99,'La trayectoria es una parábola. La velocidad siempre es <b>tangente</b> a ella; la aceleración no.']]}));

/* T3 órbita de Kepler */
var ea=4,ee=0.6,eb=ea*Math.sqrt(1-ee*ee);
function kep(Mm){var E=Mm;for(var i=0;i<12;i++)E-=(E-ee*Math.sin(E)-Mm)/(1-ee*Math.cos(E));return E;}
function opos(Mm){var E=kep(Mm);return [ea*(Math.cos(E)-ee),eb*Math.sin(E)];}
M.reg('fis1-t3',M.tray({title:'Gravitación: órbita elíptica',H:560,dur:16,lin:true,ax:{xr:[-7.2,2.6],yr:[-3.6,3.6],xt:[],yt:[],noY:false,xl:'',yl:''},h:330,s:[0,2*Math.PI],
 path:opos,vel:function(Mm){var h=1e-3,a=opos(Mm-h),b=opos(Mm+h);return [(b[0]-a[0])/(2*h),(b[1]-a[1])/(2*h)];},kv:0.45,
 acc:function(Mm){var p=opos(Mm),r=Math.hypot(p[0],p[1]);return [-p[0]/(r*r*r),-p[1]/(r*r*r)];},ka:1.6,la:'a',
 extra:function(D,A,Mm){D.dot(A.X(0),A.Y(0),11,C.hl);D.text('Sol',A.X(0)+14,A.Y(0)+20,{s:15,c:C.hl});var p=opos(Mm);
   var pts=[[A.X(0),A.Y(0)]];for(var q=Math.max(0,Mm-0.6);q<=Mm;q+=0.02){var r=opos(q);pts.push([A.X(r[0]),A.Y(r[1])]);}D.path(pts,null,0,RG(C.m,.25));D.line(A.X(0),A.Y(0),A.X(p[0]),A.Y(p[1]),C.mut,1,[3,3]);},
 read:function(Mm){var p=opos(Mm),r=Math.hypot(p[0],p[1]);return ['r = '+nf(r,2)+'    (perihelio 1,6 · afelio 6,4)','la fuerza apunta siempre al Sol: F = −G·M·m/r² · r̂'];},
 caps:[[6,'La fuerza gravitatoria (rosa) apunta siempre hacia el Sol, que está en un <b>foco</b> de la elipse, no en el centro.'],[11,'Cerca del Sol el planeta va más rápido: en tiempos iguales barre <b>áreas iguales</b> (segunda ley de Kepler). El sector morado es el área barrida en el mismo intervalo.'],[99,'Es la conservación del momento angular: como la fuerza es central, <i>L = r × m v</i> se mantiene constante.']]}));

/* T4 conservación de la energía en una montaña rusa */
function hh(x){return 2.2+1.2*Math.cos(x*1.1)-0.15*x;}
M.reg('fis1-t4',M.base({title:'Energía mecánica: cinética y potencial',H:560,dur:16,caps:[[5,'Sin rozamiento, la energía mecánica <i>E = Ec + Ep</i> se conserva: la vagoneta parte del reposo en lo alto.'],[11,'Al bajar, la energía potencial <i>mgh</i> se transforma en cinética <i>½mv²</i>; al subir ocurre lo contrario.'],[99,'Por eso la velocidad solo depende de la altura: <i>v = √(2g(h₀ − h))</i>, sea cual sea la forma de la pista.']]},
 function(D,t){var A=U.axes(D,{xr:[0,6],yr:[0,3.8],xt:[],yt:[1,2,3],yd:0,xl:'',yl:'h (m)'},{x:70,y:90,w:380,h:300,grid:true});
  var pts=[];for(var x=0;x<=6;x+=0.02)pts.push([A.X(x),A.Y(hh(x))]);D.path(pts,C.mut,3);
  var h0=hh(0),xx=lerp(0,5.6,ease(seg(t,1,14))),h=hh(xx),m=1,gg=9.8,Ep=m*gg*h,E=m*gg*h0,Ec=E-Ep,v=Math.sqrt(Math.max(0,2*gg*(h0-h)));
  D.line(A.X(0),A.Y(h0),A.X(6),A.Y(h0),C.hl,1.4,[6,5]);D.text('nivel de E',A.X(4.6),A.Y(h0)-8,{s:14,c:C.hl});
  D.dot(A.X(xx),A.Y(h)-8,10,C.m);
  var bx=500,by=390,bh=290,sc=bh/E;D.rect(bx,by-Ep*sc,44,Ep*sc,C.f,RG(C.f,.35));D.rect(bx,by-E*sc,44,Ec*sc,C.g,RG(C.g,.35));
  D.text('Ep',bx+22,by+20,{s:15,a:'center',c:C.f});D.text('Ec',bx+70,by-E*sc+Ec*sc/2,{s:15,a:'center',c:C.g});D.text('E',bx+22,by-E*sc-8,{it:true,s:16,a:'center',c:C.hl});
  D.text('h = '+nf(h,2)+' m     v = '+nf(v,2)+' m/s',W/2,470,{it:true,s:22,a:'center',c:C.m});D.text('Ec + Ep = '+nf(Ec,1)+' + '+nf(Ep,1)+' = '+nf(E,1)+' J/kg',W/2,506,{it:true,s:20,a:'center'});}));

/* T5 oscilador amortiguado */
function osc(x,z){var w=2;if(z<1){var wd=w*Math.sqrt(1-z*z);return Math.exp(-z*w*x)*(Math.cos(wd*x)+z*w/wd*Math.sin(wd*x));}
  if(Math.abs(z-1)<1e-6)return (1+w*x)*Math.exp(-w*x);var r1=-z*w+w*Math.sqrt(z*z-1),r2=-z*w-w*Math.sqrt(z*z-1);return (r2*Math.exp(r1*x)-r1*Math.exp(r2*x))/(r2-r1);}
M.reg('fis1-t5',M.curva({title:'Oscilador amortiguado',H:540,dur:20,p:[0,1.6],ax:{xr:[0,8],yr:[-1.1,1.1],xt:[2,4,6,8],yt:[-1,1],xd:0,yd:0,xl:'t (s)',yl:'x(t)'},h:290,
 f:function(x,z){return osc(x,Math.abs(z-1)<0.02?1.0000001:z);},
 read:function(z){return ['ζ = '+nf(z,2)+'   →   '+(z<0.02?'sin amortiguamiento: oscila siempre':z<0.98?'subamortiguado: oscila y decae':z<1.02?'amortiguamiento crítico: el más rápido sin oscilar':'sobreamortiguado: vuelve despacio sin oscilar'),'ω₀ = 2 rad/s,   x(0) = 1,   v(0) = 0'];},
 caps:[[6,'Con <i>ζ = 0</i> la masa oscila para siempre con <i>ω₀ = √(k/m)</i>. Al añadir rozamiento viscoso, la amplitud decae como <i>e<sup>−ζω₀t</sup></i>.'],[13,'En <i>ζ = 1</i> (crítico) deja de oscilar: es el retorno al equilibrio más rápido sin pasarse.'],[99,'Con <i>ζ &gt; 1</i> (sobreamortiguado) tampoco oscila, pero tarda más. La curva tenue es el caso sin rozamiento.']]}));

/* T6 centro de masas */
M.reg('fis1-t6',M.base({title:'Sistema de partículas: el centro de masas',H:560,dur:14,caps:[[5,'Lanzamos dos masas unidas por una barra (2 kg y 1 kg). Cada una sigue una curva complicada mientras el conjunto gira.'],[10,'Pero el <b>centro de masas</b> se mueve como una sola partícula con toda la masa: describe una parábola perfecta.'],[99,'Solo las fuerzas exteriores (el peso) mueven el centro de masas. Las fuerzas internas de la barra no lo afectan.']]},
 function(D,t){var A=U.axes(D,{xr:[-0.5,10.5],yr:[-0.5,5],xt:[2,4,6,8,10],yt:[1,2,3,4],xd:0,yd:0,xl:'x (m)',yl:'y (m)'},{x:70,y:90,w:500,h:320,grid:true});
  var T=lerp(0,1.1,seg(t,1,12.5)),cm=function(T){return [0.8+8*T,0.9+6.5*T-4.9*T*T];},ang=function(T){return 1+5*T;},m1=2,m2=1,L=1.2;
  var P=function(T,k){var c=cm(T),a=ang(T),r=k===1?L*m2/(m1+m2):-L*m1/(m1+m2);return [c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];};
  [1,2].forEach(function(k){var pts=[];for(var q=0;q<=T;q+=0.01){var p=P(q,k);pts.push([A.X(p[0]),A.Y(p[1])]);}D.path(pts,k===1?C.f:C.g,1.6,null,0.7);});
  var pc=[];for(var q2=0;q2<=T;q2+=0.01){var c=cm(q2);pc.push([A.X(c[0]),A.Y(c[1])]);}D.path(pc,C.m,3);
  var p1=P(T,1),p2=P(T,2),c=cm(T);D.line(A.X(p1[0]),A.Y(p1[1]),A.X(p2[0]),A.Y(p2[1]),C.w,3);D.dot(A.X(p1[0]),A.Y(p1[1]),11,C.f);D.dot(A.X(p2[0]),A.Y(p2[1]),8,C.g);D.dot(A.X(c[0]),A.Y(c[1]),5,C.m);
  D.text('r_{cm} = (m₁r₁ + m₂r₂)/(m₁ + m₂)',W/2,476,{it:true,s:22,a:'center',c:C.m});D.text('M·a_{cm} = ΣF_{ext} = M·g',W/2,512,{it:true,s:20,a:'center'});}));

/* T7 rodadura: cicloide */
var Rr=1;
M.reg('fis1-t7',M.tray({title:'Rodadura sin deslizar',H:540,dur:14,lin:true,ax:{xr:[-0.5,13],yr:[-0.2,2.6],xt:[],yt:[1,2],yd:0,xl:'x',yl:'y'},h:200,s:[0,4*Math.PI],
 path:function(s){return [Rr*(s-Math.sin(s)),Rr*(1-Math.cos(s))];},vel:function(s){return [1-Math.cos(s),Math.sin(s)];},kv:0.8,
 extra:function(D,A,s){var cx=A.X(Rr*s),cy=A.Y(Rr),rp=A.X(Rr)-A.X(0);D.ring(cx,cy,rp,C.w,2);D.line(cx,cy,A.X(Rr*(s-Math.sin(s))),A.Y(Rr*(1-Math.cos(s))),C.mut,1.4);
   D.dot(cx,cy,5,C.f);D.arrow(cx,cy,cx+rp*0.8,cy,C.f,2.4);D.text('v_{cm}',cx+rp*0.8+4,cy-6,{it:true,s:16,c:C.f});D.dot(cx,A.Y(0),6,C.hl);D.text('CIR',cx-14,A.Y(0)+22,{s:14,c:C.hl});
   var pt=[A.X(Rr*(s-Math.sin(s))),A.Y(Rr*(1-Math.cos(s)))];D.line(cx,A.Y(0),pt[0],pt[1],C.hl,1.2,[4,4]);},
 read:function(s){var v=Math.sqrt(2-2*Math.cos(s));return ['velocidad del punto del borde = '+nf(v,2)+'·v_{cm}','arriba vale 2·v_{cm}; en el contacto, 0'];},
 caps:[[5,'Una rueda que rueda sin deslizar: su centro avanza con <i>v<sub>cm</sub> = ωR</i>. Un punto del borde describe una <b>cicloide</b>.'],[10,'El punto en contacto con el suelo está quieto en ese instante: es el <b>centro instantáneo de rotación</b> (CIR).'],[99,'La velocidad de cualquier punto es perpendicular a la recta que lo une con el CIR, y proporcional a la distancia: arriba va al doble que el centro.']]}));

/* T8 viga apoyada */
M.reg('fis1-t8',M.base({title:'Estática: reacciones en una viga',H:540,dur:16,caps:[[5,'Una viga de 4 m apoyada en sus extremos A y B soporta una carga de 10 kN que se desplaza.'],[11,'Equilibrio: <i>ΣF = 0</i> y <i>ΣM = 0</i>. Tomando momentos en A: <i>R<sub>B</sub>·4 = 10·x</i>.'],[99,'Cuanto más cerca está la carga de un apoyo, más reacción absorbe ese apoyo. Siempre <i>R<sub>A</sub> + R<sub>B</sub> = 10 kN</i>.']]},
 function(D,t){var x=lerp(0.4,3.6,U.pp(t,16)),RA=10*(4-x)/4,RB=10*x/4,X=function(v){return 120+v*100;},y=280,k=11;
  D.rect(X(0),y-10,400,20,C.w,RG(C.w,.12),2);D.path([[X(0),y+10],[X(0)-16,y+40],[X(0)+16,y+40]],C.f,2,RG(C.f,.2));D.path([[X(4),y+10],[X(4)-16,y+40],[X(4)+16,y+40]],C.f,2,RG(C.f,.2));
  D.text('A',X(0)-4,y+62,{s:18,a:'center'});D.text('B',X(4),y+62,{s:18,a:'center'});
  D.arrow(X(x),y-120,X(x),y-14,C.g,3.4);D.text('P = 10 kN',X(x),y-128,{s:17,a:'center',c:C.g});
  D.arrow(X(0),y+40+RA*k,X(0),y+44,C.m,3.4);D.arrow(X(4),y+40+RB*k,X(4),y+44,C.m,3.4);
  D.text('R_{A} = '+nf(RA,2),X(0)-60,y+90,{s:18,c:C.m,a:'center'});D.text('R_{B} = '+nf(RB,2),X(4)+64,y+90,{s:18,c:C.m,a:'center'});
  D.line(X(0),y-60,X(x),y-60,C.mut,1,[3,3]);D.text('x = '+nf(x,2)+' m',(X(0)+X(x))/2,y-66,{s:15,a:'center',c:C.mut});
  D.text('R_{A} = P(4 − x)/4      R_{B} = P·x/4',W/2,500,{it:true,s:21,a:'center'});}));

/* T9 empuje de Arquímedes */
M.reg('fis1-t9',M.base({title:'Empuje de Arquímedes',H:560,dur:16,caps:[[5,'Un bloque de 1 L y 2,5 kg cuelga de un dinamómetro y se va sumergiendo en agua.'],[11,'El agua empuja hacia arriba con una fuerza igual al peso del líquido desalojado: <i>E = ρ<sub>agua</sub>·g·V<sub>sumergido</sub></i>.'],[99,'Una vez sumergido del todo, el empuje ya no cambia con la profundidad: 9,8 N. El dinamómetro marca el peso aparente, 24,5 − 9,8 = 14,7 N.']]},
 function(D,t){var d=lerp(-0.25,1.35,U.pp(t,16)),sub=clamp(d,0,1),E=9.8*sub,P=2.5*9.8,T=P-E,x0=200,wy=300,bs=100,top=wy-bs+d*bs;
  D.rect(90,wy,320,180,null,RG(C.f,.18));D.line(90,wy,410,wy,C.f,2);D.line(90,wy,90,480,C.w,2);D.line(410,wy,410,480,C.w,2);D.line(90,480,410,480,C.w,2);
  D.line(x0+bs/2,100,x0+bs/2,top,C.mut,1.6);D.rect(x0+bs/2-22,80,44,40,C.w,RG(C.w,.1),2);D.text(nf(T,1)+' N',x0+bs/2,106,{s:14,a:'center'});
  D.rect(x0,top,bs,bs,C.m,RG(C.m,.35),2.4);
  D.arrow(x0+bs/2-24,top+bs/2,x0+bs/2-24,top+bs/2+P*2.6,C.g,3);D.text('P',x0+bs/2-40,top+bs/2+P*2.6,{it:true,s:18,c:C.g});
  if(E>0.01){D.arrow(x0+bs/2+24,top+bs/2,x0+bs/2+24,top+bs/2-E*2.6,C.hl,3);D.text('E',x0+bs/2+32,top+bs/2-E*2.6,{it:true,s:18,c:C.hl});}
  D.text('sumergido: '+nf(sub*100,0)+' %',530,200,{s:20,a:'center',c:C.m});D.text('E = ρgV = '+nf(E,1)+' N',530,240,{it:true,s:20,a:'center',c:C.hl});D.text('peso aparente = '+nf(T,1)+' N',530,280,{it:true,s:20,a:'center'});
  D.text('p = p_{0} + ρ g h',530,330,{it:true,s:20,a:'center',c:C.f});}));

/* T10 equilibrio térmico */
M.reg('fis1-t10',M.traza({title:'Equilibrio térmico',H:540,dur:16,ax:{xr:[0,10],yr:[0,90],xt:[2,4,6,8,10],yt:[20,40,60,80],xd:0,yd:0,xl:'t (min)',yl:'T (°C)'},h:300,x0:0,x1:10,
 f:function(x){return 60+20*Math.exp(-0.45*x);},
 extra:function(D,A,x){var p=[];for(var s=0;s<=x;s+=0.05)p.push([A.X(s),A.Y(60-40*Math.exp(-0.45*s))]);D.path(p,C.f,3);D.dot(A.X(x),A.Y(60-40*Math.exp(-0.45*x)),6.5,C.f);
   D.line(A.X(0),A.Y(60),A.X(10),A.Y(60),C.hl,1.4,[6,5]);D.text('T_{eq} = 60 °C',A.X(7.4),A.Y(60)-8,{s:15,c:C.hl});D.text('A (caliente)',A.X(0.3),A.Y(84),{s:15,c:C.m});D.text('B (fría)',A.X(0.3),A.Y(14),{s:15,c:C.f});},
 read:function(x){var TA=60+20*Math.exp(-0.45*x),TB=60-40*Math.exp(-0.45*x);return ['T_{A} = '+nf(TA,1)+' °C     T_{B} = '+nf(TB,1)+' °C','Q cedido por A = 2·(80 − T_{A}) = '+nf(2*(80-TA),1)+' kJ = Q ganado por B'];},
 caps:[[5,'Ponemos en contacto A (80 °C, C = 2 kJ/K) y B (20 °C, C = 1 kJ/K), aislados del exterior.'],[11,'El calor pasa del caliente al frío hasta que las temperaturas se igualan: el calor que cede A es exactamente el que gana B.'],[99,'Temperatura final: <i>T<sub>eq</sub> = (C<sub>A</sub>T<sub>A</sub> + C<sub>B</sub>T<sub>B</sub>)/(C<sub>A</sub> + C<sub>B</sub>) = (160 + 20)/3 = 60 °C</i>. Es el principio cero: el equilibrio térmico define la temperatura.']]}));

/* T11 ciclo de Carnot */
var Th=500,Tc=300,gm=1.4,V1=1,V2=2,V3=V2*Math.pow(Th/Tc,1/(gm-1)),V4=V1*Math.pow(Th/Tc,1/(gm-1));
function carnot(s){var k=Math.floor(s)%4,u=s-Math.floor(s),V,p;
  if(k===0){V=V1*Math.pow(V2/V1,u);p=Th/V;}else if(k===1){V=V2*Math.pow(V3/V2,u);p=Th*Math.pow(V2,gm-1)/Math.pow(V,gm);}
  else if(k===2){V=V3*Math.pow(V4/V3,u);p=Tc/V;}else{V=V4*Math.pow(V1/V4,u);p=Tc*Math.pow(V4,gm-1)/Math.pow(V,gm);}return [V,p/100];}
M.reg('fis1-t11',M.tray({title:'Ciclo de Carnot en el diagrama p–V',H:560,dur:18,lin:true,ax:{xr:[0,8],yr:[0,5.6],xt:[2,4,6,8],yt:[1,2,3,4,5],xd:0,yd:0,xl:'V',yl:'p'},h:320,s:[0,3.999],path:carnot,
 extra:function(D,A,s){var pts=[];for(var q=0;q<=3.999;q+=0.01){var r=carnot(q);pts.push([A.X(r[0]),A.Y(r[1])]);}D.path(pts,null,0,RG(C.m,s>3.9?.28:.08));
   ['1','2','3','4'].forEach(function(l,i){var r=carnot(i);D.text(l,A.X(r[0])+8,A.Y(r[1])-8,{s:16,c:C.w});});},
 read:function(s){var k=Math.floor(s);return [['1→2 expansión isoterma a T_{c}=500 K: absorbe Q_{c}','2→3 expansión adiabática: se enfría a 300 K','3→4 compresión isoterma a 300 K: cede Q_{f}','4→1 compresión adiabática: vuelve a 500 K'][k],'rendimiento η = 1 − T_{f}/T_{c} = 1 − 300/500 = 40 %'];},
 caps:[[5,'Un gas ideal recorre el ciclo de Carnot: dos isotermas y dos adiabáticas, entre un foco caliente (500 K) y uno frío (300 K).'],[12,'El área encerrada por el ciclo es el <b>trabajo neto</b> que produce en cada vuelta (primer principio: <i>W = Q<sub>c</sub> − Q<sub>f</sub></i>).'],[99,'El segundo principio impide convertir todo el calor en trabajo: ningún motor entre esas temperaturas supera <i>η = 1 − T<sub>f</sub>/T<sub>c</sub></i>.']]}));
})();
