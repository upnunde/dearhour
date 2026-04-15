export type WeddingHallTransport = {
  subway?: string | null;
  bus?: string | null;
  parking?: string | null;
  shuttle?: string | null;
  navigation?: string | null;
  train?: string | null;
};

export type WeddingVenue = {
  id: string;
  name: string;
  area: string;
  address: string;
  keywords?: string[];
  transport?: WeddingHallTransport;
  transportGuides?: Array<{
    mode: string;
    detail: string;
  }>;
};

function inferArea(address: string) {
  const tokens = address.split(/\s+/).filter(Boolean);
  return tokens.slice(0, 2).join(" ").trim();
}

function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function buildTransportGuides(transport?: WeddingHallTransport) {
  if (!transport) return [] as Array<{ mode: string; detail: string }>;
  const entries: Array<[string, string | null | undefined]> = [
    ["지하철", transport.subway],
    ["버스", transport.bus],
    ["주차장", transport.parking],
    ["셔틀버스", transport.shuttle],
    ["자가용", transport.navigation],
    ["기차(KTX,SRT)", transport.train],
  ];
  return entries
    .map(([mode, detail]) => ({ mode, detail: String(detail ?? "").trim() }))
    .filter((item) => item.detail.length > 0);
}

export const WEDDING_HALL_MOCK_DATA: WeddingVenue[] = [
  { id: "WH-001", name: "더채플앳청담", address: "서울특별시 강남구 선릉로 757", area: inferArea("서울특별시 강남구 선릉로 757"), transport: { subway: "수인분당선 강남구청역 3번 출구 (도보 10분) / 7호선 학동역 10번 출구", bus: "간선 301, 342, 472 / 지선 3011, 3426 '영동고교 앞' 하차", parking: "본관 및 제휴 주차장 (하객 1시간 30분 무료, 발렛 파킹 안내)", shuttle: "강남구청역 3번 출구 앞 셔틀버스 수시 운행", navigation: "학동 사거리에서 영동대교 방향 직진", train: null } },
  { id: "WH-002", name: "아펠가모 선릉", address: "서울특별시 강남구 테헤란로 322", area: inferArea("서울특별시 강남구 테헤란로 322"), transport: { subway: "2호선, 수인분당선 선릉역 4번 출구 (도보 5분)", bus: "간선 146, 341, 360 / 지선 4434 '한국기술센터' 하차", parking: "건물 지하 (하객 2시간 무료)", shuttle: null, navigation: "선릉역 사거리에서 역삼역 방향 직진", train: null } },
  { id: "WH-003", name: "엘리에나호텔", address: "서울특별시 강남구 논현로 645", area: inferArea("서울특별시 강남구 논현로 645"), transport: { subway: "7호선 학동역 4번 출구 (도보 3분)", bus: "간선 147, 241, 401 '학동역' 하차", parking: "호텔 내 주차 및 발렛파킹 (하객 2시간 무료)", shuttle: null, navigation: "학동역 교차로에서 언주역 방향", train: null } },
  { id: "WH-004", name: "빌라드지디 청담", address: "서울특별시 강남구 영동대로 112길 66", area: inferArea("서울특별시 강남구 영동대로 112길 66"), transport: { subway: "7호선 청담역 12번 출구 (도보 10분)", bus: "간선 143, 362 '청담치안센터' 하차", parking: "전용 주차장 발렛 서비스 (하객 2시간 무료)", shuttle: "청담역 12번 출구 셔틀버스 운행", navigation: "영동대교 남단 교차로 청담사거리 방향", train: null } },
  { id: "WH-005", name: "라움 아트센터", address: "서울특별시 강남구 언주로 564", area: inferArea("서울특별시 강남구 언주로 564"), transport: { subway: "9호선 선정릉역 4번 출구 (도보 5분)", bus: "간선 141, 242 '경복아파트 사거리' 하차", parking: "라움 주차장 (하객 3시간 무료)", shuttle: null, navigation: "르네상스 사거리에서 경복아파트 방향", train: null } },
  { id: "WH-006", name: "더컨벤션 반포", address: "서울특별시 서초구 신반포로 241", area: inferArea("서울특별시 서초구 신반포로 241"), transport: { subway: "9호선 신논현역 1번 출구 (도보 10분)", bus: "간선 142, 341 '교보타워 사거리' 하차", parking: "건물 내 주차장 (하객 2시간 무료)", shuttle: null, navigation: "반포 IC 진출 후 교보타워 우회전", train: null } },
  { id: "WH-007", name: "아펠가모 반포", address: "서울특별시 서초구 반포대로 235", area: inferArea("서울특별시 서초구 반포대로 235"), transport: { subway: "3, 7, 9호선 고속터미널역 5번 출구 (도보 3분)", bus: "간선 143, 401 '고속터미널' 하차", parking: "효성해링턴타워 (하객 2시간 무료)", shuttle: null, navigation: "서울고속버스터미널 사거리 서초역 방향", train: "KTX 서울역 하차 후 4호선->3호선 환승" } },
  { id: "WH-008", name: "상록아트홀", address: "서울특별시 강남구 언주로 508", area: inferArea("서울특별시 강남구 언주로 508"), transport: { subway: "2호선, 수인분당선 선릉역 5번 출구", bus: "간선 141, 242, 3422 '공무원연금매점' 하차", parking: "건물 지상/지하 주차장 (하객 1시간 30분 무료)", shuttle: "선릉역 5번 출구 셔틀버스 10분 간격 운행", navigation: "르네상스 사거리에서 언주역 방향", train: "SRT 수서역 하차 후 분당선 환승" } },
  { id: "WH-009", name: "셀럽앤어셈", address: "서울특별시 강남구 언주로 711", area: inferArea("서울특별시 강남구 언주로 711"), transport: { subway: "7호선 학동역 10번 출구 (도보 7분)", bus: "간선 147, 241 '세관앞' 하차", parking: "건설회관 주차장 1,000대 (하객 2시간 무료)", shuttle: null, navigation: "서울세관 사거리에서 강남구청역 방향", train: null } },
  { id: "WH-010", name: "드레스가든", address: "서울특별시 강남구 영동대로 707", area: inferArea("서울특별시 강남구 영동대로 707"), transport: { subway: "7호선 청담역 13번 출구 (도보 1분 직결)", bus: "간선 143, 362 '청담역' 하차", parking: "본관 주차장 발렛 파킹 (하객 2시간 무료)", shuttle: null, navigation: "청담역 사거리 코엑스 방향", train: null } },
  { id: "WH-011", name: "보타닉파크웨딩", address: "서울특별시 강서구 마곡중앙5로 6", area: inferArea("서울특별시 강서구 마곡중앙5로 6"), transport: { subway: "9호선, 공항철도 마곡나루역 1, 2번 출구 지하 연결", bus: "지선 6642, 6645, 6648 '마곡나루역' 하차", parking: "마곡나루역 보타닉푸르지오시티 주차장 (하객 2시간 무료)", shuttle: null, navigation: "올림픽대로 발산IC 진출 후 마곡나루역 방향", train: "KTX 서울역 하차 후 공항철도 환승" } },
  { id: "WH-012", name: "더베뉴지서울", address: "서울특별시 강서구 강서로 388", area: inferArea("서울특별시 강서구 강서로 388"), transport: { subway: "5호선 발산역 3번 출구 (도보 2분)", bus: "간선 601, 605, 642 '발산역' 하차", parking: "건물 지상/지하 주차장 1,200대 (하객 2시간 무료)", shuttle: null, navigation: "발산역 교차로 마곡 방면 우측", train: null } },
  { id: "WH-013", name: "여의도 더파티움", address: "서울특별시 영등포구 은행로 30", area: inferArea("서울특별시 영등포구 은행로 30"), transport: { subway: "9호선 국회의사당역 3번 출구 (도보 5분)", bus: "간선 153, 162 '국회의사당역' 하차", parking: "중소기업중앙회관 주차장 (하객 2시간 무료)", shuttle: "국회의사당역 3번 출구 수시 운행", navigation: "여의도공원에서 국회의사당 방향 직진", train: "KTX 영등포역 하차 후 버스 환승" } },
  { id: "WH-014", name: "여의도 글래드호텔", address: "서울특별시 영등포구 의사당대로 16", area: inferArea("서울특별시 영등포구 의사당대로 16"), transport: { subway: "9호선 국회의사당역 4번 출구 (도보 1분)", bus: "간선 153, 162 '국회의사당역' 하차", parking: "호텔 발렛 파킹 및 주차장 (하객 3시간 무료)", shuttle: null, navigation: "여의도 교차로에서 국회 방면 좌측", train: null } },
  { id: "WH-015", name: "라마다 서울 신도림 호텔", address: "서울특별시 구로구 경인로 624", area: inferArea("서울특별시 구로구 경인로 624"), transport: { subway: "1호선, 2호선 신도림역 1번 출구", bus: "간선 160, 503 '신도림역' 하차", parking: "호텔 지하 주차장 (하객 1시간 30분 무료)", shuttle: "신도림역 1번 출구 광장 앞 셔틀 10분 간격", navigation: "신도림역 교차로에서 구로역 방향", train: "KTX 영등포역 하차 후 1호선 환승" } },
  { id: "WH-016", name: "더링크호텔 서울", address: "서울특별시 구로구 경인로 610", area: inferArea("서울특별시 구로구 경인로 610"), transport: { subway: "1호선 구로역 3번 출구 / 1,2호선 신도림역", bus: "간선 160, 503, 600 '구로역' 하차", parking: "호텔 주차장 800대 수용 (하객 2시간 무료)", shuttle: "신도림역 1번 출구 셔틀버스 운행", navigation: "구로역 사거리에서 신도림 방향", train: null } },
  { id: "WH-017", name: "더컨벤션 영등포", address: "서울특별시 영등포구 국회대로38길 2", area: inferArea("서울특별시 영등포구 국회대로38길 2"), transport: { subway: "2호선, 5호선 영등포구청역 4번 출구 (도보 5분)", bus: "지선 5620, 6631 '영등포구청' 하차", parking: "건물 주차장 및 공영주차장 (하객 2시간 무료)", shuttle: null, navigation: "영등포구청 사거리에서 당산 방향", train: "KTX 영등포역 하차 후 택시 10분" } },
  { id: "WH-018", name: "웨딩시그니처 합정", address: "서울특별시 마포구 양화로 87", area: inferArea("서울특별시 마포구 양화로 87"), transport: { subway: "2, 6호선 합정역 2번 출구 (도보 3분)", bus: "간선 271, 602, 603 '합정역' 하차", parking: "건물 내 주차장 (하객 2시간 무료)", shuttle: null, navigation: "홍대입구역에서 합정역 방향 직진", train: "KTX 서울역 하차 후 공항철도->홍대입구->합정" } },
  { id: "WH-019", name: "더 신라 서울", address: "서울특별시 중구 동호로 249", area: inferArea("서울특별시 중구 동호로 249"), transport: { subway: "3호선 동대입구역 5번 출구 (도보 3분)", bus: "간선 144, 301 '장충체육관 앞' 하차", parking: "호텔 내 주차장 (하객 3시간 무료)", shuttle: "동대입구역 5번 출구 앞 신라호텔 셔틀", navigation: "장충체육관 사거리에서 한남대교 우회전", train: "KTX 서울역 하차 후 택시 15분" } },
  { id: "WH-020", name: "더플라자호텔", address: "서울특별시 중구 소공로 119", area: inferArea("서울특별시 중구 소공로 119"), transport: { subway: "1, 2호선 시청역 6번 출구 (도보 2분)", bus: "간선 150, 402, 501 '시청앞' 하차", parking: "호텔 주차장 (하객 3시간 무료)", shuttle: null, navigation: "시청 교차로에서 소공로 방향 직진", train: "KTX 서울역 하차 후 1호선 환승 (1정거장)" } },
  { id: "WH-021", name: "PJ호텔", address: "서울특별시 중구 마른내로 71", area: inferArea("서울특별시 중구 마른내로 71"), transport: { subway: "2, 5호선 을지로4가역 10번 출구 (도보 5분)", bus: "간선 104, 140 '을지로4가' 하차", parking: "호텔 주차장 및 을지트윈타워 제휴 주차장 (하객 2시간 무료)", shuttle: "충무로역 8번 출구 셔틀 운행", navigation: "명동에서 퇴계로 3가 교차로 지나 좌회전", train: null } },
  { id: "WH-022", name: "더컨벤션 잠실", address: "서울특별시 송파구 올림픽로 319", area: inferArea("서울특별시 송파구 올림픽로 319"), transport: { subway: "8호선 몽촌토성역 2, 3번 출구 / 2호선 잠실역 8번 출구", bus: "간선 340, 341 '잠실진주아파트' 하차", parking: "교통회관 주차장 (하객 2시간 무료)", shuttle: null, navigation: "잠실역 사거리에서 올림픽공원 방향 우측", train: null } },
  { id: "WH-023", name: "서울웨딩타워", address: "서울특별시 송파구 양재대로 932", area: inferArea("서울특별시 송파구 양재대로 932"), transport: { subway: "3, 8호선 가락시장역 2번 출구 (도보 3분)", bus: "간선 301, 401 '가락시장.가락몰' 하차", parking: "가락몰 업무동 지하 3층 (하객 2시간 무료)", shuttle: null, navigation: "송파대로 직진 후 가락시장 사거리에서 수서 우회전", train: "SRT 수서역 하차 후 3호선 환승" } },
  { id: "WH-024", name: "루이비스웨딩 문정", address: "서울특별시 송파구 법원로 128", area: inferArea("서울특별시 송파구 법원로 128"), transport: { subway: "8호선 문정역 3번 출구 (도보 10분)", bus: "간선 302, 303 '문정법조단지' 하차", parking: "H비즈니스파크 주차장 (하객 2시간 무료)", shuttle: "문정역 3번 출구 셔틀버스 10분 간격 운행", navigation: "송파대로 직진 후 문정역 교차로 우회전", train: "SRT 수서역 하차 후 택시 10분" } },
  { id: "WH-025", name: "그랜드 워커힐 서울", address: "서울특별시 광진구 워커힐로 177", area: inferArea("서울특별시 광진구 워커힐로 177"), transport: { subway: "5호선 광나루역 2번 출구 / 2호선 강변역 1번 출구", bus: "광역 1, 13, 15 '워커힐입구' 하차", parking: "호텔 주차타워 (하객 6시간 무료)", shuttle: "강변역 및 광나루역 앞 호텔 무료 셔틀버스 운행", navigation: "천호대교 북단에서 구리 방향", train: null } },
  { id: "WH-026", name: "빌라드지디 수서", address: "서울특별시 강남구 밤고개로 21길 79", area: inferArea("서울특별시 강남구 밤고개로 21길 79"), transport: { subway: "3호선, 수인분당선 수서역 4번 출구", bus: "마을 강남06 '율현초등학교' 하차", parking: "전용 주차장 및 공영주차장 (하객 2시간 무료)", shuttle: "수서역 4번 출구 앞 셔틀 수시 운행", navigation: "수서역에서 세곡동 방향 직진", train: "SRT 수서역 하차 후 셔틀버스 탑승" } },
  { id: "WH-027", name: "수원 노블레스웨딩컨벤션", address: "경기도 수원시 팔달구 매산로 1가 18", area: inferArea("경기도 수원시 팔달구 매산로 1가 18"), transport: { subway: "1호선, 수인분당선 수원역 7번 출구 (도보 3분)", bus: "수원역 환승센터 경유 버스 전체", parking: "건물 내 800대 (하객 2시간 무료)", shuttle: null, navigation: "수원역 육교 지나 AK플라자 맞은편", train: "KTX 수원역 하차 후 도보 5분" } },
  { id: "WH-028", name: "라마다프라자 수원", address: "경기도 수원시 팔달구 중부대로 150", area: inferArea("경기도 수원시 팔달구 중부대로 150"), transport: { subway: "수인분당선 수원시청역 5번 출구 (택시 5분)", bus: "일반 10, 11-1 'KBS 수원센터' 하차", parking: "호텔 주차장 (하객 3시간 무료)", shuttle: null, navigation: "동수원IC 진출 후 창룡문 방향", train: "KTX 수원역 하차 후 택시 15분" } },
  { id: "WH-029", name: "루이스컨벤션", address: "경기도 수원시 권선구 권선로 308-18", area: inferArea("경기도 수원시 권선구 권선로 308-18"), transport: { subway: "수인분당선 수원시청역 2번 출구", bus: "일반 51, 82-1 '농수산물시장' 하차", parking: "단독 건물 지상 주차장 (하객 무료)", shuttle: null, navigation: "권선사거리에서 농수산물시장 방향", train: null } },
  { id: "WH-030", name: "판교 메리어트호텔", address: "경기도 성남시 분당구 판교역로192번길 12", area: inferArea("경기도 성남시 분당구 판교역로192번길 12"), transport: { subway: "신분당선, 경강선 판교역 1번 출구 (도보 3분)", bus: "광역 9007, 9300 '판교역' 하차", parking: "호텔 지하 주차장 (하객 3시간 무료)", shuttle: null, navigation: "판교 IC 진출 후 판교역 방향 직진", train: "SRT 수서역 하차 후 분당선->판교역" } },
  { id: "WH-031", name: "분당 라온스퀘어", address: "경기도 성남시 분당구 서현로 180", area: inferArea("경기도 성남시 분당구 서현로 180"), transport: { subway: "수인분당선 서현역 5번 출구 (도보 5분)", bus: "일반 15, 520, 7007-1 '서현역.AK플라자' 하차", parking: "건물 내 700대 규모 (하객 2시간 무료)", shuttle: null, navigation: "판교 IC 진출 후 서현동 방향 직진", train: null } },
  { id: "WH-032", name: "동탄 스타즈호텔 프리미어", address: "경기도 화성시 동탄반석로 171", area: inferArea("경기도 화성시 동탄반석로 171"), transport: { subway: "1호선 서동탄역 (택시 10분)", bus: "일반 63, 708 '동탄아이파크' 하차", parking: "호텔 지하 주차장 (하객 2시간 무료)", shuttle: null, navigation: "동탄 IC 진출 후 메타폴리스 방향", train: "SRT 동탄역 하차 후 택시 10분" } },
  { id: "WH-033", name: "안양 아르떼채플컨벤션", address: "경기도 안양시 동안구 시민대로 109", area: inferArea("경기도 안양시 동안구 시민대로 109"), transport: { subway: "4호선 평촌역 3번 출구 (도보 3분)", bus: "일반 1, 3, 5-1 '이마트 평촌점' 하차", parking: "건물 주차장 및 공영주차장 (하객 2시간 무료)", shuttle: null, navigation: "평촌 IC 진출 후 안양시청 방향", train: null } },
  { id: "WH-034", name: "광명 무역센터컨벤션", address: "경기도 광명시 일직로 72", area: inferArea("경기도 광명시 일직로 72"), transport: { subway: "1호선 광명역 1번 출구 (도보 5분)", bus: "일반 3, 12 'KTX광명역' 하차", parking: "무역센터 주차장 (하객 2시간 무료)", shuttle: null, navigation: "광명역 IC 진출 후 코스트코 방향", train: "KTX 광명역 하차 후 1번 출구 횡단보도 이용" } },
  { id: "WH-035", name: "부천 소풍컨벤션", address: "경기도 부천시 원미구 송내대로 239", area: inferArea("경기도 부천시 원미구 송내대로 239"), transport: { subway: "7호선 상동역 1번 출구 (도보 5분)", bus: "광역 1300, 1601, 8906 '부천터미널 소풍' 하차", parking: "터미널 소풍 지하 주차장 (하객 2시간 무료)", shuttle: null, navigation: "중동 IC 진출 후 부천시청 방향 500m", train: null } },
  { id: "WH-036", name: "일산 웨스턴빌리프", address: "경기도 고양시 일산동구 정발산로 24", area: inferArea("경기도 고양시 일산동구 정발산로 24"), transport: { subway: "3호선 정발산역 1번 출구 (도보 5분)", bus: "일반 11, 88 '일산동구청' 하차", parking: "웨스턴돔 지하 주차장 (하객 2시간 무료)", shuttle: null, navigation: "장항IC에서 킨텍스 방향 우회전", train: null } },
  { id: "WH-037", name: "일산 킨텍스 바이케이터링", address: "경기도 고양시 일산서구 킨텍스로 217-60", area: inferArea("경기도 고양시 일산서구 킨텍스로 217-60"), transport: { subway: "3호선 대화역 2번 출구 (도보 15분)", bus: "일반 39, 82 '킨텍스 제1전시장' 하차", parking: "킨텍스 전시장 주차장 (하객 무료 주차권 지급)", shuttle: "대화역 2번 출구 셔틀버스 운행", navigation: "킨텍스 IC 진출 후 직진", train: null } },
  { id: "WH-038", name: "파주 퍼스트가든", address: "경기도 파주시 탑삭골길 260", area: inferArea("경기도 파주시 탑삭골길 260"), transport: { subway: "경의중앙선 운정역 1번 출구 (택시 10분)", bus: "마을 088 '퍼스트가든' 하차", parking: "퍼스트가든 야외 주차장 (무료)", shuttle: null, navigation: "자유로 문발 IC 진출 후 광탄 방향", train: null } },
  { id: "WH-039", name: "송도 센트럴파크호텔", address: "인천광역시 연수구 테크노파크로 193", area: inferArea("인천광역시 연수구 테크노파크로 193"), transport: { subway: "인천 1호선 센트럴파크역 3번 출구 (도보 1분)", bus: "간선 6-1, 8 '센트럴파크역' 하차", parking: "호텔 지하 주차장 (하객 3시간 무료)", shuttle: null, navigation: "송도 IC 진출 후 센트럴파크 방향", train: null } },
  { id: "WH-040", name: "CN웨딩홀 계산점", address: "인천광역시 계양구 계산새로 71", area: inferArea("인천광역시 계양구 계산새로 71"), transport: { subway: "인천 1호선 계산역 1번 출구 (도보 5분)", bus: "간선 111, 302 '계양구청' 하차", parking: "건물 내 주차타워 (하객 2시간 무료)", shuttle: null, navigation: "계양 IC 진출 후 계산동 방향", train: null } },
  { id: "WH-041", name: "부평 폴라리스웨딩홀", address: "인천광역시 부평구 부평대로 24", area: inferArea("인천광역시 부평구 부평대로 24"), transport: { subway: "1호선, 인천 1호선 부평역 15번 출구", bus: "부평역 경유 모든 버스", parking: "건물 지하 및 외부 제휴 주차장 (하객 2시간 무료)", shuttle: null, navigation: "부평 IC 진출 후 부평역 로터리 방향", train: "KTX 이용 불가, 1호선 부평역 이용" } },
  { id: "WH-042", name: "대전 ICC호텔", address: "대전광역시 유성구 엑스포로 123번길 55", area: inferArea("대전광역시 유성구 엑스포로 123번길 55"), transport: { subway: "1호선 정부청사역 후 택시 이동 권장", bus: "간선 121, 705 '스마트시티 5단지' 하차", parking: "호텔 주차장 (하객 2시간 무료)", shuttle: null, navigation: "북대전IC에서 엑스포 과학공원 사거리 우회전", train: "KTX 대전역 하차 후 택시 25분" } },
  { id: "WH-043", name: "대전 라도무스아트센터", address: "대전광역시 유성구 동서대로 639", area: inferArea("대전광역시 유성구 동서대로 639"), transport: { subway: "1호선 유성온천역 3번 출구 (택시 5분)", bus: "간선 114, 115 '목원대학교네거리' 하차", parking: "1,300대 대형 주차장 (시간제한 없음)", shuttle: null, navigation: "유성 IC 진출 후 목원대 방면 우회전", train: "KTX 서대전역 하차 후 택시 20분" } },
  { id: "WH-044", name: "루이비스컨벤션 대전", address: "대전광역시 유성구 테크노9로 35", area: inferArea("대전광역시 유성구 테크노9로 35"), transport: { subway: "지하철역 없음 (택시 이용 권장)", bus: "간선 705, 712 '현대프리미엄아울렛' 하차", parking: "건물 자체 및 전용 주차장 1,000대 (무료)", shuttle: "대전역, 유성온천역 셔틀버스 운행", navigation: "신탄진 IC 진출 후 용산동 아울렛 방향", train: "KTX 대전역 하차 후 셔틀버스 이용" } },
  { id: "WH-045", name: "대구 인터불고호텔", address: "대구광역시 수성구 팔현길 212", area: inferArea("대구광역시 수성구 팔현길 212"), transport: { subway: "1호선 동촌역 1번 출구 (도보 15분)", bus: "지선 수성1, 524 '인터불고호텔' 하차", parking: "호텔 야외 및 실내 주차장 (무료)", shuttle: null, navigation: "동대구 IC 진출 후 망우당공원 방면", train: "KTX 동대구역 하차 후 택시 10분" } },
  { id: "WH-046", name: "대구 칼라디움웨딩", address: "대구광역시 동구 안심로 300", area: inferArea("대구광역시 동구 안심로 300"), transport: { subway: "1호선 안심역 1번 출구 (직결)", bus: "급행 5 / 간선 508, 518 '안심역' 하차", parking: "건물 1000대 주차 (하객 2시간 무료)", shuttle: null, navigation: "동대구 IC 진출 후 안심네거리 방향", train: "KTX 동대구역 하차 후 1호선 환승" } },
  { id: "WH-047", name: "대구 노비아갈라 동대구", address: "대구광역시 동구 동촌로 87", area: inferArea("대구광역시 동구 동촌로 87"), transport: { subway: "1호선 동촌역 1번 출구 (도보 5분)", bus: "간선 618, 708, 808 '동촌역' 하차", parking: "건물 전용 주차장 및 공영주차장 (하객 1시간 30분 무료)", shuttle: null, navigation: "동대구IC 방면에서 아양교 진입 전 우회전", train: "KTX 동대구역 하차 후 택시 5분" } },
  { id: "WH-048", name: "부산 그랜드 모먼트", address: "부산광역시 남구 황령대로 319번가길 175", area: inferArea("부산광역시 남구 황령대로 319번가길 175"), transport: { subway: "2호선 남천역 3번 출구", bus: "마을 남구2 '황령산 벚꽃길' 하차", parking: "건물 내 주차장 (하객 3시간 무료)", shuttle: "남천역 3번 출구 메가마트 앞 셔틀", navigation: "황령터널 진입 전 우측 램프 진출", train: "KTX 부산역 하차 후 2호선 환승" } },
  { id: "WH-049", name: "광주 드메르웨딩홀", address: "광주광역시 광산구 임방울대로 549", area: inferArea("광주광역시 광산구 임방울대로 549"), transport: { subway: "없음", bus: "첨단09, 첨단30 '도천저수지' 하차", parking: "2,000대 규모 지상 주차장 (무료)", shuttle: null, navigation: "광산 IC 진출 후 수완지구 방면 직진", train: "KTX 광주송정역 하차 후 택시 15분" } },
  { id: "WH-050", name: "광주 위더스웨딩", address: "광주광역시 서구 죽봉대로 153", area: inferArea("광주광역시 서구 죽봉대로 153"), transport: { subway: "1호선 농성역 5번 출구 (도보 15분)", bus: "광천터미널 경유 모든 노선 '광천터미널' 하차", parking: "건물 주차타워 및 외부 제휴 주차장 (하객 2시간 무료)", shuttle: null, navigation: "서광주 IC 진출 후 광천터미널 방향", train: "KTX 광주송정역 하차 후 지하철 농성역 하차" } },
];

export const WEDDING_VENUES: WeddingVenue[] = WEDDING_HALL_MOCK_DATA;

export function searchWeddingVenues(query: string, limit = 8): WeddingVenue[] {
  const normalizedQuery = normalizeKeyword(query);
  if (!normalizedQuery) return [];

  const ranked = WEDDING_VENUES.map((venue) => {
    const targetName = normalizeKeyword(venue.name);
    const targetArea = normalizeKeyword(venue.area);
    const targetAddress = normalizeKeyword(venue.address);
    const keywordSources = [venue.name, venue.area, venue.address, ...(venue.keywords ?? [])];
    const keywordHitCount = keywordSources.filter((keyword) =>
      normalizeKeyword(String(keyword)).includes(normalizedQuery),
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

  return ranked.slice(0, limit).map((item) => ({
    ...item.venue,
    transportGuides:
      Array.isArray(item.venue.transportGuides) && item.venue.transportGuides.length > 0
        ? item.venue.transportGuides
        : buildTransportGuides(item.venue.transport),
  }));
}
