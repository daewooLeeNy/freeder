import { calculateAnnualAssetsHistory } from "./asset-goals";
describe("asset-goals", () => {
  const testBaseOptions = {
      isDividendGoal: false,
      currentAssets: "100,000",
      annualSavings: "20,000",
      targetAmount: "1,000,000",
      investmentReturn: "10",
      dividendYield: "5",
      inflation: 0.03,
      isApplyInflation: true
    }

  it("calculateAnnualAssetsHistory(): 자본 10만원과 매년 2만원을 연10프로의 수익율로 투자했을때 100만원(자본금의 10배, 매해 3프로 인플레이션 적용)를 만족하기 위해 몇년이 걸리는지 확인", () => {
    const results = calculateAnnualAssetsHistory({
      ...testBaseOptions
    });

    const { annualData, ...remainAttrs} = results || {};
    expect(remainAttrs).toStrictEqual({
      "actualTargetAmount": 1857992,
      "annualDividend": 92900,
      "years": 19,
    });
    
    // 1년차에서는 inflation이 적용 되지 않고
    expect(annualData?.[0]).toStrictEqual({
      accInvestmentGain: 10000,
      baseAssets: 100000,
      capital: 120000,
      investmentGain: 10000,
      savings: 20000,
      targetAmount: 1000000,
      totalAssets: 130000,
      year: 1,
    });

    // 2년차에서는 totalAssets와 saving에 inflation이 적용. (saving=inflation만큼 더 저축 되어야 한다는 의미)
      expect(annualData?.[1]).toStrictEqual({
      accInvestmentGain: 23000,
      baseAssets: 130000,
      capital: 140600,
      investmentGain: 13000,
      savings: 20600,
      targetAmount: 1030000,
      totalAssets: 163600,
      year: 2,
    });



    expect(annualData?.[annualData.length - 1]).toStrictEqual({
      accInvestmentGain: 1255654,
      baseAssets: 1658130,
      capital: 602337,
      investmentGain: 165813,
      savings: 34049,
      targetAmount: 1702433,
      totalAssets: 1857992,
      year: 19,
    });
  });

    it("calculateAnnualAssetsHistory(): 자본 10만원과 매년 2만원을 연10프로의 수익율로 투자했을때 100만원(자본금의 10배, 인플레이션 미적용)를 만족하기 위해 몇년이 걸리는지 확인", () => {
    const results = calculateAnnualAssetsHistory({
      ...testBaseOptions,
      isApplyInflation: false
    });

    const { annualData, ...remainAttrs} = results || {};
    expect(remainAttrs).toStrictEqual({
      "actualTargetAmount": 1053174,
      "annualDividend": 52659,
      "years": 15,
    });

    expect(annualData?.[annualData.length - 1]).toStrictEqual({
      accInvestmentGain: 653174,
      baseAssets: 939250,
      capital: 400000,
      investmentGain: 93925,
      savings: 20000,
      targetAmount: 1000000,
      totalAssets: 1053174,
      year: 15,
    });
  });
});
