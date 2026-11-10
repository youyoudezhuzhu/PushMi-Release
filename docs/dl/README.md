# PushMi APK 下载目录（GitHub Pages）

本目录由 `.github/workflows/sync-pages-apk.yml` 在部署时填充：

- `latest.apk`：**固定直链**，永远指向最新稳定版；**只存在于 Pages 部署产物中，不提交进 git**
  （避免仓库历史每版增长 ~6 MB）
- `SHA256SUMS-<version>.txt`：当前版本校验值（提交进 git）
- `stable.json`：与仓库 `updates/stable.json` 内容一致（提交进 git）

历史版本请到对应 Release 的资产里下载（文件名带版本号，永久有效）。
