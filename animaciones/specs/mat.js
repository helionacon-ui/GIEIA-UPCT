/* Ciencia e Ingeniería de Materiales: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function P3(p,yaw,pit,s,cx,cy){var x=p[0],y=p[1],z=p[2],c=Math.cos(yaw),sn=Math.sin(yaw),x1=c*x-sn*y,y1=sn*x+c*y,cp=Math.cos(pit),sp=Math.sin(pit);return [cx+s*x1,cy-s*(z*cp-y1*sp),y1*cp+z*sp];}
function erfc(x){var z=Math.abs(x),t=1/(1+0.5*z),r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));return x>=0?r:2-r;}
function ellip(D,cx,cy,rx,ry,col,lab){var p=[];for(var a=0;a<=6.3;a+=0.1)p.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)]);D.path(p,col,2,RG(col,.2));D.text(lab,cx,cy+5,{s:15,a:'center',c:col,bold:true});}

/* T1 familias de materiales */
M.reg('mat-t1',M.base({title:'Familias de materiales: densidad y resistencia',H:540,dur:16,caps:[[5,'Cada familia de materiales ocupa una zona del mapa de propiedades: aquí resistencia frente a densidad (escalas logarítmicas).'],[11,'Metales: densos y resistentes. Polímeros: ligeros pero menos resistentes. Cerámicos: muy resistentes a compresión pero frágiles.'],[99,'Los compuestos combinan lo mejor: resistentes y ligeros. Por eso la resistencia específica (σ/ρ) guía la selección en aviones y coches.']]},
 function(D,t){var A=U.axes(D,{xr:[-1,1.5],yr:[0,3.6],xt:[-1,0,1],yt:[1,2,3],xf:function(v){return '10^{'+v+'}';},yf:function(v){return '10^{'+v+'}';},xl:'ρ (Mg/m³)',yl:'σ (MPa)'},{x:90,y:96,w:470,h:320,grid:true});
  var G=[[0.05,1.6,0.16,0.4,C.g,'Polímeros',1],[0.85,2.6,0.25,0.5,C.f,'Metales',3.5],[0.5,2.9,0.18,0.45,C.hl,'Cerámicos',6],[0.2,2.7,0.15,0.35,C.m,'Compuestos',8.5],[-0.7,0.8,0.25,0.5,C.ok,'Espumas',10.5]];
  G.forEach(function(g){var a=ease(seg(t,g[6],g[6]+1.5));if(a<=0)return;D.ctx.save();D.ctx.globalAlpha=a;var rx=(A.X(g[0]+g[2])-A.X(g[0])),ry=(A.Y(g[1])-A.Y(g[1]+g[3]));ellip(D,A.X(g[0]),A.Y(g[1]),rx,ry,g[4],g[5]);D.ctx.restore();});
  if(t>12){D.line(A.X(-1),A.Y(0.5),A.X(1.5),A.Y(3.0),C.mut,1.4,[6,4]);D.text('σ/ρ constante',A.X(-0.6),A.Y(1.05),{s:14,c:C.mut});}}));

