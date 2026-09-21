window.PHRASE_COURSE_CONFIG = {
  schemaVersion: 1,
  templateType: "personalized-phrase-course",
  meta: {
    title: "赛后开麦：三句游戏黑话",
    eyebrow: "ANIME GAME TALK · LEVEL 1",
    description: "跟着 Chewchew 学会“带飞、无双、打崩”三组表达，再拼出同一句型的赛后吐槽。",
    tags: ["キャリー", "無双", "沼る"],
    route: [
      { number: 1, label: "新学", active: true },
      { number: 2, label: "复习" },
      { number: 3, label: "新学" },
      { number: 4, label: "复习" }
    ],
    finishTitle: "课程完成",
    finishCopy: "三组游戏黑话和三句统一句型已经通关。"
  },
  theme: {
    coverImage: "assets/images/carry.png",
    backgroundImage: "assets/images/esports-room.png",
    colors: {
      ink: "#3e4667",
      muted: "#7d859d",
      primary: "#4b72ee",
      success: "#45ca91",
      danger: "#ff5757",
      accent: "#f27130"
    }
  },
  audio: {
    root: "assets/audio/course_tts/",
    feedbackRoot: "assets/audio/feedback/",
    correct: "correct.mp3",
    wrong: "wrong.mp3",
    feedbackVersion: 2,
    feedbackLeadMs: 140,
    passScore: 70,
    slowRate: 0.72
  },
  readings: {
    "無": "<ruby>無<rt>む</rt></ruby>",
    "双": "<ruby>双<rt>そう</rt></ruby>",
    "無双": "<ruby>無双<rt>むそう</rt></ruby>",
    "沼り": "<ruby>沼<rt>ぬま</rt></ruby>り",
    "沼ります": "<ruby>沼<rt>ぬま</rt></ruby>ります",
    "沼りました": "<ruby>沼<rt>ぬま</rt></ruby>りました",
    "完全に": "<ruby>完全<rt>かんぜん</rt></ruby>に",
    "普通に": "<ruby>普通<rt>ふつう</rt></ruby>に",
    "無双しました": "<ruby>無双<rt>むそう</rt></ruby>しました",
    "めっちゃ無双してた": "めっちゃ<ruby>無双<rt>むそう</rt></ruby>してた",
    "完全にキャリーしてた": "<ruby>完全<rt>かんぜん</rt></ruby>にキャリーしてた",
    "普通に沼ってた": "<ruby>普通<rt>ふつう</rt></ruby>に<ruby>沼<rt>ぬま</rt></ruby>ってた",
    "普通に勝ってた": "<ruby>普通<rt>ふつう</rt></ruby>に<ruby>勝<rt>か</rt></ruby>ってた",
    "ずっと逃げてた": "ずっと<ruby>逃<rt>に</rt></ruby>げてた",
    "ずっと応援してた": "ずっと<ruby>応援<rt>おうえん</rt></ruby>してた",
    "今日の試合": "<ruby>今日<rt>きょう</rt></ruby>の<ruby>試合<rt>しあい</rt></ruby>",
    "昨日の試合": "<ruby>昨日<rt>きのう</rt></ruby>の<ruby>試合<rt>しあい</rt></ruby>"
  },
  vocabulary: [
    {
      id: "carry",
      word: "キャリー",
      meaning: "带飞",
      distractorMeaning: "被队友拖累",
      wordImage: "assets/images/carry.png",
      phraseImage: "assets/images/phrases/carry-phrase.png",
      wordAudio: "sentence_audio/A01-M-JP キャリー.mp3",
      phrase: "完全にキャリーしました",
      phraseMeaning: "完全带飞了",
      phraseAudio: "sentence_audio/A01-M-JP 完全にキャリーしました.mp3",
      wordChunks: [
        { jp: "キャ", zh: "「キャリー」的前半音节", audio: "chunk_audio/row2_chunk1 キャ.mp3" },
        { jp: "リー", zh: "「キャリー」的后半音节", audio: "chunk_audio/row2_chunk2 リー.mp3" }
      ],
      phraseChunks: [
        { jp: "完全に", zh: "完全地", audio: "chunk_audio/row3_chunk1 完全に.mp3" },
        { jp: "キャリーしました", zh: "带飞了", audio: "chunk_audio/row3_chunk2 キャリーしました.mp3", wide: true }
      ],
      wordExplanation: ["<span class='mark'>キャリーする</span> 来自英语 carry，游戏里指强势带领队伍获胜，也就是“带飞”。"],
      phraseExplanation: ["<span class='mark'>完全に</span> 表示“完全、彻底”，放在前面加强“这局就是我带的”这一语气。"]
    },
    {
      id: "musou",
      word: "無双",
      meaning: "无双；乱杀",
      distractorMeaning: "和平发育",
      wordImage: "assets/images/musou.png",
      phraseImage: "assets/images/phrases/musou-phrase.png",
      wordAudio: "sentence_audio/A01-M-JP 無双.mp3",
      phrase: "めっちゃ無双しました",
      phraseMeaning: "真的乱杀了",
      phraseAudio: "sentence_audio/A01-M-JP めっちゃ無双しました.mp3",
      wordChunks: [
        { jp: "無", zh: "“无”的音读，这里读 む", audio: "chunk_audio/row4_chunk1 無.mp3" },
        { jp: "双", zh: "“双”的音读，这里读 そう", audio: "chunk_audio/row4_chunk2 双.mp3" }
      ],
      phraseChunks: [
        { jp: "めっちゃ", zh: "非常、特别", audio: "chunk_audio/row5_chunk1 めっちゃ.mp3" },
        { jp: "無双しました", zh: "大杀四方了", audio: "chunk_audio/row5_chunk2 無双しました.mp3", wide: true }
      ],
      wordExplanation: ["<span class='mark'>無双する</span> 指以压倒性的表现连续击败对手，游戏聊天里就是“大杀四方”。"],
      phraseExplanation: ["<span class='mark'>めっちゃ</span> 是很口语的“非常、特别”，适合朋友间复盘游戏。"]
    },
    {
      id: "numaru",
      word: "沼ります",
      meaning: "陷入苦战；打得很菜",
      distractorMeaning: "轻松取胜",
      wordImage: "assets/images/numaru.png",
      phraseImage: "assets/images/phrases/numaru-phrase.png",
      wordAudio: "sentence_audio/A01-M-JP 沼ります.mp3",
      phrase: "普通に沼りました",
      phraseMeaning: "真的打得很菜",
      phraseAudio: "sentence_audio/A01-M-JP 普通に沼りました.mp3",
      wordChunks: [
        { jp: "沼り", zh: "陷进去、越打越糟", audio: "chunk_audio/row6_chunk1 沼り.mp3" },
        { jp: "ます", zh: "礼貌语尾", audio: "chunk_audio/row6_chunk2 ます.mp3" }
      ],
      phraseChunks: [
        { jp: "普通に", zh: "说真的、确实", audio: "chunk_audio/row7_chunk1 普通に.mp3" },
        { jp: "沼りました", zh: "陷入苦战了", audio: "chunk_audio/row7_chunk2 沼りました.mp3", wide: true }
      ],
      wordExplanation: ["<span class='mark'>沼る</span> 像陷进沼泽一样，游戏里可指卡住、连续失误、越打越糟。"],
      phraseExplanation: ["这里的 <span class='mark'>普通に</span> 更接近口语中的“说真的、确实”，不是单纯的“普通地”。"]
    }
  ],
  sentences: [
    {
      id: "numaru-sentence",
      sourceVocabularyId: "numaru",
      jp: "ごめん、今日の試合、普通に沼ってたわ（笑）",
      zh: "抱歉，今天这局我真的打得很菜，哈哈。",
      audio: "sentence_audio/A01-M-JP ごめん、今日の試合、普通に沼ってたわ（笑）.mp3",
      chunks: [
        { jp: "ごめん、", zh: "抱歉，", audio: "chunk_audio/row8_chunk1 ごめん、.mp3", distractor: { jp: "ねえ、", zh: "那个、喂", audio: "chunk_audio/row8_chunk2 ねえ、.mp3" } },
        { jp: "今日の試合、", zh: "今天这局，", audio: "chunk_audio/row8_chunk3 今日の試合、.mp3", distractor: { jp: "昨日の試合、", zh: "昨天这局", audio: "chunk_audio/row8_chunk4 昨日の試合、.mp3" } },
        { jp: "普通に沼ってた", zh: "真的打得很菜", audio: "chunk_audio/row10_chunk5 普通に沼ってた.mp3", wide: true, distractor: { jp: "普通に勝ってた", zh: "确实赢了", audio: "chunk_audio/row10_chunk6 普通に勝ってた.mp3", wide: true } },
        { jp: "わ（笑）", zh: "啊，哈哈。", audio: "chunk_audio/row8_chunk7 わ（笑）.mp3", distractor: { jp: "よ（泣）", zh: "哦，哭了", audio: "chunk_audio/row8_chunk8 よ（泣）.mp3" } }
      ],
      explanation: ["三个句子都使用 <span class='mark'>ごめん、今日の試合、～してたわ（笑）</span> 这一套口语句型。", "<span class='mark'>沼ってた</span> 是「沼っていた」的口语缩略，用来轻松自嘲刚才一直打得不顺。"]
    },
    {
      id: "musou-sentence",
      sourceVocabularyId: "musou",
      jp: "ごめん、今日の試合、めっちゃ無双してたわ（笑）",
      zh: "抱歉，今天这局我真的在乱杀，哈哈。",
      audio: "sentence_audio/A01-M-JP ごめん、今日の試合、めっちゃ無双してたわ（笑）.mp3",
      chunks: [
        { jp: "ごめん、", zh: "抱歉，", audio: "chunk_audio/row8_chunk1 ごめん、.mp3", distractor: { jp: "ねえ、", zh: "那个、喂", audio: "chunk_audio/row8_chunk2 ねえ、.mp3" } },
        { jp: "今日の試合、", zh: "今天这局，", audio: "chunk_audio/row8_chunk3 今日の試合、.mp3", distractor: { jp: "昨日の試合、", zh: "昨天这局", audio: "chunk_audio/row8_chunk4 昨日の試合、.mp3" } },
        { jp: "めっちゃ無双してた", zh: "真的在乱杀", audio: "chunk_audio/row9_chunk5 めっちゃ無双してた.mp3", wide: true, distractor: { jp: "ずっと逃げてた", zh: "一直在逃跑", audio: "chunk_audio/row9_chunk6 ずっと逃げてた.mp3", wide: true } },
        { jp: "わ（笑）", zh: "啊，哈哈。", audio: "chunk_audio/row8_chunk7 わ（笑）.mp3", distractor: { jp: "よ（泣）", zh: "哦，哭了", audio: "chunk_audio/row8_chunk8 よ（泣）.mp3" } }
      ],
      explanation: ["保留同一套句型，只把中间的表现替换成 <span class='mark'>めっちゃ無双してた</span>。", "<span class='mark'>～してた</span> 是「～していた」的口语缩略，表示刚才持续处于某种状态。"]
    },
    {
      id: "carry-sentence",
      sourceVocabularyId: "carry",
      jp: "ごめん、今日の試合、完全にキャリーしてたわ（笑）",
      zh: "抱歉，今天这局我完全是在带飞，哈哈。",
      audio: "sentence_audio/A01-M-JP ごめん、今日の試合、完全にキャリーしてたわ（笑）.mp3",
      chunks: [
        { jp: "ごめん、", zh: "抱歉，", audio: "chunk_audio/row8_chunk1 ごめん、.mp3", distractor: { jp: "ねえ、", zh: "那个、喂", audio: "chunk_audio/row8_chunk2 ねえ、.mp3" } },
        { jp: "今日の試合、", zh: "今天这局，", audio: "chunk_audio/row8_chunk3 今日の試合、.mp3", distractor: { jp: "昨日の試合、", zh: "昨天这局", audio: "chunk_audio/row8_chunk4 昨日の試合、.mp3" } },
        { jp: "完全にキャリーしてた", zh: "完全在带飞", audio: "chunk_audio/row8_chunk5 完全にキャリーしてた.mp3", wide: true, distractor: { jp: "ずっと応援してた", zh: "一直在加油", audio: "chunk_audio/row8_chunk6 ずっと応援してた.mp3", wide: true } },
        { jp: "わ（笑）", zh: "啊，哈哈。", audio: "chunk_audio/row8_chunk7 わ（笑）.mp3", distractor: { jp: "よ（泣）", zh: "哦，哭了", audio: "chunk_audio/row8_chunk8 よ（泣）.mp3" } }
      ],
      explanation: ["同样使用 <span class='mark'>ごめん、今日の試合、～してたわ（笑）</span>，中间换成“带飞”的说法。", "句尾 <span class='mark'>わ（笑）</span> 让语气像朋友间开玩笑，不用于正式场合。"]
    }
  ]
};
