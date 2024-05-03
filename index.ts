import {
  ProcessorType,
  SolutionDefinition,
  SolutionScriptFunction,
} from "flair-sdk";

export type * from "./src/index.js";

const PACKAGE_NAME = "@flair-sdk/solution-indexing-defi-lending";

export type Config = {
  borrowAPYChangeTracker?: {
    enabled: boolean;
  };
  addAddressesToFilterGroup?: string;
  customizations?: string;
  env?: Record<string, string>;
};

const definition: SolutionDefinition<Config> = {
  prepareManifest: async (context, config, manifest) => {
    const commonEnvVars = [
      ...(config.env
        ? Object.entries(config.env).map(([name, value]) => ({ name, value }))
        : []),
    ];

    if (config?.customizations) {
      const compiledPath = context.addEntrypoint(config.customizations);
      commonEnvVars.push({
        name: "CUSTOMIZATIONS_FILE_PATH",
        value: compiledPath,
      });
    }

    if (config?.borrowAPYChangeTracker?.enabled) {
      if (config?.addAddressesToFilterGroup) {
        // Find the filter group by ID
        let filterGroup = manifest.filterGroups.find(
          (group) => group.id === config.addAddressesToFilterGroup
        );

        // Throw an error if the filter group doesn't exist
        if (!filterGroup) {
          throw new Error(
            `Filter group "${config.addAddressesToFilterGroup}" not found, defined in solution-indexing-defi-lending config.addAddressesToFilterGroup`
          );
        }

        // Update the addresses array of the found filter group
        filterGroup.addresses = [
          ...(filterGroup.addresses || []),
          {
            chainId: 1,
            address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
          },
          {
            chainId: 10,
            address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
          },
          {
            chainId: 42161,
            address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
          },
          {
            chainId: 137,
            address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
          },
          {
            chainId: 250,
            address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
          },
          {
            chainId: 43114,
            address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
          },
          {
            chainId: 1666600000,
            address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
          },
          {
            chainId: 1088,
            address: "0x90df02551bB792286e8D4f13E0e357b4Bf1D6a57",
          },
          {
            chainId: 8453,
            address: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
          },
          {
            chainId: 100,
            address: "0xb50201558B00496A145fE76f7424749556E326D8",
          },
          {
            chainId: 56,
            address: "0x6807dc923806fE8Fd134338EABCA509979a7e0cB",
          },
          {
            chainId: 534352,
            address: "0x11fCfe756c05AD438e312a7fd934381537D3cFfe",
          },
        ];

        manifest.filterGroups = [
          ...manifest.filterGroups.filter(
            (group) => group.id !== config.addAddressesToFilterGroup
          ),
          filterGroup,
        ];
      }

      manifest.processors = [
        ...(manifest.processors || []),
        {
          id: "borrow-apy-change-tracker",
          type: ProcessorType.Event,
          env: [...commonEnvVars],
          handler: `${PACKAGE_NAME}/src/processors/borrow-apy-change-tracker/handler.ts`,
          abi: `${PACKAGE_NAME}/src/abis/borrow-apy-change-tracker/**/*.json`,
        },
      ];
    }

    return manifest;
  },
  registerScripts: (_): Record<string, SolutionScriptFunction> => {
    return {};
  },
};

export default definition;
