import { Composer, ConcertReview, UpcomingConcert, CommunityPost, User } from "./types";

export const INITIAL_USER: User = {
  id: "user-me",
  name: "シューベルトの弟子",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
  role: "チェロ練習中 / 後期ロマン派好き",
  favoriteComposers: ["beethoven", "chopin", "debussy"]
};

export const INITIAL_COMPOSERS: Composer[] = [
  {
    id: "beethoven",
    nameJa: "ルートヴィヒ・ヴァン・ベートーヴェン",
    nameEn: "Ludwig van Beethoven",
    era: "古典派 / ロマン派架け橋",
    country: "ドイツ",
    lifespan: "1770 - 1827",
    biography: "難聴という音楽家にとって致命的な苦難に見舞われながらも、交響曲第5番『運命』、第9番『合唱付き』など、人間精神の勝利を謳い上げる不朽の名作を数多く残しました。",
    funFact: "コーヒーに極端なこだわりがあり、毎朝きっちり「60粒」の豆を自ら数えて淹れていたと言われています。",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "交響曲 第9番 ニ短調 Op.125『合唱』",
      "ピアノ・ソナタ 第14番 嬰ハ短調 Op.27-2『月光』",
      "弦楽四重奏曲 第14番 嬰ハ短調 Op.131"
    ]
  },
  {
    id: "mozart",
    nameJa: "ヴォルフガング・アマデウス・モーツァルト",
    nameEn: "Wolfgang Amadeus Mozart",
    era: "古典派",
    country: "オーストリア",
    lifespan: "1756 - 1791",
    biography: "神童として幼少期からヨーロッパ中を魅了し、35年という短い生涯の中で、オペラ、交響曲、協奏曲、室内楽などあらゆる分野に光り輝く傑作を書き残しました。",
    funFact: "非常にユーモアがあり、手紙の中で下品な冗談やおやじギャグを好んで用いていたことで有名です。また、大の愛犬家でもありました。",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "歌劇『フィガロの結婚』K.492",
      "アイネ・クライネ・ナハトムジーク ト長調 K.525",
      "レクイエム ニ短調 K.626"
    ]
  },
  {
    id: "chopin",
    nameJa: "フレデリック・ショパン",
    nameEn: "Frédéric Chopin",
    era: "ロマン派",
    country: "ポーランド / フランス",
    lifespan: "1810 - 1849",
    biography: "「ピアノの詩人」と称され、その作品のほとんどにピアノが使用されています。ポーランド民族への愛をマズルカやポロネーズに託し、繊細かつ情感豊かな旋律を紡ぎました。",
    funFact: "ショパンは極度の引っ込み思案で、大ホールでの演奏会を嫌い、少人数のサロンで親しい友人を前にピアノを弾くことを好みました。",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "ノクターン 第2番 変ホ長調 Op.9-2",
      "バラード 第1番 ト短調 Op.23",
      "英雄ポロネーズ 変イ長調 Op.53"
    ]
  },
  {
    id: "bach",
    nameJa: "ヨハン・ゼバスティアン・バッハ",
    nameEn: "Johann Sebastian Bach",
    era: "バロック",
    country: "ドイツ",
    lifespan: "1685 - 1750",
    biography: "「音楽の父」として西洋音楽の基礎を築いた偉大なる音楽家。対位法や調性システムの完成に大きく寄与し、敬虔な信仰心から生涯を教会音楽やオルガン音楽の創作に捧げました。",
    funFact: "生涯で20人の子供をもうけ、その中の何人か（C.P.E.バッハ、J.C.バッハなど）も一流の音楽家・作曲家として歴史に名を残しています。",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "無伴奏チェロ組曲 第1番 ト長調 BWV1007",
      "マタイ受難曲 BWV244",
      "ゴールドベルク変奏曲 BWV988"
    ]
  },
  {
    id: "debussy",
    nameJa: "クロード・ドビュッシー",
    nameEn: "Claude Debussy",
    era: "印象主義",
    country: "フランス",
    lifespan: "1862 - 1918",
    biography: "伝統的な機能和声から脱却し、全音音階や独特の音響によって、水や光、風の動きを五線譜に投影しました。美術における印象派や文学の象徴主義と深く結びついています。",
    funFact: "和風の美術（ジャポニスム）に深く傾倒しており、交響詩『海』の初版楽譜の表紙には葛飾北斎の『富嶽三十景・神奈川沖浪裏』が使われていました。",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "ベルガマスク組曲より『月の光』",
      "牧神の午後への前奏曲",
      "交響詩『海』"
    ]
  },
  {
    id: "brahms",
    nameJa: "ヨハネス・ブラームス",
    nameEn: "Johannes Brahms",
    era: "ロマン派",
    country: "ドイツ",
    lifespan: "1833 - 1897",
    biography: "バッハ、ベートーヴェンと共に「ドイツ3大B」と称され、ロマン派の時代にありながら、古典派の厳格な形式美と深い叙情性を融合させた独自の音楽世界を築きました。交響曲や室内楽、歌曲において不朽の傑作を数多く残しています。",
    funFact: "若き日には生活を支えるため港町の居酒屋やキャバレーでピアノを演奏しており、そこで様々な大衆音楽（ハンガリー民謡など）に親しんだことが後の『ハンガリー舞曲』の創作に繋がったとされています。",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "交響曲 第1番 ハ短調 Op.68",
      "ハンガリー舞曲 第5番 嬰ヘ短調",
      "クラリネット五重奏曲 ロ短調 Op.115"
    ]
  },
  {
    id: "dvorak",
    nameJa: "アントニン・ドヴォルザーク",
    nameEn: "Antonín Dvořák",
    era: "ロマン派",
    country: "チェコ",
    lifespan: "1841 - 1904",
    biography: "チェコの民族音楽の調べを芸術的に昇華させ、ブラームスに見出されて世界的に活躍しました。後にアメリカへ渡り、黒人霊歌やインディアンの旋律にインスピレーションを得て、名作交響曲第9番『新世界より』を作曲しました。",
    funFact: "無類の鉄道マニア（熱狂的な汽車好き）であり、プラハの駅に毎日通っては蒸気機関車の番号をノートに記録し、新任の機関士に話しかけるのが日課だったと言われています。",
    image: "https://images.unsplash.com/photo-1484755560695-a4c740285fa6?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "交響曲 第9番 ホ短調 Op.95『新世界より』",
      "チェロ協奏曲 ロ短調 Op.104",
      "弦楽四重奏曲 第12番 ヘ長調 Op.96『アメリカ』"
    ]
  }
];

