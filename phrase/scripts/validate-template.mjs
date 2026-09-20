import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checkAsset = (relative, label) => check(Boolean(relative) && fs.existsSync(path.join(root, relative)), `${label}: missing asset ${relative}`);
const checkAudio = (relative, label) => {
  const file = relative && path.join(root, relative);
  check(Boolean(file) && fs.existsSync(file) && fs.statSync(file).size > 500, `${label}: missing or empty audio ${relative}`);
};

const sandbox = { window: {} };
vm.runInNewContext(read("course.config.js"), sandbox, { filename: "course.config.js" });
const config = sandbox.window.PHRASE_LEVEL_CONFIG;
check(Boolean(config), "course.config.js must assign window.PHRASE_LEVEL_CONFIG");

if (config) {
  check(config.schemaVersion === 1, "schemaVersion must be 1");
  check(config.templateType === "phrase-course", "templateType must be phrase-course");
  check(config.lessons?.length >= 1, "At least one lesson is required");
  checkAudio(config.defaults?.feedback?.correct, "defaults.feedback.correct");
  checkAudio(config.defaults?.feedback?.wrong, "defaults.feedback.wrong");
  const ids = [];

  for (const lesson of config.lessons || []) {
    check(lesson.items?.length === 3, `${lesson.id}: phrase course requires exactly 3 core items`);
    check(Boolean(lesson.title && lesson.backgroundImage), `${lesson.id}: title and backgroundImage are required`);
    checkAsset(lesson.backgroundImage, `${lesson.id}.backgroundImage`);
    ids.push(lesson.id);
    for (const item of lesson.items || []) {
      ids.push(item.id);
      check(Boolean(item.core && item.reading && item.meaning && item.coreImage), `${item.id}: core, reading, meaning and coreImage are required`);
      check(item.distractors?.length === 1, `${item.id}: meaning questions require exactly 1 distractor`);
      check(Boolean(item.dialogue?.zh && item.dialogue?.jp && item.dialogue?.reading && item.dialogue?.npc), `${item.id}: dialogue needs context, Japanese text, reading and NPC`);
      checkAsset(item.dialogue?.npc, `${item.id}.dialogue.npc`);
      checkAsset(item.sceneImage, `${item.id}.sceneImage`);
      check(Boolean(item.dialogue?.zh && item.dialogue?.jp), `${item.id}: dialogue needs Chinese context and Japanese lookup text`);
      for (const key of ["collocation1", "collocation2"]) {
        const phrase = item[key];
        check(Boolean(phrase?.jp && phrase?.zh && phrase?.image), `${item.id}.${key}: text, translation and image are required`);
        checkAsset(phrase?.image, `${item.id}.${key}.image`);
        check(phrase?.chunks?.length >= 2, `${item.id}.${key}: at least 2 chunks are required`);
        check(phrase?.chunks?.map((chunk) => chunk.jp).join("") === phrase?.jp, `${item.id}.${key}: chunks must reconstruct the phrase exactly`);
        check(phrase?.chunks?.every((chunk) => chunk.zh && (chunk.tts || chunk.jp)), `${item.id}.${key}: every chunk needs translation and TTS text`);
      }
      check(Boolean(item.exposure?.jp && item.exposure?.reading && item.exposure?.zh && item.exposure?.image), `${item.id}: exposure sentence is incomplete`);
      checkAsset(item.exposure?.image, `${item.id}.exposure.image`);
      check(item.written?.chunks?.map((chunk) => chunk.jp).join("") === item.written?.jp, `${item.id}.written: chunks must reconstruct the sentence exactly`);
      check(Boolean(item.written?.zh && item.written?.distractors?.length), `${item.id}.written: sentence prompt and distractors are required`);
      check(item.written?.lookupSegments?.map((segment) => segment.zh).join("") === item.written?.zh, `${item.id}.written: lookup segments must reconstruct the Chinese prompt exactly`);
      check(item.written?.lookupSegments?.every((segment) => segment.jp && segment.zh), `${item.id}.written: every lookup segment needs a Japanese mapping`);
      check(item.written?.lookupSegments?.every((segment) => !/[（(].*助词.*[）)]/u.test(segment.zh)), `${item.id}.written: function-word hints must not appear in the blue Chinese prompt`);
      check(Boolean(item.oral?.jp && item.oral?.zh && item.oral?.accepted?.length), `${item.id}.oral: oral prompt and accepted recognition forms are required`);
      check(item.oral?.chunks?.map((chunk) => chunk.jp).join("") === item.oral?.jp, `${item.id}.oral: skip-oral chunks must reconstruct the sentence exactly`);
      check(Boolean(item.oral?.distractors?.length), `${item.id}.oral: skip-oral distractors are required`);
      check(item.collocation1.image !== item.exposure.image && item.exposure.image !== item.collocation2.image && item.collocation1.image !== item.collocation2.image, `${item.id}: each vocabulary stage needs a different image`);
    }
  }
  check(new Set(ids).size === ids.length, "All lesson and item ids must be unique");
}

