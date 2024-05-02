import { EventHandlerInput } from "flair-sdk";
import { Customizations } from '../../lib/customizations.js';
import { calculateAPYValues } from "../../functions/aave.js";

export const processEvent = async (event: EventHandlerInput) => {
  const { variableBorrowAPY } = await calculateAPYValues(
    event.parsed?.args?.liquidityRate, 
    event.parsed?.args?.variableBorrowRate,
    event.parsed?.args?.stableBorrowRate,
  );
  console.debug(`Aave Borrow APY: ${variableBorrowAPY}-${event.parsed?.args?.reserve}`);
  if (Customizations?.onBorrowAPY) {
    return await Customizations?.onBorrowAPY(event.parsed?.args?.reserve, 'aave', variableBorrowAPY);
  }

  return true;
};
