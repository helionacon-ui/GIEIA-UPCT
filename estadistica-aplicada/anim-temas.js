/* Estadística Aplicada: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function gauss(r){var u=r()||1e-9,v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function phi(x){return Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);}

/* T1 histograma, media y mediana */
var R1=rng(7),DAT=[];for(var i=0;i<120;i++){DAT.push(Math.min(9.9,-Math.log(1-R1())*2.2));}
M.reg('est-t1',M.base({title:'Estadística descriptiva: histograma, media y mediana',H:540,dur:18,caps:[[6,'Vamos añadiendo datos (tiempos de espera en minutos) y el histograma se va formando: cuántos caen en cada intervalo.'],[12,'La distribución es asimétrica a la derecha: unos pocos valores grandes tiran de la <b>media</b> hacia arriba.'],[99,'La <b>mediana</b> deja la mitad de los datos a cada lado y no se deja arrastrar por los extremos: aquí es menor que la media.']]},
 function(D,t){var n=Math.max(1,Math.round(lerp(1,120,ease(seg(t,1,14))))),d=DAT.slice(0,n),bins=new Array(10).fill(0);d.forEach(function(v){bins[Math.floor(v)]++;});
  var A=U.axes(D,{xr:[0,10],yr:[0,40],xt:[2,4,6,8,10],yt:[10,20,30,40],xd:0,yd:0,xl:'min',yl:'frecuencia'},{x:80,y:96,w:480,h:300,grid:true});
  bins.forEach(function(b,k){D.rect(A.X(k)+2,A.Y(b),A.X(k+1)-A.X(k)-4,A.Y(0)-A.Y(b),C.m,RG(C.m,.3),1.6);});
  var mean=d.reduce(function(a,b){return a+b;},0)/n,s=d.slice().sort(function(a,b){return a-b;}),med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
  D.line(A.X(mean),A.Y(0),A.X(mean),A.Y(38),C.g,2.6);D.text('media',A.X(mean)+4,A.Y(36),{s:14,c:C.g});D.line(A.X(med),A.Y(0),A.X(med),A.Y(38),C.f,2.6,[6,4]);D.text('mediana',A.X(med)-4,A.Y(30),{s:14,c:C.f,a:'right'});
  D.text('n = '+n+'    x̄ = '+nf(mean,2)+'    Me = '+nf(med,2),W/2,470,{it:true,s:22,a:'center',c:C.m});}));

/* T2 ley de los grandes números */
var R2=rng(11),FL=[];for(var j=0;j<600;j++)FL.push(R2()<0.5?1:0);var CUM=[];FL.reduce(function(a,b,i){CUM.push((a+b)/(i+1));return a+b;},0);
M.reg('est-t2',M.base({title:'Probabilidad: la ley de los grandes números',H:540,dur:18,caps:[[6,'Lanzamos una moneda y anotamos la frecuencia relativa de caras. Al principio salta mucho: con pocas tiradas cualquier cosa es posible.'],[12,'Según crece el número de tiradas, la frecuencia relativa se estabiliza alrededor de 0,5.'],[99,'Esa es la idea frecuentista de probabilidad: el límite de la frecuencia relativa cuando el experimento se repite muchas veces.']]},
 function(D,t){var n=Math.max(2,Math.round(600*Math.pow(ease(seg(t,1,15)),1.6))),A=U.axes(D,{xr:[0,600],yr:[0,1],xt:[100,200,300,400,500,600],yt:[0.25,0.5,0.75,1],xd:0,yd:2,xl:'tiradas',yl:'f(cara)'},{x:80,y:96,w:480,h:300,grid:true});
  D.line(A.X(0),A.Y(0.5),A.X(600),A.Y(0.5),C.hl,1.6,[6,4]);var p=[];for(var i=0;i<n;i++)p.push([A.X(i+1),A.Y(CUM[i])]);D.path(p,C.m,2.4);D.dot(A.X(n),A.Y(CUM[n-1]),5,C.m);
  D.text('n = '+n+'    caras = '+Math.round(CUM[n-1]*n)+'    f = '+nf(CUM[n-1],3),W/2,470,{it:true,s:22,a:'center',c:C.m});}));

