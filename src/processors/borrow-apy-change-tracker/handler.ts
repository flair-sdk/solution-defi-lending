import { EventHandlerInput } from "flair-sdk";
import { Customizations } from '../../lib/customizations.js';
import { calculateAaveAPYValues } from "../../functions/aave.js";

export const processEvent = async (event: EventHandlerInput) => {

  // AAVE V3
  const isAaveV3Event =
    event.parsed?.args?.variableBorrowRate &&
    event.parsed?.args?.stableBorrowRate;

  if (isAaveV3Event) {
    const { variableBorrowAPY } = await calculateAaveAPYValues(
      event.parsed?.args?.liquidityRate, 
      event.parsed?.args?.variableBorrowRate,
      event.parsed?.args?.stableBorrowRate,
    );

    if (Customizations?.onBorrowAPY) {
      await Customizations?.onBorrowAPY(event.parsed?.args?.reserve, 'aave-v3', variableBorrowAPY);
    }
  }

  return true;
};
