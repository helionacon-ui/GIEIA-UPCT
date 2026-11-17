/* Automatización Industrial: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 cilindro de doble efecto con válvula 5/2 */
M.reg('ai-t1',M.base({title:'Cilindro de doble efecto y válvula 5/2',H:540,dur:16,caps:[[5,'La válvula 5/2 tiene 5 vías y 2 posiciones. En cada posición manda aire a una cámara del cilindro y descarga la otra.'],[10,'Al conmutar, la presión entra por el otro lado y la cámara contraria se descarga a la atmósfera por el escape.'],[99,'Así el vástago sale (A+) y entra (A−) con fuerza en los dos sentidos. La fuerza de avance es <i>p·A</i>; la de retroceso, algo menor por el área del vástago.']]},
 function(D,t){var out=(t%8)<4,ph=(t%4)/4,x=out?ease(seg(ph,0,0.6)):1-ease(seg(ph,0,0.6)),cx=110,cy=150,L=300,H=80;
  D.rect(cx,cy,L,H,C.ax,null,2.6);var px=cx+20+x*(L-60);D.rect(px,cy+4,18,H-8,null,C.m);D.rect(px+18,cy+H/2-8,L-40+60,16,null,RG(C.m,.6));
  D.rect(cx+4,cy+4,px-cx-4,H-8,null,RG(out?C.bad:C.f,out?.25:.06));D.rect(px+18,cy+4,cx+L-px-22,H-8,null,RG(out?C.f:C.bad,out?.06:.25));
  var vx=180,vy=330;D.rect(vx,vy,100,60,C.ax,null,2);D.rect(vx+100,vy,100,60,C.ax,null,2);var act=out?vx:vx+100;D.rect(act,vy,100,60,C.hl,RG(C.hl,.12),3);
  if(out){D.arrow(vx+25,vy+55,vx+25,vy+6,C.bad,2);D.arrow(vx+75,vy+6,vx+75,vy+55,C.f,2);}else{D.arrow(vx+125,vy+55,vx+175,vy+6,C.bad,2);D.arrow(vx+175,vy+55,vx+125,vy+6,C.f,2);}
  D.line(cx+30,cy+H,cx+30,vy-30,out?C.bad:C.f,2.4);D.line(cx+30,vy-30,vx+25+(out?0:100),vy-30,out?C.bad:C.f,2.4);D.line(vx+25+(out?0:100),vy-30,vx+25+(out?0:100),vy,out?C.bad:C.f,2.4);
  D.line(cx+L-30,cy+H,cx+L-30,vy-50,out?C.f:C.bad,2.4);D.line(cx+L-30,vy-50,vx+75+(out?0:100),vy-50,out?C.f:C.bad,2.4);D.line(vx+75+(out?0:100),vy-50,vx+75+(out?0:100),vy,out?C.f:C.bad,2.4);
  D.text('presión',vx-10,vy+82,{s:14,c:C.bad,a:'right'});D.text('escape',vx+230,vy+82,{s:14,c:C.f});D.text(out?'A+ (sale)':'A− (entra)',W/2,470,{s:20,a:'center',c:C.m,bold:true});}));

/* T2 diagrama espacio-fase A+ B+ B− A− */
M.reg('ai-t2',M.base({title:'Diagrama espacio-fase: secuencia A+ B+ B− A−',H:560,dur:18,caps:[[6,'El diagrama espacio-fase dibuja la posición de cada cilindro (0 dentro, 1 fuera) en cada fase de la secuencia.'],[12,'Cada movimiento lo provoca el final de carrera del movimiento anterior: a1 da paso a B+, b1 a B−, b0 a A−.'],[99,'En las fases 2 y 3 B tiene que salir y entrar mientras A sigue fuera: si las señales se solapan hay que anular la señal permanente (cascada o paso a paso).']]},
 function(D,t){var x0=140,cw=100,ys={A:170,B:300},h=70,u=seg(t,1,16)*4,A=[0,1,1,1,0],B=[0,0,1,0,0],lab=['A+','B+','B−','A−'];
  for(var k=0;k<=4;k++){D.line(x0+k*cw,110,x0+k*cw,330,C.grid,1);D.text(''+(k+1),x0+k*cw,100,{s:14,a:'center',c:C.mut});}
  [['A',A],['B',B]].forEach(function(r){var y=ys[r[0]],p=[];D.text(r[0],x0-30,y-h/2+6,{s:20,a:'center',c:C.m,bold:true});D.text('1',x0-10,y-h+4,{s:12,c:C.mut,a:'right'});D.text('0',x0-10,y+4,{s:12,c:C.mut,a:'right'});
   for(var k=0;k<4;k++){if(u<k)break;var a=Math.min(1,u-k);p.push([x0+k*cw,y-r[1][k]*h]);p.push([x0+(k+a)*cw,y-lerp(r[1][k],r[1][k+1],a)*h]);}D.path(p,C.m,3);});
  for(var k2=0;k2<4;k2++)if(u>k2)D.text(lab[k2],x0+k2*cw+cw/2,370,{s:18,a:'center',c:C.hl,bold:true});
  U.readout(D,['fase '+Math.min(4,Math.floor(u)+1)+':  '+(['pulsador → A+','a1 → B+','b1 → B−','b0 → A−','fin'][Math.min(4,Math.floor(u))])],440);}));

