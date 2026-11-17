/* Física II: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 dipolo eléctrico */
function Ed(x,y){var E=[0,0];[[-1.2,0,1],[1.2,0,-1]].forEach(function(q){var dx=x-q[0],dy=y-q[1],r2=dx*dx+dy*dy+0.02,r3=Math.pow(r2,1.5);E[0]+=q[2]*dx/r3;E[1]+=q[2]*dy/r3;});return E;}
M.reg('fis2-t1',M.campo({title:'Campo eléctrico de un dipolo',H:540,dur:20,ax:{xr:[-3.4,3.4],yr:[-2.2,2.2],xt:[],yt:[],xl:'',yl:''},h:330,nx:18,ny:11,fm:1.2,norm:true,step:0.006,np:22,
 field:Ed,sink:function(x,y){return Math.hypot(x-1.2,y)<0.15;},
 extra:function(D,A){D.dot(A.X(-1.2),A.Y(0),14,C.g);D.text('+',A.X(-1.2),A.Y(0)+6,{s:18,a:'center',c:C.bg,bold:true});D.dot(A.X(1.2),A.Y(0),14,C.f);D.text('−',A.X(1.2),A.Y(0)+6,{s:18,a:'center',c:C.bg,bold:true});},
 read:function(){return ['E = Σ k·qᵢ·r̂ᵢ / rᵢ²   (superposición)'];},
 caps:[[7,'Las líneas de campo salen de la carga positiva y terminan en la negativa. Las partículas siguen la dirección de <i>E</i> en cada punto.'],[14,'El campo total es la <b>suma vectorial</b> de los campos de cada carga (principio de superposición).'],[99,'Donde las líneas se juntan el campo es más intenso. Lejos del dipolo el campo decae como <i>1/r³</i>, más rápido que el de una carga sola.']]}));

/* T2 trabajo y potencial */
M.reg('fis2-t2',M.traza({title:'Potencial eléctrico y trabajo',H:540,dur:16,x0:4,x1:0.6,ax:{xr:[0,4.2],yr:[0,1.8],xt:[1,2,3,4],yt:[0.5,1,1.5],xd:0,yd:1,xl:'r (m)',yl:'V (×kQ)'},h:300,f:function(r){return 1/r;},
 extra:function(D,A,r){D.dot(A.X(0.05),A.Y(0.1),12,C.g);D.text('Q',A.X(0.05),A.Y(0.1)+5,{s:13,a:'center',c:C.bg});},
 read:function(r){return ['V(r) = kQ/r = '+nf(1/r,2)+'·kQ','trabajo exterior para traer q desde r = 4:  W = q·(V − V₀) = '+nf(1/r-0.25,2)+'·kQq'];},
 caps:[[6,'El potencial de una carga puntual vale <i>V = kQ/r</i>: crece al acercarse a la carga.'],[12,'Para acercar otra carga positiva hay que empujar contra la repulsión: el trabajo exterior es <i>q·ΔV</i> y queda guardado como energía potencial.'],[99,'Solo importan los puntos inicial y final, no el camino: el campo electrostático es conservativo.']]}));

/* T3 dieléctrico en un condensador */
M.reg('fis2-t3',M.base({title:'Condensador: introducir un dieléctrico',H:540,dur:16,caps:[[5,'Condensador plano conectado a una pila de 12 V. Entre las placas hay vacío: <i>C₀ = ε₀A/d</i>.'],[11,'Al meter un dieléctrico de <i>εᵣ = 3</i>, sus moléculas se polarizan y debilitan el campo interior: la capacidad se multiplica por εᵣ.'],[99,'Como la pila mantiene <i>V</i> fija, entra más carga en las placas: <i>Q = C·V</i> se triplica. La energía almacenada <i>½CV²</i> también.']]},
 function(D,t){var u=ease(seg(t,3,11)),er=1+2*u,x1=180,x2=440,y0=130,h=260;D.rect(x1-14,y0,14,h,C.g,RG(C.g,.4),2);D.rect(x2,y0,14,h,C.f,RG(C.f,.4),2);
  D.rect(x1+6+(1-u)*300,y0+10,x2-x1-12,h-20,C.hl,RG(C.hl,.22),1.6);D.text('εᵣ = 3',x1+6+(1-u)*300+(x2-x1-12)/2,y0-12,{s:16,a:'center',c:C.hl});
  var nq=Math.round(6*er);for(var i=0;i<nq;i++){var y=y0+12+i*(h-24)/(nq-1);D.text('+',x1-22,y+5,{s:14,a:'center',c:C.g});D.text('−',x2+22,y+5,{s:14,a:'center',c:C.f});}
  for(var k=0;k<7;k++){var y2=y0+25+k*35;D.arrow(x1+10,y2,x2-10,y2,C.m,1.4);}
  var C0=10;D.text('C = εᵣ·C₀ = '+nf(er*C0,1)+' nF      Q = C·V = '+nf(er*C0*12,0)+' nC',W/2,440,{s:21,a:'center',c:C.m});D.text('V = 12 V (fija)   ·   C₀ = 10 nF',W/2,474,{s:17,a:'center'});}));