/* T2 celdas BCC y FCC */
var CB=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],CBE=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
M.reg('mat-t2',M.base({title:'Celdas cúbicas: BCC y FCC',H:540,dur:20,caps:[[10,'<b>BCC</b> (cúbica centrada en el cuerpo, como el Fe-α): átomos en los vértices y uno en el centro. 2 átomos por celda, factor de empaquetamiento 0,68.'],[99,'<b>FCC</b> (cúbica centrada en las caras, como Al, Cu o Fe-γ): átomos en vértices y centros de las caras. 4 átomos por celda, empaquetamiento 0,74, el máximo posible: metales muy dúctiles.']]},
 function(D,t){var fcc=t>=10,yaw=0.5+t*0.4,pit=0.35,s=170,cx=250,cy=290,c=function(p){return [p[0]-0.5,p[1]-0.5,p[2]-0.5];};
  CBE.forEach(function(e){var a=P3(c(CB[e[0]]),yaw,pit,s,cx,cy),b=P3(c(CB[e[1]]),yaw,pit,s,cx,cy);D.line(a[0],a[1],b[0],b[1],C.mut,1.6);});
  var at=CB.map(function(p){return [p,C.f];});if(!fcc)at.push([[0.5,0.5,0.5],C.g]);else[[0.5,0.5,0],[0.5,0.5,1],[0.5,0,0.5],[0.5,1,0.5],[0,0.5,0.5],[1,0.5,0.5]].forEach(function(p){at.push([p,C.m]);});
  at.map(function(a){var q=P3(c(a[0]),yaw,pit,s,cx,cy);return [q,a[1]];}).sort(function(a,b){return a[0][2]-b[0][2];}).forEach(function(a){D.dot(a[0][0],a[0][1],15,a[1],0.9);D.ring(a[0][0],a[0][1],15,C.w,1);});
  D.text(fcc?'FCC':'BCC',500,180,{s:34,a:'center',c:fcc?C.m:C.g,bold:true});D.text(fcc?'4 átomos/celda':'2 átomos/celda',500,222,{s:18,a:'center'});D.text(fcc?'a = 2√2·R':'a = 4R/√3',500,256,{s:18,a:'center',it:true});D.text('FEA = '+(fcc?'0,74':'0,68'),500,290,{s:18,a:'center',c:C.hl});D.text(fcc?'Al, Cu, Ni, Fe-γ':'Fe-α, Cr, W',500,324,{s:16,a:'center',c:C.mut});}));

/* T3 dislocación de arista */
M.reg('mat-t3',M.base({title:'Deslizamiento de una dislocación',H:520,dur:16,caps:[[5,'Una <b>dislocación de arista</b> es un semiplano de átomos extra metido en el cristal (marcado con ⊥).'],[11,'Bajo un esfuerzo cortante la dislocación avanza rompiendo y rehaciendo un solo enlace cada vez: mucho más fácil que deslizar planos enteros.'],[99,'Al salir por la superficie deja un escalón: así se deforman plásticamente los metales. Todo lo que frena a las dislocaciones (límites de grano, precipitados, otras dislocaciones) <b>endurece</b> el material.']]},
 function(D,t){var pos=lerp(-2,13,seg(t,1,14)),a=38,x0=100,y0=140,rows=6,cols=11;
  for(var r=0;r<rows;r++){var top=r<3;for(var c=0;c<=(top?cols+1:cols);c++){var sg=top?0.5*(1+Math.tanh((c-pos)/1.6)):0,x=x0+(c-sg)*a,y=y0+r*a;D.dot(x,y,9,top?C.f:C.m);}}
  var dxp=x0+(pos-0.5)*a;if(pos>-0.5&&pos<cols+0.5){D.text('⊥',dxp,y0+2.62*a,{s:28,a:'center',c:C.hl,bold:true});}
  D.arrow(x0-10,y0-30,x0+120,y0-30,C.g,2.6);D.text('τ',x0+130,y0-24,{it:true,s:20,c:C.g});D.arrow(x0+cols*a-10,y0+rows*a+10,x0+cols*a-140,y0+rows*a+10,C.g,2.6);
  D.line(x0-20,y0+2.5*a,x0+cols*a,y0+2.5*a,C.mut,1,[5,4]);D.text("plano de deslizamiento",x0+cols*a-10,y0+2.5*a+18,{s:13,c:C.mut,a:'right'});}));

/* T4 difusión: perfil erfc */
M.reg('mat-t4',M.curva({title:'Difusión: segunda ley de Fick',H:540,dur:18,p:[0.05,4],u:function(t,d){return ease(seg(t,1,d*0.8));},ax:{xr:[0,4],yr:[0,1.1],xt:[1,2,3,4],yt:[0.5,1],xd:0,yd:1,xl:'x (mm)',yl:'C/Cₛ'},h:300,
 f:function(x,tt){return erfc(x/(2*Math.sqrt(0.25*tt)));},
 read:function(tt){return ['t = '+nf(tt,2)+' h      profundidad con C = 0,5·Cₛ:  x ≈ '+nf(0.954*Math.sqrt(0.25*tt),2)+' mm','C(x,t) = Cₛ·erfc( x / 2√(Dt) )      la penetración crece como √t'];},
 caps:[[6,'Cementación: la superficie se mantiene a concentración Cₛ de carbono y el carbono difunde hacia el interior del acero.'],[12,'El perfil sigue la función error complementaria. Para duplicar la profundidad hay que esperar <b>cuatro veces</b> más tiempo.'],[99,'La difusividad sigue Arrhenius, <i>D = D₀e<sup>−Q/RT</sup></i>: subir la temperatura acelera mucho el proceso.']]}));

