'use strict';
const ICONS={arrow:'<path d="M7 17 17 7M7 7h10v10"/>',left:'<path d="m12 19-7-7 7-7M5 12h14"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
function icon(n){return '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">'+ICONS[n]+'</svg>'}

const PRODUCTS={
 peel:{code:'PEEL 01',category:'FOR SKIN / 贴肤香氛',title:'植物香氛油',size:'15 mL',price:65,image:'assets/peel.webp',story:'柚子果皮的清苦芳香，收于一支随身的滚珠香氛油。贴近皮肤，缓慢展开。',usage:'以滚珠轻触腕部、耳后等脉搏点。仅供外用。',notes:'柚子果皮 · 青绿叶枝感 · 浅色干燥木质',detail:'修长瓶身与滚珠开口，围绕随身携带、定点涂抹与克制的香气扩散展开。',other:'pulp'},
 pulp:{code:'PULP 01',category:'FOR DRINKS / 定量调饮',title:'植物饮用浓缩液',size:'250 mL · 约 10 次调饮',price:30,image:'assets/pulp.webp',story:'柚子果肉的清亮风味，与香茅、姜的轻微辛香，组成一杯低甜度的日常调饮。',usage:'量取 25 mL，兑入 150–200 mL 冷水或气泡水。',notes:'柚子 · 香茅 · 姜',detail:'量杯盖让 25 mL 的单次用量可见，也让调饮动作从说明文字转化为直观的使用仪式。',other:'peel'}
};
const main=document.querySelector('#main'),dialog=document.querySelector('#bag-dialog'),bagContent=document.querySelector('#bag-content'),toast=document.querySelector('#toast');
let selectedQuantity=1;let currentProduct=null;let toastTimer;let lastOpener=null;let bag={};
try{const stored=JSON.parse(localStorage.getItem('immanent.brand.bag.v1')||'{}');for(const id of Object.keys(PRODUCTS)){const q=Number(stored&&stored[id]);if(Number.isFinite(q)&&q>0)bag[id]=Math.min(9,Math.floor(q))}}catch(_){}
function saveBag(){try{localStorage.setItem('immanent.brand.bag.v1',JSON.stringify(bag))}catch(_){}updateCount()}
function count(){return Object.entries(bag).reduce((n,[id,q])=>n+(PRODUCTS[id]?Math.max(0,Number(q)||0):0),0)}
function subtotal(){return Object.entries(bag).reduce((n,[id,q])=>n+(PRODUCTS[id]?PRODUCTS[id].price*q:0),0)}
function money(v){return '£'+v}
function updateCount(){document.querySelectorAll('[data-bag-count],[data-dialog-count]').forEach(el=>el.textContent=count());document.querySelector('[data-bag]').setAttribute('aria-label','打开购物袋，'+count()+'件商品')}
function route(id,push=true){currentProduct=PRODUCTS[id]?id:null;selectedQuantity=1;if(push){const u=new URL(location.href);if(currentProduct)u.searchParams.set('product',currentProduct);else u.searchParams.delete('product');u.hash='';history.pushState({},'',u)}render();window.scrollTo({top:0,behavior:'instant'});const heading=main.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}}
function renderHome(){
 main.innerHTML=`
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">THE POMELO COLLECTION</p>
      <h1 id="hero-title">One pomelo.<br>Two rituals.</h1>
      <p class="hero-description">把柚子的芳香与风味，带入两种日常。</p>
      <a class="primary hero-cta" href="#products" data-section="products">探索两种仪式 ${icon('arrow')}</a>
      <div class="category-choices">
        <a class="category-choice" href="?product=peel" data-product="peel"><strong>PEEL / FOR SKIN</strong><span>贴肤香氛</span></a>
        <a class="category-choice" href="?product=pulp" data-product="pulp"><strong>PULP / FOR DRINKS</strong><span>植物调饮</span></a>
      </div>
    </div>
    <div class="hero-art"><img src="assets/duo.webp" width="1448" height="1086" alt="一枚剖开的柚子，与 PEEL 香氛油和 PULP 调饮浓缩液的双品静物" fetchpriority="high" decoding="async"></div>
  </section>
  <section class="collection-section" id="products" aria-labelledby="collection-title">
    <div class="section-heading"><p class="eyebrow">THE COLLECTION / 01</p><h2 id="collection-title">Two ways to begin.</h2><p>同一来源，两种独立的使用方式。</p></div>
    <div class="product-grid">
      ${['peel','pulp'].map(id=>{const p=PRODUCTS[id];return `<article class="collection-product"><a class="collection-image" href="?product=${id}" data-product="${id}" aria-label="查看 ${p.code} ${p.title}"><img src="${p.image}" width="1086" height="1448" loading="lazy" decoding="async" alt="${p.code} ${p.title}"></a><div class="collection-info"><div><p class="eyebrow">${id==='peel'?'FOR SKIN':'FOR DRINKS'}</p><h3><a href="?product=${id}" data-product="${id}">${p.code}</a></h3><p>${p.title} · ${id==='peel'?'15 mL':'250 mL'}</p></div><a class="product-link" href="?product=${id}" data-product="${id}" aria-label="查看 ${p.code} 详情"><span>${money(p.price)}</span>${icon('arrow')}</a></div></article>`}).join('')}
    </div>
  </section>
  <section class="source-note" id="source" aria-labelledby="source-title">
    <div><p class="eyebrow">THE SOURCE / PINGHE, FUJIAN</p><h2 id="source-title">从一枚柚子开始。</h2></div>
    <div class="source-copy"><p>以福建平和红肉琯溪蜜柚为原料研究起点，<br>让果皮的芳香与果肉的风味，各有去处。</p><p>PEEL 与 PULP 共享来源，<br>保留各自的配方方向与使用方式。</p></div>
  </section>
  <section class="ritual-section" id="rituals" aria-labelledby="ritual-title">
    <div class="section-heading"><p class="eyebrow">DAILY RITUALS</p><h2 id="ritual-title">A moment, for yourself.</h2></div>
    <div class="ritual-grid"><article><span class="ritual-number">01</span><div><h3>贴近腕间。</h3><p>PEEL 01 · 打开瓶盖，以滚珠轻触脉搏点。<br>仅供外用。</p><a href="?product=peel" data-product="peel">探索 PEEL ${icon('arrow')}</a></div></article><article><span class="ritual-number">02</span><div><h3>调一杯日常。</h3><p>PULP 01 · 量取 25 mL，<br>兑入 150–200 mL 冷水或气泡水。</p><a href="?product=pulp" data-product="pulp">探索 PULP ${icon('arrow')}</a></div></article></div>
  </section>`;
}
function render(){
 if(!currentProduct){renderHome();return}
 const p=PRODUCTS[currentProduct];main.innerHTML=`<nav class="pdp-breadcrumb" aria-label="面包屑"><a href="./" data-home>${icon('left')} 返回两款产品</a></nav><article class="pdp"><div class="pdp-visual"><img src="${p.image}" alt="${p.code} ${p.title}完整瓶身"></div><div class="pdp-info"><p class="eyebrow">${p.category}</p><h1>${p.code}</h1><p class="pdp-subtitle">${p.title}</p><p class="product-story">${p.story}</p><div class="usage-line"><span>如何使用</span><div>${p.usage}</div></div><div class="price-line"><span class="price">${money(p.price)}</span><span class="size">${p.size}</span></div><div class="purchase-row"><div class="quantity" aria-label="购买数量"><button type="button" data-product-quantity="-1" aria-label="减少购买数量" disabled>${icon('minus')}</button><span id="product-quantity">1</span><button type="button" data-product-quantity="1" aria-label="增加购买数量">${icon('plus')}</button></div><button class="primary" id="add-button" data-add="${currentProduct}">加入购物袋 ${icon('arrow')}</button></div><p class="purchase-note">概念零售价格</p><div class="details-list"><details><summary>${currentProduct==='peel'?'香气层次':'风味与用量'}</summary><p>${p.notes}。${currentProduct==='pulp'?'每次25 mL，一瓶约可调饮10次。':'为贴肤使用设计的低扩散香气方向。'}</p></details><details><summary>形态与使用设计</summary><p>${p.detail}</p></details></div></div></article><aside class="other-product"><p>探索同一来源的另一条产品路径</p><a href="?product=${p.other}" data-product="${p.other}">${PRODUCTS[p.other].code} ${icon('arrow')}</a></aside>`;
}
function notify(message){clearTimeout(toastTimer);toast.innerHTML=`<span>${message}</span><button data-bag>查看购物袋 →</button>`;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,4500)}
function openBag(){lastOpener=document.activeElement;renderBag();toast.hidden=true;if(!dialog.open)dialog.showModal();dialog.querySelector('[data-close]').focus()}
function renderBag(review=false){updateCount();document.querySelector('#bag-title').childNodes[0].textContent=review?'核对订单 ':'购物袋 ';if(!count()){bagContent.innerHTML=`<div class="bag-empty"><svg class="empty-symbol" viewBox="0 0 64 64" aria-hidden="true"><path d="M15 23h34l3 32H12l3-32Zm9 0v-8a8 8 0 0 1 16 0v8"/></svg><h3>A little room<br>for your rituals.</h3><p>购物袋还是空的。<br>从贴肤香气或植物调饮开始。</p><button class="secondary" data-continue>探索两款产品 ${icon('arrow')}</button></div>`;return}
 if(review){bagContent.innerHTML=`<div class="review-message"><p class="eyebrow">ORDER REVIEW</p><h3>确认所选商品</h3><p>请核对所选产品与数量。这是设计交互原型，确认不会产生真实订单或付款。</p></div><dl class="review-list">${Object.entries(bag).filter(([id,q])=>PRODUCTS[id]&&q>0).map(([id,q])=>`<div><dt>${PRODUCTS[id].code}<span>${PRODUCTS[id].title} · ${q} 件</span></dt><dd>${money(PRODUCTS[id].price*q)}</dd></div>`).join('')}</dl><div class="bag-bottom"><div class="subtotal"><span>商品小计</span><strong>${money(subtotal())}</strong></div><div class="review-actions"><button class="primary" data-finish>完成演示 ${icon('arrow')}</button><button class="secondary" data-return-bag>返回购物袋</button></div><p>未连接支付或配送服务，不收集个人信息。</p></div>`;return}
 bagContent.innerHTML=`<div class="bag-items">${Object.entries(bag).filter(([id,q])=>PRODUCTS[id]&&q>0).map(([id,q])=>{const p=PRODUCTS[id];return `<article class="bag-item" data-item="${id}"><img src="${p.image}" alt="${p.code}"><div><div class="bag-item-head"><h3>${p.code}</h3><span class="item-price">${money(p.price*q)}</span></div><p>${p.title}<br>${p.size}</p><div class="bag-item-actions"><div class="quantity" aria-label="${p.code}数量"><button data-change="${id}" data-delta="-1" aria-label="减少${p.code}数量" ${q===1?'disabled':''}>${icon('minus')}</button><span data-item-quantity>${q}</span><button data-change="${id}" data-delta="1" aria-label="增加${p.code}数量" ${q===9?'disabled':''}>${icon('plus')}</button></div><button class="remove" data-remove="${id}">移除</button></div></div></article>`}).join('')}</div><div class="bag-bottom"><div class="subtotal"><span>商品小计</span><strong data-subtotal>${money(subtotal())}</strong></div><button class="primary" data-review>核对订单 ${icon('arrow')}</button><p>价格为概念零售目标。下一步仅核对原型订单，不产生交易。</p></div>`;
}
function closeBag(){dialog.close();if(lastOpener&&lastOpener.isConnected)lastOpener.focus()}
document.addEventListener('click',e=>{
 const target=e.target.closest('a,button');if(!target)return;
 if(target.hasAttribute('data-home')){e.preventDefault();route(null);return}
 if(target.dataset.section){e.preventDefault();if(currentProduct)route(null);const section=document.getElementById(target.dataset.section);if(section){history.replaceState({},'',location.pathname+'#'+target.dataset.section);section.tabIndex=-1;section.focus({preventScroll:true});section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}return}
 if(target.dataset.product){e.preventDefault();route(target.dataset.product);return}
 if(target.hasAttribute('data-bag')){openBag();return}
 if(target.hasAttribute('data-close')){closeBag();return}
 if(target.hasAttribute('data-continue')){closeBag();route(null);return}
 if(target.hasAttribute('data-product-quantity')){selectedQuantity=Math.max(1,Math.min(9,selectedQuantity+Number(target.dataset.productQuantity)));document.querySelector('#product-quantity').textContent=selectedQuantity;document.querySelector('[data-product-quantity="-1"]').disabled=selectedQuantity===1;document.querySelector('[data-product-quantity="1"]').disabled=selectedQuantity===9;return}
 if(target.dataset.add){const id=target.dataset.add;bag[id]=Math.min(9,(bag[id]||0)+selectedQuantity);saveBag();notify(PRODUCTS[id].code+' 已加入购物袋');target.textContent='已加入购物袋 ✓';setTimeout(()=>{if(target.isConnected)target.innerHTML='加入购物袋 '+icon('arrow')},2200);return}
 if(target.dataset.change){const id=target.dataset.change;bag[id]=Math.max(1,Math.min(9,bag[id]+Number(target.dataset.delta)));saveBag();renderBag();const next=dialog.querySelector('[data-change="'+id+'"][data-delta="'+target.dataset.delta+'"]:not(:disabled)')||dialog.querySelector('[data-change="'+id+'"]:not(:disabled)');if(next)next.focus();return}
 if(target.dataset.remove){delete bag[target.dataset.remove];saveBag();renderBag();return}
 if(target.hasAttribute('data-review')){renderBag(true);dialog.querySelector('[data-finish]').focus();return}
 if(target.hasAttribute('data-return-bag')){renderBag();dialog.querySelector('[data-review]').focus();return}
 if(target.hasAttribute('data-finish')){closeBag();notify('演示已完成 · 未产生真实交易');return}
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)closeBag()}});
dialog.addEventListener('close',()=>{if(lastOpener&&lastOpener.isConnected)lastOpener.focus()});
window.addEventListener('popstate',()=>{currentProduct=new URL(location.href).searchParams.get('product');if(!PRODUCTS[currentProduct])currentProduct=null;selectedQuantity=1;render()});
currentProduct=new URL(location.href).searchParams.get('product');if(!PRODUCTS[currentProduct])currentProduct=null;render();updateCount();
