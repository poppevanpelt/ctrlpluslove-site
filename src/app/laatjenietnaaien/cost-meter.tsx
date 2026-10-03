"use client";
import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

const situations = [
  ["job", "Een baan niet aangenomen"],
  ["business", "Een bedrijf niet begonnen of uitgesteld"],
  ["assignment", "Een opdracht geweigerd of misgelopen"],
  ["lawyer", "Advocaten moeten inschakelen"],
  ["buyout", "Betaald of waarde ingeleverd om ervan af te komen"],
  ["negotiation", "Minder onderhandelingsruimte of inkomen gehad"],
] as const;

type Amounts = { legal: string; settlement: string; otherDirect: string; lostIncome: string; lostAssignments: string; };
const emptyAmounts: Amounts = { legal: "", settlement: "", otherDirect: "", lostIncome: "", lostAssignments: "" };

function euro(value: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}
function numeric(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function CostMeter() {
  const [selected, setSelected] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<Amounts>(emptyAmounts);
  const [months, setMonths] = useState("");
  const [invoked, setInvoked] = useState("");
  const [sector, setSector] = useState("");
  const [evidence, setEvidence] = useState("");
  const [story, setStory] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [shareState, setShareState] = useState("");

  const totals = useMemo(() => {
    const hard = numeric(amounts.legal) + numeric(amounts.settlement) + numeric(amounts.otherDirect);
    const income = numeric(amounts.lostIncome) + numeric(amounts.lostAssignments);
    return { hard, income, total: hard + income };
  }, [amounts]);

  const toggleSituation = (value: string) => {
    setSelected((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const setAmount = (key: keyof Amounts, value: string) => setAmounts((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShareState("");
    if (!selected.length || !consent) { setStatus("error"); return; }
    setStatus("sending");

    const data = new URLSearchParams({
      "form-name": "concurrentiebeding-kostenmeter",
      campaign_version: "v1-2026-09-29",
      situations: selected.join("|"),
      legal_costs: String(numeric(amounts.legal)),
      settlement_costs: String(numeric(amounts.settlement)),
      other_direct_costs: String(numeric(amounts.otherDirect)),
      lost_income: String(numeric(amounts.lostIncome)),
      lost_assignments: String(numeric(amounts.lostAssignments)),
      hard_cost_total: String(totals.hard),
      reported_income_loss_total: String(totals.income),
      reported_total: String(totals.total),
      months_restricted: months,
      invoked, sector, evidence, story, email,
      consent: consent ? "yes" : "no",
      submitted_at: new Date().toISOString(),
      company: "",
    });

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      if (!response.ok) throw new Error("submit failed");
      setStatus("done");
    } catch { setStatus("error"); }
  }

  async function shareResult() {
    const text = `Mijn gemelde concurrentiebeding-kosten: ${euro(totals.total)}. De algemene wettelijke prijs om het recht vooraf te reserveren: €0. #laatjenietnaaien`;
    const url = "https://laatjenietnaaien.nl/";
    try {
      if (navigator.share) { await navigator.share({ title: "€0 voor jouw toekomst", text, url }); setShareState("gedeeld"); return; }
      await navigator.clipboard.writeText(`${text} ${url}`); setShareState("gekopieerd");
    } catch { setShareState(""); }
  }

  if (status === "done") {
    return (
      <section className={styles.result} id="meter" aria-live="polite">
        <p className={styles.sectionLabel}>JOUW MELDING</p>
        <p className={styles.resultLead}>JOUW CONCURRENTIEBEDING KOSTTE JE VOLGENS JOUW MELDING</p>
        <strong className={styles.resultNumber}>{euro(totals.total)}</strong>
        <div className={styles.resultBreakdown}>
          <span>Harde kosten: <strong>{euro(totals.hard)}</strong></span>
          <span>Gemeld inkomensverlies: <strong>{euro(totals.income)}</strong></span>
        </div>
        <p className={styles.resultZero}>ALGEMENE WETTELIJKE PRIJS OM HET RECHT VOORAF TE RESERVEREN: <strong>€0</strong></p>
        <p className={styles.resultThanks}>Dank. Jouw melding is opgeslagen. We gebruiken alleen geaggregeerde of geanonimiseerde informatie voor de publieke meting, tenzij je later uitdrukkelijk iets anders afspreekt.</p>
        <div className={styles.resultActions}>
          <button type="button" onClick={shareResult}>Deel jouw getal</button>
          <button type="button" onClick={() => setStatus("idle")}>Nog een melding</button>
        </div>
        {shareState && <p className={styles.shareState}>{shareState}</p>}
      </section>
    );
  }

  return (
    <section className={styles.meter} id="meter">
      <div className={styles.meterHeading}>
        <p className={styles.sectionLabel}>DE CONCURRENTIEBEDING-KOSTENMETER</p>
        <h2>Vertel ons wat het je kostte.</h2>
        <p>90 seconden. Geen werkgeversnaam nodig. Geen documenten uploaden.</p>
      </div>

      <form name="concurrentiebeding-kostenmeter" method="POST" action="/__forms.html" data-netlify="true" data-netlify-honeypot="company" onSubmit={submit} className={styles.form}>
        <input type="hidden" name="form-name" value="concurrentiebeding-kostenmeter" />
        <p className={styles.honeypot}><label>Niet invullen<input name="company" tabIndex={-1} autoComplete="off" /></label></p>

        <fieldset>
          <legend>Wat gebeurde er?</legend>
          <div className={styles.checkGrid}>
            {situations.map(([value, label]) => (
              <label key={value} className={selected.includes(value) ? styles.checked : ""}>
                <input type="checkbox" checked={selected.includes(value)} onChange={() => toggleSituation(value)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Wat kostte het je?</legend>
          <p className={styles.fieldNote}>Vul alleen bedragen in die je zelf wilt melden. Schattingen blijven apart van harde kosten.</p>
          <div className={styles.amountGrid}>
            <label><span>Advocaten / juridisch advies</span><div><b>€</b><input type="number" min="0" step="1" inputMode="numeric" value={amounts.legal} onChange={(e) => setAmount("legal", e.target.value)} /></div></label>
            <label><span>Afkoop / schikking / ingeleverde waarde</span><div><b>€</b><input type="number" min="0" step="1" inputMode="numeric" value={amounts.settlement} onChange={(e) => setAmount("settlement", e.target.value)} /></div></label>
            <label><span>Andere directe kosten</span><div><b>€</b><input type="number" min="0" step="1" inputMode="numeric" value={amounts.otherDirect} onChange={(e) => setAmount("otherDirect", e.target.value)} /></div></label>
            <label><span>Misgelopen salaris / inkomen</span><div><b>€</b><input type="number" min="0" step="1" inputMode="numeric" value={amounts.lostIncome} onChange={(e) => setAmount("lostIncome", e.target.value)} /></div></label>
            <label><span>Misgelopen opdrachten / winst</span><div><b>€</b><input type="number" min="0" step="1" inputMode="numeric" value={amounts.lostAssignments} onChange={(e) => setAmount("lostAssignments", e.target.value)} /></div></label>
          </div>
          <div className={styles.liveTotal} aria-live="polite">
            <span>Door jou gemeld totaal</span><strong>{euro(totals.total)}</strong>
            <small>harde kosten {euro(totals.hard)} · gemeld inkomensverlies {euro(totals.income)}</small>
          </div>
        </fieldset>

        <fieldset>
          <legend>Wat deed het beding?</legend>
          <div className={styles.detailGrid}>
            <label><span>Hoeveel maanden speelde het ongeveer?</span><input type="number" min="0" max="120" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} name="months_restricted" /></label>
            <label><span>Werd het daadwerkelijk ingeroepen?</span><select value={invoked} onChange={(e) => setInvoked(e.target.value)} name="invoked"><option value="">Kies</option><option value="yes">Ja</option><option value="no-threat-enough">Nee, de dreiging was genoeg</option><option value="no">Nee</option><option value="unknown">Weet ik niet</option></select></label>
            <label><span>Sector</span><input value={sector} onChange={(e) => setSector(e.target.value)} name="sector" placeholder="bijv. reclame, tech, zorg" /></label>
            <label><span>Kun je (een deel van) het bedrag onderbouwen?</span><select value={evidence} onChange={(e) => setEvidence(e.target.value)} name="evidence"><option value="">Kies</option><option value="yes">Ja</option><option value="partly">Gedeeltelijk</option><option value="no">Nee</option></select></label>
          </div>
          <label className={styles.story}><span>Wat gebeurde er? <small>optioneel, geen namen nodig</small></span><textarea rows={5} maxLength={1200} value={story} onChange={(e) => setStory(e.target.value)} name="story" placeholder="Eén alinea is genoeg." /></label>
        </fieldset>

        <fieldset className={styles.contactFieldset}>
          <legend>Mag de onderzoeker je eventueel één vraag stellen?</legend>
          <label className={styles.email}><span>E-mail <small>optioneel</small></span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" autoComplete="email" /></label>
          <label className={styles.consent}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Ik geef toestemming om mijn antwoorden te gebruiken voor geaggregeerde en geanonimiseerde analyse van de kosten van concurrentiebedingen. Ik vul geen vertrouwelijke documenten, werkgeversnamen of juridisch geprivilegieerde informatie in.</span></label>
        </fieldset>

        {status === "error" && <p className={styles.error} role="alert">Vink ten minste één ervaring en de toestemming aan. Als je dat al deed, probeer het nog één keer.</p>}
        <button className={styles.submit} type="submit" disabled={status === "sending"}>{status === "sending" ? "WORDT GETELD..." : "TEL MIJ MEE"}</button>
        <p className={styles.formFinePrint}>Geen juridisch advies. Geen automatische schadeclaim. We meten gemelde kosten en houden harde uitgaven en gemeld inkomensverlies apart. Wil je een inzending laten verwijderen, neem contact op via <a href="mailto:hello@ctrlpluslove.com">hello@ctrlpluslove.com</a>.</p>
      </form>
    </section>
  );
}