/* T5 ensayo de tracción */
function ss(e){if(e<0.004)return 52500*e;var y=210;if(e<0.15)return y+120*(1-Math.exp(-(e-0.004)*25));var m=y+120*(1-Math.exp(-0.146*25));return m-1500*Math.pow(e-0.15,2);}
M.reg('mat-t5',M.traza({title:'Ensayo de tracción: curva tensión–deformación',H:560,dur:18,x0:0,x1:0.3,ax:{xr:[0,0.32],yr:[0,380],xt:[0.1,0.2,0.3],yt:[100,200,300],xd:1,yd:0,xl:'ε',yl:'σ (MPa)'},h:290,f:ss,
 extra:function(D,A,e){var L=90+e*260,nk=e>0.15?(e-0.15)*90:0;D.rect(400,110,L,26,null,RG(C.f,.25));D.path([[400,110],[400+L,110],[400+L,136],[400,136]],C.f,1.6);if(nk>0){D.rect(400+L/2-14,110,28,nk,null,C.bg);D.rect(400+L/2-14,136-nk,28,nk,null,C.bg);}
   if(e>0.29)D.text('rotura',400+L/2,100,{s:14,a:'center',c:C.bad});},
 read:function(e){var s=ss(e);return ['ε = '+nf(e,3)+'    σ = '+nf(s,0)+' MPa',e<0.004?'zona elástica: σ = E·ε (recupera la forma)':(e<0.15?'zona plástica uniforme: endurecimiento por deformación':'estricción: la sección se reduce en un punto')];},
 caps:[[5,'Zona elástica: recta de pendiente E (módulo de Young). Si se descarga, la probeta recupera su longitud.'],[11,'Pasado el límite elástico la deformación es <b>permanente</b>. La tensión sigue subiendo hasta la resistencia a tracción (máximo).'],[99,'Después empieza la estricción: la sección se adelgaza en una zona y la probeta rompe. El alargamiento hasta rotura mide la ductilidad.']]}));

/* T6 regla de la palanca Cu–Ni */
function liq(x){return 1085+(1455-1085)*x/100+40*Math.sin(Math.PI*x/100);}function sol(x){return 1085+(1455-1085)*x/100-40*Math.sin(Math.PI*x/100);}
function inv(f,T){var lo=0,hi=100;for(var i=0;i<50;i++){var m=(lo+hi)/2;if(f(m)<T)lo=m;else hi=m;}return (lo+hi)/2;}
M.reg('mat-t6',M.base({title:'Diagrama Cu–Ni y regla de la palanca',H:560,dur:18,caps:[[5,'Aleación con 35 % de Ni que se enfría desde líquido. Sistema isomorfo: solubilidad total en sólido y en líquido.'],[12,'Entre la curva de liquidus y la de solidus coexisten líquido y sólido α. La recta horizontal (isoterma) da sus composiciones.'],[99,'Regla de la palanca: la fracción de cada fase es el brazo <b>opuesto</b> dividido por el total. <i>W<sub>α</sub> = (C₀ − C<sub>L</sub>)/(C<sub>α</sub> − C<sub>L</sub>)</i>.']]},
 function(D,t){var A=U.axes(D,{xr:[0,100],yr:[1050,1500],xt:[20,35,60,80,100],yt:[1100,1200,1300,1400],xd:0,yd:0,xl:'% Ni',yl:'T (°C)'},{x:90,y:96,w:470,h:300,grid:true});
  U.plotf(D,A,liq,C.g,2.4);U.plotf(D,A,sol,C.f,2.4);D.text('L',A.X(20),A.Y(1400),{s:18,c:C.g,bold:true});D.text('α',A.X(75),A.Y(1150),{s:18,c:C.f,bold:true});D.text('α + L',A.X(55),A.Y(1280),{s:15,c:C.mut});
  var c0=35,T=lerp(1360,1180,ease(seg(t,1,16)));D.line(A.X(c0),A.Y(1500),A.X(c0),A.Y(1050),C.mut,1,[4,4]);D.dot(A.X(c0),A.Y(T),7,C.m);
  var Tl=liq(c0),Ts=sol(c0),txt;if(T<Tl&&T>Ts){var cl=inv(liq,T),ca=inv(sol,T),wa=(c0-cl)/(ca-cl);D.line(A.X(cl),A.Y(T),A.X(ca),A.Y(T),C.hl,2.4);D.dot(A.X(cl),A.Y(T),5,C.g);D.dot(A.X(ca),A.Y(T),5,C.f);
   txt='C_{L} = '+nf(cl,1)+' %   C_{α} = '+nf(ca,1)+' %    W_{α} = '+nf(wa*100,0)+' %   W_{L} = '+nf(100-wa*100,0)+' %';}else txt=T>=Tl?'todo líquido':'todo sólido α (35 % Ni)';
  D.text('T = '+nf(T,0)+' °C',W/2,462,{s:20,a:'center',c:C.m,bold:true});D.text(txt,W/2,498,{s:18,a:'center',it:true});}));

