// Tick-lists used on each gallery photo to say which options it shows — the
// flavours it depicts, and the sizes/packaging it depicts. Reading the options
// off the document (rather than free text) keeps the tags and the option lists
// from drifting apart: a photo can only ever point at an option that exists on
// the product. One photo can cover several options, so a new flavour can borrow
// a photo that already looks right instead of showing the generic bottle.
import React, { useCallback, useMemo } from 'react';
import { set, unset, useFormValue } from 'sanity';
import { Box, Card, Checkbox, Flex, Stack, Text } from '@sanity/ui';

function OptionTagInput({ value, onChange, fieldPath, noun, emptyHint }) {
  const selected = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  // Options live at the document root; images are nested, so read from there.
  const options = useFormValue([fieldPath]) || [];
  const labels = useMemo(
    () => options.map((o) => o && o.label).filter(Boolean),
    [options],
  );

  const toggle = useCallback(
    (label) => {
      const next = selected.includes(label)
        ? selected.filter((x) => x !== label)
        : [...selected, label];
      onChange(next.length ? set(next) : unset());
    },
    [onChange, selected],
  );

  if (!labels.length) {
    return (
      <Text size={1} muted>
        Add {noun} to this product first, then you can tag each photo.
      </Text>
    );
  }

  // Tags left over from a renamed or deleted option still need to be visible so
  // the editor can clear them, rather than silently doing nothing.
  const orphaned = selected.filter((s) => !labels.includes(s));

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} border>
        <Stack space={3}>
          {labels.map((label) => (
            <Flex key={label} align="center" gap={3}>
              <Checkbox
                id={`${fieldPath}-${label}`}
                checked={selected.includes(label)}
                onChange={() => toggle(label)}
              />
              <Box flex={1}>
                <Text size={1} as="label" htmlFor={`${fieldPath}-${label}`}>
                  {label}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Card>
      {orphaned.length > 0 && (
        <Text size={1} style={{ color: 'var(--card-badge-critical-fg-color)' }}>
          No longer {noun} of this product: {orphaned.join(', ')}. Untick to clear.
        </Text>
      )}
      {!selected.length && <Text size={1} muted>{emptyHint}</Text>}
    </Stack>
  );
}

export function FlavourTagInput(props) {
  return (
    <OptionTagInput
      {...props}
      fieldPath="flavours"
      noun="flavours"
      emptyHint="Untagged: shown for any flavour that has no photo of its own."
    />
  );
}

export function SizeTagInput(props) {
  return (
    <OptionTagInput
      {...props}
      fieldPath="sizes"
      noun="sizes"
      emptyHint="Untagged: not tied to a particular size or pack."
    />
  );
}