/* T3 relé con autorretención */
M.reg('ai-t3',M.base({title:'Relé con enclavamiento (autorretención)',H:560,dur:18,caps:[[6,'Al pulsar MARCHA la corriente llega a la bobina K1 y el relé cierra su contacto K1 en paralelo con el pulsador.'],[12,'Aunque se suelte MARCHA, la bobina sigue alimentada a través de su propio contacto: el relé queda enclavado.'],[99,'Solo PARO (normalmente cerrado) rompe el circuito y desenclava el relé. Por seguridad, el paro tiene prioridad.']]},
 function(D,t){var m=t>2&&t<4.5,p=t>12&&t<14,K=(t>2&&t<12),y=200,c=function(on){return on?C.bad:C.ax;};
  D.line(60,120,60,380,C.ax,2);D.line(580,120,580,380,C.ax,2);D.text('+24 V',60,110,{s:14,a:'center',c:C.mut});D.text('0 V',580,110,{s:14,a:'center',c:C.mut});
  D.line(60,y,130,y,c(K),2.6);D.line(130,y,150,y-(p?12:0),c(K),2.6);D.text('PARO',140,y-26,{s:13,a:'center',c:p?C.hl:C.mut});D.line(150,y,200,y,c(K),2.6);
  D.line(200,y,240,y,c(K),2.6);D.line(240,y,265,y-(m?0:14),c(K&&m),2.6);D.line(265,y,320,y,c(K),2.6);D.text('MARCHA',252,y-26,{s:13,a:'center',c:m?C.hl:C.mut});
  D.line(220,y,220,y+90,c(K),2.6);D.line(220,y+90,240,y+90,c(K),2.6);D.line(240,y+90,265,y+90-(K?0:14),c(K),2.6);D.line(265,y+90,300,y+90,c(K),2.6);D.line(300,y+90,300,y,c(K),2.6);D.text('K1',252,y+118,{s:13,a:'center',c:K?C.bad:C.mut});
  D.line(320,y,420,y,c(K),2.6);D.ring(450,y,26,K?C.bad:C.ax,2.6);D.dot(450,y,22,K?RG(C.bad,.25):RG(C.ax,.04));D.text('K1',450,y+6,{s:16,a:'center',c:K?C.bad:C.mut,bold:true});D.line(476,y,580,y,c(K),2.6);
  U.readout(D,[K?(m?'MARCHA pulsado: K1 se activa':'MARCHA suelto: K1 sigue por su contacto'):(p?'PARO: K1 se desactiva':'reposo')],450);}));

