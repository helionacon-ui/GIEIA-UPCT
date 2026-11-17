/* Expresión Gráfica: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function P3(p,yaw,pit,s,cx,cy){var x=p[0],y=p[1],z=p[2],c=Math.cos(yaw),sn=Math.sin(yaw),x1=c*x-sn*y,y1=sn*x+c*y,cp=Math.cos(pit),sp=Math.sin(pit);return [cx+s*x1,cy-s*(z*cp-y1*sp)];}
function wire(D,V,E,yaw,pit,s,cx,cy,col,w){E.forEach(function(e){var a=P3(V[e[0]],yaw,pit,s,cx,cy),b=P3(V[e[1]],yaw,pit,s,cx,cy);D.line(a[0],a[1],b[0],b[1],col,w||2);});}
function arc(D,cx,cy,r,a0,a1,col,w,dash){var c=D.ctx;c.save();c.strokeStyle=col;c.lineWidth=w||2;if(dash)c.setLineDash(dash);c.beginPath();c.arc(cx,cy,r,-a0,-a1,a1>a0);c.stroke();c.restore();}

/* T1 tangentes desde un punto exterior */
M.reg('eg-t1',M.base({title:'Tangentes a una circunferencia desde un punto',H:540,dur:18,caps:[[5,'Datos: circunferencia de centro O y un punto exterior P. Se une O con P y se halla el punto medio M.'],[11,'Se traza el arco de centro M que pasa por O y P (arco capaz de 90°). Corta a la circunferencia en T₁ y T₂.'],[99,'P–T₁ y P–T₂ son las tangentes: el radio OT es perpendicular a la tangente porque el ángulo inscrito en una semicircunferencia es recto.']]},
 function(D,t){var O=[200,280],r=90,P=[500,250],Mm=[(O[0]+P[0])/2,(O[1]+P[1])/2],R2=Math.hypot(P[0]-O[0],P[1]-O[1])/2;
  D.ring(O[0],O[1],r,C.w,2.4);D.dot(O[0],O[1],5,C.w);D.text('O',O[0]-16,O[1]+6,{s:18});D.dot(P[0],P[1],6,C.m);D.text('P',P[0]+10,P[1]+6,{s:18,c:C.m});
  var s1=seg(t,1,3);if(s1>0){D.line(O[0],O[1],lerp(O[0],P[0],s1),lerp(O[1],P[1],s1),C.mut,1.4,[5,4]);}
  if(t>3.2){D.dot(Mm[0],Mm[1],5,C.f);D.text('M',Mm[0]-4,Mm[1]-12,{s:17,c:C.f});}
  var s2=seg(t,5,9.5),a0=Math.atan2(-(O[1]-Mm[1]),O[0]-Mm[0]);if(s2>0)arc(D,Mm[0],Mm[1],R2,a0,a0+s2*2*Math.PI,C.f,1.6,[6,4]);
  var dx=P[0]-O[0],dy=P[1]-O[1],d=Math.hypot(dx,dy),ang=Math.atan2(dy,dx),al=Math.acos(r/d);
  var T1=[O[0]+r*Math.cos(ang+al),O[1]+r*Math.sin(ang+al)],T2=[O[0]+r*Math.cos(ang-al),O[1]+r*Math.sin(ang-al)];
  if(t>9.6){D.dot(T1[0],T1[1],6,C.hl);D.dot(T2[0],T2[1],6,C.hl);D.text('T₁',T1[0]-8,T1[1]+24,{s:17,c:C.hl});D.text('T₂',T2[0]-8,T2[1]-10,{s:17,c:C.hl});}
  var s3=seg(t,11,14);if(s3>0){[T1,T2].forEach(function(T){var ex=lerp(P[0],T[0]+(T[0]-P[0])*0.35,s3),ey=lerp(P[1],T[1]+(T[1]-P[1])*0.35,s3);D.line(P[0],P[1],ex,ey,C.m,2.6);D.line(O[0],O[1],T[0],T[1],C.g,1.6);});}
  if(t>14)D.text('OT ⟂ PT: ángulo recto en T',W/2,470,{s:20,a:'center',c:C.g});}));