/* T4 corriente que se reparte */
M.reg('fis2-t4',M.base({title:'Corriente continua: el reparto en paralelo',H:540,dur:16,caps:[[5,'Una pila de 12 V alimenta dos resistencias en paralelo: R₁ = 2 Ω y R₂ = 6 Ω.'],[11,'Las dos tienen la misma tensión (12 V). Por la Ley de Ohm, por R₁ pasan 6 A y por R₂ solo 2 A: la corriente prefiere el camino fácil.'],[99,'En el nudo se cumple la primera ley de Kirchhoff: entran 8 A y salen 6 + 2 = 8 A. La carga no se acumula.']]},
 function(D,t){var xa=110,xb=530,ya=130,yb=250,yc=370;
  D.line(xa,ya,xb,ya,C.w,2);D.line(xa,yc,xb,yc,C.w,2);D.line(xa,ya,xa,yc,C.w,2);D.line(320,ya,320,yb-30,C.w,2);D.line(320,yb+30,320,yc,C.w,2);D.line(xb,ya,xb,yb-30,C.w,2);D.line(xb,yb+30,xb,yc,C.w,2);
  D.rect(305,yb-30,30,60,C.f,RG(C.f,.2),2);D.text('R₁ = 2 Ω',290,yb+5,{s:15,a:'right',c:C.f});D.rect(xb-15,yb-30,30,60,C.g,RG(C.g,.2),2);D.text('R₂ = 6 Ω',xb-24,yb+5,{s:15,a:'right',c:C.g});
  D.line(xa-22,yb-6,xa+22,yb-6,C.w,3);D.line(xa-12,yb+6,xa+12,yb+6,C.w,5);D.text('12 V',xa-30,yb+4,{s:15,a:'right'});
  function flow(path,sp,n,col){var L=0;for(var i=1;i<path.length;i++)L+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);for(var k=0;k<n;k++){var d=((t*sp+k*L/n)%L);for(var j=1;j<path.length;j++){var sl=Math.hypot(path[j][0]-path[j-1][0],path[j][1]-path[j-1][1]);if(d<=sl){var u=d/sl;D.dot(lerp(path[j-1][0],path[j][0],u),lerp(path[j-1][1],path[j][1],u),4,col);break;}d-=sl;}}}
  flow([[xa,yb-6],[xa,ya],[320,ya],[320,yc],[xa,yc],[xa,yb+6]],36,14,C.f);flow([[xa,yb-6],[xa,ya],[xb,ya],[xb,yc],[xa,yc],[xa,yb+6]],12,10,C.g);
  D.text('I₁ = 12/2 = 6 A',320,110,{s:16,a:'center',c:C.f});D.text('I₂ = 12/6 = 2 A',xb,110,{s:16,a:'center',c:C.g});
  D.text('I = I₁ + I₂ = 8 A      R_{eq} = R₁R₂/(R₁ + R₂) = 1,5 Ω',W/2,440,{s:20,a:'center',c:C.m});}));

