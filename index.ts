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
        // Initialize the filterGroups array if it's undefined
        manifest.filterGroups = manifest.filterGroups || [];

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

        console.debug('...(filterGroup.addresses', ...(filterGroup.addresses));
  

        // Update the addresses array of the found filter group
        filterGroup.addresses = [
          ...(filterGroup.addresses || []),
          {
            fromFile: `${PACKAGE_NAME}/src/processors/borrow-apy-change-tracker/contracts.csv`,
          },
        ];

        console.debug('filterGroup', filterGroup);
      }

      console.debug('MANIFEST', manifest.filterGroups);

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