export const INITIAL_REVIEWS: ConcertReview[] = [
  {
    id: "review-1",
    authorId: "user-1",
    authorName: "マエストロ・ケン",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    composer: "ルートヴィヒ・ヴァン・ベートーヴェン",
    piece: "交響曲 第9番『合唱付き』",
    performanceDate: "2026-06-25",
    venue: "サントリーホール (東京)",
    performer: "東京交響楽団 / 指揮: 広上淳一",
    rating: 5,
    title: "歓喜の歌がホールに満ちる、圧倒的な精神力！",
    reviewText: "やはり年末でなくてもサントリーホールで聴く第九は格別です。第3楽章の深い静寂から、第4楽章の爆発的な歓喜へと至る指揮の構築力に脱帽。独唱陣、合唱団のブレスコントロールと発音も極めて明瞭で、ホール全体が温かく、そして力強い人間の魂の賛歌に包まれました。フィナーレでのテンポアップは息を呑む緊張感でした！",
    createdAt: "2026-06-26T12:00:00Z",
    likes: 24,
    commentsCount: 3
  },
  {
    id: "review-2",
    authorId: "user-2",
    authorName: "ピアノソナタの森",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    composer: "フレデリック・ショパン",
    piece: "24の前奏曲 Op.28 (全曲)",
    performanceDate: "2026-07-02",
    venue: "東京オペラシティ コンサートホール",
    performer: "ピアノ: ラファウ・ブレハッチ",
    rating: 4,
    title: "静寂を彩る、極彩色のショパン",
    reviewText: "ブレハッチによる前奏曲集。第15番『雨だれ』の絶え間ない連打音が運命の足音のように響き渡り、中間部の重厚な盛り上がりが素晴らしい陰影を描き出しました。ピアニッシモの美しさが極めて秀逸で、一音一音が結晶のようにきらめいていました。ただ、第16番の超絶技巧的なパッセージにおいて若干荒さを感じる箇所もありましたが、それもライブならではの熱量として楽しめました。",
    createdAt: "2026-07-03T09:30:00Z",
    likes: 18,
    commentsCount: 1
  }
];

