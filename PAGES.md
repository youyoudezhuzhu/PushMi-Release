# 下载页维护

GitHub Pages 沿用 `main` 分支 `/docs` 的静态发布方式，不需要前端构建工具。

- `docs/index.html`：页面内容、下载入口和截图预览。
- `docs/assets/site.css`：浅灰底、蓝紫强调色、胶囊按钮及磨砂导航；含手机、平板和桌面布局，以及系统减少动画支持。
- `docs/assets/site.js`：截图页签、键盘导航、版本清单读取与 SHA-256 复制。
- 原有 `docs/assets/shot-*.webp` 和图标继续使用，没有重新生成或替换 App 截图。

## 发新版时

继续沿用现有发布与 APK 同步流程。网页从 `docs/dl/stable.json` 读取稳定版版本号、版本代码、镜像下载和 SHA-256；不需要在 HTML 中手动改版本。

下载始终使用本站 `dl/latest.apk`，清单加载成功后只增加 `?v=<version_code>` 绕过旧包缓存。清单不可用或禁用 JavaScript 时，固定 APK 链接与 GitHub Releases 入口仍可用。SHA-256 未加载时复制按钮不可用，不展示过期校验值。

本次网页设计调整没有更改 APK、更新清单、签名校验文件、App 源码或发布工作流。

## 本地预览

```sh
python3 -m http.server 4173 --directory docs
```

访问 `http://localhost:4173/`。需要测试时，直接浏览器检查即可，不需要构建 Android App。

## 本轮检查

基线 `1cc0a6e`。Chromium/Playwright 验证了 320、360、390、640、768、1024、1440px 布局无横向溢出，且按 `/PushMi-Release/` 子路径解析资源。截图切换、页签键盘导航、FAQ 展开/关闭、实际剪贴板复制通过；浏览器实际下载的 APK 为 6,031,714 字节，SHA-256 与原有更新清单一致。

清单获取失败、禁用 JavaScript、减少动画三种情况下的下载/内容退化检查通过；正常访问没有脚本异常或失败资源。对应机器检查结果见 [pages-browser-checks.json](.github/pages-browser-checks.json)。另已人工查看桌面、手机首屏及完整页面截图。

浏览器交互检查针对本地同一套静态文件。当前环境中直接访问线上站点的 Chromium 遇到代理证书信任问题；没有关闭 TLS 验证。线上部署状态与资源内容另外通过 GitHub Pages 状态及遵循系统 CA 的 HTTPS 客户端核验。