/* T3 binomial → normal */
function binom(n,p){var r=[],q=1-p,c=Math.pow(q,n);for(var k=0;k<=n;k++){r.push(c);c=c*(n-k)/(k+1)*p/q;}return r;}
M.reg('est-t3',M.base({title:'De la binomial a la normal',H:540,dur:18,caps:[[6,'X ~ B(n, p = 0,3): número de éxitos en n pruebas. Con n pequeño la distribución es claramente asimétrica.'],[12,'Al aumentar n la forma se parece cada vez más a una campana: la normal de media <i>np</i> y desviación <i>√(npq)</i> (curva).'],[99,'Regla práctica: si <i>np ≥ 5</i> y <i>nq ≥ 5</i> se puede aproximar la binomial por la normal (con corrección por continuidad).']]},
 function(D,t){var n=Math.round(lerp(4,60,U.pp(t,18))),p=0.3,b=binom(n,p),mu=n*p,sd=Math.sqrt(n*p*0.7),mx=Math.max.apply(null,b);
  var A=U.axes(D,{xr:[-0.5,Math.max(10,mu+4*sd)],yr:[0,mx*1.2],xt:[],yt:[],xl:'k',yl:'P(X = k)'},{x:80,y:96,w:480,h:300,grid:true});
  var bw=Math.max(2,(A.X(1)-A.X(0))*0.8);b.forEach(function(v,k){if(k>mu+4.5*sd)return;D.rect(A.X(k)-bw/2,A.Y(v),bw,A.Y(0)-A.Y(v),C.m,RG(C.m,.3),1.2);});
  U.plotf(D,A,function(x){return phi((x-mu)/sd)/sd;},C.hl,2.6);
  D.text('n = '+n+'    np = '+nf(mu,1)+'    √(npq) = '+nf(sd,2),W/2,470,{it:true,s:22,a:'center',c:C.m});D.text(n*p>=5&&n*0.7>=5?'np ≥ 5 y nq ≥ 5: buena aproximación normal':'todavía asimétrica',W/2,504,{s:18,a:'center',c:n*p>=5?C.ok:C.mut});}));

/* T4 correlación */
var R4=rng(21),PT=[];for(var k=0;k<70;k++)PT.push([gauss(R4),gauss(R4)]);
M.reg('est-t4',M.base({title:'Variables bidimensionales: el coeficiente de correlación',H:540,dur:20,caps:[[7,'Nube de puntos de dos variables X e Y. Con ρ = −0,9 la relación lineal es fuerte y negativa: cuando X sube, Y baja.'],[13,'Con ρ ≈ 0 no hay relación lineal: la nube es redonda.'],[99,'Con ρ = 0,9 la relación es fuerte y positiva. ρ mide solo la relación <b>lineal</b>: ρ = 0 no implica independencia (salvo en la normal).']]},
 function(D,t){var r=lerp(-0.9,0.9,ease(seg(t,1,17))),A=U.axes(D,{xr:[-3,3],yr:[-3,3],xt:[-2,2],yt:[-2,2],xd:0,yd:0,xl:'X',yl:'Y'},{x:150,y:96,w:330,h:330,grid:true});
  PT.forEach(function(p){var y=r*p[0]+Math.sqrt(1-r*r)*p[1];D.dot(A.X(p[0]),A.Y(clamp(y,-3,3)),4.5,C.m,0.8);});
  U.clipA(D,A,function(){D.line(A.X(-3),A.Y(-3*r),A.X(3),A.Y(3*r),C.hl,2.2);});
  D.text('ρ = '+nf(r,2),W/2,480,{it:true,s:26,a:'center',c:C.m,bold:true});}));

