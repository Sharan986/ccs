import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { ScrambleIn } from './components/ScrambleIn';
import { CCSLogo } from './components/CCSLogo';

/* ── Video URLs ─────────────────────────────────────────────── */
const HERO_VID    = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4";
const ABOUT_VID   = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4";
const SOE_VID     = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4";
const EVENTS_VID  = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4";
const FOOTER_VID  = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4";

/* ── Static Data ────────────────────────────────────────────── */
const MEMBERS = [
  { name: "Sharan Kumar",   role: "President",         initial: "SK" },
  { name: "Ankit Singh",    role: "Vice President",    initial: "AS" },
  { name: "Priya Sharma",   role: "Tech Lead",         initial: "PS" },
  { name: "Ravi Mehta",     role: "Event Coordinator", initial: "RM" },
  { name: "Sneha Das",      role: "Design Head",       initial: "SD" },
  { name: "Vikram Yadav",   role: "Secretary",         initial: "VY" },
];

const EVENTS = [
  { title: "Hackathon 2026",     date: "Aug 15 — 16",   desc: "48-hour build sprint. Ship or sink." },
  { title: "Code & Coffee",      date: "Every Saturday", desc: "Weekly peer-programming sessions over caffeine." },
  { title: "AI Workshop Series", date: "Sep 5 — 20",    desc: "From neural nets to deployment — a 3-week deep dive." },
  { title: "Tech Talk: Systems", date: "Oct 12",        desc: "Guest lecture on distributed systems at scale." },
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
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  /* ── Cinematic scroll for About ───────────────────────────── */
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const yTransform      = useTransform(smoothProgress, [0, 1], [60, -120]);
  const transformTpl    = useMotionTemplate`rotateX(24deg) translateY(${yTransform}px) translateZ(15px)`;
  const aboutOpacity    = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);

  /* ── Lenis + entrance timer ───────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });
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
      className="w-full bg-black min-h-screen text-white overflow-x-hidden selection:bg-[var(--color-accent)]/30 selection:text-white"
      style={{ fontFamily: '"Space Mono", monospace' }}
    >
      <Navbar entranceComplete={entranceComplete} />

      {/* ═══════════════════ 1 · HOME ═══════════════════════════ */}
      <section id="home" className="relative w-full h-[100dvh] flex flex-col">
        {/* Video bg — GPU-composited */}
        <video ref={heroVideoRef} src={HERO_VID} className="absolute inset-0 w-full h-full object-cover z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }} preload="auto" muted playsInline />

        {/* Dot grid — GPU layer */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px', willChange: 'opacity', transform: 'translateZ(0)' }} />

        {/* Watermark — GPU layer */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none mt-[50px] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
          <h2
            className="uppercase font-['Anton_SC'] whitespace-nowrap leading-none select-none opacity-[0.07]"
            style={{
              fontSize: 'clamp(120px, 30vw, 521px)', letterSpacing: '-4px',
              background: 'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent',
              willChange: 'opacity',
            }}
          >TRANSCENDENCE</h2>
        </div>

        {/* Bottom scrim for text legibility */}
        <div className="absolute bottom-0 left-0 w-full h-[50%] text-scrim-full z-[2] pointer-events-none" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex-1 flex flex-col w-full h-full pt-20 sm:pt-24 pb-8 sm:pb-12 px-6 sm:px-8 md:px-12"
        >
          <div className="flex-1" />

          {/* Strict 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end w-full">
            {/* Left: primary headline + desc */}
            <div className="flex flex-col gap-5">
              <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(44px,10vw,100px)]">
                <ScrambleIn text="Code" delay={200} triggered={entranceComplete} /><br />
                <ScrambleIn text="And Compute" delay={500} triggered={entranceComplete} />
              </h1>
              <motion.p
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: entranceComplete ? 0 : 25, opacity: entranceComplete ? 1 : 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.610, 0.355, 1.000] }}
                className="max-w-sm text-[13px] sm:text-[15px] text-white/55 leading-relaxed"
              >
                The official tech club of Arka Jain University's School of Engineering — IT. We build, break, learn, and ship together.
              </motion.p>
            </div>

            {/* Right: secondary headline */}
            <div className="text-left md:text-right">
              <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(44px,10vw,100px)]">
                <ScrambleIn text="One" delay={700} triggered={entranceComplete} /><br />
                <ScrambleIn text="Society" delay={1000} triggered={entranceComplete} />
              </h1>
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
      <section id="about" ref={aboutRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
        <video src={ABOUT_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        {/* Top + bottom gradient scrims */}
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#010103] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#010103] to-transparent z-[1] pointer-events-none" />

        <div className="relative z-20 max-w-5xl px-6 sm:px-12 w-full flex justify-center" style={{ perspective: '400px' }}>
          <motion.p
            style={{ transform: transformTpl, opacity: aboutOpacity, textShadow: '0 0 80px rgba(0,0,0,0.6)' }}
            className="font-sans font-normal text-[22px] sm:text-[30px] md:text-[36px] lg:text-[42px] text-white leading-[1.35] tracking-[-0.02em] select-none text-center"
          >
            Code and Compute Society is a student-led engineering collective at Arka Jain University. We transform raw curiosity into technical fluency — through hackathons, workshops, open-source contributions, and peer-driven learning. Every line of code is a signal. We make it count.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════ 3 · SOE IT ═════════════════════════ */}
      <section id="soe-it" className="relative w-full min-h-screen flex flex-col items-center justify-center py-28 sm:py-32 px-6">
        <video src={SOE_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="video-dimmer z-[1]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="text-white/50 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-16 text-center"
          >
            School of Engineering — IT
          </motion.p>

          {/* Stats cards in glass panels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full max-w-4xl">
            {[
              { value: "500+",  label: "Students Enrolled" },
              { value: "12+",   label: "Faculty Members" },
              { value: "30+",   label: "Industry Partners" },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="glass-panel glass-panel-hover p-8 sm:p-10 text-center flex flex-col items-center"
              >
                <h3 className="text-white text-[clamp(48px,10vw,80px)] font-light tracking-[-0.04em] leading-none">{m.value}</h3>
                <p className="text-white/40 text-[13px] sm:text-[14px] mt-4 tracking-wide">{m.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Department description in glass panel */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="glass-panel mt-5 p-8 sm:p-10 max-w-4xl w-full text-center"
          >
            <p className="text-white/50 text-[14px] sm:text-[15px] leading-relaxed">
              The Department of Information Technology under Arka Jain University's School of Engineering prepares students for careers in software development, data science, cybersecurity, and cloud computing. CCS serves as its flagship technical society.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 4 · MEMBERS ════════════════════════ */}
      <section id="members" className="w-full min-h-screen bg-black flex flex-col items-center justify-center px-6 py-28 sm:py-32">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0 }}
          className="text-center w-full max-w-6xl flex flex-col items-center"
        >
          <p className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-6">Core Team</p>
          <h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-0.02em] mb-5">
            The people behind the code.
          </h2>
          <p className="text-white/40 text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto mb-16">
            A dedicated team of builders, thinkers, and problem solvers driving the society forward.
          </p>
        </motion.div>

        {/* Member cards — expanded grid with horizontal layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl"
        >
          {MEMBERS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ y: 25, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.08 * i }}
              className="glass-panel glass-panel-hover p-5 sm:p-6 flex items-center gap-5"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <span className="text-white/50 text-[17px] sm:text-[20px] font-light tracking-widest">{m.initial}</span>
              </div>
              {/* Info */}
              <div className="flex flex-col min-w-0">
                <h4 className="text-white text-[15px] sm:text-[16px] font-normal mb-1 truncate">{m.name}</h4>
                <p className="text-white/35 text-[12px] sm:text-[13px] tracking-wide">{m.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ 5 · EVENTS ═════════════════════════ */}
      <section id="events" className="relative w-full min-h-[100dvh] flex flex-col px-6 sm:px-10 md:px-16 py-16 sm:py-20 overflow-hidden">
        <video src={EVENTS_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="video-dimmer z-[1]" style={{ background: 'rgba(0,0,0,0.55)' }} />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6 w-full mb-12 sm:mb-16">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
            className="text-white font-light text-[clamp(36px,8vw,72px)] leading-[0.95] tracking-[-0.03em]"
          >
            Upcoming /<br />Events
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
          >
            From hackathons to guest talks — we keep the calendar dense and the energy high.
          </motion.p>
        </div>

        {/* Event cards in glass panels */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-auto">
          {EVENTS.map((ev, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
              className="glass-panel glass-panel-hover accent-left-border p-5 sm:p-6 flex flex-col"
            >
              <span className="text-[var(--color-accent)]/60 text-[11px] sm:text-[12px] tracking-[0.15em] uppercase mb-3">{ev.date}</span>
              <h4 className="text-white text-[15px] sm:text-[17px] font-normal mb-2">{ev.title}</h4>
              <p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed">{ev.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ 6 · GALLERY ════════════════════════ */}
      <section id="gallery" className="w-full min-h-screen bg-black flex flex-col items-center px-6 py-28 sm:py-32">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0 }}
          className="text-center w-full max-w-6xl flex flex-col items-center mb-12 sm:mb-16"
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
          className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-6xl auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[260px]"
        >
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.7, delay: 0.06 * i }}
              className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                i === 0 ? 'col-span-2 row-span-2' : ''
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
      </section>

      {/* ═══════════════════ 7 · SUGGESTIONS ════════════════════ */}
      <section id="suggestions" className="w-full min-h-screen bg-black flex flex-col items-center justify-center px-6 py-28 sm:py-32">
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
        </motion.div>

        {/* Form in glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="glass-panel p-8 sm:p-12 w-full max-w-xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 text-[11px] tracking-[0.12em] uppercase">Name</label>
              <input
                type="text" placeholder="Your name" required
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 text-[11px] tracking-[0.12em] uppercase">Email</label>
              <input
                type="email" placeholder="you@university.edu" required
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 text-[11px] tracking-[0.12em] uppercase">Message</label>
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
              className="w-full h-14 rounded-xl text-white text-[15px] font-medium tracking-tight mt-2 transition-shadow"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))' }}
            >
              {formSubmitted ? '✓  Sent successfully' : 'Submit Suggestion'}
            </motion.button>
          </form>
        </motion.div>
      </section>

      {/* ═══════════════════ FOOTER ═════════════════════════════ */}
      <footer className="w-full bg-black overflow-hidden border-t border-white/[0.06]">
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left: video */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
            <video src={FOOTER_VID} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Right: content */}
          <div className="w-full md:w-1/2 flex flex-col justify-between p-10 sm:p-16">
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <CCSLogo className="w-[18px] h-[18px] text-white/60" />
                <span className="text-white/60 text-[15px] font-medium tracking-tight">CCS</span>
              </div>
              <p className="text-white/35 text-[14px] sm:text-[15px] leading-relaxed max-w-sm mb-10">
                Code and Compute Society — the tech club of Arka Jain University. Built for those who refuse to be limited by the classroom alone.
              </p>

              {/* Footer nav links */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
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

            <div className="mt-12 text-white/20 text-[12px]">
              © {new Date().getFullYear()} Code and Compute Society, Arka Jain University. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
