# PushMi（推米）官方下载与版本更新

PushMi 是一个 Android 第三方应用，可将手机正在播放的音频通过局域网推送到 MiPlay 音箱。
本仓库只用于发布正式 APK、版本说明和接收用户反馈，**不包含应用源码**。

> PushMi 是独立开发的第三方应用，与小米公司没有官方关联，也未获得小米官方背书。

## 下载

### 固定直链（永远是最新正式版）

```
https://youyoudezhuzhu.github.io/PushMi-Release/dl/latest.apk
```

这个地址**不会变**：每次发布新版本，文件内容自动更新，链接保持不变，可以直接收藏或分享。

### 下载页

```
https://youyoudezhuzhu.github.io/PushMi-Release/
```

### 历史版本

需要旧版本或核对每个版本的说明，请到
[Releases](https://github.com/youyoudezhuzhu/PushMi-Release/releases) 下载
`pushmi-<版本>-release-signed.apk` 与对应的 `SHA256SUMS-<版本>.txt`。

### 给自动化/脚本用

正式版的更新清单（JSON，含版本号、下载地址、SHA-256）：

```
https://raw.githubusercontent.com/youyoudezhuzhu/PushMi-Release/main/updates/stable.json
```

- 正式包使用固定签名证书；不同签名的旧版本可能需要先卸载再安装。
- 卸载会清除本地设置，PMD1 设备码可能与旧安装不同；已有 Plus 用户如遇设备授权问题，请联系管理员迁移。
- 安装时如系统提示“未知来源”，请在系统设置中允许当前文件管理器/浏览器安装应用。

## 系统要求

- Android 10（API 29）及以上。
- 与音箱处于同一 Wi-Fi 局域网。
- 支持 MiPlay 协议的音箱；未测试机型不保证兼容。

## 核心功能

- 捕获手机媒体音频，局域网直连推送到一台或多台 MiPlay 音箱。
- 多音箱同步、独立音量、静音、暂停/继续、停止。
- 系统通知快捷控制；支持的系统可显示原生实时通知（Android 16+ Live Updates）。
- 默认同时最多 2 台音箱；PushMi Plus 可解除数量限制，永久授权。

## 多音箱与 Plus

- 默认同时最多 2 台音箱。
- Plus：解除同时推送数量限制，永久授权；通过激活码绑定设备。授权与更新互不影响。

## 安装与更新

1. 打开上面的固定直链，或到 Releases 选择指定版本。
2. 需要校验时，比对下载文件的 SHA-256 与对应 `SHA256SUMS-*.txt` 是否一致。
3. 安装并打开；首次使用授予必要的通知/音频捕获权限。
4. App 内“设置 → 软件更新”可检查更新，不强制更新。

## 常见问题

- **收不到通知/控制**：检查通知权限与后台运行限制。
- **找不到音箱**：确认同一 Wi-Fi、路由器未开启 AP 隔离，并允许局域网发现。
- **声音不同步/中断**：尝试降低音质或切换延迟策略；部分设备/系统可能受省电限制。
- **更新失败或很慢**：App 内更新默认走 GitHub Pages（较快）并带 Release 资产兜底；
  也可在设置中切换下载加速源。若仍失败，直接用上面的固定直链下载安装。

## 反馈

请使用 [Issues](https://github.com/youyoudezhuzhu/PushMi-Release/issues) 提交问题，并附上 App 版本、Android 版本、手机型号、音箱型号和复现步骤。**不要上传 CDK、管理 Token、完整授权凭证、私密音频或设备隐私信息。**

## 隐私与安全

- [隐私说明](PRIVACY.md)
- [安全说明](SECURITY.md)
- [专有软件声明](NOTICE.md)