/* T4 mando y potencia */
M.reg('ai-t4',M.base({title:'Circuito de mando y circuito de potencia',H:560,dur:16,caps:[[5,'El circuito de mando trabaja a baja tensión (24 V): pulsadores, contactos auxiliares y la bobina del contactor KM1.'],[10,'Al excitarse la bobina, el contactor cierra sus tres contactos principales en el circuito de potencia (400 V trifásica).'],[99,'El relé térmico F2 vigila la corriente del motor: si hay sobrecarga abre su contacto en el mando y el contactor cae.']]},
 function(D,t){var on=(t%8)>2,lc=on?C.bad:C.ax;D.text('MANDO 24 V',150,96,{s:15,a:'center',c:C.f,bold:true});D.text('POTENCIA 400 V',450,96,{s:15,a:'center',c:C.hl,bold:true});D.line(300,90,300,430,C.grid,1.4,[6,5]);
  D.line(150,120,150,200,lc,2.4);D.text('S1',165,165,{s:14,c:C.mut});D.line(150,200,150,250,lc,2.4);D.rect(120,250,60,40,lc,on?RG(C.bad,.2):null,2.4);D.text('KM1',150,276,{s:15,a:'center',c:lc,bold:true});D.line(150,290,150,380,lc,2.4);D.text('F2',165,340,{s:14,c:C.mut});
  [400,450,500].forEach(function(x,i){D.text('L'+(i+1),x,124,{s:14,a:'center',c:C.mut});D.line(x,130,x,220,on?C.hl:C.ax,2.4);D.line(x,220,x-(on?0:10),245,on?C.hl:C.ax,2.4);D.line(x,245,x,330,on?C.hl:C.ax,2.4);});D.text('KM1',530,240,{s:14,c:on?C.hl:C.mut});
  D.ring(450,370,40,on?C.hl:C.ax,2.6);D.text('M 3~',450,376,{s:16,a:'center',c:on?C.hl:C.mut,bold:true});if(on){var a=t*4;D.line(450,370,450+28*Math.cos(a),370+28*Math.sin(a),C.hl,2);}
  D.ctx.save();D.ctx.setLineDash([3,4]);D.line(180,270,385,235,on?C.m:C.grid,1.4);D.ctx.restore();
  U.readout(D,[on?'bobina excitada → contactos de potencia cerrados → motor en marcha':'bobina sin tensión: motor parado'],470);}));

/* T5 arranque estrella-triángulo */
function Id(t){return t<0.1?0:1+5*Math.exp(-(t-0.1)/0.9);}function Iy(t){if(t<0.1)return 0;if(t<3)return 0.4+1.6*Math.exp(-(t-0.1)/0.9);return 1+1.4*Math.exp(-(t-3)/0.25);}
M.reg('ai-t5',M.base({title:'Arranque estrella-triángulo: menos corriente',H:560,dur:16,caps:[[5,'En arranque directo el motor puede pedir 6–8 veces su corriente nominal durante el arranque.'],[10,'Conectado primero en estrella, cada devanado recibe la tensión dividida por √3: la corriente de línea y el par bajan a un tercio.'],[99,'Cuando el motor ya ha cogido velocidad se conmuta a triángulo. Queda un pico menor en la conmutación. El par de arranque también es 1/3: no sirve con mucha carga.']]},
 function(D,t){var x=seg(t,0.5,14)*6,A=U.axes(D,{xr:[0,6],yr:[0,7],xt:[1,2,3,4,5,6],yt:[1,2,4,6],xd:0,yd:0,xl:'t (s)',yl:'I/I_{n}'},{x:80,y:96,w:480,h:300,grid:true});
  U.plotf(D,A,function(s){return s>x?NaN:Id(s);},C.g,2.4);U.plotf(D,A,function(s){return s>x?NaN:Iy(s);},C.m,3);D.line(A.X(3),A.Y(0),A.X(3),A.Y(7),C.hl,1.2,[4,4]);D.text('Y → Δ',A.X(3)+6,A.Y(6.6),{s:15,c:C.hl});
  D.text('directo',A.X(0.6),A.Y(5.6),{s:15,c:C.g});D.text('estrella-triángulo',A.X(0.7),A.Y(2.4),{s:15,c:C.m});
  U.readout(D,['pico directo ≈ 6 I_{n}    pico en estrella ≈ 2 I_{n} (1/3)'],468);}));