/* T7 acero eutectoide: austenita → perlita */
M.reg('mat-t7',M.base({title:'Fe–C: acero eutectoide al enfriar',H:540,dur:18,caps:[[6,'Acero con 0,77 % C a 900 °C: todo es austenita (Fe-γ, FCC), que disuelve el carbono.'],[12,'Al llegar a 727 °C se produce la reacción eutectoide: <i>γ → α + Fe₃C</i>. La austenita se transforma en láminas alternas de ferrita y cementita: la <b>perlita</b>.'],[99,'Con menos carbono (hipoeutectoide) aparece primero ferrita proeutectoide; con más (hipereutectoide), cementita en los bordes de grano.']]},
 function(D,t){var A=U.axes(D,{xr:[0,1.6],yr:[600,1000],xt:[0.022,0.77,1.4],yt:[727,800,900],xd:2,yd:0,xl:'% C',yl:'T (°C)'},{x:80,y:96,w:330,h:300,grid:true});
  D.path([[A.X(0),A.Y(912)],[A.X(0.77),A.Y(727)]],C.f,2.2);D.path([[A.X(0.77),A.Y(727)],[A.X(1.6),A.Y(960)]],C.f,2.2);D.line(A.X(0.022),A.Y(727),A.X(1.6),A.Y(727),C.g,2.2);D.text('γ',A.X(0.6),A.Y(900),{s:20,c:C.m,bold:true});D.text('α + Fe₃C',A.X(0.6),A.Y(660),{s:15,c:C.mut});
  var T=lerp(900,650,ease(seg(t,1,15)));D.dot(A.X(0.77),A.Y(T),7,C.m);
  var cx=520,cy=250,R=85,f=clamp((727-T)/20,0,1);D.ring(cx,cy,R,C.w,2);var c=D.ctx;c.save();c.beginPath();c.arc(cx,cy,R-1,0,6.283);c.clip();c.fillStyle=RG(C.f,.18);c.fillRect(cx-R,cy-R,2*R,2*R);
  if(f>0){for(var k=-12;k<12;k++){c.strokeStyle=C.w;c.globalAlpha=0.8*f;c.lineWidth=2;c.beginPath();c.moveTo(cx-R+k*14,cy-R);c.lineTo(cx-R+k*14+90,cy+R);c.stroke();}}c.restore();
  D.text(T>727?'austenita γ':(f<1?'formándose perlita':'perlita (α + Fe₃C)'),cx,cy+R+28,{s:17,a:'center',c:C.m,bold:true});D.text('T = '+nf(T,0)+' °C',cx,cy-R-14,{s:17,a:'center'});}));

