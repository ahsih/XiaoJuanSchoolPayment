# 菲律宾游学前60天英语学习计划（官网仓库说明）

这里是交接包的源文件。完整说明见 [README-交接说明.md](README-交接说明.md)，下面只说明放进官网仓库后有哪些不同。

| 交接包里 | 官网仓库里 |
|---|---|
| `dist/study60/`（上线用的文件夹） | `xiaojuanschoolpayment.client/public/study60/`，只放 `index.html`、`audio/`、`img/` |
| `dist/study60/录音清单.csv` | `study60/录音清单.csv`（给录音老师用，不放进网站目录） |
| `dist/study60/部署说明.txt` | `study60/部署说明.txt`（同上） |
| "重新上传" | 提交并推送到 `main`，GitHub Actions 会自动部署到 https://sidaqihang.com/study60/ |

- Angular 构建时会把 `public/study60/` 原样复制到网站根目录，服务器访问 `/study60/` 时直接返回其中的 `index.html`，不经过 Angular 路由。
- `src/build.py` 和 `tools/tts_run.py` 已经改成直接写到 `public/study60/`，`tools/rec_list.py` 写到本目录。第 6 节的命令不变，在本目录（`study60/`）里运行即可。
- 第 7 节换真人录音：把 mp3 覆盖到 `xiaojuanschoolpayment.client/public/study60/audio/` 里的同名文件。
- 官网菜单入口在 `xiaojuanschoolpayment.client/src/app/config/navigation.config.ts`（游学指南 → 游学前60天英语学习），它是整页跳转（`external: true`）。
- 不要直接改 `public/study60/index.html`，它由 `src/build.py` 生成。
- Kokoro 模型（`tools/kokoro/`）和临时 wav（`tools/_wav/`）不提交到仓库。
