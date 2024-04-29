import { calculateAaveValues } from "../../utils.js";

export async function handleInput() {
  const markets = [
    { chainId: 1, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }
  ];

  for (const market of markets) {
    return await calculateAaveValues(market?.address, market?.chainId)
  };

  return true;
}
