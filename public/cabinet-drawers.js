(() => {
  function makeDrawerFromCard(card, kind) {
    if (!card || card.dataset.drawerReady === "true") return;

    const details = document.createElement("details");
    details.className = `${card.className} cabinet-drawer ${kind}-drawer`;
    details.dataset.drawerReady = "true";

    const summary = document.createElement("summary");
    const panel = document.createElement("div");
    panel.className = "drawer-panel";

    const href = card.getAttribute("href");

    if (kind === "persona") {
      const index = card.querySelector(":scope > span");
      const portrait = card.querySelector(".persona-portrait");
      const name = card.querySelector("h3");
      const role = card.querySelector(":scope > p");
      const line = card.querySelector("blockquote");
      const functionList = card.querySelector("dl");
      const note = card.querySelector(".ctrl-layer-note");

      [index, portrait, name, role, line].forEach((node) => {
        if (node) summary.appendChild(node);
      });

      const toggle = document.createElement("span");
      toggle.className = "drawer-toggle-label";
      toggle.textContent = "Open drawer";
      summary.appendChild(toggle);

      if (functionList) panel.appendChild(functionList);
      if (href) {
        const link = document.createElement("a");
        link.className = "drawer-link";
        link.href = href;
        link.textContent = "Open full profile →";
        panel.appendChild(link);
      }
      if (note) panel.appendChild(note);
    }

    if (kind === "product") {
      const object = card.querySelector(":scope > span");
      const name = card.querySelector("h3");
      const list = card.querySelector("dl");
      const note = card.querySelector(".ctrl-layer-note");
      const priceRow = list
        ? Array.from(list.querySelectorAll(":scope > div")).find((row) =>
            /starting point/i.test(row.querySelector("dt")?.textContent || ""),
          )
        : null;

      [object, name].forEach((node) => {
        if (node) summary.appendChild(node);
      });

      if (priceRow) {
        const price = document.createElement("strong");
        price.className = "drawer-price";
        price.textContent = priceRow.querySelector("dd")?.textContent || "";
        summary.appendChild(price);
        priceRow.remove();
      }

      const toggle = document.createElement("span");
      toggle.className = "drawer-toggle-label";
      toggle.textContent = "Open drawer";
      summary.appendChild(toggle);

      if (list) panel.appendChild(list);
      if (href) {
        const link = document.createElement("a");
        link.className = "drawer-link";
        link.href = href;
        link.textContent = "Open engagement →";
        panel.appendChild(link);
      }
      if (note) panel.appendChild(note);
    }

    details.append(summary, panel);
    card.replaceWith(details);
  }

  function foldFounderBiography(root) {
    const biography = root.querySelector(".founder-biography");
    if (!biography || biography.closest(".founder-dossier")) return;

    const details = document.createElement("details");
    details.className = "founder-dossier cabinet-drawer";

    const summary = document.createElement("summary");
    const label = document.createElement("span");
    label.textContent = "Open dossier";
    const toggle = document.createElement("span");
    toggle.className = "drawer-toggle-label";
    toggle.setAttribute("aria-hidden", "true");
    summary.append(label, toggle);

    const panel = document.createElement("div");
    panel.className = "drawer-panel";
    while (biography.firstChild) panel.appendChild(biography.firstChild);

    details.append(summary, panel);
    biography.replaceWith(details);
  }

  function removeDuplicateEngagements(root) {
    const duplicate = root.querySelector(".engagement-section");
    if (duplicate) duplicate.remove();
  }

  function initCabinetDrawers() {
    const root = document.querySelector("main.chapter-one");
    if (!root || root.dataset.cabinetDrawers === "true") return;
    root.dataset.cabinetDrawers = "true";

    root.querySelectorAll("a.persona-card").forEach((card) =>
      makeDrawerFromCard(card, "persona"),
    );
    root.querySelectorAll("a.product-card").forEach((card) =>
      makeDrawerFromCard(card, "product"),
    );
    foldFounderBiography(root);
    removeDuplicateEngagements(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCabinetDrawers, { once: true });
  } else {
    initCabinetDrawers();
  }
})();
