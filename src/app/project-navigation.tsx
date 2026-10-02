"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const projectLinks = [
  { href: "/instruments/", label: "Instrument Cabinet" },
  { href: "/decision-collider/", label: "Decision Collider" },
  { href: "/meeting-filter/", label: "Meeting Filter" },
  { href: "/ai-y-fier/", label: "AI-Y-fier" },
  { href: "/radar/", label: "Radar" },
  { href: "/museum/", label: "Museum" },
  { href: "/ambassadors/", label: "Network" },
  { href: "/inside-ctrl-love/", label: "Inside" },
  { href: "/pricing/", label: "Pricing" },
  { href: "mailto:hello@ctrlpluslove.com", label: "Admission" },
];

export function ProjectNavigation() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/savannah-test" ||
    pathname === "/savannah-test/" ||
    pathname === "/instruments" ||
    pathname === "/instruments/" ||
    pathname === "/room" ||
    pathname === "/room/" ||
    pathname === "/decision-collider" ||
    pathname === "/decision-collider/" ||
    pathname === "/meeting-filter" ||
    pathname === "/meeting-filter/" ||
    pathname === "/stress-test" ||
    pathname === "/stress-test/" ||
    pathname === "/ai-y-fier" ||
    pathname === "/ai-y-fier/" ||
    pathname === "/prompt-shoppe" ||
    pathname === "/prompt-shoppe/" ||
    pathname === "/radar" ||
    pathname === "/radar/" ||
    pathname === "/decision-memory" ||
    pathname === "/decision-memory/" ||
    pathname === "/inside-ctrl-love" ||
    pathname === "/inside-ctrl-love/" ||
    pathname === "/artifacts" ||
    pathname === "/artifacts/" ||
    pathname === "/living-decision-review" ||
    pathname === "/living-decision-review/" ||
    pathname === "/ambassadors" ||
    pathname === "/ambassadors/" ||
    pathname === "/swat" ||
    pathname === "/swat/" ||
    pathname.startsWith("/swat/") ||
    pathname === "/five-guys-signal" ||
    pathname === "/five-guys-signal/" ||
    pathname === "/fizz" ||
    pathname === "/fizz/"
  ) {
    return null;
  }

  return (
    <nav className="project-navigation" aria-label="Project navigation">
      <Link className="project-navigation__brand" href="/">ctrl+love</Link>
      <div>
        {projectLinks.map((link) =>
          link.href.startsWith("mailto:") ? (
            <a href={link.href} key={link.href}>{link.label}</a>
          ) : (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ),
        )}
      </div>
    </nav>
  );
}