/* T8 curvas TTT */
M.reg('mat-t8',M.base({title:'Diagrama TTT: velocidad de enfriamiento',H:560,dur:20,caps:[[7,'Enfriamiento lento (recocido): la curva corta la nariz del diagrama a alta temperatura y la austenita se transforma en perlita gruesa, blanda.'],[14,'Enfriamiento rápido (temple): la curva pasa por delante de la nariz sin tocarla y llega a M<sub>s</sub>: se forma <b>martensita</b>, muy dura y frágil.'],[99,'La velocidad crítica de temple es la mínima que evita la nariz. Después del temple se hace un revenido para recuperar tenacidad.']]},
 function(D,t){var A=U.axes(D,{xr:[-1,5],yr:[0,800],xt:[0,1,2,3,4],yt:[220,540,727],xf:function(v){return '10^{'+v+'}';},yd:0,xl:'t (s)',yl:'T (°C)'},{x:90,y:96,w:470,h:320,grid:true});
  var nose=function(T,d){var u=(T-540)/180;return 0.15+d+1.8*u*u;};var c1=[],c2=[];for(var T=280;T<=720;T+=5){c1.push([A.X(nose(T,0)),A.Y(T)]);c2.push([A.X(nose(T,1.1)),A.Y(T)]);}D.path(c1,C.f,2.4);D.path(c2,C.f,2.4,null,0.6);
  D.line(A.X(-1),A.Y(727),A.X(5),A.Y(727),C.mut,1,[5,4]);D.line(A.X(-1),A.Y(220),A.X(5),A.Y(220),C.g,2,[6,4]);D.text('M_{s}',A.X(4.6),A.Y(220)-8,{s:15,c:C.g});D.text('inicio',A.X(1.1),A.Y(560),{s:13,c:C.f});D.text('fin',A.X(2.1),A.Y(560),{s:13,c:C.f});
  var slow=t<10,u=ease(seg(t,slow?1:10.5,slow?9:18)),pts=[];for(var s=0;s<=u;s+=0.01){var tt=slow?lerp(-1,4.5,s):lerp(-1,1.0,s),TT=slow?727-(727-300)*s:780-(780-100)*s;pts.push([A.X(tt),A.Y(TT)]);}D.path(pts,slow?C.hl:C.m,3);
  D.text(slow?'enfriamiento lento → perlita (≈ 200 HB)':'enfriamiento rápido → martensita (≈ 60 HRC)',W/2,480,{s:20,a:'center',c:slow?C.hl:C.m,bold:true});}));

/* T9 ensayo Jominy */
M.reg('mat-t9',M.traza({title:'Templabilidad: ensayo Jominy',H:540,dur:16,x0:0,x1:50,ax:{xr:[0,50],yr:[15,65],xt:[10,20,30,40,50],yt:[20,30,40,50,60],xd:0,yd:0,xl:'d (mm)',yl:'HRC'},h:300,f:function(x){return 22+36*Math.exp(-Math.pow(x/22,2));},
 extra:function(D,A,x){var p=[];for(var s=0;s<=x;s+=0.3)p.push([A.X(s),A.Y(20+36*Math.exp(-Math.pow(s/5,2)))]);D.path(p,C.g,3);D.text('acero aleado (4140)',A.X(28),A.Y(50),{s:15,c:C.m});D.text('acero al carbono (1040)',A.X(10),A.Y(23)-12,{s:15,c:C.g});},
 read:function(x){return ['a '+nf(x,0)+' mm del extremo:  aleado '+nf(22+36*Math.exp(-Math.pow(x/22,2)),0)+' HRC,  al carbono '+nf(20+36*Math.exp(-Math.pow(x/5,2)),0)+' HRC'];},
 caps:[[6,'Se templa con agua un extremo de una barra: cada punto se enfría a una velocidad distinta, más lenta cuanto más lejos del extremo.'],[11,'Midiendo la dureza a lo largo de la barra se obtiene la curva de templabilidad.'],[99,'El acero aleado mantiene la dureza en profundidad (alta templabilidad): los aleantes retrasan la nariz de la curva TTT. El acero al carbono solo se endurece en la superficie.']]}));

