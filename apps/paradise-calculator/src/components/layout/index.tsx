import { KakaoAdfit, KakaoAdfitMobileHorizontalMiniContent, KakaoAdfitPcVerticalContent } from '@/components/ads/adfit';
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
            <KakaoAdfitPcVerticalContent position={'left'} adUnit='DAN-THFZcqVwN5SWL6CC'/>
          </div>
          <main className="flex-1 p-4 max-w-screen-lg flex flex-col items-center w-full">
            <KakaoAdfitMobileHorizontalMiniContent adUnit="DAN-pL8lSXeq6mD6flLp" className="block xs:hidden w-full h-[50px]"/>
            <KakaoAdfitMobileHorizontalMiniContent adUnit="DAN-FCxO4Un26IBrAeb9" className="hidden xs:block lg:hidden w-full h-[90px]"/>
            {children}
          </main>
          <div className="hidden md:block min-w-[160px]">
            <KakaoAdfitPcVerticalContent position={'right'} adUnit='DAN-WOH2SPtRZfgNWUKE'/>
          </div>
        </div>
      </GoalAssetProvider>

      <KakaoAdfit />
    </div>
  )
}
