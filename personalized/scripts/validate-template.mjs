import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
let imageCount = 0;
let audioCount = 0;

const configSource = read("course.config.js");
const sandbox = { window: {} };
vm.runInNewContext(configSource, sandbox, { filename: "course.config.js" });
const config = sandbox.window.PHRASE_COURSE_CONFIG;
check(Boolean(config), "course.config.js must assign window.PHRASE_COURSE_CONFIG");

if (config) {
  check(config.schemaVersion === 1, "schemaVersion must be 1");
  check(config.templateType === "personalized-phrase-course", "templateType must be personalized-phrase-course");
  check(config.vocabulary?.length === 3, "Template requires exactly 3 vocabulary items");
  check(config.sentences?.length === 3, "Template requires exactly 3 sentences");
  check(config.meta?.route?.length === 4, "Cover requires exactly 4 route markers");
  check(Number.isFinite(config.audio?.passScore), "audio.passScore must be a number");
  check(config.audio?.passScore >= 0 && config.audio?.passScore <= 100, "audio.passScore must be between 0 and 100");
  check(Boolean(config.audio?.feedbackRoot && config.audio?.correct && config.audio?.wrong), "audio must configure correct and wrong feedback sounds");
  check(Number.isFinite(config.audio?.feedbackLeadMs) && config.audio.feedbackLeadMs >= 0, "audio.feedbackLeadMs must be a non-negative number");
  check(Boolean(config.audio?.feedbackVersion), "audio.feedbackVersion is required for cache-safe sound replacement");

  const ids = [...(config.vocabulary || []), ...(config.sentences || [])].map((item) => item.id);
  check(new Set(ids).size === ids.length, "All vocabulary and sentence ids must be unique");

  const assetPaths = new Set([config.theme?.coverImage, config.theme?.backgroundImage]);
  if (config.theme?.scene?.backgroundImage) assetPaths.add(config.theme.scene.backgroundImage);
  (config.theme?.scene?.characters || []).forEach((character) => assetPaths.add(character.image));
  const audioPaths = new Set();
  const addAudio = (relative) => { if (relative) audioPaths.add(path.join(config.audio.root, relative)); };
  if (config.audio?.feedbackRoot) {
    if (config.audio.correct) audioPaths.add(path.join(config.audio.feedbackRoot, config.audio.correct));
    if (config.audio.wrong) audioPaths.add(path.join(config.audio.feedbackRoot, config.audio.wrong));
  }
  const relativeAsset = (value) => typeof value === "string" && !value.startsWith("/") && !/^[a-z]+:/i.test(value);

  for (const [index, item] of (config.vocabulary || []).entries()) {
    const label = `Vocabulary ${index + 1}`;
    check(Boolean(item.id && item.word && item.meaning && item.distractorMeaning), `${label} is missing identity or meaning fields`);
    check(item.wordImage !== item.phraseImage, `${label} must use different word and phrase images`);
    check(item.wordChunks?.length >= 2, `${label} requires at least 2 word chunks`);
    check(item.phraseChunks?.length >= 2, `${label} requires at least 2 phrase chunks`);
    check(item.wordChunks?.map((part) => part.jp).join("") === item.word, `${label} word chunks must reconstruct the word`);
    check(item.phraseChunks?.map((part) => part.jp).join("") === item.phrase, `${label} phrase chunks must reconstruct the phrase`);
    assetPaths.add(item.wordImage); assetPaths.add(item.phraseImage);
    addAudio(item.wordAudio); addAudio(item.phraseAudio);
    [...(item.wordChunks || []), ...(item.phraseChunks || [])].forEach((part) => addAudio(part.audio));
  }

  const sentenceChunks = (config.sentences || []).map((sentence) => sentence.chunks || []);
  const expectedSentenceOrder = [...(config.vocabulary || [])].reverse().map((item) => item.id);
  check((config.sentences || []).every((sentence, index) => sentence.sourceVocabularyId === expectedSentenceOrder[index]), "Sentence order must map to vocabulary items 3, 2, 1");
  for (const [index, sentence] of (config.sentences || []).entries()) {
    const label = `Sentence ${index + 1}`;
    check(sentence.chunks?.length === 4, `${label} requires exactly 4 chunks`);
    check(sentence.chunks?.map((part) => part.jp).join("") === sentence.jp, `${label} chunks must reconstruct the sentence exactly`);
    check(sentence.chunks?.every((part) => part.distractor?.jp && part.distractor?.audio), `${label} requires one distractor with audio per chunk`);
    check(sentence.chunks?.some((part) => /[、。！？]|（笑）|（泣）/.test(part.jp)), `${label} must retain punctuation in fixed slot positions`);
    addAudio(sentence.audio);
    sentence.chunks?.forEach((part) => { addAudio(part.audio); addAudio(part.distractor?.audio); });
  }

  if (sentenceChunks.length === 3 && sentenceChunks.every((chunks) => chunks.length === 4)) {
    check(sentenceChunks.every((chunks) => chunks[0].jp === sentenceChunks[0][0].jp), "The 3 sentences must share the same opening pattern");
    check(sentenceChunks.every((chunks) => chunks[1].jp === sentenceChunks[0][1].jp), "The 3 sentences must share the same context pattern");
    check(sentenceChunks.every((chunks) => chunks[3].jp === sentenceChunks[0][3].jp), "The 3 sentences must share the same ending pattern");
  }

  for (const relative of [...assetPaths, ...audioPaths].filter(Boolean)) {
    check(relativeAsset(relative), `GitHub Pages assets must use relative paths: ${relative}`);
    const file = path.join(root, relative);
    check(fs.existsSync(file), `Missing asset: ${relative}`);
    if (fs.existsSync(file)) check(fs.statSync(file).size > 500, `Asset is unexpectedly small: ${relative}`);
  }
  imageCount = assetPaths.size;
  audioCount = audioPaths.size;
}

const html = read("index.html");
const engine = read("course-engine.js");
const css = read("course.css");
check(html.includes('./course.config.js'), "index.html must load course.config.js");
check(html.includes('./course-engine.js'), "index.html must load course-engine.js");
check(html.includes('./course.css'), "index.html must load course.css");
check(!html.includes("<style>"), "Styles must stay in course.css");
check(!engine.includes("MediaRecorder"), "Oral checking must not save recordings");
check(engine.includes('recognition.lang="ja-JP"'), "Oral checking must use Japanese speech recognition");
check(engine.includes("splitChunk"), "Engine must separate punctuation from clickable chunks");
check(engine.includes('oralMode="chunks"'), "Skipping oral practice must switch all remaining oral stages to chunk questions");
check(engine.includes('playFeedback("correct")'), "Correct answers must play feedback audio");
check(engine.includes('playFeedback("wrong")'), "Wrong answers must play feedback audio");
check(engine.includes("playChunkAnswer"), "Chunk answers must sequence feedback before pronunciation audio");
check(!engine.includes("await playChunkAnswer"), "Chunk pronunciation must not block progression");
check(engine.includes("clearStageActivity"), "Stage changes must cancel stale audio, recognition, and timers");
check(engine.includes('clearStageActivity();renderOralFallback(index)'), "Skipping oral practice must cancel audio and recognition before showing chunks");
check(!engine.includes('${promptHTML(item.groups)}${completeHTML(item.groups,item.audio)}'), "Skipped oral fallback completion must show only the completed sentence");
check(css.includes(".slot-punctuation"), "CSS must style fixed sentence punctuation");
new Function(engine);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`PASS: ${config.vocabulary.length} words, ${config.sentences.length} sentences, ${imageCount} images, ${audioCount} audio references.`);
