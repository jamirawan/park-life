import { useState, useRef, useEffect } from "react";

const COLORS = {
  ochre: "#C1440E",
  rust: "#9B3409",
  amber: "#E07B1A",
  gold: "#F2A83B",
  dusk: "#2B3A4E",
  sky: "#4A7FA5",
  teal: "#1E6B6B",
  offwhite: "#FAFAF8",
  alert: "#D64000",
  parksOrange: "#BC5915",
  parkAccent: "#1A7A5E",
  parkMid: "#25A07A",
  parkLight: "#4DC4A0",
};

const styles = {
  body: {
    minHeight: "100vh",
    background: "#1A2E25",
    backgroundImage: `
      radial-gradient(ellipse 90% 50% at 50% 0%, rgba(26,122,94,0.35) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(43,58,78,0.6) 0%, transparent 60%)
    `,
    fontFamily: "'Barlow', sans-serif",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px 16px 40px",
    overflowX: "hidden",
  },
  card: {
    width: "100%",
    maxWidth: 800,
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: `0 8px 60px rgba(0,0,0,0.6), 0 2px 0 ${COLORS.parkAccent}`,
    position: "relative",
    animation: "lift 0.6s cubic-bezier(0.22,1,0.36,1) both",
  },
  parksStrip: {
    background: "white",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 10px",
  },
  parksLogo: {
    background: "white",
    maxHeight: 80,
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 2,
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  parksLogoImg: { maxHeight: 80, padding: 1 },
  pipe: { width: 1, height: 16, background: "#ccc" },
  dept: {
    color: COLORS.parksOrange,
    fontSize: "1.5rem",
    letterSpacing: "0.05em",
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  hero: {
    backgroundImage:
      "url(https://a.storyblok.com/f/286255898790625/5164x3867/b84e3f4997/arial-view-of_wangi_falls_in_litchfield.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "70vh",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
  },
  heroInner: { padding: "28px 28px 12px", position: "relative", zIndex: 1 },
  heroTitle: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: "clamp(32px,8vw,44px)",
    fontWeight: 800,
    color: "white",
    background: "rgba(2,1,1,0.468)",
    letterSpacing: "0.03em",
    lineHeight: 0.95,
    marginBottom: 6,
    padding: 10,
  },
  heroTitleSub: {
    display: "block",
    fontSize: "clamp(14px,3vw,18px)",
    fontWeight: 400,
    color: "white",
    letterSpacing: "0.08em",
    marginTop: 4,
    background: "rgba(2,1,1,0.468)",
    padding: 10,
  },
  heroDesc: {
    color: "white",
    fontSize: 12.5,
    fontWeight: 300,
    background: "rgba(2,1,1,0.468)",
    lineHeight: 1.55,
    marginBottom: 14,
    maxWidth: 340,
    padding: 10,
  },
  signalBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: COLORS.parkAccent,
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 0,
    padding: 20,
    marginBottom: 6,
    cursor: "pointer",
  },
  sigDot: {
    width: 15,
    height: 15,
    borderRadius: "50%",
    background: "red",
    animation: "sigpulse 2s ease-in-out infinite",
  },
  signalLink: { color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textDecoration: "none" },
  bodySection: { background: COLORS.offwhite },
  faq: { padding: 20 },
  faqH2: { marginBottom: 20 },
  accordion: {
    backgroundColor: "#eee",
    color: "#444",
    cursor: "pointer",
    padding: 18,
    width: "100%",
    border: "none",
    textAlign: "left",
    outline: "none",
    fontSize: 15,
    transition: "0.4s",
    marginBottom: 2,
  },
  accordionActive: { backgroundColor: "#ccc" },
  panel: {
    padding: "0 18px",
    background: "white",
    overflow: "hidden",
    fontSize: 14,
    lineHeight: 1.6,
    color: "#555",
    paddingTop: 12,
    paddingBottom: 12,
  },
  termsSection: { padding: "0 20px 14px", marginTop: 6 },
  termsH2: { marginBottom: 12 },
  termsBox: {
    background: "white",
    border: "1px solid rgba(0,0,0,0.09)",
    borderRadius: 2,
    height: "50vh",
    overflowY: "auto",
    padding: "14px 16px",
    marginBottom: 8,
    scrollBehavior: "smooth",
    fontSize: 12,
    lineHeight: 1.65,
    color: "#000",
  },
  scrollNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    fontSize: 10.5,
    color: "#000",
    marginBottom: 12,
    transition: "opacity 0.3s",
  },
  emailLabel: { display: "block", marginBottom: 6, fontSize: 14 },
  emailInput: {
    padding: "10px 14px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 16,
    width: 300,
  },
  acceptRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 11,
    padding: "13px 14px",
    background: "white",
    border: "1.5px solid rgba(0,0,0,0.09)",
    borderRadius: 2,
    cursor: "pointer",
    transition: "all 0.18s",
    marginBottom: 12,
  },
  acceptRowChecked: {
    borderColor: COLORS.parkAccent,
    background: "rgba(26,122,94,0.04)",
  },
  chk: {
    width: 20,
    height: 20,
    border: "2px solid #ccc",
    borderRadius: 2,
    background: "white",
    flexShrink: 0,
    marginTop: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s",
  },
  chkChecked: { background: COLORS.parkAccent, borderColor: COLORS.parkAccent },
  acceptLabel: { fontSize: 12.5, color: "#444", lineHeight: 1.5, cursor: "pointer" },
  connectSection: { padding: "0 20px 20px" },
  btnConnect: {
    width: "100%",
    padding: 16,
    background: COLORS.parkAccent,
    backgroundImage: `linear-gradient(135deg,#0F4A38,${COLORS.parkAccent})`,
    color: "white",
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    border: "none",
    borderRadius: 2,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(26,122,94,0.4)",
    marginBottom: 8,
    transition: "all 0.18s",
  },
  btnConnectDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  portalFooter: {
    background: COLORS.dusk,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  footerBrand: {
    fontFamily: "'Barlow Condensed', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.1em",
  },
  footerLinks: { display: "flex", gap: 14 },
  footerLink: { fontSize: 10.5, color: "rgba(255,255,255,0.38)", textDecoration: "none" },
  successOverlay: {
    position: "fixed",
    inset: 0,
    background: COLORS.offwhite,
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "40px 32px",
    textAlign: "center",
    transition: "opacity 0.4s",
  },
  successIcon: {
    width: 68,
    height: 68,
    background: COLORS.parkAccent,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    animation: "popIn 0.5s cubic-bezier(0.22,1,0.36,1) both 0.1s",
  },
};

