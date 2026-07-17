import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'order', title: 'Display order', type: 'number',
      description: 'Lower numbers show first in the category bar.'
    }),
    defineField({
      name: 'isOccasion', title: 'Occasion', type: 'boolean', initialValue: false,
      description: 'Occasions (e.g. Christmas, Deepavali, Hari Raya) appear under "Shop by occasion" instead of the product-type bar.'
    }),
    defineField({
      name: 'hidden', title: 'Hidden', type: 'boolean', initialValue: false,
      description: 'Hide this category AND its products from the store. Products also in a visible category stay visible there.'
    })
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', order: 'order', hidden: 'hidden', isOccasion: 'isOccasion' },
    prepare({ title, order, hidden, isOccasion }) {
      const flags = [isOccasion && 'occasion', hidden && 'HIDDEN'].filter(Boolean).join(' · ');
      return { title, subtitle: [order, flags].filter(v => v || v === 0).join(' — ') };
    }
  }
});