/* T2 elipse del jardinero */
var ea=3,eb=2,ec=Math.sqrt(5);
M.reg('eg-t2',M.tray({title:'La elipse: suma de distancias constante',H:560,dur:14,lin:true,ax:{xr:[-4.2,4.2],yr:[-2.7,2.7],xt:[],yt:[],xl:'',yl:''},h:320,s:[0,2*Math.PI],
 path:function(s){return [ea*Math.cos(s),eb*Math.sin(s)];},
 extra:function(D,A,s){var p=[ea*Math.cos(s),eb*Math.sin(s)];[[-ec,0],[ec,0]].forEach(function(F,i){D.line(A.X(F[0]),A.Y(0),A.X(p[0]),A.Y(p[1]),i?C.g:C.f,2.4);D.dot(A.X(F[0]),A.Y(0),6,C.hl);D.text(i?'F₂':'F₁',A.X(F[0])-6,A.Y(0)+22,{s:16,c:C.hl});});},
 read:function(s){var p=[ea*Math.cos(s),eb*Math.sin(s)],d1=Math.hypot(p[0]+ec,p[1]),d2=Math.hypot(p[0]-ec,p[1]);return ['PF₁ + PF₂ = '+nf(d1,2)+' + '+nf(d2,2)+' = '+nf(d1+d2,2)+' = 2a','a = 3,  b = 2,  c = √(a² − b²) = '+nf(ec,2)];},
 caps:[[5,'Método del jardinero: un hilo de longitud 2a fijo en los focos F₁ y F₂, tensado con un lápiz.'],[10,'Al mover el lápiz, una distancia crece y la otra decrece, pero su suma es siempre <i>2a</i>: el lápiz dibuja una elipse.'],[99,'Los focos están a <i>c = √(a² − b²)</i> del centro. Cuanto más juntos están, más se parece la elipse a una circunferencia.']]}));

/* T3 sistema diédrico: abatimiento del plano horizontal */
M.reg('eg-t3',M.base({title:'Sistema diédrico: proyecciones de un punto',H:560,dur:18,caps:[[5,'El punto A está en el espacio, delante del plano vertical (PV) y encima del horizontal (PH). Se proyecta perpendicularmente sobre ambos: A″ y A′.'],[12,'Para dibujar en el papel se <b>abate</b> el plano horizontal girándolo 90° alrededor de la línea de tierra (LT) hasta coincidir con el vertical.'],[99,'En el dibujo, A′ (proyección horizontal) y A″ (vertical) quedan en una misma perpendicular a LT: la cota está sobre LT y el alejamiento debajo.']]},
 function(D,t){var rot=ease(seg(t,7,12))*Math.PI/2,yaw=-0.55,pit=0.38*(1-ease(seg(t,7,12))),s=55,cx=300,cy=300;
  var hp=function(x,y){return [x,y*Math.cos(rot),-y*Math.sin(rot)];};
  var pv=[[-3,0,0],[3,0,0],[3,0,3.4],[-3,0,3.4]].map(function(p){return P3(p,yaw,pit,s,cx,cy);});D.path(pv,C.f,1.6,RG(C.f,.12));
  var ph=[[-3,0],[3,0],[3,3.2],[-3,3.2]].map(function(q){return P3(hp(q[0],-q[1]),yaw,pit,s,cx,cy);});D.path(ph,C.g,1.6,RG(C.g,.12));
  var l1=P3([-3.4,0,0],yaw,pit,s,cx,cy),l2=P3([3.4,0,0],yaw,pit,s,cx,cy);D.line(l1[0],l1[1],l2[0],l2[1],C.w,2.6);D.text('LT',l2[0]+8,l2[1]+6,{s:16});
  var A=[0.8,-1.8,2.2],A1=P3(A,yaw,pit,s,cx,cy),Av=P3([A[0],0,A[2]],yaw,pit,s,cx,cy),Ah=P3(hp(A[0],-A[1]),yaw,pit,s,cx,cy),Ao=P3([A[0],0,0],yaw,pit,s,cx,cy);
  if(t<12){D.line(A1[0],A1[1],Av[0],Av[1],C.mut,1.2,[4,3]);var Ah0=P3([A[0],A[1],0],yaw,pit,s,cx,cy);D.line(A1[0],A1[1],Ah0[0],Ah0[1],C.mut,1.2,[4,3]);D.dot(A1[0],A1[1],7,C.m);D.text('A',A1[0]+10,A1[1],{s:18,c:C.m});}
  D.dot(Av[0],Av[1],6,C.f);D.text('A″',Av[0]+8,Av[1]-6,{s:17,c:C.f});D.dot(Ah[0],Ah[1],6,C.g);D.text('A′',Ah[0]+8,Ah[1]+16,{s:17,c:C.g});
  if(t>12){D.line(Av[0],Av[1],Ah[0],Ah[1],C.hl,1.6,[5,4]);D.text('cota = 2,2',Av[0]+50,(Av[1]+Ao[1])/2,{s:15,c:C.f});D.text('alejamiento = 1,8',Ah[0]+50,(Ah[1]+Ao[1])/2+6,{s:15,c:C.g});}
  D.text(t<7?'proyectar sobre PV y PH':(t<12?'abatiendo el plano horizontal…':'el dibujo diédrico'),W/2,520,{s:20,a:'center',c:C.m,bold:true});}));

