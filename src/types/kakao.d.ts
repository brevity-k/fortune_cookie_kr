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

interface KakaoTextOptions {
  objectType: 'text';
  text: string;
  link: KakaoShareLink;
  buttons?: Array<{
    title: string;
    link: KakaoShareLink;
  }>;
}

type KakaoShareOptions = KakaoFeedOptions | KakaoTextOptions;

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