export const INITIAL_CONCERTS: UpcomingConcert[] = [
  {
    id: "concert-1",
    title: "マーラー：交響曲 第2番『復活』",
    composer: "グスタフ・マーラー",
    program: "マーラー：交響曲 第2番 ハ短調『復活』",
    performer: "NHK交響楽団 / 指揮: ファビオ・ルイージ / ソプラノ: 三宅理恵 / アルト: 藤村実穂子",
    venue: "NHKホール (東京)",
    date: "2026-08-15",
    time: "19:00",
    description: "大編成のオーケストラと合唱団が、宇宙的な規模で死と再生を描き出す、マーラー渾身の巨作。ファビオ・ルイージの解釈により、かつてない明晰さとダイナミズムで復活のテーマが響き渡ります。",
    submittedBy: "クラシック事務局",
    interestedUsers: ["user-1", "user-2"],
    interestedCount: 2,
    ticketLink: "https://example.com/tickets"
  },
  {
    id: "concert-2",
    title: "ドビュッシーとフランス音楽の系譜",
    composer: "クロード・ドビュッシー / モーリス・ラヴェル",
    program: "ドビュッシー：牧神の午後への前奏曲、ラヴェル：ボレロ、ストラヴィンスキー：春の祭典",
    performer: "読売日本交響楽団 / 指揮: セバスティアン・ヴァイグレ",
    venue: "サントリーホール (東京)",
    date: "2026-09-05",
    time: "14:00",
    description: "19世紀末から20世紀初頭にかけての、管弦楽法の極致を味わうプログラム。妖艶な『牧神』から熱狂の『ボレロ』、そして原始主義の傑作『ハルサイ』へと至る色彩美溢れるサウンドをサントリーホールの豊かな響きで堪能してください。",
    submittedBy: "オーケストラ愛好会",
    interestedUsers: ["user-me"],
    interestedCount: 1,
    ticketLink: "https://example.com/tickets"
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorId: "user-3",
    authorName: "エリーゼの末裔",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    authorRole: "アマチュアピアニスト / ベートーヴェン偏愛",
    type: "question",
    title: "ベートーヴェンの後期ピアノソナタでおすすめの録音は？",
    content: "現在、ベートーヴェンのピアノソナタ第30番 Op.109 を練習しています。あの第3楽章の主題と変奏の崇高な美しさに圧倒される日々です。皆さんのおすすめの後期ソナタ（30番〜32番）の名盤があればぜひ教えてください！私はエミール・ギレリスかマウリツィオ・ポリーニをよく聴いています。",
    likes: 15,
    comments: [
      {
        id: "comment-1-1",
        authorName: "ピアノソナタの森",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        content: "ギレリスは良いですよね、鋼鉄のタッチから紡ぎ出される優しさが沁みます。私のおすすめは、やはりウラディミール・アシュケナージの1970年代の旧録音、あるいはアルフレッド・ブレンデルのライブ録音です。精神性と親しみやすさが両立しています！",
        createdAt: "2026-07-08T03:00:00Z"
      },
      {
        id: "comment-1-2",
        authorName: "マエストロ・ケン",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
        content: "往年の巨匠であればヴィルヘルム・ケンプのモノラル〜ステレオ初期の録音が、華美な技術を排した純朴な祈りそのもので心に響きます。現代の演奏家なら、イゴール・レヴィット盤の圧倒的な知的構築力をおすすめします。",
        createdAt: "2026-07-08T05:20:00Z"
      }
    ],
    createdAt: "2026-07-07T15:00:00Z"
  },
  {
    id: "post-2",
    authorId: "user-4",
    authorName: "弦楽四重奏ラバー",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    authorRole: "ビオラ弾き / 室内楽マニア",
    type: "recommendation",
    title: "雨の日に聴きたい、ブラームスの室内楽のすすめ",
    content: "今日はあいにくの雨ですね。そんな日は、ブラームスの哀愁溢れる中低音が胸に響きます。特におすすめなのが『クラリネット五重奏曲 ロ短調 Op.115』。第1楽章の寂寥感漂うメロディ、そして第2楽章のジプシー風の哀歌は、雨音とこれ以上ない調和を見せてくれます。カール・ライスターとアマデウス弦楽四重奏団の録音が至高です。",
    likes: 31,
    comments: [
      {
        id: "comment-2-1",
        authorName: "シューベルトの弟子",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
        content: "ブラームスのロ短調五重奏曲は本当に名曲ですね！第1楽章の冒頭から一気に世界観に引き込まれます。チェロのピチカートとクラリネットの対話がたまりません。",
        createdAt: "2026-07-08T08:15:00Z"
      }
    ],
    createdAt: "2026-07-08T01:45:00Z"
  }
];
