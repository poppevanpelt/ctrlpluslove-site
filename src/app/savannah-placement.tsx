"use client";

export function SavannahPlacement() {
  const openSavannah = () => {
    window.dispatchEvent(new Event("savannah-open"));
  };

  return (
    <section aria-label="Savannah, ctrl+love employee #4" className="savannah-home-placement">
      <img src="/home/savannah.jpg" alt="Savannah" />
      <div className="savannah-home-placement__copy">
        <span>EMPLOYEE #4 / LIVE</span>
        <strong>Savannah is in.</strong>
        <p>Talk when you can. Type when you can&apos;t. Same Savannah, same conversation.</p>
      </div>
      <button type="button" onClick={openSavannah}>Talk or type to Savannah ↗</button>
    </section>
  );
}
