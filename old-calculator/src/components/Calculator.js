import numeral from 'numeral';

const convertToNumber = ({asset, yearSavingAmount, interest, periodOfRetire, inflation}) => {
  let _asset = numeral(asset || 0)
    .multiply(10000)
    .value();
  let _yearSavingAmount = numeral(yearSavingAmount || 0)
    .multiply(10000)
    .value();

  let _interest = numeral(interest || 0).divide(100).value();
  let _periodOfRetire = numeral(periodOfRetire || 0).value();
  let _inflation = numeral(inflation || 0).divide(100).value();

  return {
    asset: _asset,
    yearSavingAmount: _yearSavingAmount,
    interest: _interest,
    periodOfRetire: _periodOfRetire,
    inflation: _inflation
  };
}

// {asset, yearSavingAmount, interest, periodOfRetire, inflation}
/**
 * 
 * @param {*} inputs 
 * @param asset 만원단위
 * @param yearSavingAmount  만원단위
 * @param interest 정수 eg. 10% -> 10
 * @param periodOfRetire 년
 * @param inflation 정수 eg. 10% -> 10
 * @returns Number
 */
const calculateTotalAssetStringInput = (inputs) => {
  const numeralInput = convertToNumber(inputs);
  const totalAssetInfo = calculateTotalAsset(numeralInput);
  return { ...totalAssetInfo, ...numeralInput };
};

const calculateTotalAsset = ({asset, yearSavingAmount, interest, periodOfRetire, inflation}) => {
  const calAsset = calculateAsset({asset, interest, periodOfRetire, inflation});
  const calYearSavingAmount = calculateGrowthYearSavingAmount({yearSavingAmount, interest, periodOfRetire, inflation});

  const totalAsset = calAsset + calYearSavingAmount;
  return {totalAsset, calAsset, calYearSavingAmount, asset, yearSavingAmount, interest, periodOfRetire, inflation};
};

/**
 * 
 * @param {*} param0 
 * @param asset Number 원단위
 * @param interest Number
 * @param periodOfRetire Number
 * @returns 
 */
const calculateAsset = ({asset, interest, periodOfRetire}) => {
  let calAsset = asset * Math.pow(1 + interest, periodOfRetire);
  return calAsset;
}

/**
 * 정기식 투자의 현재가치
 * @param {*} param0 
 * @param yearSavingAmount Number 원단위
 * @param interest Number 0.10
 * @param periodOfRetire Number 
 * @param inflation Number 0.10
 * @returns 
 */
const calculateGrowthYearSavingAmount = ({yearSavingAmount, interest, periodOfRetire, inflation}) => {
  let actualInterest = ((interest - inflation));
  let actualInterstPow =
    Math.pow(1 + interest, periodOfRetire) -
    Math.pow(1 + inflation, periodOfRetire);

  const calYearSavingAmount =
    (yearSavingAmount * actualInterstPow) / (actualInterest || 1);

  return calYearSavingAmount;
};

const calculateTotalAssetInPeriod = ({asset, yearSavingAmount, interest, periodOfRetire, inflation}) => {
  const totalAssetsInPeriod = [];
  for(let _periodOfRetire = 1;  _periodOfRetire <= periodOfRetire; _periodOfRetire++ ) {
    const totalAsset = calculateTotalAsset({asset, yearSavingAmount, interest, periodOfRetire: _periodOfRetire, inflation})
    totalAssetsInPeriod.push(totalAsset);
  }

  return totalAssetsInPeriod;
}

export { convertToNumber, calculateTotalAssetInPeriod, calculateTotalAssetStringInput, calculateTotalAsset, calculateAsset, calculateGrowthYearSavingAmount};