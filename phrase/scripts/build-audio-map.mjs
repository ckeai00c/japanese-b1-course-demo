import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "assets/audio/generated/generation_manifest_py.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const map = {};
for (const job of manifest.jobs || []) {
  if (!job.ok || !job.text || !job.filename) continue;
  const folder = job.kind === "sentence" ? "sentence_audio" : "chunk_audio";
  map[job.text] ||= `assets/audio/generated/${folder}/${job.filename}`;
  if (job.tts_text) map[job.tts_text] ||= `assets/audio/generated/${folder}/${job.filename}`;
}
const output = `window.PHRASE_AUDIO_MAP = ${JSON.stringify(map, null, 2)};\n`;
fs.writeFileSync(path.join(root, "audio-map.js"), output, "utf8");
console.log(`Wrote ${Object.keys(map).length} audio text mappings.`);
