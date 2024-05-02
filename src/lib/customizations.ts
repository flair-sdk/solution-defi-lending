import { AppError } from 'flair-sdk';

export type DefiLendingCustomizations = {
  onBorrowAPY?: (asset: string, protocol: string, borrowAPY: string) => Promise<void>;
};

function loadCustomizations(): DefiLendingCustomizations | null {
  if (process.env.CUSTOMIZATIONS_FILE_PATH) {
    try {
      const customizations = require(process.env.CUSTOMIZATIONS_FILE_PATH);
      return customizations.default || customizations;
    } catch (err: any) {
      throw AppError.causedBy(err, {
        code: 'DefiLendingCustomizations',
        message: 'Failed to load customizations script for DefiLendingCustomizations.',
        details: {
          path: process.env.CUSTOMIZATIONS_FILE_PATH,
        },
      });
    }
  }
  return null;
}

const _customizations: DefiLendingCustomizations | null = loadCustomizations();

export const Customizations: DefiLendingCustomizations = {
  ...(_customizations || {}),
};