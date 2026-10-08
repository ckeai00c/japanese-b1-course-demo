import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const runDir = "/Users/chenying/.codex/cya-business-pack/runs/lesson1-phrase-images-20261008";
await fs.mkdir(runDir, { recursive: true });

const wb = Workbook.create();
const sheet = wb.worksheets.add("图片生成任务");
sheet.showGridLines = false;
sheet.getRange("A1:L1").values = [["Lesson 1 词组语义图生成任务", "", "", "", "", "", "", "", "", "", "", ""]];
sheet.mergeCells("A1:L1");
sheet.getRange("A3:L6").values = [
  ["task_id", "phase", "channel", "input_source", "mode", "model", "size", "quality", "expected_output", "quality_checks", "human_review_required", "execution_status"],
  ["phrase-saikyo", "pilot", "日语个性化课程Demo词组语义图", "personalized/image-prompts-lesson1.md#最強だから", "文生图", "gpt-image-2", "1280x720", "medium", "saikyo-phrase-v3.png", "区别于最強单词图；表现因为最强而让同伴放心；经典名场面；无文字水印", "是", "pending"],
  ["phrase-seigi", "batch_pending", "日语个性化课程Demo词组语义图", "personalized/image-prompts-lesson1.md#正義だから", "文生图", "gpt-image-2", "1280x720", "medium", "seigi-phrase-v3.png", "区别于正義单词图；表现因正义而选择保护弱者；经典名场面；无文字水印", "是", "pending"],
  ["phrase-kanpeki", "batch_pending", "日语个性化课程Demo词组语义图", "personalized/image-prompts-lesson1.md#完璧だから", "文生图", "gpt-image-2", "1280x720", "medium", "kanpeki-phrase-v3.png", "区别于完璧单词图；表现因准备完美而让搭档放心；经典名场面；无文字水印", "是", "pending"],
];
sheet.getRange("A1:L1").format = { fill: "#263A69", font: { name: "Arial", size: 16, bold: true, color: "#FFFFFF" }, verticalAlignment: "center" };
sheet.getRange("A3:L3").format = { fill: "#3564C9", font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true };
sheet.getRange("A4:L6").format = { font: { name: "Arial", size: 10, color: "#26324D" }, verticalAlignment: "top", wrapText: true, borders: { preset: "inside", style: "thin", color: "#D8DFEC" } };
sheet.getRange("A3:L6").format.borders = { preset: "outside", style: "thin", color: "#AEBAD0" };
sheet.getRange("A1:L1").format.rowHeight = 30;
sheet.getRange("A3:L3").format.rowHeight = 34;
sheet.getRange("A4:L6").format.rowHeight = 56;
const widths = [16, 15, 24, 36, 12, 15, 13, 12, 25, 52, 22, 18];
widths.forEach((w, i) => sheet.getRangeByIndexes(0, i, 6, 1).format.columnWidth = w);
sheet.freezePanes.freezeRows(3);
wb.recalculate();
const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${runDir}/preflight.xlsx`);
