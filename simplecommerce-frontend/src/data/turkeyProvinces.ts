export interface TurkeyProvince {
  name: string
  districts: string[]
}

// İstanbul first, remaining 80 provinces alphabetical (A-Z).
export const turkeyProvinces: TurkeyProvince[] = [
  {
    name: "İstanbul",
    districts: [
      "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy",
      "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece",
      "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa",
      "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik",
      "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli",
      "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu",
    ],
  },
  {
    name: "Adana",
    districts: [
      "Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan",
      "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir",
    ],
  },
  {
    name: "Adıyaman",
    districts: ["Merkez", "Besni", "Çelikhan", "Gerger", "Gölbaşı", "Kahta", "Samsat", "Sincik", "Tut"],
  },
  {
    name: "Afyonkarahisar",
    districts: [
      "Merkez", "Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar",
      "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Sandıklı",
      "Sinanpaşa", "Sultandağı", "Şuhut",
    ],
  },
  {
    name: "Ağrı",
    districts: ["Merkez", "Diyadin", "Doğubayazıt", "Eleşkirt", "Hamur", "Patnos", "Taşlıçay", "Tutak"],
  },
  {
    name: "Aksaray",
    districts: ["Merkez", "Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Ortaköy", "Sarıyahşi", "Sultanhanı"],
  },
  {
    name: "Amasya",
    districts: ["Merkez", "Göynücek", "Gümüşhacıköy", "Hamamözü", "Merzifon", "Suluova", "Taşova"],
  },
  {
    name: "Ankara",
    districts: [
      "Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk",
      "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan",
      "Kalecik", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar",
      "Sincan", "Şereflikoçhisar", "Yenimahalle",
    ],
  },
  {
    name: "Antalya",
    districts: [
      "Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa",
      "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca",
      "Manavgat", "Muratpaşa", "Serik",
    ],
  },
  {
    name: "Ardahan",
    districts: ["Merkez", "Çıldır", "Damal", "Göle", "Hanak", "Posof"],
  },
  {
    name: "Artvin",
    districts: ["Merkez", "Ardanuç", "Arhavi", "Borçka", "Hopa", "Murgul", "Şavşat", "Yusufeli"],
  },
  {
    name: "Aydın",
    districts: [
      "Efeler", "Bozdoğan", "Buharkent", "Çine", "Didim", "Germencik", "İncirliova",
      "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke",
      "Sultanhisar", "Yenipazar",
    ],
  },
  {
    name: "Balıkesir",
    districts: [
      "Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey",
      "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut",
      "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk",
    ],
  },
  {
    name: "Bartın",
    districts: ["Merkez", "Amasra", "Kurucaşile", "Ulus"],
  },
  {
    name: "Batman",
    districts: ["Merkez", "Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Sason"],
  },
  {
    name: "Bayburt",
    districts: ["Merkez", "Aydıntepe", "Demirözü"],
  },
  {
    name: "Bilecik",
    districts: ["Merkez", "Bozüyük", "Gölpazarı", "İnhisar", "Osmaneli", "Pazaryeri", "Söğüt", "Yenipazar"],
  },
  {
    name: "Bingöl",
    districts: ["Merkez", "Adaklı", "Genç", "Karlıova", "Kiğı", "Solhan", "Yayladere", "Yedisu"],
  },
  {
    name: "Bitlis",
    districts: ["Merkez", "Adilcevaz", "Ahlat", "Güroymak", "Hizan", "Mutki", "Tatvan"],
  },
  {
    name: "Bolu",
    districts: ["Merkez", "Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Mudurnu", "Seben", "Yeniçağa"],
  },
  {
    name: "Burdur",
    districts: [
      "Merkez", "Ağlasun", "Altınyayla", "Bucak", "Çavdır", "Çeltikçi", "Gölhisar",
      "Karamanlı", "Kemer", "Tefenni", "Yeşilova",
    ],
  },
  {
    name: "Bursa",
    districts: [
      "Osmangazi", "Nilüfer", "Yıldırım", "Gemlik", "Gürsu", "İnegöl", "İznik", "Karacabey",
      "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Orhaneli", "Orhangazi",
      "Büyükorhan", "Harmancık", "Yenişehir",
    ],
  },
  {
    name: "Çanakkale",
    districts: [
      "Merkez", "Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine",
      "Gelibolu", "Gökçeada", "Lapseki", "Yenice",
    ],
  },
  {
    name: "Çankırı",
    districts: [
      "Merkez", "Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak",
      "Korgun", "Kurşunlu", "Orta", "Şabanözü", "Yapraklı",
    ],
  },
  {
    name: "Çorum",
    districts: [
      "Merkez", "Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin",
      "Mecitözü", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ",
    ],
  },
  {
    name: "Denizli",
    districts: [
      "Merkezefendi", "Pamukkale", "Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç",
      "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale",
      "Sarayköy", "Serinhisar", "Tavas",
    ],
  },
  {
    name: "Diyarbakır",
    districts: [
      "Bağlar", "Kayapınar", "Sur", "Yenişehir", "Bismil", "Çermik", "Çınar", "Çüngüş",
      "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kocaköy", "Kulp", "Lice", "Silvan",
    ],
  },
  {
    name: "Düzce",
    districts: ["Merkez", "Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Yığılca"],
  },
  {
    name: "Edirne",
    districts: ["Merkez", "Enez", "Havsa", "İpsala", "Keşan", "Lalapaşa", "Meriç", "Süloğlu", "Uzunköprü"],
  },
  {
    name: "Elazığ",
    districts: [
      "Merkez", "Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar",
      "Maden", "Palu", "Sivrice",
    ],
  },
  {
    name: "Erzincan",
    districts: [
      "Merkez", "Çayırlı", "İliç", "Kemah", "Kemaliye", "Otlukbeli", "Refahiye", "Tercan", "Üzümlü",
    ],
  },
  {
    name: "Erzurum",
    districts: [
      "Aziziye", "Palandöken", "Yakutiye", "Aşkale", "Çat", "Hınıs", "Horasan", "İspir",
      "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Pasinler",
      "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere",
    ],
  },
  {
    name: "Eskişehir",
    districts: [
      "Odunpazarı", "Tepebaşı", "Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü",
      "Mahmudiye", "Mihalgazi", "Mihalıççık", "Sarıcakaya", "Seyitgazi", "Sivrihisar",
    ],
  },
  {
    name: "Gaziantep",
    districts: [
      "Şahinbey", "Şehitkamil", "Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı",
      "Oğuzeli", "Yavuzeli",
    ],
  },
  {
    name: "Giresun",
    districts: [
      "Merkez", "Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye",
      "Eynesil", "Görele", "Güce", "Keşap", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere",
    ],
  },
  {
    name: "Gümüşhane",
    districts: ["Merkez", "Kelkit", "Köse", "Kürtün", "Şiran", "Torul"],
  },
  {
    name: "Hakkari",
    districts: ["Merkez", "Çukurca", "Şemdinli", "Yüksekova"],
  },
  {
    name: "Hatay",
    districts: [
      "Antakya", "Defne", "Arsuz", "Altınözü", "Belen", "Dörtyol", "Erzin", "Hassa",
      "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı",
    ],
  },
  {
    name: "Iğdır",
    districts: ["Merkez", "Aralık", "Karakoyunlu", "Tuzluca"],
  },
  {
    name: "Isparta",
    districts: [
      "Merkez", "Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Senirkent",
      "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli",
    ],
  },
  {
    name: "İzmir",
    districts: [
      "Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca",
      "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar",
      "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes",
      "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla",
    ],
  },
  {
    name: "Kahramanmaraş",
    districts: [
      "Onikişubat", "Dulkadiroğlu", "Afşin", "Andırın", "Çağlayancerit", "Ekinözü",
      "Elbistan", "Göksun", "Nurhak", "Pazarcık", "Türkoğlu",
    ],
  },
  {
    name: "Karabük",
    districts: ["Merkez", "Eflani", "Eskipazar", "Ovacık", "Safranbolu", "Yenice"],
  },
  {
    name: "Karaman",
    districts: ["Merkez", "Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Sarıveliler"],
  },
  {
    name: "Kars",
    districts: ["Merkez", "Akyaka", "Arpaçay", "Digor", "Kağızman", "Sarıkamış", "Selim", "Susuz"],
  },
  {
    name: "Kastamonu",
    districts: [
      "Merkez", "Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin",
      "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre",
      "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya",
    ],
  },
  {
    name: "Kayseri",
    districts: [
      "Melikgazi", "Kocasinan", "Talas", "Develi", "Akkışla", "Bünyan", "Felahiye",
      "Hacılar", "İncesu", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Tomarza",
      "Yahyalı", "Yeşilhisar",
    ],
  },
  {
    name: "Kırıkkale",
    districts: ["Merkez", "Bahşili", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Sulakyurt", "Yahşihan"],
  },
  {
    name: "Kırklareli",
    districts: ["Merkez", "Babaeski", "Demirköy", "Kofçaz", "Lüleburgaz", "Pehlivanköy", "Pınarhisar", "Vize"],
  },
  {
    name: "Kırşehir",
    districts: ["Merkez", "Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Mucur"],
  },
  {
    name: "Kilis",
    districts: ["Merkez", "Elbeyli", "Musabeyli", "Polateli"],
  },
  {
    name: "Kocaeli",
    districts: [
      "İzmit", "Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük",
      "Kandıra", "Karamürsel", "Kartepe", "Körfez",
    ],
  },
  {
    name: "Konya",
    districts: [
      "Selçuklu", "Meram", "Karatay", "Ahırlı", "Akören", "Akşehir", "Altınekin",
      "Beyşehir", "Bozkır", "Cihanbeyli", "Çeltik", "Çumra", "Derbent", "Derebucak",
      "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük",
      "Ilgın", "Kadınhanı", "Karapınar", "Kulu", "Sarayönü", "Seydişehir", "Taşkent",
      "Tuzlukçu", "Yalıhüyük", "Yunak",
    ],
  },
  {
    name: "Kütahya",
    districts: [
      "Merkez", "Altıntaş", "Aslanapa", "Çavdarhisar", "Domaniç", "Dumlupınar", "Emet",
      "Gediz", "Hisarcık", "Pazarlar", "Simav", "Şaphane", "Tavşanlı",
    ],
  },
  {
    name: "Malatya",
    districts: [
      "Battalgazi", "Yeşilyurt", "Akçadağ", "Arapgir", "Arguvan", "Darende", "Doğanşehir",
      "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan",
    ],
  },
  {
    name: "Manisa",
    districts: [
      "Şehzadeler", "Yunusemre", "Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara",
      "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı",
      "Selendi", "Soma", "Turgutlu",
    ],
  },
  {
    name: "Mardin",
    districts: [
      "Artuklu", "Dargeçit", "Derik", "Kızıltepe", "Mazıdağı", "Midyat", "Nusaybin",
      "Ömerli", "Savur", "Yeşilli",
    ],
  },
  {
    name: "Mersin",
    districts: [
      "Akdeniz", "Mezitli", "Toroslar", "Yenişehir", "Anamur", "Aydıncık", "Bozyazı",
      "Çamlıyayla", "Erdemli", "Gülnar", "Mut", "Silifke", "Tarsus",
    ],
  },
  {
    name: "Muğla",
    districts: [
      "Menteşe", "Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz",
      "Marmaris", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan",
    ],
  },
  {
    name: "Muş",
    districts: ["Merkez", "Bulanık", "Hasköy", "Korkut", "Malazgirt", "Varto"],
  },
  {
    name: "Nevşehir",
    districts: ["Merkez", "Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Ürgüp"],
  },
  {
    name: "Niğde",
    districts: ["Merkez", "Altunhisar", "Bor", "Çamardı", "Çiftlik", "Ulukışla"],
  },
  {
    name: "Ordu",
    districts: [
      "Altınordu", "Akkuş", "Aybastı", "Çamaş", "Çatalpınar", "Çaybaşı", "Fatsa", "Gölköy",
      "Gülyalı", "Gürgentepe", "İkizce", "Kabadüz", "Kabataş", "Korgan", "Kumru",
      "Mesudiye", "Perşembe", "Ulubey", "Ünye",
    ],
  },
  {
    name: "Osmaniye",
    districts: ["Merkez", "Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Sumbas", "Toprakkale"],
  },
  {
    name: "Rize",
    districts: [
      "Merkez", "Ardeşen", "Çamlıhemşin", "Çayeli", "Derepazarı", "Fındıklı", "Güneysu",
      "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Pazar",
    ],
  },
  {
    name: "Sakarya",
    districts: [
      "Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek",
      "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan",
      "Söğütlü", "Taraklı",
    ],
  },
  {
    name: "Samsun",
    districts: [
      "İlkadım", "Atakum", "Canik", "Tekkeköy", "19 Mayıs", "Alaçam", "Asarcık", "Ayvacık",
      "Bafra", "Çarşamba", "Havza", "Kavak", "Ladik", "Salıpazarı", "Terme", "Vezirköprü",
      "Yakakent",
    ],
  },
  {
    name: "Siirt",
    districts: ["Merkez", "Baykan", "Eruh", "Kurtalan", "Pervari", "Şirvan", "Tillo"],
  },
  {
    name: "Sinop",
    districts: ["Merkez", "Ayancık", "Boyabat", "Dikmen", "Durağan", "Erfelek", "Gerze", "Saraydüzü", "Türkeli"],
  },
  {
    name: "Sivas",
    districts: [
      "Merkez", "Akıncılar", "Altınyayla", "Divriği", "Doğanşar", "Gemerek", "Gölova",
      "Gürün", "Hafik", "İmranlı", "Kangal", "Koyulhisar", "Suşehri", "Şarkışla", "Ulaş",
      "Yıldızeli", "Zara",
    ],
  },
  {
    name: "Şanlıurfa",
    districts: [
      "Eyyübiye", "Haliliye", "Karaköprü", "Akçakale", "Birecik", "Bozova", "Ceylanpınar",
      "Halfeti", "Harran", "Hilvan", "Siverek", "Suruç", "Viranşehir",
    ],
  },
  {
    name: "Şırnak",
    districts: ["Merkez", "Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Silopi", "Uludere"],
  },
  {
    name: "Tekirdağ",
    districts: [
      "Süleymanpaşa", "Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara",
      "Marmaraereğlisi", "Muratlı", "Saray", "Şarköy",
    ],
  },
  {
    name: "Tokat",
    districts: [
      "Merkez", "Almus", "Artova", "Başçiftlik", "Erbaa", "Niksar", "Pazar", "Reşadiye",
      "Sulusaray", "Turhal", "Yeşilyurt", "Zile",
    ],
  },
  {
    name: "Trabzon",
    districts: [
      "Ortahisar", "Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara",
      "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Şalpazarı",
      "Sürmene", "Tonya", "Vakfıkebir", "Yomra",
    ],
  },
  {
    name: "Tunceli",
    districts: ["Merkez", "Çemişgezek", "Hozat", "Mazgirt", "Nazımiye", "Ovacık", "Pertek", "Pülümür"],
  },
  {
    name: "Uşak",
    districts: ["Merkez", "Banaz", "Eşme", "Karahallı", "Sivaslı", "Ulubey"],
  },
  {
    name: "Van",
    districts: [
      "İpekyolu", "Tuşba", "Edremit", "Erciş", "Bahçesaray", "Başkale", "Çaldıran",
      "Çatak", "Gevaş", "Gürpınar", "Muradiye", "Özalp", "Saray",
    ],
  },
  {
    name: "Yalova",
    districts: ["Merkez", "Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Termal"],
  },
  {
    name: "Yozgat",
    districts: [
      "Merkez", "Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek",
      "Kadışehri", "Saraykent", "Sarıkaya", "Şefaatli", "Sorgun", "Yenifakılı", "Yerköy",
    ],
  },
  {
    name: "Zonguldak",
    districts: ["Merkez", "Alaplı", "Çaycuma", "Devrek", "Ereğli", "Gökçebey", "Kilimli", "Kozlu"],
  },
]

export const turkeyProvinceNames: string[] = turkeyProvinces.map((p) => p.name)

export function getDistrictsForProvince(provinceName: string): string[] {
  return turkeyProvinces.find((p) => p.name === provinceName)?.districts ?? []
}
