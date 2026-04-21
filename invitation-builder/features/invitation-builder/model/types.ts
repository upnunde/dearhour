export interface StyleConfig {
  primaryColor: string;
  bgColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface Parent {
  name: string;
  phone: string;
  isDeceased: boolean;
  isOn: boolean;
}

export interface Profile {
  name: string;
  phone: string;
  relation: string;
  father: Parent;
  mother: Parent;
}

export interface EventInfo {
  date: string;
  time: string;
  venueName: string;
  venueDetail: string;
  showDday: boolean;
  calendarDisplayType?: "A" | "B" | "C";
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
  image: string;
  birthDate: string;
  mbti: string;
  hobbies: string;
  traits: string;
}

export interface MusicConfig {
  selectedId: string;
  uploadedFile: { name: string; url: string } | null;
  isLoop: boolean;
}

/** 인사말 다중 블록(빌더·런타임 확장 필드) */
export interface GreetingEntry {
  title?: string;
  content?: string;
}

/** 안내사항 다중 섹션 */
export interface NoticeSection {
  id?: string;
  title?: string;
  content?: string;
}

export interface CardData {
  style: StyleConfig;
  music: MusicConfig;
  theme: {
    fontFamily: string;
    fontScale: "md" | "lg";
    colorPreset: string;
    bgm: string;
    bgmAutoplay: boolean;
    scrollEffect: boolean;
    particleEffect: string;
  };
  main: {
    image: string;
    images?: string[];
    title: string;
    titleColor: string;
    bodyColor: string;
    animation: string;
    introType?: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
    imageMode?: "single" | "multi" | "default";
    presetImage?: string;
    transitionEffect?: string;
    transitionIntervalSec?: number;
    imageFrame?: "full" | "border" | "oval" | "ellipse" | "arch";
    blackAndWhite?: boolean;
  };
  hosts: { groom: Profile; bride: Profile; showContacts: boolean };
  eventInfo: EventInfo;
  greeting: {
    title: string;
    content: string;
    entries?: GreetingEntry[];
    useImage?: boolean;
    thumbnail?: string;
  };
  intro: {
    sectionHeading: string;
    layoutType?: "A" | "B" | "C" | "D";
    groom: IntroProfile;
    bride: IntroProfile;
  };
  notice: { title: string; content: string; sectionHeading?: string; sections?: NoticeSection[] };
  location: {
    title?: string;
    address: string;
    car: string;
    bus: string;
    subway: string;
    transports?: Array<{
      mode: string;
      detail: string;
    }>;
    mapProvider: "kakao" | "naver";
    mapType?: "photo" | "2d";
  };
  accounts: {
    title: string;
    content: string;
    displayMode?: "accordion" | "expanded";
    list: AccountItem[];
  };
  gallery: {
    isOn: boolean;
    type: "swipe" | "list";
    images: string[];
    imageGap?: "none" | "small" | "middle" | "large";
    useLoadMore?: boolean;
    layoutType?: "grid" | "slide";
    gridColumns?: number;
    autoSlide?: boolean;
    autoSlideIntervalSec?: number;
    imageRatio?: "portrait" | "square";
    enableDetailView?: boolean;
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
    showCreatedAt?: boolean;
    displayCount?: number;
  };
  youtube: {
    isOn: boolean;
    title: string;
    url: string;
    isLoop: boolean;
    sourceType?: "file" | "url";
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
  contact: {
    useThumbnail: boolean;
    thumbnail: string;
  };
  protect: { preventCapture: boolean; preventZoom: boolean; preventDownload: boolean };
  rsvp: {
    title: string;
    description: string;
    collectGuestCount: boolean;
    deadline: string;
  };
  publish: { publicStartDate: string };
  i18n: { brideFirstInfo: boolean };
  billing: { isPaid: boolean; savedAt?: string };
  sectionEnabled: Record<string, boolean>;
}

export function ensureContactBlock(data: CardData): CardData {
  const contact = data.contact;
  if (contact != null && typeof contact === "object") {
    const hasUse = typeof contact.useThumbnail === "boolean";
    const hasThumb = typeof contact.thumbnail === "string";
    if (hasUse && hasThumb) return data;
  }

  const partial = contact && typeof contact === "object" ? contact : null;
  return {
    ...data,
    contact: {
      useThumbnail:
        partial && typeof partial.useThumbnail === "boolean"
          ? partial.useThumbnail
          : (data.share?.useThumbnail ?? true),
      thumbnail:
        partial && typeof partial.thumbnail === "string"
          ? partial.thumbnail
          : (data.share?.thumbnail ?? ""),
    },
  };
}