/* T4 cubo hacia la isométrica */
var CV=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]].map(function(p){return [p[0]-0.5,p[1]-0.5,p[2]-0.5];}),CE=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
M.reg('eg-t4',M.base({title:'Perspectiva isométrica',H:540,dur:16,caps:[[5,'Giramos un cubo hasta que sus tres aristas principales formen el mismo ángulo con el plano del dibujo.'],[11,'Eso ocurre con un giro de 45° y una inclinación de 35,26°: los tres ejes forman 120° entre sí en el dibujo.'],[99,'En isométrica las tres direcciones se reducen igual (coeficiente 0,816); en el dibujo isométrico se toman las medidas reales, sin reducir.']]},
 function(D,t){var u=ease(seg(t,1,10)),yaw=lerp(0.15,Math.PI/4,u),pit=lerp(0.08,Math.atan(1/Math.sqrt(2)),u),s=150,cx=320,cy=270;
  wire(D,CV,CE,yaw,pit,s,cx,cy,C.m,2.6);var O=P3([-0.5,-0.5,-0.5],yaw,pit,s,cx,cy);
  [[1,0,0],[0,1,0],[0,0,1]].forEach(function(e,i){var q=P3([-0.5+e[0]*1.6,-0.5+e[1]*1.6,-0.5+e[2]*1.6],yaw,pit,s,cx,cy);D.arrow(O[0],O[1],q[0],q[1],[C.g,C.f,C.hl][i],2);D.text(['X','Y','Z'][i],q[0]+6,q[1],{s:16,c:[C.g,C.f,C.hl][i]});});
  D.text('giro = '+nf(yaw*180/Math.PI,1)+'°    inclinación = '+nf(pit*180/Math.PI,2)+'°',W/2,480,{s:20,a:'center',c:C.m});if(u>0.98)D.text('ejes a 120°: isométrica',W/2,512,{s:18,a:'center',c:C.ok,bold:true});}));

/* T5 formatos DIN A */
M.reg('eg-t5',M.base({title:'Formatos UNE-EN ISO 216: de A0 a A5',H:540,dur:16,caps:[[6,'El A0 mide 841 × 1189 mm: 1 m² con lados en proporción 1 : √2.'],[12,'Cada formato se obtiene <b>doblando por la mitad</b> el anterior por su lado mayor. La proporción √2 se conserva siempre.'],[99,'Por eso el A4 (210 × 297) es la dieciseisava parte del A0, y una ampliación de A4 a A3 es exactamente ×√2 ≈ 141 %.']]},
 function(D,t){var n=Math.min(5,Math.floor(seg(t,1,13)*6)),x=60,y=80,w=420,h=w/Math.SQRT2,dims=[[841,1189],[594,841],[420,594],[297,420],[210,297],[148,210]];
  D.rect(x,y,w,h,C.w,null,2);var cx=x,cy=y,cw=w,ch=h;
  for(var k=0;k<=n;k++){var col=[C.m,C.f,C.g,C.hl,C.ok,C.bad][k],last=k===n;D.rect(cx,cy,cw,ch,last?col:C.mut,last?RG(col,.18):null,last?2.4:1.2);
   var lx=cx+(cw>ch?cw*0.75:cw/2),ly=cy+(cw>ch?ch/2:ch*0.75);if(!last)D.text('A'+k,lx,ly+6,{s:Math.max(12,22-k*2),a:'center',c:C.mut});else D.text('A'+k,cx+cw/2,cy+ch/2+8,{s:Math.max(14,28-k*3),a:'center',c:col,bold:true});
   if(cw>ch){cw=cw/2;}else{ch=ch/2;}}
  D.text('A'+n+': '+dims[n][0]+' × '+dims[n][1]+' mm',W/2,440,{s:22,a:'center',c:C.m,bold:true});D.text('lado mayor / lado menor = '+nf(dims[n][1]/dims[n][0],3)+' ≈ √2',W/2,476,{s:18,a:'center'});}));