const FAQ_ITEMS = [
  {
    question: "Is swimming safe at Wangi Falls?",
    answer:
      "Swimming conditions at Wangi Falls can change, especially during the wet season when crocodiles may be present or water levels are unsafe. Always check the current notices at the entry station or ranger office before swimming.",
  },
  {
    question: "Are there camping facilities nearby?",
    answer:
      "Yes — Wangi Falls has a campground with powered and unpowered sites, amenities blocks, and BBQ areas. Bookings can be made through the NT Parks & Wildlife website. Peak season (May–October) fills up fast.",
  },
  {
    question: "What walking tracks are available?",
    answer:
      "Two main tracks: the Wangi Falls Loop (3.8 km, 1.5 hrs) through monsoon forest and sandstone escarpment, and the shorter Wangi Waterfall Lookout track. Both are well-marked and suitable for most fitness levels.",
  },
];

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 2 }}>
      <button
        style={{ ...styles.accordion, ...(open ? styles.accordionActive : {}) }}
        onClick={() => setOpen((o) => !o)}
      >
        {question}
      </button>
      {open && <div style={styles.panel}>{answer}</div>}
    </div>
  );
}

export default function WangiFallsPortal() {
  const [accepted, setAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const termsRef = useRef(null);

  useEffect(() => {
    const el = termsRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  function doConnect() {
    if (!accepted) return;
    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "https://northernterritory.com/promotions/wifi/wangi";
    }, 3000);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
        @keyframes lift { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes sigpulse{0%,100%{box-shadow:0 0 0 0 rgba(220,115,45,0.6);}50%{box-shadow:0 0 0 5px rgba(95,208,104,0);}}
        @keyframes popIn{from{opacity:0;transform:scale(0.4);}to{opacity:1;transform:scale(1);}}
        @keyframes blink{0%,80%,100%{opacity:0;}40%{opacity:1;}}
        .footer-link-hover:hover { color: #F2A83B !important; }
        .btn-connect-hover:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(26,122,94,0.5) !important; transform: translateY(-1px); }
      `}</style>

      <div style={styles.body}>
        <div style={styles.card}>

          {/* Success Overlay */}
          {showSuccess && (
            <div style={styles.successOverlay}>
              <div style={styles.successIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.dusk, letterSpacing: "0.04em", marginBottom: 10 }}>
                You're connected!
              </h2>
              <p style={{ fontSize: 13.5, color: "#000", lineHeight: 1.6 }}>
                Welcome to Wangi Falls.<br />
                Enjoy the plunge pools and stay safe — always check swimming conditions.
              </p>
              <p style={{ fontSize: 16, color: "red", marginTop: 18 }}>
                Redirecting<span style={{ animation: "blink 1.2s infinite" }}>.</span>
                <span style={{ animation: "blink 1.2s infinite", animationDelay: "0.2s" }}>.</span>
                <span style={{ animation: "blink 1.2s infinite", animationDelay: "0.4s" }}>.</span>
              </p>
            </div>
          )}

          {/* Parks Strip */}
          <div style={styles.parksStrip}>
            <div style={styles.parksLogo}>
              <img src="/park-life/park-1/parks-wildlife-logo.png" style={styles.parksLogoImg} alt="Parks & Wildlife NT logo" />
            </div>
            <div style={styles.pipe} />
            <div style={styles.dept}>Parks &amp; Wildlife</div>
          </div>

          {/* Hero */}
          <div style={styles.hero}>
            <div style={styles.heroInner}>
              <h1 style={styles.heroTitle}>
                Wangi Falls
                <span style={styles.heroTitleSub}>Litchfield National Park</span>
              </h1>
              <p style={styles.heroDesc}>
                Welcome to one of the Top End's most iconic waterfalls. Connect for park maps, trail info, campsite bookings and road conditions.
              </p>
              <div style={styles.signalBadge} onClick={() => document.getElementById("acceptRow")?.scrollIntoView({ behavior: "smooth" })}>
                <div style={styles.sigDot} />
                <span style={styles.signalLink}>Connect to Wi-Fi</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={styles.bodySection}>

            {/* FAQ */}
            <section style={styles.faq}>
              <h2 style={styles.faqH2}>Frequently asked information</h2>
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} question={item.question} answer={item.answer} />
              ))}
            </section>

            {/* Terms */}
            <div style={styles.termsSection}>
              <h2 style={styles.termsH2}>Terms of use — Guest wi-fi</h2>
              <div ref={termsRef} style={styles.termsBox}>
                <p>
                  Welcome to the Parks and Wildlife NT Guest WiFi. By selecting Accept or Get Online, you agree to be bound by these terms.
                  This service is provided by the Northern Territory Government  as a free public amenity.
                </p>
                <ol style={{ paddingLeft: 16, marginTop: 10 }}>
                  {[
                    {
                      title: "Access and use",
                      body: "Availability: The service is provided "as is" and may be unavailable at certain times due to maintenance, power outages, or operational requirements. Usage Limits: Access may be subject to data volume or time limits to ensure fair use for all visitors. Security: This is an open, non-secure network. You are responsible for maintaining your own device security.",
                    },
                    {
                      title: "Prohibited Activities",
                      body: "You must not use this service for illegal acts, sustained high-volume data transfers, accessing or distributing offensive or infringing material, or introducing viruses or malware.",
                    },
                    {
                      title: "Privacy and Data Collection",
                      body: "By using this service, you consent to collection of certain data (such as device MAC addresses and connection logs). All personal information is handled in accordance with the NT Information Act and the NTG Privacy Policy.",
                    },
                    {
                      title: "Limitation of liability and security",
                      body: "The Northern Territory Government and its partners (including Encapto) are not liable for any loss of data, unauthorized access to your device, or damages resulting from your use of this service.",
                    },
                  ].map((item, i) => (
                    <li key={i} style={{ marginBottom: 12 }}>
                      <strong>{item.title}</strong>
                      <br />
                      {item.body}
                    </li>
                  ))}
                </ol>
                <p style={{ fontSize: 10.5, color: "#000", marginTop: 14 }}>
                  Parks and Wildlife Commission NT · Terms updated March 2026 · Subject to legal review.
                </p>
              </div>

              <div style={{ ...styles.scrollNote, opacity: scrolled ? 0 : 1 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Scroll to read full terms
              </div>

              {/* Email */}
              <div style={{ margin: "16px 0" }}>
                <label htmlFor="email" style={styles.emailLabel}>
                  Email address <span style={{ opacity: 0.6 }}>(optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.emailInput}
                />
              </div>

              {/* Accept row */}
              <div
                id="acceptRow"
                style={{ ...styles.acceptRow, ...(accepted ? styles.acceptRowChecked : {}) }}
                onClick={() => setAccepted((a) => !a)}
              >
                <div style={{ ...styles.chk, ...(accepted ? styles.chkChecked : {}) }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: accepted ? 1 : 0, transform: accepted ? "scale(1)" : "scale(0.3)", transition: "all 0.18s" }}>
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <label style={styles.acceptLabel}>
                  I have read and agree to the{" "}
                  <strong style={{ color: COLORS.parkAccent }}>Terms of Use</strong> for the NT Parks &amp; Wildlife Guest Wi-Fi network.
                </label>
              </div>
            </div>

            {/* Connect button */}
            <div style={styles.connectSection}>
              <button
                className="btn-connect-hover"
                style={{ ...styles.btnConnect, ...(accepted ? {} : styles.btnConnectDisabled) }}
                disabled={!accepted}
                onClick={doConnect}
              >
                Connect to Wi-Fi
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.portalFooter}>
            <span style={styles.footerBrand}>Parks &amp; Wildlife Commission NT</span>
            <div style={styles.footerLinks}>
              <a href="https://nt.gov.au/parks" style={styles.footerLink} className="footer-link-hover">Parks and reserves website</a>
              <a href="https://northernterritory.com" style={styles.footerLink} className="footer-link-hover">Visit the NT</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}