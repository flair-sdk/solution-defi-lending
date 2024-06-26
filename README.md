# DeFi Lending Indexing

[![Flair](https://img.shields.io/badge/Powered%20by-Flair-ff69b4)](https://flair.dev)

This package provides customizable ready-made processor scripts for defi lending protocols using [Flair indexer](https://docs.flair.dev).

## Installation

1. Make sure you have created your indexing cluster as described in [Getting Started](https://docs.flair.dev/#getting-started).

2. Install the solution package:

```bash
pnpm install @flair-sdk/solution-indexing-nft
```

3. Add the solution to your [manifest.yml.mustache](https://github.com/flair-sdk/starter-boilerplate/blob/main/manifest.yml.mustache) usually created from starter-boilerplate repository:

```yml
# ./manifest.yml.mustache

# ...

# Usually each indexing cluster has defined one or more filter groups.
# For this solution you need a filter group that contains addresses of ERC721 contracts.
# Also, this solution will add relevant event "topics" for ERC721 Transfer and Approval events
# so that they are emitted for processing.
#
# Note: if you have a factory contract, or need to dynamically add addresses it is possible,
# refer to examples repository (https://github.com/flair-sdk/examples).
filterGroups:
  - id: default
    updateStrategy: replace
    addresses:
      - fromFile: ./contracts.csv

# ...
solutions:
  - source: "@flair-sdk/solution-indexing-defi-lending"
    config:
      aave:
        intervalEnricher:
          enabled: true
          interval: rate(60 minutes)
```

4. Deploy your cluster:

```sh
pnpm generate-and-deploy
```
