"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });
  const [resultMsg, setResultMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function showNotice(type, text) {
    setNotice({ type, text });
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotice("error", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    showNotice("info", "Sending login link…");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.msg || data.message || "Failed to send link");
      }
      showNotice("success", data.msg || "Login link sent. Check your inbox/spam.");
      setStep(2);
    } catch (err) {
      showNotice("error", err.message || "Failed to send link. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!link.trim()) {
      showNotice("error", "Paste the Alight Creative link first.");
      return;
    }
    if (!email.trim()) {
      showNotice("error", "Email missing. Go back to step 1.");
      setStep(1);
      return;
    }
    setLoading(true);
    showNotice("info", "Verifying link…");
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), link: link.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.msg || data.message || "Verification failed");
      }
      setResultMsg(
        data.msg ||
          "Pro license activated on your account. Open Alight Motion and enjoy premium features."
      );
      showNotice("success", data.msg || "Activation successful!");
      setStep(3);
    } catch (err) {
      showNotice("error", err.message || "Verification failed. Make sure the link is still valid.");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setEmail("");
    setLink("");
    setNotice({ type: "", text: "" });
    setResultMsg("");
    setStep(1);
  }

  const year = new Date().getFullYear();

  return (
    <>
      <header className="topbar wrap">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="AlightPro home">
            <img
              className="logo-img"
              src="/logo-alightpro.jpg"
              alt="AlightPro"
              width={54}
              height={54}
            />
            <div>
              <div className="brand-name">AlightPro</div>
              <div className="brand-sub">ALIGHT MOTION VERIFIER</div>
            </div>
            <span className="pro-pill">✦ PRO 1 YR</span>
          </a>
          <div className="nav-right">
            <button
              className="menu-btn"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
            <div className={`menu-pop ${menuOpen ? "open" : ""}`}>
              <a href="#verify" onClick={() => setMenuOpen(false)}>
                Start Verification
              </a>
              <a href="#features" onClick={() => setMenuOpen(false)}>
                Premium Features
              </a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>
                FAQ
              </a>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About AlightPro
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="wrap" id="home">
        <section className="hero hero-single">
          <div className="reveal">
            <div className="eyebrow">✧ Alight Creative Verification Platform</div>
            <h1>
              Activate <span className="highlight">Alight Motion Pro</span> for 1 Year.
            </h1>
            <p className="lead">
              Enjoy premium video editing features. Enter your Alight Motion account email,
              receive the official login link, then paste it to activate Pro.
            </p>
            <div className="trust-row">
              <span className="trust">◇ No Password</span>
              <span className="trust">◈ Secure Verification Flow</span>
            </div>
          </div>
        </section>

        <section className="section section-verify-top" id="verify">
          <div className="section-head">
            <div className="eyebrow">✧ Activation Panel</div>
            <h2>Pro Verification Panel</h2>
            <p>
              Three-step flow: send email → paste Alight Creative link → activate Pro.
            </p>
          </div>
          <div className="info-grid">
            <section className="panel">
              <div className="panel-title">
                <div className="dots">
                  <i className="dot" />
                  <i className="dot" />
                  <i className="dot" />
                </div>
                <h3>ACCOUNT VERIFICATION</h3>
                <span className="status-pill live" style={{ marginLeft: "auto" }}>
                  ● LIVE
                </span>
              </div>
              <div className="steps" role="tablist" aria-label="Verification steps">
                <button
                  type="button"
                  className={`step-tab ${step === 1 ? "active" : ""}`}
                  onClick={() => setStep(1)}
                >
                  1. Email
                </button>
                <button
                  type="button"
                  className={`step-tab ${step === 2 ? "active" : ""}`}
                  onClick={() => setStep(2)}
                >
                  2. Paste Link
                </button>
                <button
                  type="button"
                  className={`step-tab ${step === 3 ? "active" : ""}`}
                  onClick={() => setStep(3)}
                >
                  3. Result
                </button>
              </div>

              {step === 1 && (
                <form onSubmit={handleSend} noValidate>
                  <label className="field-label" htmlFor="email">
                    ACCOUNT EMAIL ADDRESS
                  </label>
                  <input
                    className="email-input"
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="e.g. you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="help-text">
                    We will send an official login link to this email. Make sure it matches
                    the one registered in Alight Motion.
                  </p>
                  <button className="primary-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner" /> Sending…
                      </>
                    ) : (
                      <>
                        Send Login Link <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {step === 2 && (
                <div>
                  <label className="field-label" htmlFor="oob">
                    PASTE ALIGHT CREATIVE LINK
                  </label>
                  <input
                    className="email-input"
                    type="url"
                    id="oob"
                    placeholder="Paste the link from the official email"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                  <p className="help-text">
                    Open the email from Alight Motion, copy the login link, then paste it
                    here. Never share this link with anyone.
                  </p>
                  <button
                    className="primary-btn"
                    type="button"
                    onClick={handleVerify}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" /> Verifying…
                      </>
                    ) : (
                      <>
                        Verify & Activate Pro <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div style={{ textAlign: "center" }}>
                  <div className="feature-icon" style={{ margin: "0 auto 16px" }}>
                    ✓
                  </div>
                  <h3 style={{ margin: "0 0 10px" }}>Activation Successful</h3>
                  <p className="help-text" style={{ textAlign: "center" }}>
                    {resultMsg ||
                      "Pro license has been activated on your account. Open Alight Motion and enjoy premium features."}
                  </p>
                  <button className="secondary-btn" type="button" onClick={handleRestart}>
                    Start over
                  </button>
                </div>
              )}

              {notice.text && (
                <div className={`notice ${notice.type} show`} role="status">
                  {notice.text}
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-head">
            <div className="eyebrow">✧ Alight Motion Pro Benefits</div>
            <h2>
              All Premium Features
              <br />
              <span className="highlight">in One View</span>
            </h2>
            <p>
              Designed with pastel palette, rounded shapes, clear contrast, and transparent
              glass effects.
            </p>
          </div>
          <div className="feature-grid">
            <article className="glass-card feature-card">
              <div className="feature-icon">✧</div>
              <h3>No Watermark</h3>
              <p>
                Export videos without the Alight Motion watermark. Clean output for
                professional content.
              </p>
              <div className="included">✓ Pro feature active</div>
            </article>
            <article className="glass-card feature-card">
              <div className="feature-icon">⌘</div>
              <h3>Presets & XML</h3>
              <p>
                Full access to presets, XML projects, and advanced tools for a faster editing
                workflow.
              </p>
              <div className="included">✓ Responsive cards</div>
            </article>
            <article className="glass-card feature-card">
              <div className="feature-icon">▱</div>
              <h3>High-Quality Export</h3>
              <p>
                High resolution, stable frame rates, and premium export options for maximum
                quality.
              </p>
              <div className="included">✓ Mobile-first layout</div>
            </article>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-head">
            <div className="eyebrow">✧ Frequently Asked Questions</div>
            <h2>FAQ & Important Info</h2>
            <p>Details about activation and security.</p>
          </div>
          <div className="faq-list">
            <details className="faq">
              <summary>How does activation work?</summary>
              <p>
                Enter your Alight Motion account email → the system sends an official login
                link → paste the Alight Creative link → Pro license is activated for 1 year
                on your account.
              </p>
            </details>
            <details className="faq">
              <summary>Do I need to enter my password?</summary>
              <p>
                No. This flow uses the official Alight Motion login link. You never need to
                enter your password anywhere.
              </p>
            </details>
            <details className="faq">
              <summary>How long does it take?</summary>
              <p>
                Usually 1–3 minutes. After the email arrives, copy the link and paste it in
                step 2. Keep a stable connection during verification.
              </p>
            </details>
            <details className="faq">
              <summary>Is my data safe?</summary>
              <p>
                Requests go through the official verification flow. Never share the login
                link or authentication codes with anyone else.
              </p>
            </details>
          </div>
        </section>

        <footer id="about">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="brand" href="#home">
                <img
                  className="logo-img"
                  src="/logo-alightpro.jpg"
                  alt="AlightPro"
                  width={54}
                  height={54}
                />
                <div>
                  <div className="brand-name">AlightPro</div>
                  <div className="brand-sub">ALIGHT MOTION VERIFIER</div>
                </div>
                <span className="pro-pill">PRO 1 YR</span>
              </a>
              <p className="footer-desc">
                Alight Motion Pro verification platform with a Liquid Glass interface.
                Activation follows the official flow without storing passwords.
              </p>
            </div>
            <div className="footer-col">
              <h4>QUICK NAV</h4>
              <a href="#verify">Start Verification</a>
              <a href="#features">Features</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h4>INFO</h4>
              <a href="#about">About AlightPro</a>
              <a href="#faq">Security & Privacy</a>
              <a href="#verify">Activation Panel</a>
            </div>
          </div>

          <div className="developer-bar">
            <img
              className="dev-logo"
              src="/logo-developer.jpg"
              alt="SALVEC7K"
              width={44}
              height={44}
            />
            <div className="dev-text">
              <span className="dev-label">Developed by</span>
              <span className="dev-name">SALVEC7K</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {year} AlightPro</span>
            <span>Liquid Glass · Built with Next.js & React</span>
          </div>
        </footer>
      </main>
    </>
  );
}
