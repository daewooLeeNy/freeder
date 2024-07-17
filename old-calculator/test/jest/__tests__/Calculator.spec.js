import { calculateTotalAssetStringInput, calculateTotalAsset, calculateTotalAssetInPeriod } from '../../../src/components/Calculator';

describe('calculrate', () => {
    it('totalAsset:simple', () => {
        const {totalAsset} = calculateTotalAssetStringInput({
            asset: '10,000', yearSavingAmount: '0', interest: '10', periodOfRetire: '10', inflation: '2'
        });

        expect(totalAsset).toBe(259374246.01000023);
    });

    it('totalAsset:same interest and inflation', () => {
        const {totalAsset} = calculateTotalAssetStringInput({
            asset: '10,000', yearSavingAmount: '0', interest: '10', periodOfRetire: '10', inflation: '10'
        });

        expect(totalAsset).toBe(259374246.01000023);
    });

    it('totalAsset:numeric input', () => {
        const {totalAsset, calAsset, calYearSavingAmount} = calculateTotalAsset({asset: 100000000, yearSavingAmount: 5000000, interest: 0.10, periodOfRetire: 10, inflation: 0.02});
        expect(totalAsset).toBe(345295998.5165781);
        expect(calAsset).toBe(259374246.01000023);
        expect(calYearSavingAmount).toBe(85921752.50657782);
    });

    it('totalAssets: calculrate totalAssets in period', () => {
        const totalAssets = calculateTotalAssetInPeriod({
            asset: 100000000, yearSavingAmount: 5000000, interest: 0.10, periodOfRetire: 10, inflation: 0.02
        });
        
        expect(totalAssets).toHaveLength(10);
        expect(totalAssets[9].totalAsset).toBe(345295998.5165781);
        expect(totalAssets[9].calAsset).toBe(259374246.01000023);
        expect(totalAssets[9].calYearSavingAmount).toBe(85921752.50657782);
    });
});