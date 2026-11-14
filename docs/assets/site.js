'use strict';

const screens = {
  speakers: { src: 'assets/shot-speakers.webp', alt: '音箱页：查找并选择家里的小爱音箱', caption: '音箱 · 扫描与选择', width: 720, height: 1202 },
  home: { src: 'assets/shot-home.webp', alt: '首页：查看播放状态、暂停或静音，并选择要传送的声音', caption: '首页 · 推送与控制', width: 820, height: 1116 },
  settings: { src: 'assets/shot-settings.webp', alt: '设置页：调整音质、播放延迟和通知', caption: '设置 · 按你的习惯', width: 720, height: 1146 },
};
const tabs = [...document.querySelectorAll('[data-screen]')];
const panel = document.querySelector('#screen-panel');
const image = document.querySelector('#screen-image');
const caption = document.querySelector('#screen-caption');

function selectScreen(tab, focus = false) {
  const screen = screens[tab.dataset.screen];
  if (!screen) return;
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  }
  image.src = screen.src;
  image.alt = screen.alt;
  image.width = screen.width;
  image.height = screen.height;
  caption.firstChild.textContent = `${screen.caption} `;
  panel.setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}

for (const tab of tabs) {
  tab.addEventListener('click', () => selectScreen(tab));
  tab.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(tab);
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectScreen(tabs[next], true);
  });
}

// Download links work without JavaScript; metadata only adds the current version
// and a cache-busting version code to the fixed, same-origin APK URL.
const checksum = document.querySelector('#checksum-value');
const copyButton = document.querySelector('#copy-checksum');
const downloadStatus = document.querySelector('#download-status');
let checksumValue = '';

async function loadRelease() {
  try {
    const response = await fetch('dl/stable.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Release metadata unavailable');
    const release = await response.json();
    if (release.published !== true || release.channel !== 'stable' ||
        typeof release.version_name !== 'string' || !/^\d+\.\d+\.\d+[\w.-]*$/.test(release.version_name) ||
        !Number.isSafeInteger(release.version_code) || release.version_code < 1) return;
    document.querySelectorAll('[data-version]').forEach((element) => {
      element.textContent = `v${release.version_name} · 稳定版`;
    });
    document.querySelectorAll('[data-download]').forEach((element) => {
      element.href = `dl/latest.apk?v=${release.version_code}`;
    });
    if (typeof release.sha256 === 'string' && /^[a-f\d]{64}$/i.test(release.sha256)) {
      checksumValue = release.sha256;
      checksum.textContent = checksumValue;
      copyButton.disabled = false;
    }
    if (typeof release.apk_url_alt === 'string') {
      const mirror = new URL(release.apk_url_alt);
      if (mirror.protocol === 'https:' && mirror.hostname === 'github.com' &&
          mirror.pathname.startsWith('/youyoudezhuzhu/PushMi-Release/releases/download/')) {
        document.querySelector('#mirror-download').href = mirror.href;
      }
    }
  } catch {
    // Preserve the fixed download and GitHub fallback if metadata cannot load.
  }
}

copyButton.addEventListener('click', async () => {
  if (!checksumValue) return;
  try {
    await navigator.clipboard.writeText(checksumValue);
    downloadStatus.textContent = 'SHA-256 校验值已复制。';
    copyButton.textContent = '已复制';
    window.setTimeout(() => { copyButton.textContent = '复制校验值'; }, 2000);
  } catch {
    downloadStatus.textContent = '复制未完成，请选中校验值后手动复制。';
    copyButton.textContent = '请手动复制';
  }
});

loadRelease();
loadDownloadCount();

// Release download counts. GitHub's public API reports per-asset counters and
// allows browser CORS; failures simply leave the element hidden. Cached for
// ten minutes to stay well inside the unauthenticated API rate limit.
async function loadDownloadCount() {
  const elements = [...document.querySelectorAll('[data-download-count]')];
  if (!elements.length) return;
  const cacheKey = 'pushmi-download-count-v1';
  const render = (total) => {
    if (!Number.isFinite(total) || total < 0) return;
    for (const element of elements) {
      element.textContent = `累计下载 ${total.toLocaleString('zh-CN')} 次`;
      element.hidden = false;
    }
  };
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.t < 10 * 60 * 1000) {
        render(parsed.total);
        return;
      }
    }
  } catch {
    // Ignore unavailable session storage.
  }
  try {
    const response = await fetch(
      'https://api.github.com/repos/youyoudezhuzhu/PushMi-Release/releases?per_page=100',
      { headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!response.ok) throw new Error('download counts unavailable');
    const releases = await response.json();
    if (!Array.isArray(releases)) return;
    let total = 0;
    for (const release of releases) {
      for (const asset of release.assets || []) {
        if (typeof asset.name === 'string' && /\.apk$/i.test(asset.name) &&
            Number.isFinite(asset.download_count)) {
          total += asset.download_count;
        }
      }
    }
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), total }));
    } catch {
      // Storage may be disabled; rendering still works.
    }
    render(total);
  } catch {
    // Keep the count hidden when the API is unreachable or rate limited.
  }
}