/* T5 carga en un campo magnético */
M.reg('fis2-t5',M.tray({title:'Carga en un campo magnético uniforme',H:560,dur:14,lin:true,ax:{xr:[-3,3],yr:[-2.2,2.2],xt:[],yt:[],xl:'',yl:''},h:330,s:[0,2*Math.PI],
 path:function(s){return [1.6*Math.sin(s),1.6*Math.cos(s)-0.0];},vel:function(s){return [Math.cos(s),-Math.sin(s)];},kv:0.9,acc:function(s){return [-Math.sin(s),-Math.cos(s)];},ka:0.7,la:'F',
 extra:function(D,A){for(var i=-5;i<=5;i++)for(var j=-3;j<=3;j++){var x=A.X(i*0.55),y=A.Y(j*0.6);D.ring(x,y,4,C.mut,1);D.dot(x,y,1.4,C.mut);}D.text('B (hacia fuera) ⊙',A.X(2.0),A.Y(2.0),{s:15,c:C.mut});},
 read:function(){return ['F = q·v × B   ⟂ v:  no cambia el módulo de la velocidad','radio r = m·v/(|q|·B)      periodo T = 2π·m/(|q|·B)'];},
 caps:[[5,'Una carga se mueve en un campo magnético uniforme <i>B</i> perpendicular al plano. La fuerza de Lorentz es <i>F = q·v × B</i>.'],[10,'La fuerza es siempre perpendicular a la velocidad: no hace trabajo, solo curva la trayectoria. El movimiento es circular uniforme.'],[99,'El radio crece con la velocidad y la masa y disminuye con el campo. En eso se basan el espectrómetro de masas y el ciclotrón.']]}));

/* T6 inducción: imán que atraviesa una espira */
function phi(x){return Math.exp(-x*x*1.2);}function emf(x,v){return 2.4*x*Math.exp(-x*x*1.2)*v;}
M.reg('fis2-t6',M.base({title:'Inducción: un imán atraviesa una espira',H:560,dur:16,caps:[[5,'El imán se acerca a la espira y el flujo magnético Φ que la atraviesa aumenta.'],[11,'Según Faraday, se induce una fem <i>ε = −dΦ/dt</i>: solo hay corriente mientras el flujo <b>cambia</b>. Con el imán en el centro, Φ es máximo pero ε = 0.'],[99,'Al alejarse el flujo disminuye y la fem cambia de signo (ley de Lenz: la corriente inducida se opone al cambio que la produce).']]},
 function(D,t){var tt=lerp(-3,3,seg(t,1,15)),v=6/14;var cx=320,y=150;D.ring(cx,y,46,C.f,4);D.text('espira',cx,y-58,{s:14,a:'center',c:C.f});var mx=cx+tt*80;D.rect(mx-50,y-16,50,32,C.g,RG(C.g,.4),2);D.rect(mx,y-16,50,32,C.f,RG(C.f,.4),2);D.text('N',mx-25,y+6,{s:15,a:'center'});D.text('S',mx+25,y+6,{s:15,a:'center'});
  var A=U.axes(D,{xr:[-3,3],yr:[-1.2,1.2],xt:[],yt:[-1,1],yd:0,xl:'t',yl:''},{x:80,y:240,w:480,h:200,grid:true});
  var p1=[],p2=[];for(var s=-3;s<=tt;s+=0.02){p1.push([A.X(s),A.Y(phi(s))]);p2.push([A.X(s),A.Y(-emf(s,1)*0.9)]);}D.path(p1,C.m,2.6);D.path(p2,C.hl,2.6);
  D.dot(A.X(tt),A.Y(phi(tt)),5,C.m);D.dot(A.X(tt),A.Y(-emf(tt,1)*0.9),5,C.hl);D.text('Φ',A.X(-2.9),A.Y(1.05),{it:true,s:18,c:C.m});D.text('ε = −dΦ/dt',A.X(-2.9),A.Y(-0.9),{it:true,s:18,c:C.hl});
  D.text('Φ = '+nf(phi(tt),2)+'      ε = '+nf(-emf(tt,1),2),W/2,500,{it:true,s:22,a:'center',c:C.m});}));

/* T7 ciclo de histéresis */
var Hc=0.35,ah=0.3,Hm=1.6;function Bh(s){var H=Hm*Math.cos(s),des=Math.sin(s)>=0;return [H,Math.tanh((H+(des?Hc:-Hc))/ah)];}
M.reg('fis2-t7',M.tray({title:'Ciclo de histéresis de un ferromagnético',H:560,dur:16,lin:true,ax:{xr:[-1.8,1.8],yr:[-1.3,1.3],xt:[-1,1],yt:[-1,1],xd:0,yd:0,xl:'H',yl:'B'},h:330,s:[0,2*Math.PI],path:Bh,
 extra:function(D,A){var br=Math.tanh(Hc/ah);D.dot(A.X(0),A.Y(br),5,C.hl);D.text('Bᵣ',A.X(0)+8,A.Y(br)-6,{s:16,c:C.hl});D.dot(A.X(-Hc),A.Y(0),5,C.g);D.text('−H_{c}',A.X(-Hc)-6,A.Y(0)+20,{s:16,c:C.g,a:'right'});},
 read:function(s){var p=Bh(s);return ['H = '+nf(p[0],2)+'    B = '+nf(p[1],2),'remanencia Bᵣ = '+nf(Math.tanh(Hc/ah),2)+'    coercitividad H_{c} = '+nf(Hc,2)];},
 caps:[[5,'Al aumentar <i>H</i> el material se imana hasta saturar. Al bajar <i>H</i>, <i>B</i> no vuelve por el mismo camino.'],[10,'Con <i>H = 0</i> queda una magnetización: la <b>remanencia</b> Bᵣ. Para anularla hay que aplicar el campo <b>coercitivo</b> −H<sub>c</sub>.'],[99,'El área del ciclo es la energía perdida por ciclo. Materiales blandos (ciclo estrecho) para transformadores; duros (ciclo ancho) para imanes permanentes.']]}));

