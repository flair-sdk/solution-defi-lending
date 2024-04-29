import { blockchain, ethers } from "flair-sdk";

// Docs: https://docs.aave.com/developers/v/2.0/guides/apy-and-apr
function getAaveValues(reserveData) {
  const RAY = 10 ** 27; // 10 to the power 27
  const SECONDS_PER_YEAR = 31536000;

  // Convert rates from RAY to normal
  const depositAPR = reserveData.currentLiquidityRate / RAY;
  const variableBorrowAPR = reserveData.currentVariableBorrowRate / RAY;
  const stableBorrowAPR = reserveData.currentStableBorrowRate / RAY;

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

export async function calculateAaveValues(assetAddress, chainId) {
  const provider = await blockchain.getProvider(chainId);

  const lendingPoolContract = new ethers.Contract(
    "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    [
      "function getReserveData(address) view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint40)",
    ],
    provider
  );

  // assetAddress is the ERC20 supplied or borrowed, eg. DAI, WETH
  const [
    ,
    liquidityIndex,
    variableBorrowIndex,
    currentLiquidityRate,
    currentVariableBorrowRate,
    currentStableBorrowRate,
    ,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress,
    ,
  ] = await lendingPoolContract.getReserveData(assetAddress);

  const reserveData = {
    liquidityIndex,
    variableBorrowIndex,
    currentLiquidityRate,
    currentVariableBorrowRate,
    currentStableBorrowRate,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress
  };

  return getAaveValues(reserveData);
}
