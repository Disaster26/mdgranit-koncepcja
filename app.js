(function(){
  var d=document,top=d.getElementById('top'),bur=d.getElementById('burger');
  bur.addEventListener('click',function(){var o=top.classList.toggle('otw');bur.setAttribute('aria-expanded',o);bur.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');});
  d.querySelectorAll('#nav a').forEach(function(a){a.addEventListener('click',function(){top.classList.remove('otw');bur.setAttribute('aria-expanded','false');});});

  // pasek mobilny dopiero po minieciu przycisku w hero
  var mob=d.getElementById('mob'),cta=d.getElementById('hero-cta');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){var r=e[0].boundingClientRect;mob.classList.toggle('widac',!e[0].isIntersecting&&r.top<0);}).observe(cta);
    var mapka=d.getElementById('mapka');
    var mo=new IntersectionObserver(function(e){if(e[0].isIntersecting){var f=d.createElement('iframe');f.src=mapka.getAttribute('data-src');f.title='Mapa: ul. Brzezińska 107, Łódź';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';mapka.appendChild(f);mo.disconnect();}},{rootMargin:'300px'});
    mo.observe(mapka);
  }

  // wybor wyrobu z kart
  var sel=d.getElementById('f-wyrob');
  d.querySelectorAll('[data-wyrob]').forEach(function(a){a.addEventListener('click',function(){sel.value=a.getAttribute('data-wyrob');});});

  // pas zdjec: przeciaganie mysza, strzalki, licznik
  var pas=d.getElementById('pas'),items=pas.children,n=items.length,wst=d.getElementById('wstecz'),dal=d.getElementById('dalej'),licz=d.getElementById('licz');
  function krok(){return items[0].getBoundingClientRect().width+parseFloat(getComputedStyle(pas).columnGap||14);}
  function stan(){var i=Math.round(pas.scrollLeft/krok());var max=pas.scrollWidth-pas.clientWidth-2;wst.disabled=pas.scrollLeft<2;dal.disabled=pas.scrollLeft>=max;licz.textContent=Math.min(i+1,n)+' / '+n;}
  wst.addEventListener('click',function(){pas.scrollBy({left:-krok(),behavior:'smooth'});});
  dal.addEventListener('click',function(){pas.scrollBy({left:krok(),behavior:'smooth'});});
  pas.addEventListener('scroll',function(){requestAnimationFrame(stan);},{passive:true});
  var dn=false,sx=0,sl=0,ruch=0;
  pas.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dn=true;ruch=0;sx=e.clientX;sl=pas.scrollLeft;});
  window.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-sx;ruch=Math.max(ruch,Math.abs(dx));if(ruch>4){pas.classList.add('ciag');pas.scrollLeft=sl-dx;}});
  window.addEventListener('pointerup',function(){if(!dn)return;dn=false;if(pas.classList.contains('ciag')){pas.classList.remove('ciag');var i=Math.round(pas.scrollLeft/krok());pas.scrollTo({left:i*krok(),behavior:'smooth'});}});

  // lightbox
  var lb=d.getElementById('lb'),li=d.getElementById('lb-img'),ll=d.getElementById('lb-l'),cur=0,ost=null;
  function pokaz(i){cur=(i+n)%n;var b=items[cur];li.src=b.getAttribute('data-big');li.alt=b.querySelector('img').alt;ll.textContent=(cur+1)+' / '+n+'  '+li.alt;}
  function otworz(i){ost=d.activeElement;pokaz(i);lb.classList.add('on');d.body.style.overflow='hidden';d.getElementById('lb-x').focus();}
  function zamknij(){lb.classList.remove('on');d.body.style.overflow='';if(ost)ost.focus();}
  Array.prototype.forEach.call(items,function(b,i){b.addEventListener('click',function(e){if(ruch>4){e.preventDefault();return;}otworz(i);});});
  d.getElementById('lb-x').addEventListener('click',zamknij);
  d.getElementById('lb-p').addEventListener('click',function(){pokaz(cur-1);});
  d.getElementById('lb-n').addEventListener('click',function(){pokaz(cur+1);});
  lb.addEventListener('click',function(e){if(e.target===lb)zamknij();});
  d.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')zamknij();if(e.key==='ArrowLeft')pokaz(cur-1);if(e.key==='ArrowRight')pokaz(cur+1);});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)pokaz(cur+(dx<0?1:-1));});

  // formularz pokazowy
  var plik=d.getElementById('plik'),inp=d.getElementById('f-plik'),lista=d.getElementById('lista');
  inp.addEventListener('change',function(){lista.textContent=Array.prototype.map.call(inp.files,function(f){return f.name;}).join(', ');});
  ['dragenter','dragover'].forEach(function(t){plik.addEventListener(t,function(){plik.classList.add('nad');});});
  ['dragleave','drop'].forEach(function(t){plik.addEventListener(t,function(){plik.classList.remove('nad');});});
  d.getElementById('zap').addEventListener('submit',function(e){e.preventDefault();var i=d.getElementById('info');i.classList.add('on');i.scrollIntoView({block:'nearest',behavior:'smooth'});});
})();
