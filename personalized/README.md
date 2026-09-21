# 个性化-词组关模板

这是一个无构建依赖的移动端日语个性化课程模板。当前目录保留“キャリー、無双、沼る”示例内容；后续制作漫画、交通、影视、服务会话等主题时，只替换课程配置和素材，不需要复制或重写交互结构。

## 固定工作流

模板固定为 15 个步骤：

1. 第 1 个词：辨义 → 单词 chunk 拼写 → 延伸词组 chunk 拼写
2. 第 2 个词：辨义 → 单词 chunk 拼写 → 延伸词组 chunk 拼写
3. 第 3 个词：辨义 → 单词 chunk 拼写 → 延伸词组 chunk 拼写
4. 句子：按第 3、2、1 个词对应的顺序完成 3 句统一句型
5. 口语：完成 3 句跟读；不保存录音，只根据日语语音识别结果判定

框架统一处理：场景背景、NPC 会话气泡、自动播放、常速/慢速播放、chunk 点击音频、答对/答错音效、错误标红回弹、正确标绿、完成后复现原内容、汉字注音、句子标点固定显示和口语即时判题。词义、单词 chunk 和词组 chunk 页面都会展示对应会话句；用户在任意口语题点击“不做口语题”后，本轮全部口语题都会切换成各自句子的 chunk 拼写题。

正确 chunk 会立即变绿并马上显示下一组或完成页，chunk 音频在后台继续播放，不会锁住下一次操作。新的作答、跳题、退出或重开会停止上一段音频与口语识别，避免旧回调覆盖当前题目。切换到口语替代题时会停止当前整句音频，替代题开始时保持静音；拼句完成后仅保留视觉连续的完整原句。

## 目录

```text
.
├── index.html              # 页面骨架，通常不改
├── course.css              # 模板视觉规范，通常不改
├── course-engine.js        # 15 步课程引擎，通常不改
├── course.config.js        # 每个主题主要修改此文件
├── assets/
│   ├── images/             # 封面、背景、单词图和词组图
│   └── audio/course_tts/   # 整词、词组、整句及 chunk 音频
│   └── audio/feedback/     # 全课程共用的答对/答错反馈音效
├── scripts/validate-template.mjs
└── .github/workflows/pages.yml
```

## 制作新主题

1. 复制整个模板目录，例如命名为 `manga-phrase-course`。
2. 修改 `course.config.js` 中的 `meta`、`theme.scene`、`readings`、`vocabulary` 和 `sentences`。
3. 把新图片放进 `assets/images/`，把音频放进 `assets/audio/course_tts/`。
4. 运行 `npm run validate`。所有检查通过后再预览或上传。
5. 运行 `npm run serve`，打开 [http://127.0.0.1:4173/](http://127.0.0.1:4173/)。

`course.config.js` 中所有素材路径必须使用相对路径，不能以 `/` 开头，这样放在 GitHub Pages 的项目子目录中也能正常加载。

## 配置约束

- `vocabulary` 必须正好 3 项。
- 每个词必须提供词义干扰项、单词图、词组图、整词/词组音频、单词 chunks、词组 chunks 和讲解。
- 同一项的单词图与词组图必须不同。
- `wordChunks` 拼接后必须精确等于 `word`；`phraseChunks` 拼接后必须精确等于 `phrase`。
- `sentences` 必须正好 3 项，每句正好 4 个 chunk，且每个 chunk 有 1 个带音频的干扰项。
- 三句的 `sourceVocabularyId` 必须按第 3、2、1 个词倒序填写。
- 三个句子的第 1、2、4 个 chunk 必须相同，以保证句型统一；第 3 个 chunk 对应三个目标词组。
- 标点仍写在 `jp` 字段末尾，播放器会自动把它从可点击 chunk 中拆出并固定在横线旁。
- `readings` 的值可使用 `<ruby>漢字<rt>かな</rt></ruby>`，用于把假名放在汉字上方。
- `theme.scene` 可配置场景背景、NPC PNG、角色位置和场景提示；引擎不会把任何具体主题写死。
- `audio.passScore` 控制口语通过阈值，默认示例为 70。
- `audio.feedbackRoot`、`audio.correct`、`audio.wrong` 控制答题反馈音效；反馈使用独立音轨，不会中断 chunk 发音。`audio.feedbackLeadMs` 控制提示音领先 chunk 人声的时间，默认 140ms。替换同名音效后递增 `audio.feedbackVersion`，可避免浏览器继续使用旧缓存。
- 修改模板引擎或样式后，同步递增 `index.html` 中 `course.css`、`course.config.js`、`course-engine.js` 的 `?v=` 参数，确保静态部署不会继续运行旧缓存。

## 音频规则

- 整词、词组和整句使用课程平台指定音色。
- 每个可点击 chunk 必须提供独立音频，不能依赖浏览器临时 TTS。
- 音频文件名可以包含日语和空格；配置中的路径必须与文件名完全一致。
- 口语题使用浏览器日语语音识别，只做即时判题，不生成或保存录音文件。

## GitHub Pages

将此目录内容作为 GitHub 仓库根目录提交。随后在仓库的 **Settings → Pages → Source** 中选择 **GitHub Actions**。推送到 `main` 后，工作流会先运行模板校验，通过后自动部署。

提交前建议执行：

```bash
npm run validate
```

若音频和图片使仓库明显增大，可进一步把资源迁移到 CDN，只需在配置中改为可公开访问的 URL，并相应调整校验策略。
