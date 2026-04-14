export type WeddingVenue = {
  name: string;
  area: string;
  address: string;
  keywords: string[];
  transportGuides?: Array<{
    mode: string;
    detail: string;
  }>;
};

export const WEDDING_VENUES: WeddingVenue[] = [
  { name: "더 신라 서울", area: "서울 중구", address: "서울 중구 동호로 249", keywords: ["신라", "장충", "다이너스티", "호텔"] },
  { name: "롯데호텔 서울", area: "서울 중구", address: "서울 중구 을지로 30", keywords: ["롯데", "소공동", "호텔"] },
  { name: "포시즌스 호텔 서울", area: "서울 종로구", address: "서울 종로구 새문안로 97", keywords: ["포시즌", "광화문", "호텔"] },
  { name: "그랜드 워커힐 서울", area: "서울 광진구", address: "서울 광진구 워커힐로 177", keywords: ["워커힐", "광장동", "호텔"] },
  { name: "반얀트리 클럽 앤 스파 서울", area: "서울 중구", address: "서울 중구 장충단로 60", keywords: ["반얀트리", "남산", "호텔"] },
  { name: "JW 메리어트 호텔 서울", area: "서울 서초구", address: "서울 서초구 신반포로 176", keywords: ["메리어트", "반포", "호텔"] },
  { name: "인터컨티넨탈 서울 코엑스", area: "서울 강남구", address: "서울 강남구 봉은사로 524", keywords: ["인터컨티넨탈", "코엑스", "삼성동", "호텔"] },
  { name: "그랜드 인터컨티넨탈 서울 파르나스", area: "서울 강남구", address: "서울 강남구 테헤란로 521", keywords: ["파르나스", "인터컨티넨탈", "코엑스", "호텔"] },
  { name: "서울드래곤시티", area: "서울 용산구", address: "서울 용산구 청파로20길 95", keywords: ["드래곤시티", "용산", "호텔"] },
  { name: "엘타워", area: "서울 서초구", address: "서울 서초구 강남대로 213", keywords: ["엘타워", "양재", "컨벤션"] },
  { name: "더 라움", area: "서울 강남구", address: "서울 강남구 언주로 564", keywords: ["라움", "청담", "하우스웨딩"] },
  { name: "빌라드지디 청담", area: "서울 강남구", address: "서울 강남구 학동로 519", keywords: ["빌라드지디", "청담", "하우스웨딩"] },
  { name: "더채플앳청담", area: "서울 강남구", address: "서울 강남구 선릉로 757", keywords: ["채플", "청담", "웨딩홀"] },
  { name: "노블발렌티 대치", area: "서울 강남구", address: "서울 강남구 테헤란로 518", keywords: ["노블발렌티", "대치", "웨딩홀"] },
  { name: "노블발렌티 삼성", area: "서울 강남구", address: "서울 강남구 봉은사로 637", keywords: ["노블발렌티", "삼성", "웨딩홀"] },
  { name: "아펠가모 공덕", area: "서울 마포구", address: "서울 마포구 마포대로 92", keywords: ["아펠가모", "공덕", "웨딩홀"] },
  { name: "아펠가모 잠실", area: "서울 송파구", address: "서울 송파구 올림픽로 300", keywords: ["아펠가모", "잠실", "웨딩홀"] },
  { name: "아펠가모 선릉", area: "서울 강남구", address: "서울 강남구 테헤란로 322", keywords: ["아펠가모", "선릉", "웨딩홀"] },
  { name: "세빛섬 FIC", area: "서울 서초구", address: "서울 서초구 올림픽대로 2085-14", keywords: ["세빛섬", "반포", "한강"] },
  { name: "더컨벤션 영등포", area: "서울 영등포구", address: "서울 영등포구 국회대로38길 2", keywords: ["더컨벤션", "영등포", "컨벤션"] },
  {
    name: "상록아트홀",
    area: "서울 강남구",
    address: "서울 강남구 언주로 508",
    keywords: ["상록", "아트홀", "역삼", "교총", "웨딩홀"],
    transportGuides: [
      { mode: "지하철", detail: "2호선 역삼역 6번 출구에서 도보 약 8분" },
      { mode: "버스", detail: "역삼역.포스코타워역삼 정류장 하차 후 도보 이동" },
      { mode: "주차장", detail: "예식장 건물 주차장 이용 가능 (혼주/하객 주차는 예식장 안내 기준 적용)" },
    ],
  },
  { name: "AW컨벤션센터", area: "서울 종로구", address: "서울 종로구 자하문로 255", keywords: ["AW", "컨벤션", "종로"] },
  { name: "라마다서울신도림호텔 웨딩", area: "서울 구로구", address: "서울 구로구 경인로 624", keywords: ["라마다", "신도림", "호텔"] },
  { name: "웨딩시티 신도림", area: "서울 구로구", address: "서울 구로구 경인로 662", keywords: ["웨딩시티", "신도림", "웨딩홀"] },
  { name: "DMC타워웨딩", area: "서울 마포구", address: "서울 마포구 성암로 189", keywords: ["DMC", "상암", "웨딩홀"] },
  { name: "PJ호텔 웨딩홀", area: "서울 중구", address: "서울 중구 마른내로 71", keywords: ["PJ", "충무로", "호텔"] },
  { name: "더파티움 여의도", area: "서울 영등포구", address: "서울 영등포구 은행로 30", keywords: ["파티움", "여의도", "웨딩홀"] },
  { name: "소노펠리체 컨벤션", area: "서울 강남구", address: "서울 강남구 테헤란로 87길 22", keywords: ["소노펠리체", "삼성", "컨벤션"] },
  { name: "메리빌리아 더 프레스티지", area: "경기 수원시", address: "경기 수원시 권선구 세화로 134", keywords: ["메리빌리아", "수원", "웨딩홀"] },
  { name: "WI컨벤션", area: "경기 수원시", address: "경기 수원시 팔달구 권광로 134", keywords: ["WI", "수원", "컨벤션"] },
  { name: "라마다프라자 수원호텔 웨딩", area: "경기 수원시", address: "경기 수원시 팔달구 중부대로 150", keywords: ["라마다", "수원", "호텔"] },
  { name: "분당앤스퀘어", area: "경기 성남시", address: "경기 성남시 분당구 판교역로 235", keywords: ["분당", "판교", "컨벤션"] },
  { name: "시그니엘 웨딩 분당", area: "경기 성남시", address: "경기 성남시 분당구 성남대로 343", keywords: ["분당", "웨딩홀"] },
  { name: "의정부 웨딩팰리스", area: "경기 의정부시", address: "경기 의정부시 시민로 80", keywords: ["의정부", "웨딩홀"] },
  { name: "고양 엠블호텔 웨딩", area: "경기 고양시", address: "경기 고양시 일산동구 태극로 20", keywords: ["일산", "고양", "호텔"] },
  { name: "송도 센트럴파크호텔 웨딩", area: "인천 연수구", address: "인천 연수구 테크노파크로 193", keywords: ["송도", "센트럴파크", "호텔"] },
  { name: "인천 아시아드 웨딩컨벤션", area: "인천 서구", address: "인천 서구 봉수대로 806", keywords: ["아시아드", "인천", "컨벤션"] },
  { name: "인천 파라다이스시티 웨딩", area: "인천 중구", address: "인천 중구 영종해안남로321번길 186", keywords: ["파라다이스", "영종도", "호텔"] },
  { name: "파크하얏트 부산 웨딩", area: "부산 해운대구", address: "부산 해운대구 마린시티1로 51", keywords: ["파크하얏트", "부산", "호텔"] },
  { name: "웨스틴조선 부산 웨딩", area: "부산 해운대구", address: "부산 해운대구 동백로 67", keywords: ["웨스틴", "조선", "부산", "호텔"] },
  { name: "W웨딩시티", area: "부산 부산진구", address: "부산 부산진구 중앙대로 640", keywords: ["W웨딩", "서면", "웨딩홀"] },
  { name: "아시아드시티 웨딩홀", area: "부산 연제구", address: "부산 연제구 월드컵대로 344", keywords: ["아시아드", "부산", "웨딩홀"] },
  { name: "해운대 그랜드호텔 웨딩", area: "부산 해운대구", address: "부산 해운대구 해운대해변로 217", keywords: ["해운대", "부산", "호텔"] },
  { name: "호텔인터불고 대구 웨딩", area: "대구 수성구", address: "대구 수성구 팔현길 212", keywords: ["인터불고", "대구", "호텔"] },
  { name: "엑스코 인터불고 호텔 웨딩", area: "대구 북구", address: "대구 북구 유통단지로 80", keywords: ["엑스코", "인터불고", "대구"] },
  { name: "퀸벨호텔 웨딩", area: "대구 동구", address: "대구 동구 동촌로 200", keywords: ["퀸벨", "대구", "호텔"] },
  { name: "대구 웨딩비엔나", area: "대구 달서구", address: "대구 달서구 와룡로 169", keywords: ["비엔나", "대구", "웨딩홀"] },
  { name: "호텔 ICC 웨딩", area: "대전 유성구", address: "대전 유성구 엑스포로123번길 55", keywords: ["ICC", "대전", "호텔"] },
  { name: "유성컨벤션웨딩홀", area: "대전 유성구", address: "대전 유성구 온천로 81", keywords: ["유성", "대전", "웨딩홀"] },
  { name: "라도무스 아트센터", area: "대전 유성구", address: "대전 유성구 도룡동 3-1", keywords: ["라도무스", "대전", "웨딩홀"] },
  { name: "홀리데이인 광주 웨딩", area: "광주 서구", address: "광주 서구 상무누리로 55", keywords: ["홀리데이인", "광주", "호텔"] },
  { name: "드메르웨딩홀", area: "광주 광산구", address: "광주 광산구 임방울대로 549", keywords: ["드메르", "광주", "웨딩홀"] },
  { name: "위더스 광주", area: "광주 서구", address: "광주 서구 상무중앙로 57", keywords: ["위더스", "광주", "웨딩홀"] },
  { name: "JW컨벤션 울산", area: "울산 남구", address: "울산 남구 삼산로 261", keywords: ["JW컨벤션", "울산", "웨딩홀"] },
  { name: "문수컨벤션웨딩홀", area: "울산 남구", address: "울산 남구 문수로 44", keywords: ["문수", "울산", "웨딩홀"] },
  { name: "그랜드머큐어 앰배서더 창원 웨딩", area: "경남 창원시", address: "경남 창원시 성산구 원이대로 332", keywords: ["창원", "머큐어", "호텔"] },
  { name: "창원 컨벤션센터 웨딩", area: "경남 창원시", address: "경남 창원시 성산구 대원동 123", keywords: ["창원", "컨벤션"] },
  { name: "라마다플라자 제주 웨딩", area: "제주 제주시", address: "제주 제주시 탑동로 66", keywords: ["제주", "라마다", "호텔"] },
  { name: "메종글래드 제주 웨딩", area: "제주 제주시", address: "제주 제주시 노연로 80", keywords: ["메종글래드", "제주", "호텔"] },
  { name: "신화월드 랜딩컨벤션 웨딩", area: "제주 서귀포시", address: "제주 서귀포시 안덕면 신화역사로304번길 38", keywords: ["신화월드", "제주", "컨벤션"] },
  { name: "세종컨벤션센터 웨딩", area: "세종시", address: "세종 한누리대로 312", keywords: ["세종", "컨벤션"] },
  { name: "청주 S컨벤션", area: "충북 청주시", address: "충북 청주시 흥덕구 강내면 태성탑연로 250", keywords: ["청주", "S컨벤션"] },
  { name: "천안 CA웨딩컨벤션", area: "충남 천안시", address: "충남 천안시 동남구 만남로 82", keywords: ["천안", "웨딩컨벤션"] },
  { name: "아산 모나밸리 웨딩", area: "충남 아산시", address: "충남 아산시 순천향로 624", keywords: ["아산", "모나밸리", "웨딩"] },
  { name: "전주 르윈호텔 웨딩", area: "전북 전주시", address: "전북 전주시 완산구 기린대로 85", keywords: ["전주", "르윈", "호텔"] },
  { name: "군산 리츠프라자호텔 웨딩", area: "전북 군산시", address: "전북 군산시 한밭로 33", keywords: ["군산", "리츠프라자", "호텔"] },
  { name: "목포 현대호텔 웨딩", area: "전남 영암군", address: "전남 영암군 삼호읍 대불로 91", keywords: ["목포", "현대호텔", "웨딩"] },
  { name: "순천 에코그라드 호텔 웨딩", area: "전남 순천시", address: "전남 순천시 팔마2길 13", keywords: ["순천", "에코그라드", "호텔"] },
  { name: "포항 라한호텔 웨딩", area: "경북 포항시", address: "경북 포항시 북구 삼호로 265", keywords: ["포항", "라한", "호텔"] },
  { name: "구미 금오산호텔 웨딩", area: "경북 구미시", address: "경북 구미시 금오산로 400", keywords: ["구미", "금오산", "호텔"] },
  { name: "강릉 세인트존스호텔 웨딩", area: "강원 강릉시", address: "강원 강릉시 창해로 307", keywords: ["강릉", "세인트존스", "호텔"] },
  { name: "춘천 베어스호텔 웨딩", area: "강원 춘천시", address: "강원 춘천시 스포츠타운길 376", keywords: ["춘천", "베어스", "호텔"] },
];

function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

export function searchWeddingVenues(query: string, limit = 8): WeddingVenue[] {
  const normalizedQuery = normalizeKeyword(query);
  if (!normalizedQuery) return [];

  const ranked = WEDDING_VENUES.map((venue) => {
    const targetName = normalizeKeyword(venue.name);
    const targetArea = normalizeKeyword(venue.area);
    const targetAddress = normalizeKeyword(venue.address);
    const keywordHitCount = venue.keywords.filter((keyword) =>
      normalizeKeyword(keyword).includes(normalizedQuery)
    ).length;

    let score = 0;
    if (targetName.startsWith(normalizedQuery)) score += 120;
    if (targetName.includes(normalizedQuery)) score += 90;
    if (targetArea.includes(normalizedQuery)) score += 70;
    if (targetAddress.includes(normalizedQuery)) score += 50;
    if (keywordHitCount > 0) score += 60 + keywordHitCount * 8;

    return { venue, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.venue.name.localeCompare(b.venue.name, "ko"));

  return ranked.slice(0, limit).map((item) => item.venue);
}
