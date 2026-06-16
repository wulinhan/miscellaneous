import { defineCliConfig } from 'sanity/cli';

// projectId is filled in during setup (npx sanity init) or paste it here.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: 'production'
  }
});
