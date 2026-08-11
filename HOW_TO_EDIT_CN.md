# Zhefei Huang 网站修改说明

这个文件是给以后自己改网站用的。你不用懂代码，只要知道每种内容放在哪里。

## 文件夹位置

你的完整网站项目文件夹在这里：

```text
C:\Users\Freya\Documents\Codex\2026-08-09\gap-pdf-github-chatgpt\work\site-repo
```

GitHub 仓库是：

```text
Freyaaa3240/zhefeihuang.github.io
```

这个仓库现在是私密的。网站如果用免费 GitHub Pages 链接，不需要买域名，也不需要 `CNAME` 文件。

## 最常改的文件

- `index.html`：首页结构、导航、项目入口。
- `js/main.js`：所有项目文字、中英文内容、图片列表、视频、声音、弹窗、语言切换。
- `css/polish.css`：字体、颜色、排版、背景膜、按钮、手机和平板自适应。
- `images/`：网站图片。
- `videos/`：网站视频。
- `audio/`：网站声音文件。
- `projects/`：旧版独立项目页，主要入口现在由 `index.html` 和 `js/main.js` 控制。

## 修改文字

打开 `js/main.js`，搜索项目名字，例如：

```text
Generative Healing
Oxidation
Mossy Territory
Trending Disasters
Archetypes: Cherries
```

每个项目里常见字段：

- `title`：项目标题。
- `kicker`：项目类型和年份。
- `intro`：标题下面的一句话介绍。
- `question`：第一段问题。
- `noticed`：第二段观察。
- `made`：第三段回应。
- `role`：职责部分。
- `soundTitle` / `soundText`：声音部分的说明。

`en` 是英文，`zh` 是中文。只改中文就改 `zh` 后面的文字，只改英文就改 `en` 后面的文字。

## 加图片

1. 把新图片复制到 `images/` 里面，最好给每个项目单独建一个文件夹。
2. 打开 `js/main.js`。
3. 找到对应项目的 `images: [...]`。
4. 加一行图片路径，例如：

```js
"images/generative-process/new-image.jpg"
```

注意逗号、引号和路径不要漏。

## 加视频或声音

视频放进 `videos/`，然后在项目里写：

```js
video: "videos/file-name.mp4"
```

声音放进 `audio/`，然后在项目里写：

```js
audio: "audio/file-name.mp3"
```

## 本地预览

在这个项目文件夹里打开终端，运行：

```powershell
python -m http.server 5173
```

然后浏览器打开：

```text
http://127.0.0.1:5173/index.html
```

## 上线

以后改完文件，需要提交并推送到 GitHub，GitHub Pages 才会更新。

如果你只是想先看本地效果，就不用上传，直接用上面的本地预览地址。