/* T5 teorema central del límite */
var R5=rng(5),MEANS={};[1,2,5,30].forEach(function(n){var a=[];for(var i=0;i<3000;i++){var s=0;for(var j=0;j<n;j++)s+=R5();a.push(s/n);}MEANS[n]=a;});
M.reg('est-t5',M.base({title:'Teorema central del límite',H:540,dur:20,caps:[[5,'Población uniforme entre 0 y 1 (n = 1): el histograma es plano.'],[12,'Tomamos muestras de tamaño n y calculamos su media muchas veces. Con n = 2 la distribución de la media ya es triangular; con n = 5, acampanada.'],[99,'Con n = 30 es prácticamente normal y mucho más estrecha: la media muestral tiene desviación <i>σ/√n</i>. Funciona sea cual sea la población.']]},
 function(D,t){var ns=[1,2,5,30],n=ns[Math.min(3,Math.floor(t/5))],a=MEANS[n],bins=new Array(40).fill(0);a.forEach(function(v){bins[Math.min(39,Math.floor(v*40))]++;});
  var A=U.axes(D,{xr:[0,1],yr:[0,8],xt:[0.25,0.5,0.75,1],yt:[2,4,6,8],xd:2,yd:0,xl:'x̄',yl:'densidad'},{x:80,y:96,w:480,h:300,grid:true});
  bins.forEach(function(b,k){var d=b/3000*40;D.rect(A.X(k/40)+1,A.Y(Math.min(8,d)),A.X(1/40)-A.X(0)-2,A.Y(0)-A.Y(Math.min(8,d)),C.m,RG(C.m,.3),1);});
  var sd=Math.sqrt(1/12/n);if(n>1)U.plotf(D,A,function(x){return phi((x-0.5)/sd)/sd;},C.hl,2.6);
  D.text('n = '+n+'    σ_{x̄} = σ/√n = '+nf(sd,3),W/2,470,{it:true,s:22,a:'center',c:C.m});}));

/* T6 intervalos de confianza */
var R6=rng(4),IC=[];for(var q=0;q<20;q++){var m=0;for(var z=0;z<25;z++)m+=gauss(R6)*2+10;m/=25;IC.push(m);}
M.reg('est-t6',M.base({title:'Intervalos de confianza al 95 %',H:560,dur:20,caps:[[7,'Cada muestra (n = 25) da una media distinta y, con ella, un intervalo <i>x̄ ± 1,96·σ/√n</i>.'],[14,'La media poblacional μ = 10 (línea) es fija; lo que varía de una muestra a otra es el intervalo.'],[99,'«95 % de confianza» significa que el 95 % de los intervalos construidos así contienen μ. Un intervalo concreto la contiene o no: no es una probabilidad sobre μ.']]},
 function(D,t){var k=Math.min(20,Math.floor(seg(t,1,17)*21)),A=U.axes(D,{xr:[8.6,11.4],yr:[0,21],xt:[9,10,11],yt:[],xd:0,xl:'μ',yl:''},{x:80,y:96,w:480,h:330,noY:true});
  D.line(A.X(10),A.Y(0),A.X(10),A.Y(21),C.hl,2,[6,4]);var e=1.96*2/5,inside=0;
  for(var i=0;i<k;i++){var m=IC[i],ok=Math.abs(m-10)<=e;if(ok)inside++;D.line(A.X(m-e),A.Y(i+1),A.X(m+e),A.Y(i+1),ok?C.m:C.bad,3);D.dot(A.X(m),A.Y(i+1),4,ok?C.m:C.bad);}
  D.text(k+' intervalos:  '+inside+' contienen μ ('+(k?nf(100*inside/k,0):'–')+' %)',W/2,490,{s:21,a:'center',c:C.m,bold:true});D.text('σ = 2,  n = 25:  semiamplitud = 1,96·2/5 = 0,78',W/2,524,{s:17,a:'center'});}));

