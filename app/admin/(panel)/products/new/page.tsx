import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { createProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!isDatabaseConfigured()) {
    return (
      <>
        <PageHeader title="New product" />
        <ConnectNotice />
      </>
    );
  }

  const db = getSupabaseAdmin()!;
  const { data } = await db
    .from("categories")
    .select("slug, name")
    .order("sort_order", { ascending: true });

  return (
    <>
      <PageHeader title="New product" description="Add a piece to the shop." />
      <ProductForm
        action={createProduct}
        categories={data ?? []}
        submitLabel="Create product"
      />
    </>
  );
}
