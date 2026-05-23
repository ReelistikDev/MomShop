import type { SVGProps } from "react";

/** Thin, rounded line icons — currentColor, 1.6 stroke. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const BagIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M6 8h12l-.8 11.2a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8L6 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Icon>
);

export const MenuIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

export const ArrowRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 13l4 4 10-11" />
  </Icon>
);

export const LeafIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 19c0-7 5-12 14-12 0 9-5 14-12 14-1.2 0-2 0-2-2Z" />
    <path d="M9 15c2-3 4-4.5 7-5.5" />
  </Icon>
);

export const FeatherIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M19 5a5.5 5.5 0 0 0-7.8 0l-6 6V19h7l6-6A5.5 5.5 0 0 0 19 5Z" />
    <path d="M5 19 13 11M15 8l1 1" />
  </Icon>
);

export const GiftIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 11h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16v3H4zM12 8v12" />
    <path d="M12 8S10.5 4 8.5 4 6 6.5 8 8M12 8s1.5-4 3.5-4S18 6.5 16 8" />
  </Icon>
);

export const HandIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0 0V5a1.5 1.5 0 0 1 3 0v6m0 0V6.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6 7s-6-2.4-6-6v-2.5a1.5 1.5 0 0 1 3 0V11" />
  </Icon>
);

export const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.4" />
    <circle cx="16.4" cy="7.6" r="0.6" fill="currentColor" />
  </Icon>
);

export const PinterestIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5c-2 0-3.3 1.3-3.3 3 0 1 .5 1.7 1 1.7.3 0 .4-.7.4-1 0-1 .8-2.2 2-2.2 1 0 1.7.7 1.7 1.8 0 1.5-.7 3-1.7 3-.5 0-.9-.4-.8-1l.4-1.6c.1-.5-.1-.9-.6-.9-.6 0-1 .6-1 1.4 0 .5.2.9.2.9l-.9 3.6c-.2.8 0 1.8 0 1.9 0 .1.1.1.2 0 .1-.1.8-1 1-1.7l.4-1.4c.2.4.9.8 1.6.8 2 0 3.5-1.9 3.5-4.3 0-2-1.7-3.7-4.2-3.7Z" />
  </Icon>
);

export const FacebookIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M14.5 8.5H16V5.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.5 1.3-3.5 3.7v2H8v2.8h2.3V21h2.9v-6.8h2.3l.4-2.8h-2.7V9.7c0-.8.2-1.2 1.3-1.2Z" />
  </Icon>
);
