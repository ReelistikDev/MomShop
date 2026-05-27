import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact-form";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
} from "@/components/icons";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${BRAND.name} — questions, custom requests, and gifting help.`,
};

const FAQS = [
  {
    q: "Is the shop open?",
    a: "Yes — we're open! Browse the shop and order anytime. Join the list to hear about new pieces and restocks.",
  },
  {
    q: "How long does an order take?",
    a: "Most in-stock orders ship within 3–5 business days. Custom and made-to-order pieces take a little longer — we'll always confirm timing.",
  },
  {
    q: "Do you take returns?",
    a: "We accept returns on unused, non-custom items within 14 days. Reach out and we'll make it easy.",
  },
  {
    q: "Can I request a custom piece?",
    a: "Absolutely — a custom color, a personalized gift, or your own idea. Start on the Custom page or send a note here.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-linen/60">
        <Container className="py-14 text-center lg:py-20">
          <span className="eyebrow">Contact</span>
          <h1 className="text-h1 mt-3 text-balance">We&apos;d love to hear from you</h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone">
            Questions about a piece, a custom request, or help with a gift —
            send a note and we&apos;ll get back to you soon.
          </p>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:py-20">
        {/* Form */}
        <div>
          <h2 className="text-h3 mb-6">Send a message</h2>
          <ContactForm />
        </div>

        {/* Info + FAQ */}
        <aside className="flex flex-col gap-10">
          <div>
            <h2 className="text-h3 mb-4">Reach us directly</h2>
            <ul className="space-y-2 text-stone">
              <li>
                <a href={`mailto:${BRAND.email}`} className="hover:text-ink">
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`}
                  className="hover:text-ink"
                >
                  {BRAND.phone}
                </a>
              </li>
              <li>{BRAND.location}</li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              {[
                { Icon: InstagramIcon, href: BRAND.socials.instagram, label: "Instagram" },
                { Icon: PinterestIcon, href: BRAND.socials.pinterest, label: "Pinterest" },
                { Icon: FacebookIcon, href: BRAND.socials.facebook, label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full border border-line-strong p-2.5 text-stone transition-colors hover:border-oak hover:text-ink"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-h3 mb-4">Good to know</h2>
            <dl className="space-y-5">
              {FAQS.map((faq) => (
                <div key={faq.q} className="border-t border-line pt-4">
                  <dt className="font-medium text-ink">{faq.q}</dt>
                  <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-stone">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </Container>
    </>
  );
}
