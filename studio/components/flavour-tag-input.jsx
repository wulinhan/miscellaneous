// Dropdown used on each gallery photo to tag it with one of the product's own
// flavours. Reading the flavour list off the document (rather than a free-text
// field) keeps the tag and the option list from drifting apart — a photo can
// only ever point at a flavour that actually exists on the product.
import React, { useCallback, useMemo } from 'react';
import { set, unset, useFormValue } from 'sanity';
import { Select, Stack, Text } from '@sanity/ui';

export function FlavourTagInput(props) {
  const { value, onChange, elementProps } = props;

  // Flavours live at the document root; images are nested, so read from there.
  const flavours = useFormValue(['flavours']) || [];
  const labels = useMemo(
    () => flavours.map((f) => f && f.label).filter(Boolean),
    [flavours],
  );

  const handleChange = useCallback(
    (event) => {
      const next = event.currentTarget.value;
      onChange(next ? set(next) : unset());
    },
    [onChange],
  );

  if (!labels.length) {
    return (
      <Text size={1} muted>
        Add flavours to this product first, then you can tag each photo.
      </Text>
    );
  }

  // A tag left over from a renamed/deleted flavour still needs to be shown so
  // the editor can see and correct it, rather than silently reading as "none".
  const orphaned = value && !labels.includes(value);

  return (
    <Stack space={2}>
      <Select {...elementProps} value={value || ''} onChange={handleChange}>
        <option value="">— No flavour (shown for all) —</option>
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
        {orphaned && <option value={value}>{value} (no longer a flavour)</option>}
      </Select>
      {orphaned && (
        <Text size={1} style={{ color: 'var(--card-badge-critical-fg-color)' }}>
          “{value}” is not one of this product’s flavours. Pick another, or clear it.
        </Text>
      )}
    </Stack>
  );
}
