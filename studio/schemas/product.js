import { defineType, defineField } from 'sanity';
import { FlavourTagInput, SizeTagInput } from '../components/flavour-tag-input';

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
      name: 'hidden', title: 'Hide from the shop', type: 'boolean', initialValue: false,
      description: 'Takes the product off the storefront and stops it being ordered, without deleting it. Use this to retire a listing you may want back.'
    }),
    defineField({
      name: 'bestseller', title: 'Bestseller', type: 'boolean', initialValue: false,
      description: 'Featured in the "Popular Right Now" section on the homepage, with a Bestseller badge on the card.'
    }),
    defineField({
      name: 'images', title: 'Photos', type: 'array',
      of: [{
        type: 'image', options: { hotspot: true },
        fields: [{
          name: 'flavours', title: 'Flavours this photo represents', type: 'array',
          of: [{ type: 'string' }],
          components: { input: FlavourTagInput },
          description: 'The gallery jumps to this photo when one of the ticked flavours is picked. Tick several if the photo suits more than one. Leave empty for a photo that suits every flavour (e.g. the bottle shot).'
        }, {
          name: 'sizes', title: 'Sizes this photo shows', type: 'array',
          of: [{ type: 'string' }],
          components: { input: SizeTagInput },
          description: 'The gallery jumps to this photo when one of the ticked sizes is picked. Use it for packaging shots, e.g. the Nostalgic Tin.'
        }],
        preview: {
          select: { media: 'asset', flavours: 'flavours', sizes: 'sizes' },
          prepare({ media, flavours, sizes }) {
            const tags = [...(flavours || []), ...(sizes || [])];
            return { media, title: tags.join(', ') || 'Any option' };
          }
        }
      }],
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
      name: 'flavours', title: 'Flavours', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Flavour', type: 'string', validation: r => r.required() },
          { name: 'group', title: 'Series', type: 'string',
            description: 'Optional. Group flavours into series (e.g. Milk Teas, Refreshing Sodas) and the product page asks for the series first, then the flavours within it. Leave blank on products with a short, flat flavour list.' },
          { name: 'priceDelta', title: 'Extra charge ($)', type: 'number', initialValue: 0,
            description: 'Added to the size price when this flavour is chosen. Leave at 0 for the standard flavours.' },
          { name: 'soldOut', title: 'Sold out', type: 'boolean', initialValue: false,
            description: 'Keeps the flavour on the menu but stops it being ordered.' }
        ],
        preview: {
          select: { title: 'label', group: 'group', delta: 'priceDelta', soldOut: 'soldOut' },
          prepare({ title, group, delta, soldOut }) {
            const bits = [];
            if (group) bits.push(group);
            if (delta) bits.push(`+$${Number(delta).toFixed(2)}`);
            if (soldOut) bits.push('sold out');
            return { title, subtitle: bits.join(' · ') };
          }
        }
      }],
      description: 'One listing can carry many flavours (e.g. all the milk teas). The customer picks one on the product page. Leave empty for products with a single flavour, or for products that take their flavours from other listings (below).'
    }),
    defineField({
      name: 'flavourSources', title: 'Or take flavours from these listings', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Pick the series this product offers (e.g. Milk Teas, Refreshing Sodas) and their flavours are pulled in automatically, grouped under each series name. Add a flavour to one of those listings and it appears here too, so the list is never kept in two places. Only used when Flavours above is empty; drag to set the order the series appear in.'
    }),
    defineField({
      name: 'optionGroups', title: 'Option groups', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Question', type: 'string', validation: r => r.required(),
            description: 'Shown above the choices, e.g. "Choose your 2 items" or "Add an extra touch".' },
          { name: 'min', title: 'Must choose at least', type: 'number', initialValue: 0,
            description: '0 = optional. Set both min and max to 2 for "pick exactly 2".' },
          { name: 'max', title: 'Can choose at most', type: 'number', initialValue: 0,
            description: '0 = no limit.' },
          {
            name: 'options', title: 'Choices', type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'label', title: 'Choice', type: 'string', validation: r => r.required() },
                { name: 'priceDelta', title: 'Extra charge ($)', type: 'number', initialValue: 0 },
                { name: 'soldOut', title: 'Sold out', type: 'boolean', initialValue: false }
              ],
              preview: {
                select: { title: 'label', delta: 'priceDelta', soldOut: 'soldOut' },
                prepare({ title, delta, soldOut }) {
                  const bits = [];
                  if (delta) bits.push(`+$${Number(delta).toFixed(2)}`);
                  if (soldOut) bits.push('sold out');
                  return { title, subtitle: bits.join(' · ') };
                }
              }
            }]
          }
        ],
        preview: {
          select: { title: 'label', min: 'min', max: 'max', options: 'options' },
          prepare({ title, min, max, options }) {
            const n = (options || []).length;
            const rule = min && min === max ? `pick exactly ${min}`
              : min ? `pick ${min}+` : (max ? `up to ${max}` : 'optional');
            return { title, subtitle: `${n} choices · ${rule}` };
          }
        }
      }],
      description: 'Extra questions on the product page, each with its own list of choices. Use for gift-bag contents, add-ons and upgrades. Charges are added to the size price.'
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
