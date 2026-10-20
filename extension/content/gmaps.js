// Googleマップに「3Dで歩く」ボタンを追加し、ストリートビュー中はアバターを重ねて表示する
(() => {
  if (document.getElementById('walk3d-buttons')) return;

  const bar = document.createElement('div');
  bar.id = 'walk3d-buttons';

  const walkBtn = document.createElement('button');
  walkBtn.type = 'button';
  walkBtn.title = 'いまの場所をアバターと3Dマップで歩く';
  walkBtn.innerHTML = '<span class="walk3d-icon">🚶</span><span>3Dで歩く</span>';
  walkBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'open-walk', url: location.href });
  });

  const avatarBtn = document.createElement('button');
  avatarBtn.type = 'button';
  avatarBtn.className = 'walk3d-toggle';
  avatarBtn.title = 'ストリートビューにアバターを表示する';

  bar.append(avatarBtn, walkBtn);
  document.documentElement.appendChild(bar);

  let enabled = true;
  let modelKey = 'girl';
  let sv = null; // 読み込んだストリートビュー用モジュール
  let loading = null;
  let lastUrl = '';

  // ストリートビューの URL: /maps/@35.67,139.76,3a,75y,305.69h,63.68t/data=!3m6!1e1!3m4!...
  // 航空写真の3D表示(…,600a,35y,39t/data=!3m1!1e3)も同じ形なので、data の !1e1 で見分ける
  function parseStreetView(url) {
    if (!/!3m\d+!1e1(?!\d)/.test(url)) return null;
    const m = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)a((?:,[-\d.]+[a-z])*)/);
    if (!m) return null;
    const view = { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    for (const [, v, k] of m[4].matchAll(/,([-\d.]+)([a-z])/g)) {
      if (k === 'h') view.heading = parseFloat(v);
      if (k === 't') view.tilt = parseFloat(v);
      if (k === 'y') view.fov = parseFloat(v);
    }
    return view;
  }

  // 奥行き推定の状態: idle / loading / ok / error
  let depthStatus = 'idle';
  let depthMessage = '';
  const STATUS_TITLE = {
    idle: 'ストリートビューにアバターを表示する',
    loading: '奥行きを推定中…(初回はAIモデルのダウンロードに少し時間がかかります)',
    ok: '奥行き推定OK:建物や人の後ろに隠れ、地面の高さに合わせて立ちます',
    error: '奥行きを推定できませんでした(アバターは手前に表示されます)',
  };

  function render() {
    const dot = enabled && depthStatus !== 'idle' ? `<span class="walk3d-dot ${depthStatus}"></span>` : '';
    avatarBtn.innerHTML = `<span class="walk3d-icon">👧</span><span>アバター ${enabled ? 'ON' : 'OFF'}</span>${dot}`;
    avatarBtn.classList.toggle('off', !enabled);
    avatarBtn.title = STATUS_TITLE[depthStatus] + (depthStatus === 'error' && depthMessage ? `\n${depthMessage}` : '');
  }

  function onStatus(status, message = '') {
    depthStatus = status;
    depthMessage = message;
    render();
  }

  async function loadModule() {
    if (sv) return sv;
    if (!loading) loading = import(chrome.runtime.getURL('build/streetview.js'));
    sv = await loading;
    return sv;
  }

  async function check() {
    const url = location.href;
    if (url === lastUrl) return;
    lastUrl = url;
    const view = parseStreetView(url);
    bar.classList.toggle('streetview', !!view);
    if (view && enabled) {
      const m = await loadModule();
      if (lastUrl !== url || !enabled) return;
      if (document.getElementById('walk3d-sv-avatar')) m.updateView(view);
      else m.show(modelKey, view, onStatus).catch((e) => console.error('[Walk 3D]', e));
    } else if (sv) {
      sv.hide();
      onStatus('idle');
    }
  }

  avatarBtn.addEventListener('click', () => {
    enabled = !enabled;
    chrome.storage.local.set({ svAvatar: enabled });
    render();
    lastUrl = '';
    check();
  });

  chrome.storage.local
    .get(['svAvatar', 'walkState'])
    .then(({ svAvatar, walkState }) => {
      enabled = svAvatar !== false;
      if (walkState?.model) modelKey = walkState.model;
    })
    .finally(() => {
      render();
      check();
      // Googleマップは画面遷移しても再読み込みしないので URL を監視する。
      // 設定(ON/OFF・キャラクター)を読んでから始める(先に始めると OFF でも表示されることがある)
      setInterval(check, 250);
    });
  chrome.storage.onChanged.addListener((changes) => {
    const next = changes.walkState?.newValue?.model;
    if (next && next !== modelKey) {
      modelKey = next;
      if (sv) sv.hide();
      lastUrl = '';
      check();
    }
  });

  render();
})();
