# 菲律宾游学前60天英语学习计划（网页版）交接说明

给：思达启航官网程序员
目标：把这个学习网页放到官网，例如 `https://sidaqihang.com/study60/`

**页面已经全部做好并测试过。你需要做的只有上线（第 2 节），不需要重新开发或重写内容。**

---

## 1. 已经做完的部分（请不要重做）

| 项目 | 状态 |
|---|---|
| 60 天课程内容（单词、句子骨架、例句、对话、任务、提醒） | 已按英语老师标准审校完 |
| 语法入门 第 0–10 课、数字速查、菲律宾当地英语、发音对比 | 已完成，带小测 |
| 入学测试攻略（15 页）、题目要求自测、最终模拟测试（8 个部分，自动打分） | 已完成，答案已核对 |
| 音频 | 1050 段美式发音 mp3，每段只对应一条内容 |
| 学习功能 | 进度、打卡、隔天复习提醒、单词复习卡、遮住自测、角色扮演、录音回放 |
| 手机适配 | 375–680px 宽度测过；浅色和深色模式都适配 |
| 自动测试 | 122 个页面全部打开过：无报错、无横向溢出、无死链，音频文件全部存在 |

## 2. 上线：3 步

1. 把 `dist/study60/` 整个文件夹上传到网站根目录（或任意子目录）。
2. 确认用 **https** 访问。录音功能必须用 https，其他功能 http 也能用。
3. 在官网菜单或首页加一个入口链接，指向 `/study60/`。

上线后按第 9 节的清单检查一遍。

`dist/study60/` 可以直接上传，不需要再构建。

## 3. 目录结构

```
study60-交接包/
├── README-交接说明.md     ← 本文件
├── dist/study60/          ← 上线用，直接上传
│   ├── index.html         ← 单文件页面（CSS、JS、课程数据都已内联，约 260KB）
│   ├── audio/             ← 1050 个 mp3（单声道 48kbps，共约 12MB）
│   ├── img/               ← 每日场景小图、阶段大图、logo、Jenny 微信二维码
│   ├── 部署说明.txt       ← 简版部署说明
│   └── 录音清单.csv       ← 每个音频的文件名、位置、英文原文、角色
├── src/                   ← 源文件（以后改内容用）
│   ├── data.base.json     ← ★ 课程内容唯一源文件（改文字只改这里）
│   ├── data.json          ← 由 tools/gen_clips.py 生成（在 data.base.json 基础上加了音频文件名）
│   ├── app.js             ← 全部页面逻辑（原生 JS，无框架，约 770 行）
│   ├── style.css          ← 全部样式（含深色模式）
│   └── build.py           ← 把 style.css + app.js + data.json 合成 dist/study60/index.html
└── tools/                 ← 音频工具
    ├── gen_clips.py       ← 给每条内容分配音频文件名，生成待录清单
    ├── clips_manifest.json← 文件名 → 英文原文 / 声音 / 语速
    ├── tts_run.py         ← 用 Kokoro 生成缺少的音频（已存在的跳过）
    └── rec_list.py        ← 生成 录音清单.csv
```

## 4. 技术说明

- **纯静态单页：** 没有后端、数据库或构建框架，也没有任何 npm 依赖。
- **不依赖国外资源：** 没有 Google 字体、CDN 或统计脚本，国内可以直接访问。字体用的是系统字体（苹方 / 微软雅黑）。
- **路由：** 用 hash（`#xxx`）。可以独立运行，不会和官网自己的路由冲突。

| 地址 | 页面 |
|---|---|
| `#home`（或空） | 首页：进度、今日复习、4 个阶段、语法目录、随身工具、联系方式 |
| `#day-1` … `#day-60` | 每天的课 |
| `#grammar-0` … `#grammar-10` | 语法入门（0 = 词性是什么） |
| `#page-<编号>` | 资料页（编号见 `data.json` 的 `pages`，例如 `#page-161`） |
| `#weekly-1` … `#weekly-8`、`#levelup-1` … `#levelup-4` | 每周挑战、阶段测试 |
| `#final` | 最终入学测试模拟 |
| `#selfcheck`、`#numbers`、`#local`、`#pron`、`#cards`、`#method`、`#tags`、`#info` | 自测、数字、当地英语、发音、单词卡、学习方法、词性标签、个人信息卡 |

- **学习进度：** 只存在学生自己浏览器的 `localStorage` 里，key 的前缀是 `sida60:`。换手机或清除浏览器数据后会重置。读写都包了 try/catch，无痕模式下页面也能正常用，只是不保存进度。
- **音频播放：** 每个播放按钮都有 `data-clip="day05-w1.mp3"`，播放 `audio/` 下的同名文件。"连续播放"就是按顺序逐条播放。
- **录音：** 用 MediaRecorder，录音只保存在当前页面的内存里，不上传。浏览器不支持时（比如部分微信内置浏览器）会提示学生用手机录音机，不会报错。
- **可以忽略的代码：** `app.js` 里的 `window.__CLIPMAP__` 和 `bundles/` 逻辑只用于 Claude 的预览链接。官网版不会用到，留着也不影响，不要为它去建 `bundles` 文件夹。

## 5. 内容数据（`src/data.base.json`）

