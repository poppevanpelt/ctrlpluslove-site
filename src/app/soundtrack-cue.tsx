import styles from "./soundtrack-cue.module.css";

type SoundtrackCueProps = {
  index: string;
  title: string;
  artist: string;
  href: string;
  note: string;
  placement?: "earthrise" | "inline";
  previewImage?: string;
};

export function SoundtrackCue({
  index,
  title,
  artist,
  href,
  note,
  placement = "inline",
  previewImage,
}: SoundtrackCueProps) {
  return (
    <aside
      className={`${styles.cue} ${placement === "earthrise" ? styles.earthrise : styles.inline}`}
      aria-label={`Soundtrack cue: ${title} by ${artist}`}
    >
      <span className={styles.index}>SOUNDTRACK {index}</span>
      <div className={styles.track}>
        <strong>{title}</strong>
        <span>{artist}</span>
      </div>
      <p>{note}</p>
      <a href={href} target="_blank" rel="noreferrer">
        LISTEN ↗
      </a>
      {previewImage ? (
        <a
          className={styles.preview}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Play ${title} by ${artist}`}
          style={{ backgroundImage: `url("${previewImage}")` }}
        >
          <span>PLAY FILM ↗</span>
        </a>
      ) : null}
    </aside>
  );
}
