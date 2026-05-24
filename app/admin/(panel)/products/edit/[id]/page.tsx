import { notFound } from "next/navigation";
import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { updateProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="Edit product" />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const [{ data: product }, { data: categories }] = await Promise.all([
    db.from("products").select("*").eq("id", id).single(),
    db.from("categories").select("slug, name").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  return (
    <>
      <PageHeader title="Edit product" description={product.name} />
      <ProductForm
        action={updateProduct}
        categories={categories ?? []}
        product={product}
        submitLabel="Save changes"
      />
    </>
  );
}
