export const GUESTBOOK_TITLE_OPTIONS = [
  "축하해 주세요",
  "방명록",
  "축하 메시지",
  "축하 인사 남기기",
] as const;

export const RSVP_TITLE_OPTIONS = [
  "참석 여부",
  "함께해 주실 마음을 알려주세요",
  "소중한 날 함께해 주세요",
  "마음을 전해 주세요",
] as const;

export const LOCATION_TITLE_OPTIONS = [
  "오시는 길",
  "위치 안내",
  "찾아오시는 길",
  "교통 안내",
] as const;

export const NOTICE_HEADING_OPTIONS = [
  "안내사항",
  "예식 안내",
  "함께해 주셔서 감사합니다",
  "소중한 분들께 전하는 안내",
] as const;

export const INTRO_HEADING_OPTIONS = [
  "저희를 소개합니다",
  "두 사람을 소개합니다",
  "신랑 & 신부 이야기",
  "함께 걸어갈 두 사람",
] as const;

export const TRANSPORT_MODE_OPTIONS = [
  "버스",
  "지하철",
  "주차장",
  "대중교통",
  "셔틀버스",
  "대절버스",
  "기차(KTX,SRT)",
  "자가용",
] as const;

export const YOUTUBE_TITLE_OPTIONS = [
  "영상으로 전하는 마음",
  "우리의 이야기",
  "식전 영상",
  "추억을 담아",
] as const;

export const ACCOUNT_TITLE_OPTIONS = [
  "마음 전하실 곳",
  "축의금 안내",
  "계좌 안내",
  "신랑·신부에게",
] as const;

export const GUEST_UPLOAD_TITLE_OPTIONS = [
  "추억을 공유해 주세요",
  "하객 사진 올리기",
  "예식 사진 나눔",
  "소중한 순간을 남겨 주세요",
] as const;

export type MainImageFrameId = "full" | "border" | "oval" | "ellipse" | "arch";

export const MAIN_IMAGE_FRAME_OPTIONS: { id: MainImageFrameId; label: string }[] = [
  { id: "full", label: "기본" },
  { id: "border", label: "테두리" },
  { id: "oval", label: "타원형" },
  { id: "ellipse", label: "세로 타원" },
  { id: "arch", label: "아치형" },
];

export const BANK_OPTIONS = [
  "카카오뱅크",
  "국민은행",
  "기업은행",
  "농협은행",
  "신한은행",
  "산업은행",
  "우리은행",
  "한국씨티은행",
  "하나은행",
  "SC제일은행",
  "경남은행",
  "광주은행",
  "대구은행",
  "도이치은행",
  "뱅크오브아메리카",
  "부산은행",
  "산림조합중앙회",
  "저축은행",
] as const;

export const BANK_LOGO_DOMAIN: Record<(typeof BANK_OPTIONS)[number], string | null> = {
  카카오뱅크: "kakaobank.com",
  국민은행: "kbstar.com",
  기업은행: "ibk.co.kr",
  농협은행: "nhbank.com",
  신한은행: "shinhan.com",
  산업은행: "kdb.co.kr",
  우리은행: "wooribank.com",
  한국씨티은행: "citi.com",
  하나은행: "kebhana.com",
  SC제일은행: "standardchartered.co.kr",
  경남은행: "knbank.co.kr",
  광주은행: "kjbank.com",
  대구은행: "dgb.co.kr",
  도이치은행: "db.com",
  뱅크오브아메리카: "bankofamerica.com",
  부산은행: "busanbank.co.kr",
  산림조합중앙회: "nfcf.or.kr",
  저축은행: "fsb.or.kr",
};

export const BRIDE_RELATION_OPTIONS = [
  "딸",
  "장녀",
  "차녀",
  "삼녀",
  "사녀",
  "오녀",
  "육녀",
  "독녀",
  "막내",
  "조카",
  "손녀",
  "동생",
  "외동",
] as const;

export const GROOM_RELATION_OPTIONS = [
  "아들",
  "장남",
  "차남",
  "삼남",
  "사남",
  "오남",
  "육남",
  "독남",
  "막내",
  "조카",
  "손자",
  "동생",
  "외동",
] as const;
