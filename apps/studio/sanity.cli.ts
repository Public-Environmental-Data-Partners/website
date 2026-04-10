import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
  deployment: {
    /** Skips app-id prompt; value from first deploy / manage → Studio. */
    appId: 'bieu7h0rd07uqm4yiaznzetj',
    autoUpdates: true, // https://www.sanity.io/docs/studio/latest-version-of-sanity
  },
})
