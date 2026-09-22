(() => {
  "use strict";

  const config = window.SENTENCE_LEVEL_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const stageEl = $("#stage");
  const progressTrack = $("#progressTrack");
  const jumpOverlay = $("#jumpOverlay");
  const jumpGrid = $("#jumpGrid");
  const lookupPop = $("#lookupPop");
  let index = 0;
  let activeAudio = null;
  let activeResolve = null;
  let lookupTimer = null;
  let furiganaVisible = window.localStorage.getItem("jp-furigana") !== "off";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const rich = (value) => esc(value).replace(/&lt;color=#E76D30&gt;(.*?)&lt;\/color&gt;/g, '<span class="mark">$1</span>');
  const audioFor = (text, explicit) => explicit || window.PHRASE_AUDIO_MAP?.[String(text)] || "";
  const readingEntries = [
    ["朝食時間", "ちょうしょくじかん"], ["予約内容", "よやくないよう"], ["チェックイン", "チェックイン"],
    ["フロント", "フロント"], ["ロビー", "ロビー"], ["ホテル", "ホテル"],
    ["混雑", "こんざつ"], ["閉", "し"], ["予約", "よやく"], ["確認", "かくにん"],
    ["午後", "ごご"], ["雨", "あめ"], ["強", "つよ"], ["戻", "もど"], ["準備", "じゅんび"],
    ["朝", "あさ"], ["旅館", "りょかん"], ["向", "む"], ["途中", "とちゅう"], ["聞", "き"],
    ["昼", "ひる"], ["温泉", "おんせん"], ["入", "はい"], ["夕方", "ゆうがた"],
    ["明日", "あした"], ["時間", "じかん"], ["一緒", "いっしょ"], ["部屋", "へや"],
    ["夕食", "ゆうしょく"], ["終", "お"], ["前", "まえ"], ["買", "か"], ["切符", "きっぷ"],
    ["変更", "へんこう"]
  ];

  function automaticFurigana(value) {
    const source = String(value ?? "");
    let cursor = 0;
    let html = "";
    while (cursor < source.length) {
      const match = readingEntries.find(([word]) => source.startsWith(word, cursor));
      if (!match) {
        html += esc(source[cursor]);
        cursor += 1;
        continue;
      }
      html += `<ruby>${esc(match[0])}<rt>${esc(match[1])}</rt></ruby>`;
      cursor += match[0].length;
    }
    return html;
  }

  const displayJapanese = (jp, reading) => reading
    ? `<ruby>${esc(jp)}<rt>${esc(reading)}</rt></ruby>`
    : automaticFurigana(jp);

  function stopAudio() {
    if (activeResolve) activeResolve();
    activeResolve = null;
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    window.speechSynthesis?.cancel();
  }

  function play(source, text, slow = false) {
    stopAudio();
    if (!source) {
      if (!("speechSynthesis" in window)) return Promise.resolve();
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        utterance.rate = slow ? 0.72 : 1;
        utterance.onend = resolve;
        utterance.onerror = resolve;
        activeResolve = resolve;
        speechSynthesis.speak(utterance);
      });
    }
    return new Promise((resolve) => {
      const audio = new Audio(source);
      audio.playbackRate = slow ? 0.72 : 1;
      activeAudio = audio;
      activeResolve = resolve;
      const finish = () => {
        if (activeAudio === audio) activeAudio = null;
        if (activeResolve === resolve) activeResolve = null;
        resolve();
      };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    });
  }

  function feedback(kind) {
    const source = config.defaults.feedback[kind];
    if (!source) return;
    const sound = new Audio(source);
    sound.volume = 0.72;
    void sound.play().catch(() => {});
  }

  function showLookup(element, jp, zh) {
    clearTimeout(lookupTimer);
    const rect = element.getBoundingClientRect();
    lookupPop.textContent = jp && zh ? `${jp}\n${zh}` : (jp || zh);
    lookupPop.style.left = `${Math.min(window.innerWidth - 18, Math.max(18, rect.left + rect.width / 2))}px`;
    lookupPop.style.top = `${Math.max(12, rect.top - 8)}px`;
    lookupPop.classList.add("visible");
    lookupTimer = setTimeout(() => lookupPop.classList.remove("visible"), 1500);
    feedback("popup");
  }

  function bindLookups() {
    document.querySelectorAll("[data-lookup-jp]").forEach((element) => element.addEventListener("click", () => {
      showLookup(element, element.dataset.lookupJp, element.dataset.lookupZh);
    }));
  }

  const lookupAttrs = (jp, zh) => `data-lookup-jp="${esc(jp)}" data-lookup-zh="${esc(zh)}"`;
  const choice = (label) => `<button class="choice-button" type="button" data-value="${esc(label)}">${displayJapanese(label)}</button>`;
  const audioButton = (text, source, slow = false) => `<button class="audio-button" type="button" data-audio="${esc(audioFor(text, source))}" data-text="${esc(text)}" ${slow ? 'data-slow="true"' : ""} aria-label="${slow ? "慢速播放" : "常速播放"}">${slow ? '<span class="slow-mark" aria-hidden="true">慢</span>' : '<span aria-hidden="true">▶</span>'}</button>`;
  const audioButtons = (text, source) => `<div class="audio-buttons">${audioButton(text, source)}${audioButton(text, source, true)}</div>`;

  function bindAudio() {
    document.querySelectorAll("[data-audio]").forEach((button) => button.addEventListener("click", () => {
      void play(button.dataset.audio, button.dataset.text, button.dataset.slow === "true");
    }));
  }

  function npcScene(item) {
    return `<section class="npc-scene" style="--scene-image:url('${esc(item.sceneImage)}')">
      <div class="npc npc-left" aria-hidden="true"></div>
      <div class="npc npc-right" style="background-image:url('${esc(item.npc)}')" aria-hidden="true"></div>
      <div class="dialogue-bubble">
        <button class="dialogue-text" type="button" ${lookupAttrs(item.dialogue.jp, item.dialogue.zh)}>
          <strong>${esc(item.dialogue.speaker)}</strong><span>${displayJapanese(item.dialogue.jp, item.dialogue.reading)}</span><small>${esc(item.dialogue.zh)}</small>
        </button>
        ${audioButton(item.dialogue.jp, item.dialogue.audio)}
      </div>
    </section>`;
  }

  function grammarBar() {
    const grammar = config.defaults.grammar;
    return `<button class="grammar-mini" type="button" ${lookupAttrs(grammar.title, grammar.meaning)}>
      <span>${esc(grammar.label)}</span>
      <span class="grammar-copy"><strong>${displayJapanese(grammar.title)}</strong><small>${esc(grammar.meaning)}</small></span>
    </button>`;
  }

  function chunkedSentence(item) {
    return item.chunks.map((chunk) => `<button class="complete-chunk" type="button" ${lookupAttrs(chunk.jp, chunk.zh)}>${displayJapanese(chunk.jp, chunk.reading)}</button>`).join("");
  }

  function segmentedTranslation(item) {
    return (item.grammarCloze.lookupSegments || item.chunks).map((chunk) => {
      const match = chunk.zh.match(/^(.*?)([，。！？,.!?]+)$/u);
      const text = match ? match[1] : chunk.zh;
      const punctuation = match ? match[2] : "";
      return `<button class="translation-segment" type="button" ${lookupAttrs(chunk.jp.replace(/[、。！？,.!?]+$/u, ""), text)}>${esc(text)}</button>${esc(punctuation)}`;
    }).join("");
  }

  function complete(item) {
    return `<div class="complete">
      ${audioButtons(item.jp, item.audio)}
      <div class="complete-text" aria-label="完整句子">${chunkedSentence(item)}</div>
      <button class="primary-button" data-next>继续</button>
    </div>`;
  }

  function renderCompleted(item) {
    stageEl.innerHTML = `<section class="board completed-board">${complete(item)}</section>`;
    bindLookups();
    bindAudio();
    setNext();
  }

  const setNext = () => $("[data-next]")?.addEventListener("click", next);

  function renderGrammarIntro() {
    const grammar = config.defaults.grammar;
    stageEl.innerHTML = `<section class="grammar-card">
      <img src="${esc(config.lesson.grammar.image)}" alt="Tummy 语法老师">
      <span class="grammar-label">${esc(grammar.label)}</span>
      <h2>${displayJapanese(grammar.title)}</h2><p>${esc(grammar.meaning)}</p>
      <div class="grammar-pattern">${displayJapanese(grammar.pattern)}</div>
      ${audioButton(grammar.title, "")}
    </section><section class="board intro-board">
      <div class="explanation"><strong>语法讲解</strong><p>${rich(grammar.explanation)}</p></div>
      <button class="primary-button" data-next>继续</button>
    </section>`;
    bindAudio();
    setNext();
  }

  function renderCloze(item) {
    const content = item.grammarCloze;
    const groups = content.groups;
    let groupIndex = 0;
    stageEl.innerHTML = `${npcScene(item)}<section class="board">
      <h2>请翻译：</h2>
      <div class="translation-prompt" aria-label="按成分查词">${segmentedTranslation(item)}</div>
      <div class="cloze-window">
        <div class="cloze-track" id="clozeTrack">
          ${groups.map((group, position) => `<article class="cloze-group" data-group="${position}">
            <strong>${esc(group.label)}</strong>
            <p>${displayJapanese(group.before)} <span class="blank" data-group-blank="${position}">____</span>${displayJapanese(group.after)}</p>
          </article>`).join("")}
        </div>
      </div>
      <div class="choice-list" id="clozeChoices"></div><div id="result"></div>
    </section>`;

    const renderGroupChoices = () => {
      const group = groups[groupIndex];
      $("#clozeChoices").innerHTML = group.options.map(choice).join("");
      document.querySelectorAll("#clozeChoices .choice-button").forEach((button) => button.addEventListener("click", () => {
        const correct = button.dataset.value === group.answer;
        button.classList.add(correct ? "correct" : "wrong");
        feedback(correct ? "correct" : "wrong");
        if (!correct) return setTimeout(() => button.classList.remove("wrong"), 450);
        document.querySelectorAll("#clozeChoices .choice-button").forEach((entry) => { entry.disabled = true; });
        const blank = document.querySelector(`[data-group-blank="${groupIndex}"]`);
        blank.innerHTML = displayJapanese(group.answer);
        blank.classList.add("answered");
        if (groupIndex < groups.length - 1) {
          setTimeout(() => {
            groupIndex += 1;
            const nextGroup = document.querySelector(`[data-group="${groupIndex}"]`);
            const viewport = $(".cloze-window");
            const centeredLeft = nextGroup.offsetLeft - (viewport.clientWidth - nextGroup.offsetWidth) / 2;
            viewport.scrollTo({ left: Math.max(0, centeredLeft), behavior: "smooth" });
            renderGroupChoices();
          }, 320);
          return;
        }
        setTimeout(() => {
          renderCompleted(item);
          void play(audioFor(item.jp, item.audio), item.jp);
        }, 220);
      }));
    };
    renderGroupChoices();
    bindLookups();
    bindAudio();
  }

  function renderFill(item) {
    const content = item.listenFill;
    const answer = content.options[0];
    const options = [...content.options].sort(() => Math.random() - 0.5);
    const line = content.parts.map((part, partIndex) => partIndex === content.blank
      ? '<span class="blank">____</span>'
      : `<button class="inline-chunk" type="button" ${lookupAttrs(part, item.chunks[partIndex]?.zh || item.zh)}>${displayJapanese(part, item.chunks[partIndex]?.reading)}</button>`).join("");
    stageEl.innerHTML = `${npcScene(item)}<section class="board">
      <h2>听音频，补全句子：</h2><div class="listen-control">${audioButton(item.jp, item.audio)}</div>
      <p class="fill-line">${line}</p>
      <div class="choice-list">${options.map(choice).join("")}</div><div id="result"></div>
    </section>`;
    bindAudio();
    bindLookups();
    document.querySelectorAll(".choice-button").forEach((button) => button.addEventListener("click", () => {
      const correct = button.dataset.value === answer;
      button.classList.add(correct ? "correct" : "wrong");
      feedback(correct ? "correct" : "wrong");
      if (!correct) return setTimeout(() => button.classList.remove("wrong"), 450);
      document.querySelectorAll(".choice-button").forEach((entry) => { entry.disabled = true; });
      renderCompleted(item);
    }));
    void play(audioFor(item.jp, item.audio), item.jp);
  }

  function renderListening(item) {
    const content = item.listening;
    stageEl.innerHTML = `<section class="listen-card"><div class="listen-character"></div>
      <div class="listen-controls">${audioButton(content.audioText, content.audio)}</div><span>听力理解</span>
    </section><section class="board listening-board"><h2>${esc(content.prompt)}</h2>
      <div class="choice-list">${content.options.map(choice).join("")}</div><div id="result"></div>
    </section>`;
    bindAudio();
    document.querySelectorAll(".choice-button").forEach((button, optionIndex) => button.addEventListener("click", () => {
      const correct = optionIndex === content.answer;
      button.classList.add(correct ? "correct" : "wrong");
      feedback(correct ? "correct" : "wrong");
      if (!correct) return setTimeout(() => button.classList.remove("wrong"), 450);
      document.querySelectorAll(".choice-button").forEach((entry) => { entry.disabled = true; });
      renderCompleted(item);
    }));
    void play(audioFor(content.audioText, content.audio), content.audioText);
  }

  function next() {
    stopAudio();
    index += 1;
    if (index >= 10) {
      feedback("success");
      $("#finishTitle").textContent = config.lesson.title;
      $("#finishCopy").textContent = config.lesson.finishCopy;
      $("#lessonScreen").classList.remove("active");
      $("#finishScreen").classList.add("active");
      return;
    }
    render();
  }

  function openJumpPicker() {
    jumpGrid.innerHTML = Array.from({ length: 10 }, (_, itemIndex) => `<button class="jump-option ${itemIndex === index ? "selected" : ""}" type="button" data-jump-index="${itemIndex}">${itemIndex + 1}</button>`).join("");
    jumpOverlay.hidden = false;
    jumpGrid.querySelectorAll("[data-jump-index]").forEach((button) => button.addEventListener("click", () => {
      stopAudio();
      index = Number(button.dataset.jumpIndex);
      jumpOverlay.hidden = true;
      render();
    }));
  }

  function render() {
    window.scrollTo({ top: 0, behavior: "instant" });
    $("#progressFill").style.width = `${((index + 1) / 10) * 100}%`;
    const type = index === 0 ? "intro" : index <= 3 ? "cloze" : index <= 6 ? "fill" : "listen";
    $("#grammarBar").hidden = type === "intro";
    $("#grammarBar").innerHTML = type === "intro" ? "" : grammarBar();
    bindLookups();
    const item = config.lesson.items[Math.max(0, (index - 1) % 3)];
    if (type === "intro") renderGrammarIntro();
    if (type === "cloze") renderCloze(item);
    if (type === "fill") renderFill(item);
    if (type === "listen") renderListening(item);
  }

  $("#startButton").addEventListener("click", () => { index = 0; $("#startScreen").classList.remove("active"); $("#lessonScreen").classList.add("active"); render(); });
  $("#closeButton").addEventListener("click", () => { stopAudio(); $("#lessonScreen").classList.remove("active"); $("#startScreen").classList.add("active"); });
  progressTrack.addEventListener("click", openJumpPicker);
  $("#jumpClose").addEventListener("click", () => { jumpOverlay.hidden = true; });
  jumpOverlay.addEventListener("click", (event) => { if (event.target === jumpOverlay) jumpOverlay.hidden = true; });
  $("#restartButton").addEventListener("click", () => { index = 0; $("#finishScreen").classList.remove("active"); $("#lessonScreen").classList.add("active"); render(); });
})();