/* T8 corriente alterna: fasores V e I */
var phI=40*Math.PI/180;
M.reg('fis2-t8',M.fasor({title:'Corriente alterna: tensión e intensidad desfasadas',H:540,dur:18,w:1.2,S:90,cy:230,
 vec:function(t){var a=1.2*t;return [{m:1,a:a,l:'V',c:'m'},{m:0.7,a:a-phI,l:'I',c:'f'}];},
 read:function(){return ['circuito inductivo: la intensidad va φ = 40° retrasada','P = V_{ef}·I_{ef}·cos φ     cos φ = 0,77'];},
 caps:[[6,'En alterna, tensión e intensidad son senoides de la misma frecuencia. Se representan como <b>fasores</b>: vectores que giran a ω.'],[12,'En un circuito con bobina la intensidad se retrasa un ángulo φ respecto a la tensión: las ondas no alcanzan el máximo a la vez.'],[99,'Solo la componente de I en fase con V produce potencia útil: <i>P = V<sub>ef</sub> I<sub>ef</sub> cos φ</i>. Por eso interesa un factor de potencia cercano a 1.']]}));

/* T9 ondas estacionarias */
M.reg('fis2-t9',M.base({title:'Dos ondas que viajan forman una estacionaria',H:540,dur:18,caps:[[6,'Dos ondas iguales viajan en sentidos opuestos (azul y rosa), por ejemplo una onda y su reflexión en el extremo de una cuerda.'],[12,'Su suma (morado) no se desplaza: es una <b>onda estacionaria</b> <i>y = 2A sen(kx) cos(ωt)</i>.'],[99,'En los <b>nodos</b> (puntos amarillos) la cuerda no se mueve nunca; entre ellos, en los vientres, vibra con amplitud 2A. Los nodos están separados λ/2.']]},
 function(D,t){var A=U.axes(D,{xr:[0,4*Math.PI],yr:[-2.2,2.2],xt:[],yt:[-2,-1,1,2],yd:0,xl:'x',yl:'y'},{x:70,y:100,w:510,h:300,grid:true}),w=1.6;
  U.plotf(D,A,function(x){return Math.sin(x-w*t);},C.f,1.6,0.75);U.plotf(D,A,function(x){return Math.sin(x+w*t);},C.g,1.6,0.75);U.plotf(D,A,function(x){return Math.sin(x-w*t)+Math.sin(x+w*t);},C.m,3.2);
  for(var k=0;k<=4;k++)D.dot(A.X(k*Math.PI),A.Y(0),6,C.hl);D.text('nodos cada λ/2',A.X(2*Math.PI),A.Y(-2.0),{s:15,a:'center',c:C.hl});
  D.text('y₁ + y₂ = 2A·sen(kx)·cos(ωt)',W/2,470,{it:true,s:22,a:'center',c:C.m});}));