/* T10 envejecimiento por precipitación */
M.reg('mat-t10',M.traza({title:'Endurecimiento por precipitación (aluminio)',H:540,dur:16,x0:-1,x1:3,ax:{xr:[-1,3],yr:[40,140],xt:[-1,0,1,2,3],yt:[60,80,100,120],xf:function(v){return '10^{'+v+'}';},yd:0,xl:'t (h)',yl:'dureza HB'},h:300,
 f:function(x){return 60+70*Math.exp(-Math.pow((x-1.3)/0.9,2));},
 extra:function(D,A){D.line(A.X(1.3),A.Y(40),A.X(1.3),A.Y(130),C.hl,1.2,[4,4]);D.text('pico',A.X(1.3)+6,A.Y(132),{s:14,c:C.hl});D.text('subenvejecido',A.X(-0.6),A.Y(120),{s:14,c:C.mut});D.text('sobreenvejecido',A.X(2.2),A.Y(120),{s:14,c:C.mut});},
 read:function(x){return ['t = '+nf(Math.pow(10,x),1)+' h    dureza = '+nf(60+70*Math.exp(-Math.pow((x-1.3)/0.9,2)),0)+' HB',x<1.1?'precipitados finos y coherentes: frenan las dislocaciones':(x<1.6?'máximo: tamaño óptimo de precipitado':'los precipitados crecen y se separan: el material se ablanda')];},
 caps:[[6,'Tras la solubilización y el temple, la aleación (p. ej. Al-Cu) se calienta a temperatura moderada: precipitan partículas muy finas.'],[11,'Los precipitados obstaculizan el movimiento de las dislocaciones: la dureza sube hasta un máximo.'],[99,'Si se mantiene demasiado tiempo, los precipitados crecen y se separan (coalescen): la dureza vuelve a bajar. Es el sobreenvejecimiento.']]}));

/* T11 regla de las mezclas */
M.reg('mat-t11',M.traza({title:'Compuestos: regla de las mezclas',H:540,dur:16,x0:0,x1:0.7,ax:{xr:[0,0.72],yr:[0,170],xt:[0.2,0.4,0.6],yt:[50,100,150],xd:1,yd:0,xl:'V_{f}',yl:'E (GPa)'},h:300,f:function(v){return 230*v+3.5*(1-v);},
 extra:function(D,A,v){var p=[];for(var s=0;s<=v;s+=0.005)p.push([A.X(s),A.Y(1/(s/230+(1-s)/3.5))]);D.path(p,C.g,3);D.text('longitudinal (isodeformación)',A.X(0.32),A.Y(118),{s:14,c:C.m});D.text('transversal (isotensión)',A.X(0.35),A.Y(22),{s:14,c:C.g});},
 read:function(v){return ['V_{f} = '+nf(v,2)+'    E_{∥} = '+nf(230*v+3.5*(1-v),1)+' GPa    E_{⊥} = '+nf(1/(v/230+(1-v)/3.5),1)+' GPa','fibra de carbono (230 GPa) en resina epoxi (3,5 GPa)'];},
 caps:[[6,'Cargando en la dirección de las fibras, fibra y matriz se deforman igual y los módulos se suman ponderados: <i>E = E<sub>f</sub>V<sub>f</sub> + E<sub>m</sub>V<sub>m</sub></i>.'],[11,'Cargando perpendicular a las fibras soportan la misma tensión y manda la matriz blanda: <i>1/E = V<sub>f</sub>/E<sub>f</sub> + V<sub>m</sub>/E<sub>m</sub></i>.'],[99,'Por eso un compuesto unidireccional es muy <b>anisótropo</b>. Se apilan capas a distintos ángulos para repartir la rigidez.']]}));

/* T12 resistividad y temperatura */
M.reg('mat-t12',M.curva({title:'Resistividad de un metal: regla de Matthiessen',H:540,dur:18,p:[0,1.2],ax:{xr:[0,400],yr:[0,4.5],xt:[100,200,300,400],yt:[1,2,3,4],xd:0,yd:0,xl:'T (K)',yl:'ρ (10⁻⁸ Ω·m)'},h:300,
 f:function(T,imp){var th=T<40?0.0001*T*T*T/64:0.0068*T-0.12;return Math.max(0,th)+imp;},
 read:function(imp){return ['impurezas: ρᵢ = '+nf(imp,2)+'·10⁻⁸ Ω·m','ρ = ρ_{térmica}(T) + ρᵢ + ρ_{def}   (las contribuciones se suman)'];},
 caps:[[6,'La resistividad de un metal crece casi linealmente con la temperatura: las vibraciones de la red dispersan a los electrones.'],[12,'Las impurezas y defectos añaden una contribución que no depende de T: la curva se desplaza hacia arriba.'],[99,'Regla de Matthiessen: <i>ρ = ρ<sub>t</sub> + ρ<sub>i</sub> + ρ<sub>d</sub></i>. Por eso el cobre para cables se usa muy puro: cada aleante sube la resistividad.']]}));

