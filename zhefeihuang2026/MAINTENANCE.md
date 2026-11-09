# 作品集更新约定

网页地址保持 `https://zhefeihuang.github.io/zhefeihuang2026/`。

用户已指定永久 PDF 文件名：**`zhefeihuang_selectedworks.pdf`**。以后无论内容、页数或年份如何更新，正式文件名、下载属性和 PDF 标题都沿用这个名字；不要再加日期、版本号或改用其他大小写。缓存版本只放在 URL 的 `?v=` 参数中。

- `portfolio.config.json` 记录固定文件名。
- `../scripts/build-portfolio-reader.py` 是已提交的网页生成器，读取正式 PDF 的哈希、实际体积和原生品牌链接矩形，生成 `index.html` 与 `page-links.css`。
- 网页逐页读取 `previews/`，不在首屏下载完整 PDF。预览分别为 960、1440、2300、4600 像素宽；更新内容时，从同一份最终 PDF 生成所有变化页的四档预览。
- 运行 `python scripts/build-portfolio-reader.py` 后提交网页、脚本、PDF 和变化页预览；修改 `viewer.js` 后也必须重新运行，刷新脚本缓存版本。
- 旧公开路径 `ZhefeiHuang_SelectedWorks202611.pdf` 保留同一份最新 PDF 的字节副本，仅用于兼容已经发出的直链。新网页所有下载和打开入口只用永久文件名。
- 发布前检查桌面及手机逐页加载、普通滚动返回、跳页、缩放、失败重试、下载文件名与文件哈希。确认 GitHub Pages 实际内容更新后再报告发布完成。

原图和 PDF 保留高清。网页速度优先通过按需加载、可见页优先、分级预览和及时取消远处请求来改善，不通过压糊 PDF 来换取首屏速度。
