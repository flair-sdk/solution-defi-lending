import { calculateAaveValues } from "../../utils.js";
import { Customizations } from '../../../lib/customizations.js'

export async function handleInput() {
  const markets = [
    { chainId: 1, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' }
  ];

  for (const market of markets) {
    const values = await calculateAaveValues(market?.address, market?.chainId)

    if (Customizations?.onBorrowAPY) {
      await Customizations.onBorrowAPY(market?.address, values?.variableBorrowAPY)
    }
  };

  return true;
}
