import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// projectId is set by `npx sanity init` during setup (see SETUP.md).
export default defineConfig({
  name: 'sofnade',
  title: 'Sofnade Store',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'mkxfjwwf',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
});
