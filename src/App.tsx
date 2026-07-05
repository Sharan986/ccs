import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { ScrambleIn } from './components/ScrambleIn';
import ScrambledText from './components/ScrambledText';
import { CCSLogo } from './components/CCSLogo';
import ChromaGrid from './components/ChromaGrid';
import Galaxy from './components/Galaxy';

/* ── CountUp component ─────────────────────────────────────── */
function CountUp({ target, suffix = '', duration = 1800, delay = 0 }: { target: number; suffix?: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let startTime: number | null = null;
    let rafId: number;
    const startDelay = delay;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      if (ref.current) ref.current.textContent = current + suffix;
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => { rafId = requestAnimationFrame(tick); }, startDelay);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [inView, target, suffix, duration, delay]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ── Video URLs ─────────────────────────────────────────────── */
const HERO_VID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4";
const ABOUT_VID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4";
const SOE_VID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4";
const EVENTS_VID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4";
const FOOTER_VID = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4";

/* ── Static Data ────────────────────────────────────────────── */
const MEMBERS = [
  {
    image: 'https://i.pravatar.cc/300?img=8',
    title: 'NA',
    subtitle: 'President',
    handle: '@president',
    borderColor: '#c084fc',
    gradient: 'linear-gradient(145deg, #c084fc22, #000)',
    url: 'https://linkedin.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://example.com'
  },
  {
    image: 'https://i.pravatar.cc/300?img=11',
    title: 'Ankit Singh',
    subtitle: 'Vice President',
    handle: '@ankitsingh',
    borderColor: '#818cf8',
    gradient: 'linear-gradient(165deg, #818cf822, #000)',
    url: 'https://linkedin.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://example.com'
  },
  {
    image: 'https://i.pravatar.cc/300?img=5',
    title: 'Priya Sharma',
    subtitle: 'Tech Lead',
    handle: '@priyasharma',
    borderColor: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa22, #000)',
    url: 'https://github.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://example.com'
  },
  {
    image: 'https://i.pravatar.cc/300?img=16',
    title: 'Ravi Mehta',
    subtitle: 'Event Coordinator',
    handle: '@ravimehta',
    borderColor: '#e879f9',
    gradient: 'linear-gradient(195deg, #e879f922, #000)',
    url: 'https://linkedin.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://example.com'
  },
  {
    image: 'https://i.pravatar.cc/300?img=25',
    title: 'Sneha Das',
    subtitle: 'Design Head',
    handle: '@snehadeas',
    borderColor: '#c084fc',
    gradient: 'linear-gradient(225deg, #c084fc22, #000)',
    url: 'https://github.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://example.com'
  },
  {
    image: 'https://i.pravatar.cc/300?img=60',
    title: 'Vikram Yadav',
    subtitle: 'Secretary',
    handle: '@vikramyadav',
    borderColor: '#818cf8',
    gradient: 'linear-gradient(155deg, #818cf822, #000)',
    url: 'https://linkedin.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    portfolio: 'https://example.com'
  },
];

const EVENTS = [
  { title: "Hackathon 2026", date: "Aug 15 — 16", desc: "48-hour build sprint. Ship or sink." },
  { title: "Code & Coffee", date: "Every Saturday", desc: "Weekly peer-programming sessions over caffeine." },
  { title: "AI Workshop Series", date: "Sep 5 — 20", desc: "From neural nets to deployment — a 3-week deep dive." },
  { title: "Tech Talk: Systems", date: "Oct 12", desc: "Guest lecture on distributed systems at scale." },
];

const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop", caption: "Hackathon 2025" },
  { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop", caption: "Code & Coffee" },
  { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop", caption: "Tech Summit" },
  { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop", caption: "Workshop Day" },
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", caption: "Team Collab" },
  { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop", caption: "Annual Meetup" },
];

/* ================================================================
   APP
   ================================================================ */
function App() {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [showSuggestionsForm, setShowSuggestionsForm] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  /* ── Lenis ref (shared so About can stop/start it) ────────── */
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);

  /* ── About section scroll-lock ─────────────────────────────── */
  const aboutRef = useRef<HTMLDivElement>(null);
  // Manual progress: 0 = text below screen, 1 = text above screen
  const aboutRaw = useMotionValue(0);
  const aboutProgress = useSpring(aboutRaw, { stiffness: 80, damping: 22, mass: 0.6 });
  const yMotionValue = useTransform(aboutProgress, [0, 1], [500, -460]);
  const aboutOpacity = useTransform(aboutProgress, [0, 0.07, 0.88, 1], [0, 1, 1, 0]);
  const transformTpl = useMotionTemplate`rotateX(28deg) translateY(${yMotionValue}px) translateZ(10px)`;

  useEffect(() => {
    if (!entranceComplete) return;

    const STEP = 0.038;
    let active = false;
    // completed=true after animation finishes — blocks re-locking during scrollTo animation
    let completed = false;
    let lastDir = 1;

    /* ── Per-frame detection via Lenis scroll event ──────────────
       Fires every RAF frame while Lenis is running. Stops Lenis
       the instant the about section reaches ≥98% visibility,
       even mid-momentum from a fast flick.                     ── */
    const onLenisScroll = () => {
      if (active || completed || !aboutRef.current) return;
      const rect = aboutRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visiblePx / rect.height >= 0.98) {
        active = true;
        aboutRaw.set(lastDir >= 0 ? 0 : 1);
        lenisRef.current?.stop();
      }
    };

    /* ── Wheel handler: tracks direction + drives progress ──────── */
    const onWheel = (e: WheelEvent) => {
      lastDir = Math.sign(e.deltaY) || lastDir;
      if (!active) return;

      e.preventDefault();
      const next = Math.min(1, Math.max(0, aboutRaw.get() + lastDir * STEP));
      aboutRaw.set(next);

      if (next >= 1 && lastDir > 0) {
        // Text scrolled off top → go to SOE IT
        active = false;
        completed = true; // set BEFORE start() so onLenisScroll ignores the transition
        const soe = document.getElementById('soe-it');
        if (soe) lenisRef.current?.scrollTo(soe, { duration: 0.55 });
        lenisRef.current?.start();
      } else if (next <= 0 && lastDir < 0) {
        // Scrolled back to start → go to hero
        active = false;
        completed = true;
        const home = document.getElementById('home');
        if (home) lenisRef.current?.scrollTo(home, { duration: 0.55 });
        lenisRef.current?.start();
      }
    };

    /* ── IO: reset completed when section fully leaves viewport ─── */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          active = false;
          completed = false;
          lenisRef.current?.start();
        }
      },
      { threshold: 0 }
    );

    const lenis = lenisRef.current;
    lenis?.on('scroll', onLenisScroll);
    if (aboutRef.current) io.observe(aboutRef.current);
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      lenis?.off('scroll', onLenisScroll);
      io.disconnect();
      window.removeEventListener('wheel', onWheel);
      lenisRef.current?.start();
    };
  }, [aboutRaw, entranceComplete]);




  /* ── Lenis + entrance timer ───────────────────────────────── */
  useEffect(() => {
    // Always start at the very top — prevents browser scroll restoration
    // from opening the page mid-scroll and skipping the hero.
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });
    lenisRef.current = lenis;
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    const t = setTimeout(() => setEntranceComplete(true), 800);
    return () => { lenis.destroy(); clearTimeout(t); };
  }, []);

  /* ── Hero video mouse-scrub (rAF-throttled) ────────────────── */
  useEffect(() => {
    let lastX = 0;
    let targetTime = 0;
    let isSeeking = false;
    let rafId = 0;
    let needsSeek = false;
    const sensitivity = 0.8;
    const DEAD_ZONE = 2; // ignore sub-2px movements

    const doSeek = () => {
      rafId = 0;
      const v = heroVideoRef.current;
      if (!v || !needsSeek) return;
      needsSeek = false;
      if (!isSeeking) {
        isSeeking = true;
        v.currentTime = targetTime;
      }
    };

    const onMove = (e: MouseEvent) => {
      const v = heroVideoRef.current;
      if (!v || Number.isNaN(v.duration)) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      if (Math.abs(dx) < DEAD_ZONE) return; // skip tiny jitters
      targetTime = Math.max(0, Math.min(v.duration, targetTime + (dx / window.innerWidth) * v.duration * sensitivity));
      needsSeek = true;
      if (!rafId) rafId = requestAnimationFrame(doSeek);
    };

    const onSeeked = () => {
      const v = heroVideoRef.current;
      if (!v) return;
      if (Math.abs(v.currentTime - targetTime) > 0.05) {
        v.currentTime = targetTime;
      } else {
        isSeeking = false;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    const v = heroVideoRef.current;
    v?.addEventListener('seeked', onSeeked);
    return () => {
      window.removeEventListener('mousemove', onMove);
      v?.removeEventListener('seeked', onSeeked);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── SOE IT Section View Tracking ─────────────────────────── */
  const soeDescRef = useRef(null);
  const soeDescInView = useInView(soeDescRef, { once: true, amount: 0.3 });

  /* ── Suggestion form state ────────────────────────────────── */
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
    setFormData({ name: '', email: '', message: '' });
  };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div
      className="w-full bg-black min-h-screen text-white selection:bg-[var(--color-accent)]/30 selection:text-white"
      style={{ fontFamily: '"Space Mono", monospace' }}
    >
      <Navbar entranceComplete={entranceComplete} />

      {/* ═══════════════════ 1 · HOME ═══════════════════════════ */}
      <section id="home" className="relative w-full h-[100dvh] flex flex-col overflow-hidden">
        {/* Video bg — GPU-composited */}
        <video ref={heroVideoRef} src={HERO_VID} className="absolute inset-0 w-full h-full object-cover z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }} preload="auto" muted playsInline />

        {/* Dot grid — GPU layer */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px', willChange: 'opacity', transform: 'translateZ(0)' }} />

        {/* Watermark — GPU layer */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none mt-[50px] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
          <h2
            className="uppercase font-['Anton_SC'] whitespace-nowrap leading-none select-none opacity-[0.07]"
            style={{
              fontSize: 'clamp(120px, 30vw, 521px)', letterSpacing: '50px',
              background: 'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent',
              willChange: 'opacity',
            }}
          >CCS</h2>
        </div>

        {/* Bottom scrim for text legibility */}
        <div className="absolute bottom-0 left-0 w-full h-[50%] text-scrim-full z-[2] pointer-events-none" />

        {/* Content — sits in lower third of hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full flex flex-col justify-end"
          style={{ height: '100%', paddingBottom: 'clamp(48px, 10vh, 100px)' }}
        >
          {/* 2-col headline grid */}
          <div className="w-full" style={{ paddingLeft: 'clamp(20px, 5vw, 80px)', paddingRight: 'clamp(20px, 5vw, 80px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-end w-full max-w-7xl mx-auto">
              {/* Left: headline + tagline */}
              <div className="flex flex-col gap-4">
                <h1 className="text-white font-light leading-[0.9] tracking-[-0.03em]" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
                  <ScrambledText className="inline-block" scrambleChars="01" delay={200} triggered={entranceComplete}>Code</ScrambledText><br />
                  <ScrambledText className="inline-block" scrambleChars="01" delay={500} triggered={entranceComplete}>And Compute</ScrambledText>
                </h1>
                <div
                  className="text-white/50 leading-relaxed"
                  style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', maxWidth: '36ch' }}
                >
                  <ScrambledText duration={2} delay={800} speed={0.8} radius={60} triggered={entranceComplete} className="inline-block">
                    The official tech club of Arka Jain University's School of Engineering — IT. We build, break, learn, and ship together.
                  </ScrambledText>
                </div>
              </div>

              {/* Right: secondary headline */}
              <div className="text-left md:text-right">
                <h1 className="text-white font-light leading-[0.9] tracking-[-0.03em]" style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}>
                  <ScrambledText className="inline-block" scrambleChars="01" delay={700} triggered={entranceComplete}>One</ScrambledText><br />
                  <ScrambledText className="inline-block" scrambleChars="01" delay={1000} triggered={entranceComplete}>Society</ScrambledText>
                </h1>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entranceComplete ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-indicator"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ 2 · ABOUT ══════════════════════════ */}
      {/* h-[100dvh]: no extra scroll space, no black void.
           Lenis is stopped via JS while the wheel drives aboutRaw 0→1. */}
      <section id="about" ref={aboutRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
        <video src={ABOUT_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        {/* Gradient scrims */}
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#010103] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#010103] to-transparent z-[1] pointer-events-none" />

        <div
          className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-center"
          style={{
            paddingLeft: 'clamp(24px, 6vw, 96px)',
            paddingRight: 'clamp(24px, 6vw, 96px)',
            transformStyle: 'preserve-3d',
            perspective: '220px',
          }}
        >
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
              transform: transformTpl,
              opacity: aboutOpacity,
              fontSize: 'clamp(22px, 3.6vw, 44px)',
            }}
            className="text-center font-bold tracking-tighter text-white font-sans leading-[1.3] select-none w-full"
          >
            Code and Compute Society is a student-led engineering collective at Arka Jain University. We transform raw curiosity into technical fluency — through hackathons, workshops, open-source contributions, and peer-driven learning. Every line of code is a signal. We make it count.
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 3 · SOE IT ═════════════════════════ */}
      <section id="soe-it" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <video src={SOE_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="video-dimmer z-[1]" />

        <div
          className="relative z-10 w-full flex flex-col items-center gap-10"
          style={{ padding: 'clamp(64px, 10vh, 120px) clamp(20px, 5vw, 80px)', maxWidth: 960, margin: '0 auto' }}
        >
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1 }}
            className="text-white/50 tracking-[0.25em] uppercase text-center"
            style={{ fontSize: 13 }}
          >
            School of Engineering — IT
          </motion.p>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {[
              { target: 500, suffix: '+', label: 'Students Enrolled' },
              { target: 12, suffix: '+', label: 'Faculty Members' },
              { target: 30, suffix: '+', label: 'Industry Partners' },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="glass-panel glass-panel-hover flex flex-col items-center justify-center text-center"
                style={{ padding: '32px 24px', gap: 10 }}
              >
                <span className="text-white font-lightp leading-none" style={{ fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '-0.04em' }}>
                  <CountUp target={m.target} suffix={m.suffix} duration={1600} delay={i * 120 + 200} />
                </span>
                <span className="text-white/40 tracking-widest uppercase" style={{ fontSize: 11 }}>{m.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Description card */}
          <motion.div
            ref={soeDescRef}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-panel w-full text-center"
            style={{ padding: '32px 40px' }}
          >
            <div className="text-white/50 leading-relaxed" style={{ fontSize: 'clamp(13px, 1.3vw, 15px)' }}>
              <ScrambledText duration={2.5} delay={800} speed={0.8} radius={60} triggered={soeDescInView} className="inline-block">
                The Department of Information Technology under Arka Jain University's School of Engineering prepares students for careers in software development, data science, cybersecurity, and cloud computing. CCS serves as its flagship technical society.
              </ScrambledText>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 4 · MEMBERS ════════════════════════ */}
      <section id="members" className="w-full bg-black flex flex-col items-center justify-center" style={{ minHeight: '100dvh', padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="w-full flex flex-col items-center gap-12" style={{ maxWidth: 1200, padding: '0 clamp(20px, 5vw, 40px)' }}>
          {/* Heading block */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9 }}
            className="text-center flex flex-col items-center gap-4"
          >
            <p className="text-white/40 tracking-[0.22em] uppercase" style={{ fontSize: 12 }}>Core Team</p>
            <h2 className="text-white font-light leading-tight tracking-tight" style={{ fontSize: 'clamp(26px, 5vw, 52px)' }}>
              The people behind the code.
            </h2>
            <p className="text-white/40 leading-relaxed" style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', maxWidth: '50ch' }}>
              A dedicated team of builders, thinkers, and problem solvers driving the society forward.
            </p>
          </motion.div>

          {/* ChromaGrid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="w-full"
            style={{ minHeight: 520 }}
          >
            <ChromaGrid
              items={MEMBERS}
              radius={320}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
              columns={3}
              rows={2}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5 · EVENTS ═════════════════════════ */}
      <section id="events" className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>
        <video src={EVENTS_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="video-dimmer z-[1]" style={{ background: 'rgba(0,0,0,0.58)' }} />

        <div
          className="relative z-10 w-full flex flex-col gap-10"
          style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(64px,10vh,120px) clamp(20px,5vw,80px)' }}
        >
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              initial={{ y: 32, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9 }}
              className="text-white font-light leading-[0.92] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(36px, 7vw, 72px)' }}
            >
              Upcoming /<br />Events
            </motion.h2>
            <motion.p
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="text-white/50 leading-relaxed md:text-right"
              style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', maxWidth: '30ch' }}
            >
              From hackathons to guest talks — we keep the calendar dense and the energy high.
            </motion.p>
          </div>

          {/* Event cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {EVENTS.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ y: 18, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="glass-panel glass-panel-hover accent-left-border flex flex-col gap-2"
                style={{ padding: '24px 28px', minHeight: 150 }}
              >
                <span
                  className="uppercase tracking-[0.14em]"
                  style={{ fontSize: 11, color: 'var(--color-accent)', opacity: 0.65 }}
                >{ev.date}</span>
                <h4 className="text-white font-normal" style={{ fontSize: 16 }}>{ev.title}</h4>
                <p className="text-white/40 leading-relaxed" style={{ fontSize: 13, marginTop: 'auto' }}>{ev.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6 · GALLERY ════════════════════════ */}
      <section id="gallery" className="w-full bg-black flex flex-col items-center" style={{ minHeight: '100dvh', padding: 'clamp(60px, 8vh, 100px) 0' }}>
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center" style={{ paddingLeft: 'clamp(24px, 6vw, 96px)', paddingRight: 'clamp(24px, 6vw, 96px)' }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0 }}
            className="text-center w-full flex flex-col items-center mb-30 sm:mb-30"
          >
            <p className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-6">Gallery</p>
            <h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-0.02em]">
              Moments captured.
            </h2>
          </motion.div>

          {/* Bento grid: first image large, rest standard */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[260px] pt-4 pb-10"
          >
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, delay: 0.06 * i }}
                className={`group relative overflow-hidden rounded-xl cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Permanent caption scrim */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 pointer-events-none">
                  <span className="text-white/70 text-[12px] sm:text-[14px] font-normal group-hover:text-white transition-colors duration-500">{img.caption}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 7 · SUGGESTIONS ════════════════════ */}
      <section id="suggestions" className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center py-28 sm:py-32 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Galaxy />
        </div>
        <div className="video-dimmer z-[1] pointer-events-none" style={{ background: 'rgba(0,0,0,0.5)' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center pointer-events-none" style={{ paddingLeft: 'clamp(24px, 6vw, 96px)', paddingRight: 'clamp(24px, 6vw, 96px)' }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0 }}
            className="text-center w-full max-w-xl flex flex-col items-center"
          >
            <p className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-6">Suggestions</p>
            <h2 className="text-white font-light text-[clamp(28px,6vw,52px)] leading-[1.15] tracking-[-0.02em] mb-4">
              Shape the society.
            </h2>
            <p className="text-white/40 text-[15px] sm:text-[16px] leading-relaxed max-w-md mx-auto mb-12">
              Got an idea, a complaint, or a workshop you'd love to see? We're listening.
            </p>

            <button
              onClick={() => setShowSuggestionsForm(v => !v)}
              className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs tracking-wide transition-all mb-24 backdrop-blur-md"
            >
              {showSuggestionsForm ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg> Hide Form</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> Write Suggestion</>
              )}
            </button>
          </motion.div>

          {/* Form in glass panel */}
          <AnimatePresence mode="wait">
            {showSuggestionsForm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="glass-panel w-full max-w-lg pointer-events-auto"
                style={{ padding: '36px 40px 40px', marginTop: 64 }}
              >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', paddingLeft: 6 }}>Name</label>
                    <input
                      type="text" placeholder="Your name" required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', paddingLeft: 6 }}>Email</label>
                    <input
                      type="email" placeholder="you@university.edu" required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', paddingLeft: 6 }}>Message</label>
                    <textarea
                      placeholder="Your suggestion or idea..." required rows={5}
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      className="form-input form-textarea"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(192, 132, 252, 0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', height: 52, borderRadius: 12, marginTop: 8, border: 'none',
                      background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))',
                      color: '#fff', fontSize: 15, fontFamily: '"Space Mono", monospace',
                      fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    {formSubmitted ? '✓  Sent successfully' : 'Submit Suggestion'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═════════════════════════════ */}
      <footer className="w-full bg-black overflow-hidden border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left: video */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
            <video src={FOOTER_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Right: content */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-8 px-8 py-10 sm:px-14 sm:py-14 lg:px-20 lg:py-16">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex items-center gap-2.5">
                <CCSLogo className="w-[18px] h-[18px] text-white/60" />
                <span className="text-white/60 text-[15px] font-medium tracking-tight">CCS</span>
              </div>
              <p className="text-white/35 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
                Code and Compute Society — the tech club of Arka Jain University. Built for those who refuse to be limited by the classroom alone.
              </p>

              {/* Footer nav links */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {['About', 'Events', 'Gallery', 'Suggestions'].map(link => (
                  <button
                    key={link}
                    onClick={() => {
                      const target = link.toLowerCase();
                      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white/25 hover:text-white/50 text-[13px] tracking-wide transition-colors"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-white/20 text-[12px] text-center">
              © {new Date().getFullYear()} Code and Compute Society, Arka Jain University. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
