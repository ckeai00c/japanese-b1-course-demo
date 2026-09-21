(() => {
  const stored = window.localStorage.getItem("jp-pronunciation");
  const state = { mode: stored === "romaji" || stored === "off" ? stored : "kana" };
  const overlay = document.querySelector("#pronunciationOverlay");
  const options = [...document.querySelectorAll("[data-pronunciation]")];
  const table = { きゃ:"kya", きゅ:"kyu", きょ:"kyo", しゃ:"sha", しゅ:"shu", しょ:"sho", ちゃ:"cha", ちゅ:"chu", ちょ:"cho", にゃ:"nya", にゅ:"nyu", にょ:"nyo", ひゃ:"hya", ひゅ:"hyu", ひょ:"hyo", みゃ:"mya", みゅ:"myu", みょ:"myo", りゃ:"rya", りゅ:"ryu", りょ:"ryo", ぎゃ:"gya", ぎゅ:"gyu", ぎょ:"gyo", じゃ:"ja", じゅ:"ju", じょ:"jo", びゃ:"bya", びゅ:"byu", びょ:"byo", ぴゃ:"pya", ぴゅ:"pyu", ぴょ:"pyo", っ:"", あ:"a", い:"i", う:"u", え:"e", お:"o", か:"ka", き:"ki", く:"ku", け:"ke", こ:"ko", さ:"sa", し:"shi", す:"su", せ:"se", そ:"so", た:"ta", ち:"chi", つ:"tsu", て:"te", と:"to", な:"na", に:"ni", ぬ:"nu", ね:"ne", の:"no", は:"ha", ひ:"hi", ふ:"fu", へ:"he", ほ:"ho", ま:"ma", み:"mi", む:"mu", め:"me", も:"mo", や:"ya", ゆ:"yu", よ:"yo", ら:"ra", り:"ri", る:"ru", れ:"re", ろ:"ro", わ:"wa", を:"o", ん:"n", が:"ga", ぎ:"gi", ぐ:"gu", げ:"ge", ご:"go", ざ:"za", じ:"ji", ず:"zu", ぜ:"ze", ぞ:"zo", だ:"da", ぢ:"ji", づ:"zu", で:"de", ど:"do", ば:"ba", び:"bi", ぶ:"bu", べ:"be", ぼ:"bo", ぱ:"pa", ぴ:"pi", ぷ:"pu", ぺ:"pe", ぽ:"po", ゔ:"vu", ー:"-" };
  const kataToHira = (value) => value.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
  const toRomaji = (value) => { let source = kataToHira(String(value)); let result = ""; for (let index = 0; index < source.length; index += 1) { const pair = source.slice(index, index + 2); if (table[pair]) { result += table[pair]; index += 1; continue; } const char = source[index]; if (char === "っ" && source[index + 1]) { const next = table[source[index + 1]] || ""; result += next[0] || ""; continue; } result += table[char] || char; } return result; };
  const refresh = () => { document.body.dataset.pronunciation = state.mode; document.querySelectorAll("rt").forEach((node) => { if (!node.dataset.kana) node.dataset.kana = node.textContent; const target = state.mode === "romaji" ? toRomaji(node.dataset.kana) : node.dataset.kana; if (node.textContent !== target) node.textContent = target; }); options.forEach((option) => { option.classList.toggle("selected", option.dataset.pronunciation === state.mode); }); };
  const close = () => { overlay.hidden = true; };
  document.querySelector("#settingsButton").addEventListener("click", () => { refresh(); overlay.hidden = false; });
  document.querySelector("#pronunciationClose").addEventListener("click", close);
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  options.forEach((option) => option.addEventListener("click", () => { state.mode = option.dataset.pronunciation; window.localStorage.setItem("jp-pronunciation", state.mode); refresh(); }));
  new MutationObserver(refresh).observe(document.querySelector("#stage"), { childList: true, subtree: true });
  refresh();
})();
