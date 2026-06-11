.museum-page {
  min-height: 100vh;
  background: var(--paper);
  padding: 2rem 1.5rem 7rem;
}

.museum-back {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  color: var(--muted);
  font-size: var(--type-secondary);
  font-weight: 700;
  text-decoration: none;
}

.museum-back:hover {
  color: var(--ink);
}

.museum-hero {
  display: grid;
  gap: 1.4rem;
  width: min(100%, 64rem);
  margin: 10rem auto 6rem;
}

.museum-hero h1 {
  color: var(--ink);
  font-size: var(--type-display);
  font-weight: 600;
  line-height: var(--leading-display);
}

.museum-hero > p:last-child {
  color: var(--soft);
  font-size: var(--type-body);
  line-height: var(--leading-body);
}

.museum-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4rem 3rem;
  width: min(100%, 72rem);
  margin: 0 auto;
}

.museum-card {
  display: grid;
  gap: 0.85rem;
  border-top: 1px solid var(--rule);
  padding-top: 1.35rem;
}

.museum-price {
  color: var(--team-warm);
  font-size: var(--type-secondary);
  font-weight: 700;
}

.museum-card h2 {
  color: var(--ink);
  font-size: var(--type-body);
  font-weight: 600;
  line-height: var(--leading-body);
}

.museum-line {
  color: var(--ink);
  font-size: var(--type-body);
  line-height: var(--leading-body);
}

.museum-note {
  color: var(--soft);
  font-size: 1rem;
  line-height: 1.45;
}

.museum-card a {
  width: fit-content;
  margin-top: 0.35rem;
  border-bottom: 1px solid rgba(26, 24, 21, 0.35);
  color: var(--ink);
  font-size: var(--type-secondary);
  font-weight: 700;
  text-decoration: none;
}

.museum-card a:hover {
  color: var(--soft);
}
