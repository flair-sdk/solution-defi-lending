import {
  EnricherEngine,
  SolutionDefinition,
  SolutionScriptFunction,
} from 'flair-sdk'

const PACKAGE_NAME = '@flair-sdk/solution-defi-lending'

export type Config = {
  aave?: {
    intervalEnricher: {
      enabled?: boolean
      interval?: string
    }
  }
  customizations?: string
  env?: Record<string, string>
}

const definition: SolutionDefinition<Config> = {
  prepareManifest: async (context, config, manifest) => {
    const commonEnvVars = [
      ...(config.env
        ? Object.entries(config.env).map(([name, value]) => ({ name, value }))
        : []),
    ]

    if (config?.customizations) {
      const compiledPath = context.addEntrypoint(config.customizations)
      commonEnvVars.push({
        name: 'CUSTOMIZATIONS_FILE_PATH',
        value: compiledPath,
      })
    }

    if (config?.aave?.intervalEnricher?.enabled) {
      manifest.enrichers = [
        ...(manifest.enrichers || []),
        {
          id: 'aave-interval-enricher',
          engine: EnricherEngine.Rockset,
          env: [...commonEnvVars],
          // inputSql: `${PACKAGE_NAME}/src/aave/enrichers/interval-enricher/input.sql`,
          handler: `${PACKAGE_NAME}/src/aave/enrichers/interval-enricher/handler.ts`,
        },
      ];
      manifest.workers = [
        ...(manifest.workers || []),
        {
          id: 'aave-interval-worker',
          schedule: config.aave.intervalEnricher.interval || 'rate(1 day)',
          enabled: true,
          enricher: 'aave-interval-enricher',
        },
      ];
    }
    return manifest
  },
  registerScripts: (
    _,
  ): Record<string, SolutionScriptFunction> => {
    return {}
  },
}

export default definition
