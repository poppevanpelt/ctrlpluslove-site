import styles from "./origin-specimen.module.css";

type EvidenceSource = {
  citation: string;
  href: string;
  note: string;
};

type OriginSpecimenProps = {
  specimen: string;
  title: string;
  story: string;
  sources: readonly EvidenceSource[];
};

export function OriginSpecimen({ specimen, title, story, sources }: OriginSpecimenProps) {
  return (
    <aside className={styles.shell} aria-label={`${title} provenance and evidence`}>
      <div className={styles.plate}>
        <span>VON SCHMAALHAUZEN TRAPDOOR</span>
        <strong>ORIGIN SPECIMEN {specimen}</strong>
      </div>

      <div className={styles.grid}>
        <section className={styles.origin}>
          <p className={styles.label}>APOCRYPHAL PROVENANCE / NOT EVIDENCE</p>
          <h2>{title}</h2>
          <p>{story}</p>
          <small>
            Institute folklore. Included as provenance, never as proof.
          </small>
        </section>

        <section className={styles.evidence}>
          <p className={styles.label}>EVIDENCE BASE / ADJACENT MECHANISMS</p>
          <div className={styles.sources}>
            {sources.map((source) => (
              <article key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.citation}
                </a>
                <p>{source.note}</p>
              </article>
            ))}
          </div>
          <small>
            These sources support mechanisms around the instrument. They do not validate the ctrl+love instrument itself.
          </small>
        </section>
      </div>
    </aside>
  );
}
