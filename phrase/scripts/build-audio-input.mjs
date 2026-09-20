import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "course.config.js"), "utf8"), sandbox);
const config = sandbox.window.PHRASE_LEVEL_CONFIG;
const csv = ["sentence_audio_text,chunk_audio_text,note"];
const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
let row = 0;
for (const lesson of config.lessons) {
  for (const item of lesson.items) {
    for (const content of [
      { jp: item.core, reading: item.reading },
      item.collocation1,
      item.exposure,
      item.collocation2,
      item.written,
      item.oral
    ]) {
      row += 1;
      const chunks = content.chunks || [];
      csv.push([quote(content.jp), quote(chunks.map((chunk) => chunk.tts || chunk.jp).join("\n")), quote(`${lesson.id}/${item.id}`)].join(","));
    }
  }
}
const output = path.join(root, "scripts", "audio-input.csv");
fs.writeFileSync(output, `${csv.join("\n")}\n`, "utf8");
console.log(`Wrote ${row} source rows to ${output}`);
