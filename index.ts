import {
  ProcessorType,
  SolutionDefinition,
  SolutionScriptFunction,
} from "flair-sdk";

export type * from './src/index.js';

const PACKAGE_NAME = "@flair-sdk/solution-indexing-defi-lending";

export type Config = {
  borrowAPYChangeTracker?: {
    enabled: boolean;
  };
  assets?: {
    chainId: number;
    address: string;
  }
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
      console.debug(`Customizations file path: ${compiledPath}`);
      commonEnvVars.push({
        name: "CUSTOMIZATIONS_FILE_PATH",
        value: compiledPath,
      });
      console.debug(`Customizations file path: ${compiledPath}`);
    }

    if (config?.borrowAPYChangeTracker?.enabled) {
      manifest.processors = [
        ...(manifest.processors || []),
        {
          id: 'borrow-apy-change-tracker',
          type: ProcessorType.Event,
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
