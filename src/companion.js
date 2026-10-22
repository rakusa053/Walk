// 一緒に散歩している感じを出す「おしゃべり」。アバターの頭の上に吹き出しを出す。
// 3Dマップ(main.js)とストリートビュー(streetview.js)の両方で使う。
// 何を言うかのきっかけ(歩き出した・座った・犬がいた など)は、使う側から say() で渡す。

const LINES = {
  morning: ['おはよう!今日はどこまで歩く?', 'おはよ〜。朝のお散歩、気持ちいいね'],
  day: ['お散歩いこっ!', 'よーし、今日はいっぱい歩こうね', 'どこ行く?ついていくよ!'],
  evening: ['夕方のお散歩っていいよね', 'もうすぐ夕焼けかな。どこ行く?'],
  night: ['夜のお散歩、ちょっとドキドキするね', 'こんばんは。夜道は気をつけて歩こうね'],
  areaStart: ['今日は{name}をお散歩だね', 'ここは{name}だって!'],
  area: ['{name}に来たね!', 'ここは{name}だって', '{name}、どんなところかな?'],
  areaCity: ['{city}の{name}に来たよ!', '{city}に入ったね。ここは{name}だって'],
  walkStart: ['いこいこ!', 'よーし、出発!', 'どっちに行く?'],
  run: ['まってまって〜!', 'はやいよ〜!', '置いていかないで〜'],
  idle: ['ねえねえ、次はどっち?', 'こっちこっち!', 'ぼーっとしてる?いこっ!'],
  sit: ['ちょっと休憩しよっか', 'ふぅ、ひと休み', 'ここ座っていい?'],
  sitLong: ['そろそろ行こっか?', 'いい場所だね〜'],
  stand: ['よし、いこっか!', 'お待たせ!'],
  distance: ['もう{d}も歩いたね!', '{d}歩いたよ。がんばったね!', 'いっしょに{d}歩いたね'],
  target: ['あそこまで行くの?', 'あっちね、りょうかい!'],
  warp: ['{name}にワープ!', '{name}に着いたよ!'],
  dog: ['わんちゃんだ!かわいい〜', 'あ、いぬ!なでたいな〜'],
  cat: ['ねこちゃん!', 'にゃんこ発見!'],
  bird: ['鳥さんがいるよ', 'あ、鳥!'],
  horse: ['お馬さん!?'],
  bus: ['バスだ。乗ってみる?', 'バスが来たね'],
  train: ['電車だ!どこ行くのかな', '電車が見えるね'],
  boat: ['船が見えるね', 'あ、船!'],
  bicycle: ['自転車も気持ちよさそう', '自転車いいなぁ'],
  wave: ['やっほー!'],
  thumbsup: ['やったー!'],
  dance: ['♪〜'],
  peace: ['ピース!'],
  bow: ['よろしくね'],
  spin: ['くるっ!'],
  stretch: ['ん〜っ!'],
  beckon: ['こっちこっち!'],
};

// 写真の中に見つけたら話題にするもの(COCO のラベル → LINES のキー)
export const THING_LABELS = ['dog', 'cat', 'bird', 'horse', 'bus', 'train', 'boat', 'bicycle'];

const MIN_GAP_S = 7; // ふつうのおしゃべりどうしの最低の間隔
const MAX_PENDING = 4; // あとで言う予定のセリフをいくつまで覚えておくか

const STYLE = `
.walk3d-bubble {
  position: fixed; left: 0; top: 0; z-index: 2147482500; pointer-events: none;
  max-width: 260px; padding: 7px 13px; border-radius: 16px;
  background: #fff; color: #333; box-shadow: 0 2px 10px rgba(0, 0, 0, .28);
  font: 600 14px/1.45 "Hiragino Maru Gothic ProN", "Hiragino Sans", "Noto Sans JP", "Yu Gothic", sans-serif;
  overflow-wrap: anywhere; opacity: 0; transition: opacity .25s;
}
.walk3d-bubble.show { opacity: 1; }
.walk3d-bubble::after {
  content: ""; position: absolute; left: 50%; bottom: -7px; margin-left: -7px;
  border: 7px solid transparent; border-bottom: 0; border-top-color: #fff;
}`;

