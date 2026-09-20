(() => {
  "use strict";

  const config = window.PHRASE_LEVEL_CONFIG;
  if (!config) throw new Error("PHRASE_LEVEL_CONFIG is missing");

  const $ = (selector) => document.querySelector(selector);
  const startScreen = $("#startScreen");
  const lessonScreen = $("#lessonScreen");
  const finishScreen = $("#finishScreen");
  const stageEl = $("#stage");
  const progressFill = $("#progressFill");
  const stepCount = $("#stepCount");
  const lookupPop = $("#lookupPop");
  let lesson = config.lessons.find((item) => item.id === config.defaults.selectedLessonId) || config.lessons[0];
  let stages = [];
  let stageIndex = 0;
  let activeAudio = null;
  let activeAudioResolve = null;
  let lookupTimer = null;
  let oralSkipped = false;
  let furiganaVisible = window.localStorage.getItem("jp-furigana") !== "off";

  const audioFor = (text, explicit) => explicit || window.PHRASE_AUDIO_MAP?.[String(text)] || "";

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const readingEntries = [
    ["朝食会場", "ちょうしょくかいじょう"], ["チェックアウト時間", "チェックアウトじかん"],
    ["保安検査", "ほあんけんさ"], ["搭乗口", "とうじょうぐち"], ["予約内容", "よやくないよう"],
    ["部屋", "へや"], ["食事", "しょくじ"], ["予定", "よてい"], ["到着", "とうちゃく"],
    ["取り出", "とりだ"], ["必要", "ひつよう"], ["税関", "ぜいかん"], ["空港", "くうこう"],
    ["出発", "しゅっぱつ"], ["混雑", "こんざつ"], ["確認", "かくにん"], ["名前", "なまえ"],
    ["時間", "じかん"], ["明日", "あした"], ["戻", "もど"], ["向", "む"], ["後", "あと"],
    ["前", "まえ"], ["今夜", "こんや"], ["今", "いま"], ["朝", "あさ"], ["夜", "よる"],
    ["空", "あ"], ["待", "ま"], ["買", "か"], ["忘", "わす"], ["変更", "へんこう"]
  ];

  function automaticFurigana(value) {
    const source = String(value ?? "");
    let cursor = 0;
    let html = "";
    while (cursor < source.length) {
      const match = readingEntries.find(([word]) => source.startsWith(word, cursor));
      if (!match) {
        html += escapeHTML(source[cursor]);
        cursor += 1;
        continue;
      }
      html += `<ruby>${escapeHTML(match[0])}<rt>${escapeHTML(match[1])}</rt></ruby>`;
      cursor += match[0].length;
    }
    return html;
  }

  const displayJapanese = (jp, reading) => reading
    ? `<ruby>${escapeHTML(jp)}<rt>${escapeHTML(reading)}</rt></ruby>`
    : automaticFurigana(jp);

  function syncFuriganaToggle() {
    document.body.classList.toggle("furigana-off", !furiganaVisible);
    const toggle = $("#furiganaToggle");
    toggle.setAttribute("aria-pressed", String(furiganaVisible));
    toggle.setAttribute("aria-label", furiganaVisible ? "关闭注音" : "开启注音");
  }

  function exposureJapanese(item) {
    const exposure = item.exposure;
    const start = exposure.jp.indexOf(item.core);
    if (start < 0) return displayJapanese(exposure.jp, exposure.reading);
    const end = start + item.core.length;
    return `${displayJapanese(exposure.jp.slice(0, start))}<span class="exposure-target">${displayJapanese(item.core, item.reading)}</span>${displayJapanese(exposure.jp.slice(end))}`;
  }

  const richExplanation = (value) => escapeHTML(value)
    .replace(/&lt;color=#E76D30&gt;(.*?)&lt;\/color&gt;/g, '<span class="mark">$1</span>');

  function splitPunctuation(value) {
    const match = String(value).match(/^(.*?)([、。！？,.!?]+)$/u);
    return match ? { text: match[1], punctuation: match[2] } : { text: String(value), punctuation: "" };
  }

  function showScreen(target) {
    [startScreen, lessonScreen, finishScreen].forEach((screen) => screen.classList.toggle("active", screen === target));
    window.scrollTo(0, 0);
  }

  function buildStages() {
    const vocabularyStages = lesson.items.flatMap((_, itemIndex) => [
      { type: "core", itemIndex },
      { type: "collocation", itemIndex, key: "collocation1" },
      { type: "collocation", itemIndex, key: "collocation2" }
    ]);
    const writtenStages = lesson.items.map((_, itemIndex) => ({ type: "written", itemIndex }));
    const oralStages = lesson.items.map((_, itemIndex) => ({ type: "oral", itemIndex }));
    stages = [...vocabularyStages, ...writtenStages, ...oralStages];
  }

  function renderLessonPicker() {
    $("#lessonPicker").innerHTML = config.lessons.map((item) => `
      <button class="lesson-option ${item.id === lesson.id ? "selected" : ""}" type="button" data-lesson="${item.id}">
        <span class="lesson-number">${item.number}</span>
        <span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.subtitle)}</small></span>
      </button>
    `).join("");
    document.querySelectorAll("[data-lesson]").forEach((button) => button.addEventListener("click", () => {
      lesson = config.lessons.find((item) => item.id === button.dataset.lesson);
      renderLessonPicker();
    }));
  }

  function stopAudio() {
    if (activeAudioResolve) activeAudioResolve();
    activeAudioResolve = null;
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    }
    window.speechSynthesis?.cancel();
  }

  function speak(text, rate = 1) {
    stopAudio();
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) return resolve();
      const utterance = new SpeechSynthesisUtterance(String(text).replace(/[、。]/g, " "));
      utterance.lang = config.defaults.speech.lang;
      utterance.rate = rate;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }

  function playAudio(source, text, slow = false) {
    if (!source) return speak(text, slow ? config.defaults.speech.slowRate : config.defaults.speech.rate);
    stopAudio();
    return new Promise((resolve) => {
      const audio = new Audio(source);
      activeAudio = audio;
      activeAudioResolve = resolve;
      audio.playbackRate = slow ? config.defaults.speech.slowRate : 1;
      let fallingBack = false;
      const finish = () => {
        if (activeAudio === audio) activeAudio = null;
        if (activeAudioResolve === resolve) activeAudioResolve = null;
        resolve();
      };
      const fallback = () => {
        if (fallingBack) return;
        fallingBack = true;
        if (activeAudio === audio) activeAudio = null;
        if (activeAudioResolve === resolve) activeAudioResolve = null;
        void speak(text, slow ? config.defaults.speech.slowRate : 1).then(resolve);
      };
      audio.onended = finish;
      audio.onerror = fallback;
      audio.play().catch(fallback);
    });
  }

  function playFeedback(kind) {
    const source = config.defaults.feedback[kind];
    if (!source) return Promise.resolve();
    const audio = new Audio(source);
    audio.volume = 0.75;
    return new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
  }

  async function playAnswer(text, audio, kind) {
    await playFeedback(kind);
    if (kind === "correct") {
      await new Promise((resolve) => window.setTimeout(resolve, config.defaults.feedback.leadMs));
      await playAudio(audio, text);
    }
  }

  function audioButtons(text, audio) {
    return `<div class="audio-buttons">
      <button class="audio-button" type="button" data-play="${escapeHTML(audioFor(text, audio))}" data-speak="${escapeHTML(text)}" aria-label="常速播放">
        <span aria-hidden="true">▶</span>
      </button>
      <button class="audio-button" type="button" data-play="${escapeHTML(audioFor(text, audio))}" data-speak="${escapeHTML(text)}" data-slow="true" aria-label="慢速播放">
        <span class="slow-mark" aria-hidden="true">慢</span>
      </button>
    </div>`;
  }

  function bindAudio() {
    document.querySelectorAll("[data-play]").forEach((button) => button.addEventListener("click", () => {
      playAudio(button.dataset.play, button.dataset.speak, button.dataset.slow === "true");
    }));
  }

  function showLookup(anchor, text) {
    window.clearTimeout(lookupTimer);
    const rect = anchor.getBoundingClientRect();
    lookupPop.textContent = text;
    lookupPop.style.left = `${Math.min(window.innerWidth - 18, Math.max(18, rect.left + rect.width / 2))}px`;
    lookupPop.style.top = `${Math.max(12, rect.top - 10)}px`;
    lookupPop.classList.add("visible");
    lookupTimer = window.setTimeout(() => lookupPop.classList.remove("visible"), 1200);
    void playFeedback("popup");
  }

  function sceneCard(content, label, showJapanese = false) {
    return `<section class="scene-card">
      <img src="${escapeHTML(content.image)}" alt="例句场景插图">
      <div class="scene-audio">${audioButtons(content.jp, content.audio)}</div>
      <div class="scene-caption ${showJapanese ? "japanese" : ""}">${showJapanese ? displayJapanese(content.jp, content.reading) : escapeHTML(label)}</div>
    </section>`;
  }

  function coreSceneCard(item) {
    const exposure = item.exposure;
    return `<section class="scene-card core-scene-card">
      <img src="${escapeHTML(item.coreImage || item.collocation1.image)}" alt="例句场景插图">
      <div class="scene-caption core-caption">
        <div class="exposure-japanese">${exposureJapanese(item)}</div>
        ${audioButtons(exposure.jp, exposure.audio)}
      </div>
    </section>`;
  }

  function dialogueScene(item, content, showReply = false) {
    return `<section class="dialogue-scene" style="--scene-image:url('${escapeHTML(item.sceneImage)}')">
      <div class="dialogue-character dialogue-left" aria-hidden="true"></div>
      <div class="dialogue-character dialogue-right" style="background-image:url('${escapeHTML(item.dialogue?.npc || "assets/images/npc-right-1.png")}')" aria-hidden="true"></div>
      <div class="dialogue-viewport">
        <div class="dialogue-panel ${showReply ? "reply-panel" : "context-panel"}">
          ${showReply ? `<button class="dialogue-bubble" type="button" data-lookup="" data-lookup-jp="${escapeHTML(content.jp)}" data-lookup-zh="${escapeHTML(content.zh)}" aria-label="查看目标句提示"><span>${displayJapanese(content.jp, content.reading)}</span><small>${escapeHTML(content.zh)}</small></button>` : `<div class="dialogue-context">
            <button class="dialogue-text" type="button" data-lookup="" data-lookup-jp="${escapeHTML(item.dialogue?.jp || "")}" data-lookup-zh="${escapeHTML(item.dialogue?.zh || "")}" aria-label="查看对话提示"><span>${displayJapanese(item.dialogue?.jp || item.dialogue?.zh || "", item.dialogue?.reading)}</span><small>${escapeHTML(item.dialogue?.zh || "")}</small></button>
            ${audioButtons(item.dialogue?.jp || "", item.dialogue?.audio)}
          </div>`}
        </div>
      </div>
    </section>`;
  }

  function npcName(item) {
    const asset = item.dialogue?.npc || "";
    if (asset.includes("npc-right-1")) return "Tummy";
    if (asset.includes("npc-right-2")) return "Quinn";
    if (asset.includes("npc-right-3")) return "Mave";
    return "";
  }

  const speakerTag = (item) => npcName(item)
    ? `<span class="answer-speaker">${escapeHTML(npcName(item))}</span>`
    : "";

  function segmentedTranslation(content) {
    return (content.lookupSegments || content.chunks).map((chunk) => {
      const jp = splitPunctuation(chunk.jp).text;
      const zh = splitPunctuation(chunk.zh);
      return `<button class="translation-segment" type="button" data-lookup="" data-lookup-jp="${escapeHTML(jp)}" data-lookup-zh="${escapeHTML(zh.text)}">${escapeHTML(zh.text)}</button>${escapeHTML(zh.punctuation)}`;
    }).join("");
  }

  function currentBackground() {
    document.body.style.setProperty("--course-background", `url('${lesson.backgroundImage}')`);
  }

  function completeExpression(content) {
    if (!content.chunks?.length) return displayJapanese(content.jp, content.reading);
    return content.chunks.map((chunk) => {
      const part = splitPunctuation(chunk.jp);
      return `<button class="complete-chunk" type="button" data-lookup="" data-lookup-jp="${escapeHTML(part.text)}" data-lookup-zh="${escapeHTML(chunk.zh)}">${displayJapanese(part.text, chunk.reading)}</button>${escapeHTML(part.punctuation)}`;
    }).join("");
  }

  function completeBlock(content, explanation = "", locked = false) {
    const { jp, zh, audio } = content;
    return `<div class="complete-block">
      ${audioButtons(jp, audio)}
      <div class="complete-expression" data-expression="${escapeHTML(jp)}">
        ${completeExpression(content)}
      </div>
      ${explanation ? `<div class="explanation"><strong>词汇讲解</strong><p>${richExplanation(explanation)}</p></div>` : ""}
      <button class="primary-button continue-button" type="button" data-next ${locked ? "disabled" : ""}>继续</button>
    </div>`;
  }

  function setControlsDisabled(selector, disabled) {
    document.querySelectorAll(selector).forEach((button) => {
      if (!button.classList.contains("used")) button.disabled = disabled;
    });
  }

  function bindLookups() {
    document.querySelectorAll("[data-lookup]").forEach((button) => button.addEventListener("click", () => {
      const jp = button.dataset.lookupJp || button.dataset.expression || "";
      const zh = button.dataset.lookupZh || button.dataset.lookup || "";
      showLookup(button, jp && zh ? `${jp}\n${zh}` : (jp || zh));
      if (button.dataset.expression) speak(button.dataset.expression);
    }));
  }

  function bindNext() {
    $("[data-next]")?.addEventListener("click", nextStage);
  }

  function renderCore(itemIndex) {
    const item = lesson.items[itemIndex];
    const content = {
      jp: item.core,
      reading: item.reading,
      zh: item.meaning,
      image: item.coreImage || item.collocation1.image
    };
    const exposure = item.exposure;
    stageEl.innerHTML = `${coreSceneCard(item)}<section class="board core-board">
      <h2><span class="target-word">${displayJapanese(item.core, item.reading)}</span> 在这里的意思是：</h2>
      <div class="meaning-options">
        ${[item.meaning, item.distractors[0]].map((option) => `<button type="button" data-meaning="${escapeHTML(option)}">${escapeHTML(option)}</button>`).join("")}
      </div>
      <div id="meaningResult"></div>
    </section>`;
    bindAudio();
    let busy = false;
    document.querySelectorAll("[data-meaning]").forEach((button) => button.addEventListener("click", async () => {
      if (busy) return;
      if (button.dataset.meaning !== item.meaning) {
        button.classList.remove("wrong");
        void button.offsetWidth;
        button.classList.add("wrong");
        busy = true;
        await playAnswer(item.core, audioFor(item.core), "wrong");
        busy = false;
        window.setTimeout(() => button.classList.remove("wrong"), 500);
        return;
      }
      busy = true;
      document.querySelectorAll("[data-meaning]").forEach((option) => { option.disabled = true; });
      button.classList.add("correct");
      $("#meaningResult").innerHTML = `<div class="explanation"><strong>词汇讲解</strong><p>${richExplanation(item.explanation)}</p></div><button class="primary-button continue-button" type="button" data-next>继续</button>`;
      bindNext();
      void playAnswer(item.core, audioFor(item.core), "correct");
      busy = false;
    }));
    playAudio(audioFor(exposure.jp, exposure.audio), exposure.jp);
  }

  function renderCollocation(itemIndex, key) {
    const item = lesson.items[itemIndex];
    const content = item[key];
    const chunks = content.chunks.map((chunk, index) => ({ ...chunk, index }));
    const optionOrder = [...chunks].sort(() => Math.random() - 0.5);
    const chosen = [];
    let current = 0;
    let busy = false;

    const draw = (complete = false, locked = false) => {
      if (complete) {
        stageEl.innerHTML = `${sceneCard(content, content.zh)}<section class="board compact-board">
          ${completeBlock(content, "", locked)}
        </section>`;
        bindAudio();
        bindLookups();
        bindNext();
        return;
      }

      stageEl.innerHTML = `${sceneCard(content, content.zh)}<section class="board compact-board">
        <h2>请拼出词组：</h2>
        <div class="audio-row">${audioButtons(content.jp, content.audio)}</div>
        <div class="answer-slots">
          ${chunks.map((chunk, index) => {
            const punctuation = splitPunctuation(chunk.jp).punctuation;
            return `<div class="slot-wrap"><div class="answer-slot ${chosen[index] ? "correct" : ""}">
              ${chosen[index] ? `<button type="button" data-chosen="${index}" data-lookup="" data-lookup-jp="${escapeHTML(chunk.jp)}" data-lookup-zh="${escapeHTML(chunk.zh)}">${displayJapanese(splitPunctuation(chunk.jp).text, chunk.reading)}</button>` : ""}
            </div>${punctuation ? `<span class="slot-punctuation">${punctuation}</span>` : ""}</div>`;
          }).join("")}
        </div>
        <div class="chunk-pool">
          ${optionOrder.map((chunk) => `<button class="chunk-button ${chosen.includes(chunk) ? "used" : ""}" type="button" data-chunk="${chunk.index}" ${locked ? "disabled" : ""}>
            ${displayJapanese(splitPunctuation(chunk.jp).text, chunk.reading)}
          </button>`).join("")}
        </div>
      </section>`;
      bindAudio();
      bindLookups();
      document.querySelectorAll("[data-chosen]").forEach((button) => button.addEventListener("click", () => {
        const chunk = chunks[Number(button.dataset.chosen)];
        playAudio(audioFor(chunk.tts || chunk.jp, chunk.audio), chunk.tts || chunk.jp);
      }));
      document.querySelectorAll("[data-chunk]").forEach((button) => button.addEventListener("click", async () => {
        if (busy) return;
        const chunk = chunks[Number(button.dataset.chunk)];
        showLookup(button, `${chunk.jp}\n${chunk.zh}`);
        if (chunk.index !== current) {
          button.classList.remove("wrong");
          void button.offsetWidth;
          button.classList.add("wrong");
          void Promise.all([
            playAudio(audioFor(chunk.tts || chunk.jp, chunk.audio), chunk.tts || chunk.jp),
            playFeedback("wrong")
          ]);
          window.setTimeout(() => button.classList.remove("wrong"), 500);
          return;
        }
        chosen[current] = chunk;
        button.classList.add("correct");
        current += 1;
        const complete = current === chunks.length;
        draw(complete);
        void playFeedback("correct");
        const chunkPlayback = playAudio(audioFor(chunk.tts || chunk.jp, chunk.audio), chunk.tts || chunk.jp);
        if (complete) {
          void chunkPlayback.then(() => playAudio(audioFor(content.jp, content.audio), content.jp));
        }
      }));
    };

    draw();
    playAudio(audioFor(content.jp, content.audio), content.jp);
  }

  function renderSentence(itemIndex, key = "written") {
    const item = lesson.items[itemIndex];
    const content = item[key];
    const chunks = content.chunks.map((chunk, index) => ({ ...chunk, index, isAnswer: true }));
    const distractors = (content.distractors || []).map((jp, index) => ({
      jp,
      zh: "干扰项",
      tts: jp,
      index: `d${index}`,
      isAnswer: false
    }));
    const optionOrder = [...chunks, ...distractors].sort(() => Math.random() - 0.5);
    const chosen = [];
    let current = 0;
    let busy = false;

    const draw = (complete = false, locked = false) => {
      if (complete) {
        stageEl.innerHTML = `${dialogueScene(item, content, true)}<section class="board sentence-board">${speakerTag(item)}${completeBlock(content, "", locked)}</section>`;
        bindAudio();
        bindLookups();
        bindNext();
        return;
      }

      stageEl.innerHTML = `${dialogueScene(item, content)}<section class="board sentence-board">
        ${speakerTag(item)}
        <p class="sentence-label">请翻译：</p>
        <div class="sentence-translation" aria-label="按成分查词">${segmentedTranslation(content)}</div>
        <div class="sentence-answer-slots">
          ${chunks.map((chunk, index) => {
            const punctuation = splitPunctuation(chunk.jp).punctuation;
            return `<div class="slot-wrap"><div class="sentence-slot"><button class="slot-hint" type="button" data-lookup="" data-lookup-jp="${escapeHTML(chunk.jp)}" data-lookup-zh="${escapeHTML(chunk.zh)}">${escapeHTML(chunk.zh)}</button><div class="answer-slot ${chosen[index] ? "correct" : ""}">${chosen[index] ? `<button type="button" data-chosen="${index}" data-lookup="" data-lookup-jp="${escapeHTML(chunk.jp)}" data-lookup-zh="${escapeHTML(chunk.zh)}">${displayJapanese(splitPunctuation(chunk.jp).text, chunk.reading)}</button>` : ""}</div></div>${punctuation ? `<span class="slot-punctuation">${punctuation}</span>` : ""}</div>`;
          }).join("")}
        </div>
        <div class="chunk-pool sentence-pool">
          ${optionOrder.map((chunk) => `<button class="chunk-button ${chosen.includes(chunk) ? "used" : ""}" type="button" data-sentence-chunk="${escapeHTML(chunk.index)}" ${locked ? "disabled" : ""}>${displayJapanese(splitPunctuation(chunk.jp).text, chunk.reading)}</button>`).join("")}
        </div>
      </section>`;
      bindAudio();
      bindLookups();
      document.querySelectorAll("[data-chosen]").forEach((button) => button.addEventListener("click", () => {
        const chunk = chunks[Number(button.dataset.chosen)];
        playAudio(audioFor(chunk.tts || chunk.jp, chunk.audio), chunk.tts || chunk.jp);
      }));
      document.querySelectorAll("[data-sentence-chunk]").forEach((button) => button.addEventListener("click", async () => {
        if (busy) return;
        const chunk = optionOrder.find((option) => String(option.index) === button.dataset.sentenceChunk);
        showLookup(button, `${chunk.jp}\n${chunk.isAnswer ? chunk.zh : "干扰项"}`);
        if (!chunk.isAnswer || chunk.index !== current) {
          button.classList.remove("wrong");
          void button.offsetWidth;
          button.classList.add("wrong");
          void Promise.all([
            playAudio(audioFor(chunk.tts || chunk.jp, chunk.audio), chunk.tts || chunk.jp),
            playFeedback("wrong")
          ]);
          window.setTimeout(() => button.classList.remove("wrong"), 500);
          return;
        }
        chosen[current] = chunk;
        button.classList.add("correct");
        current += 1;
        const complete = current === chunks.length;
        draw(complete);
        void playFeedback("correct");
        const chunkPlayback = playAudio(audioFor(chunk.tts || chunk.jp, chunk.audio), chunk.tts || chunk.jp);
        if (complete) {
          void chunkPlayback.then(() => playAudio(audioFor(content.jp, content.audio), content.jp));
        }
      }));
    };
    draw();
  }

  function renderMeaning(itemIndex) {
    const item = lesson.items[itemIndex];
    const content = item.exposure;
    const options = [item.meaning, ...item.distractors].sort(() => Math.random() - 0.5);
    stageEl.innerHTML = `${sceneCard(content, content.zh, true)}<section class="board meaning-board">
      <h2><span class="target-word">${displayJapanese(item.core, item.reading)}</span> 在这里的意思是：</h2>
      <div class="meaning-options">
        ${options.map((option) => `<button type="button" data-meaning="${escapeHTML(option)}">${escapeHTML(option)}</button>`).join("")}
      </div>
      <div id="meaningResult"></div>
    </section>`;
    bindAudio();
    document.querySelectorAll("[data-meaning]").forEach((button) => button.addEventListener("click", async () => {
      if (button.dataset.meaning !== item.meaning) {
        button.classList.remove("wrong");
        void button.offsetWidth;
        button.classList.add("wrong");
        await playFeedback("wrong");
        window.setTimeout(() => button.classList.remove("wrong"), 500);
        return;
      }
      document.querySelectorAll("[data-meaning]").forEach((option) => { option.disabled = true; });
      button.classList.add("correct");
      await playFeedback("correct");
      $("#meaningResult").innerHTML = `<div class="explanation"><strong>词汇讲解</strong><p>${richExplanation(item.explanation)}</p></div><button class="primary-button continue-button" type="button" data-next>继续</button>`;
      bindNext();
      playAudio(audioFor(content.jp, content.audio), content.jp);
    }));
    playAudio(content.audio, content.jp);
  }

  function renderOral(itemIndex) {
    const item = lesson.items[itemIndex];
    const content = item.oral;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let recording = false;
    let transcript = "";
    let recognitionFailed = false;

    const micIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm-5-3a5 5 0 0 0 10 0M12 16v4m-3 0h6"/></svg>';
    stageEl.innerHTML = `${dialogueScene(item, content)}<section class="board oral-board">
      ${speakerTag(item)}
      <p class="sentence-label">请跟读：</p>
      <div class="oral-target">
        ${audioButtons(content.jp, content.audio)}
        <div class="oral-japanese">${completeExpression(content)}</div>
        <button class="oral-translation" type="button" data-lookup="" data-lookup-jp="${escapeHTML(content.jp)}" data-lookup-zh="${escapeHTML(content.zh)}">${escapeHTML(content.zh)}</button>
      </div>
      <p class="oral-status" id="oralStatus">点击话筒，读出上面的日语</p>
      <button class="record-button" id="recordButton" type="button" aria-label="开始录音"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm-5-3a5 5 0 0 0 10 0M12 16v4m-3 0h6"/></svg></button>
      <button class="skip-oral" id="skipOral" type="button">现在不做口语题</button>
      <div class="oral-transcript" id="oralTranscript"></div>
      <div id="oralResult"></div>
    </section>`;

    const status = $("#oralStatus");
    const transcriptEl = $("#oralTranscript");
    const recordButton = $("#recordButton");
    const normalized = (value) => String(value || "").toLowerCase().replace(/[\s、。！？,.!?「」『』]/gu, "");
    const accepted = [content.jp, ...(content.accepted || [])].map(normalized);
    const skipDialog = $("#oralSkipDialog");
    const closeSkipDialog = () => { skipDialog.hidden = true; };
    $("#skipOral").addEventListener("click", () => {
      skipDialog.hidden = false;
      $("#oralSkipCancel").focus();
    });
    $("#oralSkipCancel").onclick = closeSkipDialog;
    $("#oralSkipConfirm").onclick = () => {
      closeSkipDialog();
      oralSkipped = true;
      renderStage();
    };
    skipDialog.onclick = (event) => { if (event.target === skipDialog) closeSkipDialog(); };

    const resetRecordButton = (label = "开始录音") => {
      recordButton.innerHTML = micIcon;
      recordButton.setAttribute("aria-label", label);
    };

    const finishRecognition = async () => {
      recording = false;
      recordButton.disabled = true;
      resetRecordButton("正在识别");
      status.textContent = "正在识别，请稍候";
      const correct = accepted.some((answer) => normalized(transcript).includes(answer) || answer.includes(normalized(transcript)) && normalized(transcript).length > 5);
      if (!correct) {
        recordButton.disabled = false;
        resetRecordButton("再录一次");
        recordButton.classList.add("wrong");
        status.textContent = transcript ? `识别结果：${transcript}` : "没有识别到完整句子，请再试一次。";
        await playFeedback("wrong");
        window.setTimeout(() => recordButton.classList.remove("wrong"), 500);
        return;
      }
      recordButton.classList.add("correct");
      resetRecordButton("朗读正确");
      status.textContent = `识别结果：${transcript}`;
      await playFeedback("correctSpeak");
      await playAudio(audioFor(content.jp, content.audio), content.jp);
      $("#oralResult").innerHTML = completeBlock(content);
      bindAudio();
      bindLookups();
      bindNext();
    };

    recordButton.addEventListener("click", () => {
      if (!Recognition) {
        status.textContent = "当前浏览器不支持语音识别，请使用 Chrome 后再试。";
        return;
      }
      if (recording) {
        recognition.stop();
        return;
      }
      transcript = "";
      transcriptEl.textContent = "";
      recognition = new Recognition();
      recognition.lang = "ja-JP";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onstart = () => {
        recording = true;
        recordButton.classList.add("recording");
        resetRecordButton("停止录音");
        status.textContent = "正在听，请说出上面的日语。";
      };
      recognition.onresult = (event) => {
        transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
        transcriptEl.textContent = transcript;
      };
      recognition.onerror = () => {
        recognitionFailed = true;
        recording = false;
        recordButton.disabled = false;
        recordButton.classList.remove("recording");
        resetRecordButton("再录一次");
        status.textContent = "没有完成识别，请检查麦克风权限后再试。";
      };
      recognition.onend = () => {
        recordButton.classList.remove("recording");
        if (recognitionFailed) {
          recognitionFailed = false;
          return;
        }
        if (recording) recording = false;
        void finishRecognition();
      };
      try {
        recognition.start();
      } catch {
        recognitionFailed = true;
        recording = false;
        recordButton.disabled = false;
        recordButton.classList.remove("recording");
        resetRecordButton("再录一次");
        status.textContent = "没有完成识别，请再试一次。";
      }
    });
    bindAudio();
    bindLookups();
  }

  function nextStage() {
    stopAudio();
    stageIndex += 1;
    if (stageIndex >= stages.length) {
      void playFeedback("success");
      $("#finishTitle").textContent = `${lesson.title} 完成`;
      $("#finishCopy").textContent = lesson.finishCopy;
      showScreen(finishScreen);
      return;
    }
    renderStage();
  }

  function renderStage() {
    const stage = stages[stageIndex];
    currentBackground();
    progressFill.style.width = `${((stageIndex + 1) / stages.length) * 100}%`;
    stepCount.textContent = `${stageIndex + 1}/${stages.length}`;
    lookupPop.classList.remove("visible");
    window.scrollTo(0, 0);
    if (stage.type === "collocation") renderCollocation(stage.itemIndex, stage.key);
    if (stage.type === "core") renderCore(stage.itemIndex);
    if (stage.type === "written") renderSentence(stage.itemIndex);
    if (stage.type === "oral") oralSkipped ? renderSentence(stage.itemIndex, "oral") : renderOral(stage.itemIndex);
  }

  $("#startButton").addEventListener("click", () => {
    stageIndex = 0;
    oralSkipped = false;
    buildStages();
    renderStage();
    showScreen(lessonScreen);
  });
  $("#closeButton").addEventListener("click", () => { stopAudio(); showScreen(startScreen); });
  $("#restartButton").addEventListener("click", () => { stageIndex = 0; oralSkipped = false; buildStages(); renderStage(); showScreen(lessonScreen); });
  $("#backButton").addEventListener("click", () => showScreen(startScreen));
  $("#furiganaToggle").addEventListener("click", () => {
    furiganaVisible = !furiganaVisible;
    window.localStorage.setItem("jp-furigana", furiganaVisible ? "on" : "off");
    syncFuriganaToggle();
  });

  syncFuriganaToggle();
  renderLessonPicker();
})();