| 字段 | 内容 |
|---|---|
| `days[60]` | 每天的课：`title` `goal` `tryen/tryzh` `words[{w,m,c}]`（c 是词性）、`formula` `breakdown` `sktip` `examples`、`sentences[{en,zh}]`、`dialog[{who,en,zh}]`、`yourturn` `tip` `jenny` `ytAns` `img` |
| `stages[4]` / `weekly[8]` / `levelups[4]` | 阶段介绍、每周挑战、阶段测试。`after` = 放在第几天之后 |
| `pages{编号: {title, blocks, after}}` | 资料页（从原 PPT 版式转换来的通用结构，`blocks` 是行和提示框） |
| `grammar[10]` / `pos` | 语法第 1–10 课（`day` = 插到哪一天）、第 0 课词性 |
| `numbers` / `local` / `pron` / `method` | 数字速查、菲律宾当地英语、发音对比、学习方法 |
| `listenScript` | 最终测试听力原文（显示在"做完再看听力原文"里） |

**写死在 `app.js` 里的内容**，改的时候直接改 JS：
- 最终测试题目和答案：`LISTEN`、`GRAMMAR`、`VOCAB`、`CLASS`、`PASSAGE`、`READQ`
- 题目要求自测：`SELF`
- 词性说明：`TAGROWS`
- 首页各区块的入口列表：`renderHome()`
- 联系方式：`contactHTML()`，里面有 Jenny 13249827686、`img/qr.png`、sidaqihang.com，共出现 3 次

## 6. 以后改内容的流程

在交接包根目录运行：

```bash
# 1) 改 src/data.base.json（或 src/app.js / src/style.css）
python3 tools/gen_clips.py     # 2) 重新分配音频，写出 src/data.json
python3 tools/tts_run.py       # 3) 只生成缺少的音频（改了英文的条目要先删掉旧 mp3）
python3 tools/rec_list.py      # 4) 更新 录音清单.csv
python3 src/build.py           # 5) 生成 dist/study60/index.html，再重新上传
```

- 只改中文或样式：跳过第 3 步。只改 `app.js` 或 `style.css`：只需要第 5 步。
- `tts_run.py` 需要 `pip install kokoro-onnx soundfile`、系统装好 ffmpeg，并把模型 `kokoro-v1.0.onnx` 和 `voices-v1.0.bin` 放到 `tools/kokoro/`。模型下载地址：https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
- 用到的声音：`af_heart`（女声，单词、例句、学生台词），`am_michael`（男声，老师和工作人员）。
- **改了某句英文后，先删掉它对应的旧 mp3**（文件名在 `tools/clips_manifest.json` 里查），否则 `tts_run.py` 会因为文件已存在而跳过它。

## 7. 换成真人外教录音

1. 按 `dist/study60/录音清单.csv` 逐条录，一条一个文件。
2. 存成 mp3，文件名和清单完全一样，覆盖 `audio/` 里的同名文件。
3. 网页不用改，也不用重新构建。

建议每条音频前后不要留太长空白，导出成单声道就够了。

## 8. 服务器建议

- `index.html` 不缓存，或缓存时间设短一点；`audio/` 和 `img/` 可以长缓存，比如 30 天。
- 确认 `.mp3` 返回的类型是 `audio/mpeg`。
- 打开 gzip 或 brotli，`index.html` 压缩后大约 80KB。
- nginx 示例：

```nginx
location /study60/ {
    alias /var/www/study60/;
    index index.html;
    location ~* \.(mp3|jpg|png)$ { expires 30d; }
    location = /study60/index.html { add_header Cache-Control "no-cache"; }
}
```

## 9. 上线后检查（5 分钟）

- [ ] 手机浏览器和微信里打开 `/study60/`，首页能正常显示
- [ ] 进入 Day 1，点任意单词的播放按钮能听到声音；"6 个词连续播放"会逐个高亮
- [ ] 点"完成 Day 1"后回首页，进度变成 1 / 60
- [ ] 打开 `#final`，听力部分能播放，选择题能显示对错
- [ ] 用 https 打开时，录音按钮能录能放
- [ ] 首页底部的 Jenny 电话、二维码、官网链接正确

## 10. 已知限制和以后可以加的功能（目前都不需要做）

- **看不到学生进度：** 目前没有账号系统，老师看不到学生学到哪里。如果需要老师后台，要另外做登录和接口，把 `localStorage` 里 `sida60:progress` 等数据同步到服务器。
- **SEO：** 页面内容是 JS 渲染的，搜索引擎基本抓不到。如果需要 SEO，可以另外为课程写静态介绍页，用来引流到这里。
- **音频：** 现在是 AI 合成的美式发音，可以按第 7 节换成真人录音。
- **图片：** 每日场景图来自原 PPT，分辨率较低，所以只用作小缩略图。
- **微信小程序：** 以后可以用 web-view 嵌入这个页面，需要在小程序后台配置业务域名，而且域名要已经备案、使用 https。iOS 微信 web-view 里录音可能用不了，页面会自动显示替代提示。

## 11. 请不要做的事

- **不要从 PPT 重新导出内容。** 网页版的内容已经在 PPT 基础上改过多轮（换词、改错、语法课、新页面），`src/data.base.json` 才是最新版本。重新从 PPT 导出会丢掉所有修改。
- 不要引入外部 CDN、字体或统计脚本，否则国内访问可能变慢或打不开。
- 品牌名统一写"思达启航"，不要简写成"思达"。