function injectStyle() {
  if (document.getElementById('walk3d-bubble-style')) return;
  const style = document.createElement('style');
  style.id = 'walk3d-bubble-style';
  style.textContent = STYLE;
  (document.head || document.documentElement).appendChild(style);
}

const now = () => performance.now() / 1000;

export class Companion {
  constructor() {
    injectStyle();
    this.el = document.createElement('div');
    this.el.className = 'walk3d-bubble';
    document.documentElement.appendChild(this.el);
    this.enabled = true;
    this.until = 0; // いまの吹き出しを消す時刻
    this.priority = 0;
    this.lastAny = -Infinity;
    this.lastSaid = {};
    this.lastText = {};
    this.pending = []; // 前の吹き出しが終わってから言うこと(優先度の高いものから)
    // 吹き出しの幅の半分と高さ(画面の端からはみ出さないように。長いセリフは 2 行になる)
    this.halfWidth = 0;
    this.height = 0;
  }

  // いま吹き出しが出ているか(話している間はアバターがこちらを向いたり口を動かしたりする)
  get talking() {
    return this.enabled && now() < this.until;
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) {
      this.until = 0;
      this.pending = [];
      this.el.classList.remove('show');
    }
  }

  // key の中からひとつ選んで言う。priority が高いと、いま出ている低いものを上書きする。
  // queue なら、いま言えないとき(別のことを言っている・前のおしゃべりから間がない)は、前の吹き出しが
  // 消えてから言う(犬がいた・走った など、そのときのことなので、7 秒の間隔は待たない)。
  // onSaid は、吹き出しに出たとき(待ってから出たときも)に呼ぶ
  say(key, vars = {}, { priority = 1, cooldown = 30, queue = false, onSaid = null } = {}, ignoreGap = false) {
    if (!this.enabled || !LINES[key]) return false;
    const t = now();
    if (t - (this.lastSaid[key] ?? -Infinity) < cooldown) return false;
    const showing = t < this.until;
    const tooSoon = !ignoreGap && priority < 2 && t - this.lastAny < MIN_GAP_S;
    if ((showing && priority <= this.priority) || (!showing && tooSoon)) {
      if (queue) this.enqueue({ key, vars, priority, cooldown, onSaid, expires: t + 15 });
      return false;
    }
    const choices = LINES[key].filter((s) => s !== this.lastText[key]);
    const pick = choices[Math.floor(Math.random() * choices.length)] || LINES[key][0];
    const text = pick.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
    this.el.textContent = text;
    this.halfWidth = this.el.offsetWidth / 2 + 8;
    this.height = this.el.offsetHeight + 8;
    this.until = t + 2.5 + text.length * 0.12;
    this.priority = priority;
    this.lastSaid[key] = t;
    this.lastText[key] = pick;
    this.lastAny = t;
    onSaid?.();
    return true;
  }

  // 同じキーは新しいほうだけ。優先度の高いものから並べ、多すぎたら低いものを捨てる
  enqueue(item) {
    this.pending = this.pending.filter((p) => p.key !== item.key).concat(item);
    this.pending.sort((p, q) => q.priority - p.priority || p.expires - q.expires);
    this.pending.length = Math.min(this.pending.length, MAX_PENDING);
  }

  // anchor: 頭の上の画面上の位置 {x, y}(px)。null なら吹き出しを出さない
  update(anchor) {
    const t = now();
    if (this.pending.length && t >= this.until + 0.6) { // 前の吹き出しが消えてから少し間をあける
      this.pending = this.pending.filter((p) => t < p.expires);
      // 待っていたものは、ふつうの間隔の決まりは気にせずに言う
      while (this.pending.length) {
        const p = this.pending.shift();
        if (this.say(p.key, p.vars, { priority: p.priority, cooldown: p.cooldown, onSaid: p.onSaid }, true)) break;
      }
    }
    const visible = this.enabled && anchor && t < this.until;
    this.el.classList.toggle('show', !!visible);
    if (visible) {
      const margin = Math.max(80, this.halfWidth);
      const x = Math.round(Math.max(margin, Math.min(window.innerWidth - margin, anchor.x)));
      const y = Math.round(Math.max(this.height, anchor.y));
      this.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
    }
  }

  dispose() {
    this.el.remove();
  }
}

