// Googleマップの URL (…/@35.68,139.76,17z… や !3d35.68!4d139.76) から座標を取り出す
function parseGoogleMapsUrl(url) {
  if (!url) return null;
  let m = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (m) return { lat: m[1], lng: m[2] };
  m = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (m) {
    const h = url.match(/,(\d+(?:\.\d+)?)h/);
    return { lat: m[1], lng: m[2], heading: h ? h[1] : undefined };
  }
  m = url.match(/[?&](?:q|ll|query)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (m) return { lat: m[1], lng: m[2] };
  return null;
}

function openWalk(coords) {
  const url = new URL(chrome.runtime.getURL('map.html'));
  if (coords) {
    url.searchParams.set('lat', coords.lat);
    url.searchParams.set('lng', coords.lng);
    if (coords.heading !== undefined) url.searchParams.set('heading', coords.heading);
  }
  chrome.tabs.create({ url: url.href });
}

chrome.action.onClicked.addListener((tab) => {
  openWalk(parseGoogleMapsUrl(tab.url));
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'walk-here',
    title: 'この場所を3Dマップで歩く',
    contexts: ['page', 'link'],
    documentUrlPatterns: ['https://www.google.com/maps*', 'https://www.google.co.jp/maps*'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'walk-here') return;
  openWalk(parseGoogleMapsUrl(info.linkUrl) || parseGoogleMapsUrl(tab?.url));
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.type === 'open-walk') {
    openWalk(parseGoogleMapsUrl(msg.url) || parseGoogleMapsUrl(sender.tab?.url));
  }
});

// ---------------------------------------------------------------------------
// ストリートビュー: 画面キャプチャと奥行き推定
// ---------------------------------------------------------------------------
let offscreenReady = null;

function ensureOffscreen() {
  if (!offscreenReady) {
    offscreenReady = (async () => {
      const contexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
      if (contexts.length) return;
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['WORKERS'],
        justification: 'ストリートビュー画像の奥行きを推定して、アバターを建物の後ろに隠したり地面の高さに合わせたりするため',
      });
    })().catch((e) => {
      offscreenReady = null;
      throw e;
    });
  }
  return offscreenReady;
}

// テストで差し替えられるように self に置く
self.estimateDepth = async (dataUrl) => {
  await ensureOffscreen();
  const res = await chrome.runtime.sendMessage({ target: 'offscreen', type: 'depth', dataUrl });
  if (!res || res.error) throw new Error(res?.error || '奥行き推定に失敗しました');
  return res.depth;
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'sv-capture') {
    chrome.tabs
      .captureVisibleTab(sender.tab.windowId, { format: 'jpeg', quality: 75 })
      .then((dataUrl) => sendResponse({ dataUrl }))
      .catch((e) => sendResponse({ error: String(e?.message || e) }));
    return true;
  }
  if (msg?.type === 'sv-depth') {
    self
      .estimateDepth(msg.dataUrl)
      .then((depth) => sendResponse({ depth }))
      .catch((e) => sendResponse({ error: String(e?.message || e) }));
    return true;
  }
  return false;
});