/* T6 vistas de una pieza en L */
var LV=[[0,0,0],[3,0,0],[3,2,0],[0,2,0],[0,0,1],[3,0,1],[3,2,1],[0,2,1],[0,0,3],[1,0,3],[1,2,3],[0,2,3],[1,0,1],[1,2,1]].map(function(p){return [p[0]-1.5,p[1]-1,p[2]-1.5];});
var LE=[[0,1],[1,2],[2,3],[3,0],[0,8],[3,11],[8,11],[8,9],[11,10],[9,10],[9,12],[10,13],[12,13],[12,5],[13,6],[4,5],[5,6],[6,7],[7,4],[1,5],[2,6]];
M.reg('eg-t6',M.base({title:'Vistas normalizadas de una pieza',H:560,dur:18,caps:[[6,'La pieza en L gira en el espacio. Las vistas se obtienen mirándola de frente, desde arriba y desde un lado.'],[12,'Sistema europeo (primer diedro): la planta va <b>debajo</b> del alzado y el perfil izquierdo a la <b>derecha</b>.'],[99,'Las vistas están alineadas: el alzado y la planta comparten anchuras; el alzado y el perfil, alturas.']]},
 function(D,t){var yaw=0.6+t*0.35,pit=0.45;wire(D,LV,LE,yaw,pit,40,140,250,C.m,2.4);
  var vx=330,vy=110,s=32,show=function(k){return seg(t,3+k*3,5+k*3);};
  var a1=show(0);if(a1>0){D.ctx.save();D.ctx.globalAlpha=a1;D.path([[vx,vy+96],[vx+96,vy+96],[vx+96,vy+64],[vx+32,vy+64],[vx+32,vy],[vx,vy]],C.f,2.4);D.text('alzado',vx+48,vy-10,{s:14,a:'center',c:C.f});D.ctx.restore();}
  var a2=show(1);if(a2>0){D.ctx.save();D.ctx.globalAlpha=a2;D.rect(vx,vy+120,96,64,C.g,null,2.4);D.line(vx+32,vy+120,vx+32,vy+184,C.g,2.4);D.text('planta',vx+48,vy+204,{s:14,a:'center',c:C.g});D.ctx.restore();}
  var a3=show(2);if(a3>0){D.ctx.save();D.ctx.globalAlpha=a3;D.path([[vx+130,vy],[vx+194,vy],[vx+194,vy+96],[vx+130,vy+96]],C.hl,2.4);D.line(vx+130,vy+64,vx+194,vy+64,C.hl,2.4);D.text('perfil izq.',vx+162,vy-10,{s:14,a:'center',c:C.hl});D.ctx.restore();}
  D.line(vx-10,vy+108,vx+210,vy+108,C.grid,1,[3,3]);D.line(vx+113,vy-20,vx+113,vy+200,C.grid,1,[3,3]);}));

