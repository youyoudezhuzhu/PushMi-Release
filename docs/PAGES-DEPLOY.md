# Pages 部署与环境策略

本仓库的 GitHub Pages 由 **GitHub Actions artifact** 部署（Settings → Pages → Source: GitHub Actions），
对应工作流 `.github/workflows/sync-pages-apk.yml`：

- 触发：`release: published`（正式版发布）或手动 `workflow_dispatch`
- 流程：下载 Release 的 APK → 校验 SHA-256 → 写入 `docs/dl/latest.apk`（**不提交进 git**）
  → 生成 `stable.json` / 校验文件并提交 → `upload-pages-artifact` → `deploy-pages`
- 旧 Release 与 tag 会自动清理，只保留当前版本

## ⚠️ 环境策略必须包含 `v*` tag

`deploy` job 使用 `environment: github-pages`。该环境的保护规则是 **custom branch policies**，
必须同时允许：

| 类型 | 名称 | 原因 |
|---|---|---|
| branch | `main` | 手动 dispatch 时 ref 是 main |
| tag | `v*` | **release 事件触发的 run，ref 是 `refs/tags/vX.Y.Z`** |

如果只配置了 `main` / `gh-pages` 而**没有 tag 策略**，release 触发的部署会在环境规则处直接失败
（deploy job 0 步 / environment protection 报错），表现为「sync 成功、deploy 失败」。

检查：

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/youyoudezhuzhu/PushMi-Release/environments/github-pages/deployment-branch-policies
```

修复（加一条 tag 策略）：

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" \
  -d '{"name":"v*","type":"tag"}' \
  https://api.github.com/repos/youyoudezhuzhu/PushMi-Release/environments/github-pages/deployment-branch-policies
```

验证：在 main 上建临时 tag（如 `v0.0.0-deploytest`），以该 tag 为 ref 手动 dispatch，
确认 `deploy` job 成功；验证后删除临时 tag。

## 其它注意

- `docs/dl/latest.apk` 已加入 `.gitignore`，只存在于部署产物中
- `stable.json` 仍提交进 git（App 通过 raw.githubusercontent 读取）
- 手动 dispatch 时默认取最新非预发布 Release 的 tag
