window.SENTENCE_LEVEL_CONFIG = {
  templateType: "sentence-course",
  defaults: {
    background: "assets/images/course-background.png",
    feedback: {
      correct: "assets/audio/feedback/v3/correctSpeak.mp3",
      wrong: "assets/audio/feedback/wrong.mp3",
      popup: "assets/audio/feedback/v3/PopUpOpen.MP3",
      success: "assets/audio/feedback/v3/GameSucceed.MP3",
      correctSpeak: "assets/audio/feedback/v3/correctSpeak.mp3",
      showCoin: "assets/audio/feedback/v3/showCoin.mp3",
      getCoin: "assets/audio/feedback/v3/only_get_coin.mp3"
    },
    grammar: {
      label: "语法新学",
      title: "〜うちに",
      pattern: "Vない＋うちに、NをVておきます。",
      meaning: "趁某种状态还没有改变，先完成后面的动作。",
      explanation: "<color=#E76D30>〜ないうちに</color>表示在情况变化前完成动作；后项常搭配「〜ておきます」，表示事先做好准备。"
    }
  },
  lesson: {
    title: "在旅馆办理入住并安排行动",
    finishCopy: "已经完成「〜うちに」的语法、听力和句子训练。",
    grammar: { image: "assets/images/npc-right-1.png" },
    items: [
      {
        id: "check-in-before-crowded", npc: "assets/images/npc-right-1.png", sceneImage: "assets/images/scenes/front-desk.png",
        dialogue: { jp: "ロビーはこれから混みそうですね。", reading: "ロビーはこれからこみそうですね", zh: "大堂接下来好像会变拥挤。", speaker: "店主" },
        jp: "ロビーが混雑しないうちに、チェックインをしておきます。", zh: "趁大堂还没变挤，我先办理入住。",
        chunks: [{ jp: "ロビーが混雑しないうちに", zh: "趁大堂还没变挤" }, { jp: "チェックインをしておきます。", zh: "我先办理入住。" }],
        grammarCloze: {
          zhPrompt: "趁大堂还没变挤，我先办理入住。",
          lookupSegments: [{ jp: "ロビーが混雑しないうちに", zh: "趁大堂还没变挤，" }, { jp: "チェックインをしておきます", zh: "我先办理入住。" }],
          groups: [
            { label: "趁大堂还没变挤", before: "ロビーが", after: "", options: ["混雑しないうちに", "混雑したあとで"], answer: "混雑しないうちに" },
            { label: "我先办理入住", before: "チェックインを", after: "。", options: ["しておきます", "しています"], answer: "しておきます" }
          ],
          explanation: "「混雑しないうちに」表示在大堂变拥挤之前完成办理入住；「〜ておきます」表示事先完成动作。"
        },
        listenFill: { parts: ["ロビーが混雑しないうちに", "チェックインをしておきます。"], blank: 1, options: ["チェックインをしておきます", "予約を変更します"] },
        listening: { audioText: "朝、旅館へ向かう途中で、午後から雨が強くなると聞きました。ロビーが混雑しないうちにチェックインをして、昼までに温泉に入ることにしました。", prompt: "说话人为什么决定早点办理入住？", options: ["雨がやんだからです", "ロビーが混雑する前にチェックインをしたかったからです", "ホテルで切符を買えるからです"], answer: 1 }
      },
      {
        id: "confirm-before-closing", npc: "assets/images/npc-right-2.png", sceneImage: "assets/images/scenes/front-desk.png",
        dialogue: { jp: "フロントはもうすぐ閉まります。", reading: "フロントはもうすぐしまります", zh: "前台马上就要关闭了。", speaker: "店主" },
        jp: "フロントが閉まらないうちに、予約を確認しておきます。", zh: "趁前台还没关闭，我先确认预订。",
        chunks: [{ jp: "フロントが閉まらないうちに", zh: "趁前台还没关闭" }, { jp: "予約を確認しておきます。", zh: "我先确认预订。" }],
        grammarCloze: {
          zhPrompt: "趁前台还没关闭，我先确认预订。",
          lookupSegments: [{ jp: "フロントが閉まらないうちに", zh: "趁前台还没关闭，" }, { jp: "予約を確認しておきます", zh: "我先确认预订。" }],
          groups: [
            { label: "趁前台还没关闭", before: "フロントが", after: "", options: ["閉まらないうちに", "閉まったあとで"], answer: "閉まらないうちに" },
            { label: "我先确认预订", before: "予約を", after: "。", options: ["確認しておきます", "変更しています"], answer: "確認しておきます" }
          ],
          explanation: "「閉まらないうちに」表示要在前台关闭之前完成确认；后项用「確認しておきます」表达事先确认。"
        },
        listenFill: { parts: ["フロントが閉まらないうちに", "予約を確認しておきます。"], blank: 1, options: ["予約を確認しておきます", "部屋へ戻ります"] },
        listening: { audioText: "夕方、フロントはもうすぐ閉まると案内されました。明日の朝食時間をまだ確認していなかったので、閉まらないうちに予約内容と一緒に確認しておきます。", prompt: "说话人为什么要在前台关闭前确认预订？", options: ["朝食時間と予約内容をまだ確認していなかったからです", "雨が強くなったからです", "部屋へ戻りたかったからです"], answer: 0 }
      },
      {
        id: "return-before-rain", npc: "assets/images/npc-right-3.png", sceneImage: "assets/images/scenes/room.png",
        dialogue: { jp: "午後から雨が強くなるそうです。", reading: "ごごからあめがつよくなるそうです", zh: "听说下午开始雨会变大。", speaker: "店主" },
        jp: "雨が強くならないうちに、ホテルへ戻る準備をしておきます。", zh: "趁雨还没变大，我先做好返回酒店的准备。",
        chunks: [{ jp: "雨が強くならないうちに", zh: "趁雨还没变大" }, { jp: "ホテルへ戻る準備をしておきます。", zh: "我先做好返回酒店的准备。" }],
        grammarCloze: {
          zhPrompt: "趁雨还没变大，我先做好返回酒店的准备。",
          lookupSegments: [{ jp: "雨が強くならないうちに", zh: "趁雨还没变大，" }, { jp: "ホテルへ戻る準備をしておきます", zh: "我先做好返回酒店的准备。" }],
          groups: [
            { label: "趁雨还没变大", before: "雨が", after: "", options: ["強くならないうちに", "強くなったあとで"], answer: "強くならないうちに" },
            { label: "先做好返回酒店的准备", before: "ホテルへ戻る準備を", after: "。", options: ["しておきます", "しています"], answer: "しておきます" }
          ],
          explanation: "「強くならないうちに」表示趁雨势还没有增强；「準備をしておきます」表示预先做好准备。"
        },
        listenFill: { parts: ["雨が強くならないうちに", "ホテルへ戻る準備をしておきます。"], blank: 1, options: ["ホテルへ戻る準備をしておきます", "温泉に入ります"] },
        listening: { audioText: "雨が強くならないうちに、ホテルへ戻る準備をしておきます。夕食の時間までに部屋へ戻る予定です。", prompt: "说话人准备在什么时候做好返回酒店的准备？", options: ["雨が強くなる前", "夕食が終わった後", "明日の朝"], answer: 0 }
      }
    ]
  }
};
