import type { Metadata } from "next";
import Link from "next/link";
import "./devices.css";

export const metadata: Metadata = {
  title: "CTRL+ Devices | ctrl+love",
  description: "Small instruments for moments when judgment matters.",
};

const devices = [
  {
    name: "CTRL+BLACKOUT",
    code: "001",
    status: "LIVE DRILL",
    line: "Find out what quietly breaks when the models disappear.",
    href: "/ctrl-blackout",
    active: true,
  },
  {
    name: "CTRL+KILL",
    code: "002",
    status: "PROTOCOL",
    line: "Write down what would make you stop before sunk cost starts negotiating.",
  },
  {
    name: "CTRL+REDLINE",
    code: "003",
    status: "POLICY DEVICE",
    line: "Decide where humans advise, AI acts, and autonomy ends.",
  },
  {
    name: "CTRL+CHASE",
    code: "004",
    status: "FIELD DEVICE",
    line: "Follow the signal until it becomes evidence or disappears.",
  },
  {
    name: "CTRL+PURGE",
    code: "005",
    status: "ROOM DEVICE",
    line: "Remove inherited assumptions before they become the brief.",
  },
  {
    name: "CTRL+FIZZ",
    code: "006",
    status: "PHYSICAL OBJECT",
    line: "Carbonated judgment for meetings that have gone flat.",
  },
  {
    name: "CTRL+SWAT",
    code: "007",
    status: "RAPID RESPONSE",
    line: "Rapid intervention for live situations. Observe, decide, move.",
  },
];

export default function CtrlDevicesPage() {
  return (
    <main className="devices-shell">
      <header className="devices-topbar">
        <Link href="/" className="devices-brand">ctrl+love</Link>
        <span>Instrument drawer / CTRL+ Devices</span>
        <span>Protocol family 01</span>
      </header>

      <section className="devices-hero">
        <div>
          <p className="devices-eyebrow">SMALL DEVICES FOR LARGE CONSEQUENCES</p>
          <h1>CTRL+<br />Devices</h1>
          <p className="devices-intro">
            One job. One moment of truth. No transformation programme required.
          </p>
        </div>
        <div className="devices-object" aria-hidden="true">
          <div className="devices-ring"><div className="devices-ball" /></div>
          <span>FIELD OBJECT / 01</span>
        </div>
      </section>

      <section className="devices-drawer" aria-label="CTRL+ device family">
        {devices.map((device) => {
          const body = (
            <>
              <div className="device-code">{device.code}</div>
              <div className="device-main">
                <div className="device-meta">{device.status}</div>
                <h2>{device.name}</h2>
                <p>{device.line}</p>
              </div>
              <div className="device-action">{device.active ? "OPEN →" : "IN THE LAB"}</div>
            </>
          );

          return device.active && device.href ? (
            <Link className="device-row device-row-active" href={device.href} key={device.name}>
              {body}
            </Link>
          ) : (
            <div className="device-row" key={device.name}>{body}</div>
          );
        })}
      </section>

      <footer className="devices-footer">
        <span>Strategies are useful. Devices tell you what is true.</span>
        <Link href="/">ctrl+love / shortcut to reality</Link>
      </footer>
    </main>
  );
}
