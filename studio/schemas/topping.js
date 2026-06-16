import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'topping',
  title: 'Topping / add-on',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'ID', type: 'slug', options: { source: 'title' },
      validation: r => r.required(), description: 'Auto-filled from the name. Used internally.'
    }),
    defineField({ name: 'price', title: 'Extra price ($)', type: 'number', validation: r => r.min(0) })
  ],
  preview: { select: { title: 'title', subtitle: 'price' } }
});
