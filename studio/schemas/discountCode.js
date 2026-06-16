import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'discountCode',
  title: 'Discount code',
  type: 'document',
  fields: [
    defineField({ name: 'code', title: 'Code', type: 'string', validation: r => r.required(),
      description: 'What the customer types at checkout (e.g. BOBA10). Case-insensitive.' }),
    defineField({
      name: 'type', title: 'Type', type: 'string', validation: r => r.required(),
      options: { list: [
        { title: 'Percent off', value: 'percent' },
        { title: 'Fixed amount off ($)', value: 'fixed' },
        { title: 'Free delivery', value: 'shipping' }
      ], layout: 'radio' }
    }),
    defineField({ name: 'value', title: 'Value', type: 'number',
      description: 'Percent (e.g. 10) or dollar amount (e.g. 5). Leave 0 for free delivery.' }),
    defineField({ name: 'label', title: 'Message shown when applied', type: 'string' })
  ],
  preview: { select: { title: 'code', subtitle: 'label' } }
});
