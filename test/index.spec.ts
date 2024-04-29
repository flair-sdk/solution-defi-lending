import { describe, expect, it } from '@jest/globals'

import solutionDefinition from '../index.ts'

describe('solution', () => {
  it('should define prepareManifest', async () => {
    expect(solutionDefinition.prepareManifest).toBeDefined()
  })
})
