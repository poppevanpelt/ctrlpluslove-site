import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "../holy-fools.module.css";
import { HolyWorkbench } from "../holy-workbench";
import { HOLY_TOOL_MAP, HOLY_TOOLS } from "../tools";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return HOLY_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = HOLY_TOOL_MAP.get(slug);

  if (!tool) return {};

  return {
    title: tool.title + " — Holy Fools",
    description: tool.line,
    robots: { index: false, follow: false },
  };
}

export default async function HolyToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = HOLY_TOOL_MAP.get(slug);

  if (!tool) notFound();

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <Link className={styles.brand} href="/holy-fools/">
            <span className={styles.brandMark}>HF</span>
            <span>HOLY FOOLS × ctrl+love</span>
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
            <div className={styles.asideBlock}>
              <b>WHAT IT DOES</b>
              <p>{tool.description}</p>
            </div>
            <div className={styles.asideBlock}>
              <b>USE IT WHEN</b>
              <p>{tool.useWhen}</p>
            </div>
          </aside>

          <HolyWorkbench tool={tool} />
        </section>

        <footer className={styles.footer}>
          <Link href="/holy-fools/">← FIELD KIT</Link>
          <span>{tool.title} / WORKING PROTOTYPE</span>
        </footer>
      </div>
    </main>
  );
}
