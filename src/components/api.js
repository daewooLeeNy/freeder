import axios from "axios";
import numeral from "numeral";

const API_DOMAIN = "https://fibit.kr";
export const saveCalculatedResult = async ({
  userUuid,
  assets = 0,
  yearSavingAmount = 0,
  termsOfRetire,
  interest,
  inflation,
  totalAssets,
  paradiseAmount
}) => {
  const { data } = await axios.request({
    method: "POST",
    url: `${API_DOMAIN}/calculated`,
    data: {
      user_uuid: userUuid,
      assets: numeral(assets)
        .multiply(10000)
        .value(),
      saving: numeral(yearSavingAmount)
        .multiply(10000)
        .value(),
      retirement: parseInt(termsOfRetire),
      earning_rate: parseFloat(interest),
      inflation: parseFloat(inflation),
      calculated_assets: parseInt(totalAssets),
      target_assets: parseInt(paradiseAmount)
    }
  });

  return data;
};

export const updateTargetAsset = async ({
  userUuid,
  resultId,
  paradiseAmount
}) => {
  axios.request({
    method: "POST",
    url: `${API_DOMAIN}/calculated/update-target`,
    data: {
      user_uuid: userUuid,
      id: resultId,
      target_assets: parseInt(paradiseAmount)
    }
  });
};
