interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

interface KakaoLink {
  sendDefault(options: KakaoShareOptions): void;
}

interface KakaoInstance {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: KakaoLink;
}

interface Window {
  Kakao?: KakaoInstance;
}
