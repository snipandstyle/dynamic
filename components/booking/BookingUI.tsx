"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookingItem, money, quoteCart, SIZE_LABELS } from "../../data/catalog";
import { readBookingCart } from "../../utils/booking-cart";

export function Icon({
  name = "paw",
  size = 22,
}: {
  name?: string;
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4 10-10" />,
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      </>
    ),
    scissors: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="m8 8 13 13M8 16 21 3" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    bath: (
      <>
        <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3ZM6 20v2m12-2v2M6 12V5a3 3 0 0 1 6 0" />
        <path d="M10 5h4" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
        <path d="M21 2v4m-2-2h4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-8 9 8v11H3V10Z" />
        <path d="M9 21v-8h6v8" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    phone: (
      <path d="m6 3 4 4-3 3a16 16 0 0 0 7 7l3-3 4 4-2 3C10 23 1 14 3 5l3-2Z" />
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    person: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 22v-3a8 8 0 0 1 16 0v3H4Z" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    paw: (
      <>
        <ellipse cx="12" cy="16" rx="6" ry="4.5" />
        <ellipse cx="4.5" cy="10" rx="2" ry="3" />
        <ellipse cx="9" cy="5.5" rx="2" ry="3" />
        <ellipse cx="15" cy="5.5" rx="2" ry="3" />
        <ellipse cx="19.5" cy="10" rx="2" ry="3" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.paw}
    </svg>
  );
}

export function useBookingCart() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setItems(readBookingCart());
      setReady(true);
    };
    sync();
    window.addEventListener("snip_cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("snip_cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { items, ready };
}