/* T10 lente convergente */
M.reg('fis2-t10',M.base({title:'Lente convergente: formación de imágenes',H:560,dur:20,caps:[[6,'Objeto lejos de la lente (más allá de 2f): imagen real, invertida y más pequeña.'],[13,'Al acercar el objeto hacia el foco la imagen se aleja y crece. En <i>s = 2f</i> imagen y objeto son iguales.'],[99,'Con el objeto dentro de la distancia focal la imagen es <b>virtual</b>, derecha y mayor: así funciona una lupa. Ecuación: <i>1/s′ − 1/s = 1/f′</i>.']]},
 function(D,t){var cx=320,cy=270,f=80,s=lerp(300,45,ease(seg(t,1,18))),h=60;D.line(30,cy,610,cy,C.ax,1.4);D.line(cx,cy-150,cx,cy+150,C.f,3);D.head(cx,cy-150,-Math.PI/2,C.f,10);D.head(cx,cy+150,Math.PI/2,C.f,10);
  [-1,1].forEach(function(k){D.dot(cx+k*f,cy,4,C.hl);D.text(k<0?'F':'F′',cx+k*f,cy+20,{s:15,a:'center',c:C.hl});D.dot(cx+k*2*f,cy,3,C.mut);});
  var ox=cx-s;D.arrow(ox,cy,ox,cy-h,C.g,3);
  var si=1/(1/f-1/s),hi=-h*si/s,ix=cx+si;
  var clip=function(fn){var c=D.ctx;c.save();c.beginPath();c.rect(20,110,600,320);c.clip();fn();c.restore();};
  clip(function(){D.line(ox,cy-h,cx,cy-h,C.m,1.6);var m1=h/f;D.line(cx,cy-h,cx+400,cy-h+m1*400,C.m,1.6);D.line(ox,cy-h,cx+400,cy-h+(h/s)*400,C.m,1.6);
   if(si<0){D.line(cx,cy-h,cx-600,cy-h-m1*600,C.m,1,[5,4]);D.line(ox,cy-h,ox-600,cy-h-(h/s)*600,C.m,1,[5,4]);}
   if(Math.abs(si)<600)D.arrow(ix,cy,ix,cy-hi,si>0?C.g:C.hl,3,si<0?[5,4]:null);});
  D.text('s = −'+nf(s/f,2)+'f     s′ = '+(Math.abs(si)>2000?'∞':nf(si/f,2)+'f')+'     aumento = '+nf(-si/s,2),W/2,470,{it:true,s:20,a:'center',c:C.m});
  D.text(si>0?'imagen real e invertida':'imagen virtual y derecha (lupa)',W/2,506,{s:19,a:'center',c:si>0?C.g:C.hl,bold:true});}));

/* T11 doble rendija */
function wl(l){var r=0,g=0,b=0;if(l<440){r=-(l-440)/60;b=1;}else if(l<490){g=(l-440)/50;b=1;}else if(l<510){g=1;b=-(l-510)/20;}else if(l<580){r=(l-510)/70;g=1;}else if(l<645){r=1;g=-(l-645)/65;}else r=1;return 'rgb('+Math.round(255*r)+','+Math.round(255*g)+','+Math.round(255*b)+')';}
M.reg('fis2-t11',M.curva({title:'Interferencia de Young: doble rendija',H:560,dur:18,p:[400,700],ax:{xr:[-12,12],yr:[0,1.15],xt:[-10,-5,5,10],yt:[0.5,1],xd:0,yd:1,xl:'y (mm)',yl:'I/I₀'},h:260,ghost:false,
 f:function(y,l){var d=0.25,L=1000,b=0.05,ph=Math.PI*d*y/(l*1e-6*L),bb=Math.PI*b*y/(l*1e-6*L);var sc=Math.abs(bb)<1e-6?1:Math.sin(bb)/bb;return Math.pow(Math.cos(ph),2)*sc*sc;},
 extra:function(D,A,l){var c=D.ctx;for(var x=-12;x<=12;x+=0.08){var d=0.25,L=1000,b=0.05,ph=Math.PI*d*x/(l*1e-6*L),bb=Math.PI*b*x/(l*1e-6*L),sc=Math.sin(bb)/bb,I=Math.pow(Math.cos(ph),2)*sc*sc;c.save();c.globalAlpha=I;c.fillStyle=wl(l);c.fillRect(A.X(x),A.r.y-36,A.X(x+0.08)-A.X(x)+1,26);c.restore();}D.rect(A.r.x,A.r.y-36,A.r.w,26,C.mut,null,1);},
 read:function(l){return ['λ = '+nf(l,0)+' nm      interfranja Δy = λL/d = '+nf(l*1e-6*1000/0.25,2)+' mm','d = 0,25 mm entre rendijas,  L = 1 m hasta la pantalla'];},
 caps:[[6,'La luz que pasa por dos rendijas llega a la pantalla por dos caminos. Donde la diferencia de camino es un número entero de λ hay franja brillante.'],[12,'Al aumentar la longitud de onda (del violeta al rojo) las franjas se separan: <i>Δy = λL/d</i>.'],[99,'La envolvente que modula las franjas es la difracción de cada rendija. Este experimento demostró la naturaleza ondulatoria de la luz.']]}));
