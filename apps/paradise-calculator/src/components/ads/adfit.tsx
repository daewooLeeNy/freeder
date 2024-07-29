import { cn } from "@/lib/utils";
import Script from "next/script";

const KakaoAdfitScript: React.FC = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  return (
    <Script
      async
      src={`https:////t1.daumcdn.net/kas/static/ba.min.js`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
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