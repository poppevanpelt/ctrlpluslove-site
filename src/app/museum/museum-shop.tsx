"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  strapline: string;
  description: string;
  label: string;
  bullets?: string[];
  className?: string;
};

const products: Product[] = [
  {
    id: "eraser",
    name: "For Really Big Mistakes™",
    price: 9,
    image: "/museum/really-big-mistakes-eraser.png",
    strapline: "Erases most marketing.",
    description: "Industrial-grade eraser for moments of excessive confidence.",
    label: "Most mistakes fit on a Post-it. The important ones require specialist equipment.",
    bullets: ["Rebranding exercises", "Vision statements", "Innovation workshops", "Words like “synergy”"],
  },
  {
    id: "mug",
    name: "The Happiness Delay Mug™",
    price: 149,
    image: "/museum/happiness-delay-mug.png",
    strapline: "Keeps coffee warm. Expectations realistic.",
    description: "A temperature-controlled mug for people whose best ideas arrive after everyone else has already left the meeting. Battery-powered patience.",
    label: "Most breakthroughs occur fourteen minutes after the meeting ends. Coincidentally, so does most honesty.",
  },
  {
    id: "flip-flops",
    name: "Lee’s Flip-Flops™",
    price: 89,
    image: "/museum/flip-flops-pair-packshot.png",
    strapline: "Creative authority. No socks.",
    description: "Inspired by a generation of creative leaders who somehow convinced global brands to trust them while dressed for a beach holiday.",
    label: "The dress code was never the point. Having a point of view was.",
    bullets: ["Board meetings", "Snow", "Corporate conformity"],
  },
  {
    id: "fax",
    name: "The Ignored Fax Machine™",
    price: 149,
    image: "/museum/ignored-fax-machine.png",
    strapline: "Once urgent. Now curated.",
    description: "The original instant messaging device. Every document beside this machine was once considered important. Years later, a museum employee carefully sorted and stacked them by hand. Nobody has read them since.",
    label: "Contains messages that were once considered urgent. The documents were ignored. The stack was not.",
    className: "museum-product-wide",
  },
  {
    id: "steel-ball",
    name: "The Cybertruck Stainless Steel Ball™",
    price: 39,
    image: "/museum/steel-ball-packshot.png",
    strapline: "Reality got a turn.",
    description: "40mm polished stainless steel sphere. Originally purchased to stop a Cybertruck from rolling away. Now mostly used to stop ideas from doing the same.",
    label: "Every strategy survives until reality gets a turn. This one weighs 260 grams and has ended more arguments than most management books.",
    bullets: ["Testing assumptions", "Ending meetings", "Reflecting on poor decisions", "Preventing unexpected movement"],
  },
];

const money = (value: number) => `€${value}`;

