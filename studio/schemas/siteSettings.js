import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  // A single settings document for the whole store.
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string' }),
    defineField({ name: 'heroTitle', title: 'Hero heading', type: 'text', rows: 2,
      description: 'Shown on the home banner. Use a line break for two lines.' }),
    defineField({ name: 'heroSubtitle', title: 'Hero subtext', type: 'text', rows: 3 }),
    defineField({ name: 'deliveryFee', title: 'Islandwide delivery fee ($)', type: 'number' }),
    defineField({ name: 'freeDeliveryThreshold', title: 'Free delivery over ($)', type: 'number' }),
    defineField({ name: 'pickupEnabled', title: 'Offer free self pick-up', type: 'boolean', initialValue: true }),
    defineField({ name: 'leadBusinessDays', title: 'Earliest order lead (business days)', type: 'number', initialValue: 3 }),
    defineField({
      name: 'timeSlots', title: 'Delivery / pick-up time slots', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'value', title: 'Internal value', type: 'string' },
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'sub', title: 'Time range', type: 'string' }
      ], preview: { select: { title: 'label', subtitle: 'sub' } } }]
    })
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) }
});
