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
    funFact: "若き日には生活を支えるため、港町の居酒屋やバーでピアノ演奏のアルバイトをして家計を助けていたと言われています。",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=300",
    famousPieces: [
      "交響曲 第1番 ハ短調 Op.68",
      "クラリネット五重奏曲 ロ短調 Op.115",
      "ハンガリー舞曲集"
    ]
  }
];

export const INITIAL_CONCERTS: UpcomingConcert[] = [
  {
    id: "suntory-vienna-thielemann-20261108",
    title: "ウィーン・フィルハーモニー管弦楽団 来日公演 2026",
    composer: "モーツァルト / ブルックナー",
    program: "モーツァルト：交響曲 第41番 ハ長調 K.551『ジュピター』、ブルックナー：交響曲 第7番 ホ長調（ノーヴァク版）",
    performer: "ウィーン・フィルハーモニー管弦楽団 / 指揮: クリスティアン・ティーレマン",
    venue: "サントリーホール 大ホール",
    date: "2026-11-08",
    time: "19:00",
    description: "世界最高峰のオーケストラ、ウィーン・フィルが贈る特別な秋の一夜。ブルックナー生誕200年周年を締めくくる交響曲第7番の深遠な調べと、モーツァルトが到達した究極のポリフォニー『ジュピター』。ティーレマンのタクトがサントリーホールの豊かな残響と一体となります。",
    submittedBy: "サントリーホール事務局",
    interestedUsers: ["user-1", "user-2"],
    interestedCount: 2,
    ticketLink: "https://www.suntory.co.jp/suntoryhall/"
  },
  {
    id: "nhkhall-nhkso-luisi-20260912",
    title: "NHK交響楽団 定期演奏会（第2015回 定期公演 Aプログラム）",
    composer: "グスタフ・マーラー",
    program: "マーラー：交響曲 第2番 ハ短調『復活』",
    performer: "NHK交響楽団 / 指揮: ファビオ・ルイージ / ソプラノ: マリー・ソフィー・ポラック / メゾ・ソプラノ: 藤村実穂子 / 新国立劇場合唱団",
    venue: "NHKホール",
    date: "2026-09-12",
    time: "18:00",
    description: "NHK交響楽団の新シーズンはマエストロ、ファビオ・ルイージのタクトで開幕！オルガンと大合唱がNHKホールの巨大な空間を埋め尽くす、宇宙的かつ感動的なマーラーの『復活』を体験してください。死から再生へと向かう渾身のフィナーレは圧巻です。",
    submittedBy: "N響プロムナード",
    interestedUsers: ["user-me", "user-2"],
    interestedCount: 2,
    ticketLink: "https://www.nhkso.or.jp/"
  },
  {
    id: "suntory-yomikyo-weigle-20260908",
    title: "読売日本交響楽団 第662回 定期演奏会",
    composer: "ヨハネス・ブラームス",
    program: "ブラームス：ピアノ協奏曲 第2番 変ロ長調 Op.83、ブラームス：交響曲 第2番 ニ長調 Op.73",
    performer: "読売日本交響楽団 / 指揮: セバスティアン・ヴァイグレ / ピアノ: ゲルハルト・オピッツ",
    venue: "サントリーホール 大ホール",
    date: "2026-09-08",
    time: "19:00",
    description: "読響常任指揮者セバスティアン・ヴァイグレが描く、重厚にして叙情豊かなオール・ブラームス・プログラム。世界的名手ゲルハルト・オピッツを迎えたピアノ協奏曲第2番は、ピアノを含んだ交響曲とも評される珠玉の傑作です。秋の始まりを飾る、極上のロマンティシズムをご堪能ください。",
    submittedBy: "都響ファンクラブ",
    interestedUsers: ["user-1"],
    interestedCount: 1,
    ticketLink: "https://yomikyo.or.jp/"
  },
  {
    id: "suntory-tso-nott-20261017",
    title: "東京交響楽団 第744回 定期演奏会",
    composer: "リゲティ / ベルク / ベートーヴェン",
    program: "リゲティ：サンフランシスコ・ポリフォニー、ベルク：ヴァイオリン協奏曲『ある天使 of 思い出に』、ベートーヴェン：交響曲 第3番 ヘ長調『英雄』",
    performer: "東京交響楽団 / 指揮: ジョナサン・ノット / ヴァイオリン: イザベル・ファウスト",
    venue: "サントリーホール 大ホール",
    date: "2026-10-17",
    time: "18:00",
    description: "東響音楽監督ジョナサン・ノットが放つ、極めて刺激的かつ哲学的なプログラミング。現代屈指の名ヴァイオリニスト、イザベル・ファウストが奏でるベルクの協奏曲と、名匠ノットによるドラマティックなベートーヴェン『英雄』が、秋のサントリーホールを熱狂の渦に巻き込みます。",
    submittedBy: "東響友の会",
    interestedUsers: [],
    interestedCount: 0,
    ticketLink: "https://tokyosymphony.jp/"
  },
  {
    id: "sumida-triphony-kamioka-20261024",
    title: "新日本フィルハーモニー交響楽団 第672回 定期演奏会",
    composer: "リヒャルト・ワーグナー",
    program: "ワーグナー（ロリン・マゼール編曲）：楽劇『ニーベルングの指環』～言葉のない指環",
    performer: "新日本フィルハーモニー交響楽団 / 指揮: 上岡敏之",
    venue: "すみだトリフォニーホール 大ホール",
    date: "2026-10-24",
    time: "14:00",
    description: "すみだトリフォニーホールの極上アコースティックで聴く、上岡敏之と新日本フィルのワーグナー！マゼールが15時間の楽劇4部作『ニーベルングの指環』の管弦楽美を1時間余りに凝縮した『言葉のない指環』は、息を呑むオーケストラ絵巻です。圧倒的なダイナミズムをお楽しみください。",
    submittedBy: "新日本フィル応援団",
    interestedUsers: ["user-me"],
    interestedCount: 1,
    ticketLink: "https://www.njp.or.jp/"
  },
  {
    id: "operacity-organ-suzuki-20261018",
    title: "東京オペラシティ 荘厳なるパイプオルガンとバッハの宇宙",
    composer: "ヨハン・ゼバスティアン・バッハ",
    program: "J.S.バッハ：トッカータとフーガ ニ短調 BWV 565、シューブラー・コラール集より、小フーガ ト短調 BWV 578、パスサカリア ハ短調 BWV 582",
    performer: "オルガン: 鈴木優人 (バッハ・コレギウム・ジャパン)",
    venue: "東京オペラシティ コンサートホール：タケミツ メモリアル",
    date: "2026-10-18",
    time: "14:00",
    description: "東京オペラシティが誇る国内屈指のパイプオルガン「スイス・クーン社製」によるオール・バッハ・リサイタル。世界的音楽家・鈴木優人の圧倒的なテクニックと色彩豊かなレジストレーションによって、大ホールの天上から降り注ぐ荘厳なバッハの宇宙をご体験いただけます。",
    submittedBy: "オペラシティ愛好会",
    interestedUsers: ["user-me"],
    interestedCount: 1,
    ticketLink: "https://www.operacity.jp/"
  },
  {
    id: "hamarikyu-quartet-amabile-20261002",
    title: "浜離宮室内楽セレクション：カルテット・アマービレ 弦楽四重奏リサイタル",
    composer: "ルートヴィヒ・ヴァン・ベートーヴェン / ヨハネス・ブラームス",
    program: "ベートーヴェン：弦楽四重奏曲 第11番 ヘ短調 Op.95『セリオーソ』、ブラームス：弦楽四重奏曲 第1番 ハ短調 Op.51-1",
    performer: "カルテット・アマービレ (篠原悠那 / 北田千尋 / 中恵菜 / 笹沼樹)",
    venue: "浜離宮朝日ホール",
    date: "2026-10-02",
    time: "19:00",
    description: "「室内楽の殿堂」として世界的な響きを絶賛される浜離宮朝日ホール。ミュンヘン国際コンクール第3位の実力を誇る若きカルテット・アマービレが、ベートーヴェンの緊迫感漂う『セリオーソ』と、ロマン派の哀愁深いブラームス第1番を深く瑞々しく紡ぎ出します。",
    submittedBy: "室内楽ラバー",
    interestedUsers: ["user-2"],
    interestedCount: 1,
    ticketLink: "https://www.asahi-hall.jp/hamarikyu/"
  },
  {
    id: "persimmon-chopin-sorita-20260829",
    title: "パーシモン・プレミアム・クラシックス：反田恭平 ピアノ・リサイタル",
    composer: "フレデリック・ショパン",
    program: "ショパン：ノクターン 第20番 嬰ハ短調（遺作）、マズルカ風ロンド Op.5、24の前奏曲 Op.28（全曲）、英雄ポロネーズ Op.53",
    performer: "ピアノ: 反田恭平",
    venue: "めぐろパーシモンホール 大ホール",
    date: "2026-08-29",
    time: "15:00",
    description: "ショパン国際ピアノコンクール第2位の快挙から、さらに深みを増した反田恭平が登場。透明な残響を誇るパーシモンホールで、ショパンの名曲、そして魂の『英雄ポロネーズ』と色彩豊かな『24の前奏曲』全曲をお届けします。",
    submittedBy: "パーシモン音楽愛好部",
    interestedUsers: ["user-me", "user-1"],
    interestedCount: 2,
    ticketLink: "https://www.persimmon.or.jp/"
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

export const INITIAL_REVIEWS: ConcertReview[] = [
  {
    id: "review-1",
    authorId: "user-2",
    authorName: "ビオラ弾きのマサ",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    composer: "ヨハネス・ブラームス",
    piece: "交響曲 第1番 ハ短調 Op.68",
    performanceDate: "2026-06-12",
    venue: "サントリーホール 大ホール",
    performer: "ベルリン・フィルハーモニー管弦楽団 / 指揮: キリル・ペトレンコ",
    rating: 5,
    title: "息を呑む極限の緊張感と圧倒的な音響空間",
    reviewText: "キリル・ペトレンコ率いるベルリン・フィルの来日公演。第1楽章冒頭のティンパニの打音から、全身の毛穴が開くような緊張感に包まれました。ペトレンコの引き締まったテンポ感と、オーケストラの一糸乱れぬアンサンブルはまさに圧巻。終楽章のホルンのコラール、そしてトロンボーンが入ってきた瞬間の神々しい美しさは一生忘れません。サントリーホールの音響も極限まで活かされていました。",
    createdAt: "2026-06-13T10:00:00Z",
    likes: 24,
    commentsCount: 3
  },
  {
    id: "review-2",
    authorId: "user-3",
    authorName: "エリーゼの末裔",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    composer: "フレデリック・ショパン",
    piece: "24の前奏曲 Op.28",
    performanceDate: "2026-05-18",
    venue: "東京オペラシティ コンサートホール",
    performer: "ピアノ: 藤田真央",
    rating: 5,
    title: "鍵盤から紡ぎ出される、一粒一粒が真珠のような極上の響き",
    reviewText: "藤田真央さんのリサイタル。ショパンの前奏曲集は、一曲一曲がまったく異なる色彩を帯びて目の前に現れるようでした。『雨だれ』のあの静けさと底知れぬ深淵、そして第24番の嵐のような熱狂まで、彼の変幻自在な弱音のコントロールにはただただ魅了されました。音が天上から降ってくるような感覚を覚えた、奇跡的なリサイタルでした。",
    createdAt: "2026-05-19T14:30:00Z",
    likes: 18,
    commentsCount: 2
  }
];
