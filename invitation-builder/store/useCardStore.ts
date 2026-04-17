import { create } from 'zustand';
import { DEFAULT_MAIN_PRESET_URL } from '../lib/main-image-presets';

// --- 1. 상세 타입 정의 ---
export interface StyleConfig {
  primaryColor: string;
  bgColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface Parent {
  name: string;
  phone: string;
  isDeceased: boolean; // 故 여부
  isOn: boolean;       // 노출 여부
}

export interface Profile {
  name: string;
  phone: string;
  relation: string; // 장남, 아들 등
  father: Parent;
  mother: Parent;
}

export interface EventInfo {
  date: string;
  time: string;
  venueName: string;
  venueDetail: string;
  /** D-Day 문구 표시 여부 (달력 아래 구분선은 이 옵션과 무관하게 항상 노출) */
  showDday: boolean;
  /** Calendar block preview layout: A serif numerals + ring day, B legacy grid + filled circle day, C split header + underline day */
  calendarDisplayType?: 'A' | 'B' | 'C';
  /** true: theme key/on-primary on calendar; false/omit: neutral grayscale */
  calendarUseThemeColor?: boolean;
}

export interface AccountItem {
  id: string;
  groupName: string;
  bank: string;
  accountNumber: string;
  holder: string;
  isKakaoPay: boolean;
  isExpanded: boolean;
}

export interface IntroProfile {
  /** 소개 카드에 사용할 프로필 사진(data URL / object URL / 원격 URL) */
  image: string;
  /** 생년월일 또는 나이 텍스트 (예: "1990.12.10" 혹은 "35세") */
  birthDate: string;
  /** MBTI 4글자 */
  mbti: string;
  /** 취미(쉼표로 구분) 예: "캠핑, 러닝" */
  hobbies: string;
  /** 한 줄 소개·특징 */
  traits: string;
}

export interface MusicConfig {
  selectedId: string;
  uploadedFile: { name: string; url: string } | null;
  isLoop: boolean;
}

// --- 2. 전체 데이터 규격 ---
export interface CardData {
  style: StyleConfig;
  music: MusicConfig;
  theme: {
    fontFamily: string;
    fontScale: 'md' | 'lg';
    colorPreset: string;
    bgm: string;
    bgmAutoplay: boolean;
    scrollEffect: boolean;
    particleEffect: string; // 안개, 벚꽃잎 등
  };
  main: {
    image: string;
    images?: string[];
    title: string;
    titleColor: string;
    bodyColor: string;
    animation: string;
    introType?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
    imageMode?: 'single' | 'multi' | 'default';
    /** 기본 이미지 모드에서 선택한 에셋 URL (public SVG 등) */
    presetImage?: string;
    transitionEffect?: string;
    transitionIntervalSec?: number;
    /** 메인 히어로 이미지 프레임 */
    imageFrame?: 'full' | 'border' | 'oval' | 'ellipse' | 'arch';
    /** 메인 등록 이미지 흑백 전환 */
    blackAndWhite?: boolean;
  };
  hosts: { groom: Profile; bride: Profile; showContacts: boolean };
  eventInfo: EventInfo;
  greeting: { title: string; content: string };
  /** 신랑/신부 소개(About Us) — 섹션 ON/OFF는 `sectionEnabled.intro` */
  intro: {
    /** 미리보기 상단 큰 제목 */
    sectionHeading: string;
    /**
     * 프로필 레이아웃 타입.
     * A: 에디토리얼 미러(좌우 교차) · B: 상단 가로사진 스택 · C: 원형 포트레이트 센터 · D: 소프트 카드
     */
    layoutType?: 'A' | 'B' | 'C' | 'D';
    groom: IntroProfile;
    bride: IntroProfile;
  };
  notice: { title: string; content: string; /** 미리보기 상단 큰 제목 */ sectionHeading?: string };
  location: {
    title?: string;
    address: string;
    car: string;     // 자차/주차장
    bus: string;     // 버스
    subway: string;  // 지하철
    transports?: Array<{
      mode: string;   // 예: 지하철/버스/자동차
      detail: string; // 상세 안내
    }>;
    mapProvider: 'kakao' | 'naver'; 
    mapType?: 'photo' | '2d';
  };
  accounts: {
    title: string;
    content: string;
    displayMode?: 'accordion' | 'expanded';
    list: AccountItem[];
  };
  gallery: {
    isOn: boolean;
    type: 'swipe' | 'list';
    images: string[];
    imageGap?: 'none' | 'small' | 'middle' | 'large';
    useLoadMore?: boolean;
  };
  guestbook: {
    isOn: boolean;
    title: string;
    description: string;
    password: string;
    allowAnonymous: boolean;
    requireApproval: boolean;
    entries: Array<{
      id: string;
      name: string;
      message: string;
      createdAt: string;
      password?: string;
      isSecret: boolean;
    }>;
  };
  youtube: {
    isOn: boolean;
    title: string;
    url: string;
    isLoop: boolean;
    sourceType?: 'file' | 'url';
    fileUrl?: string;
  };
  guestUpload: {
    isOn: boolean;
    title: string;
    description: string;
    storageGb: 2 | 5 | 10 | 20;
    showAfterEventModal: boolean;
  };
  share: {
    useThumbnail: boolean;
    thumbnail: string;
    title: string;
    description: string;
    link: string;
    enableCopy: boolean;
    enableKakao: boolean;
  };
  /**
   * 연락처 섹션 상단 배너 — 공유(OG) 썸네일과 별도 필드 (동기화하지 않음).
   * 구버전 저장 데이터에는 없을 수 있으며, 로드 시 `ensureContactBlock`으로 한 번 보정합니다.
   */
  contact: {
    useThumbnail: boolean;
    thumbnail: string;
  };
  protect: { preventCapture: boolean; preventZoom: boolean; preventDownload: boolean };
  /** 참석 여부(RSVP) — 섹션 ON/OFF는 `sectionEnabled.rsvp` */
  rsvp: {
    title: string;
    description: string;
    /** 동반 인원 수 입력 받기 */
    collectGuestCount: boolean;
    /** 마감일(YYYY-MM-DD, 비우면 제한 없음) */
    deadline: string;
  };
  /** 공개일 설정 */
  publish: { publicStartDate: string };
  /** 영문 등 다국어 노출(추후 콘텐츠 연동) */
  i18n: { enabled: boolean };
  /** 결제·저장 메타(마이페이지·워터마크 등과 연동 예정) */
  billing: { isPaid: boolean; savedAt?: string };
  sectionEnabled: Record<string, boolean>;
}

/** 구버전(card에 `contact` 없음)만 share 값으로 채웁니다. 이후에는 각각 독립적으로 편집됩니다. */
export function ensureContactBlock(data: CardData): CardData {
  const c = data.contact;
  if (c != null && typeof c === 'object') {
    const hasUse = typeof c.useThumbnail === 'boolean';
    const hasThumb = typeof c.thumbnail === 'string';
    if (hasUse && hasThumb) return data;
  }
  const partial = c && typeof c === 'object' ? c : null;
  return {
    ...data,
    contact: {
      useThumbnail:
        partial && typeof partial.useThumbnail === 'boolean'
          ? partial.useThumbnail
          : (data.share?.useThumbnail ?? true),
      thumbnail:
        partial && typeof partial.thumbnail === 'string'
          ? partial.thumbnail
          : (data.share?.thumbnail ?? ''),
    },
  };
}

// --- 3. 스토어 인터페이스 ---
interface CardStore {
  data: CardData;
  // 기존 하위 호환 및 1뎁스 업데이트용
  updateStyle: (style: Partial<StyleConfig>) => void;
  updateTheme: (theme: Partial<CardData['theme']>) => void;
  updateEventInfo: (info: Partial<EventInfo>) => void;
  updateGreeting: (greeting: Partial<{ title: string; content: string }>) => void;
  updateLocation: (location: Partial<CardData['location']>) => void;
  // ★ 깊은 뎁스(부모님 정보, 계좌 등) 업데이트를 위한 만능 함수
  updateData: (path: string, value: any) => void;
  setData: (nextData: CardData) => void;
}

// --- 4. 상태 관리 로직 ---
export const useCardStore = create<CardStore>((set) => ({
  data: {
    style: { primaryColor: '#882CDF', bgColor: '#FFFFFF', fontFamily: 'Pretendard', borderRadius: '8px' },
    music: { selectedId: 'classic-1', uploadedFile: null, isLoop: true },
    theme: { fontFamily: 'Pretendard', fontScale: 'md', colorPreset: 'spring-blossom', bgm: 'none', bgmAutoplay: false, scrollEffect: true, particleEffect: 'none' },
    main: {
      image: '',
      images: [],
      title: '김햇님 ♥ 김별님 결혼식',
      titleColor: '#333333',
      bodyColor: '#666666',
      animation: '없음',
      introType: 'A',
      imageMode: 'default',
      presetImage: DEFAULT_MAIN_PRESET_URL,
      transitionEffect: '없음',
      transitionIntervalSec: 3,
      imageFrame: 'full',
      blackAndWhite: false,
    },
    hosts: {
      groom: { 
        name: '김햇님', phone: '010-0000-0000', relation: '장남',
        father: { name: '', phone: '', isDeceased: false, isOn: true },
        mother: { name: '', phone: '', isDeceased: false, isOn: true }
      },
      bride: { 
        name: '김별님', phone: '010-1111-1111', relation: '장녀',
        father: { name: '', phone: '', isDeceased: false, isOn: true },
        mother: { name: '', phone: '', isDeceased: false, isOn: true }
      },
      showContacts: false,
    },
    eventInfo: {
      date: '2026-11-21',
      time: '오후 2:30',
      venueName: '라움아트센터',
      venueDetail: '5층 라움홀',
      showDday: true,
      calendarDisplayType: 'A',
      calendarUseThemeColor: false,
    },
    greeting: { title: '초대합니다', content: '서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어가고자 합니다.' },
    intro: {
      sectionHeading: '저희를 소개합니다',
      layoutType: 'A',
      groom: {
        image: '',
        birthDate: '1995.04.21',
        mbti: 'ENFP',
        hobbies: '',
        traits: '웃음이 많고 다정한 사람입니다.',
      },
      bride: {
        image: '',
        birthDate: '1996.07.15',
        mbti: 'ISFJ',
        hobbies: '',
        traits: '따뜻한 마음으로 주변을 밝히는 사람입니다.',
      },
    },
    notice: {
      title: '안내사항',
      content: '마음 편히 오셔서 함께 축복해 주세요.\n예식장 내 주차가 가능하며, 식전 30분 전부터 입장이 가능합니다.',
      sectionHeading: '안내사항',
    },
    location: {
      title: '오시는 길',
      address: '',
      car: '',
      bus: '',
      subway: '',
      transports: [],
      mapProvider: 'naver',
      mapType: 'photo',
    },
    accounts: {
      title: '마음 전하실 곳',
      content: '',
      displayMode: 'accordion',
      list: [
        {
          id: 'groom-1',
          groupName: '신랑측 계좌',
          bank: '',
          accountNumber: '',
          holder: '',
          isKakaoPay: false,
          isExpanded: true,
        },
        {
          id: 'bride-1',
          groupName: '신부측 계좌',
          bank: '',
          accountNumber: '',
          holder: '',
          isKakaoPay: false,
          isExpanded: true,
        },
      ],
    },
    gallery: { isOn: true, type: 'swipe', images: [], imageGap: 'middle', useLoadMore: true },
    guestbook: {
      isOn: false,
      title: '축하해 주세요',
      description: '축하 인사를 남겨주세요.',
      password: '',
      allowAnonymous: true,
      requireApproval: false,
      entries: [],
    },
    youtube: { isOn: false, title: '영상으로 전하는 마음', url: '', isLoop: false, sourceType: 'url', fileUrl: '' },
    guestUpload: {
      isOn: true,
      title: '추억을 공유해 주세요',
      description: '예식 후 촬영하신 사진/영상을 업로드해 주세요.',
      storageGb: 2,
      showAfterEventModal: true,
    },
    share: {
      useThumbnail: true,
      thumbnail: '',
      title: '김햇님 ♥ 김별님 결혼식',
      description: '서로가 마주보며 다져온 사랑을 이제 함께 한 곳을 바라보며 걸어가고자 합니다.',
      link: '',
      enableCopy: true,
      enableKakao: true,
    },
    contact: {
      useThumbnail: true,
      thumbnail: '',
    },
    protect: { preventCapture: false, preventZoom: false, preventDownload: false },
    rsvp: {
      title: '참석 여부',
      description: '참석 여부를 알려주시면 준비에 큰 도움이 됩니다.',
      collectGuestCount: true,
      deadline: '',
    },
    publish: {
      publicStartDate: '',
    },
    i18n: {
      enabled: false,
    },
    billing: {
      isPaid: false,
    },
    sectionEnabled: {},
  },

  updateStyle: (newStyle) => set((state) => ({ data: { ...state.data, style: { ...state.data.style, ...newStyle } } })),
  updateTheme: (newTheme) => set((state) => ({ data: { ...state.data, theme: { ...state.data.theme, ...newTheme } } })),
  updateEventInfo: (newInfo) => set((state) => ({ data: { ...state.data, eventInfo: { ...state.data.eventInfo, ...newInfo } } })),
  updateGreeting: (newGreeting) => set((state) => ({ data: { ...state.data, greeting: { ...state.data.greeting, ...newGreeting } } })),
  updateLocation: (newLocation) => set((state) => ({ data: { ...state.data, location: { ...state.data.location, ...newLocation } } })),
  setData: (nextData) => set(() => ({ data: ensureContactBlock(nextData) })),
  
  // 문자열 경로를 받아 중첩된 객체를 안전하게 업데이트하는 로직
  updateData: (path, value) => set((state) => {
    const keys = path.split('.');
    const newData = { ...state.data };
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }; // 불변성 유지
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    return { data: newData };
  }),
}));