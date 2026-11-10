"use client";

import { useEffect, useState } from "react";

const LOGO = "https://i.imgur.com/jzNGlRj.png";

function pickMsg(d) {
  return (d && (d.message || d.msg || d.error || d.detail)) || "";
}
function isOk(d) {
  return d && (d.status === true || d.success === true || d.ok === true) && !d.error;
}
function validEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

async function api(path, body) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const t = await r.text();
  let d;
  try {
    d = JSON.parse(t);
  } catch {
    d = { status: false, msg: t.slice(0, 200) };
  }
  if (!r.ok && typeof d === "object") d.httpStatus = r.status;
  return d;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState({
    k: "idle",
    msg: "Belum ada proses. Mulai dari langkah aktivasi di atas.",
    data: null,
  });
  const year = new Date().getFullYear();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("am_email");
      if (saved) setEmail(saved);
    } catch {}
  }, []);

  function applyState(k, msg, data) {
    setState({ k, msg, data: data ?? null });
  }

  async function run(path, body, okText) {
    setBusy(true);
    document.getElementById("hasil")?.scrollIntoView({ behavior: "smooth" });
    try {
      applyState("load", "Mengirim permintaan…");
      const d = await api(path, body);
      const ok = isOk(d);
      applyState(
        ok ? "ok" : "err",
        pickMsg(d) || (ok ? okText : "Server menolak permintaan."),
        d
      );
      return ok;
    } catch (e) {
      const m =
        e.message === "Failed to fetch"
          ? "Gagal terhubung ke server. Coba refresh halaman."
          : e.message;
      applyState("err", m, { error: e.message });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function onSend() {
    const e = email.trim();
    if (!validEmail(e)) {
      alert("Isi email yang valid dulu.");
      return;
    }
    try {
      localStorage.setItem("am_email", e);
    } catch {}
    await run("/api/send", { email: e }, "Link terkirim! Cek inbox / spam email kamu.");
  }

  async function onVerify() {
    const e = email.trim();
    const l = link.trim();
    if (!validEmail(e)) {
      alert("Isi email di langkah 1 dulu.");
      return;
    }
    if (!/^https?:\/\//.test(l)) {
      alert("Tempel link lengkap dari email (diawali https://).");
      return;
    }
    await run("/api/verify", { email: e, link: l }, "Akun Alight Motion kamu sudah Premium!");
  }

  async function onPaste() {
    try {
      setLink((await navigator.clipboard.readText()).trim());
    } catch {
      alert("Izin clipboard ditolak. Tempel manual ya.");
    }
  }

  const boxClass =
    "result-box" +
    (state.k === "ok" ? " is-ok" : "") +
    (state.k === "err" ? " is-err" : "");
  const icon =
    state.k === "ok" ? "✓" : state.k === "err" ? "✕" : state.k === "load" ? "…" : "○";
  const badgeText = {
    idle: "MENUNGGU",
    load: "PROSES…",
    ok: "PREMIUM AKTIF",
    err: "GAGAL",
  }[state.k];

  return (
    <>
      <header className="top wrap">
        <nav className="nav">
          <a className="brand" href="#top">
            <img className="logo" src={LOGO} alt="AlightPro" />
            <div>
              <div className="brandname">AlightPro</div>
              <div className="sub">ALIGHT MOTION EXPERIENCE</div>
            </div>
            <span className="pill">PRO</span>
          </a>
          <div style={{ position: "relative" }}>
            <button
              className="menu"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
            <div className={"pop" + (menuOpen ? " open" : "")}>
              <a href="#aktivasi" onClick={() => setMenuOpen(false)}>
                Aktivasi
              </a>
              <a href="#hasil" onClick={() => setMenuOpen(false)}>
                Hasil
              </a>
              <a href="#tentang" onClick={() => setMenuOpen(false)}>
                Tentang
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="wrap" id="top">
        <section className="hero">
          <div className="eyebrow">ALIGHT MOTION</div>
          <h1>
            Aktivasi premium
            <br />
            <span className="highlight">lebih cepat.</span>
          </h1>
          <p className="lead">
            Masukkan email, tempel link verifikasi dari inbox, lalu lihat hasilnya. Tiga
            langkah, tanpa ribet.
          </p>
        </section>

        <section className="section" id="aktivasi">
          <div className="head">
            <div className="eyebrow">LANGKAH UTAMA</div>
            <h2>Panel Aktivasi</h2>
            <p>Isi email dan tempel link dari Alight Creative.</p>
          </div>

          <div className="panel">
            <div className="paneltop">
              <i className="dot" />
              <i className="dot" />
              <i className="dot" />
              <strong>ALIGHTPRO DASHBOARD</strong>
              <span className="live">● LIVE</span>
            </div>

            <div>
              <label htmlFor="email">Email Alight Motion</label>
              <input
                id="email"
                type="email"
                inputMode="email"
                placeholder="email@gmail.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="hint">
                Link login akan dikirim ke email ini. Cek juga folder Spam.
              </p>
              <div className="row">
                <button className="btn" disabled={busy} onClick={onSend}>
                  Kirim Link ke Email
                </button>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: "1px solid #c9d5e4",
              }}
            >
              <label htmlFor="link">Link dari email (Alight Creative)</label>
              <textarea
                id="link"
                placeholder="https://alightcreative.com/..."
                spellCheck={false}
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <p className="hint">Salin seluruh link dari email, jangan diklik dulu.</p>
              <div className="row">
                <button className="btn pk" disabled={busy} onClick={onVerify}>
                  Verifikasi
                </button>
                <button className="btn alt" type="button" onClick={onPaste}>
                  Tempel dari Clipboard
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="hasil">
          <div className="head">
            <div className="eyebrow">STATUS</div>
            <h2>Hasil Aktivasi</h2>
          </div>
          <div className="panel">
            <div className={boxClass}>
              <div className="result-icon">{icon}</div>
              <span className={"badge " + state.k}>{badgeText}</span>
              <div className="result-msg">{state.msg}</div>
              {state.k === "err" && state.data != null && (
                <pre>
                  {typeof state.data === "string"
                    ? state.data
                    : JSON.stringify(state.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </section>

        <section className="section" id="tentang">
          <div className="head">
            <div className="eyebrow">INFO</div>
            <h2>Tentang Website</h2>
          </div>
          <div className="card">
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--muted)",
                marginBottom: 14,
              }}
            >
              API by:{" "}
              <strong>api.jaky.dev</strong>
            </p>
            <div className="grid3">
              <div className="mini">
                <h4>1. Kirim</h4>
                <p>Email dikirim lewat API, link login masuk ke inbox.</p>
              </div>
              <div className="mini">
                <h4>2. Tempel</h4>
                <p>Salin link dari email dan tempel di form.</p>
              </div>
              <div className="mini">
                <h4>3. Verifikasi</h4>
                <p>Link diverifikasi dan status muncul di kotak Hasil.</p>
              </div>
              <div className="mini">
                <h4>API by</h4>
                <p>Jaky.dev</p>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="dev">
            <img src={LOGO} alt="cryfsall" />
            <div>
              <small>DEVELOPED BY</small>
              <b>cryfsall</b>
            </div>
          </div>
          <div className="bottom">
            <span>© {year} AlightPro</span>
            <span>Next.js · React · Node.js</span>
          </div>
        </footer>
      </main>
    </>
  );
}