// 時間帯のあいさつのキー
export function greetingKey(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 10) return 'morning';
  if (h >= 10 && h < 16) return 'day';
  if (h >= 16 && h < 19) return 'evening';
  return 'night';
}

// 一緒に歩いた距離の区切り(100m, 300m, 500m, 1km, 2km, 3km …)。from → to で越えたものを返す
export function passedMilestone(from, to) {
  const marks = [100, 300, 500];
  for (const m of marks) if (from < m && to >= m) return m;
  const k0 = Math.floor(from / 1000);
  const k1 = Math.floor(to / 1000);
  return k1 > k0 && k1 >= 1 ? k1 * 1000 : 0;
}

export function formatDistance(m) {
  return m >= 1000 ? `${Math.round((m / 1000) * 10) / 10}km` : `${Math.round(m)}m`;
}

// いる場所の地名を調べて、変わったら「〇〇に来たね」と言う。
// 地名は background.js が Nominatim で調べる。Nominatim は 1 秒に 1 回までなので、
// 前に調べた場所から 200m 以上動いて、15 秒以上たったときだけ調べる
const GEO_STEP_M = 200;
const GEO_INTERVAL_S = 15;

export class AreaWatcher {
  constructor() {
    this.busy = false;
    this.at = null; // 最後に調べた場所 {lat, lng}
    this.time = -Infinity;
    this.last = null; // いまの地名 {name, city}
  }

  // say(key, vars, onSaid) で一言(言わないときは呼ばない)。吹き出しに出たら onSaid を呼んでもらい、そこで地名を覚える。
  // 出なかったら(返事が来る前や、待っているあいだにストリートビューを出た・おしゃべりを OFF にした)、
  // 覚えずに、次にまた調べる
  check(lat, lng, say) {
    if (this.busy || !Number.isFinite(lat) || !Number.isFinite(lng) || now() - this.time < GEO_INTERVAL_S) return;
    if (this.at) {
      const dn = (lat - this.at.lat) * 111320;
      const de = (lng - this.at.lng) * 111320 * Math.cos((lat * Math.PI) / 180);
      if (Math.hypot(dn, de) < GEO_STEP_M) return;
    }
    this.busy = true;
    this.at = { lat, lng };
    this.time = now();
    chrome.runtime
      .sendMessage({ type: 'reverse-geocode', lat, lng, lang: navigator.language })
      .then((res) => {
        if (res?.error) console.warn('[Walk 3D] 地名を調べられませんでした', res.error);
        const area = areaName(res?.address);
        if (!area?.name) return;
        const prev = this.last;
        let line = null;
        if (!prev) line = ['areaStart', { name: area.name }];
        else if (area.name !== prev.name) {
          line = area.city && prev.city && area.city !== prev.city
            ? ['areaCity', { name: area.name, city: area.city }]
            : ['area', { name: area.name }];
        }
        if (!line) {
          this.last = area;
          return;
        }
        this.at = null; // 吹き出しに出るまでは、また調べてよい
        say(...line, () => {
          this.last = area;
          this.at = { lat, lng };
        });
      })
      .catch((e) => console.warn('[Walk 3D] 地名を調べられませんでした', e))
      .finally(() => {
        this.busy = false;
      });
  }

  // ワープしたときなど、次はすぐ調べる
  reset() {
    this.at = null;
    this.time = -Infinity;
  }
}

// 逆ジオコーディング(Nominatim)の住所から、話題にする地名を選ぶ(〇〇丁目は外す)
export function areaName(address) {
  if (!address) return null;
  const strip = (s) => s?.replace(/[一二三四五六七八九十0-9０-９]+丁目$/, '') || null;
  const name = address.quarter || strip(address.neighbourhood) || address.suburb || address.city_district || address.town || address.village;
  return { name: name || address.city || null, city: address.city || address.town || address.village || null };
}
