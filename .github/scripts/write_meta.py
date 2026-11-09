#!/usr/bin/env python3
"""Validate a release update-manifest.json and write meta.env for the workflow."""
import json
import sys

manifest = json.load(open(sys.argv[1]))
version = manifest.get("version_name") or ""
code = int(manifest.get("version_code") or 0)
sha = manifest.get("sha256") or ""
assert version and code > 0, manifest
assert len(sha) == 64, manifest
with open(sys.argv[2], "w") as fh:
    fh.write(f"VERSION={version}\nVERSION_CODE={code}\nSHA256={sha}\n")
print(version, code, sha)
