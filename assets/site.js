/* Vanilla JS, no network. The page is readable without it. */
(function(){
  var d=document,de=d.documentElement;
  de.classList.remove('nojs');
  var $=function(s,r){return (r||d).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s))};

  /* table labels for phones */
  $$('table').forEach(function(t){var h=$$('th',t).map(function(x){return x.textContent});$$('tbody tr',t).forEach(function(r){$$('td',r).forEach(function(td,i){if(h[i])td.setAttribute('data-label',h[i])})})});
  /* menu */
  var mb=$('#menubtn'),menu=$('#menu');
  function setMenu(o){menu.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);d.body.style.overflow=o?'hidden':''}
  mb.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
  $$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){setMenu(false);mb.focus()}});

  /* progress line, back to top */
  var cl=$('.cutline'),btt=$('.btt');
  function onScroll(){
    var h=de.scrollHeight-de.clientHeight;
    cl.style.width=(h>0?de.scrollTop/h*100:0)+'%';
    btt.classList.toggle('show',de.scrollTop>900);
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  btt.addEventListener('click',function(){scrollTo({top:0})});

  /* reveal + bars */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
    $$('.reveal,.bar-row').forEach(function(n){io.observe(n)});
  }else{$$('.reveal,.bar-row').forEach(function(n){n.classList.add('in')})}

  /* timeline filters */
  var tl=$('#tl');
  if(tl){
    var st={day:'all',type:'all'};
    function applyTl(){
      var items=$$('li[data-day]',tl);
      items.forEach(function(li){
        var ok=(st.day==='all'||li.dataset.day===st.day)&&(st.type==='all'||li.dataset.type===st.type);
        if(li.classList.contains('day'))ok=(st.day==='all'||li.dataset.day===st.day);
        li.hidden=!ok;
      });
      var n=items.filter(function(l){return !l.hidden&&!l.classList.contains('day')}).length;
      $('#tlcount').textContent=n+' entries shown';
    }
    $$('.filters button').forEach(function(b){
      b.addEventListener('click',function(){
        var g=b.dataset.g;st[g]=b.dataset.v;
        $$('.filters button[data-g="'+g+'"]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
        applyTl();
      });
    });
    applyTl();
  }

  /* compare sliders */
  $$('.cmp').forEach(function(c){
    var stage=$('.cmp-stage',c),r=$('input[type=range]',c);
    function set(v){stage.style.setProperty('--pos',v+'%')}
    r.addEventListener('input',function(){set(r.value)});
    var drag=false;
    function pt(e){var b=stage.getBoundingClientRect();var v=Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100));r.value=v;set(v)}
    stage.addEventListener('pointerdown',function(e){drag=true;stage.setPointerCapture(e.pointerId);pt(e)});
    stage.addEventListener('pointermove',function(e){if(drag)pt(e)});
    stage.addEventListener('pointerup',function(){drag=false});
    $$('.modes button',c).forEach(function(b){b.addEventListener('click',function(){
      c.classList.toggle('side',b.dataset.m==='side');
      $$('.modes button',c).forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    })});
  });

  /* diagram */
  var note=$('#diagnote');
  $$('.nd').forEach(function(g){
    function show(){$$('.nd').forEach(function(x){x.classList.remove('on')});g.classList.add('on');note.innerHTML=g.dataset.info}
    g.addEventListener('click',show);g.addEventListener('focus',show);g.addEventListener('mouseenter',show);
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show()}});
  });

  /* gallery dialog */
  var dg=$('#dlg');
  if(dg&&dg.showModal){
    $$('.gal button').forEach(function(b){b.addEventListener('click',function(){
      var im=$('img',b);$('img',dg).src=im.src;$('img',dg).alt=im.alt;$('p',dg).innerHTML=$('.cap',b).innerHTML;dg.showModal();
    })});
    dg.addEventListener('click',function(e){if(e.target===dg)dg.close()});
  }

  /* scrollspy */
  var links=$$('.bar nav a[data-sec]');
  if('IntersectionObserver' in window&&links.length){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('cur',a.dataset.sec===e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    $$('section[id]').forEach(function(s){so.observe(s)});
  }
})();
