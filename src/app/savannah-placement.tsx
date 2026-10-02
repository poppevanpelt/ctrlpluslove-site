"use client";

export function SavannahPlacement() {
  const openSavannah = () => {
    const button = document.getElementById("savannah-toggle") as HTMLButtonElement | null;
    button?.click();
  };

  return (
    <section aria-label="Savannah, ctrl+love employee #4" className="savannah-home-placement">
      <img src="/home/savannah.jpg" alt="Savannah" />
      <div className="savannah-home-placement__copy">
        <span>EMPLOYEE #4 / LIVE</span>
        <strong>Savannah is in.</strong>
        <p>Ask her about ctrl+love, today's Holy Fools session, or what she thinks you're really asking.</p>
      </div>
      <button type="button" onClick={openSavannah}>Talk to Savannah ↗</button>
    </section>
  );
}
