// "Bulk Images" Studio tool: upload one or more photos once, tick the products
// they belong to, and Apply appends them to each product's Photos array.
// Registered as a tool (top tab) in sanity.config.js.
import React, { useEffect, useMemo, useState } from 'react';
import { definePlugin, useClient } from 'sanity';
import {
  Box, Button, Card, Checkbox, Flex, Inline, Stack, Text, TextInput, useToast,
} from '@sanity/ui';

const API_VERSION = '2023-10-01';

function key() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function BulkImagesTool() {
  const client = useClient({ apiVersion: API_VERSION });
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [replace, setReplace] = useState(false);

  useEffect(() => {
    client
      .fetch('*[_type == "product"] | order(title asc){ _id, title, "cats": categories[]->title }')
      .then(setProducts)
      .catch((e) => toast.push({ status: 'error', title: 'Could not load products', description: e.message }));
  }, [client, toast]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => (p.title || '').toLowerCase().includes(q) || (p.cats || []).join(' ').toLowerCase().includes(q),
    );
  }, [products, search]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  async function apply() {
    if (!files.length || !selected.size) return;
    setBusy(true);
    try {
      // Upload each image once; reuse the same asset across all ticked products.
      const assets = [];
      for (const f of files) {
        const asset = await client.assets.upload('image', f, { filename: f.name });
        assets.push(asset._id);
      }
      const imageEntries = assets.map((id) => ({
        _type: 'image', _key: key(), asset: { _type: 'reference', _ref: id },
      }));
      let tx = client.transaction();
      for (const pid of selected) {
        let patch = client.patch(pid);
        patch = replace
          ? patch.set({ images: imageEntries.map((e) => ({ ...e, _key: key() })) })
          : patch.setIfMissing({ images: [] }).append('images', imageEntries.map((e) => ({ ...e, _key: key() })));
        tx = tx.patch(patch);
      }
      await tx.commit();
      toast.push({
        status: 'success', title: 'Photos applied',
        description: `${assets.length} image${assets.length > 1 ? 's' : ''} → ${selected.size} product${selected.size > 1 ? 's' : ''}`,
      });
      setFiles([]);
      setSelected(new Set());
    } catch (e) {
      toast.push({ status: 'error', title: 'Upload failed', description: e.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box padding={4} style={{ maxWidth: 760, margin: '0 auto' }}>
      <Stack space={4}>
        <Text size={3} weight="bold">Bulk image upload</Text>
        <Text size={1} muted>
          Pick one or more photos, tick every product they apply to, then Apply.
          Photos are appended to each product&apos;s existing gallery (or replace it, if ticked).
        </Text>

        <Card padding={3} radius={2} border>
          <Stack space={3}>
            <input
              type="file" accept="image/*" multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            {files.length > 0 && (
              <Text size={1} muted>{files.map((f) => f.name).join(', ')}</Text>
            )}
            <Flex align="center" gap={2}>
              <Checkbox checked={replace} onChange={() => setReplace((v) => !v)} />
              <Text size={1}>Replace existing photos instead of appending</Text>
            </Flex>
          </Stack>
        </Card>

        <TextInput
          placeholder="Search products or categories…"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Card padding={2} radius={2} border style={{ maxHeight: 420, overflow: 'auto' }}>
          <Stack space={1}>
            {shown.map((p) => (
              <Card key={p._id} padding={2} radius={2} tone={selected.has(p._id) ? 'primary' : 'transparent'}>
                <Flex align="center" gap={3} onClick={() => toggle(p._id)} style={{ cursor: 'pointer' }}>
                  <Checkbox checked={selected.has(p._id)} onChange={() => toggle(p._id)} />
                  <Text size={1}>{p.title}</Text>
                  <Text size={0} muted>{(p.cats || []).join(', ')}</Text>
                </Flex>
              </Card>
            ))}
            {!shown.length && <Box padding={3}><Text size={1} muted>No products match.</Text></Box>}
          </Stack>
        </Card>

        <Inline space={3}>
          <Button
            text={busy ? 'Applying…' : `Apply ${files.length || ''} photo${files.length === 1 ? '' : 's'} to ${selected.size} product${selected.size === 1 ? '' : 's'}`}
            tone="primary"
            disabled={busy || !files.length || !selected.size}
            onClick={apply}
          />
          <Button text="Clear selection" mode="ghost" disabled={busy || !selected.size} onClick={() => setSelected(new Set())} />
        </Inline>
      </Stack>
    </Box>
  );
}

function BulkImagesIcon() {
  return <span aria-hidden>🖼️</span>;
}

export const bulkImageUpload = definePlugin({
  name: 'bulk-image-upload',
  tools: [
    { name: 'bulk-images', title: 'Bulk Images', icon: BulkImagesIcon, component: BulkImagesTool },
  ],
});
