import { notFound } from "next/navigation";
import { PageHeader, ConnectNotice } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { ActionButton } from "@/components/ui/button";
import { getSupabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";
import { isMailConfigured } from "@/lib/mailer";
import { announceProduct, updateProduct } from "../../actions";

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
  const [{ data: product }, { data: categories }, { count }] = await Promise.all([
    db.from("products").select("*").eq("id", id).single(),
    db.from("categories").select("slug, name").order("sort_order", { ascending: true }),
    db
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),
  ]);

  if (!product) notFound();
  const confirmed = count ?? 0;
  const mailOk = isMailConfigured();

  return (
    <>
      <PageHeader title="Edit product" description={product.name} />
      <ProductForm
        action={updateProduct}
        categories={categories ?? []}
        product={product}
        submitLabel="Save changes"
      />

      {/* Announce to subscribers */}
      <div className="mt-12 max-w-2xl border-t border-line pt-8">
        <h2 className="text-h3">Email subscribers</h2>
        <p className="mt-1.5 max-w-md text-stone">
          Send a “new in the shop” email featuring this product to your confirmed
          subscribers. Only do this when you&apos;re ready to release it.
        </p>
        {mailOk ? (
          confirmed > 0 ? (
            <form action={announceProduct} className="mt-4">
              <input type="hidden" name="id" value={product.id} />
              <ActionButton type="submit" variant="sage" size="md">
                Announce to {confirmed} subscriber{confirmed === 1 ? "" : "s"}
              </ActionButton>
            </form>
          ) : (
            <p className="mt-4 text-[0.9rem] text-mist">
              No confirmed subscribers yet.
            </p>
          )
        ) : (
          <p className="mt-4 text-[0.9rem] text-mist">
            Configure email (RESEND_API_KEY) to enable announcements.
          </p>
        )}
      </div>
    </>
  );
}