/* T13 semiconductor intrínseco */
var sp13=null;
M.reg('mat-t13',M.base({title:'Semiconductor: electrones que saltan la banda prohibida',H:540,dur:18,caps:[[6,'En un semiconductor la banda de valencia está llena y la de conducción vacía, separadas por la banda prohibida E<sub>g</sub> (1,1 eV en el silicio).'],[12,'Al subir la temperatura algunos electrones ganan energía suficiente para saltar: dejan un <b>hueco</b> en la banda de valencia. Los dos conducen.'],[99,'El número de portadores crece como <i>e<sup>−E<sub>g</sub>/2kT</sup></i>: al contrario que en los metales, la conductividad <b>aumenta</b> con la temperatura.']]},
 function(D,t){var T=lerp(200,600,U.pp(t,18)),n=Math.round(30*Math.exp(-1.12/(2*8.617e-5*T))/Math.exp(-1.12/(2*8.617e-5*600)));if(!sp13)sp13=Array.apply(null,{length:30}).map(function(_,i){return [100+Math.random()*320,Math.random()];});
  D.rect(90,110,340,90,C.f,RG(C.f,.12),2);D.text('banda de conducción',260,130,{s:15,a:'center',c:C.f});D.rect(90,300,340,90,C.m,RG(C.m,.25),2);D.text('banda de valencia',260,385,{s:15,a:'center',c:C.m});
  D.text('E_{g} = 1,12 eV',260,256,{s:17,a:'center',c:C.hl});D.arrow(450,300,450,200,C.hl,2);
  for(var i=0;i<30;i++){var x=sp13[i][0],ex=i<n;var yv=320+sp13[i][1]*50;if(ex){D.ring(x,yv,6,C.m,2);D.dot(x,140+sp13[i][1]*50+Math.sin(t*3+i)*4,6,C.f);}else D.dot(x,yv,6,C.m);}
  D.text('T = '+nf(T,0)+' K',530,200,{s:22,a:'center',c:C.m,bold:true});D.text('electrones: '+n,530,240,{s:18,a:'center',c:C.f});D.text('huecos: '+n,530,270,{s:18,a:'center',c:C.m});
  D.text('n = p = nᵢ ∝ T^{3/2}·e^{−Eg/2kT}',W/2,450,{it:true,s:20,a:'center'});}));

/* T14 polarización de un dieléctrico */
var dip=null;
M.reg('mat-t14',M.base({title:'Dieléctrico: los dipolos se orientan',H:520,dur:16,caps:[[5,'Sin campo, los dipolos moleculares de un dieléctrico polar apuntan al azar: la polarización neta es nula.'],[11,'Al aplicar un campo eléctrico los dipolos tienden a alinearse con él, aunque la agitación térmica los desordena.'],[99,'La polarización <i>P</i> reduce el campo interior y aumenta la capacidad del condensador en el factor εᵣ. Con campos alternos muy rápidos los dipolos no siguen al campo: εᵣ baja con la frecuencia.']]},
 function(D,t){var E=lerp(0,1,U.pp(t,16));if(!dip)dip=Array.apply(null,{length:48}).map(function(){return Math.random()*6.28;});
  D.rect(70,100,20,300,C.g,RG(C.g,.4),2);D.rect(530,100,20,300,C.f,RG(C.f,.4),2);D.text('+',80,94,{s:18,a:'center',c:C.g});D.text('−',540,94,{s:18,a:'center',c:C.f});
  if(E>0.05)for(var k=0;k<5;k++)D.arrow(100,130+k*60,520,130+k*60,C.mut,1,null);
  dip.forEach(function(a0,i){var x=130+(i%8)*50,y=135+Math.floor(i/8)*50,jit=0.6*Math.sin(t*3+i)*(1-E*0.7),a=Math.atan2(Math.sin(a0)*(1-E),Math.cos(a0)*(1-E)+E*1.5)+jit*0.3,L=16;
   D.line(x-L*Math.cos(a),y+L*Math.sin(a),x+L*Math.cos(a),y-L*Math.sin(a),C.m,2.4);D.dot(x+L*Math.cos(a),y-L*Math.sin(a),5,C.g);D.dot(x-L*Math.cos(a),y+L*Math.sin(a),5,C.f);});
  D.text('E aplicado = '+nf(E*100,0)+' %',W/2,450,{s:20,a:'center',c:C.m,bold:true});}));

