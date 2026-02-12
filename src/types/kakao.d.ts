interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoFeedOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoShareLink;
  };
  buttons?: Array<{
    title: string;
    link: KakaoShareLink;
  }>;
}

type KakaoShareOptions = KakaoFeedOptions;

interface KakaoLink {
  sendDefault(options: KakaoShareOptions): void;
}

interface KakaoInstance {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: KakaoLink;
}

declare global {
  interface Window {
    Kakao?: KakaoInstance;
  }
}

export {};