const engine = read("course-engine.js");
const css = read("course.css");
const html = read("index.html");
check(html.includes("./course.config.js"), "index.html must load course.config.js");
check(html.includes("./course-engine.js"), "index.html must load course-engine.js");
check(html.includes("./course.css"), "index.html must load course.css");
check(engine.includes("speechSynthesis"), "Missing-audio fallback must use Japanese browser speech synthesis");
check(engine.includes("splitPunctuation"), "Punctuation must stay outside chunks");
check(engine.includes('playFeedback("correct")'), "Correct answers must play feedback audio");
check(engine.includes('playFeedback("wrong")'), "Wrong answers must play feedback audio");
check(!engine.includes('data-next disabled>继续'), "Continue controls must not wait for audio playback to finish");
check(engine.includes("chosen.includes(chunk) ? \"used\""), "Completed chunk options must disappear");
check(engine.includes("type: \"written\""), "Phrase course must include written sentence stages");
check(engine.includes("type: \"oral\""), "Phrase course must include oral stages");
check(engine.includes("SpeechRecognition"), "Oral stages must use speech recognition without saving recordings");
check(engine.includes("skipOral"), "Oral stages must provide a skip control");
check(engine.includes("oralSkipped ? renderSentence"), "Skipping oral stages must use sentence chunk mode");
check(engine.includes("data-lookup-jp=\"${escapeHTML(item.dialogue?.jp"), "Dialogue context must support Japanese lookup");
check(engine.includes("data-lookup-zh"), "Lookup controls must expose Chinese meanings");
check(!engine.includes("dialogueAdvance"), "Dialogue answers must not be revealed by an automatic speaker track");
check(engine.includes("showReply = false"), "Dialogue replies must be gated until the answer is complete");
check(engine.includes("answer-speaker") && engine.includes("Tummy") && engine.includes("Quinn") && engine.includes("Mave"), "Written sentence boards must identify the active NPC");
check(config.defaults?.feedback?.correct?.endsWith("/correctSpeak.mp3"), "Correct answers must use correctSpeak.mp3");
check(engine.includes("segmentedTranslation(content)"), "Written Chinese prompts must support component-level lookup");
check(engine.includes('class="complete-chunk"'), "Completed phrases and sentences must retain component-level lookup");
check(!engine.includes('alt="${escapeHTML(item.meaning)}"'), "Exercise artwork must not expose the correct answer through alt text");
check(css.includes(".translation-segment") && css.includes("border-bottom: 1px dashed"), "Lookup segments must have dashed underlines");
check(engine.includes("stages = [...vocabularyStages, ...writtenStages, ...oralStages]"), "Phrase course stage order must be vocabulary, written sentences, then oral sentences");
check(css.includes("width: min(100%, 394px)"), "Desktop shell must be 394px wide");
check(css.includes(".chunk-button.used { visibility: hidden; }"), "Used chunks must disappear without shifting layout");
check(html.includes('id="furiganaToggle"'), "Lesson header must expose a furigana toggle");
check(engine.includes("automaticFurigana") && engine.includes("readingEntries"), "Japanese text without explicit readings must receive automatic furigana");
check(engine.includes('localStorage.setItem("jp-furigana"'), "Furigana preference must persist");
check(css.includes(".furigana-off rt"), "Furigana toggle must be able to hide all ruby readings");
new Function(engine);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${config.lessons.length} lessons, ${config.lessons.reduce((sum, lesson) => sum + lesson.items.length, 0)} core items, independent phrase-course workflow.`);
