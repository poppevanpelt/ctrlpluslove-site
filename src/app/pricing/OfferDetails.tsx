import styles from "../xray-follow-through.module.css";

const offers = {
  stress: {name:"Decision Stress-Test™",heading:"One decision before you commit.",line:"A focused room to pressure-test one important decision before spending money, time or reputation.",outcome:"A recommendation to proceed, reshape or stop, with the risks, missing evidence and next move made explicit.",price:"€4,500 · ex VAT"},
  kill: {name:"Kill or Scale™",heading:"An initiative is already moving. Decide its direction.",line:"An independent assessment of an existing product, idea, venture or initiative: its data, market, team and trajectory.",outcome:"A verdict to stop, reshape or accelerate, with actionable next steps and the consequences of doing nothing.",price:"Starting at €12,000 · 2–3 weeks from kickoff to verdict. VAT treatment and scope to confirm in the proposal."},
};

export default function OfferDetails({offer}:{offer:keyof typeof offers}) {
  const item=offers[offer];
  return <section className={styles.details} aria-label={`${item.name} in plain language`}>
    <div className={styles.panel}>
      <span className={styles.label}>{item.name} / IN PLAIN LANGUAGE</span>
      <h2>{item.heading}</h2><p>{item.line}</p><p><strong>What comes back:</strong> {item.outcome}</p>
      <p><strong>Published investment:</strong> {item.price}</p>
      <div className={styles.actions}><a className={styles.action} href="/pricing/">Compare the offers ↗</a><a className={styles.action} href="https://ctrl-love-room-key.lovable.app/">Find a suggested fit ↗</a></div>
    </div>
  </section>;
}
