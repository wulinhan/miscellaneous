// Tick-list used on each gallery photo to say which flavours it represents.
// Reading the options off the document (rather than free text) keeps the tags
// and the flavour list from drifting apart — a photo can only ever point at a
// flavour that actually exists on the product. One photo can cover several
// flavours, so a new flavour can borrow a photo that already looks right
// instead of falling back to the generic bottle shot.
import React, { useCallback, useMemo } from 'react';
import { set, unset, useFormValue } from 'sanity';
import { Box, Card, Checkbox, Flex, Stack, Text } from '@sanity/ui';

export function FlavourTagInput(props) {
  const { value, onChange } = props;
  const selected = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  // Flavours live at the document root; images are nested, so read from there.
  const flavours = useFormValue(['flavours']) || [];
  const labels = useMemo(
    () => flavours.map((f) => f && f.label).filter(Boolean),
    [flavours],
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
        Add flavours to this product first, then you can tag each photo.
      </Text>
    );
  }

  // Tags left over from a renamed or deleted flavour still need to be visible
  // so the editor can clear them, rather than silently doing nothing.
  const orphaned = selected.filter((s) => !labels.includes(s));

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} border>
        <Stack space={3}>
          {labels.map((label) => (
            <Flex key={label} align="center" gap={3}>
              <Checkbox
                id={`fl-${label}`}
                checked={selected.includes(label)}
                onChange={() => toggle(label)}
              />
              <Box flex={1}>
                <Text size={1} as="label" htmlFor={`fl-${label}`}>
                  {label}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Card>
      {orphaned.length > 0 && (
        <Text size={1} style={{ color: 'var(--card-badge-critical-fg-color)' }}>
          Not flavours of this product any more: {orphaned.join(', ')}. Untick to clear.
        </Text>
      )}
      {!selected.length && (
        <Text size={1} muted>
          Untagged: shown for any flavour that has no photo of its own.
        </Text>
      )}
    </Stack>
  );
}
