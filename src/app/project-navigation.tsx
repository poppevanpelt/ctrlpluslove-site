"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const projectLinks = [
  { href: "/radar/", label: "Radar" },
  { href: "/#the-room", label: "The Room" },
  { href: "/room-runner/", label: "Live Room" },
  { href: "/#shared-office", label: "Shared Office" },
  { href: "/#personas", label: "Personas" },
  { href: "/#products", label: "Products" },
  { href: "/museum/", label: "Museum Store" },
  { href: "/steel-ball/", label: "Steel Ball" },
  { href: "/#cases", label: "Cases" },
  { href: "/#network", label: "Network" },
  { href: "/embassies/", label: "Embassies" },
  { href: "/#founder", label: "Founder" },
  { href: "/constitution/", label: "The Constitution" },
  { href: "mailto:hello@ctrlpluslove.com", label: "Admission" },
];

export function ProjectNavigation() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/decision-collider") {
    return null;
  }

  return (
    <nav className="project-navigation" aria-label="Project navigation">
      <Link className="project-navigation__brand" href="/">
        ctrl+love
      </Link>
      <div>
        {projectLinks.map((link) =>
          link.href.startsWith("mailto:") ? (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ) : (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
