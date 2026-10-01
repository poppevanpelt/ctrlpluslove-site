import type { ReactNode } from "react";
import styles from "./object-stage.module.css";

export type ObjectStageAnnotation = {
  index: string;
  title: string;
  body: string;
};

type ObjectStageProps = {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  object: ReactNode;
  annotations?: ObjectStageAnnotation[];
  readout?: {
    label: string;
    text: ReactNode;
    note?: ReactNode;
  };
  actions?: ReactNode;
  className?: string;
};

export function ObjectStage({
  kicker,
  title,
  intro,
  object,
  annotations = [],
  readout,
  actions,
  className,
}: ObjectStageProps) {
  const split = Math.ceil(annotations.length / 2);
  const left = annotations.slice(0, split);
  const right = annotations.slice(split);

  const renderAnnotation = (item: ObjectStageAnnotation) => (
    <article className={styles.annotation} key={item.index}>
      <span>{item.index}</span>
      <div>
        <strong>{item.title}</strong>
        <p>{item.body}</p>
      </div>
    </article>
  );

  return (
    <section className={`${styles.stage}${className ? ` ${className}` : ""}`}>
      <header className={styles.heading}>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        {intro ? <div className={styles.intro}>{intro}</div> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>

      <div className={styles.objectRow}>
        <div className={styles.rail}>{left.map(renderAnnotation)}</div>
        <div className={styles.object}>{object}</div>
        <div className={styles.rail}>{right.map(renderAnnotation)}</div>
      </div>

      {readout ? (
        <div className={styles.readout}>
          <span>{readout.label}</span>
          <div>{readout.text}</div>
          {readout.note ? <small>{readout.note}</small> : null}
        </div>
      ) : null}
    </section>
  );
}
