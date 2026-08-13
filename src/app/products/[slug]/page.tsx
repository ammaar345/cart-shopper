import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getCategory, productsByCategory } from "@/lib/catalog";
import { ProductDetail } from "./ProductDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found — Cart Shopper" };
  return {
    title: `${product.name} — Cart Shopper`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.categoryId);
  const related = productsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return <ProductDetail product={product} categoryName={category?.name ?? ""} related={related} />;
}
