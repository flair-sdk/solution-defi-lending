import { calculateAaveValues } from "../../utils.js";
import { Customizations } from '../../../lib/customizations.js'

export async function handleInput({ data }) {
  if (!data) {
    throw new Error(
      `Skipping processing item for aave-notifications, missing assetAddress : ${JSON.stringify(
        { data }
      )}`
    );
  }

  const aaveValues = await calculateAaveValues(
    data.assetAddress,
    data.chainId
  );

  if (Customizations?.onBorrowAPY) {
    await Customizations.onBorrowAPY(data?.address, aaveValues?.variableBorrowAPY)
  }

  return true;
}
