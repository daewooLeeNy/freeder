
function futureValue(principal:number, annualContribution:number, rate:number, years:number) {
    let fv = principal;
    for (let i = 0; i < years; i++) {
        fv = fv * (1 + rate) + annualContribution;
    }
    return fv;
}


function calculateRequiredROI(currentAssets:number, annualSavings:number, targetAssets:number, years:number) {
    let requiredROI = 0;
    const precision = 0.0001; // 정확도 설정
    
    // 이분 탐색을 사용하여 필요 수익률 계산
    let low = -1; // 최소 수익률 (-100%)
    let high = 10; // 최대 수익률 (1000%)
    
    while (high - low > precision) {
        let mid = (low + high) / 2;
        let calculatedAssets = futureValue(currentAssets, annualSavings, mid, years);
        
        if (calculatedAssets > targetAssets) {
            high = mid;
        } else {
            low = mid;
        }
    }
    
    requiredROI = (low + high) / 2;
    return requiredROI;
}

/**
 * 
 * @param monthIncome 월 적금액
 * @param months 납입 개월수
 * @param yearInterate 0.1 -> 10%
 * @returns 
 */
const simpleInterestBenefit = (monthIncome:number, months:number, yearInterate:number) => {
  return monthIncome * months * (months+1)/2 * yearInterate/12
}

export { calculateRequiredROI, simpleInterestBenefit }