/* T7 acotación paso a paso */
M.reg('eg-t7',M.base({title:'Acotar una pieza',H:520,dur:16,caps:[[4,'Primero las <b>líneas auxiliares</b>: prolongan las aristas y sobresalen unos 2 mm de la línea de cota.'],[8,'Después la <b>línea de cota</b>, paralela a la medida, con sus flechas apoyadas en las auxiliares.'],[99,'Por último la <b>cifra de cota</b>, encima de la línea y centrada. Se acota en mm sin poner la unidad, y cada medida una sola vez.']]},
 function(D,t){var x=150,y=220,w=340,h=150;D.rect(x,y,w,h,C.w,RG(C.w,.06),2.6);D.ring(x+250,y+75,32,C.w,2.6);D.line(x+250,y+30,x+250,y+120,C.mut,1,[10,3,2,3]);D.line(x+205,y+75,x+295,y+75,C.mut,1,[10,3,2,3]);
  var a=seg(t,1,3.5),b=seg(t,4,7),c=seg(t,8,10);
  if(a>0){D.line(x,y-6,x,y-6-58*a,C.f,1.2);D.line(x+w,y-6,x+w,y-6-58*a,C.f,1.2);D.line(x-6,y+h,x-6-58*a,y+h,C.f,1.2);D.line(x-6,y,x-6-58*a,y,C.f,1.2);}
  if(b>0){var yy=y-50,L=w*b;D.line(x,yy,x+L,yy,C.m,1.6);D.head(x,yy,Math.PI,C.m,10);if(b>0.98)D.head(x+w,yy,0,C.m,10);var xx=x-50;D.line(xx,y+h,xx,y+h-h*b,C.m,1.6);D.head(xx,y+h,Math.PI/2,C.m,10);if(b>0.98)D.head(xx,y,-Math.PI/2,C.m,10);}
  if(c>0){D.text('120',x+w/2,y-58,{s:20,a:'center',c:C.m,al:c});D.ctx.save();D.ctx.translate(x-58,y+h/2);D.ctx.rotate(-Math.PI/2);D.text('50',0,0,{s:20,a:'center',c:C.m,al:c});D.ctx.restore();}
  var d=seg(t,11,13);if(d>0){D.arrow(x+250+70,y+75-50,x+250+23,y+75-23,C.g,1.6);D.text('⌀ 45',x+250+74,y+75-54,{s:20,c:C.g,al:d});}}));

/* T8 tornillo y paso de rosca */
M.reg('eg-t8',M.base({title:'Rosca: el paso',H:520,dur:16,caps:[[5,'Una rosca es una hélice tallada en un cilindro. El <b>paso</b> P es la distancia entre dos filetes consecutivos.'],[11,'Por cada vuelta completa del tornillo, la tuerca avanza exactamente un paso.'],[99,'Designación métrica: M10 × 1,5 = diámetro nominal 10 mm y paso 1,5 mm. Si no se indica el paso, es el paso normal.']]},
 function(D,t){var turns=lerp(0,3,ease(seg(t,1,14))),P=34,x0=80,y0=230,L=480,ph=(turns%1)*P;
  D.rect(x0,y0-40,L,80,null,RG(C.mut,.2));var up=[],dn=[];for(var x=0;x<=L;x+=2){var q=((x+ph)%P)/P,tri=q<0.5?q*2:2-q*2;up.push([x0+x,y0-40-12*tri+6]);dn.push([x0+x,y0+40+12*tri-6]);}D.path(up,C.w,2);D.path(dn,C.w,2);
  var nx=x0+60+turns*P;D.rect(nx,y0-62,70,124,C.m,RG(C.m,.3),2.4);D.text('tuerca',nx+35,y0-72,{s:15,a:'center',c:C.m});
  D.line(x0+60,y0+90,nx,y0+90,C.hl,2);D.text('avance = '+nf(turns,2)+' vueltas × P',x0+60+(nx-x0-60)/2+60,y0+116,{s:17,a:'center',c:C.hl});
  D.line(x0+300,y0-80,x0+300+P,y0-80,C.g,2);D.text('P',x0+300+P/2,y0-88,{s:17,a:'center',c:C.g});
  var a=turns*2*Math.PI;D.ring(560,120,30,C.w,2);D.line(560,120,560+28*Math.cos(a),120-28*Math.sin(a),C.m,3);D.text('giro',560,170,{s:14,a:'center',c:C.mut});}));

