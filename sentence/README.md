# 句子关模板

这是独立的句子关课程模板。课程内容只编辑 `course.config.js`，引擎固定提供语法曝光、语法挖空、听音补全和听力理解四类页面。

默认 10 步：语法曝光 1 步，语法挖空 3 步，听音补全文本 3 步，听力理解 3 步。默认语料来自《日语 B1 前两课 Demo V2 关卡分工版》第 1 课「〜うちに」。句子题的对话场景显示日语目标语和中文释义；左侧 ChewChew 固定，右侧 NPC 按题目配置且不重复。完整句子视觉上连续显示，每个日文 Chunk 与中文提示均可点击查看中日双语释义。

`dialogue.reading` 配置会话注音；`grammarCloze.lookupSegments` 配置中文题干的局部查词映射，所有中文段必须完整拼回 `zhPrompt`。语法挖空答案必须包含语法点及其前面的关联成分，不能只填写语法点本身。听音补全答对后，题面会整体替换为可逐 Chunk 查词的完整原句。

每个题目用 `sceneImage` 配置不含人物的局内底图。`grammarCloze.groups` 定义横向分组，每组包含中文 `label`、日文 `before/after`、两个 `options` 和 `answer`；答对后自动滑到下一组。V3 音效按文件名绑定：`audio_combo*` 连续答对、`PopUpOpen` 查词弹出、`GameSucceed` 通关，口语与金币音效保留为模板字段。

## 本地运行

```bash
npm run validate
npm run serve
```

访问 `http://127.0.0.1:4178/`。