export function BookingShell({
  children,
  active = "",
  minimal = false,
}: {
  children: React.ReactNode;
  active?: string;
  minimal?: boolean;
}) {
  const { items } = useBookingCart();
  const [menu, setMenu] = useState(false);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="pet-site">
      <a className="pet-skip" href="#main-content">
        Skip to content
      </a>
      <div className="pet-announcement">
        <Icon name="sparkle" size={14} />
        <span>
          Upfront grooming prices · 1 night free on
          6+ night stays
        </span>
        <span className="pet-announcement-end">
          Applied automatically. No codes needed.
        </span>
      </div>
      <header className="pet-header">
        <div className="pet-container pet-header-inner">
          <Link href="/" className="pet-brand" aria-label="Snip and Style home">
            <span className="exact-brand-seal"><Icon name="paw" size={17}/></span><span className="exact-brand-name">snip<span>&amp;</span>style<small>GOOD CARE. HAPPY PAWS.</small></span>
          </Link>
          {!minimal && (
            <Link className="ref-header-review" href="/reviews">
              <Icon name="sparkle" size={15} />
              <span>Customer reviews</span>
            </Link>
          )}
          {!minimal && (
            <nav className="pet-desktop-nav" aria-label="Main navigation">
              {[
                ["/boarding", "Boarding"],
                ["/grooming", "Grooming"],
                ["/#offers", "Offers"],
                ["/#studio-location", "Studio Location"],
                ["/#faq", "FAQ"],
              ].map(([url, label]) => (
                <Link
                  key={url}
                  href={url}
                  onClick={(e) => {
                    if (
                      url.startsWith("/#") &&
                      typeof window !== "undefined" &&
                      (window.location.pathname === "/" ||
                        window.location.pathname === "")
                    ) {
                      const id = url.replace("/#", "");
                      const el = document.getElementById(id);
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  aria-current={
                    active === url.replace("/", "").replace("#", "")
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
          <div className="pet-header-actions"><a className="exact-call-now" href="tel:+919739887770"><Icon name="phone" size={15}/><span>Call now</span></a>
            {!minimal && (
              <Link className="ref-header-location" href="/contact">
                <Icon name="pin" size={16} />
                Kanakapura Rd Studio
              </Link>
            )}
            {!minimal && (
              <Link
                href="/account"
                className="pet-account"
                aria-label="My bookings"
              >
                <Icon name="person" size={16} />
              </Link>
            )}
            <Link
              href="/cart"
              className="pet-cart-link"
              aria-label={`View cart, ${count} services`}
            >
              <Icon name="bag" size={20} />
              <span className="pet-cart-text">Cart</span>
              <span className="pet-count">{count}</span>
            </Link>
            {!minimal && (
              <button
                className="pet-menu-button"
                aria-label={menu ? "Close menu" : "Open menu"}
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                <Icon name={menu ? "close" : "menu"} />
              </button>
            )}
          </div>
        </div>
        {menu && (
          <nav className="pet-mobile-nav" aria-label="Mobile navigation">
            {[
              ["/boarding", "Boarding Sanctuary"],
              ["/grooming", "Grooming Packages"],
              ["/#bundles", "Super Saver Bundles"],
              ["/#offers", "Offers & Stay Rewards"],
              ["/reviews", "Customer Reviews"],
              ["/contact", "Visit Our Studio"],
              ["/about", "Our Story"],
              ["/account", "My Bookings"],
            ].map(([url, label]) => (
              <Link
                href={url}
                key={url}
                onClick={(e) => {
                  setMenu(false);
                  if (
                    url.startsWith("/#") &&
                    typeof window !== "undefined" &&
                    (window.location.pathname === "/" ||
                      window.location.pathname === "")
                  ) {
                    const id = url.replace("/#", "");
                    const el = document.getElementById(id);
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {label}
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content">{children}</main>
      <footer className="pet-footer">
        <div className="pet-container pet-footer-grid">
          <div>
            <Link href="/" className="pet-brand">
              <img
                src="/logo.png"
                alt="Snip & Style Pet Resort & Grooming"
                className="pet-brand-logo-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/logo.png";
                }}
              />
              <span className="pet-brand-title">
                Snip &amp; Style
                <small>Pet boarding &amp; grooming studio</small>
              </span>
            </Link>
            <p>
              Grooming, boarding, and plenty of love.
              <br />
              Kanakapura Main Road, Bengaluru.
            </p>
          </div>
          <div>
            <strong>Come say hello</strong>
            <p>
              Site no. 61, Kanakapura Main Road
              <br />
              Beside Shani Mahatma Temple, Bengaluru 560082
              <br />
              <small style={{ opacity: 0.8 }}>
                Ample dedicated parking outside
              </small>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                marginTop: "6px",
              }}
            >
              <a
                href="https://maps.app.goo.gl/MqFTrZiLPbttv3eD6"
                target="_blank"
                rel="noreferrer"
              >
                Google Maps directions ↗
              </a>
              <a
                href="https://wa.me/919739887770?text=Hi%2C%20I%20would%20like%20to%20schedule%20a%20studio%20visit%20at%20Snip%20%26%20Style!"
                target="_blank"
                rel="noreferrer"
              >
                Schedule studio visit ↗
              </a>
            </div>
          </div>
          <div>
            <strong>Here for you &amp; your pet</strong>
            <p>09:30 AM – 08:30 PM · 7 Days a Week</p>
            <a href="tel:+919739887770">+91 9739887770</a>
            <br />
            <a href="mailto:Snip&style857@gmail.com">
              Snip&amp;style857@gmail.com
            </a>
            <br />
            <a
              href="https://wa.me/919739887770"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp ↗
            </a>
          </div>
        </div>
        <div className="pet-container pet-footer-bottom">
          <span>
            © {new Date().getFullYear()} Snip & Style. Made for happy paws.
          </span>
          <div>
            <Link href="/safety">Pet safety</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function OrderSummary({
  items,
  children,
}: {
  items: BookingItem[];
  children?: React.ReactNode;
}) {
  const quote = quoteCart(items);
  return (
    <aside className="pet-summary">
      <div className="pet-summary-heading">
        <Icon name="bag" />
        <h2>Your booking summary</h2>
      </div>
      <div className="pet-summary-lines">
        {quote.lines.map((line) => (
          <div className="pet-summary-line" key={line.item.id}>
            <div>
              <strong>
                {line.name}
                {line.item.quantity > 1 ? ` × ${line.item.quantity}` : ""}
              </strong>
              <small>
                {line.item.petType === "cat"
                  ? "Cat"
                  : line.item.category === "boarding" ? SIZE_LABELS[line.item.petSize] : `${line.item.petSize} breed`}
                {line.item.category === "boarding"
                  ? ` · ${line.item.nights} nights`
                  : ""}
              </small>
              {line.extras > 0 && <small>Includes selected extras</small>}
            </div>
            <b>{money(line.total)}</b>
          </div>
        ))}
      </div>
      <div className="pet-total-rows">
        <div>
          <span>Services</span>
          <span>{money(quote.base)}</span>
        </div>
        {quote.extras > 0 && (
          <div>
            <span>Extras</span>
            <span>{money(quote.extras)}</span>
          </div>
        )}
        {quote.discount > 0 && (
          <div className="pet-green">
            <span>Festival offers</span>
            <span>−{money(quote.discount)}</span>
          </div>
        )}
        <div className="pet-grand-total">
          <strong>Total to pay</strong>
          <strong>{money(quote.total)}</strong>
        </div>
      </div>
      {quote.savings > 0 && (
        <div className="pet-savings">
          <Icon name="sparkle" size={17} />
          You’re saving {money(quote.savings)} on advertised rates
        </div>
      )}
      {children}
      <p className="pet-summary-help">
        <Icon name="shield" size={16} /> Secure payment through Razorpay
      </p>
      <a className="pet-help-link" href="tel:+919739887770">
        Need a hand? Call our studio ↗
      </a>
    </aside>
  );
}
