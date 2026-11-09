from pathlib import Path
import hashlib,json
import fitz
root=Path(__file__).resolve().parents[1]/'zhefeihuang2026'
config=json.loads((root/'portfolio.config.json').read_text())
pdf=config['pdf']
assert pdf=='zhefeihuang_selectedworks.pdf', 'The portfolio filename is permanent.'
download_name=pdf
version=hashlib.sha256((root/pdf).read_bytes()).hexdigest()[:12]
viewer_version=hashlib.sha256((root/'viewer.js').read_bytes()).hexdigest()[:12]
style_version=hashlib.sha256((root/'style.css').read_bytes()).hexdigest()[:12]
pdf_url=pdf+'?v='+version
file_size=f'{(root/pdf).stat().st_size/1000000:.1f}'
brand_url='https://zhefeihuang.github.io/work/immanent/'
# Use the native PDF links as the source of truth for the preview hotspots.
brand_pdf_links=[]
link_rules=[]
with fitz.open(root/pdf) as document:
 assert len(document)==30
 page=document[6]
 for link in page.get_links():
  if link.get('uri')!=brand_url: continue
  x0,y0,x1,y1=link['from']
  role='invitation' if y0>page.rect.height*.85 else ('address' if y1-y0<35 else 'cta')
  cls='brand-site-'+role
  brand_pdf_links.append(cls)
  link_rules.append('.'+cls+'{left:'+f'{x0/page.rect.width*100:.6f}'+'%;top:'+f'{y0/page.rect.height*100:.6f}'+'%;width:'+f'{(x1-x0)/page.rect.width*100:.6f}'+'%;height:'+f'{(y1-y0)/page.rect.height*100:.6f}'+'%}')
assert len(brand_pdf_links)==3 and len(set(brand_pdf_links))==3
(root/'page-links.css').write_text('/* Generated from the portfolio PDF link rectangles. */\n'+'\n'.join(link_rules)+'\n')
links_version=hashlib.sha256((root/'page-links.css').read_bytes()).hexdigest()[:12]
icons={
 'download':'<path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/>',
 'external':'<path d="M8 5H4v15h15v-4M13 4h7v7M20 4 10 14"/>',
 'left':'<path d="m14 6-6 6 6 6"/>',
 'right':'<path d="m10 6 6 6-6 6"/>',
 'up':'<path d="M12 20V4m-6 6 6-6 6 6"/>',
}
def icon(name):return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>'
def download(extra=''):return f'<a class="download-button {extra}" href="./{pdf_url}" download="{download_name}" type="application/pdf" aria-label="下载完整作品集 PDF，30页，{file_size}MB">下载 PDF{icon("download")}</a>'
figures=[]
sizes='(max-width:600px) calc(100vw - 28px), (max-width:900px) calc(100vw - 48px), (max-width:1856px) calc(100vw - 96px), 1760px'
for i in range(1,31):
 small=f'./previews/small/page-{i:02}.jpg?v={version}'
 medium=f'./previews/medium/page-{i:02}.jpg?v={version}'
 standard=f'./previews/page-{i:02}.jpg?v={version}'
 full=f'./previews/large/page-{i:02}.jpg?v={version}'
 srcset=f'{small} 960w, {medium} 1440w, {standard} 2300w'
 if i==1:
  attrs=f'src="{small}" srcset="{srcset}" sizes="{sizes}" loading="eager" fetchpriority="high"'
 else:
  attrs=f'data-src="{small}" data-srcset="{srcset}" data-sizes="{sizes}" loading="lazy"'
 brand_hotspots=''
 if i==7:
  brand_hotspots='\n          '.join(f'<a class="brand-site-hotspot {cls}" href="{brand_url}" target="_blank" rel="noopener" aria-label="打开 IMMANENT 品牌网站，可查看商品详情、加入购物袋"><span class="sr-only">打开品牌网站</span></a>' for cls in brand_pdf_links)
 figures.append(f'''<figure class="pdf-page" data-page="{i}" id="page-{i}" data-render-state="idle" aria-label="作品集第{i}页，共30页">
          <img class="page-preview" {attrs} data-preview-src="{small}" data-standard-src="{standard}" data-full-src="{full}" width="2300" height="1000" alt="黄浙菲作品集，第{i}页" decoding="async">
          <noscript><img class="page-preview nojs-preview" src="{small}" srcset="{srcset}" sizes="{sizes}" width="2300" height="1000" alt="黄浙菲作品集，第{i}页" loading="lazy"></noscript>
          {brand_hotspots}
          <div class="page-fallback" hidden>
            <p data-error-copy>这一页暂时没加载出来</p>
            <div><button type="button" data-retry>重试此页</button><a href="./{pdf_url}#page={i}" target="_blank" rel="noopener" data-open-page>用 PDF 查看 ↗</a></div>
          </div>
        </figure>''')
 if i==7:
  figures.append(f'''<div class="project-website" aria-label="IMMANENT 品牌网站入口">
          <a class="project-website-link" href="{brand_url}" target="_blank" rel="noopener" aria-label="打开 IMMANENT 品牌网站，查看商品详情、加入购物袋"><span>打开品牌网站</span>{icon('external')}</a>
          <span class="project-website-note">商品详情 · 购物袋</span>
        </div>''')
