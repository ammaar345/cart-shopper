import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getCategory, productsByCategory } from "@/lib/catalog";
import { productImageUrl } from "@/lib/images";
import { ProductDetail } from "./ProductDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found", robots: { index: false } };
  return {
    title: product.name,
    description: `${product.tagline} — ${product.description}`.slice(0, 300),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      url: `/products/${product.slug}`,
      images: [{ url: productImageUrl(product), width: 800, height: 800 }],
    },
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
