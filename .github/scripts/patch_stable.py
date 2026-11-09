#!/usr/bin/env python3
"""Point both stable.json copies at the Pages APK, with the release asset as mirror."""
import json
import sys

version, code, sha, tag, apk_name = sys.argv[1:6]
notes = sys.argv[7] if len(sys.argv) > 7 else ""
source_commit = sys.argv[6] if len(sys.argv) > 6 else ""
base = "https://youyoudezhuzhu.github.io/PushMi-Release"
patch = {
    "source_commit": source_commit,
    "version_name": version,
    "version_code": int(code),
    "sha256": sha,
    # 固定直链：Pages 上永远只有一份 latest.apk；?v=<code> 用于绕过 CDN 10 分钟缓存。
    "apk_url": f"{base}/dl/latest.apk?v={int(code)}",
    "apk_url_alt": f"https://github.com/youyoudezhuzhu/PushMi-Release/releases/download/{tag}/{apk_name}",
}
if notes:
    patch["release_notes"] = notes
    patch["notes"] = notes
for path in ("updates/stable.json", "docs/dl/stable.json"):
    try:
        data = json.load(open(path))
    except FileNotFoundError:
        data = {"schema_version": 1, "channel": "stable", "published": True}
    data.update(patch)
    with open(path, "w") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print("updated", path, patch["apk_url"])
