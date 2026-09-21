import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const configSandbox = { window: {} };
vm.runInNewContext(read("course.config.js"), configSandbox);
const config = configSandbox.window.SENTENCE_LEVEL_CONFIG;
check(config?.templateType === "sentence-course", "templateType must be sentence-course");
check(config?.lesson?.items?.length === 3, "sentence course requires exactly 3 items");
check(fs.existsSync(path.join(root, config?.lesson?.grammar?.image || "")), "missing grammar image asset");
for (const [name, source] of Object.entries(config?.defaults?.feedback || {})) {
  if (Array.isArray(source)) source.forEach((entry, index) => check(fs.existsSync(path.join(root, entry)), `missing feedback asset ${name}[${index}]`));
  else if (typeof source === "string") check(fs.existsSync(path.join(root, source)), `missing feedback asset ${name}`);
}
for (const item of config?.lesson?.items || []) {
  check(item.jp && item.zh && item.dialogue?.jp && item.dialogue?.reading && item.dialogue?.zh, `${item.id}: sentence, dialogue and dialogue reading are required`);
  check(item.chunks?.length >= 2 && item.chunks.every((chunk) => chunk.jp && chunk.zh), `${item.id}: bilingual lookup chunks are required`);
  check(item.grammarCloze?.groups?.length >= 2, `${item.id}: grammar cloze requires at least 2 sliding groups`);
  check(item.grammarCloze?.groups?.every((group) => group.label && group.options?.length === 2 && group.options.includes(group.answer)), `${item.id}: every cloze group needs a Chinese label, 2 options and a valid answer`);
  check(item.grammarCloze?.groups?.[0]?.answer !== "うちに" && item.grammarCloze?.groups?.[0]?.answer.length > config.defaults.grammar.title.length, `${item.id}: first cloze group must include the related phrase before the grammar point`);
  check(item.grammarCloze?.lookupSegments?.map((segment) => segment.zh).join("") === item.grammarCloze?.zhPrompt, `${item.id}: lookup segments must reconstruct the Chinese prompt exactly`);
  check(item.listenFill?.options?.length === 2, `${item.id}: listening fill requires 2 options`);
  check(item.listening?.options?.length === 3, `${item.id}: listening comprehension requires 3 options`);
  check(item.listening?.audioText && item.listening?.prompt, `${item.id}: listening material and prompt are required`);
  check(item.listening.answer >= 0 && item.listening.answer < 3, `${item.id}: listening answer is out of range`);
  check(fs.existsSync(path.join(root, item.npc)), `${item.id}: missing NPC asset`);
  check(fs.existsSync(path.join(root, item.sceneImage || "")), `${item.id}: missing scene asset`);
}
const engine = read("course-engine.js");
check(engine.includes("grammarCloze"), "missing grammar cloze renderer");
check(engine.includes("listenFill"), "missing listening fill renderer");
check(engine.includes("listening"), "missing listening comprehension renderer");
check(engine.includes("npc-left"), "missing fixed left NPC");
check(engine.includes("dialogue.jp"), "dialogue must expose target language");
check(engine.includes("segmentedTranslation(item)"), "Chinese prompts must support component-level lookup");
check(engine.includes("cloze-track") && engine.includes("centeredLeft") && engine.includes("viewport.scrollTo"), "grammar cloze groups must center the active group after a correct answer");
check(engine.includes("audioButtons(item.jp, item.audio)"), "completed sentences must expose normal and slow playback");
check(!engine.includes("groupProgress"), "grammar cloze must use a visual card peek instead of progress helper text");
check(engine.includes("stageEl.innerHTML = `${npcScene(item)}<section class=\"board completed-board\">"), "completed listening fill must replace the exercise with the full sentence");
check(engine.includes("complete(item, content.explanation)"), "completed grammar cloze must replace grouped prompts with the lookup-enabled full sentence");
check(engine.includes("const options = [...content.options].sort"), "listening fill answer positions must be shuffled");
check(config?.lesson?.grammar?.image === "assets/images/npc-right-1.png", "grammar intro must use the Tummy NPC asset");
check(config.defaults?.feedback?.correct?.endsWith("/correctSpeak.mp3"), "Correct answers must use correctSpeak.mp3");
check(!engine.includes("语法 2222"), "internal question type labels must not appear in UI");
check(read("index.html").includes('id="settingsButton"') && read("index.html").includes('data-pronunciation="romaji"'), "Lesson header must expose pronunciation settings");
check(engine.includes("automaticFurigana") && engine.includes("readingEntries"), "Japanese text without explicit readings must receive automatic furigana");
check(read("index.html").includes('id="pronunciationOverlay"') && read("index.html").includes('data-pronunciation="kana"') && read("index.html").includes('data-pronunciation="off"'), "Pronunciation settings must expose kana, romaji and off modes");
check(read("pronunciation-settings.js").includes('localStorage.setItem("jp-pronunciation"'), "Pronunciation preference must persist");
check(read("pronunciation-settings.js").includes("toRomaji"), "Romaji pronunciation conversion is missing");
check(read("course.css").includes('body[data-pronunciation="off"] rt'), "Pronunciation settings must hide all ruby readings");
check(engine.includes("button.dataset.value === group.answer") && engine.includes("button.dataset.value === answer"), "Furigana markup must not affect answer checking");
new Function(engine);
if (errors.length) { console.error(errors.map((e) => `- ${e}`).join("\n")); process.exit(1); }
console.log("PASS: sentence course template, 3 items, 10-stage flow.");