/* T6 GRAFCET lineal */
var G6=[['0','reposo','marcha · a0'],['1','A+','a1'],['2','B+','b1'],['3','A− B−','a0 · b0']];
M.reg('ai-t6',M.base({title:'GRAFCET: etapas, transiciones y receptividades',H:600,dur:20,caps:[[6,'Cada etapa (cuadro) tiene asociadas acciones. La etapa activa lleva la marca; la doble línea es la etapa inicial.'],[13,'Una transición se franquea cuando su etapa anterior está activa y su receptividad es verdadera: se activa la siguiente y se desactiva la anterior.'],[99,'Tras la etapa 3, la condición a0·b0 devuelve el sistema a la etapa 0, listo para un nuevo ciclo.']]},
 function(D,t){var k=Math.floor(seg(t,1,19)*4.999)%4,x=170,y0=90,gy=110;
  G6.forEach(function(g,i){var y=y0+i*gy,on=i===k;D.rect(x-30,y,60,50,on?C.m:C.f,on?RG(C.m,.2):null,2.4);if(i===0)D.rect(x-25,y+5,50,40,on?C.m:C.f,null,1.4);D.text(g[0],x,y+32,{s:20,a:'center',c:on?C.m:C.f,bold:true});if(on)D.dot(x,y+42,5,C.m);
   D.line(x+30,y+25,x+70,y+25,C.ax,1.6);D.rect(x+70,y+5,150,40,C.ax,on?RG(C.hl,.2):null,1.6);D.text(g[1],x+145,y+31,{s:17,a:'center',c:on?C.hl:C.w});
   D.line(x,y+50,x,y+gy,C.ax,2);D.line(x-18,y+78,x+18,y+78,C.ax,3);D.text(g[2],x+30,y+84,{s:16,c:(i===k)?C.bad:C.mut,it:true});});
  D.line(x,y0+4*gy,x,y0+4*gy+10,C.ax,2);D.line(x,y0+4*gy+10,x-80,y0+4*gy+10,C.ax,2);D.line(x-80,y0+4*gy+10,x-80,y0-15,C.ax,2);D.line(x-80,y0-15,x,y0-15,C.ax,2);D.arrow(x,y0-15,x,y0,C.ax,2);
  D.text('etapa activa: '+k,470,300,{s:20,a:'center',c:C.m,bold:true});D.text('esperando: '+G6[k][2],470,334,{s:16,a:'center',c:C.bad,it:true});}));

/* T7 divergencia en Y (paralelo) */
M.reg('ai-t7',M.base({title:'Estructuras: secuencias simultáneas',H:580,dur:18,caps:[[6,'Una divergencia en Y (doble línea) activa a la vez varias ramas: las dos secuencias evolucionan en paralelo.'],[12,'Cada rama avanza a su ritmo, según sus propias receptividades.'],[99,'La convergencia en Y solo se franquea cuando todas las ramas han llegado a su última etapa: es una sincronización.']]},
 function(D,t){var u=seg(t,1,17)*6,act={1:u<1,2:u>=1&&u<2.4,3:u>=2.4&&u<4.5,4:u>=1&&u<3.3,5:u>=3.3&&u<4.5,6:u>=4.5};
  var P={1:[320,100],2:[200,210],3:[200,320],4:[440,210],5:[440,320],6:[320,440]};
  D.line(150,165,490,165,C.ax,1.6);D.line(150,171,490,171,C.ax,1.6);D.line(150,385,490,385,C.ax,1.6);D.line(150,391,490,391,C.ax,1.6);D.line(320,150,320,165,C.ax,2);D.line(320,391,320,420,C.ax,2);
  D.line(300,140,340,140,C.ax,3);D.line(300,405,340,405,C.ax,3);
  [2,4].forEach(function(s){D.line(P[s][0],171,P[s][0],P[s][1],C.ax,2);D.line(P[s][0],P[s][1]+50,P[s+1][0],P[s+1][1],C.ax,2);D.line(P[s][0]-16,P[s][1]+80,P[s][0]+16,P[s][1]+80,C.ax,3);D.line(P[s+1][0],P[s+1][1]+50,P[s+1][0],385,C.ax,2);});
  Object.keys(P).forEach(function(s){var p=P[s],on=act[s];D.rect(p[0]-25,p[1],50,44,on?C.m:C.f,on?RG(C.m,.22):null,2.2);D.text(s,p[0],p[1]+29,{s:18,a:'center',c:on?C.m:C.f,bold:true});if(on)D.dot(p[0],p[1]+38,4,C.m);});
  U.readout(D,[act[6]?'las dos ramas terminaron: convergencia franqueada':(act[3]&&!act[5]&&u>3.3?'rama izquierda espera a la derecha':'ramas en paralelo')],520);}));

