window.PHRASE_COURSE_CONFIG = {
  schemaVersion: 1,
  templateType: "personalized-phrase-course",
  meta: {
    title: "经典名场面 · Lesson 1",
    eyebrow: "PERSONALIZED JAPANESE · LESSON 1",
    description: "在动漫周边店里学习 3 个角色宣言，并完成句型拼写与口语练习。",
    tags: ["最強", "正義", "完璧"],
    route: [
      { number: 1, label: "新学", active: true }, { number: 2, label: "复习" },
      { number: 3, label: "新学" }, { number: 4, label: "复习" }
    ],
    finishTitle: "Lesson 1 完成",
    finishCopy: "最強、正義、完璧，以及「大丈夫。僕、～だから。」句型已经通关。"
  },
  theme: {
    coverImage: "assets/images/lesson-01/anime-store.png",
    backgroundImage: "assets/images/lesson-01/anime-store.png",
    colors: { ink: "#3e4667", muted: "#7d859d", primary: "#4b72ee", success: "#45ca91", danger: "#ff5757", accent: "#f27130" },
    scene: {
      backgroundImage: "assets/images/lesson-01/anime-store.png",
      shopkeeperId: "chewchew",
      characters: {
        chewchew: { name: "ChewChew", role: "店主", image: "assets/images/npcs/scene/chewchew.png" },
        tummy: { name: "Tummy", role: "顾客", image: "assets/images/npcs/scene/tummy.png" },
        mave: { name: "Mave", role: "顾客", image: "assets/images/npcs/scene/mave.png" },
        erwin: { name: "Erwin", role: "顾客", image: "assets/images/npcs/scene/erwin.png" },
        quinn: { name: "Quinn", role: "顾客", image: "assets/images/npcs/scene/quinn.png" }
      }
    }
  },
  audio: {
    root: "assets/audio/course_tts/", npcRoot: "assets/audio/npc/", actorRoot: "assets/audio/actor/",
    voices: {
      machine: "Minami / ja-JP-NanamiNeural", shopkeeper: "ChewChew / A01-M-JP",
      tummy: "Tummy / A02-M-JP", mave: "Mave / A03-F-JP",
      erwin: "Erwin / A04-M-JP / pitch -200", quinn: "Quinn / A05-F-JP"
    },
    feedbackRoot: "assets/audio/feedback/", correct: "correct.mp3", wrong: "wrong.mp3",
    feedbackVersion: 3, feedbackLeadMs: 140, passScore: 70, slowRate: 0.72
  },
  testing: {
    oralAlwaysPass: true
  },
  readings: {
    "最": "<ruby>最<rt>さい</rt></ruby>", "強": "<ruby>強<rt>きょう</rt></ruby>", "最強": "<ruby>最強<rt>さいきょう</rt></ruby>",
    "正": "<ruby>正<rt>せい</rt></ruby>", "義": "<ruby>義<rt>ぎ</rt></ruby>", "正義": "<ruby>正義<rt>せいぎ</rt></ruby>",
    "完": "<ruby>完<rt>かん</rt></ruby>", "璧": "<ruby>璧<rt>ぺき</rt></ruby>", "完璧": "<ruby>完璧<rt>かんぺき</rt></ruby>",
    "大丈夫": "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>", "僕": "<ruby>僕<rt>ぼく</rt></ruby>",
    "大丈夫。僕、最強だから。": "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>。<ruby>僕<rt>ぼく</rt></ruby>、<ruby>最強<rt>さいきょう</rt></ruby>だから。",
    "大丈夫。僕、正義だから。": "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>。<ruby>僕<rt>ぼく</rt></ruby>、<ruby>正義<rt>せいぎ</rt></ruby>だから。",
    "大丈夫。僕、完璧だから。": "<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>。<ruby>僕<rt>ぼく</rt></ruby>、<ruby>完璧<rt>かんぺき</rt></ruby>だから。"
  },
  vocabulary: [
    {
      id: "saikyo", word: "最強", meaning: "无敌；最强", distractorMeaning: "勉强",
      wordImage: "assets/images/lesson-01/saikyo-word-v2.png", phraseImage: "assets/images/lesson-01/saikyo-phrase-v3.png",
      wordAudio: "words/saikyo.mp3", phrase: "最強だから", phraseMeaning: "因为是最强的", phraseAudio: "phrases/saikyo-dakara.mp3",
      wordChunks: [
        { jp: "最", zh: "「最強」的前半部分", audio: "word-chunks/sai.mp3" },
        { jp: "強", zh: "「最強」的后半部分", audio: "word-chunks/kyo.mp3" }
      ],
      phraseChunks: [
        { jp: "最強", zh: "最强", audio: "phrase-chunks/saikyo.mp3" },
        { jp: "だから", zh: "因为", audio: "phrase-chunks/dakara.mp3" }
      ],
      wordExplanation: [
        "<span class='mark'>最強</span> 是“最强”；<span class='mark'>最</span> 是表示程度很深的接头词。",
        "类似的常见组合还有 <span class='mark'>最高</span>（最好、最棒）和 <span class='mark'>最低</span>（最差）。"
      ],
      phraseExplanation: ["<span class='mark'>～だから</span> 表示“因为……”。名词或な形容词后接 <span class='mark'>だ＋から</span> 来说明理由。"]
    },
    {
      id: "seigi", word: "正義", meaning: "正义的", distractorMeaning: "正确",
      wordImage: "assets/images/lesson-01/seigi-word-v2.png", phraseImage: "assets/images/lesson-01/seigi-phrase-v3.png",
      wordAudio: "words/seigi.mp3", phrase: "正義だから", phraseMeaning: "因为是正义的", phraseAudio: "phrases/seigi-dakara.mp3",
      wordChunks: [
        { jp: "正", zh: "「正義」的前半部分", audio: "word-chunks/sei.mp3" },
        { jp: "義", zh: "「正義」的后半部分", audio: "word-chunks/gi.mp3" }
      ],
      phraseChunks: [
        { jp: "正義", zh: "正义", audio: "phrase-chunks/seigi.mp3" },
        { jp: "だから", zh: "因为", audio: "phrase-chunks/dakara.mp3" }
      ],
      wordExplanation: [
        "<span class='mark'>正義</span> 是“正义”，常与 <span class='mark'>悪</span> 对比，表示价值立场或正确的一方。",
        "这个词在角色口号、作品标题和带有中二感的自我宣言中很常见。"
      ],
      phraseExplanation: []
    },
    {
      id: "kanpeki", word: "完璧", meaning: "完美的", distractorMeaning: "完成",
      wordImage: "assets/images/lesson-01/kanpeki-word-v2.png", phraseImage: "assets/images/lesson-01/kanpeki-phrase-v3.png",
      wordAudio: "words/kanpeki.mp3", phrase: "完璧だから", phraseMeaning: "因为是完美的", phraseAudio: "phrases/kanpeki-dakara.mp3",
      wordChunks: [
        { jp: "完", zh: "「完璧」的前半部分", audio: "word-chunks/kan.mp3" },
        { jp: "璧", zh: "「完璧」的后半部分", audio: "word-chunks/peki.mp3" }
      ],
      phraseChunks: [
        { jp: "完璧", zh: "完美", audio: "phrase-chunks/kanpeki.mp3" },
        { jp: "だから", zh: "因为", audio: "phrase-chunks/dakara.mp3" }
      ],
      wordExplanation: [
        "<span class='mark'>完璧</span> 是“完美、毫无缺点”，属于な形容词；修饰名词时常说 <span class='mark'>完璧な</span>。",
        "可以用来形容计划、表现或设定非常完整。"
      ],
      phraseExplanation: []
    }
  ],
  sentences: [
    {
      id: "kanpeki-sentence", sourceVocabularyId: "kanpeki", jp: "大丈夫。僕、完璧だから。", zh: "不用担心，因为我是完美的。",
      exposureAudio: "大丈夫3.mp3", buildAudio: "sentence/tummy-kanpeki.mp3", followAudio: "sentence/quinn-kanpeki.mp3",
      buildCustomerId: "tummy", followCustomerId: "quinn", dialoguePosition: "after",
      dialogue: {
        jp: "へえ、すごいね。", zh: "哇，好厉害啊。", audio: "shopkeeper/chewchew-response.mp3",
        groups: [
          { jp: "へえ、", zh: "哇、诶——", audio: "dialogue-chunks/hee.mp3" },
          { jp: "すごいね。", zh: "好厉害啊。", audio: "dialogue-chunks/sugoi-ne.mp3" }
        ]
      },
      chunks: [
        { jp: "大丈夫。", zh: "不用担心。", audio: "sentence-chunks/daijobu.mp3", distractor: { jp: "危ない。", zh: "很危险。", audio: "sentence-chunks/abunai.mp3" } },
        { jp: "僕、", zh: "我，", audio: "sentence-chunks/boku.mp3", distractor: { jp: "君、", zh: "你，", audio: "sentence-chunks/kimi.mp3" } },
        { jp: "完璧", zh: "完美的", audio: "sentence-chunks/kanpeki.mp3", distractor: { jp: "最強", zh: "最强的", audio: "sentence-chunks/saikyo.mp3" } },
        { jp: "だから。", zh: "因为。", audio: "sentence-chunks/dakara.mp3", distractor: { jp: "なのに。", zh: "明明……却。", audio: "sentence-chunks/nanoni.mp3" } }
      ],
      explanation: [
        "<span class='mark'>大丈夫。僕、～だから。</span> 表示“放心吧，因为我是……”。",
        "<span class='mark'>大丈夫</span> 是“没关系、没事”；<span class='mark'>僕</span> 是语气较柔和的男性第一人称。"
      ]
    },
    {
      id: "seigi-sentence", sourceVocabularyId: "seigi", jp: "大丈夫。僕、正義だから。", zh: "不用担心，因为我是正义的。",
      exposureAudio: "sentences/seigi-exposure-minami.mp3", exposureVoice: "machine", buildAudio: "sentence/mave-seigi-v3.mp3", followAudio: "sentence/tummy-seigi-v3.mp3",
      buildCustomerId: "mave", followCustomerId: "tummy", dialoguePosition: "after",
      dialogue: {
        jp: "へえ、すごいね。", zh: "哇，好厉害啊。", audio: "shopkeeper/chewchew-response.mp3",
        groups: [
          { jp: "へえ、", zh: "哇、诶——", audio: "dialogue-chunks/hee.mp3" },
          { jp: "すごいね。", zh: "好厉害啊。", audio: "dialogue-chunks/sugoi-ne.mp3" }
        ]
      },
      chunks: [
        { jp: "大丈夫。", zh: "不用担心。", audio: "sentence-chunks/daijobu.mp3", distractor: { jp: "危ない。", zh: "很危险。", audio: "sentence-chunks/abunai.mp3" } },
        { jp: "僕、", zh: "我，", audio: "sentence-chunks/boku.mp3", distractor: { jp: "君、", zh: "你，", audio: "sentence-chunks/kimi.mp3" } },
        { jp: "正義", zh: "正义的", audio: "sentence-chunks/seigi.mp3", distractor: { jp: "完璧", zh: "完美的", audio: "sentence-chunks/kanpeki.mp3" } },
        { jp: "だから。", zh: "因为。", audio: "sentence-chunks/dakara.mp3", distractor: { jp: "なのに。", zh: "明明……却。", audio: "sentence-chunks/nanoni.mp3" } }
      ],
      explanation: ["<span class='mark'>大丈夫。僕、～だから。</span> 保持不变，只把角色的自我定义换成 <span class='mark'>正義</span>。"]
    },
    {
      id: "saikyo-sentence", sourceVocabularyId: "saikyo", jp: "大丈夫。僕、最強だから。", zh: "不用担心，因为我是无敌的。",
      exposureAudio: "大丈夫1.mp3", buildAudio: "sentence/erwin-saikyo.mp3", followAudio: "sentence/mave-saikyo.mp3",
      buildCustomerId: "erwin", followCustomerId: "mave", dialoguePosition: "after",
      dialogue: {
        jp: "へえ、すごいね。", zh: "哇，好厉害啊。", audio: "shopkeeper/chewchew-response.mp3",
        groups: [
          { jp: "へえ、", zh: "哇、诶——", audio: "dialogue-chunks/hee.mp3" },
          { jp: "すごいね。", zh: "好厉害啊。", audio: "dialogue-chunks/sugoi-ne.mp3" }
        ]
      },
      chunks: [
        { jp: "大丈夫。", zh: "不用担心。", audio: "sentence-chunks/daijobu.mp3", distractor: { jp: "危ない。", zh: "很危险。", audio: "sentence-chunks/abunai.mp3" } },
        { jp: "僕、", zh: "我，", audio: "sentence-chunks/boku.mp3", distractor: { jp: "君、", zh: "你，", audio: "sentence-chunks/kimi.mp3" } },
        { jp: "最強", zh: "无敌的", audio: "sentence-chunks/saikyo.mp3", distractor: { jp: "正義", zh: "正义的", audio: "sentence-chunks/seigi.mp3" } },
        { jp: "だから。", zh: "因为。", audio: "sentence-chunks/dakara.mp3", distractor: { jp: "なのに。", zh: "明明……却。", audio: "sentence-chunks/nanoni.mp3" } }
      ],
      explanation: ["<span class='mark'>大丈夫。僕、～だから。</span> 保持不变，中间替换成 <span class='mark'>最強</span> 来完成角色宣言。"]
    }
  ]
};
