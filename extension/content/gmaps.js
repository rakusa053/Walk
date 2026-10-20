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

  // ストリートビューの URL: /maps/@35.67,139.76,3a,75y,305.69h,63.68t/...
  function parseStreetView(url) {
    const m = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)a((?:,[-\d.]+[a-z])*)/);
    if (!m) return null;
    const view = { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    for (const [, v, k] of m[4].matchAll(/,([-\d.]+)([a-z])/g)) {
      if (k === 'h') view.heading = parseFloat(v);
      if (k === 't') view.tilt = parseFloat(v);
    }
    return view;
  }

  function render() {
    avatarBtn.innerHTML = `<span class="walk3d-icon">👧</span><span>アバター ${enabled ? 'ON' : 'OFF'}</span>`;
    avatarBtn.classList.toggle('off', !enabled);
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
      if (lastUrl !== url) return;
      if (document.getElementById('walk3d-sv-avatar')) m.updateView(view);
      else m.show(modelKey, view).catch((e) => console.error('[Walk 3D]', e));
    } else if (sv) {
      sv.hide();
    }
  }

  avatarBtn.addEventListener('click', () => {
    enabled = !enabled;
    chrome.storage.local.set({ svAvatar: enabled });
    render();
    lastUrl = '';
    check();
  });

  chrome.storage.local.get(['svAvatar', 'walkState']).then(({ svAvatar, walkState }) => {
    enabled = svAvatar !== false;
    if (walkState?.model) modelKey = walkState.model;
    render();
    check();
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
  // Googleマップは画面遷移しても再読み込みしないので URL を監視する
  setInterval(check, 250);
})();
