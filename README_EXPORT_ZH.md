# MICKYWORKS TV · 第 28 版网站源码包

这是 2026-10-30 已发布的第 28 版，包含完整源码、Logo、视频、图片、字体和依赖锁文件。

本版包含：导航「Logo ＋ MICKYWORKS TV」、首页标签上方的品牌 Logo、直播电商能力卡及中英文介绍。首页大标题、中英文切换和既有作品均已保留。

## 在自己的电脑上打开

1. 解压整个 ZIP，进入 `MICKYWORKS_TV_v28` 文件夹。不要只打开压缩包里的某一个文件。
2. 安装 Node.js 22.13.0 或更高版本。GitHub Desktop 负责版本管理，不能代替 Node.js。
3. 在这个文件夹内打开终端，依次执行：

```sh
npm ci
npx vite --host 127.0.0.1
```

在浏览器中打开终端输出的本地地址。默认通常是 `http://127.0.0.1:5173`；端口被占用时，以终端实际显示为准。停止预览时在终端按 Ctrl+C。

以上命令可用于 macOS、Windows 和 Linux。首次 `npm ci` 需要联网下载依赖。依赖未放进 ZIP，以减少体积；源码和媒体资源均已包含。

## 如何修改

- `app/page.tsx`：页面结构和交互。
- `app/content.mjs`：中英文文案、社交主页链接。
- `app/globals.css`：样式和响应式布局。
- `app/components/BrandLogo.tsx`：原始 Logo 的显示裁切。
- `public/`：Logo、二维码、完整视频、移动端视频、海报等媒体资源。

## 构建与部署说明

这是 Vinext + React + Cloudflare Workers 工程，不是双击 HTML 即可运行的纯静态网页。

跨平台生产构建可使用：

```sh
npx vinext build
```

原工程保留的 `npm run build`、`npm test` 等脚本使用 Linux/Bash、GNU timeout，不能直接当作原生 macOS/Windows 脚本运行。需要在这些系统中构建时，优先使用上面的 `npx vinext build`。

本包不是 GitHub Pages 的纯静态上传包，也不会自动发布到当前线上网站。通过 GitHub Desktop 管理代码不会自动同步回 Sites；部署到其他平台需要按其运行时配置适配。

## 版本与恢复

来源版本：28。
导出时的线上地址：https://mickeyworks-portfolio.abcd383837.chatgpt.site
源码提交：12e3dfcf68b2db365a10ca0bc34a8b5d273c0714。

`BACKUP_INFO.json` 保存版本信息；`SHA256SUMS` 可校验文件完整性。除本说明、备份信息和校验表外，工程文件均来自上述提交，未为导出而修改。旧版备份未覆盖。

本包不包含 Git 历史、node_modules、构建缓存、登录凭据或生产环境变量。当前线上访问权限属于托管平台设置，不会随 ZIP 转移。
