import Link from "next/link";

export function SteelBallPresence() {
  return (
    <Link className="steel-ball-signature-card" href="/steel-ball/">
      <span className="steel-ball-signature-copy">
        <span className="section-kicker">Artifact 001</span>
        <strong>The Steel Ball</strong>
        <span>
          A physical reminder to test confidence before reality does.
        </span>
        <em>View the object</em>
      </span>
      <span className="steel-ball-signature-stage" aria-hidden="true">
        <span className="steel-ball-object" />
      </span>
    </Link>
  );
}