/* T15 dominios magnéticos */
var dom=null;
M.reg('mat-t15',M.base({title:'Dominios magnéticos y saturación',H:540,dur:18,caps:[[6,'Un ferromagnético está dividido en <b>dominios</b>: zonas imantadas en direcciones distintas que se compensan.'],[12,'Al aplicar un campo H crecen los dominios orientados a favor y los demás giran: la magnetización M aumenta.'],[99,'Cuando todos están alineados el material está <b>saturado</b>. Al quitar el campo no todos vuelven: queda magnetización remanente.']]},
 function(D,t){var H=lerp(0,1,U.pp(t,18));if(!dom)dom=Array.apply(null,{length:48}).map(function(){return [Math.floor(Math.random()*4)*Math.PI/2,Math.random()];});
  var x0=70,y0=110,s=50,Mx=0;dom.forEach(function(d,i){var aligned=d[1]<H*1.15,a=aligned?0:d[0],x=x0+(i%8)*s,y=y0+Math.floor(i/8)*s;Mx+=Math.cos(a);D.rect(x,y,s,s,C.grid,RG(aligned?C.m:C.f,.15),1);D.arrow(x+s/2-16*Math.cos(a),y+s/2+16*Math.sin(a),x+s/2+16*Math.cos(a),y+s/2-16*Math.sin(a),aligned?C.m:C.f,2.2);});
  D.arrow(x0,y0-22,x0+60+H*200,y0-22,C.hl,2.6);D.text('H',x0+70+H*200,y0-16,{it:true,s:18,c:C.hl});
  D.text('M/M_{s} = '+nf(Mx/48,2),530,250,{it:true,s:22,a:'center',c:C.m,bold:true});}));

/* T16 corrosión galvánica */
M.reg('mat-t16',M.base({title:'Corrosión galvánica: ánodo de sacrificio',H:540,dur:16,caps:[[5,'Acero unido a un bloque de cinc en agua de mar. El cinc es más activo (potencial más negativo): actúa como <b>ánodo</b>.'],[11,'El cinc se oxida y se disuelve (<i>Zn → Zn²⁺ + 2e⁻</i>); los electrones van al acero, donde se reduce el oxígeno (<i>O₂ + 2H₂O + 4e⁻ → 4OH⁻</i>).'],[99,'El acero (cátodo) queda protegido mientras quede cinc: es la protección catódica con ánodo de sacrificio de barcos y tuberías.']]},
 function(D,t){D.rect(40,200,560,220,null,RG(C.f,.14));D.line(40,200,600,200,C.f,1.6);D.text('agua de mar (electrolito)',320,400,{s:14,a:'center',c:C.f});
  var zw=lerp(110,40,seg(t,2,15));D.rect(90,230,zw,150,C.mut,RG(C.mut,.5),2);D.text('Zn',90+zw/2,310,{s:16,a:'center',bold:true});D.rect(400,230,140,150,C.w,RG(C.w,.15),2);D.text('acero',470,310,{s:16,a:'center',bold:true});
  D.line(90+zw/2,230,90+zw/2,140,C.w,2);D.line(90+zw/2,140,470,140,C.w,2);D.line(470,140,470,230,C.w,2);
  for(var k=0;k<6;k++){var u=(t*0.3+k/6)%1,d=u*(90+(470-90-zw/2)+90);var x,y;if(d<90){x=90+zw/2;y=230-d;}else if(d<90+470-90-zw/2){x=90+zw/2+(d-90);y=140;}else{x=470;y=140+(d-90-(470-90-zw/2));}D.dot(x,y,5,C.m);}
  D.text('e⁻',300,128,{s:16,c:C.m});for(var j=0;j<5;j++){var v=(t*0.25+j/5)%1;D.text('Zn²⁺',90+zw+v*120,260+j*24,{s:13,c:C.g,al:1-v});}
  D.text('ánodo: se corroe',90+zw/2,450,{s:16,a:'center',c:C.g});D.text('cátodo: protegido',470,450,{s:16,a:'center',c:C.ok});}));
})();