/* T9 rugosidad Ra */
function prof(x,p){return p*(0.6*Math.sin(x*3.1)+0.3*Math.sin(x*7.7+1)+0.25*Math.sin(x*13.3+2)+0.12*Math.sin(x*29+0.5));}
M.reg('eg-t9',M.curva({title:'Rugosidad: el parámetro Ra',H:540,dur:18,p:[0.3,1.6],ax:{xr:[0,10],yr:[-2.4,2.4],xt:[],yt:[-2,-1,1,2],yd:0,xl:'',yl:'µm'},h:300,f:prof,ghost:false,
 extra:function(D,A,p){var pts=[[A.X(0),A.Y(0)]];for(var x=0;x<=10;x+=0.02)pts.push([A.X(x),A.Y(prof(x,p))]);pts.push([A.X(10),A.Y(0)]);D.path(pts,null,0,RG(C.m,.22));D.line(A.X(0),A.Y(0),A.X(10),A.Y(0),C.hl,2,[6,4]);
   var s=0,N=1000;for(var i=0;i<N;i++)s+=Math.abs(prof(10*i/N,p));var ra=s/N;D.line(A.X(0),A.Y(ra),A.X(10),A.Y(ra),C.g,1.6,[3,3]);D.text('Ra',A.X(10)+4,A.Y(ra)+5,{s:15,c:C.g});},
 read:function(p){var s=0,N=1000;for(var i=0;i<N;i++)s+=Math.abs(prof(10*i/N,p));return ['Ra = (1/L)∫|y| dx = '+nf(s/N,2)+' µm','línea media (amarilla): el área por encima iguala a la de debajo'];},
 caps:[[6,'El perfil real de una superficie tiene picos y valles. La <b>línea media</b> deja la misma área por encima y por debajo.'],[12,'<i>Ra</i> es la media de las desviaciones en valor absoluto respecto a la línea media: el área sombreada dividida por la longitud.'],[99,'Una superficie rectificada tiene Ra ≈ 0,4 µm; una torneada, 1,6–6,3 µm. En el plano se indica con el símbolo de acabado superficial.']]}));

/* T10 ajustes ISO */
var AJ=[['g6',-9,-25],['h6',0,-16],['k6',18,2],['p6',42,26]];
M.reg('eg-t10',M.base({title:'Ajustes ISO: Ø40 H7 con distintos ejes',H:560,dur:20,caps:[[6,'El agujero Ø40 H7 tiene su zona de tolerancia (azul) entre 0 y +25 µm sobre la línea cero (la medida nominal).'],[13,'Cambiando la posición de la tolerancia del eje se pasa de <b>juego</b> (el eje siempre entra holgado) a <b>apriete</b> (siempre hay que forzarlo).'],[99,'Juego máximo = máx. agujero − mín. eje; apriete máximo = máx. eje − mín. agujero. Con k6 el ajuste es <b>indeterminado</b>: puede salir de cualquier tipo.']]},
 function(D,t){var k=Math.min(3,Math.floor(seg(t,1,19)*4)),a=AJ[k],Y=function(v){return 280-v*4;};
  D.line(60,Y(0),580,Y(0),C.w,2);D.text('línea cero (Ø40)',70,Y(0)-8,{s:14,c:C.mut});
  D.rect(180,Y(25),110,Y(0)-Y(25),C.f,RG(C.f,.3),2);D.text('agujero H7',235,Y(25)-10,{s:16,a:'center',c:C.f});D.text('+25',300,Y(25)+5,{s:13,c:C.f});
  D.rect(350,Y(a[1]),110,Y(a[2])-Y(a[1]),C.m,RG(C.m,.3),2);D.text('eje '+a[0],405,Math.min(Y(a[1]),Y(a[2]))-10,{s:16,a:'center',c:C.m});D.text((a[1]>0?'+':'')+a[1],470,Y(a[1])+5,{s:13,c:C.m});D.text((a[2]>0?'+':'')+a[2],470,Y(a[2])+5,{s:13,c:C.m});
  var jmax=25-a[2],jmin=0-a[1],tipo=jmin>=0?'ajuste con juego':(jmax<=0?'ajuste con apriete':'ajuste indeterminado');
  D.text('Ø40 H7/'+a[0]+':  '+tipo,W/2,470,{s:22,a:'center',c:jmin>=0?C.ok:(jmax<=0?C.bad:C.hl),bold:true});
  D.text((jmax>=0?'juego máx. = '+jmax:'apriete mín. = '+(-jmax))+' µm     '+(jmin>=0?'juego mín. = '+jmin:'apriete máx. = '+(-jmin))+' µm',W/2,506,{s:18,a:'center'});}));

