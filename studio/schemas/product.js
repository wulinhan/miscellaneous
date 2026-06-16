import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'ID', type: 'slug', options: { source: 'title' },
      validation: r => r.required(), description: 'Auto-filled from the name. Used in the page link.'
    }),
    defineField({ name: 'order', title: 'Display order', type: 'number',
      description: 'Lower numbers show first in the listing.' }),
    defineField({
      name: 'images', title: 'Photos', type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'First photo is used on the card. Add more for the gallery.'
    }),
    defineField({ name: 'shortDesc', title: 'Short description (card)', type: 'text', rows: 2 }),
    defineField({ name: 'longDesc', title: 'Full description (product page)', type: 'text', rows: 4 }),
    defineField({ name: 'unit', title: 'Unit (e.g. cup, box, pack)', type: 'string' }),
    defineField({
      name: 'sizes', title: 'Sizes & prices', type: 'array',
      validation: r => r.required().min(1),
      of: [{ type: 'object', fields: [
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'price', title: 'Price ($)', type: 'number' }
      ], preview: { select: { title: 'label', subtitle: 'price' } } }],
      description: 'Add one size for fixed-price items, or several (e.g. Regular / Large).'
    }),
    defineField({
      name: 'categories', title: 'Categories', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'A product can appear in more than one category.'
    }),
    defineField({
      name: 'primaryCategory', title: 'Primary category', type: 'reference',
      to: [{ type: 'category' }],
      description: 'The main category shown on the card/breadcrumb.'
    }),
    defineField({
      name: 'toppings', title: 'Toppings / add-ons', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topping' }] }]
    }),
    defineField({
      name: 'allergens', title: 'Allergens', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy'] }
    }),
    defineField({
      name: 'alsoBought', title: 'Customers also bought', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }]
    })
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'shortDesc', media: 'images.0' } }
});