export function MuseumShop() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [requestProduct, setRequestProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("ctrl-love-museum-cart");
        if (saved) setCart(JSON.parse(saved));
      } catch {}
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ctrl-love-museum-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    function closeOverlay(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setCartOpen(false);
      setRequestProduct(null);
    }
    window.addEventListener("keydown", closeOverlay);
    return () => {
      window.removeEventListener("keydown", closeOverlay);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const cartItems = useMemo(
    () => products.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart]
  );
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setNotice(`${product.name} added to the archive bag.`);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 2400);
  }

  function setQuantity(id: string, quantity: number) {
    setCart((current) => {
      const next = { ...current };
      if (quantity < 1) delete next[id];
      else next[id] = quantity;
      return next;
    });
  }

  function requestOrder() {
    const lines = cartItems.map((item) => `${item.quantity} × ${item.name} — ${money(item.price * item.quantity)}`);
    window.open(`mailto:hello@ctrlpluslove.com?subject=${encodeURIComponent("Museum shop order request")}&body=${encodeURIComponent(`Hello ctrl+love,\n\nI would like to request:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}\n\nPlease send availability and next steps.\n`)}`, "_self");
  }

  function submitInformationRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requestProduct) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");
    const body = `Hello ctrl+love,\n\nI would like more information about ${requestProduct.name}.\n\nName: ${name}\nEmail: ${email}\n\n${message}`;
    window.open(`mailto:hello@ctrlpluslove.com?subject=${encodeURIComponent(`Information request: ${requestProduct.name}`)}&body=${encodeURIComponent(body)}`, "_self");
    setRequestProduct(null);
  }

  return (
    <main className="museum-storefront">
      <header className="museum-store-header">
        <Link className="museum-store-brand" href="/" aria-label="ctrl+love home">
          <strong>ctrl+love<sup>™</sup></strong>
          <span>museum shop</span>
        </Link>
        <p>Ideas. Artifacts. Consequences.</p>
        <button className="museum-cart-button" type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${itemCount} items`}>
          <span aria-hidden="true">▱</span>
          <b>{itemCount}</b>
        </button>
      </header>

      <section className="museum-product-grid" aria-label="Museum shop products">
        {products.map((product) => (
          <article className={`museum-product ${product.className || ""}`} key={product.id}>
            <div className="museum-product-image">
              <Image src={product.image} alt={product.name} width={1536} height={1024} />
            </div>
            <div className="museum-product-content">
              <div className="museum-product-title">
                <h1>{product.name}</h1>
                <span>{money(product.price)}</span>
              </div>
              <p className="museum-product-strapline">{product.strapline}</p>
              <div className="museum-product-details">
                <p>{product.description}</p>
                {product.bullets && (
                  <div>
                    <strong>{product.id === "steel-ball" ? "Useful for:" : product.id === "flip-flops" ? "Not recommended for:" : "Ideal for:"}</strong>
                    <ul>{product.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                  </div>
                )}
              </div>
              <div className="museum-product-label">
                <p><strong>Museum label</strong>{product.label}</p>
                <div className="museum-product-actions">
                  <button type="button" className="museum-info-button" onClick={() => setRequestProduct(product)}>Request information</button>
                  <button type="button" className="museum-add-button" onClick={() => addToCart(product)}>Add to cart</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className="museum-store-footer">
        <Link href="/artifacts/"><span aria-hidden="true">▥</span><p><strong>Genuine archive material.</strong>May contain traces of meetings, travel and poor decisions.</p></Link>
        <a href="mailto:hello@ctrlpluslove.com?subject=Museum%20shop%20shipping"><span aria-hidden="true">▱</span><p><strong>Worldwide shipping.</strong>Regret-free returns within 14 days.</p></a>
        <a href="mailto:hello@ctrlpluslove.com?subject=Museum%20shop%20hello"><span aria-hidden="true">☺</span><p><strong>Thank you for supporting the museum.</strong>Profits fund more mistakes.</p></a>
      </footer>

      {notice && <div className="museum-toast" role="status">{notice}</div>}

      {cartOpen && (
        <div className="museum-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}>
          <aside className="museum-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="museum-drawer-heading"><h2 id="cart-title">Archive bag</h2><button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
            {cartItems.length === 0 ? <p className="museum-empty-cart">Nothing here yet. A rare display of restraint.</p> : (
              <>
                <div className="museum-cart-items">{cartItems.map((item) => (
                  <div className="museum-cart-item" key={item.id}>
                    <Image src={item.image} alt="" width={180} height={120} />
                    <div><strong>{item.name}</strong><span>{money(item.price)}</span><div className="museum-quantity"><button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`}>−</button><b>{item.quantity}</b><button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Add one ${item.name}`}>+</button></div></div>
                  </div>
                ))}</div>
                <div className="museum-cart-total"><span>Total</span><strong>{money(total)}</strong></div>
                <button className="museum-checkout-button" type="button" onClick={requestOrder}>Request order →</button>
                <p className="museum-checkout-note">No payment is taken. We’ll confirm availability by email.</p>
              </>
            )}
          </aside>
        </div>
      )}

      {requestProduct && (
        <div className="museum-overlay museum-modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setRequestProduct(null)}>
          <section className="museum-request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title">
            <div className="museum-drawer-heading"><div><p>Request information</p><h2 id="request-title">{requestProduct.name}</h2></div><button type="button" onClick={() => setRequestProduct(null)} aria-label="Close information request">×</button></div>
            <form onSubmit={submitInformationRequest}>
              <label>Name<input name="name" autoComplete="name" required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              <label>What would you like to know?<textarea name="message" rows={5} placeholder="Availability, shipping, provenance…" /></label>
              <button className="museum-checkout-button" type="submit">Prepare request →</button>
              <p className="museum-checkout-note">This opens your email app with the request ready to send.</p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