/* T11 tolerancia de planitud */
M.reg('eg-t11',M.curva({title:'Tolerancia de planitud',H:540,dur:18,p:[0.2,1.5],ax:{xr:[0,10],yr:[-1.6,1.6],xt:[],yt:[],xl:'',yl:''},h:280,ghost:false,
 f:function(x,p){return p*0.035*(Math.sin(x*1.3)*0.7+Math.sin(x*3.1+1)*0.3)/0.05;},
 extra:function(D,A,p){var tz=0.05,mx=0;for(var x=0;x<=10;x+=0.05){var v=Math.abs(p*0.035*(Math.sin(x*1.3)*0.7+Math.sin(x*3.1+1)*0.3));if(v>mx)mx=v;}var ok=2*mx<=tz;
   D.rect(A.X(0),A.Y(1),A.X(10)-A.X(0),A.Y(-1)-A.Y(1),ok?C.ok:C.bad,RG(ok?C.ok:C.bad,.1),1.6);D.text('zona de tolerancia: 0,05 mm',A.X(5),A.Y(1)-10,{s:15,a:'center',c:ok?C.ok:C.bad});
   D.text('desviación de forma = '+nf(2*mx,3)+' mm  →  '+(ok?'CUMPLE':'NO CUMPLE'),W/2,440,{s:22,a:'center',c:ok?C.ok:C.bad,bold:true});},
 read:function(){return [];},
 caps:[[6,'La planitud exige que toda la superficie quede entre dos planos paralelos separados el valor de la tolerancia (aquí 0,05 mm).'],[12,'La medida o la posición no importan: solo la <b>forma</b>. Cuando el perfil se sale de la banda, la pieza no cumple.'],[99,'En el plano se indica con un marco: el símbolo ▱, el valor 0,05 y, si hace falta, la referencia. Las tolerancias geométricas complementan a las dimensionales.']]}));

/* T12 despiece de una unión atornillada */
M.reg('eg-t12',M.base({title:'Conjunto y despiece',H:540,dur:16,caps:[[5,'Conjunto montado: tornillo, dos chapas, arandela y tuerca.'],[11,'En el <b>despiece</b> las piezas se separan a lo largo del eje de montaje, en el orden en que se ensamblan.'],[99,'Cada pieza lleva una <b>marca</b> (número en círculo) que remite a la lista de piezas, con su denominación, cantidad y material o norma.']]},
 function(D,t){var u=ease(seg(t,2,9))*(1-ease(seg(t,13,15.5))),cy=270,parts=[{n:1,w:30,h:110,dx:-110,c:C.m},{n:2,w:30,h:200,dx:-40,c:C.f},{n:3,w:30,h:200,dx:0,c:C.f},{n:4,w:12,h:70,dx:60,c:C.hl},{n:5,w:30,h:80,dx:120,c:C.g}];
  var base=[180,240,270,300,312];D.line(60,cy,600,cy,C.mut,1,[10,3,2,3]);
  parts.forEach(function(p,i){var x=base[i]+p.dx*u;if(i===0)D.rect(x+p.w,cy-14,190,28,p.c,RG(p.c,.12),1.6);D.rect(x,cy-p.h/2,p.w,p.h,p.c,RG(p.c,.25),2);
   if(u>0.5){D.ring(x+p.w/2,cy-p.h/2-40,15,C.w,1.6);D.text(String(p.n),x+p.w/2,cy-p.h/2-34,{s:15,a:'center'});D.line(x+p.w/2,cy-p.h/2-25,x+p.w/2,cy-p.h/2,C.w,1);}});
  if(u>0.5)D.text('1 tornillo · 2–3 chapas · 4 arandela · 5 tuerca',W/2,470,{s:18,a:'center',c:C.mut});}));

