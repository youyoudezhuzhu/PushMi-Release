# PushMi APK 下载目录（GitHub Pages）

此目录只保留**最新稳定版**安装包，供在线更新下载使用（比 Release 资产更快）。

- `latest.apk`：**固定直链**，永远指向最新稳定版（内容随版本替换，不叠加版本号）
- `SHA256SUMS-<version>.txt`：校验值
- `stable.json`：与仓库 `updates/stable.json` 内容一致，便于快速获取更新信息

发布新版本时直接覆盖 `latest.apk`，因此仓库里始终只有一份 APK。
历史版本请到对应 Release 的资产里下载（文件名带版本号，永久有效）。
