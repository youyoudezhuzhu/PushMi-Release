# 下载页与 Pages 部署

GitHub Pages 现在通过 **GitHub Actions artifact** 部署（Settings → Pages → Source: GitHub Actions），
不再从 `main` 分支 `/docs` 静态发布。对应工作流 `.github/workflows/sync-pages-apk.yml`。

## 结构

- `docs/index.html`、`docs/assets/*`：页面内容与静态资源（提交进 git）
- `docs/dl/latest.apk`：**不提交进 git**，由工作流在部署时放进 artifact
- `docs/dl/SHA256SUMS-<version>.txt`、`docs/dl/stable.json`、`updates/stable.json`：提交进 git（小文本）
- `docs/PAGES-DEPLOY.md`：环境策略与排障（**必须包含 `v*` tag 策略**）

## 发新版时

1. 在 Release 仓库发布正式版（非 prerelease）
2. 工作流自动：下载 APK → 校验 SHA-256 → 写入 artifact 的 `docs/dl/latest.apk`
   → 生成 `stable.json` / 校验文件并提交 → `upload-pages-artifact` → `deploy-pages`
3. 旧 Release/tag 自动删除，只保留当前版本

网页从 `docs/dl/stable.json` 读取稳定版信息；下载固定走本站 `dl/latest.apk`，
清单加载成功后加 `?v=<version_code>` 绕过缓存。清单不可用或禁用 JS 时，固定直链与 Releases 入口仍可用。

## 注意

- APK 只存在于 Pages 部署产物和 Release 资产中，**不进入 git 历史**
- `git add -A updates docs/dl` 一次 stage 全部变更（含旧校验文件的删除），避免残留旧版本文件
- 环境 `github-pages` 的保护策略必须同时允许 `main` 分支和 `v*` tag，否则 release 触发的 deploy 会失败
