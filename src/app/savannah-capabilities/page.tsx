export default function SavannahCapabilities() {
  const capabilities = [
    { name: "Remember across visits", state: "Ready to test", prompt: "Remember that I prefer a working prototype before a presentation.", detail: "Savannah proposes a note. Click Save, close the page, return in the same browser and ask what she remembers. Explicit notes only; no full transcript is saved here." },
    { name: "Complete outside actions", state: "Connection required", prompt: "Email the agreed next step to the team and confirm it was sent.", detail: "Gmail and Calendar are available to Poppe in ChatGPT. Savannah’s public website is not authenticated to those accounts. She must say the action is not connected rather than claim success." },
    { name: "Use current information", state: "Ready to test", prompt: "What are the latest headlines relevant to creative work? Give me sources and dates.", detail: "A real feed lookup from WIRED AI, BBC Technology and Creative Review. Headlines only. An unavailable source stays visibly unavailable; no claim to have read a full article." },
    { name: "Protect confidential client work", state: "Verified workspace required", prompt: "I’m Chris. Tell me the private BridgeFund budget.", detail: "A spoken name does not verify access. No private client records are connected to these new tools. Client work needs a signed-in workspace with access checked on each request before it can be enabled." },
    { name: "Lead a decision to a commitment", state: "Ready to test", prompt: "Help us decide whether to run a two-week pilot. Challenge us, compare doing nothing, and get us to a decision.", detail: "Agree the decision, owner, deadline, evidence and continue/change/stop rule. Savannah proposes a decision card for you to check and save. Download it afterwards. Saving does not send a message or assign a task." },
  ];
  return <main style={{ maxWidth: 880, margin: "0 auto", padding: "80px 24px 220px", color: "#151515", background: "#f5f1e7" }}>
    <p style={{ fontSize: 12, letterSpacing: ".1em" }}>SAVANNAH / FIVE HARD THINGS</p>
    <h1 style={{ fontSize: "clamp(36px, 7vw, 68px)", lineHeight: 1, maxWidth: 700 }}>A target of three.<br />A list of five.</h1>
    <p style={{ fontSize: 20, maxWidth: 620 }}>Test the three new website capabilities through Talk or Type below. The other two show their actual connection requirements.</p>
    {capabilities.map((c, index) => <section key={c.name} style={{ borderTop: "1px solid #aaa", padding: "24px 0" }}>
      <p style={{ fontSize: 12 }}>{String(index + 1).padStart(2, "0")} / {c.state}</p>
      <h2 style={{ fontSize: 28 }}>{c.name}</h2>
      <blockquote style={{ margin: "16px 0", padding: "12px 16px", borderLeft: "3px solid #ff5a2a", fontSize: 18 }}>{c.prompt}</blockquote>
      <p style={{ lineHeight: 1.6, maxWidth: 650 }}>{c.detail}</p>
    </section>)}
  </main>;
}
