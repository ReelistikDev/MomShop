import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Container } from "@/components/ui/container";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
} from "@/components/icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All earrings", href: "/shop" },
      { label: "Wood", href: "/shop?material=wood" },
      { label: "Leather", href: "/shop?material=leather" },
      { label: "Mixed", href: "/shop?material=mixed" },
    ],
  },
  {
    title: "The studio",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Custom orders", href: "/custom" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping & returns", href: "/contact" },
      { label: "Earring care", href: "/about" },
      { label: "Custom requests", href: "/custom" },
      { label: `Email us`, href: `mailto:${BRAND.email}` },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line bg-linen text-ink">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              <span className="font-serif text-2xl">{BRAND.name}</span>
            </div>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-stone">
              {BRAND.description} Each piece is made by hand in small batches and
              packed to be gifted.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: InstagramIcon, href: BRAND.socials.instagram, label: "Instagram" },
                { Icon: PinterestIcon, href: BRAND.socials.pinterest, label: "Pinterest" },
                { Icon: FacebookIcon, href: BRAND.socials.facebook, label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full border border-line-strong bg-cream/60 p-2.5 text-stone transition-colors hover:border-oak hover:text-ink"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-mist">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-stone transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-line-strong/60">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-[0.82rem] text-mist sm:flex-row">
          <p>
            © {year} {BRAND.name}. {BRAND.location}.
          </p>
          <p className="flex items-center gap-1.5">
            Made with care <span className="text-sage">·</span> Handmade to order
          </p>
        </Container>
      </div>
    </footer>
  );
}
