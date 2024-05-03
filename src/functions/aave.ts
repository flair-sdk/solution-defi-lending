// Docs: https://docs.aave.com/developers/v/2.0/guides/apy-and-apr
function formatAPYValues(reserveData) {
  const RAY = 10 ** 27; // 10 to the power 27
  const SECONDS_PER_YEAR = 31536000;

  // Convert rates from RAY to normal
  const depositAPR = reserveData.liquidityRate / RAY;
  const variableBorrowAPR = reserveData.variableBorrowRate / RAY;
  const stableBorrowAPR = reserveData.stableBorrowRate / RAY;

  const depositAPY =
    (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  const variableBorrowAPY =
    (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  const stableBorrowAPY =
    (1 + stableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;

  const formatAPY = (apy) => (apy * 100).toFixed(2) + "%";

  return {
    depositAPR,
    variableBorrowAPR,
    stableBorrowAPR,
    depositAPY: formatAPY(depositAPY),
    variableBorrowAPY: formatAPY(variableBorrowAPY),
    stableBorrowAPY: formatAPY(stableBorrowAPY),
  };
}

export async function calculateAaveAPYValues(liquidityRate: string, variableBorrowRate: string, stableBorrowRate: string) {
  const reserveData = {
    liquidityRate,
    variableBorrowRate,
    stableBorrowRate,
  }
  return formatAPYValues(reserveData);
}