/* T8 ciclo de scan */
M.reg('ai-t8',M.base({title:'El autómata programable: el ciclo de scan',H:560,dur:16,caps:[[5,'El autómata trabaja en ciclo: lee todas las entradas a una imagen de proceso, ejecuta el programa y después escribe todas las salidas.'],[10,'Si una entrada cambia mientras se ejecuta el programa, no se ve hasta el ciclo siguiente.'],[99,'El tiempo de respuesta en el peor caso es casi dos ciclos de scan. El perro guardián (watchdog) para el autómata si un ciclo dura demasiado.']]},
 function(D,t){var cx=W/2,cy=270,R=140,N=[['Lectura de entradas',C.f],['Ejecución del programa',C.m],['Escritura de salidas',C.hl],['Diagnóstico y comunicaciones',C.mut]],ph=(t*0.5)%4,k=Math.floor(ph);
  D.ring(cx,cy,R,C.grid,10);var a0=-Math.PI/2+k*Math.PI/2,a1=-Math.PI/2+ph*Math.PI/2;D.ctx.save();D.ctx.strokeStyle=N[k][1];D.ctx.lineWidth=10;D.ctx.beginPath();D.ctx.arc(cx,cy,R,a0,a1);D.ctx.stroke();D.ctx.restore();
  N.forEach(function(n,i){var a=-Math.PI/2+(i+0.5)*Math.PI/2,x=cx+(R+30)*Math.cos(a),y=cy+(R+30)*Math.sin(a);D.text(n[0],x,y+5,{s:15,a:Math.cos(a)>0.1?'left':(Math.cos(a)<-0.1?'right':'center'),c:i===k?n[1]:C.mut,bold:i===k});});
  D.text('ciclo de scan',cx,cy-6,{s:18,a:'center',c:C.w});D.text('≈ 1–20 ms',cx,cy+20,{s:15,a:'center',c:C.mut});}));

/* T9 del GRAFCET a contactos */
M.reg('ai-t9',M.base({title:'Del GRAFCET al diagrama de contactos',H:600,dur:20,caps:[[6,'Cada etapa es una marca interna. La etapa 1 se activa con la etapa 0 activa y el pulsador de marcha, y se mantiene por autorretención.'],[13,'Se desactiva cuando se activa la etapa siguiente: el contacto negado X2 abre el circuito. Ecuación: <i>X1 = (X0·marcha + X1)·¬X2</i>.'],[99,'Las acciones van aparte, al final del programa: la bobina A+ se excita mientras X1 está activa.']]},
 function(D,t){var st=t<4?0:(t<11?1:2),m=t>=3&&t<4.5,a1=t>=10&&t<12,X=[st===0,st===1,st===2],cA=function(on){return on?C.bad:C.ax;},gx=80;
  [['0',90],['1',200],['2',310]].forEach(function(s,i){var on=X[i];D.rect(gx-25,s[1],50,44,on?C.m:C.f,on?RG(C.m,.2):null,2.2);D.text(s[0],gx,s[1]+29,{s:18,a:'center',c:on?C.m:C.f,bold:true});if(on)D.dot(gx,s[1]+38,4,C.m);D.line(gx,s[1]+44,gx,s[1]+110,C.ax,1.6);});
  D.line(gx-14,170,gx+14,170,C.ax,3);D.text('marcha',gx+20,175,{s:14,c:m?C.hl:C.mut,it:true});D.line(gx-14,280,gx+14,280,C.ax,3);D.text('a1',gx+20,285,{s:14,c:a1?C.hl:C.mut,it:true});D.text('A+',gx+40,230,{s:15,c:X[1]?C.hl:C.mut});
  var y=160,x0=210,x1=600;D.line(x0,110,x0,360,C.ax,2.4);D.line(x1,110,x1,360,C.ax,2.4);var on1=(X[0]&&m)||X[1];var live=on1&&!X[2];
  function ct(x,y,lab,closed,neg){D.line(x,y-14,x,y+14,closed?C.bad:C.ax,2.4);D.line(x+18,y-14,x+18,y+14,closed?C.bad:C.ax,2.4);if(neg)D.line(x-4,y+14,x+22,y-14,closed?C.bad:C.ax,1.6);D.text(lab,x+9,y-20,{s:13,a:'center',c:closed?C.bad:C.mut});}
  D.line(x0,y,260,y,cA(live),2.4);ct(260,y,'X0',X[0]);D.line(278,y,320,y,cA(live&&X[0]),2.4);ct(320,y,'marcha',m);D.line(338,y,400,y,cA(live),2.4);
  D.line(240,y,240,y+60,cA(X[1]),2.4);D.line(240,y+60,290,y+60,cA(X[1]),2.4);ct(290,y+60,'X1',X[1]);D.line(308,y+60,380,y+60,cA(X[1]),2.4);D.line(380,y+60,380,y,cA(X[1]),2.4);
  ct(410,y,'X2',!X[2],true);D.line(428,y,490,y,cA(live),2.4);D.ring(510,y,18,live?C.bad:C.ax,2.4);D.text('X1',510,y+5,{s:14,a:'center',c:live?C.bad:C.mut,bold:true});D.line(528,y,x1,y,cA(live),2.4);
  var y2=320;D.line(x0,y2,300,y2,cA(X[1]),2.4);ct(300,y2,'X1',X[1]);D.line(318,y2,490,y2,cA(X[1]),2.4);D.ring(510,y2,18,X[1]?C.hl:C.ax,2.4);D.text('A+',510,y2+5,{s:14,a:'center',c:X[1]?C.hl:C.mut,bold:true});D.line(528,y2,x1,y2,cA(X[1]),2.4);
  U.readout(D,['X1 = (X0·marcha + X1)·¬X2',st===0?(m?'marcha pulsada: se activa X1':'etapa 0 activa'):(st===1?'X1 enclavada: A+ excitada':'X2 activa: el contacto negado X2 abre y X1 cae')],440);}));


