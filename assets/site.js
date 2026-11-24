(function(){
  var d=document;
  function $(s,c){return (c||d).querySelector(s)}
  function $$(s,c){return [].slice.call((c||d).querySelectorAll(s))}

  /* menu */
  var hb=$('.hamb'),mn=$('.menu');
  if(hb){hb.addEventListener('click',function(){var tp=hb.closest('.topo');mn.style.top=tp.offsetHeight+'px';mn.style.maxHeight='calc(100vh - '+tp.getBoundingClientRect().bottom+'px)';var a=mn.classList.toggle('aberto');hb.classList.toggle('aberto-x',a);hb.setAttribute('aria-expanded',a)});
    $$('.menu a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('aberto');hb.classList.remove('aberto-x')})});}

  /* avenida desenha-se ao entrar no ecra */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target)}})},{threshold:.3});
    $$('.avenida').forEach(function(el){io.observe(el)});
  }else{$$('.avenida').forEach(function(el){el.classList.add('visto')})}

  /* video so carrega depois do clique */
  $$('.filme button').forEach(function(b){b.addEventListener('click',function(){
    var f=b.parentNode,i=d.createElement('iframe');
    i.src='https://www.youtube-nocookie.com/embed/'+f.getAttribute('data-yt')+'?autoplay=1&rel=0';
    i.allow='autoplay; encrypted-media; picture-in-picture';i.allowFullscreen=true;i.title='Vídeo da Casa de Repouso Jardim da Maria Alice';
    f.innerHTML='';f.appendChild(i);
  })});

  /* mapa so carrega depois do clique */
  $$('.mapa button').forEach(function(b){b.addEventListener('click',function(){
    var m=b.closest('.mapa'),i=d.createElement('iframe');
    i.src='https://www.google.com/maps?q='+encodeURIComponent(m.getAttribute('data-q'))+'&output=embed';i.loading='lazy';i.title='Mapa';
    m.innerHTML='';m.classList.add('on');m.appendChild(i);
  })});

  /* visor de fotos */
  var v=$('.visor'),lista=[],at=0;
  function mostra(n){at=(n+lista.length)%lista.length;var b=lista[at];$('img',v).src=b.getAttribute('data-g');$('img',v).alt=$('img',b).alt;$('p',v).textContent=$('img',b).alt}
  if(v){
    d.addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(!b)return;
      var grupo=b.closest('[data-pagina]')||d;lista=$$('[data-g]',grupo);v.classList.add('on');mostra(lista.indexOf(b))});
    $('.x',v).onclick=function(){v.classList.remove('on')};
    $('.a',v).onclick=function(){mostra(at-1)};$('.p',v).onclick=function(){mostra(at+1)};
    v.addEventListener('click',function(e){if(e.target===v)v.classList.remove('on')});
    d.addEventListener('keydown',function(e){if(!v.classList.contains('on'))return;if(e.key==='Escape')v.classList.remove('on');if(e.key==='ArrowLeft')mostra(at-1);if(e.key==='ArrowRight')mostra(at+1)});
    var x0=null;v.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    v.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)mostra(at+(dx<0?1:-1));x0=null});
  }

  /* formularios: Netlify Forms; se falhar, abre o email */
  $$('form.f').forEach(function(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(f),corpo=[];fd.forEach(function(val,k){if(k!=='form-name'&&k!=='bot-field'&&typeof val==='string'&&val)corpo.push(k+': '+val)});
    function email(){location.href='mailto:'+f.getAttribute('data-email')+'?subject='+encodeURIComponent(f.getAttribute('data-assunto'))+'&body='+encodeURIComponent(corpo.join('\n'))}
    if(location.protocol==='file:'||window.PREVIA){f.classList.add('enviado');return}
    fetch('/',{method:'POST',body:fd}).then(function(r){if(r.ok)f.classList.add('enviado');else email()}).catch(email);
  })});

  /* previa num ficheiro so: navegacao por hash */
  if(window.PREVIA){
    var pags=$$('[data-pagina]');
    function vai(){var h=(location.hash||'#inicio').slice(1),p=h.split('--')[0],ok=false;
      pags.forEach(function(s){var on=s.getAttribute('data-pagina')===p;s.classList.toggle('on',on);if(on)ok=true});
      if(!ok)pags[0].classList.add('on');
      $$('.menu a').forEach(function(a){if(a.getAttribute('href')==='#'+p)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
      var alvo=h.indexOf('--')>0&&d.getElementById(h.split('--')[1]);
      if(alvo)alvo.scrollIntoView();else window.scrollTo(0,0)}
    window.addEventListener('hashchange',vai);vai();
  }
})();