/* T7 contraste de hipótesis */
M.reg('est-t7',M.base({title:'Contraste bilateral: región crítica y p-valor',H:540,dur:18,caps:[[6,'Bajo H₀ el estadístico Z sigue una N(0, 1). Con α = 0,05 la región crítica son las dos colas más allá de ±1,96.'],[12,'Calculamos Z con la muestra. Si cae en la zona central, no hay evidencia para rechazar H₀.'],[99,'Si cae en una cola (o, equivalente, el p-valor es menor que α) se rechaza H₀. El p-valor es el área más extrema que el valor observado.']]},
 function(D,t){var z=lerp(-0.5,2.9,ease(seg(t,1,15))),A=U.axes(D,{xr:[-4,4],yr:[0,0.45],xt:[-1.96,0,1.96],yt:[],xd:2,xl:'z',yl:''},{x:80,y:96,w:480,h:300,noY:true});
  [[-4,-1.96],[1.96,4]].forEach(function(r){var p=[[A.X(r[0]),A.Y(0)]];for(var x=r[0];x<=r[1];x+=0.02)p.push([A.X(x),A.Y(phi(x))]);p.push([A.X(r[1]),A.Y(0)]);D.path(p,null,0,RG(C.bad,.3));});
  var az=Math.abs(z),pr=[[A.X(az),A.Y(0)]];for(var x=az;x<=4;x+=0.02)pr.push([A.X(x),A.Y(phi(x))]);pr.push([A.X(4),A.Y(0)]);D.path(pr,null,0,RG(C.hl,.45));
  U.plotf(D,A,phi,C.m,2.8);D.line(A.X(z),A.Y(0),A.X(z),A.Y(0.42),C.f,2.6);D.text('z = '+nf(z,2),A.X(z),A.Y(0.43),{s:16,a:'center',c:C.f});
  var t1=1/(1+0.2316419*az),pv=2*phi(az)*t1*(0.31938153+t1*(-0.356563782+t1*(1.781477937+t1*(-1.821255978+t1*1.330274429))));
  D.text('p-valor = '+nf(pv,4)+'   '+(pv<0.05?'< 0,05 → se rechaza H₀':'≥ 0,05 → no se rechaza H₀'),W/2,470,{s:21,a:'center',c:pv<0.05?C.bad:C.ok,bold:true});}));

/* T8 recta de mínimos cuadrados */
var R8=rng(9),XY=[];for(var w=0;w<14;w++){var x=0.5+w*0.65;XY.push([x,1.2+0.55*x+gauss(R8)*0.6]);}
var mx=XY.reduce(function(a,p){return a+p[0];},0)/14,my=XY.reduce(function(a,p){return a+p[1];},0)/14,sxy=0,sxx=0;XY.forEach(function(p){sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)*(p[0]-mx);});var bb=sxy/sxx,aa=my-bb*mx;
M.reg('est-t8',M.base({title:'Regresión lineal: mínimos cuadrados',H:560,dur:18,caps:[[6,'Buscamos la recta <i>y = a + bx</i> que mejor se ajusta a los puntos. Cada residuo es la distancia vertical del punto a la recta.'],[12,'Al girar la recta, la suma de los cuadrados de los residuos (los cuadrados sombreados) cambia. La mejor recta la hace mínima.'],[99,'Solución: <i>b = S<sub>xy</sub>/S<sub>xx</sub></i> y <i>a = ȳ − b·x̄</i>. La recta pasa siempre por el punto medio (x̄, ȳ).']]},
 function(D,t){var u=ease(seg(t,1,14)),b=lerp(-0.2,bb,u)+0.25*Math.sin(t*1.3)*(1-u),a=my-b*mx,A=U.axes(D,{xr:[0,10],yr:[0,8],xt:[2,4,6,8,10],yt:[2,4,6,8],xd:0,yd:0,xl:'x',yl:'y'},{x:80,y:96,w:480,h:320,grid:true}),S=0;
  XY.forEach(function(p){var yh=a+b*p[0],r=p[1]-yh;S+=r*r;var h=A.Y(yh)-A.Y(p[1]);D.rect(A.X(p[0]),Math.min(A.Y(p[1]),A.Y(yh)),Math.abs(h),Math.abs(h),null,RG(C.hl,.2));D.line(A.X(p[0]),A.Y(p[1]),A.X(p[0]),A.Y(yh),C.hl,1.4);D.dot(A.X(p[0]),A.Y(p[1]),5,C.m);});
  U.clipA(D,A,function(){D.line(A.X(0),A.Y(a),A.X(10),A.Y(a+10*b),C.f,2.8);});D.dot(A.X(mx),A.Y(my),6,C.g);
  D.text('y = '+nf(a,2)+' + '+nf(b,3)+'·x       SCE = Σ residuo² = '+nf(S,2),W/2,480,{it:true,s:21,a:'center',c:C.m});D.text(u>0.99?'mínimo: b = S_{xy}/S_{xx} = '+nf(bb,3):'buscando el mínimo…',W/2,516,{s:18,a:'center',c:u>0.99?C.ok:C.mut});}));
})();
