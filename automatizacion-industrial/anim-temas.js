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
M.reg('ai-t9',M.pasos({title:'Del GRAFCET al diagrama de contactos',H:580,dur:20,y0:110,gap:48,lines:[
 {s:'Cada etapa es una marca: X0, X1, X2…',size:19},
 {s:'Activación de X1:  X0 · marcha',size:19},
 {s:'Desactivación de X1:  X2 (la etapa siguiente)',size:19},
 {s:'X1 = (X0 · marcha + X1) · ¬X2',size:21,b:true,c:'m'},
 {s:'En contactos: rama de activación ∥ contacto de autorretención X1, en serie con X2 negado',size:16},
 {s:'Acciones al final: A+ = X1    (una bobina por salida)',size:19,c:'hl'},
 {s:'Arranque: X0 se activa con el bit de primer ciclo',size:17}]}));

/* T10 modos de marcha y parada (GEMMA) */
M.reg('ai-t10',M.pasos({title:'Modos de marcha y parada: la guía GEMMA',H:580,dur:20,y0:110,gap:52,lines:[
 {s:'F · Procedimientos de funcionamiento',size:19,b:true,c:'ok'},
 {s:'   F1 producción normal,  F4/F5 marchas de verificación',size:17,a:'left',x:70},
 {s:'A · Procedimientos de parada',size:19,b:true,c:'hl'},
 {s:'   A1 parada en estado inicial,  A2 parada a fin de ciclo',size:17,a:'left',x:70},
 {s:'D · Procedimientos en defecto',size:19,b:true,c:'bad'},
 {s:'   D1 parada de emergencia,  D2 diagnóstico,  D3 producción degradada',size:17,a:'left',x:70},
 {s:'La seta de emergencia actúa por cableado, no solo por programa',size:17,c:'m'}]}));
})();
