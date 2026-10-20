// Googleマップ上に「3Dで歩く」ボタンを追加する
(() => {
  if (document.getElementById('walk3d-button')) return;
  const btn = document.createElement('button');
  btn.id = 'walk3d-button';
  btn.type = 'button';
  btn.title = 'いまの地図の中心をアバターと3Dで歩く';
  btn.innerHTML = '<span class="walk3d-icon">🚶</span><span>3Dで歩く</span>';
  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'open-walk', url: location.href });
  });
  document.documentElement.appendChild(btn);
})();
