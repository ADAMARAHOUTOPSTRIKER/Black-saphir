"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import type { ComponentProps, MouseEvent } from "react";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * Drop-in replacement for next/link that routes through the overlay wipe.
 * Keeps Link's prefetching; external links, hashes, modified clicks and
 * same-page clicks fall through to default behavior.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();
  const lenis = useLenis();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (isModified || isExternal) return;

    const [path, hash] = href.split("#");
    // Same-page anchor → smooth scroll, no route transition.
    if (hash !== undefined && (path === "" || path === pathname)) {
      e.preventDefault();
      const target = document.getElementById(hash);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    e.preventDefault();
    if (href === pathname) return;
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
