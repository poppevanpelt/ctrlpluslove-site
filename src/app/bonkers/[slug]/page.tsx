import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../bonkers.module.css";
import { BonkersWorkbench } from "../bonkers-workbench";
import { BONKERS_TOOL_MAP, BONKERS_TOOLS } from "../tools";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BONKERS_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = BONKERS_TOOL_MAP.get(slug);
  if (!tool) return {};
  return {
    title: tool.title + " — Bonkers",
    description: tool.line,
    robots: { index: false, follow: false },
  };
}

export default async function BonkersToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = BONKERS_TOOL_MAP.get(slug);
  if (!tool) notFound();

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link className={styles.brand} href="/bonkers/">
            <span className={styles.brandMark}>B</span>
            <span>BONKERS × ctrl+love</span>
          </Link>
          <span>{tool.index} / FIELD KIT</span>
        </header>

        <section className={styles.toolHero}>
          <div className={styles.toolIndex}>{tool.index}</div>
          <div>
            <p className={styles.kicker}>{tool.kicker}</p>
            <h1>{tool.title}</h1>
            <p className={styles.toolLine}>{tool.line}</p>
          </div>
        </section>

        <section className={styles.toolBody}>
          <aside className={styles.aside}>
            <div className={styles.asideBlock}><b>WHAT IT DOES</b><p>{tool.description}</p></div>
            <div className={styles.asideBlock}><b>USE IT WHEN</b><p>{tool.useWhen}</p></div>
          </aside>
          <BonkersWorkbench tool={tool} />
        </section>

        <footer className={styles.footer}>
          <Link href="/bonkers/">← FIELD KIT</Link>
          <span>{tool.title} / WORKING PROTOTYPE</span>
        </footer>
      </div>
    </main>
  );
}
