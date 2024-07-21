import { AssetGoalAnnualDataType } from "@/components/features/asset-goal/asset-goal";
import { parseAmountStringToFloat } from "@/lib/currency";

interface Options {
  isDividendGoal: boolean; // 배당금 목표 여부
  currentAssets: string;
  annualSavings: string;
  targetAmount: string;
  investmentReturn: string;
  dividendYield: string;
  inflation: number;
  isApplyInflation:boolean
}

const YEARS_REACH_MAX = 100;

/**
 * isApplyInflation은 목표 자산과 년간 저축금액(annualSavings)를 infation을 적용하여 증가
 * @param param0 
 * @returns 
 */
export function calculateAnnualAssetsHistory({
  isDividendGoal, currentAssets, annualSavings, targetAmount, investmentReturn, dividendYield, inflation, isApplyInflation
}: Options): {
  years: number | null;
  annualData: AssetGoalAnnualDataType[];
  actualTargetAmount: number | null;
  annualDividend: number | null;
} {
  const current = parseAmountStringToFloat(currentAssets);
  const savings = parseAmountStringToFloat(annualSavings);
  const target = parseAmountStringToFloat(targetAmount);
  const returnRate = parseAmountStringToFloat(investmentReturn) / 100;
  const dividendRate = parseAmountStringToFloat(dividendYield) / 100;

  if (isNaN(current) || isNaN(savings) || isNaN(target) || isNaN(returnRate) || isNaN(dividendRate)) {
    return { years: null, annualData: [], actualTargetAmount: null, annualDividend: null };
  }

  let totalAssets = current;
  let yearsToReach = 0;
  let capital = current;
  let accInvestmentGain = 0;
  const annualData = [];
  let inflationAdjustedTarget = isDividendGoal ? target / dividendRate : target;
  let inflationAdjustedSavings = savings;
  
  while (totalAssets < inflationAdjustedTarget && yearsToReach <= 100) {
    capital += inflationAdjustedSavings;

    const investmentGain = totalAssets * returnRate;
    const baseAssets = totalAssets;
    totalAssets += investmentGain + inflationAdjustedSavings;
    accInvestmentGain += investmentGain;

    annualData.push({
      year: yearsToReach + 1,
      totalAssets: Math.round(totalAssets),
      investmentGain: Math.round(investmentGain),
      accInvestmentGain: Math.round(accInvestmentGain),
      capital: Math.round(capital),
      baseAssets: Math.round(baseAssets),
      targetAmount: Math.round(inflationAdjustedTarget),
      savings: Math.round(inflationAdjustedSavings)
    });

    inflationAdjustedTarget *= 1 + (isApplyInflation ? inflation : 0);
    inflationAdjustedSavings *= 1 + (isApplyInflation ? inflation : 0);
    yearsToReach++;
  }

  if (yearsToReach <= YEARS_REACH_MAX) {
    return {
      years: yearsToReach,
      actualTargetAmount: Math.round(totalAssets),
      annualDividend: Math.round(totalAssets * dividendRate),
      annualData: annualData,
    };
  } else {
    return {
      years: yearsToReach,
      actualTargetAmount: Math.round(totalAssets),
      annualDividend: Math.round(totalAssets * dividendRate),
      annualData: annualData,
    };
  }
}