html='''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f5f3ed">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; worker-src 'self' blob:; style-src 'self'; img-src 'self' data: blob:; font-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">
  <title>zhefeihuang2026 · Selected Works</title>
  <meta name="description" content="黄浙菲 Zhefei Huang · Selected Works 2023–2026。在线阅读完整30页作品集，直接下载高清PDF，无需登录。">
  <meta property="og:title" content="zhefeihuang2026 · Selected Works">
  <meta property="og:description" content="黄浙菲 · 2023–2026 作品集。在线阅读 / 下载完整PDF。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://zhefeihuang.github.io/zhefeihuang2026/">
  <meta property="og:image" content="https://zhefeihuang.github.io/zhefeihuang2026/previews/page-01.jpg?v={VERSION}">
  <meta name="portfolio-version" content="{VERSION}">
  <link rel="canonical" href="https://zhefeihuang.github.io/zhefeihuang2026/">
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">
  <link rel="preload" href="./fonts/CormorantGaramond.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="./style.css?v={STYLE_VERSION}">
  <link rel="stylesheet" href="./page-links.css?v={LINKS_VERSION}">
  <script type="module" src="./viewer.js?v={VIEWER_VERSION}"></script>
</head>
<body id="top">
  <a class="skip-link" href="#reader">跳至作品集</a>
  <header class="site-header">
    <div class="header-inner shell">
      <a class="wordmark" href="./" aria-label="zhefeihuang2026 首页">zhefeihuang<span>2026</span></a>
      <div class="header-actions">
        <div class="header-edition" aria-hidden="true">SELECTED WORKS<span>2023 — 2026</span></div>
        {HEADER_DOWNLOAD}
      </div>
    </div>
  </header>
  <main class="shell">
    <section class="introduction" aria-labelledby="page-title">
      <div>
        <p class="eyebrow"><span class="edition-dot" aria-hidden="true"></span>PORTFOLIO &nbsp;/&nbsp; 2023 — 2026</p>
        <h1 id="page-title">Selected <em>Works.</em></h1>
      </div>
      <p class="intro-detail"><strong>黄浙菲 &nbsp;/&nbsp; Zhefei Huang</strong><span>30 页<span class="separator" aria-hidden="true">·</span>{FILE_SIZE} MB<span class="separator" aria-hidden="true">·</span>PDF</span></p>
    </section>
    <section class="reader" id="reader" aria-label="在线阅读作品集">
      <div class="reader-toolbar">
        <div class="reader-label"><span>In view</span><span>在线阅读</span></div>
        <div class="pagination" role="group" aria-label="页面导航">
          <button class="page-arrow" id="previous-page" type="button" aria-label="上一页" disabled>{LEFT}</button>
          <div class="page-count">
            <label class="sr-only" for="current-page">跳转至页码</label>
            <input id="current-page" type="number" min="1" max="30" value="1" inputmode="numeric" enterkeyhint="go" aria-label="当前页码，输入后回车跳转">
            <span class="slash" aria-hidden="true">/</span><span id="total-pages">30</span>
          </div>
          <button class="page-arrow" id="next-page" type="button" aria-label="下一页">{RIGHT}</button>
        </div>
        <a class="native-open" id="native-open" href="./{PDF}" target="_blank" rel="noopener" type="application/pdf">打开完整 PDF{EXTERNAL}</a>
      </div>
      <p class="reader-notice sr-only" id="reader-status" role="status" aria-live="polite">作品集已就绪。</p>
      <p class="reader-notice" id="reader-loading" hidden>正在准备作品集…</p>
      <p class="reader-notice" id="reader-error" hidden></p>
      <noscript><p class="reader-notice">可直接向下阅读全部30页，也可<a href="./{PDF}" download="{DOWNLOAD_NAME}">下载完整 PDF</a>。</p></noscript>
      <div class="pdf-pages" id="pdf-pages">
        {FIGURES}
      </div>
    </section>
    <section class="closing" aria-label="下载作品集">
      <div>
        <p class="closing-title">Selected <em>Works.</em></p>
        <p class="closing-note">保存完整作品集，随时细看。30 页 · {FILE_SIZE} MB</p>
      </div>
      <div class="closing-actions">
        <a class="back-to-top" href="#top">回到开头{UP}</a>
        {FOOTER_DOWNLOAD}
      </div>
    </section>
    <footer class="colophon">
      <p>© 2026 黄浙菲 Zhefei Huang<br>原创内容保留权利。</p>
      <p class="site-name">zhefeihuang2026</p>
    </footer>
  </main>
</body>
</html>
'''
for placeholder,value in {'HEADER_DOWNLOAD':download(),'FOOTER_DOWNLOAD':download(),'PDF':pdf_url,'LEFT':icon('left'),'RIGHT':icon('right'),'EXTERNAL':icon('external'),'UP':icon('up'),'FIGURES':'\n        '.join(figures),'VERSION':version,'VIEWER_VERSION':viewer_version,'STYLE_VERSION':style_version,'LINKS_VERSION':links_version,'FILE_SIZE':file_size,'DOWNLOAD_NAME':download_name}.items():
 html=html.replace('{'+placeholder+'}',value)
assert '{HEADER_DOWNLOAD}' not in html
(root/'index.html').write_text(html)
print('Wrote site HTML with 30 static page previews and direct PDF links.')
