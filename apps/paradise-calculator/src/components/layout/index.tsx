import { KakaoAdfitMobileHorizontalMiniContent, KakaoAdfitPcVerticalContent } from '@/components/ads/adfit';
import {  GoalAssetProvider } from '@/components/features/asset-goal/goal-assets-context';
import Header from '@/components/features/header';

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GoalAssetProvider>
        <Header/>
        <div className="flex justify-center">
          <div className="hidden md:block min-w-[160px] text-right">
            <KakaoAdfitPcVerticalContent position={'left'} adUnit='DAN-vFXFSQacv72TiY1J'/>
          </div>
          <main className="flex-1 p-4 max-w-screen-lg flex flex-col items-center">
            <KakaoAdfitMobileHorizontalMiniContent adUnit="DAN-ZDHmNytrx0HyaM0f" className="block xs:hidden w-full h-[50px]"/>
            <KakaoAdfitMobileHorizontalMiniContent adUnit="DAN-RSBMwEUEBExgy8AQ" className="hidden xs:block lg:hidden w-full h-[90px]"/>
            {children}
          </main>
          <div className="hidden md:block min-w-[160px]">
            <KakaoAdfitPcVerticalContent position={'right'} adUnit='DAN-6rsUT4xbGLJCP6m0'/>
          </div>
        </div>
      </GoalAssetProvider>
    </div>
  )
}
