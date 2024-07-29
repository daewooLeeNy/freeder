import {  GoalAssetProvider } from '@/components/features/asset-goal/goal-assets-context';
import Header from '@/components/features/header';

export default function GoalAssetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GoalAssetProvider>
        <Header/>
        <main className="p-4 max-w-screen-lg mx-auto">
          {children}
        </main>
      </GoalAssetProvider>
    </div>
  )
}