/* T13 transformaciones en CAD */
var house=[[0,0],[2,0],[2,1.5],[1,2.4],[0,1.5]];
M.reg('eg-t13',M.base({title:'CAD: transformaciones geométricas',H:560,dur:18,caps:[[6,'Un objeto en CAD es una lista de puntos. Para moverlo se aplica la misma transformación a todos: primero una <b>traslación</b>…'],[12,'…luego un <b>giro</b> de 45° alrededor del origen y, por último, un <b>escalado</b> ×1,5.'],[99,'Con coordenadas homogéneas las tres se escriben como matrices 3×3 y se encadenan multiplicándolas: <i>M = S·R·T</i>. El orden importa.']]},
 function(D,t){var A=U.axes(D,{xr:[-4,6],yr:[-1,6],xt:[-2,2,4],yt:[2,4],xd:0,yd:0,xl:'x',yl:'y'},{x:80,y:90,w:480,h:330,grid:true});
  var u1=ease(seg(t,1,5)),u2=ease(seg(t,6,10.5)),u3=ease(seg(t,11.5,15.5)),ang=u2*Math.PI/4,sc=1+0.5*u3;
  var tr=function(p){var x=p[0]+1.5*u1,y=p[1]+0.5*u1,c=Math.cos(ang),s=Math.sin(ang),xr=c*x-s*y,yr=s*x+c*y;return [xr*sc,yr*sc];};
  D.path(house.map(function(p){return [A.X(p[0]),A.Y(p[1])];}),C.mut,1.4,null,0.5);D.path(house.map(tr).map(function(p){return [A.X(p[0]),A.Y(p[1])];}),C.m,2.6,RG(C.m,.2));
  var lbl=t<6?'T: traslación (1,5; 0,5)':(t<11.5?'R: giro 45°':'S: escala ×1,5');D.text(lbl,W/2,470,{s:22,a:'center',c:C.m,bold:true});
  D.text('[x′ y′ 1]ᵀ = M · [x y 1]ᵀ',W/2,506,{s:19,a:'center'});}));

/* T14 esquema eléctrico */
M.reg('eg-t14',M.base({title:'Esquema eléctrico: un circuito simple',H:520,dur:14,caps:[[5,'Esquema con símbolos normalizados (UNE-EN 60617): pila, interruptor, lámpara y resistencia.'],[9,'Al cerrar el interruptor el circuito queda cerrado y circula la corriente (sentido convencional: del + al −, por fuera de la pila).'],[99,'El esquema no dibuja la forma real de los componentes ni su posición: solo cómo están conectados.']]},
 function(D,t){var on=t>5,x0=120,x1=520,y0=150,y1=380;
  D.line(x0,y0,260,y0,C.w,2.4);D.line(330,y0,x1,y0,C.w,2.4);D.line(x1,y0,x1,y1,C.w,2.4);D.line(x1,y1,x0,y1,C.w,2.4);D.line(x0,y1,x0,290,C.w,2.4);D.line(x0,250,x0,y0,C.w,2.4);
  D.line(x0-26,250,x0+26,250,C.w,3);D.line(x0-14,262,x0+14,262,C.w,5);D.text('+',x0+36,256,{s:16});D.line(x0,262,x0,290,C.w,2.4);
  var ang=on?0:-0.5;D.dot(260,y0,4,C.w);D.line(260,y0,260+70*Math.cos(ang),y0+70*Math.sin(ang),C.w,2.6);D.dot(330,y0,4,C.w);D.text('interruptor',295,y0-26,{s:14,a:'center',c:C.mut});
  D.ring(x1,265,24,C.w,2.4);D.line(x1-17,248,x1+17,282,C.w,2);D.line(x1-17,282,x1+17,248,C.w,2);if(on){D.dot(x1,265,22,C.hl,0.35+0.15*Math.sin(t*8));}
  D.rect(270,y1-12,90,24,C.w,null,2.4);D.text('R',315,y1+6,{s:15,a:'center'});
  if(on){var L=2*(x1-x0)+2*(y1-y0);for(var k=0;k<14;k++){var d=((t-5)*70+k*L/14)%L,x,y;if(d<x1-x0){x=x0+d;y=y0;}else if(d<x1-x0+y1-y0){x=x1;y=y0+d-(x1-x0);}else if(d<2*(x1-x0)+y1-y0){x=x1-(d-(x1-x0)-(y1-y0));y=y1;}else{x=x0;y=y1-(d-2*(x1-x0)-(y1-y0));}D.dot(x,y,4,C.m);}}
  D.text(on?'circuito cerrado: circula corriente':'circuito abierto',W/2,450,{s:20,a:'center',c:on?C.ok:C.mut,bold:true});}));
})();
