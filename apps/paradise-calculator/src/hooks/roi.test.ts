import { calculateRequiredROI, simpleInterestBenefit } from "./roi";


describe('roi', () => {
  it('requiredROI', () => {
    // 사용 예시
    const currentAssets = 10000000; // 현재 자산 (원)
    const annualSavings = 5000000; // 연간 저축액 (원)
    const targetAssets = 100000000; // 목표 자산 (원)
    const years = 10; // 목표 기간 (년)

    const requiredROI = calculateRequiredROI(currentAssets, annualSavings, targetAssets, years);

    expect(requiredROI).toBe(0.09062576293945312)
  }), 

  it('단리 계산', () => {
    const asset = 1000000;
    const rate = 0.1
    const period = 12; // months

    expect(simpleInterestBenefit(asset, period, rate)).toBe(650000)
  })
})
