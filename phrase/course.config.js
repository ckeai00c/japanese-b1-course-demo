window.PHRASE_LEVEL_CONFIG = {
  schemaVersion: 1,
  templateType: "phrase-course",
  defaults: {
    selectedLessonId: "lesson-01",
    feedback: {
      correct: "assets/audio/feedback/v3/correctSpeak.mp3",
      wrong: "assets/audio/feedback/wrong.mp3",
      popup: "assets/audio/feedback/v3/PopUpOpen.MP3",
      success: "assets/audio/feedback/v3/GameSucceed.MP3",
      correctSpeak: "assets/audio/feedback/v3/correctSpeak.mp3",
      showCoin: "assets/audio/feedback/v3/showCoin.mp3",
      getCoin: "assets/audio/feedback/v3/only_get_coin.mp3",
      leadMs: 120
    },
    speech: {
      lang: "ja-JP",
      rate: 1,
      slowRate: 0.72
    }
  },
  lessons: [
    {
      id: "lesson-01",
      number: 1,
      title: "温泉旅馆入住前后",
      subtitle: "混雑 · 確認 · 戻る",
      backgroundImage: "assets/images/course-background.png",
      finishCopy: "已经掌握温泉旅馆场景中的 6 个常用搭配。",
      items: [
        {
          id: "konzatsu",
          sceneImage: "assets/images/scenes/breakfast.png",
          core: "混雑",
          reading: "こんざつ",
          coreImage: "assets/images/lesson-01/lobby.svg",
          meaning: "拥挤",
          distractors: ["空闲"],
          explanation: "<color=#E76D30>混雑（こんざつ）</color>表示人或车辆很多、空间拥挤。",
          dialogue: { zh: "早餐厅现在人多吗？", jp: "朝食会場は今、混んでいますか。", reading: "ちょうしょくかいじょうはいま、こんでいますか", npc: "assets/images/npc-right-1.png" },
          collocation1: {
            jp: "ロビーの混雑",
            zh: "大堂拥挤的情况",
            image: "assets/images/lesson-01/lobby.svg",
            chunks: [
              { jp: "ロビーの", zh: "大堂的", tts: "ロビーの" },
              { jp: "混雑", reading: "こんざつ", zh: "拥挤", tts: "こんざつ" }
            ]
          },
          exposure: {
            jp: "ロビーが混雑しています。",
            reading: "ロビーがこんざつしています",
            zh: "大堂很拥挤。",
            image: "assets/images/lesson-01/breakfast.svg"
          },
          collocation2: {
            jp: "朝食会場の混雑",
            zh: "早餐厅拥挤的情况",
            image: "assets/images/lesson-01/background.svg",
            chunks: [
              { jp: "朝食会場の", reading: "ちょうしょくかいじょうの", zh: "早餐厅的", tts: "ちょうしょくかいじょうの" },
              { jp: "混雑", reading: "こんざつ", zh: "拥挤", tts: "こんざつ" }
            ]
          },
          target: {
            jp: "朝食会場の混雑がひどいです。",
            zh: "早餐厅非常拥挤。",
            prompt: "工作人员提醒你早餐时段人很多，哪一句最合适？",
            options: ["朝食会場の混雑がひどいです。", "朝食会場は空いています。", "朝食会場は休みです。"]
          },
          written: {
            jp: "ロビーの混雑がひどいです。",
            zh: "大堂非常拥挤。",
            lookupSegments: [
              { jp: "ロビー", zh: "大堂" },
              { jp: "混雑がひどいです", zh: "非常拥挤。" }
            ],
            chunks: [
              { jp: "ロビーの混雑", reading: "ロビーのこんざつ", zh: "大堂的拥挤", tts: "ロビーのこんざつ" },
              { jp: "が", zh: "（主语助词）", tts: "が" },
              { jp: "ひどいです。", reading: "ひどいです", zh: "很严重", tts: "ひどいです" }
            ],
            distractors: ["ロビーは", "きれいな"]
          },
          oral: {
            jp: "朝食会場の混雑がひどいです。",
            zh: "早餐厅非常拥挤。",
            lookupSegments: [
              { jp: "朝食会場", zh: "早餐厅" },
              { jp: "混雑がひどいです", zh: "非常拥挤。" }
            ],
            accepted: ["ちょうしょくかいじょうのこんざつがひどいです"],
            chunks: [
              { jp: "朝食会場の混雑", reading: "ちょうしょくかいじょうのこんざつ", zh: "早餐厅的拥挤", tts: "ちょうしょくかいじょうのこんざつ" },
              { jp: "がひどいです。", reading: "がひどいです", zh: "非常严重", tts: "がひどいです" }
            ],
            distractors: ["朝食会場は", "空いています。"]
          }
        },
        {
          id: "kakunin",
          sceneImage: "assets/images/scenes/front-desk.png",
          core: "確認",
          reading: "かくにん",
          coreImage: "assets/images/lesson-01/desk.svg",
          meaning: "确认",
          distractors: ["取消"],
          explanation: "<color=#E76D30>確認（かくにん）</color>表示核对内容，确保没有错误。",
          dialogue: { zh: "离店前还需要做什么？", jp: "チェックアウトの前に、何を確認しますか。", reading: "チェックアウトのまえに、なにをかくにんしますか", npc: "assets/images/npc-right-2.png" },
          collocation1: {
            jp: "予約内容の確認",
            zh: "确认预订信息",
            image: "assets/images/lesson-01/desk.svg",
            chunks: [
              { jp: "予約内容の", reading: "よやくないようの", zh: "预订信息的", tts: "よやくないようの" },
              { jp: "確認", reading: "かくにん", zh: "确认", tts: "かくにん" }
            ]
          },
          exposure: {
            jp: "名前を確認します。",
            reading: "なまえをかくにんします",
            zh: "确认姓名。",
            image: "assets/images/lesson-01/plan.svg"
          },
          collocation2: {
            jp: "チェックアウト時間の確認",
            zh: "确认退房时间",
            image: "assets/images/lesson-01/lobby.svg",
            chunks: [
              { jp: "チェックアウト時間の", reading: "チェックアウトじかんの", zh: "退房时间的", tts: "チェックアウトじかんの" },
              { jp: "確認", reading: "かくにん", zh: "确认", tts: "かくにん" }
            ]
          },
          target: {
            jp: "チェックアウト時間を確認します。",
            zh: "确认退房时间。",
            prompt: "离店前想核对退房时间，哪一句最合适？",
            options: ["チェックアウト時間を確認します。", "チェックアウト時間を変更します。", "チェックアウト時間を忘れました。"]
          },
          written: {
            jp: "チェックアウト時間を確認します。",
            zh: "确认退房时间。",
            lookupSegments: [
              { jp: "確認します", zh: "确认" },
              { jp: "チェックアウト時間", zh: "退房时间。" }
            ],
            chunks: [
              { jp: "チェックアウト時間", reading: "チェックアウトじかん", zh: "退房时间", tts: "チェックアウトじかん" },
              { jp: "を", zh: "（宾语助词）", tts: "を" },
              { jp: "確認します。", reading: "かくにんします", zh: "确认", tts: "かくにんします" }
            ],
            distractors: ["チェックアウト時間は", "変更します。"]
          },
          oral: {
            jp: "チェックアウト時間を確認します。",
            zh: "确认退房时间。",
            lookupSegments: [
              { jp: "確認します", zh: "确认" },
              { jp: "チェックアウト時間", zh: "退房时间。" }
            ],
            accepted: ["チェックアウトじかんをかくにんします"],
            chunks: [
              { jp: "チェックアウト時間を", reading: "チェックアウトじかんを", zh: "退房时间", tts: "チェックアウトじかんを" },
              { jp: "確認します。", reading: "かくにんします", zh: "确认。", tts: "かくにんします" }
            ],
            distractors: ["チェックアウト時間は", "変更します。"]
          }
        },
        {
          id: "modoru",
          sceneImage: "assets/images/scenes/room.png",
          core: "戻る",
          reading: "もどる",
          coreImage: "assets/images/lesson-01/corridor.svg",
          meaning: "返回；回到",
          distractors: ["离开"],
          explanation: "<color=#E76D30>戻る（もどる）</color>表示回到原来的地方或应该回去的地方。",
          dialogue: { zh: "吃完饭后你准备去哪儿？", jp: "食事の後、どこへ戻る予定ですか。", reading: "しょくじのあと、どこへもどるよていですか", npc: "assets/images/npc-right-3.png" },
          collocation1: {
            jp: "部屋へ戻る時間",
            zh: "回房间的时间",
            image: "assets/images/lesson-01/corridor.svg",
            chunks: [
              { jp: "部屋へ戻る", reading: "へやへもどる", zh: "回房间", tts: "へやへもどる" },
              { jp: "時間", reading: "じかん", zh: "时间", tts: "じかん" }
            ]
          },
          exposure: {
            jp: "部屋へ戻りました。",
            reading: "へやへもどりました",
            zh: "回到房间了。",
            image: "assets/images/lesson-01/room.svg"
          },
          collocation2: {
            jp: "ホテルへ戻る予定",
            zh: "计划回酒店",
            image: "assets/images/lesson-01/desk.svg",
            chunks: [
              { jp: "ホテルへ戻る", reading: "ホテルへもどる", zh: "回酒店", tts: "ホテルへもどる" },
              { jp: "予定", reading: "よてい", zh: "计划", tts: "よてい" }
            ]
          },
          target: {
            jp: "食事の後でホテルへ戻る予定です。",
            zh: "饭后计划回酒店。",
            prompt: "朋友问你吃完饭后的安排，哪一句最合适？",
            options: ["食事の後でホテルへ戻る予定です。", "食事の前にホテルを出ます。", "ホテルには戻りません。"]
          },
          written: {
            jp: "部屋へ戻る時間です。",
            zh: "回房间的时间到了。",
            lookupSegments: [
              { jp: "部屋へ戻る時間", zh: "回房间的时间" },
              { jp: "です", zh: "到了。" }
            ],
            chunks: [
              { jp: "部屋へ戻る時間", reading: "へやへもどるじかん", zh: "回房间的时间", tts: "へやへもどるじかん" },
              { jp: "です。", reading: "です", zh: "到了", tts: "です" }
            ],
            distractors: ["部屋を", "待ちます。"]
          },
          oral: {
            jp: "食事の後でホテルへ戻る予定です。",
            zh: "饭后计划回酒店。",
            lookupSegments: [
              { jp: "食事の後で", zh: "饭后" },
              { jp: "予定です", zh: "计划" },
              { jp: "ホテルへ戻る", zh: "回酒店。" }
            ],
            accepted: ["しょくじのあとでホテルへもどるよていです", "しょくじのあとでほてるへもどるよていです"],
            chunks: [
              { jp: "食事の後でホテルへ戻る", reading: "しょくじのあとでホテルへもどる", zh: "饭后回酒店", tts: "しょくじのあとでホテルへもどる" },
              { jp: "予定です。", reading: "よていです", zh: "计划。", tts: "よていです" }
            ],
            distractors: ["食事の前に", "出発します。"]
          }
        }
      ]
    },
    {
      id: "lesson-02",
      number: 2,
      title: "机场出发流程",
      subtitle: "到着する · 取り出す · 向かう",
      backgroundImage: "assets/images/course-background.png",
      finishCopy: "已经掌握机场场景中的 6 个常用搭配。",
      items: [
        {
          id: "touchaku",
          sceneImage: "assets/images/scenes/front-desk.png",
          core: "到着する",
          reading: "とうちゃくする",
          coreImage: "assets/images/lesson-02/arrival.svg",
          meaning: "到达",
          distractors: ["出发"],
          explanation: "<color=#E76D30>到着する（とうちゃくする）</color>表示到达目的地，地点常用「に」。",
          dialogue: { zh: "你明天什么时候到机场？", jp: "明日はいつ空港に到着しますか。", reading: "あしたはいつくうこうにとうちゃくしますか", npc: "assets/images/npc-right-1.png" },
          collocation1: {
            jp: "空港への到着",
            zh: "到达机场",
            image: "assets/images/lesson-02/arrival.svg",
            chunks: [
              { jp: "空港への", reading: "くうこうへの", zh: "到机场的", tts: "くうこうへの" },
              { jp: "到着", reading: "とうちゃく", zh: "到达", tts: "とうちゃく" }
            ]
          },
          exposure: {
            jp: "空港に到着しました。",
            reading: "くうこうにとうちゃくしました",
            zh: "到达机场了。",
            image: "assets/images/lesson-02/concourse.svg"
          },
          collocation2: {
            jp: "朝、空港に到着",
            zh: "早上到达机场",
            image: "assets/images/lesson-02/gate.svg",
            chunks: [
              { jp: "朝、", reading: "あさ", zh: "早上，", tts: "あさ" },
              { jp: "空港に", reading: "くうこうに", zh: "到机场", tts: "くうこうに" },
              { jp: "到着", reading: "とうちゃく", zh: "到达", tts: "とうちゃく" }
            ]
          },
          target: {
            jp: "明日は朝、空港に到着する予定です。",
            zh: "明天计划早上到达机场。",
            prompt: "朋友问你明天什么时候到机场，哪一句最合适？",
            options: ["明日は朝、空港に到着する予定です。", "明日は空港から出発しません。", "今夜は空港に泊まります。"]
          },
          written: {
            jp: "空港に到着するのは朝です。",
            zh: "早上到达机场。",
            lookupSegments: [
              { jp: "朝です", zh: "早上" },
              { jp: "空港に到着する", zh: "到达机场。" }
            ],
            chunks: [
              { jp: "空港に到着するの", reading: "くうこうにとうちゃくするの", zh: "到达机场", tts: "くうこうにとうちゃくするの" },
              { jp: "は", zh: "（主题助词）", tts: "は" },
              { jp: "朝です。", reading: "あさです", zh: "是早上", tts: "あさです" }
            ],
            distractors: ["空港を出発するの", "夜です。"]
          },
          oral: {
            jp: "明日は朝、空港に到着する予定です。",
            zh: "明天计划早上到达机场。",
            lookupSegments: [
              { jp: "明日は", zh: "明天" },
              { jp: "予定です", zh: "计划" },
              { jp: "朝、空港に到着する", zh: "早上到达机场。" }
            ],
            accepted: ["あしたはあさくうこうにとうちゃくするよていです"],
            chunks: [
              { jp: "明日は朝、空港に到着する", reading: "あしたはあさくうこうにとうちゃくする", zh: "明天早上到达机场", tts: "あしたはあさくうこうにとうちゃくする" },
              { jp: "予定です。", reading: "よていです", zh: "计划。", tts: "よていです" }
            ],
            distractors: ["明日は夜、", "出発します。"]
          }
        },
        {
          id: "toridasu",
          sceneImage: "assets/images/scenes/front-desk.png",
          core: "取り出す",
          reading: "とりだす",
          coreImage: "assets/images/lesson-02/security.svg",
          meaning: "拿出；取出",
          distractors: ["收起"],
          explanation: "<color=#E76D30>取り出す（とりだす）</color>表示从包、口袋或容器中把东西拿出来。",
          dialogue: { zh: "工作人员要求安检时怎么做？", jp: "保安検査では、どうすればいいですか。", reading: "ほあんけんさでは、どうすればいいですか", npc: "assets/images/npc-right-2.png" },
          collocation1: {
            jp: "パスポートを取り出す",
            zh: "拿出护照",
            image: "assets/images/lesson-02/security.svg",
            chunks: [
              { jp: "パスポートを", zh: "把护照", tts: "パスポートを" },
              { jp: "取り出す", reading: "とりだす", zh: "拿出", tts: "とりだす" }
            ]
          },
          exposure: {
            jp: "パスポートを取り出しました。",
            reading: "パスポートをとりだしました",
            zh: "拿出了护照。",
            image: "assets/images/lesson-02/passport.svg"
          },
          collocation2: {
            jp: "パソコンを取り出す",
            zh: "拿出电脑",
            image: "assets/images/lesson-02/customs.svg",
            chunks: [
              { jp: "パソコンを", zh: "把电脑", tts: "パソコンを" },
              { jp: "取り出す", reading: "とりだす", zh: "拿出", tts: "とりだす" }
            ]
          },
          target: {
            jp: "保安検査でパソコンを取り出します。",
            zh: "安检时拿出电脑。",
            prompt: "工作人员提示安检要求，哪一句最合适？",
            options: ["保安検査でパソコンを取り出します。", "保安検査でパソコンを預けます。", "保安検査でパソコンを買います。"]
          },
          written: {
            jp: "パスポートを取り出す必要があります。",
            zh: "需要拿出护照。",
            lookupSegments: [
              { jp: "必要があります", zh: "需要" },
              { jp: "パスポートを取り出す", zh: "拿出护照。" }
            ],
            chunks: [
              { jp: "パスポートを取り出す", reading: "パスポートをとりだす", zh: "拿出护照", tts: "パスポートをとりだす" },
              { jp: "必要があります。", reading: "ひつようがあります", zh: "有必要。", tts: "ひつようがあります" }
            ],
            distractors: ["パスポートを預ける", "必要はありません。"]
          },
          oral: {
            jp: "保安検査でパソコンを取り出します。",
            zh: "安检时拿出电脑。",
            lookupSegments: [
              { jp: "保安検査で", zh: "安检时" },
              { jp: "パソコンを取り出します", zh: "拿出电脑。" }
            ],
            accepted: ["ほあんけんさでパソコンをとりだします"],
            chunks: [
              { jp: "保安検査で", reading: "ほあんけんさで", zh: "在安检时", tts: "ほあんけんさで" },
              { jp: "パソコンを取り出します。", reading: "パソコンをとりだします", zh: "拿出电脑。", tts: "パソコンをとりだします" }
            ],
            distractors: ["パソコンを預けて", "待ちます。"]
          }
        },
        {
          id: "mukau",
          sceneImage: "assets/images/scenes/breakfast.png",
          core: "向かう",
          reading: "むかう",
          coreImage: "assets/images/lesson-02/concourse.svg",
          meaning: "前往",
          distractors: ["返回"],
          explanation: "<color=#E76D30>向かう（むかう）</color>表示朝某个方向或目的地前进，目的地常用「へ」。",
          dialogue: { zh: "你接下来准备去哪儿？", jp: "このあと、どこへ向かう予定ですか。", reading: "このあと、どこへむかうよていですか", npc: "assets/images/npc-right-3.png" },
          collocation1: {
            jp: "搭乗口へ向かう",
            zh: "前往登机口",
            image: "assets/images/lesson-02/concourse.svg",
            chunks: [
              { jp: "搭乗口へ", reading: "とうじょうぐちへ", zh: "向登机口", tts: "とうじょうぐちへ" },
              { jp: "向かう", reading: "むかう", zh: "前往", tts: "むかう" }
            ]
          },
          exposure: {
            jp: "搭乗口へ向かいました。",
            reading: "とうじょうぐちへむかいました",
            zh: "前往登机口了。",
            image: "assets/images/lesson-02/gate.svg"
          },
          collocation2: {
            jp: "税関へ向かう予定",
            zh: "计划前往海关",
            image: "assets/images/lesson-02/arrival.svg",
            chunks: [
              { jp: "税関へ向かう", reading: "ぜいかんへむかう", zh: "前往海关", tts: "ぜいかんへむかう" },
              { jp: "予定", reading: "よてい", zh: "计划", tts: "よてい" }
            ]
          },
          target: {
            jp: "このあと税関へ向かう予定です。",
            zh: "接下来计划前往海关。",
            prompt: "同伴问你接下来去哪里，哪一句最合适？",
            options: ["このあと税関へ向かう予定です。", "このあと搭乗口で待つ予定です。", "このあと空港を出る予定です。"]
          },
          written: {
            jp: "搭乗口へ向かう時間です。",
            zh: "前往登机口的时间到了。",
            lookupSegments: [
              { jp: "搭乗口へ向かう時間", zh: "前往登机口的时间" },
              { jp: "です", zh: "到了。" }
            ],
            chunks: [
              { jp: "搭乗口へ向かう時間", reading: "とうじょうぐちへむかうじかん", zh: "前往登机口的时间", tts: "とうじょうぐちへむかうじかん" },
              { jp: "です。", reading: "です", zh: "到了", tts: "です" }
            ],
            distractors: ["搭乗口で", "待ちます。"]
          },
          oral: {
            jp: "このあと税関へ向かう予定です。",
            zh: "接下来计划前往海关。",
            lookupSegments: [
              { jp: "このあと", zh: "接下来" },
              { jp: "予定です", zh: "计划" },
              { jp: "税関へ向かう", zh: "前往海关。" }
            ],
            accepted: ["このあとぜいかんへむかうよていです"],
            chunks: [
              { jp: "このあと", reading: "このあと", zh: "接下来", tts: "このあと" },
              { jp: "税関へ向かう予定です。", reading: "ぜいかんへむかうよていです", zh: "计划前往海关。", tts: "ぜいかんへむかうよていです" }
            ],
            distractors: ["空港へ戻る", "つもりです。"]
          }
        }
      ]
    }
  ]
};
