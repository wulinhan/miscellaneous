import { notFound } from 'next/navigation';
import { getAddOns, getProduct } from '@/lib/catalog';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const addOns = await getAddOns();
  return <ProductDetail product={product} allAddOns={addOns} />;
}
