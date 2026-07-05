import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BlackHole from '../components/BlackHole';
import { CCSLogo } from '../components/CCSLogo';

const GOOGLE_SHEET_ID = import.meta.env.ENV_GOOGLE_SHEET_ID;
const GOOGLE_SHEET_URL = `https://script.google.com/macros/s/${GOOGLE_SHEET_ID}/exec`;

interface Member { name: string; phone: string; email: string; }
const blank = (): Member => ({ name: '', phone: '', email: '' });

function Field({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 42, background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
          padding: '0 13px', color: '#fff', fontSize: 12,
          fontFamily: '"Space Mono",monospace', outline: 'none', width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(192,132,252,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.1)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function MemberRow({ title, data, onChange }: {
  title: string; data: Member;
  onChange: (f: keyof Member, v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(192,132,252,0.6)' }}>{title}</p>
      <Field label="Full Name" value={data.name} onChange={v => onChange('name', v)} placeholder="Full name" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Field label="Phone" type="tel" value={data.phone} onChange={v => onChange('phone', v)} placeholder="+91 00000 00000" />
        <Field label="Email" type="email" value={data.email} onChange={v => onChange('email', v)} placeholder="you@uni.edu" />
      </div>
    </div>
  );
}

const STEPS = ['Team Info', 'Leader', 'Members', 'Confirm'];

export default function HackathonPage() {
  const navigate = useNavigate();
  const [cardVisible, setCardVisible] = useState(true);
  const [step, setStep] = useState(-1); // -1 = pre-start, 0..3 = form steps, 4 = success
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState({
    teamName: '', collegeName: '',
    leader: blank(),
    m1: blank(), m2: blank(), m3: blank(),
    extraCount: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };

  const setLeader = (f: keyof Member, v: string) => setForm(p => ({ ...p, leader: { ...p.leader, [f]: v } }));
  const setM = (which: 'm1' | 'm2' | 'm3', f: keyof Member, v: string) =>
    setForm(p => ({ ...p, [which]: { ...p[which], [f]: v } }));

  const submit = async () => {
    setSubmitting(true); setError(null);
    const extra = [form.m1, form.m2, form.m3].slice(0, form.extraCount);
    const payload = {
      timestamp: new Date().toISOString(),
      teamName: form.teamName, collegeName: form.collegeName,
      leaderName: form.leader.name, leaderPhone: form.leader.phone, leaderEmail: form.leader.email,
      ...Object.fromEntries(extra.flatMap((m, i) => [
        [`member${i + 1}Name`, m.name], [`member${i + 1}Phone`, m.phone], [`member${i + 1}Email`, m.email],
      ])),
    };
    try {
      if (GOOGLE_SHEET_URL === 'PASTE_YOUR_WEBAPP_URL_HERE') await new Promise(r => setTimeout(r, 1200));
      else await fetch(GOOGLE_SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      go(4);
    } catch { setError('Submission failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
  };

  const renderStepContent = () => {
    if (step === -1) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, textAlign: 'center', padding: '0 8px' }}>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
          Click <strong style={{ color: 'rgba(192,132,252,0.7)' }}>Register</strong> above to begin
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{i + 1}</div>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );

    if (step === 4) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(192,132,252,0.2)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div>
          <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 300, color: '#fff' }}>Registered!</h3>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{form.teamName}</strong> is in.<br />
            Check {form.leader.email} for confirmation.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={() => navigate('/')} style={ghostBtn}>Back to Home</button>
          <button onClick={() => { setStep(-1); setForm({ teamName: '', collegeName: '', leader: blank(), m1: blank(), m2: blank(), m3: blank(), extraCount: 1 }); }} style={accentBtn}>
            New Registration
          </button>
        </div>
      </div>
    );

    if (step === 0) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RowLabel n={1} label="Team Info" />
        <Field label="Team Name" value={form.teamName} onChange={v => setForm(p => ({ ...p, teamName: v }))} placeholder="Team Singularity" />
        <Field label="College / University" value={form.collegeName} onChange={v => setForm(p => ({ ...p, collegeName: v }))} placeholder="Arka Jain University" />
      </div>
    );

    if (step === 1) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <RowLabel n={2} label="Team Leader" />
        <MemberRow title="Leader" data={form.leader} onChange={setLeader} />
      </div>
    );

    if (step === 2) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RowLabel n={3} label="Additional Members" />
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            {[1, 2, 3].map(n => (
              <button key={n} type="button" onClick={() => setForm(p => ({ ...p, extraCount: n }))} style={{
                width: 26, height: 26, borderRadius: 7, fontSize: 11, cursor: 'pointer',
                fontFamily: '"Space Mono",monospace', transition: 'all 0.2s',
                background: form.extraCount === n ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${form.extraCount === n ? 'rgba(192,132,252,0.45)' : 'rgba(255,255,255,0.09)'}`,
                color: form.extraCount === n ? '#c084fc' : 'rgba(255,255,255,0.3)',
              }}>{n}</button>
            ))}
          </div>
        </div>
        <MemberRow title="Member 2" data={form.m1} onChange={(f, v) => setM('m1', f, v)} />
        {form.extraCount >= 2 && <MemberRow title="Member 3" data={form.m2} onChange={(f, v) => setM('m2', f, v)} />}
        {form.extraCount >= 3 && <MemberRow title="Member 4" data={form.m3} onChange={(f, v) => setM('m3', f, v)} />}
      </div>
    );

    if (step === 3) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RowLabel n={4} label="Confirm" />
        {[
          ['Team', form.teamName],
          ['College', form.collegeName],
          ['Leader', `${form.leader.name} · ${form.leader.email}`],
          ...Array.from({ length: form.extraCount }, (_, i) => {
            const m = [form.m1, form.m2, form.m3][i];
            return [`Member ${i + 2}`, `${m.name} · ${m.email}`];
          }),
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>{k}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', textAlign: 'right', wordBreak: 'break-all' }}>{v || '—'}</span>
          </div>
        ))}
        {error && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,100,100,0.8)', background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}
      </div>
    );

    return null;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center,#0a0a1a 0%,#000002 70%)', fontFamily: '"Space Mono",monospace', overflow: 'hidden' }}>
      {/* black hole — always fills screen, always interactive outside card */}
      <BlackHole />

      {/* top-left logo */}
      <div style={{ position: 'fixed', top: 16, left: 20, zIndex: 300 }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', color: '#fff' }}>
          <CCSLogo className="w-4 h-4 text-white" />
          <span style={{ fontSize: 13 }}>CCS</span>
        </button>
      </div>

      {/* top-right toggle */}
      <div style={{ position: 'fixed', top: 16, right: 20, zIndex: 300 }}>
        <motion.button
          onClick={() => setCardVisible(v => !v)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px',
            background: cardVisible ? 'rgba(192,132,252,0.14)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${cardVisible ? 'rgba(192,132,252,0.35)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 10, cursor: 'pointer',
            color: cardVisible ? 'rgba(220,200,255,0.9)' : 'rgba(255,255,255,0.6)',
            fontSize: 12, backdropFilter: 'blur(10px)', transition: 'all 0.3s',
            fontFamily: '"Space Mono",monospace',
          }}
        >
          {cardVisible
            ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg> Hide Form</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> Register</>
          }
        </motion.button>
      </div>

      {/* centered card */}
      <AnimatePresence>
        {cardVisible && (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none', /* pass clicks to black hole outside card */
            }}
          >
            <div style={{
              pointerEvents: 'auto', /* card itself captures events */
              width: 'min(92vw, 500px)',
              height: 'min(88vh, 640px)',
              background: 'rgba(7,7,18,0.82)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>

              {/* ── TOP HALF: hero info ──────────────────── */}
              <div style={{
                flex: '0 0 46%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '20px 28px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'linear-gradient(180deg, rgba(192,132,252,0.04) 0%, transparent 100%)',
                position: 'relative',
              }}>
                {/* subtle accent glow */}
                <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <p style={{ margin: '0 0 10px', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(192,132,252,0.7)' }}>
                  CCS · Hackathon 2026
                </p>
                <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#fff' }}>
                  Register Your Team
                </h1>
                <p style={{ margin: '0 0 18px', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                  48 hours · August 15–16<br />
                  Arka Jain University · Teams of up to 4
                </p>

                {step === -1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(192,132,252,0.35)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => go(0)}
                    style={{ ...accentBtn, padding: '10px 32px', borderRadius: 50, fontSize: 12 }}
                  >
                    Register
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </motion.button>
                ) : step < 4 ? (
                  /* step progress dots when form is active */
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {STEPS.map((_, i) => (
                      <div key={i} style={{
                        width: i === step ? 22 : 6, height: 6, borderRadius: 3,
                        background: i === step ? 'linear-gradient(90deg,#c084fc,#818cf8)' : i < step ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.12)',
                        transition: 'all 0.35s ease',
                      }} />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* ── BOTTOM HALF: form steps ──────────────── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* scrollable step area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 8px', scrollbarWidth: 'none' }}>
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* nav row */}
                {step >= 0 && step < 4 && (
                  <div style={{ flexShrink: 0, padding: '10px 24px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button onClick={() => go(step > 0 ? step - 1 : -1)} style={ghostBtn}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                      {step === 0 ? 'Back' : 'Prev'}
                    </button>

                    {step < 3 ? (
                      <button onClick={() => go(step + 1)} style={accentBtn}>
                        Next
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    ) : (
                      <button onClick={submit} disabled={submitting} style={{ ...accentBtn, opacity: submitting ? 0.65 : 1, cursor: submitting ? 'not-allowed' : 'pointer', minWidth: 90, justifyContent: 'center' }}>
                        {submitting
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                          : null}
                        {submitting ? 'Sending…' : 'Submit →'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } *::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}

function RowLabel({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#c084fc' }}>{n}</div>
      <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, fontSize: 11,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)',
  color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontFamily: '"Space Mono",monospace',
};
const accentBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 9, fontSize: 11,
  background: 'linear-gradient(135deg,#c084fc,#818cf8)', border: 'none',
  color: '#fff', cursor: 'pointer', fontFamily: '"Space Mono",monospace',
};
