export const formatKoreanWon = (value: number | string) => {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(parseInt(String(value)));
};

export const parseAmountStringToFloat = (value: string) => parseFloat(value.replaceAll(/,/g, ""));
