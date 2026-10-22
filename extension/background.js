// Googleマップの URL (…/@35.68,139.76,17z… や !3d35.68!4d139.76) から座標を取り出す
function parseGoogleMapsUrl(url) {
  if (!url) return null;
  let m = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const h = url.match(/,(\d+(?:\.\d+)?)h/);
  const view = m && { lat: m[1], lng: m[2], heading: h ? h[1] : undefined };
  // ストリートビュー中は、いま立っている場所と向きから歩き始める
  if (view && /!3m\d+!1e1(?!\d)/.test(url)) return view;
  // 場所を選んでいるときはその場所。続けて別の場所を開くと前の場所も URL に残るので、最後のものを使う
  const places = [...url.matchAll(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g)];
  if (places.length) {
    const [, lat, lng] = places[places.length - 1];
    return { lat, lng };
  }
  if (view) return view;
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

// オフスクリーンで WASM でも奥行きを推定できなくなったら(ORT ごと壊れたときなど)、ドキュメントを
// 作り直す(offscreen.js の restartError)。ずっと失敗するとき(モデルが壊れているなど)に
// 作り直し続けないよう、間隔は 30 秒から倍々にのばす(最長 10 分)
let restartCount = 0;
let lastRestartAt = 0;

async function restartOffscreen() {
  const wait = Math.min(10 * 60 * 1000, 30 * 1000 * 2 ** restartCount);
  if (Date.now() - lastRestartAt < wait) return;
  restartCount += 1;
  lastRestartAt = Date.now();
  offscreenReady = null;
  await chrome.offscreen.closeDocument().catch(() => {});
}

// テストで差し替えられるように self に置く
self.estimateDepth = async (dataUrl) => {
  await ensureOffscreen();
  // WebGPU で失敗していたら、作り直したドキュメントでも WASM で推定してもらう。service worker が
  // 止まっても忘れないよう、ブラウザを閉じるまで chrome.storage.session に覚えておく
  const { noWebGPU = false } = await chrome.storage.session.get('noWebGPU');
  const res = await chrome.runtime.sendMessage({ target: 'offscreen', type: 'depth', dataUrl, noWebGPU });
  if (res?.noWebGPU && !noWebGPU) await chrome.storage.session.set({ noWebGPU: true });
  if (res?.restart) await restartOffscreen();
  if (!res || res.error) throw new Error(res?.error || '奥行き推定に失敗しました');
  if (!res.depth.blank) restartCount = 0; // 推定できたら、次の作り直しはまた 30 秒から
  return res.depth;
};

// いる場所の住所(〇〇町・〇〇区など)。アバターが「〇〇に来たね」と話すのに使う。
// Nominatim は 1 秒に 1 回までなので、呼ぶ側で 200m 以上動いたときだけ、間をあけて呼んでいる
async function reverseGeocode(lat, lng, lang) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=${encodeURIComponent(lang || navigator.language || 'ja')}&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`reverse geocoding failed: ${res.status}`);
  return (await res.json()).address || null;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // オフスクリーンがしばらく使われなかった(offscreen.js)。メモリを返すために閉じる。次の推定で作り直す
  if (msg?.type === 'offscreen-idle') {
    offscreenReady = null;
    chrome.offscreen.closeDocument().catch(() => {});
    return false;
  }
  if (msg?.type === 'reverse-geocode') {
    reverseGeocode(msg.lat, msg.lng, msg.lang)
      .then((address) => sendResponse({ address }))
      .catch((e) => sendResponse({ error: String(e?.message || e) }));
    return true;
  }
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
