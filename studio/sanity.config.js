import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { bulkImageUpload } from './plugins/bulk-image-upload';

// Sidebar: a "Products by category" browser first (pick a category, see and
// edit only its products), then the plain document lists.
const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Products by category')
        .child(
          S.documentTypeList('category')
            .title('Pick a category')
            .child((catId) =>
              S.documentList()
                .title('Products')
                .apiVersion('2023-10-01')
                .filter('_type == "product" && ($catId in categories[]._ref || primaryCategory._ref == $catId)')
                .params({ catId }),
            ),
        ),
      S.divider(),
      ...S.documentTypeListItems(),
    ]);

// projectId is set by `npx sanity init` during setup (see SETUP.md).
export default defineConfig({
  name: 'sofnade',
  title: 'Sofnade Store',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'mkxfjwwf',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool(), bulkImageUpload()],
  schema: { types: schemaTypes }
});
