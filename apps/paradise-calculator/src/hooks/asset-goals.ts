interface Options {
  isDividendGoal: boolean; // 배당금 목표 여부
  currentAssets: string;
  annualSavings: string;
  targetAmount: string;
  investmentReturn: string;
  dividendYield: string;
  inflation: number;
}

interface AnnualData {
  year: number;
  totalAssets: number;
  investmentGain: number;
  accInvestmentGain: number;
  baseAssets: number;
  targetAmount: number;
}

const YEARS_REACH_MAX = 100;

export const calculateYearsAndGraph = ({
  isDividendGoal,
  currentAssets,
  annualSavings,
  targetAmount,
  investmentReturn,
  dividendYield,
  inflation,
}: Options):
  | {
      years: string | number | null;
      annualData: AnnualData[];
      actualTargetAmount: string | number | null;
      annualDividend: string | number | null;
    }
  | undefined => {
  const current = parseFloat(currentAssets);
  const savings = parseFloat(annualSavings);
  const target = parseFloat(targetAmount);
  const returnRate = parseFloat(investmentReturn) / 100;
  const dividendRate = parseFloat(dividendYield) / 100;

  if (isNaN(current) || isNaN(savings) || isNaN(target) || isNaN(returnRate) || isNaN(dividendRate)) {
    return { years: null, annualData: [], actualTargetAmount: null, annualDividend: null };
  }

  let totalAssets = current;
  let yearsToReach = 0;
  let captal = current;
  let accInvestmentGain = 0;
  const annualData = [];
  let inflationAdjustedTarget = isDividendGoal ? target / dividendRate : target;

  while (totalAssets < inflationAdjustedTarget && yearsToReach <= 100) {
    captal += savings;

    const investmentGain = totalAssets * returnRate;
    totalAssets += investmentGain + savings;
    accInvestmentGain += investmentGain;

    // 인플레이션 적용
    // totalAssets /= 1 + INFLATION_RATE;
    inflationAdjustedTarget *= 1 + inflation;

    annualData.push({
      year: yearsToReach + 1,
      totalAssets: Math.round(totalAssets),
      investmentGain: Math.round(investmentGain),
      accInvestmentGain: Math.round(accInvestmentGain),
      baseAssets: Math.round(captal),
      targetAmount: Math.round(inflationAdjustedTarget),
    });

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
};