/* T10 modos de marcha y parada (GEMMA) */
var GM={A1:[110,140,'A1 parada en estado inicial','hl'],F1:[430,140,'F1 producción normal','ok'],A2:[270,140,'A2 parada a fin de ciclo','hl'],D1:[430,330,'D1 parada de emergencia','bad'],A5:[270,330,'A5 preparar la vuelta','hl'],A6:[110,330,'A6 llevar a estado inicial','hl']};
var GP=['A1','F1','A2','A1','F1','D1','A5','A6','A1'],GT=['marcha','parada','fin de ciclo','marcha','¡emergencia!','rearme','defecto eliminado','posición inicial'];
M.reg('ai-t10',M.base({title:'Modos de marcha y parada: la guía GEMMA',H:580,dur:20,caps:[[7,'GEMMA ordena los estados de una máquina en tres familias: funcionamiento (F), parada (A) y defecto (D).'],[13,'Ciclo normal: desde A1 se pasa a producción F1; al pedir la parada, la máquina termina el ciclo (A2) antes de volver a A1.'],[99,'Con la seta de emergencia se salta a D1 desde cualquier estado. Para volver hay que rearmar, preparar la máquina (A5, A6) y llegar al estado inicial.']]},
 function(D,t){var u=seg(t,0.5,19)*(GP.length-1),k=Math.min(GP.length-2,Math.floor(u)),f=u-k;
  D.rect(40,90,560,130,C.ok,RG(C.ok,.04),1.2);D.text('F · funcionamiento    A · parada',50,108,{s:13,c:C.mut});D.rect(40,280,560,130,C.bad,RG(C.bad,.04),1.2);D.text('D · defecto / A · vuelta al servicio',50,298,{s:13,c:C.mut});
  Object.keys(GM).forEach(function(k2){var g=GM[k2].slice(),on=GP[k]===k2&&f<0.5||GP[k+1]===k2&&f>=0.5;g[3]=C[g[3]];D.rect(g[0]-70,g[1]-26,140,52,g[3],RG(g[3],on?.3:.06),on?3:1.4);D.text(k2,g[0],g[1]-2,{s:18,a:'center',c:g[3],bold:true});D.text(g[2].slice(3),g[0],g[1]+16,{s:11,a:'center',c:C.mut});});
  for(var i=0;i<GP.length-1;i++){var a=GM[GP[i]],b=GM[GP[i+1]];var done=i<k||(i===k&&f>0.2);D.arrow(lerp(a[0],b[0],0.25),lerp(a[1],b[1],0.25)+(a[1]===b[1]?(b[0]>a[0]?-30:30):0),lerp(a[0],b[0],0.75),lerp(a[1],b[1],0.75)+(a[1]===b[1]?(b[0]>a[0]?-30:30):0),done?C.m:C.grid,done?2.4:1.2);}
  U.readout(D,[GP[k]+' → '+GP[k+1]+':  '+GT[k]],480);}));

})();
