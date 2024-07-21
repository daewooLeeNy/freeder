export interface AssetGoalAnnualDataType {
  year: number;
  baseAssets: number; // 기초자산
  totalAssets: number; // 기말자산
  investmentGain: number; // 당해 수익
  accInvestmentGain: number; // 누적 수익
  capital: number; // 총 자본
  targetAmount: number; // 목표자산
  savings: number; // 당해 저축액
}
