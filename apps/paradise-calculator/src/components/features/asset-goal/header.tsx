'use client';

import Image from 'next/image';
import SettingDialog from '@/components/features/asset-goal/setting-dialog';
import { GoalAssetAttr, useAssetGoalAttributes } from '@/components/features/asset-goal/goal-assets-context';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';


const Header = () => {
  const pathname = usePathname();
  const assetAttr = useAssetGoalAttributes()

  const onChangeOptions = ({inflation, isApplyInflation, isDividendGoal}:Pick<GoalAssetAttr, 'inflation' | 'isApplyInflation' | 'isDividendGoal'>) => {
    assetAttr.setAssetAttributes({inflation, isDividendGoal, isApplyInflation})
  }

  return (
    <main className="sticky top-0 z-50 w-full p-4 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between w-full max-w-screen-lg mx-auto"> 
        <div className="flex items-center gap-8">
          <div className="flex gap-2">
            <Image src="/logo.png" width="30" height="30" alt="freeder logo"/>
            <h1 className="text-black text-xl font-bold">Freeder</h1>
          </div>

          <nav>
            <Link href="/goal-assets" className={cn('text-gray-600', pathname === '/goal-assets' ? 'font-semibold' : '')}>자산 목표</Link>
          </nav>
        </div>
        <SettingDialog inflation={assetAttr.inflation} isApplyInflation={assetAttr.isApplyInflation} isDividendGoal={assetAttr.isDividendGoal} onChange={onChangeOptions} className="xs:hidden"/>
      </div>
    </main>
  )
}
export default Header;