M.reg('fis2-t11b',M.curva({title:'Difracción por una rendija',H:560,dur:18,p:[1,4],ax:{xr:[-3,3],yr:[0,1.1],xt:[-2,-1,1,2],yt:[0.5,1],xf:function(v){return nf(v*10,0)+' mm';},yd:1,xl:'posición en la pantalla',yl:'I/I_{0}'},h:300,
 curvas:[{f:function(y,a){var b=Math.PI*a*y;return Math.abs(b)<1e-6?1:Math.pow(Math.sin(b)/b,2);},c:'m'}],
 extra:function(D,A,a){var L=1/a;D.dot(A.X(L),A.Y(0),5,C.hl);D.dot(A.X(-L),A.Y(0),5,C.hl);D.rect(A.X(-L),A.Y(1.1)-12,A.X(L)-A.X(-L),8,null,RG(C.hl,.5));},
 read:function(a){return ['anchura de la rendija a = '+nf(a*0.05,2)+' mm','primer mínimo: a·sen θ = λ   →  máximo central de anchura 2λL/a = '+nf(20/a,1)+' mm'];},
 caps:[[6,'Al pasar por una rendija de anchura a comparable a λ, la luz se abre: en la pantalla aparece un máximo central ancho y máximos laterales mucho más débiles.'],[12,'Los mínimos están donde <i>a·sen θ = mλ</i>. La intensidad sigue <i>(sen β/β)²</i>.'],[99,'Cuanto más estrecha la rendija, más ancho el máximo central: es el mismo principio que limita la resolución de lentes y telescopios.']]}));
M.reg('fis2-t10b',M.base({title:'Espejo cóncavo: la imagen según dónde esté el objeto',H:580,dur:18,caps:[[6,'Un espejo cóncavo de distancia focal f cumple <i>1/s + 1/s′ = 1/f</i> (s y s′ positivas delante del espejo).'],[12,'Con el objeto más allá del foco la imagen es real e invertida; entre el centro y el foco, mayor que el objeto.'],[99,'Con el objeto dentro de la distancia focal la imagen es virtual, derecha y aumentada: así funcionan los espejos de aumento.']]},
 function(D,t){var f=80,s=lerp(250,45,U.pp(t,18)),sp=1/(1/f-1/s),m=-sp/s,mx=540,ax=260,h=45,ox=mx-s,top=ax-h,ctx=D.ctx;D.line(30,ax,610,ax,C.ax,1.2);
  var arc=[];for(var k=-22;k<=22;k++){var yy=k*7;arc.push([mx-yy*yy/(8*f),ax+yy]);}D.path(arc,C.f,3);D.dot(mx-f,ax,4,C.hl);D.text('F',mx-f,ax+20,{s:15,a:'center',c:C.hl});D.dot(mx-2*f,ax,4,C.mut);D.text('C',mx-2*f,ax+20,{s:15,a:'center',c:C.mut});
  ctx.save();ctx.beginPath();ctx.rect(20,70,600,400);ctx.clip();
  D.line(ox,top,mx,top,C.g,1.6);var k1=(ax-top)/f;D.line(mx,top,mx-700,top+700*k1,C.g,1.6);
  var k2=(ax-top)/(mx-2*f-ox);D.line(ox,top,mx,top+k2*(mx-ox),C.m,1.4);D.line(mx,top+k2*(mx-ox),mx-700,top+k2*(mx-ox)-700*k2,C.m,1.4);
  if(sp<0){D.line(mx,top,mx+300,top-300*k1,C.g,1,[4,4]);D.line(mx,top+k2*(mx-ox),mx+300,top+k2*(mx-ox)+300*k2,C.m,1,[4,4]);}ctx.restore();
  D.arrow(ox,ax,ox,top,C.ink||C.w,3);var ix=mx-sp,iy=ax-m*h;if(ix>20&&ix<620&&iy>70&&iy<470)D.arrow(ix,ax,ix,iy,C.bad,3);
  U.readout(D,['s = '+nf(s/40,2)+' m    f = 2 m    s′ = '+nf(sp/40,2)+' m','aumento m = −s′/s = '+nf(m,2)+'  →  '+(sp>0?'imagen real, invertida':'imagen virtual, derecha')],500);}));
})();
