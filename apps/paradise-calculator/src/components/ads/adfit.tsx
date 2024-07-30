'use client';

import { cn } from "@/lib/utils";
import Script from "next/script";
import React from "react";

function KakaoAdfitBase() {
  // 최초 1회만 광고를 불러오기 위한 변수
  const adRef = React.useRef<boolean>(false);
  React.useEffect(() => {
    // 로딩된 광고가 있으면, 추가 로딩 X
    if (adRef.current) {
      return;
    }

    const script = document.createElement('script');
    // 윈도우 사이즈에 따라 광고 사이즈 조정(사이즈마다 해당 광고 단위 ID 적용)

    script.async = true;
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

    document.querySelector('.aside__kakaoAdFit')?.appendChild(script);
    
    // 광고 로딩 여부 상태 변경
    adRef.current = true;
  }, []);
  return (
    <div className="aside__kakaoAdFit"></div>
  );
}
const KakaoAdfit = React.memo(KakaoAdfitBase)
export { KakaoAdfit };

const KakaoAdfitScript: React.FC = () => {
  return (
    <Script
      async
      src={`https://t1.daumcdn.net/kas/static/ba.min.js`}
      strategy="afterInteractive"
      referrerPolicy="origin-when-cross-origin"
    />
  );
};

const KakaoAdfitPcVerticalContent:React.FC<{position:'left' | 'right', adUnit:string}> = ({position = 'left', adUnit}) => {
  return (
    <div className={cn("hidden md:block md:sticky md:top-20", position === 'left' ? 'md:left-1' : 'md:right-1' )}>
      <ins className="kakao_ad_area"
          data-ad-unit={adUnit}
          data-ad-width="160"
          data-ad-height="600"></ins>
    </div>
  )
}


const KakaoAdfitMobileHorizontalMiniContent:React.FC<{className?:string, adUnit:string}> = ({className, adUnit}) => {
  return (
    <div className={className}>
      <ins className="kakao_ad_area"
          data-ad-unit={adUnit}
          data-ad-width="320"
          data-ad-height="50"></ins>
    </div>
  )
}

// DAN-ZDHmNytrx0HyaM0f
export default KakaoAdfitScript;

export { KakaoAdfitScript, KakaoAdfitPcVerticalContent, KakaoAdfitMobileHorizontalMiniContent }